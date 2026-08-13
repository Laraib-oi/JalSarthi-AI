import { NextResponse } from "next/server";

import { forwardToMinistry, MinistryIntakeError, MINISTRY_INTAKE_NAME } from "@/lib/ministry/intake";
import { getMinistryIssueStore } from "@/lib/ministry/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type IntakeRequest = { cityIssueId?: unknown };

function noStoreJson(body: object, init?: ResponseInit) {
  return NextResponse.json(body, { ...init, headers: { "Cache-Control": "no-store" } });
}

function parseRequest(value: unknown): { cityIssueId: string } | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const body = value as IntakeRequest;
  const keys = Object.keys(body);
  if (keys.length !== 1 || keys[0] !== "cityIssueId" || typeof body.cityIssueId !== "string" || !body.cityIssueId.trim()) return undefined;
  return { cityIssueId: body.cityIssueId };
}

export async function POST(request: Request) {
  let body: { cityIssueId: string } | undefined;
  try {
    body = parseRequest(await request.json());
  } catch {
    return noStoreJson({ error: "INVALID_REQUEST" }, { status: 400 });
  }
  if (!body) return noStoreJson({ error: "INVALID_REQUEST" }, { status: 400 });

  try {
    const result = forwardToMinistry(body.cityIssueId);
    return noStoreJson({
      success: result.success,
      duplicate: result.duplicate,
      ministryIssueId: result.issue.ministryIssueId,
      status: result.issue.status,
      priority: result.issue.priority,
      source: result.issue.source,
    });
  } catch (error) {
    if (error instanceof MinistryIntakeError) {
      const safeError =
        error.code === "INVALID_ISSUE_ID" ? "INVALID_CITY_ISSUE_ID" :
        error.code === "ISSUE_NOT_FOUND" ? "CITY_ISSUE_NOT_FOUND" : "CITY_ISSUE_NOT_ACCEPTED";
      const status = error.code === "ISSUE_NOT_ACCEPTED" ? 409 : 400;
      return noStoreJson({ error: safeError, intake: MINISTRY_INTAKE_NAME }, { status });
    }
    return noStoreJson({ error: "MINISTRY_INTAKE_UNAVAILABLE" }, { status: 502 });
  }
}

export function GET() {
  const store = getMinistryIssueStore();
  return noStoreJson({
    intake: MINISTRY_INTAKE_NAME,
    source: "CITY_MONITOR",
    supportedSources: ["KARTAVIEW_CITY_MONITOR", "DEMONSTRATION_SIMULATION"],
    summary: store.summary(),
    issues: store.list(),
  });
}
