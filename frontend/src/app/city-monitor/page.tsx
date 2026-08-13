import type { Metadata } from "next";

import CityMonitorDashboard from "@/components/city-monitor/CityMonitorDashboard";

export const metadata: Metadata = {
  title: "JalSarthi City Water Infrastructure Monitor",
  description: "City-level water infrastructure monitoring console with clearly labeled demonstration data.",
};

export default function CityMonitorPage() {
  return <CityMonitorDashboard />;
}
