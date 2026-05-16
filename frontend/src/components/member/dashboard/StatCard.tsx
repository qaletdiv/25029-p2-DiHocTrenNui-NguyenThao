import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  /** Tailwind bg + text colour classes for the icon ring */
  colorClass?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  colorClass = "bg-primary-900/10 text-primary-900",
  trend,
}: StatCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden p-5 flex flex-col gap-4">
      {/* subtle accent line at top */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-900 via-primary-700 to-accent-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon + Label row */}
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          <Icon size={22} strokeWidth={1.8} />
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.positive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {trend.positive ? "▲" : "▼"} {trend.value}
          </span>
        )}
      </div>

      {/* Metric */}
      <div>
        <p className="text-3xl font-bold text-gray-800 tabular-nums tracking-tight">
          {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
        </p>
        <p className="mt-1 text-sm text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  );
}
