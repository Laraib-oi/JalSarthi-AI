import { fetchAndValidateCityImage } from "@/lib/city-monitor/image-retrieval";
import { getCityImageryStore } from "@/lib/city-monitor/store";
import { getMinistryIssueStore } from "@/lib/ministry/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ ministryIssueId: string }> };

function notFound() {
  return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { ministryIssueId } = await params;
  if (!/^JSM-LKO-\d{6}$/.test(ministryIssueId)) return notFound();

  const record = getMinistryIssueStore().get(ministryIssueId);
  if (!record || record.source !== "KARTAVIEW_CITY_MONITOR") return notFound();

  const asset = getCityImageryStore().get(record.sourceImageId, "kartaview");
  if (!asset) return notFound();

  try {
    const image = await fetchAndValidateCityImage(asset);
    return new Response(image.bytes.buffer as ArrayBuffer, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": image.mimeType,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return notFound();
  }
}
