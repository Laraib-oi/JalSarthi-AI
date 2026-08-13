import { NextResponse } from "next/server";

import { getCityMonitorConfig } from "@/lib/city-monitor/config";
import { analyzeConfiguredCity, CityIssueScreeningError } from "@/lib/city-monitor/analysis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnalyzeRequest = {
  cityId?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  maxImages?: unknown;
};

function noStoreJson(body: object, init?: ResponseInit) {
  return NextResponse.json(body, { ...init, headers: { "Cache-Control": "no-store" } });
}

function isDateOnly(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function parseRequest(value: unknown): { cityId: string; startDate?: string; endDate?: string; maxImages?: number } | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const body = value as AnalyzeRequest;
  const allowedKeys = new Set(["cityId", "startDate", "endDate", "maxImages"]);
  if (Object.keys(body).some((key) => !allowedKeys.has(key)) || typeof body.cityId !== "string" || !body.cityId.trim()) return undefined;
  if (body.startDate !== undefined && !isDateOnly(body.startDate)) return undefined;
  if (body.endDate !== undefined && !isDateOnly(body.endDate)) return undefined;
  if (body.startDate !== undefined && body.endDate !== undefined && body.startDate > body.endDate) return undefined;
  if (body.maxImages !== undefined && (typeof body.maxImages !== "number" || !Number.isInteger(body.maxImages) || body.maxImages < 1 || body.maxImages > 20)) return undefined;
  return { cityId: body.cityId, startDate: body.startDate, endDate: body.endDate, maxImages: body.maxImages };
}

export async function POST(request: Request) {
  let body: { cityId: string; startDate?: string; endDate?: string; maxImages?: number } | undefined;
  try {
    body = parseRequest(await request.json());
  } catch {
    return noStoreJson({ error: "INVALID_REQUEST" }, { status: 400 });
  }
  if (!body) return noStoreJson({ error: "INVALID_REQUEST" }, { status: 400 });
  if (!getCityMonitorConfig(body.cityId)) return noStoreJson({ error: "UNKNOWN_CITY" }, { status: 400 });

  try {
    const result = await analyzeConfiguredCity(body);
    return noStoreJson({ city: { id: body.cityId, name: getCityMonitorConfig(body.cityId)?.name ?? body.cityId }, ...result });
  } catch (error) {
    if (error instanceof CityIssueScreeningError && error.code === "INVALID_LIMIT") {
      return noStoreJson({ error: "INVALID_LIMIT" }, { status: 400 });
    }
    return noStoreJson({ error: "CITY_MONITOR_UNAVAILABLE" }, { status: 502 });
  }
}
