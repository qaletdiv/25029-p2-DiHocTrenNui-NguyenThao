import React from "react";

type StatusVariant =
  // Generic
  | "active"
  | "inactive"
  | "pending"
  | "verified"
  | "suspended"
  // Student-specific lifecycle
  | "INFO"
  | "CONTACTED"
  | "ACTIVE"
  | "PAUSED"
  | "DROPPED_OUT"
  | "GRADUATED";

interface StatusBadgeProps {
  status: StatusVariant | string;
}

const VARIANT_MAP: Record<string, string> = {
  // Generic
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
  pending: "bg-yellow-100 text-yellow-700",
  verified: "bg-sky-100 text-sky-700",
  suspended: "bg-red-100 text-red-600",
  // Student lifecycle
  INFO: "bg-slate-100 text-slate-600",
  CONTACTED: "bg-blue-100 text-blue-700",
  ACTIVE: "bg-emerald-100 text-emerald-700",
  PAUSED: "bg-amber-100 text-amber-700",
  DROPPED_OUT: "bg-red-100 text-red-600",
  GRADUATED: "bg-violet-100 text-violet-700",
};

const LABEL_MAP: Record<string, string> = {
  // Generic
  active: "Hoạt động",
  inactive: "Không hoạt động",
  pending: "Chờ duyệt",
  verified: "Đã xác thực",
  suspended: "Đã khoá",
  // Student lifecycle
  INFO: "Thông tin",
  CONTACTED: "Đã liên hệ",
  ACTIVE: "Đang học",
  PAUSED: "Tạm dừng",
  DROPPED_OUT: "Nghỉ học",
  GRADUATED: "Tốt nghiệp",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass = VARIANT_MAP[status] ?? "bg-gray-100 text-gray-500";
  const label = LABEL_MAP[status] ?? status;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${colorClass}`}
    >
      {label}
    </span>
  );
}
