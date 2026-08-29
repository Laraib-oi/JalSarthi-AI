import "server-only";

export type DemonstrationTimestamps = {
  discoveredAt: string;
  analyzedAt: string;
  receivedAt: string;
};

const DEMONSTRATION_START_MS = Date.parse("2025-12-01T00:00:00.000Z");
const DEMONSTRATION_NOW_MS = Date.parse("2026-08-14T23:59:00.000Z");
const MINUTE_MS = 60 * 1_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
type TimestampPhase = "discovered" | "analyzed" | "received";
const timestampCache: Record<TimestampPhase, Map<number, number>> = {
  discovered: new Map(),
  analyzed: new Map(),
  received: new Map(),
};

function mix(value: number): number {
  let result = value | 0;
  result = Math.imul(result ^ (result >>> 16), 0x45d9f3b);
  result = Math.imul(result ^ (result >>> 16), 0x45d9f3b);
  return (result ^ (result >>> 16)) >>> 0;
}

function stableIndex(scenarioId: string): number {
  const match = /^lucknow-monitor-(\d{3})$/.exec(scenarioId);
  if (match) return Math.max(0, Number(match[1]) - 1);

  let seed = 0;
  for (const character of scenarioId) {
    seed = Math.imul(seed ^ character.charCodeAt(0), 16777619);
  }
  return mix(seed) % 120;
}

function rawTimestamp(index: number, phase: TimestampPhase): number {
  const primary = mix(index + 0x13579bdf);
  const secondary = mix(index + 0x2468ace0);
  const tertiary = mix(index + 0x0f1e2d3c);

  if (phase === "discovered") {
    // The final 18 records are clustered in August; the rest span December
    // through early August without forming a predictable daily sequence.
    const dayOffset = index >= 102 ? 249 + primary % 4 : primary % 249;
    const minuteOfDay = secondary % (24 * 60);
    const second = tertiary % 60;
    return DEMONSTRATION_START_MS + dayOffset * DAY_MS + minuteOfDay * MINUTE_MS + second * 1_000;
  }

  const discoveredAt = timestampForIndex(index, "discovered");
  if (phase === "analyzed") {
    const analysisDelay = (20 + secondary % (16 * 60)) * MINUTE_MS;
    return discoveredAt + analysisDelay;
  }

  const analyzedAt = timestampForIndex(index, "analyzed");
  const forwardingDelay = (2 * 60 + tertiary % (4 * 24 * 60)) * MINUTE_MS;
  return Math.min(analyzedAt + forwardingDelay, DEMONSTRATION_NOW_MS - index * 1_000);
}

function timestampForIndex(index: number, phase: TimestampPhase): number {
  const cached = timestampCache[phase].get(index);
  if (cached !== undefined) return cached;

  let candidate = rawTimestamp(index, phase);
  const previous = new Set<number>();
  for (let previousIndex = 0; previousIndex < index; previousIndex += 1) {
    previous.add(timestampForIndex(previousIndex, phase));
  }

  // Collisions are unlikely with the seeded day/time fields, but resolving
  // them makes uniqueness an explicit invariant of the demonstration data.
  while (previous.has(candidate)) candidate -= 1_000;
  timestampCache[phase].set(index, candidate);
  return candidate;
}

export function getDemonstrationTimestamps(scenarioId: string): DemonstrationTimestamps {
  const index = stableIndex(scenarioId);
  return {
    discoveredAt: new Date(timestampForIndex(index, "discovered")).toISOString(),
    analyzedAt: new Date(timestampForIndex(index, "analyzed")).toISOString(),
    receivedAt: new Date(timestampForIndex(index, "received")).toISOString(),
  };
}
