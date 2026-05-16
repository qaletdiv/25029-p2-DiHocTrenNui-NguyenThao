"use client";

import React, { useState } from "react";
import { ShieldCheck, Eye, Pencil, Trash2, UserPlus } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import ListToolbar from "@/components/member/common/ListToolbar";
import DataTable, { Column } from "@/components/member/common/DataTable";
import StatusBadge from "@/components/member/common/StatusBadge";

type Role = "super_admin" | "admin" | "editor" | "viewer";

interface Account {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastLogin: string;
  status: string;
  createdAt: string;
}

const SEED_DATA: Account[] = [
  { id: "ACC001", name: "Admin", email: "admin@dhtn.vn", role: "super_admin", lastLogin: "2025-05-17", status: "active", createdAt: "2023-01-01" },
  { id: "ACC002", name: "Nguyễn Thảo", email: "thao.nguyen@dhtn.vn", role: "admin", lastLogin: "2025-05-16", status: "active", createdAt: "2023-06-15" },
  { id: "ACC003", name: "Trần Minh Khoa", email: "khoa.tran@dhtn.vn", role: "editor", lastLogin: "2025-05-10", status: "active", createdAt: "2024-01-20" },
  { id: "ACC004", name: "Lê Thị Hương", email: "huong.le@dhtn.vn", role: "viewer", lastLogin: "2025-04-28", status: "inactive", createdAt: "2024-03-05" },
  { id: "ACC005", name: "Phạm Đức Toàn", email: "toan.pham@dhtn.vn", role: "editor", lastLogin: "—", status: "pending", createdAt: "2025-05-01" },
];

const ROLE_CONFIG: Record<Role, { label: string; class: string }> = {
  super_admin: { label: "Super Admin", class: "bg-primary-900/15 text-primary-900" },
  admin: { label: "Admin", class: "bg-violet-100 text-violet-700" },
  editor: { label: "Editor", class: "bg-sky-100 text-sky-700" },
  viewer: { label: "Viewer", class: "bg-gray-100 text-gray-600" },
};

function RoleBadge({ role }: { role: Role }) {
  const cfg = ROLE_CONFIG[role];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${cfg.class}`}>
      {cfg.label}
    </span>
  );
}

const COLUMNS: Column<Account>[] = [
  { key: "id", header: "Mã TK", width: "w-24" },
  { key: "name", header: "Họ và tên" },
  { key: "email", header: "Email" },
  {
    key: "role",
    header: "Vai trò",
    render: (row) => <RoleBadge role={row.role} />,
  },
  { key: "lastLogin", header: "Đăng nhập cuối", align: "center" },
  { key: "createdAt", header: "Ngày tạo", align: "center" },
  {
    key: "status",
    header: "Trạng thái",
    align: "center",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "actions",
    header: "",
    align: "right",
    width: "w-24",
    render: () => (
      <div className="flex items-center justify-end gap-2">
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-sky-600 hover:bg-sky-50 transition-colors" aria-label="Xem"><Eye size={15} /></button>
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" aria-label="Sửa"><Pencil size={15} /></button>
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" aria-label="Xoá"><Trash2 size={15} /></button>
      </div>
    ),
  },
];

export default function AccountsPage() {
  const [search, setSearch] = useState("");
  const filtered = SEED_DATA.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell
      title="Quản lý Tài khoản"
      subtitle={`${SEED_DATA.length} tài khoản trong hệ thống`}
      icon={ShieldCheck}
      iconColor="bg-violet-100 text-violet-700"
    >
      {/* Role legend */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(ROLE_CONFIG) as [Role, { label: string; class: string }][]).map(
          ([key, cfg]) => (
            <span
              key={key}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${cfg.class}`}
            >
              {cfg.label}
            </span>
          )
        )}
      </div>

      <ListToolbar
        searchPlaceholder="Tìm theo tên, email, vai trò..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Thêm tài khoản"
        onAdd={() => {}}
        extras={
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl transition-colors">
            <UserPlus size={15} />
            <span className="hidden sm:inline">Mời người dùng</span>
          </button>
        }
      />

      <DataTable<Account>
        columns={COLUMNS}
        rows={filtered}
        rowKey="id"
        emptyLabel="Không tìm thấy tài khoản phù hợp"
      />
    </PageShell>
  );
}