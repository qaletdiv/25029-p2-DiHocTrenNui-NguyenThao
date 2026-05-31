"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DataTable, { Column } from "@/components/member/common/DataTable";
import StatusBadge from "@/components/member/common/StatusBadge";
import ListToolbar from "@/components/member/common/ListToolbar";
import { Account } from "@/services/accounts";
import { usePermission } from "@/contexts/PermissionContext";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const PAGE_SIZE_OPTIONS = [5, 10, 20];

const ROLE_MAP: Record<number, { label: string; class: string }> = {
  1: { label: "Quản trị viên", class: "bg-primary-900/15 text-primary-900" },
  2: { label: "Tình nguyện viên", class: "bg-violet-100 text-violet-700" },
  3: { label: "Giáo viên", class: "bg-sky-100 text-sky-700" },
  4: { label: "Nhà tài trợ", class: "bg-amber-100 text-amber-700" },
};

function RoleBadge({ roleId }: { roleId: number }) {
  const cfg = ROLE_MAP[roleId] || { label: "Người dùng", class: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${cfg.class}`}>
      {cfg.label}
    </span>
  );
}

const ALL_ROLES = [
  { value: "", label: "Tất cả vai trò" },
  { value: "1", label: "Quản trị viên" },
  { value: "2", label: "Tình nguyện viên" },
  { value: "3", label: "Giáo viên" },
  { value: "4", label: "Nhà tài trợ" },
];

const ALL_STATUSES = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Dừng hoạt động" },
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2 text-sm text-gray-500 font-sans">
      <span>
        Hiển thị{" "}
        <span className="font-semibold text-gray-700">
          {from}–{to}
        </span>{" "}
        trong tổng số{" "}
        <span className="font-semibold text-gray-700">{total}</span> tài khoản
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
  accounts: Account[];
  total: number;
  initialPage: number;
  initialPageSize: number;
}

export default function AccountListClient({ accounts, total, initialPage, initialPageSize }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { hasPermission } = usePermission();

  // Filter state
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
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
    return accounts.filter((a) => {
      const matchSearch =
        !q ||
        a.username.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        String(a.id).toLowerCase().includes(q);

      const matchRole = !roleFilter || String(a.role_id) === roleFilter;

      let matchStatus = true;
      if (statusFilter === "active") {
        matchStatus = a.is_active === true;
      } else if (statusFilter === "inactive") {
        matchStatus = a.is_active === false;
      }

      return matchSearch && matchRole && matchStatus;
    });
  }, [search, roleFilter, statusFilter, accounts]);

  const handleSearch = (v: string) => {
    setSearch(v);
  };
  const handleRole = (v: string) => {
    setRoleFilter(v);
  };
  const handleStatus = (v: string) => {
    setStatusFilter(v);
  };

  // Columns definition
  const columns: Column<Account>[] = [
    {
      key: "id",
      header: "Mã TK",
      width: "w-24",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-primary-900 bg-primary-900/8 px-2 py-0.5 rounded-md">
          #{row.id}
        </span>
      ),
    },
    {
      key: "username",
      header: "Tên tài khoản",
      render: (row) => (
        <span className="font-medium text-gray-800">{row.username}</span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (row) => (
        <span className="text-gray-600 text-sm truncate max-w-[250px] block" title={row.email}>
          {row.email || "—"}
        </span>
      ),
    },
    {
      key: "role_id",
      header: "Vai trò",
      width: "w-40",
      render: (row) => <RoleBadge roleId={row.role_id} />,
    },
    {
      key: "is_active",
      header: "Trạng thái",
      align: "center",
      width: "w-32",
      render: (row) => <StatusBadge status={row.is_active ? "active" : "inactive"} />,
    },
  ];

  return (
    <>
      {/* ── Toolbar: search + filters ── */}
      <ListToolbar
        searchPlaceholder="Tìm theo tên đăng nhập, email..."
        searchValue={search}
        onSearchChange={handleSearch}
        addLabel="Thêm tài khoản"
        onAdd={hasPermission("USER_CREATE") ? () => router.push("/accounts/new") : undefined}
        extras={
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              id="filter-role"
              value={roleFilter}
              onChange={handleRole}
              options={ALL_ROLES}
            />
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
      <DataTable<Account>
        columns={columns}
        rows={filtered}
        rowKey="id"
        emptyLabel="Không tìm thấy tài khoản phù hợp"
        stickyHeader
        onRowClick={(row) => router.push(`/accounts/${row.id}`)}
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
