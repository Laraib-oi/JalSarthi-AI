import { NextResponse } from "next/server";

import { getCityMonitorConfig } from "@/lib/city-monitor/config";
import { runDemonstrationDetection } from "@/lib/city-monitor/analysis";
import { DEMONSTRATION_SCENARIO_ID } from "@/lib/city-monitor/simulation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStoreJson(body: object, init?: ResponseInit) {
  return NextResponse.json(body, { ...init, headers: { "Cache-Control": "no-store" } });
}

function parseRequest(
  value: unknown
): { cityId: string; scenarioId?: string } | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const body = value as { cityId?: unknown; scenarioId?: unknown };
  const keys = Object.keys(body);
  if (
    !keys.includes("cityId") ||
    keys.some((key) => key !== "cityId" && key !== "scenarioId")
  )
    return undefined;
  if (typeof body.cityId !== "string" || !body.cityId.trim()) return undefined;
  if (body.scenarioId !== undefined && body.scenarioId !== DEMONSTRATION_SCENARIO_ID)
    return undefined;
  return { cityId: body.cityId, scenarioId: body.scenarioId };
}

export async function POST(request: Request) {
  let body: { cityId: string; scenarioId?: string } | undefined;
  try {
    body = parseRequest(await request.json());
  } catch {
    return noStoreJson({ error: "INVALID_REQUEST" }, { status: 400 });
  }
  if (!body) return noStoreJson({ error: "INVALID_REQUEST" }, { status: 400 });
  if (!getCityMonitorConfig(body.cityId))
    return noStoreJson({ error: "UNKNOWN_CITY" }, { status: 400 });

  try {
    const result = await runDemonstrationDetection(body.cityId);
    return noStoreJson({
      source: "DEMONSTRATION_SIMULATION",
      // The screening path forwards accepted issues automatically. The
      // runner's result distinguishes a first detection from a repeat; the
      // second lookup below is intentionally idempotent.
      duplicate: result.result === "duplicate",
      event: result.event,
      detection: {
        detected: result.issue.analysis.detected,
        category: result.issue.analysis.category,
        confidence: result.issue.analysis.confidence,
        description: result.issue.analysis.description,
        evidence: result.issue.analysis.evidence,
      },
      cityIssue: {
        issueId: result.issue.issueId,
        sourceImageId: result.issue.sourceImageId,
        latitude: result.issue.latitude,
        longitude: result.issue.longitude,
        analyzedAt: result.issue.analyzedAt,
      },
      ministry: {
        ministryIssueId: result.ministry.issue.ministryIssueId,
        status: result.ministry.issue.status,
        priority: result.ministry.issue.priority,
        source: result.ministry.issue.source,
      },
    });
  } catch {
    return noStoreJson({ error: "DEMONSTRATION_UNAVAILABLE" }, { status: 502 });
  }
}
