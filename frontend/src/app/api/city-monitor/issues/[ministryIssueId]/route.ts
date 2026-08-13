import { NextResponse } from "next/server";

import { getMinistryIssueStore } from "@/lib/ministry/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ ministryIssueId: string }> };

function noStoreJson(body: object, init?: ResponseInit) {
  return NextResponse.json(body, { ...init, headers: { "Cache-Control": "no-store" } });
}

function validId(value: string): boolean {
  return /^JSM-LKO-\d{6}$/.test(value);
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { ministryIssueId } = await params;
  if (!validId(ministryIssueId))
    return noStoreJson({ error: "ISSUE_NOT_FOUND" }, { status: 404 });

  const issue = getMinistryIssueStore().get(ministryIssueId);
  if (!issue) return noStoreJson({ error: "ISSUE_NOT_FOUND" }, { status: 404 });

  const { sourceImageUrl: _sourceImageUrl, ...safeIssue } = issue;
  const hasExternalImage =
    issue.source === "KARTAVIEW_CITY_MONITOR" && Boolean(issue.sourceImageUrl);
  return noStoreJson({
    issue: safeIssue,
    sourceEvidence: {
      imageState: hasExternalImage ? "AVAILABLE" : "UNAVAILABLE",
      ...(hasExternalImage
        ? {
            imageUrl: `/api/city-monitor/issues/${encodeURIComponent(issue.ministryIssueId)}/image`,
          }
        : {}),
    },
  });
}
