import { NextResponse } from "next/server";

import { getCityMonitorConfig } from "@/lib/city-monitor/config";
import {
  DEMONSTRATION_DATASET_ID,
  DEMONSTRATION_DATASET_SIZE,
  loadDemonstrationDataset,
} from "@/lib/city-monitor/simulation";

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
  if (body.scenarioId !== undefined && body.scenarioId !== DEMONSTRATION_DATASET_ID)
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
    const city = getCityMonitorConfig(body.cityId)!;
    const result = await loadDemonstrationDataset(city);
    return noStoreJson({
      source: "DEMONSTRATION_SIMULATION",
      dataset: DEMONSTRATION_DATASET_ID,
      total: result.total,
      loaded: result.loaded,
      duplicate: result.duplicate,
      uniqueMinistryRecords: result.total,
      expectedDatasetSize: DEMONSTRATION_DATASET_SIZE,
      byCategory: result.byCategory,
    });
  } catch {
    return noStoreJson({ error: "DEMONSTRATION_UNAVAILABLE" }, { status: 502 });
  }
}
