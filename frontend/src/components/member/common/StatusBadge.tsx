import React from "react";
import { STUDENT_STATUS, STUDENT_STATUS_TRANSLATIONS } from "@/hooks/constants";

type StatusVariant =
  // Generic
  | "active"
  | "inactive"
  | "pending"
  | "verified"
  | "suspended"
  | "rejected"
  // Student-specific lifecycle
  | typeof STUDENT_STATUS.INFO
  | typeof STUDENT_STATUS.CONTACTED
  | typeof STUDENT_STATUS.ACTIVE
  | typeof STUDENT_STATUS.PAUSED
  | typeof STUDENT_STATUS.DROPPED_OUT
  | typeof STUDENT_STATUS.GRADUATED;

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
  rejected: "bg-red-100 text-red-700",
  // Student lifecycle
  [STUDENT_STATUS.INFO]: "bg-slate-100 text-slate-600",
  [STUDENT_STATUS.CONTACTED]: "bg-blue-100 text-blue-700",
  [STUDENT_STATUS.ACTIVE]: "bg-emerald-100 text-emerald-700",
  [STUDENT_STATUS.PAUSED]: "bg-amber-100 text-amber-700",
  [STUDENT_STATUS.DROPPED_OUT]: "bg-red-100 text-red-600",
  [STUDENT_STATUS.GRADUATED]: "bg-violet-100 text-violet-700",
};

const LABEL_MAP: Record<string, string> = {
  // Generic
  active: "Hoạt động",
  inactive: "Không hoạt động",
  pending: "Chờ duyệt",
  verified: "Đã xác thực",
  suspended: "Đã khoá",
  rejected: "Đã từ chối",
  // Student lifecycle
  [STUDENT_STATUS.INFO]: STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.INFO],
  [STUDENT_STATUS.CONTACTED]: STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.CONTACTED],
  [STUDENT_STATUS.ACTIVE]: STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.ACTIVE],
  [STUDENT_STATUS.PAUSED]: STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.PAUSED],
  [STUDENT_STATUS.DROPPED_OUT]: STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.DROPPED_OUT],
  [STUDENT_STATUS.GRADUATED]: STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.GRADUATED],
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
