import React from "react";

type StatusVariant =
  | "active"
  | "inactive"
  | "pending"
  | "verified"
  | "suspended";

interface StatusBadgeProps {
  status: StatusVariant | string;
}

const VARIANT_MAP: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
  pending: "bg-yellow-100 text-yellow-700",
  verified: "bg-sky-100 text-sky-700",
  suspended: "bg-red-100 text-red-600",
};

const LABEL_MAP: Record<string, string> = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
  pending: "Chờ duyệt",
  verified: "Đã xác thực",
  suspended: "Đã khoá",
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
