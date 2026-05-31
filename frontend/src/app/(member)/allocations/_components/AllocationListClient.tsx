"use client";

import React, { useCallback, useEffect, useMemo, useState, useRef, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Wallet, TrendingDown, CheckCircle2, Loader2 } from "lucide-react";
import DataTable, { Column } from "@/components/member/common/DataTable";
import StatusBadge from "@/components/member/common/StatusBadge";
import ListToolbar from "@/components/member/common/ListToolbar";
import { Disbursement, BudgetSummary } from "@/services/disbursements";
import { usePermission } from "@/contexts/PermissionContext";
import { DISBURSEMENT_STATUS, DISBURSEMENT_STATUS_TRANSLATIONS } from "@/hooks/constants";
import { fmtAmount } from "@/hooks/convertData";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const PAGE_SIZE_OPTIONS = [5, 10, 20];

const ALL_STATUSES: { value: string; label: string }[] = [
  { value: "", label: "Tất cả trạng thái" },
  { value: DISBURSEMENT_STATUS.HOLDING, label: DISBURSEMENT_STATUS_TRANSLATIONS[DISBURSEMENT_STATUS.HOLDING] },
  { value: DISBURSEMENT_STATUS.SENT_TO_TEACHER, label: DISBURSEMENT_STATUS_TRANSLATIONS[DISBURSEMENT_STATUS.SENT_TO_TEACHER] },
  { value: DISBURSEMENT_STATUS.DELIVERED_TO_STUDENT, label: DISBURSEMENT_STATUS_TRANSLATIONS[DISBURSEMENT_STATUS.DELIVERED_TO_STUDENT] },
];

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `Tháng ${i + 1}`,
}));

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => ({
  value: String(currentYear - 2 + i),
  label: String(currentYear - 2 + i),
}));

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

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 min-w-[200px]">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
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
        <span className="font-semibold text-gray-700">{total}</span> phân bổ
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
const SEARCH_DEBOUNCE_MS = 400;

interface Props {
  disbursements: Disbursement[];
  total: number;
  initialPage: number;
  initialPageSize: number;
  budgetSummary: BudgetSummary;
  initialSearch: string;
}

export default function AllocationListClient({
  disbursements,
  total,
  initialPage,
  initialPageSize,
  budgetSummary,
  initialSearch,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { hasPermission } = usePermission();
  const [isPending, startTransition] = useTransition();

  // Filter state
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const page = initialPage;
  const pageSize = initialPageSize;

  // Keep local state in sync when URL-driven props change
  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const navigateWithParams = useCallback(
    (overrides: { page?: number; pageSize?: number; search?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      const newPage = overrides.page ?? 1;
      const newPageSize = overrides.pageSize ?? pageSize;
      const newSearch = overrides.search ?? search;

      params.set("page", String(newPage));
      params.set("pageSize", String(newPageSize));

      if (newSearch) {
        params.set("search", newSearch);
      } else {
        params.delete("search");
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, pageSize, search, router, startTransition]
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

  const handleStatus = (v: string) => {
    setStatusFilter(v);
  };

  const handleMonth = (v: string) => {
    setMonthFilter(v);
  };

  const handleYear = (v: string) => {
    setYearFilter(v);
  };

  // Compute summary stats
  const summaryStats = useMemo(() => {
    const totalAllocated = Object.values(budgetSummary).reduce((sum, b) => sum + b.allocated, 0);
    const totalRemaining = Object.values(budgetSummary).reduce((sum, b) => sum + b.remaining, 0);
    const totalDelivered = disbursements.filter(d => d.status === DISBURSEMENT_STATUS.DELIVERED_TO_STUDENT).length;
    return { totalAllocated, totalRemaining, totalDelivered };
  }, [budgetSummary, disbursements]);

  // Derived: filtered rows (client-side status/month/year filter only; search is server-side)
  const filtered = useMemo(() => {
    return disbursements.filter((d) => {
      const matchStatus = !statusFilter || d.status === statusFilter;
      const matchMonth = !monthFilter || d.support_month === Number(monthFilter);
      const matchYear = !yearFilter || d.support_year === Number(yearFilter);
      return matchStatus && matchMonth && matchYear;
    });
  }, [statusFilter, monthFilter, yearFilter, disbursements]);

  const paginated = filtered;

  // Column definitions
  const columns: Column<Disbursement>[] = [
    {
      key: "id",
      header: "Mã PB",
      width: "w-20",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-teal-900 bg-teal-900/8 px-2 py-0.5 rounded-md">
          #{row.id}
        </span>
      ),
    },
    {
      key: "student_name",
      header: "Học sinh",
      render: (row) => (
        <div>
          <span className="font-medium text-gray-800">{row.student_name || "—"}</span>
          <span className="block text-xs text-gray-400 font-mono">{row.student_id}</span>
        </div>
      ),
    },
    {
      key: "sponsor_name",
      header: "Nhà tài trợ",
      render: (row) => (
        <span className="text-gray-600 text-sm">{row.sponsor_name || "—"}</span>
      ),
    },
    {
      key: "teacher_name",
      header: "Giáo viên",
      render: (row) => (
        <span className="text-gray-600 text-sm">{row.teacher_name || "—"}</span>
      ),
    },
    {
      key: "amount",
      header: "Số tiền",
      align: "right",
      width: "w-32",
      render: (row) => (
        <span className="font-semibold text-teal-800">{fmtAmount(row.amount)}</span>
      ),
    },
    {
      key: "support_month",
      header: "Tháng/Năm",
      align: "center",
      width: "w-28",
      render: (row) => (
        <span className="text-gray-600 text-sm">
          {String(row.support_month).padStart(2, "0")}/{row.support_year}
        </span>
      ),
    },
    {
      key: "transaction_code",
      header: "Mã GD",
      width: "w-24",
      render: (row) => (
        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {row.transaction_code || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      align: "center",
      width: "w-36",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <>
      {/* ── Summary cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <SummaryCard
          icon={Wallet}
          label="Tổng đã phân bổ"
          value={fmtAmount(summaryStats.totalAllocated)}
          color="bg-teal-100 text-teal-700"
        />
        <SummaryCard
          icon={TrendingDown}
          label="Tổng còn lại"
          value={fmtAmount(summaryStats.totalRemaining)}
          color="bg-amber-100 text-amber-700"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Đã giao học sinh"
          value={`${summaryStats.totalDelivered} / ${total}`}
          color="bg-emerald-100 text-emerald-700"
        />
      </div>

      {/* ── Toolbar: search + filters ── */}
      <ListToolbar
        searchPlaceholder="Tìm theo học sinh, nhà tài trợ, mã GD..."
        searchValue={search}
        onSearchChange={handleSearch}
        addLabel="Thêm phân bổ"
        onAdd={hasPermission("DISBURSEMENT_CREATE") ? () => router.push("/allocations/new") : undefined}
        extras={
          <div className="flex items-center gap-2 flex-wrap">
            <FilterSelect
              id="filter-status"
              value={statusFilter}
              onChange={handleStatus}
              options={ALL_STATUSES}
            />
            <FilterSelect
              id="filter-month"
              value={monthFilter}
              onChange={handleMonth}
              options={[{ value: "", label: "Tất cả tháng" }, ...MONTHS]}
            />
            <FilterSelect
              id="filter-year"
              value={yearFilter}
              onChange={handleYear}
              options={[{ value: "", label: "Tất cả năm" }, ...YEARS]}
            />
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
        <DataTable<Disbursement>
          columns={columns}
          rows={paginated}
          rowKey="id"
          emptyLabel="Không tìm thấy phân bổ phù hợp"
          stickyHeader
          onRowClick={(row) => router.push(`/allocations/${row.id}`)}
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
