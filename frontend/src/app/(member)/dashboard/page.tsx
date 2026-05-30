import React from "react";
import {
  GraduationCap,
  HandHeart,
  School as SchoolIcon,
  BookUser,
  Users,
  Images,
  Receipt,
} from "lucide-react";
import StatCard from "@/components/member/dashboard/StatCard";
import type { LucideIcon } from "lucide-react";

// API Imports
import { getAllStudents } from "@/services/students";
import { getAllSponsors } from "@/services/sponsors";
import { getAllSchools } from "@/services/schools";
import { getAllTeachers } from "@/services/teachers";
import { getAllVolunteers } from "@/services/volunteers";
import { getAllImages } from "@/services/images";
import { getAllTransactions } from "@/services/transactions";
import { getCurrentAccount } from "@/services/accounts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
  trend?: { value: string; positive: boolean };
  linkTo: string;
}

// ---------------------------------------------------------------------------
// Helper for Safe Total Extraction
// ---------------------------------------------------------------------------
async function fetchSafeTotal(
  fetchFn: () => Promise<any>,
  dataKey: string
): Promise<number> {
  try {
    const res = await fetchFn();
    if (!res || !res.data) return 0;
    
    const data = res.data;
    
    // Case 1: Standard pagination shape with a 'total' property
    if (typeof data === "object" && data !== null && "total" in data) {
      return data.total;
    }
    
    // Case 2: Response contains the array keyed by the dataKey
    if (typeof data === "object" && data !== null && dataKey in data) {
      const arr = data[dataKey];
      return Array.isArray(arr) ? arr.length : 0;
    }
    
    // Case 3: Response data itself is a direct array
    if (Array.isArray(data)) {
      return data.length;
    }
    
    return 0;
  } catch (error) {
    console.error(`[fetchSafeTotal] Failed to fetch total for key ${dataKey}:`, error);
    return 0;
  }
}

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------
export default async function DashboardPage() {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get current account permissions
  const account = await getCurrentAccount();
  const permissions = account?.permissions || [];
  const hasPermission = (code: string) => permissions.includes(code);

  // Fetch totals from the backend in parallel only if user has permission
  const [
    studentsTotal,
    sponsorsTotal,
    schoolsTotal,
    teachersTotal,
    volunteersTotal,
    imagesTotal,
    transactionsTotal,
  ] = await Promise.all([
    hasPermission("STUDENT_READ") ? fetchSafeTotal(() => getAllStudents(1, 1), "students") : Promise.resolve(0),
    hasPermission("SPONSOR_READ") ? fetchSafeTotal(() => getAllSponsors(1, 1), "sponsors") : Promise.resolve(0),
    hasPermission("SCHOOL_READ") ? fetchSafeTotal(() => getAllSchools(), "schools") : Promise.resolve(0),
    hasPermission("TEACHER_READ") ? fetchSafeTotal(() => getAllTeachers(1, 1), "teachers") : Promise.resolve(0),
    hasPermission("VOLUNTEER_READ") ? fetchSafeTotal(() => getAllVolunteers(1, 1), "volunteers") : Promise.resolve(0),
    hasPermission("IMAGE_READ") ? fetchSafeTotal(() => getAllImages(), "images") : Promise.resolve(0),
    hasPermission("BANK_TRANSACTION_READ") ? fetchSafeTotal(() => getAllTransactions(), "transactions") : Promise.resolve(0),
  ]);

  const statsConfig = [
    {
      permission: "STUDENT_READ",
      label: "Tổng số Học sinh",
      value: studentsTotal,
      icon: GraduationCap,
      colorClass: "bg-primary-900/10 text-primary-900",
      trend: { value: "+12 tháng này", positive: true },
      linkTo: "/students",
    },
    {
      permission: "SPONSOR_READ",
      label: "Tổng số Nhà tài trợ",
      value: sponsorsTotal,
      icon: HandHeart,
      colorClass: "bg-accent-yellow/20 text-yellow-700",
      trend: { value: "+5 tháng này", positive: true },
      linkTo: "/sponsors",
    },
    {
      permission: "SCHOOL_READ",
      label: "Tổng số Trường học",
      value: schoolsTotal,
      icon: SchoolIcon,
      colorClass: "bg-emerald-100 text-emerald-700",
      linkTo: "/schools",
    },
    {
      permission: "TEACHER_READ",
      label: "Tổng số Giáo viên",
      value: teachersTotal,
      icon: BookUser,
      colorClass: "bg-sky-100 text-sky-700",
      trend: { value: "+2 tháng này", positive: true },
      linkTo: "/teachers",
    },
    {
      permission: "VOLUNTEER_READ",
      label: "Tổng số Tình nguyện viên",
      value: volunteersTotal,
      icon: Users,
      colorClass: "bg-violet-100 text-violet-700",
      trend: { value: "-3 tháng này", positive: false },
      linkTo: "/volunteers",
    },
    {
      permission: "IMAGE_READ",
      label: "Tổng số Hình ảnh",
      value: imagesTotal,
      icon: Images,
      colorClass: "bg-pink-100 text-pink-700",
      trend: { value: "+68 tháng này", positive: true },
      linkTo: "/images",
    },
    {
      permission: "BANK_TRANSACTION_READ",
      label: "Tổng số Giao dịch",
      value: transactionsTotal,
      icon: Receipt,
      colorClass: "bg-orange-100 text-orange-700",
      trend: { value: "+24 tháng này", positive: true },
      linkTo: "/transactions",
    },
  ];

  const stats = statsConfig.filter((stat) => hasPermission(stat.permission));

  return (
    <section className="space-y-8">
      {/* Page hero / greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 p-6 sm:p-8 text-white shadow-lg">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 w-64 h-64 rounded-full bg-white/5" />

        <p className="text-white/60 text-sm mb-1">{today}</p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Chào mừng trở lại! 👋
        </h2>
        <p className="text-white/70 text-sm sm:text-base max-w-lg">
          Đây là tổng quan hoạt động của chương trình{" "}
          <span className="font-semibold text-accent-yellow">
            Đi Học Trên Núi
          </span>
          . Mọi con số đều là một câu chuyện yêu thương.
        </p>
      </div>

      {/* Section heading */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-700">
          Thống kê tổng quan
        </h3>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          Cập nhật thời gian thực
        </span>
      </div>

      {/* Stats grid — 1 col → 2 col → 3 col → 4 col */}
      <div
        id="stats-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
      >
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            colorClass={stat.colorClass}
            trend={stat.trend}
            linkTo={stat.linkTo}
          />
        ))}
      </div>

      {/* Placeholder for future chart / activity sections */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 flex flex-col items-center justify-center text-center min-h-[180px] text-gray-400 hover:border-primary-700/40 transition-colors">
          <Receipt size={28} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">Biểu đồ giao dịch</p>
          <p className="text-xs mt-1 opacity-70">Sắp ra mắt</p>
        </div>
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 flex flex-col items-center justify-center text-center min-h-[180px] text-gray-400 hover:border-primary-700/40 transition-colors">
          <Users size={28} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">Hoạt động gần đây</p>
          <p className="text-xs mt-1 opacity-70">Sắp ra mắt</p>
        </div>
      </div>
    </section>
  );
}