"use client";

import React, { useState } from "react";
import { Receipt, Eye, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import PageShell from "@/components/member/common/PageShell";
import ListToolbar from "@/components/member/common/ListToolbar";
import DataTable, { Column } from "@/components/member/common/DataTable";

type TxType = "income" | "expense";

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: TxType;
  amount: string;
  category: string;
  reference: string;
  createdBy: string;
}

const SEED_DATA: Transaction[] = [
  { id: "TX001", date: "2024-09-01", description: "Chuyển học bổng T9 - Hồ Thị Lan", type: "expense", amount: "400.000 ₫", category: "Học bổng", reference: "HS001", createdBy: "Admin" },
  { id: "TX002", date: "2024-09-05", description: "Đóng góp từ Trần Văn An", type: "income", amount: "800.000 ₫", category: "Tài trợ", reference: "NTT001", createdBy: "Admin" },
  { id: "TX003", date: "2024-09-10", description: "Mua sách vở cho TH Pú Nhung", type: "expense", amount: "2.350.000 ₫", category: "Vật tư", reference: "TR001", createdBy: "Admin" },
  { id: "TX004", date: "2024-10-01", description: "Đóng góp từ Lê Minh Tuấn", type: "income", amount: "2.400.000 ₫", category: "Tài trợ", reference: "NTT003", createdBy: "Admin" },
  { id: "TX005", date: "2024-10-15", description: "Chi phí chuyến đi Điện Biên", type: "expense", amount: "8.500.000 ₫", category: "Hoạt động", reference: "TNV001", createdBy: "Phan Anh Vũ" },
  { id: "TX006", date: "2024-11-01", description: "Chuyển học bổng T11 - 5 em", type: "expense", amount: "2.000.000 ₫", category: "Học bổng", reference: "BATCH-NOV", createdBy: "Admin" },
];

const TypeBadge = ({ type }: { type: TxType }) =>
  type === "income" ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
      <ArrowDownCircle size={12} /> Thu
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-600">
      <ArrowUpCircle size={12} /> Chi
    </span>
  );

const COLUMNS: Column<Transaction>[] = [
  { key: "id", header: "Mã GD", width: "w-24" },
  { key: "date", header: "Ngày", align: "center", width: "w-28" },
  { key: "description", header: "Mô tả" },
  { key: "category", header: "Phân loại" },
  {
    key: "type",
    header: "Loại",
    align: "center",
    width: "w-20",
    render: (row) => <TypeBadge type={row.type} />,
  },
  { key: "amount", header: "Số tiền", align: "right" },
  { key: "reference", header: "Tham chiếu", align: "center" },
  { key: "createdBy", header: "Người tạo" },
  {
    key: "actions",
    header: "",
    align: "right",
    width: "w-12",
    render: () => (
      <button className="p-1.5 rounded-lg text-gray-400 hover:text-sky-600 hover:bg-sky-50 transition-colors" aria-label="Xem">
        <Eye size={15} />
      </button>
    ),
  },
];

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const filtered = SEED_DATA.filter(
    (t) =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalIncome = SEED_DATA.filter((t) => t.type === "income")
    .reduce((_, __) => 0, 0); // placeholder — real total from API

  return (
    <PageShell
      title="Danh sách Giao dịch"
      subtitle={`${SEED_DATA.length} giao dịch được ghi nhận`}
      icon={Receipt}
      iconColor="bg-orange-100 text-orange-700"
    >
      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-xl text-sm">
          <ArrowDownCircle size={16} className="text-green-600" />
          <span className="font-semibold text-green-700">Tổng thu:</span>
          <span className="font-bold text-green-800">3.200.000 ₫</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-sm">
          <ArrowUpCircle size={16} className="text-red-500" />
          <span className="font-semibold text-red-600">Tổng chi:</span>
          <span className="font-bold text-red-700">13.250.000 ₫</span>
        </div>
      </div>

      <ListToolbar
        searchPlaceholder="Tìm theo mô tả, mã GD, phân loại..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Thêm giao dịch"
        onAdd={() => {}}
      />
      <DataTable<Transaction>
        columns={COLUMNS}
        rows={filtered}
        rowKey="id"
        emptyLabel="Không tìm thấy giao dịch phù hợp"
      />
    </PageShell>
  );
}