"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DataTable, { Column } from "@/components/member/common/DataTable";
import StatusBadge from "@/components/member/common/StatusBadge";
import ListToolbar from "@/components/member/common/ListToolbar";
import { Teacher } from "@/services/teachers";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const PAGE_SIZE_OPTIONS = [5, 10, 20];

const ALL_STATUSES = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Không hoạt động" },
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
        <span className="font-semibold text-gray-700">{total}</span> giáo viên
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
  teachers: Teacher[];
  total: number;
  initialPage: number;
  initialPageSize: number;
}

export default function TeacherListClient({
  teachers,
  total,
  initialPage,
  initialPageSize,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const page = initialPage;
  const pageSize = initialPageSize;

  const setPageAndSize = (newPage: number, newPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    params.set("pageSize", newPageSize.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Derived: filtered rows
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return teachers.filter((t) => {
      const matchSearch =
        !q ||
        t.full_name.toLowerCase().includes(q) ||
        String(t.id).toLowerCase().includes(q) ||
        (t.phone && t.phone.toLowerCase().includes(q)) ||
        (t.school && t.school.toLowerCase().includes(q));

      let matchStatus = true;
      if (statusFilter === "active") {
        matchStatus = t.is_active === true;
      } else if (statusFilter === "inactive") {
        matchStatus = t.is_active === false;
      }
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, teachers]);

  const handleSearch = (v: string) => {
    setSearch(v);
  };
  const handleStatus = (v: string) => {
    setStatusFilter(v);
  };

  // Column definitions
  const columns: Column<Teacher>[] = [
    {
      key: "id",
      header: "Mã GV",
      width: "w-28",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-primary-900 bg-primary-900/8 px-2 py-0.5 rounded-md">
          #GV{row.id}
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
      key: "phone",
      header: "Điện thoại",
      width: "w-36",
      render: (row) => <span className="text-gray-600">{row.phone || "—"}</span>,
    },
    {
      key: "school",
      header: "Trường công tác",
      render: (row) => (
        <span className="text-gray-600 text-sm truncate max-w-[300px] block" title={row.school || ""}>
          {row.school || "—"}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "Trạng thái",
      align: "center",
      width: "w-32",
      render: (row) => (
        <StatusBadge status={row.is_active ? "active" : "inactive"} />
      ),
    },
  ];

  return (
    <>
      {/* ── Toolbar: search + filters ── */}
      <ListToolbar
        searchPlaceholder="Tìm theo tên, mã GV, trường..."
        searchValue={search}
        onSearchChange={handleSearch}
        addLabel="Thêm giáo viên"
        onAdd={() => router.push("/teachers/new")}
        extras={
          <div className="flex items-center gap-2">
            <FilterSelect
              id="filter-status"
              value={statusFilter}
              onChange={handleStatus}
              options={ALL_STATUSES}
            />
          </div>
        }
      />

      {/* ── Data table ── */}
      <DataTable<Teacher>
        columns={columns}
        rows={filtered}
        rowKey="id"
        emptyLabel="Không tìm thấy giáo viên phù hợp"
        stickyHeader
        onRowClick={(row) => router.push(`/teachers/${row.id}`)}
      />

      {/* ── Pagination ── */}
      <Pagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPage={(p) => setPageAndSize(p, pageSize)}
        onPageSize={(s) => setPageAndSize(1, s)}
      />
    </>
  );
}
