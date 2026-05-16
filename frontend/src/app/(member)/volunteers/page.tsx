"use client";

import React, { useState } from "react";
import { Users, Eye, Pencil, Trash2 } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import ListToolbar from "@/components/member/common/ListToolbar";
import DataTable, { Column } from "@/components/member/common/DataTable";
import StatusBadge from "@/components/member/common/StatusBadge";

interface Volunteer {
  id: string;
  name: string;
  role: string;
  city: string;
  trips: number;
  phone: string;
  status: string;
  joinedAt: string;
}

const SEED_DATA: Volunteer[] = [
  { id: "TNV001", name: "Phan Anh Vũ", role: "Trưởng đoàn", city: "Đà Nẵng", trips: 8, phone: "0901 234 001", status: "active", joinedAt: "2022-03" },
  { id: "TNV002", name: "Trịnh Thị Thu", role: "Hậu cần", city: "TP. HCM", trips: 5, phone: "0912 345 002", status: "active", joinedAt: "2023-05" },
  { id: "TNV003", name: "Lý Minh Khoa", role: "Chụp ảnh", city: "Hà Nội", trips: 3, phone: "0933 456 003", status: "active", joinedAt: "2024-02" },
  { id: "TNV004", name: "Bùi Thị Quỳnh", role: "Phiên dịch", city: "Đà Nẵng", trips: 6, phone: "0944 567 004", status: "inactive", joinedAt: "2021-09" },
  { id: "TNV005", name: "Đinh Công Sáng", role: "Y tế", city: "Huế", trips: 2, phone: "0955 678 005", status: "pending", joinedAt: "2025-01" },
];

const COLUMNS: Column<Volunteer>[] = [
  { key: "id", header: "Mã TNV", width: "w-28" },
  { key: "name", header: "Họ và tên" },
  { key: "role", header: "Vai trò" },
  { key: "city", header: "Thành phố" },
  { key: "trips", header: "Chuyến đi", align: "center", width: "w-24" },
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

export default function VolunteersPage() {
  const [search, setSearch] = useState("");
  const filtered = SEED_DATA.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.role.toLowerCase().includes(search.toLowerCase()) ||
      v.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell
      title="Danh sách Tình nguyện viên"
      subtitle={`${SEED_DATA.length} tình nguyện viên đã đăng ký`}
      icon={Users}
      iconColor="bg-violet-100 text-violet-700"
    >
      <ListToolbar
        searchPlaceholder="Tìm theo tên, vai trò, thành phố..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Thêm tình nguyện viên"
        onAdd={() => {}}
      />
      <DataTable<Volunteer>
        columns={COLUMNS}
        rows={filtered}
        rowKey="id"
        emptyLabel="Không tìm thấy tình nguyện viên phù hợp"
      />
    </PageShell>
  );
}