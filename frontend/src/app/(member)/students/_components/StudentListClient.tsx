"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import DataTable, { Column } from "@/components/member/common/DataTable";
import StatusBadge from "@/components/member/common/StatusBadge";
import ListToolbar from "@/components/member/common/ListToolbar";
import { Student } from "@/services/students";
import { STUDENT_STATUS, STUDENT_STATUS_TRANSLATIONS } from "@/hooks/constants";
import { usePermission } from "@/contexts/PermissionContext";


// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const PAGE_SIZE_OPTIONS = [5, 10, 20];
const SEARCH_DEBOUNCE_MS = 400;

const ALL_STATUSES: { value: string; label: string }[] = [
  { value: "", label: "Tất cả trạng thái" },
  { value: STUDENT_STATUS.INFO, label: STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.INFO] },
  { value: STUDENT_STATUS.CONTACTED, label: STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.CONTACTED] },
  { value: STUDENT_STATUS.ACTIVE, label: STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.ACTIVE] },
  { value: STUDENT_STATUS.PAUSED, label: STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.PAUSED] },
  { value: STUDENT_STATUS.DROPPED_OUT, label: STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.DROPPED_OUT] },
  { value: STUDENT_STATUS.GRADUATED, label: STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.GRADUATED] },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function FilterSelect({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-[42px] pl-3 pr-8 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors text-gray-700 cursor-pointer appearance-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Pagination({
  total,
  page,
  pageSize,
  onPage,
  onPageSize,
}: {
  total: number;
  page: number;
  pageSize: number;
  onPage: (p: number) => void;
  onPageSize: (s: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2 text-sm text-gray-500">
      <span>
        Hiển thị{" "}
        <span className="font-semibold text-gray-700">
          {from}–{to}
        </span>{" "}
        trong tổng số{" "}
        <span className="font-semibold text-gray-700">{total}</span> học sinh
      </span>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400">Dòng/trang:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSize(Number(e.target.value));
              onPage(1);
            }}
            className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:border-primary-700 cursor-pointer"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPage(page - 1)}
            disabled={page <= 1}
            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Trang trước"
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce<(number | "…")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "…" ? (
                <span key={`ellipsis-${i}`} className="px-1 text-gray-400">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPage(p as number)}
                  className={[
                    "w-7 h-7 rounded-lg text-xs font-medium transition-colors",
                    p === page
                      ? "bg-primary-900 text-white shadow-sm"
                      : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-600",
                  ].join(" ")}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => onPage(page + 1)}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Trang sau"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Client Component
// ─────────────────────────────────────────────
interface Props {
  students: Student[];
  total: number;
  initialPage: number;
  initialPageSize: number;
  initialSearch: string;
  initialStatus: string;
}

export default function StudentListClient({
  students,
  total,
  initialPage,
  initialPageSize,
  initialSearch,
  initialStatus,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { hasPermission } = usePermission();
  const [isPending, startTransition] = useTransition();

  // Local input state (for instant typing feedback)
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const page = initialPage;
  const pageSize = initialPageSize;

  // Keep local state in sync when URL-driven props change
  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setStatusFilter(initialStatus);
  }, [initialStatus]);

  /**
   * Build a new URL with updated query params and navigate.
   * Resets to page 1 when search/status/pageSize changes.
   */
  const navigateWithParams = useCallback(
    (overrides: { page?: number; pageSize?: number; search?: string; status?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      const newPage = overrides.page ?? 1;
      const newPageSize = overrides.pageSize ?? pageSize;
      const newSearch = overrides.search ?? search;
      const newStatus = overrides.status ?? statusFilter;

      params.set("page", String(newPage));
      params.set("pageSize", String(newPageSize));

      if (newSearch) {
        params.set("search", newSearch);
      } else {
        params.delete("search");
      }

      if (newStatus) {
        params.set("status", newStatus);
      } else {
        params.delete("status");
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, pageSize, search, statusFilter, router, startTransition]
  );

  // Debounced search handler
  const handleSearch = useCallback(
    (v: string) => {
      setSearch(v);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        navigateWithParams({ search: v, page: 1 });
      }, SEARCH_DEBOUNCE_MS);
    },
    [navigateWithParams]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Status filter handler (immediate, no debounce)
  const handleStatus = useCallback(
    (v: string) => {
      setStatusFilter(v);
      navigateWithParams({ status: v, page: 1 });
    },
    [navigateWithParams]
  );

  // The rows are already filtered + paginated by the server
  const paginated = students;

  // Column definitions
  const columns: Column<Student>[] = [
    {
      key: "id",
      header: "Mã HS",
      width: "w-24",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-primary-900 bg-primary-900/8 px-2 py-0.5 rounded-md">
          #{row.id}
        </span>
      ),
    },
    {
      key: "full_name",
      header: "Họ và tên",
      render: (row) => (
        <span className="font-medium text-gray-800">{row.full_name}</span>
      ),
    },
    {
      key: "date_of_birth",
      header: "Ngày sinh",
      align: "center",
      width: "w-24",
      render: (row) => (
        <span className="text-gray-600">
          {new Date(row.date_of_birth).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "address",
      header: "Địa chỉ",
      render: (row) => (
        <span className="text-gray-600 text-sm truncate max-w-[200px] block" title={row.address}>
          {row.address || "—"}
        </span>
      ),
    },
    {
      key: "school",
      header: "Trường",
      render: (row) => (
        <span className="text-gray-600 text-sm truncate max-w-[150px] block" title={row.school}>
          {row.school || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      align: "center",
      width: "w-32",
      render: (row) => <StatusBadge status={row.status} />,
    }
  ];

  return (
    <>
      {/* ── Toolbar: search + filters ── */}
      <ListToolbar
        searchPlaceholder="Tìm theo tên hoặc mã HS..."
        searchValue={search}
        onSearchChange={handleSearch}
        addLabel="Thêm học sinh"
        onAdd={hasPermission("STUDENT_CREATE") ? () => router.push("/students/new") : undefined}
        extras={
          <div className="flex items-center gap-2">
            <FilterSelect
              id="filter-status"
              value={statusFilter}
              onChange={handleStatus}
              options={ALL_STATUSES}
            />
            {/* Loading indicator while fetching new results */}
            {isPending && (
              <div className="flex items-center gap-1.5 text-primary-700">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs font-medium">Đang tìm...</span>
              </div>
            )}
          </div>
        }
      />

      {/* ── Data table ── */}
      <div className={isPending ? "opacity-60 transition-opacity duration-200" : "transition-opacity duration-200"}>
        <DataTable<Student>
          columns={columns}
          rows={paginated}
          rowKey="id"
          emptyLabel="Không tìm thấy học sinh phù hợp"
          stickyHeader
          onRowClick={(row) => router.push(`/students/${row.id}`)}
        />
      </div>

      {/* ── Pagination ── */}
      <Pagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPage={(p) => navigateWithParams({ page: p, pageSize })}
        onPageSize={(s) => navigateWithParams({ page: 1, pageSize: s })}
      />
    </>
  );
}
