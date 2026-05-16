import React from "react";
import {
  GraduationCap,
  HandHeart,
  School,
  BookUser,
  Users,
  Images,
  Receipt,
} from "lucide-react";
import StatCard from "@/components/member/dashboard/StatCard";
import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
  trend?: { value: string; positive: boolean };
}

// ---------------------------------------------------------------------------
// Data — replace with real API calls / server fetch later
// ---------------------------------------------------------------------------
const STATS: Stat[] = [
  {
    label: "Tổng số Học sinh",
    value: 248,
    icon: GraduationCap,
    colorClass: "bg-primary-900/10 text-primary-900",
    trend: { value: "+12 tháng này", positive: true },
  },
  {
    label: "Tổng số Nhà tài trợ",
    value: 87,
    icon: HandHeart,
    colorClass: "bg-accent-yellow/20 text-yellow-700",
    trend: { value: "+5 tháng này", positive: true },
  },
  {
    label: "Tổng số Trường học",
    value: 14,
    icon: School,
    colorClass: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Tổng số Giáo viên",
    value: 36,
    icon: BookUser,
    colorClass: "bg-sky-100 text-sky-700",
    trend: { value: "+2 tháng này", positive: true },
  },
  {
    label: "Tổng số Tình nguyện viên",
    value: 124,
    icon: Users,
    colorClass: "bg-violet-100 text-violet-700",
    trend: { value: "-3 tháng này", positive: false },
  },
  {
    label: "Tổng số Hình ảnh",
    value: 1_342,
    icon: Images,
    colorClass: "bg-pink-100 text-pink-700",
    trend: { value: "+68 tháng này", positive: true },
  },
  {
    label: "Tổng số Giao dịch",
    value: 519,
    icon: Receipt,
    colorClass: "bg-orange-100 text-orange-700",
    trend: { value: "+24 tháng này", positive: true },
  },
];

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------
export default function DashboardPage() {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        {STATS.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            colorClass={stat.colorClass}
            trend={stat.trend}
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