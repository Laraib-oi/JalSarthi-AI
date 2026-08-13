import { POST as simulatePost } from "@/app/api/city-monitor/simulate/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return simulatePost(request);
}
