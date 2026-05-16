"use client";

import React from "react";
import { Inbox } from "lucide-react";

export interface Column<T extends object> {
  key: keyof T | string;
  header: string;
  /** Optional custom cell renderer */
  render?: (row: T) => React.ReactNode;
  /** Optional Tailwind width class, e.g. "w-16" */
  width?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  rows: T[];
  /** Unique field used as React key */
  rowKey: keyof T;
  emptyLabel?: string;
}

export default function DataTable<T extends object>({
  columns,
  rows,
  rowKey,
  emptyLabel = "Chưa có dữ liệu",
}: DataTableProps<T>) {
  const alignClass: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  // Helper: safely read any field from a typed row
  const cellValue = (row: T, key: string): unknown =>
    (row as Record<string, unknown>)[key];

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
      <table className="w-full text-sm text-gray-700 border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={[
                  "px-4 py-3 font-semibold text-gray-600 whitespace-nowrap",
                  alignClass[col.align ?? "left"],
                  col.width ?? "",
                ].join(" ")}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
                  <Inbox size={36} strokeWidth={1.4} />
                  <p className="text-sm">{emptyLabel}</p>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={String(cellValue(row, rowKey as string))}
                className={[
                  "border-b border-gray-50 hover:bg-primary-900/5 transition-colors",
                  idx % 2 === 0 ? "" : "bg-gray-50/50",
                ].join(" ")}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={[
                      "px-4 py-3 align-middle",
                      alignClass[col.align ?? "left"],
                    ].join(" ")}
                  >
                    {col.render
                      ? col.render(row)
                      : String(cellValue(row, col.key as string) ?? "-")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
