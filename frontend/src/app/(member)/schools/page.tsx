"use client";

import React, { useState } from "react";
import { School, Eye, Pencil, Trash2 } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import ListToolbar from "@/components/member/common/ListToolbar";
import DataTable, { Column } from "@/components/member/common/DataTable";
import StatusBadge from "@/components/member/common/StatusBadge";

interface School {
  id: string;
  name: string;
  level: string;
  district: string;
  province: string;
  students: number;
  teachers: number;
  status: string;
}

const SEED_DATA: School[] = [
  { id: "TR001", name: "TH Pú Nhung", level: "Tiểu học", district: "Tuần Giáo", province: "Điện Biên", students: 12, teachers: 3, status: "active" },
  { id: "TR002", name: "TH Nậm Pồ", level: "Tiểu học", district: "Nậm Pồ", province: "Điện Biên", students: 8, teachers: 2, status: "active" },
  { id: "TR003", name: "THCS Trạm Tấu", level: "THCS", district: "Trạm Tấu", province: "Yên Bái", students: 20, teachers: 5, status: "active" },
  { id: "TR004", name: "TH Pha Long", level: "Tiểu học", district: "Mường Khương", province: "Lào Cai", students: 15, teachers: 4, status: "active" },
  { id: "TR005", name: "TH Mường Mươn", level: "Tiểu học", district: "Mường Chà", province: "Điện Biên", students: 7, teachers: 2, status: "pending" },
];

const COLUMNS: Column<School>[] = [
  { key: "id", header: "Mã trường", width: "w-24" },
  { key: "name", header: "Tên trường" },
  { key: "level", header: "Cấp học" },
  { key: "district", header: "Huyện" },
  { key: "province", header: "Tỉnh" },
  { key: "students", header: "HS", align: "center", width: "w-16" },
  { key: "teachers", header: "GV", align: "center", width: "w-16" },
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

export default function SchoolsPage() {
  const [search, setSearch] = useState("");
  const filtered = SEED_DATA.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.province.toLowerCase().includes(search.toLowerCase()) ||
      s.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell
      title="Danh sách Trường học"
      subtitle={`${SEED_DATA.length} trường đang được hỗ trợ`}
      icon={School}
      iconColor="bg-emerald-100 text-emerald-700"
    >
      <ListToolbar
        searchPlaceholder="Tìm theo tên trường, huyện, tỉnh..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Thêm trường học"
        onAdd={() => {}}
      />
      <DataTable<School>
        columns={COLUMNS}
        rows={filtered}
        rowKey="id"
        emptyLabel="Không tìm thấy trường học phù hợp"
      />
    </PageShell>
  );
}