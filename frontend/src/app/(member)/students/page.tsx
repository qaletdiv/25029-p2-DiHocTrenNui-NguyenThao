"use client";

import React, { useState } from "react";
import { GraduationCap, Eye, Pencil, Trash2 } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import ListToolbar from "@/components/member/common/ListToolbar";
import DataTable, { Column } from "@/components/member/common/DataTable";
import StatusBadge from "@/components/member/common/StatusBadge";

interface Student {
  id: string;
  name: string;
  age: number;
  school: string;
  sponsor: string;
  province: string;
  status: string;
  joinedAt: string;
}

const SEED_DATA: Student[] = [
  { id: "HS001", name: "Hồ Thị Lan", age: 10, school: "TH Pú Nhung", sponsor: "Trần Văn An", province: "Điện Biên", status: "active", joinedAt: "2024-09" },
  { id: "HS002", name: "Giàng A Páo", age: 12, school: "TH Nậm Pồ", sponsor: "Nguyễn Thị Bích", province: "Điện Biên", status: "active", joinedAt: "2024-10" },
  { id: "HS003", name: "Sùng Thị Mai", age: 9, school: "TH Mường Mươn", sponsor: "Lê Thị Hoa", province: "Lai Châu", status: "pending", joinedAt: "2025-01" },
  { id: "HS004", name: "Vừ A Chờ", age: 11, school: "TH Pha Long", sponsor: "Phạm Minh Tú", province: "Lào Cai", status: "active", joinedAt: "2024-08" },
  { id: "HS005", name: "Lý Thị Xua", age: 13, school: "THCS Trạm Tấu", sponsor: "Hoàng Anh Khoa", province: "Yên Bái", status: "inactive", joinedAt: "2023-11" },
];

const COLUMNS: Column<Student>[] = [
  { key: "id", header: "Mã HS", width: "w-24" },
  { key: "name", header: "Họ và tên" },
  { key: "age", header: "Tuổi", align: "center", width: "w-16" },
  { key: "school", header: "Trường học" },
  { key: "sponsor", header: "Nhà tài trợ" },
  { key: "province", header: "Tỉnh/TP" },
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

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const filtered = SEED_DATA.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.school.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell
      title="Danh sách Học sinh"
      subtitle={`${SEED_DATA.length} học sinh đang được hỗ trợ`}
      icon={GraduationCap}
      iconColor="bg-primary-900/10 text-primary-900"
    >
      <ListToolbar
        searchPlaceholder="Tìm theo tên, mã HS, trường..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Thêm học sinh"
        onAdd={() => {}}
      />
      <DataTable<Student>
        columns={COLUMNS}
        rows={filtered}
        rowKey="id"
        emptyLabel="Không tìm thấy học sinh phù hợp"
      />
    </PageShell>
  );
}