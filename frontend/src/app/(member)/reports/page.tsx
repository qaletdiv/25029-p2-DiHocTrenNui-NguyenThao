import React from "react";
import { BarChart3, TrendingUp, TrendingDown, GraduationCap, HandHeart } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";

import { getCurrentAccount } from "@/services/accounts";
import AccessDenied from "@/components/common/AccessDenied";

import { getAllTransactions } from "@/services/transactions";
import { getAllDisbursements } from "@/services/disbursements";
import { getAllStudents } from "@/services/students";
import { getAllSponsors } from "@/services/sponsors";

const formatVND = (n: number) =>
  n.toLocaleString("vi-VN") + " ₫";

export default async function ReportsPage() {
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  if (!permissions.includes("REPORT_READ")) {
    return <AccessDenied title="Báo cáo tổng hợp" />;
  }

  // Fetch all required data in parallel
  let transactions: any[] = [];
  let disbursements: any[] = [];
  let studentsCount = 0;
  let sponsorsCount = 0;

  try {
    const [txRes, disRes, studentsRes, sponsorsRes] = await Promise.all([
      getAllTransactions().catch((err) => {
        console.error("Failed to fetch transactions:", err);
        return { data: [] };
      }),
      getAllDisbursements().catch((err) => {
        console.error("Failed to fetch disbursements:", err);
        return { data: [] };
      }),
      getAllStudents().catch((err) => {
        console.error("Failed to fetch students:", err);
        return { data: [] };
      }),
      getAllSponsors().catch((err) => {
        console.error("Failed to fetch sponsors:", err);
        return { data: [] };
      }),
    ]);

    // Parse transactions
    if (txRes && txRes.data) {
      const isPaginated = "transactions" in txRes.data;
      transactions = isPaginated
        ? (txRes.data as any).transactions
        : (Array.isArray(txRes.data) ? txRes.data : []);
    }

    // Parse disbursements (allocations)
    if (disRes && disRes.data) {
      const isPaginated = "disbursements" in disRes.data;
      disbursements = isPaginated
        ? (disRes.data as any).disbursements
        : (Array.isArray(disRes.data) ? disRes.data : []);
    }

    // Parse students count
    if (studentsRes && studentsRes.data) {
      const isPaginated = "students" in studentsRes.data;
      const studentsList = isPaginated
        ? (studentsRes.data as any).students
        : (Array.isArray(studentsRes.data) ? studentsRes.data : []);
      studentsCount = isPaginated ? (studentsRes.data as any).total : studentsList.length;
    }

    // Parse sponsors count
    if (sponsorsRes && sponsorsRes.data) {
      const isPaginated = "sponsors" in sponsorsRes.data;
      const sponsorsList = isPaginated
        ? (sponsorsRes.data as any).sponsors
        : (Array.isArray(sponsorsRes.data) ? sponsorsRes.data : []);
      sponsorsCount = isPaginated ? (sponsorsRes.data as any).total : sponsorsList.length;
    }
  } catch (error) {
    console.error("Error during reports page data fetching:", error);
  }

  // 1. Calculate Revenue of the Year (Total Amount of Verified Transactions)
  const verifiedTransactions = transactions.filter((t) => t.status_id === 2);
  const totalRevenue = verifiedTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  // 2. Calculate Expenditures of the Year (Total Amount of Allocated Disbursements)
  const totalExpenditure = disbursements.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  // 3. Populate KPI card values
  const summaries = [
    {
      label: "Tổng thu trong năm",
      value: formatVND(totalRevenue),
      icon: TrendingUp,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Tổng chi trong năm",
      value: formatVND(totalExpenditure),
      icon: TrendingDown,
      color: "text-red-500 bg-red-100",
    },
    {
      label: "Học sinh được hỗ trợ",
      value: String(studentsCount),
      icon: GraduationCap,
      color: "text-primary-900 bg-primary-900/10",
    },
    {
      label: "Nhà tài trợ đồng hành",
      value: String(sponsorsCount),
      icon: HandHeart,
      color: "text-yellow-700 bg-yellow-100",
    },
  ];

  // 4. Calculate monthly revenue/expenditure
  const monthlyDataMap: Record<string, { income: number; expense: number }> = {};

  // Group verified transactions by MM/YYYY
  for (const tx of verifiedTransactions) {
    if (!tx.transfer_date) continue;
    try {
      const date = new Date(tx.transfer_date);
      if (isNaN(date.getTime())) continue;
      const m = date.getMonth() + 1;
      const y = date.getFullYear();
      const period = `${String(m).padStart(2, "0")}/${y}`;
      if (!monthlyDataMap[period]) {
        monthlyDataMap[period] = { income: 0, expense: 0 };
      }
      monthlyDataMap[period].income += Number(tx.amount) || 0;
    } catch (e) {
      console.error("Failed to parse transaction date:", tx.transfer_date, e);
    }
  }

  // Group disbursements by MM/YYYY (using support_month and support_year)
  for (const d of disbursements) {
    const m = d.support_month;
    const y = d.support_year;
    if (!m || !y) continue;
    const period = `${String(m).padStart(2, "0")}/${y}`;
    if (!monthlyDataMap[period]) {
      monthlyDataMap[period] = { income: 0, expense: 0 };
    }
    monthlyDataMap[period].expense += Number(d.amount) || 0;
  }

  // Sort periods in descending chronological order
  const parsePeriod = (pKey: string) => {
    const [mStr, yStr] = pKey.split("/");
    return { month: parseInt(mStr, 10), year: parseInt(yStr, 10) };
  };

  const sortedPeriods = Object.keys(monthlyDataMap).sort((a, b) => {
    const pA = parsePeriod(a);
    const pB = parsePeriod(b);
    return (pB.year * 12 + pB.month) - (pA.year * 12 + pA.month);
  });

  const monthlyStats = sortedPeriods.map((period) => ({
    month: period,
    income: monthlyDataMap[period].income,
    expense: monthlyDataMap[period].expense,
  }));

  // Calculate BAR_MAX dynamically
  const barMax = Math.max(
    ...monthlyStats.map((m) => Math.max(m.income, m.expense)),
    1_000_000
  );

  return (
    <PageShell
      title="Báo cáo tổng hợp"
      subtitle="Tổng quan thu chi và hoạt động trong năm"
      icon={BarChart3}
      iconColor="bg-indigo-100 text-indigo-700"
    >
      {/* KPI summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaries.map((item) => (
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
          </div>
        ))}
      </div>

      {/* Monthly bar chart (pure CSS) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
        <h3 className="text-base font-semibold text-gray-700 mb-6">
          Thu / Chi theo tháng
        </h3>
        {monthlyStats.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Chưa có dữ liệu giao dịch hoặc phân bổ.
          </div>
        ) : (
          <div className="space-y-6">
            {monthlyStats.map((m) => (
              <div key={m.month}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">{m.month}</span>
                </div>
                {/* Income bar */}
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-xs text-green-600 w-10 text-right shrink-0">Thu</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700"
                      style={{ width: `${(m.income / barMax) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-32 text-right shrink-0">
                    {formatVND(m.income)}
                  </span>
                </div>
                {/* Expense bar */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-red-500 w-10 text-right shrink-0">Chi</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-700"
                      style={{ width: `${(m.expense / barMax) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-32 text-right shrink-0">
                    {formatVND(m.expense)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Legend */}
        <div className="flex gap-6 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-xs text-gray-500">Thu nhập</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-xs text-gray-500">Chi tiêu</span></div>
        </div>
      </div>
    </PageShell>
  );
}