"use client";

import React, { useState } from "react";
import { BookUser, Eye, Pencil, Trash2 } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import ListToolbar from "@/components/member/common/ListToolbar";
import DataTable, { Column } from "@/components/member/common/DataTable";
import StatusBadge from "@/components/member/common/StatusBadge";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  school: string;
  province: string;
  phone: string;
  status: string;
  joinedAt: string;
}

const SEED_DATA: Teacher[] = [
  { id: "GV001", name: "Nguyễn Thị Thanh", subject: "Tiếng Việt", school: "TH Pú Nhung", province: "Điện Biên", phone: "0901 111 222", status: "active", joinedAt: "2023-08" },
  { id: "GV002", name: "Lò Văn Sơn", subject: "Toán", school: "TH Nậm Pồ", province: "Điện Biên", phone: "0912 222 333", status: "active", joinedAt: "2023-09" },
  { id: "GV003", name: "Cầm Thị Nhung", subject: "Tự nhiên & Xã hội", school: "TH Mường Mươn", province: "Điện Biên", phone: "0933 333 444", status: "active", joinedAt: "2024-01" },
  { id: "GV004", name: "Vàng A Phú", subject: "Tiếng Anh", school: "THCS Trạm Tấu", province: "Yên Bái", phone: "0944 444 555", status: "pending", joinedAt: "2025-02" },
  { id: "GV005", name: "Hoàng Thị Lan", subject: "Ngữ Văn", school: "TH Pha Long", province: "Lào Cai", phone: "0955 555 666", status: "inactive", joinedAt: "2022-10" },
];

const COLUMNS: Column<Teacher>[] = [
  { key: "id", header: "Mã GV", width: "w-24" },
  { key: "name", header: "Họ và tên" },
  { key: "subject", header: "Môn dạy" },
  { key: "school", header: "Trường công tác" },
  { key: "province", header: "Tỉnh" },
  { key: "phone", header: "Điện thoại" },
  { key: "joinedAt", header: "Tham gia", align: "center" },
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

export default function TeachersPage() {
  const [search, setSearch] = useState("");
  const filtered = SEED_DATA.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.school.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell
      title="Danh sách Giáo viên"
      subtitle={`${SEED_DATA.length} giáo viên đang hợp tác`}
      icon={BookUser}
      iconColor="bg-sky-100 text-sky-700"
    >
      <ListToolbar
        searchPlaceholder="Tìm theo tên, môn dạy, trường..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Thêm giáo viên"
        onAdd={() => {}}
      />
      <DataTable<Teacher>
        columns={COLUMNS}
        rows={filtered}
        rowKey="id"
        emptyLabel="Không tìm thấy giáo viên phù hợp"
      />
    </PageShell>
  );
}