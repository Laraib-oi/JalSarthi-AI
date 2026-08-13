import type { Metadata } from "next";

import MinistryDashboard from "@/components/ministry/MinistryDashboard";

export const metadata: Metadata = {
  title: "JalSarthi City Water Infrastructure Monitor",
  description: "Local demonstration Ministry monitoring console for city water infrastructure issues.",
};

export default function MinistryPage() {
  return <MinistryDashboard />;
}
