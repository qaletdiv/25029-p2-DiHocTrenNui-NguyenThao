"use client";

import React, { useState } from "react";
import { HandHeart, Eye, Pencil, Trash2 } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import ListToolbar from "@/components/member/common/ListToolbar";
import DataTable, { Column } from "@/components/member/common/DataTable";
import StatusBadge from "@/components/member/common/StatusBadge";

interface Sponsor {
  id: string;
  name: string;
  phone: string;
  city: string;
  students: number;
  totalDonated: string;
  status: string;
  joinedAt: string;
}

const SEED_DATA: Sponsor[] = [
  { id: "NTT001", name: "Trần Văn An", phone: "0901 234 567", city: "TP. Đà Nẵng", students: 2, totalDonated: "4.800.000 ₫", status: "active", joinedAt: "2023-06" },
  { id: "NTT002", name: "Nguyễn Thị Bích", phone: "0912 345 678", city: "TP. HCM", students: 1, totalDonated: "2.400.000 ₫", status: "active", joinedAt: "2024-01" },
  { id: "NTT003", name: "Lê Minh Tuấn", phone: "0933 456 789", city: "Hà Nội", students: 3, totalDonated: "7.200.000 ₫", status: "verified", joinedAt: "2023-09" },
  { id: "NTT004", name: "Phạm Thị Hoa", phone: "0944 567 890", city: "Cần Thơ", students: 1, totalDonated: "2.400.000 ₫", status: "pending", joinedAt: "2025-02" },
  { id: "NTT005", name: "Vũ Hoàng Nam", phone: "0955 678 901", city: "Hải Phòng", students: 2, totalDonated: "4.200.000 ₫", status: "inactive", joinedAt: "2022-11" },
];

const COLUMNS: Column<Sponsor>[] = [
  { key: "id", header: "Mã NTT", width: "w-28" },
  { key: "name", header: "Họ và tên" },
  { key: "phone", header: "Điện thoại" },
  { key: "city", header: "Thành phố" },
  { key: "students", header: "Số HS", align: "center", width: "w-20" },
  { key: "totalDonated", header: "Tổng đóng góp", align: "right" },
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

export default function SponsorsPage() {
  const [search, setSearch] = useState("");
  const filtered = SEED_DATA.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell
      title="Danh sách Nhà tài trợ"
      subtitle={`${SEED_DATA.length} nhà tài trợ đang đồng hành`}
      icon={HandHeart}
      iconColor="bg-accent-yellow/20 text-yellow-700"
    >
      <ListToolbar
        searchPlaceholder="Tìm theo tên, mã NTT, thành phố..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Thêm nhà tài trợ"
        onAdd={() => {}}
      />
      <DataTable<Sponsor>
        columns={COLUMNS}
        rows={filtered}
        rowKey="id"
        emptyLabel="Không tìm thấy nhà tài trợ phù hợp"
      />
    </PageShell>
  );
}