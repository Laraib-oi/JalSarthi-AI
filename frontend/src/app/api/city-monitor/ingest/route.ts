import { NextResponse } from "next/server";

import { getCityMonitorConfig } from "@/lib/city-monitor/config";
import { CityMonitorIngestionError, ingestConfiguredCity } from "@/lib/city-monitor/ingestion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type IngestRequest = {
  cityId?: unknown;
  startDate?: unknown;
  endDate?: unknown;
};

function noStoreJson(body: object, init?: ResponseInit) {
  return NextResponse.json(body, { ...init, headers: { "Cache-Control": "no-store" } });
}

function isDateOnly(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function parseRequest(value: unknown): { cityId: string; startDate?: string; endDate?: string } | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const body = value as IngestRequest;
  const keys = Object.keys(body);
  if (!keys.includes("cityId") || keys.some((key) => !["cityId", "startDate", "endDate"].includes(key))) return undefined;
  if (typeof body.cityId !== "string" || !body.cityId.trim()) return undefined;
  if (body.startDate !== undefined && !isDateOnly(body.startDate)) return undefined;
  if (body.endDate !== undefined && !isDateOnly(body.endDate)) return undefined;
  if (body.startDate !== undefined && body.endDate !== undefined && body.startDate > body.endDate) return undefined;
  return { cityId: body.cityId, startDate: body.startDate, endDate: body.endDate };
}

export async function POST(request: Request) {
  let body: { cityId: string; startDate?: string; endDate?: string } | undefined;
  try {
    body = parseRequest(await request.json());
  } catch {
    return noStoreJson({ error: "INVALID_REQUEST" }, { status: 400 });
  }
  if (!body) return noStoreJson({ error: "INVALID_REQUEST" }, { status: 400 });

  try {
    const stats = await ingestConfiguredCity(body.cityId, { startDate: body.startDate, endDate: body.endDate });
    const city = getCityMonitorConfig(body.cityId);
    return noStoreJson({ city: { id: city?.id ?? body.cityId, name: city?.name ?? body.cityId }, ...stats });
  } catch (error) {
    if (error instanceof CityMonitorIngestionError) {
      const status = error.code === "INVALID_CITY" || error.code === "INVALID_WINDOW" ? 400 : 502;
      const safeError = error.code === "INVALID_CITY" ? "UNKNOWN_CITY" : error.code === "INVALID_WINDOW" ? "INVALID_DATE_WINDOW" : error.code === "PROVIDER_INVALID_RESPONSE" ? "KARTAVIEW_INVALID_RESPONSE" : "KARTAVIEW_UNAVAILABLE";
      return noStoreJson({ error: safeError }, { status });
    }
    return noStoreJson({ error: "INGESTION_UNAVAILABLE" }, { status: 502 });
  }
}
