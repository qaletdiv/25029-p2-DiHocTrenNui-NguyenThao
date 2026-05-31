"use client";

import React, { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Save,
  Trash2,
  CheckCircle2,
  XCircle,
  Pencil,
  Banknote,
  Clock,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import DataTable, { Column } from "@/components/member/common/DataTable";
import StatusBadge from "@/components/member/common/StatusBadge";
import ListToolbar from "@/components/member/common/ListToolbar";
import { usePermission } from "@/contexts/PermissionContext";
import {
  Transaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  CreateTransactionPayload,
} from "@/services/transactions";
import { Sponsor } from "@/services/sponsors";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const PAGE_SIZE_OPTIONS = [5, 10, 20];

const STATUS_MAP: Record<number, { code: string; label: string }> = {
  1: { code: "pending", label: "Đang chờ" },
  2: { code: "verified", label: "Đã xác minh" },
  3: { code: "rejected", label: "Đã từ chối" },
};

const ALL_STATUSES = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "1", label: "Đang chờ" },
  { value: "2", label: "Đã xác minh" },
  { value: "3", label: "Đã từ chối" },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

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
        <span className="font-semibold text-gray-700">{total}</span> giao dịch
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
            .filter(
              (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
            )
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
// Transaction Form Modal
// ─────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTransactionPayload) => Promise<void>;
  sponsors: Sponsor[];
  initial?: Transaction | null;
  title: string;
  submitLabel: string;
}

function TransactionModal({
  open,
  onClose,
  onSubmit,
  sponsors,
  initial,
  title,
  submitLabel,
}: ModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);

    const payload: CreateTransactionPayload = {
      transfer_date: fd.get("transfer_date") as string,
      amount: Number(fd.get("amount")),
      transfer_content: fd.get("transfer_content") as string,
      status_id: Number(fd.get("status_id")),
    };

    const sponsorId = fd.get("sponsor_id");
    if (sponsorId && String(sponsorId) !== "") payload.sponsor_id = Number(sponsorId);
    const bankName = fd.get("bank_name") as string;
    if (bankName) payload.bank_name = bankName;
    const accountNumber = fd.get("account_number") as string;
    if (accountNumber) payload.account_number = accountNumber;
    const transactionCode = fd.get("transaction_code") as string;
    if (transactionCode) payload.transaction_code = transactionCode;

    try {
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi.");
    } finally {
      setSaving(false);
    }
  };

  // Format initial date for the date input (needs YYYY-MM-DD)
  const initialDate = initial?.transfer_date
    ? new Date(initial.transfer_date).toISOString().split("T")[0]
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Ngày chuyển khoản *
              </label>
              <input
                type="date"
                name="transfer_date"
                required
                defaultValue={initialDate}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Số tiền (VNĐ) *
              </label>
              <input
                type="number"
                name="amount"
                required
                min={0}
                defaultValue={initial?.amount ?? ""}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Nội dung chuyển khoản *
            </label>
            <input
              type="text"
              name="transfer_content"
              required
              defaultValue={initial?.transfer_content ?? ""}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
            />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Trạng thái *
              </label>
              <select
                name="status_id"
                required
                defaultValue={initial?.status_id ?? 1}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 bg-white"
              >
                <option value={1}>Đang chờ</option>
                <option value={2}>Đã xác minh</option>
                <option value={3}>Đã từ chối</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Nhà tài trợ
              </label>
              <select
                name="sponsor_id"
                defaultValue={initial?.sponsor_id ?? ""}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 bg-white"
              >
                <option value="">-- Không chọn --</option>
                {sponsors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4 – Bank details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Mã giao dịch
              </label>
              <input
                type="text"
                name="transaction_code"
                defaultValue={initial?.transaction_code ?? ""}
                placeholder="TX1001"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Ngân hàng
              </label>
              <input
                type="text"
                name="bank_name"
                defaultValue={initial?.bank_name ?? ""}
                placeholder="Vietcombank"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Số tài khoản
              </label>
              <input
                type="text"
                name="account_number"
                defaultValue={initial?.account_number ?? ""}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <X size={15} /> Huỷ
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 shadow-sm transition-colors disabled:opacity-50"
            >
              <Save size={15} /> {saving ? "Đang lưu..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Delete Confirm Modal
// ─────────────────────────────────────────────
function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  transactionId,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  transactionId: number | null;
}) {
  const [deleting, setDeleting] = useState(false);

  if (!open || transactionId === null) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-xl">
            <Trash2 size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">
              Xóa giao dịch
            </h3>
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa giao dịch #{transactionId}?
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 shadow-sm transition-colors disabled:opacity-50"
          >
            {deleting ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}

const SEARCH_DEBOUNCE_MS = 400;

// ─────────────────────────────────────────────
// Main Client Component
// ─────────────────────────────────────────────
interface Props {
  transactions: Transaction[];
  sponsors: Sponsor[];
  total: number;
  initialPage: number;
  initialPageSize: number;
  initialSearch: string;
}

export default function TransactionListClient({
  transactions: initialTransactions,
  sponsors,
  total: initialTotal,
  initialPage,
  initialPageSize,
  initialSearch,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { hasPermission } = usePermission();

  // Local state that gets refreshed on server refetch
  const [transactions, setTransactions] = useState(initialTransactions);
  const [total, setTotal] = useState(initialTotal);

  // Keep state in sync when props change (e.g. after router.refresh())
  React.useEffect(() => {
    setTransactions(initialTransactions);
    setTotal(initialTotal);
  }, [initialTransactions, initialTotal]);

  // Filter state
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("");
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTxId, setDeletingTxId] = useState<number | null>(null);

  const page = initialPage;
  const pageSize = initialPageSize;

  // Keep local state in sync when URL-driven props change
  React.useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const navigateWithParams = React.useCallback(
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
  const handleSearch = React.useCallback(
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
  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleStatus = (v: string) => {
    setStatusFilter(v);
  };

  // Derived: filtered rows (client-side status filter only)
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchStatus =
        !statusFilter || String(t.status_id) === statusFilter;
      return matchStatus;
    });
  }, [statusFilter, transactions]);

  // Summary stats
  const summaryStats = useMemo(() => {
    const verifiedAmount = transactions
      .filter((t) => t.status_id === 2)
      .reduce((sum, t) => sum + t.amount, 0);
    const pendingCount = transactions.filter(
      (t) => t.status_id === 1
    ).length;
    const rejectedCount = transactions.filter(
      (t) => t.status_id === 3
    ).length;
    return { verifiedAmount, pendingCount, rejectedCount };
  }, [transactions]);

  // Actions
  const handleCreate = async (payload: CreateTransactionPayload) => {
    await createTransaction(payload);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleEdit = async (payload: CreateTransactionPayload) => {
    if (!editingTx) return;
    await updateTransaction(editingTx.id, payload);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = async () => {
    if (deletingTxId === null) return;
    await deleteTransaction(deletingTxId);
    setDeletingTxId(null);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleQuickStatusUpdate = async (
    txId: number,
    newStatusId: number
  ) => {
    await updateTransaction(txId, { status_id: newStatusId });
    startTransition(() => {
      router.refresh();
    });
  };

  // Column definitions
  const columns: Column<Transaction>[] = [
    {
      key: "id",
      header: "Mã GD",
      width: "w-24",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-primary-900 bg-primary-900/8 px-2 py-0.5 rounded-md">
          #{row.transaction_code || `GD${row.id}`}
        </span>
      ),
    },
    {
      key: "transfer_date",
      header: "Ngày",
      align: "center",
      width: "w-28",
      render: (row) => (
        <span className="text-gray-600 text-sm">
          {formatDate(row.transfer_date)}
        </span>
      ),
    },
    {
      key: "transfer_content",
      header: "Nội dung",
      render: (row) => (
        <span
          className="text-gray-800 font-medium text-sm truncate max-w-[300px] block"
          title={row.transfer_content}
        >
          {row.transfer_content}
        </span>
      ),
    },
    {
      key: "bank_name",
      header: "Ngân hàng",
      width: "w-32",
      render: (row) => (
        <span className="text-gray-600 text-sm">
          {row.bank_name || "—"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Số tiền",
      align: "right",
      width: "w-36",
      render: (row) => (
        <span className="font-semibold text-gray-800 text-sm">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: "status_id",
      header: "Trạng thái",
      align: "center",
      width: "w-32",
      render: (row) => {
        const status = STATUS_MAP[row.status_id];
        return (
          <StatusBadge status={status?.code || "pending"} />
        );
      },
    },
    {
      key: "actions",
      header: "",
      align: "right",
      width: "w-28",
      render: (row) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick Verify – only for pending */}
          {row.status_id === 1 && (
            <button
              onClick={() => handleQuickStatusUpdate(row.id, 2)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
              title="Xác minh"
            >
              <CheckCircle2 size={15} />
            </button>
          )}
          {/* Quick Reject – only for pending */}
          {row.status_id === 1 && (
            <button
              onClick={() => handleQuickStatusUpdate(row.id, 3)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Từ chối"
            >
              <XCircle size={15} />
            </button>
          )}
          {/* Edit */}
          <button
            onClick={() => setEditingTx(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
            title="Sửa"
          >
            <Pencil size={15} />
          </button>
          {/* Delete */}
          <button
            onClick={() => setDeletingTxId(row.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Xóa"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* ── Summary chips ── */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-sky-50 border border-sky-100 rounded-xl text-sm">
          <ShieldCheck size={16} className="text-sky-600" />
          <span className="font-semibold text-sky-700">Đã xác minh:</span>
          <span className="font-bold text-sky-800">
            {formatCurrency(summaryStats.verifiedAmount)}
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-yellow-50 border border-yellow-100 rounded-xl text-sm">
          <Clock size={16} className="text-yellow-600" />
          <span className="font-semibold text-yellow-700">Đang chờ:</span>
          <span className="font-bold text-yellow-800">
            {summaryStats.pendingCount} giao dịch
          </span>
        </div>
        {summaryStats.rejectedCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm">
            <XCircle size={16} className="text-red-500" />
            <span className="font-semibold text-red-600">Đã từ chối:</span>
            <span className="font-bold text-red-700">
              {summaryStats.rejectedCount} giao dịch
            </span>
          </div>
        )}
      </div>

      {/* ── Toolbar: search + filters ── */}
      <ListToolbar
        searchPlaceholder="Tìm theo nội dung, mã giao dịch, ngân hàng..."
        searchValue={search}
        onSearchChange={handleSearch}
        addLabel="Thêm giao dịch"
        onAdd={hasPermission("BANK_TRANSACTION_CREATE") ? () => setShowCreateModal(true) : undefined}
        extras={
          <div className="flex items-center gap-2">
            <FilterSelect
              id="filter-status"
              value={statusFilter}
              onChange={handleStatus}
              options={ALL_STATUSES}
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
        <DataTable<Transaction>
          columns={columns}
          rows={filtered}
          rowKey="id"
          emptyLabel="Không tìm thấy giao dịch phù hợp"
          stickyHeader
          onRowClick={(row) => router.push(`/transactions/${row.id}`)}
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

      {/* ── Create Modal ── */}
      <TransactionModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        sponsors={sponsors}
        title="Thêm giao dịch mới"
        submitLabel="Lưu giao dịch"
      />

      {/* ── Edit Modal ── */}
      <TransactionModal
        key={editingTx?.id ?? "edit"}
        open={!!editingTx}
        onClose={() => setEditingTx(null)}
        onSubmit={handleEdit}
        sponsors={sponsors}
        initial={editingTx}
        title={`Sửa giao dịch #${editingTx?.transaction_code || editingTx?.id || ""}`}
        submitLabel="Cập nhật"
      />

      {/* ── Delete Modal ── */}
      <DeleteConfirmModal
        open={deletingTxId !== null}
        onClose={() => setDeletingTxId(null)}
        onConfirm={handleDelete}
        transactionId={deletingTxId}
      />
    </>
  );
}
