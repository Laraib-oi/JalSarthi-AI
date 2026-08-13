import { NextResponse } from "next/server";

import { getCityMonitorStatus } from "@/lib/city-monitor/ingestion";
import { getCityMonitorConfig } from "@/lib/city-monitor/config";
import { DEMONSTRATION_SCENARIO_ID } from "@/lib/city-monitor/simulation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const city = getCityMonitorConfig("lucknow");
  const status = getCityMonitorStatus();
  return NextResponse.json(
    {
      monitor: {
        name: "JalSarthi City Water Infrastructure Monitor",
        city: city?.name ?? "Lucknow",
        provider: "kartaview",
        providers: ["kartaview", "demonstration"],
        demonstration: {
          enabled: true,
          scenarioId: DEMONSTRATION_SCENARIO_ID,
          source: "DEMONSTRATION_SIMULATION",
        },
      },
      status,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
