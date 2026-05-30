import React from "react";
import { BarChart3, TrendingUp, TrendingDown, Users, GraduationCap, HandHeart } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";

import { getCurrentAccount } from "@/services/accounts";
import AccessDenied from "@/components/common/AccessDenied";

interface SummaryItem {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  color: string;
}

const SUMMARIES: SummaryItem[] = [
  { label: "Tổng thu trong năm", value: "38.400.000 ₫", change: "+12%", positive: true, icon: TrendingUp, color: "text-green-600 bg-green-100" },
  { label: "Tổng chi trong năm", value: "34.750.000 ₫", change: "+8%", positive: false, icon: TrendingDown, color: "text-red-500 bg-red-100" },
  { label: "Học sinh được hỗ trợ", value: "248", change: "+12 em", positive: true, icon: GraduationCap, color: "text-primary-900 bg-primary-900/10" },
  { label: "Nhà tài trợ đồng hành", value: "87", change: "+5", positive: true, icon: HandHeart, color: "text-yellow-700 bg-yellow-100" },
  { label: "Tình nguyện viên", value: "124", change: "-3", positive: false, icon: Users, color: "text-violet-700 bg-violet-100" },
];

interface QuarterStat {
  quarter: string;
  income: number;
  expense: number;
}

const QUARTERLY: QuarterStat[] = [
  { quarter: "Q1 / 2024", income: 8_200_000, expense: 7_400_000 },
  { quarter: "Q2 / 2024", income: 9_600_000, expense: 8_800_000 },
  { quarter: "Q3 / 2024", income: 11_000_000, expense: 9_900_000 },
  { quarter: "Q4 / 2024", income: 9_600_000, expense: 8_650_000 },
];

const formatVND = (n: number) =>
  n.toLocaleString("vi-VN") + " ₫";

const BAR_MAX = 12_000_000;

export default async function ReportsPage() {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("REPORT_READ")) {
    return <AccessDenied title="Báo cáo tổng hợp" />;
  }
  return (
    <PageShell
      title="Báo cáo tổng hợp"
      subtitle="Tổng quan thu chi và hoạt động trong năm"
      icon={BarChart3}
      iconColor="bg-indigo-100 text-indigo-700"
    >
      {/* KPI summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {SUMMARIES.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
              <item.icon size={18} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{item.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${
                item.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
              }`}
            >
              {item.positive ? "▲" : "▼"} {item.change}
            </span>
          </div>
        ))}
      </div>

      {/* Quarterly bar chart (pure CSS) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-700 mb-6">
          Thu / Chi theo Quý — 2024
        </h3>
        <div className="space-y-6">
          {QUARTERLY.map((q) => (
            <div key={q.quarter}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{q.quarter}</span>
              </div>
              {/* Income bar */}
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xs text-green-600 w-10 text-right shrink-0">Thu</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700"
                    style={{ width: `${(q.income / BAR_MAX) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-32 text-right shrink-0">
                  {formatVND(q.income)}
                </span>
              </div>
              {/* Expense bar */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-red-500 w-10 text-right shrink-0">Chi</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-700"
                    style={{ width: `${(q.expense / BAR_MAX) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-32 text-right shrink-0">
                  {formatVND(q.expense)}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex gap-6 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-xs text-gray-500">Thu nhập</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-xs text-gray-500">Chi tiêu</span></div>
        </div>
      </div>
    </PageShell>
  );
}