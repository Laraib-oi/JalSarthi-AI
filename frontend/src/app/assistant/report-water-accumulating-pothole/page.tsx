import WaterAccumulatingPotholeReport from "@/components/assistant/WaterAccumulatingPotholeReport";

export const metadata = {
  title: "Report Water-Accumulating Infrastructure | JalSarthi AI",
  description:
    "A guided JalSarthi AI flow for preparing a report about visible road infrastructure with standing water. The current image check looks for a pothole containing standing water.",
};

export default function WaterAccumulatingPotholeReportPage() {
  return <WaterAccumulatingPotholeReport />;
}
