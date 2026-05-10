import { Metrics } from "@/components/statistics/Metrics";
import React from "react";
interface DashboardPageProps { }

export default function DashboardPage({ }: DashboardPageProps) {

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <Metrics />
      </div>

      
    </div>
  );
}