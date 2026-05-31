"use client";

import React, { useState, useEffect, useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import {
  ArrowLeft,
  Pencil,
  Check,
  X,
  Receipt,
  Calendar,
  DollarSign,
  FileText,
  User,
  CreditCard,
  Clock,
  ShieldCheck,
  XCircle,
  Trash2,
} from "lucide-react";
import StatusBadge from "@/components/member/common/StatusBadge";
import {
  Transaction,
  updateTransactionAction,
  deleteTransactionAction,
  updateTransaction,
} from "@/services/transactions";
import { Sponsor } from "@/services/sponsors";
import { fmtDateTime, fmtAmount, fmtDate } from "@/hooks/convertData";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const STATUS_MAP: Record<number, { code: string; label: string }> = {
  1: { code: "pending", label: "Đang chờ" },
  2: { code: "verified", label: "Đã xác minh" },
  3: { code: "rejected", label: "Đã từ chối" },
};

// ─────────────────────────────────────────────
// Pure UI Sub-components
// ─────────────────────────────────────────────
function InfoRow({
  label,
  value,
  editNode,
  isEditing,
}: {
  label: string;
  value: React.ReactNode;
  editNode?: React.ReactNode;
  isEditing: boolean;
}) {
  return (
    <div className="py-3.5 grid grid-cols-[140px_1fr] gap-4 border-b border-gray-100 last:border-0 items-start">
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-0.5">
        {label}
      </dt>
      <dd className="text-sm text-gray-800">
        {isEditing && editNode ? editNode : value || <span className="text-gray-400">—</span>}
      </dd>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
        <div className="w-7 h-7 rounded-lg bg-primary-900/10 text-primary-900 flex items-center justify-center flex-shrink-0">
          <Icon size={15} strokeWidth={2} />
        </div>
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <dl className="px-5">{children}</dl>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 shadow-sm transition-colors disabled:opacity-50"
    >
      <Check size={15} /> {pending ? "Đang lưu..." : "Lưu thay đổi"}
    </button>
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
  transactionId: number;
}) {
  const [deleting, setDeleting] = useState(false);

  if (!open) return null;

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
              Bạn có chắc chắn muốn xóa giao dịch #{transactionId}? Hành động này không thể hoàn tác.
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

// ─────────────────────────────────────────────
// Main Client Component
// ─────────────────────────────────────────────
interface Props {
  transaction: Transaction;
  sponsors: Sponsor[];
}

export default function TransactionDetailClient({ transaction, sponsors }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Pre-bind the action with the transaction ID
  const updateActionWithId = updateTransactionAction.bind(null, transaction.id);
  const [state, formAction] = useActionState(updateActionWithId, { success: false, message: "" });

  // Turn off edit mode and refresh data on successful save
  useEffect(() => {
    if (state.success && isEditing) {
      setIsEditing(false);
      router.refresh();
    }
  }, [state.success, router]);

  function handleCancel() {
    setIsEditing(false);
  }

  const handleDelete = async () => {
    const res = await deleteTransactionAction(transaction.id);
    if (res.success) {
      setShowDeleteModal(false);
      router.push("/transactions");
    } else {
      alert(res.message || "Không thể xóa giao dịch.");
    }
  };

  const handleQuickStatusUpdate = async (newStatusId: number) => {
    try {
      await updateTransaction(transaction.id, { status_id: newStatusId });
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      alert(err.message || "Không thể cập nhật trạng thái.");
    }
  };

  const sponsor = sponsors.find((s) => s.id === transaction.sponsor_id);
  const status = STATUS_MAP[transaction.status_id];

  // Format initial date for input fields
  const initialDate = transaction.transfer_date
    ? new Date(transaction.transfer_date).toISOString().split("T")[0]
    : "";

  return (
    <form action={formAction} className="space-y-6">
      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push("/transactions")}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-900 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Quay lại danh sách
        </button>

        <div className="flex items-center gap-2">
          {!state.success && state.message && (
            <span className="text-xs text-red-600 font-medium">{state.message}</span>
          )}

          {/* Quick Actions (only show if not editing and status is pending) */}
          {!isEditing && transaction.status_id === 1 && (
            <>
              <button
                type="button"
                onClick={() => handleQuickStatusUpdate(2)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm font-semibold hover:bg-emerald-100/50 transition-colors"
                title="Xác minh nhanh"
              >
                <ShieldCheck size={15} /> Xác minh
              </button>
              <button
                type="button"
                onClick={() => handleQuickStatusUpdate(3)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm font-semibold hover:bg-red-100/50 transition-colors"
                title="Từ chối nhanh"
              >
                <XCircle size={15} /> Từ chối
              </button>
            </>
          )}

          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <X size={15} /> Huỷ
              </button>
              <SubmitButton />
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 shadow-sm transition-colors"
              >
                <Pencil size={15} /> Chỉnh sửa
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 shadow-sm transition-colors"
              >
                <Trash2 size={15} /> Xóa
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Transaction hero card ── */}
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400" />

        <div className="px-6 pb-6">
          {/* Icon / Avatar placement */}
          <div className="-mt-10 mb-4 flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 text-2xl font-bold">
              <Receipt size={32} />
            </div>
            <div className="pb-1">
              <StatusBadge status={status?.code || "pending"} />
            </div>
          </div>

          {/* Title & amount info */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              {isEditing ? (
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Số tiền (VNĐ)</label>
                  <input
                    type="number"
                    name="amount"
                    defaultValue={transaction.amount}
                    required
                    className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-primary-700 focus:outline-none w-full"
                  />
                </div>
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">{fmtAmount(transaction.amount)}</h2>
              )}
              <p className="mt-0.5 text-sm text-gray-500 font-mono">
                #{transaction.transaction_code || `GD${transaction.id}`}
              </p>
            </div>

            <div className="flex gap-3 flex-wrap text-xs text-gray-500">
              <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                Ngày chuyển: {fmtDate(transaction.transfer_date)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info sections ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Transaction Details */}
        <SectionCard icon={FileText} title="Thông tin giao dịch">
          <InfoRow
            label="Nội dung chuyển"
            isEditing={isEditing}
            value={transaction.transfer_content}
            editNode={
              <input
                type="text"
                name="transfer_content"
                defaultValue={transaction.transfer_content}
                required
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors"
              />
            }
          />
          <InfoRow
            label="Số tiền"
            isEditing={isEditing}
            value={
              <span className="font-semibold text-gray-800 text-sm">
                {fmtAmount(transaction.amount)}
              </span>
            }
            editNode={
              <input
                type="number"
                name="amount"
                defaultValue={transaction.amount}
                required
                min={0}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors"
              />
            }
          />
          <InfoRow
            label="Ngày chuyển"
            isEditing={isEditing}
            value={fmtDate(transaction.transfer_date)}
            editNode={
              <input
                type="date"
                name="transfer_date"
                defaultValue={initialDate}
                required
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors"
              />
            }
          />
          <InfoRow
            label="Trạng thái"
            isEditing={isEditing}
            value={
              <span className="font-medium text-sm">
                {status?.label || "Đang chờ"}
              </span>
            }
            editNode={
              <select
                name="status_id"
                defaultValue={transaction.status_id}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              >
                <option value={1}>Đang chờ</option>
                <option value={2}>Đã xác minh</option>
                <option value={3}>Đã từ chối</option>
              </select>
            }
          />
          <InfoRow
            label="Mã giao dịch"
            isEditing={isEditing}
            value={
              <span className="font-mono text-xs font-semibold text-primary-900 bg-primary-900/10 px-2 py-0.5 rounded-md">
                {transaction.transaction_code || "—"}
              </span>
            }
            editNode={
              <input
                type="text"
                name="transaction_code"
                defaultValue={transaction.transaction_code || ""}
                placeholder="Ví dụ: TX1001"
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors"
              />
            }
          />
        </SectionCard>

        <div className="flex flex-col gap-5">
          {/* Bank & Sponsor info */}
          <SectionCard icon={CreditCard} title="Tài khoản & Nhà tài trợ">
            <InfoRow
              label="Ngân hàng"
              isEditing={isEditing}
              value={transaction.bank_name || "—"}
              editNode={
                <input
                  type="text"
                  name="bank_name"
                  defaultValue={transaction.bank_name || ""}
                  placeholder="Ví dụ: Vietcombank"
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors"
                />
              }
            />
            <InfoRow
              label="Số tài khoản"
              isEditing={isEditing}
              value={transaction.account_number || "—"}
              editNode={
                <input
                  type="text"
                  name="account_number"
                  defaultValue={transaction.account_number || ""}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors"
                />
              }
            />
            <InfoRow
              label="Nhà tài trợ"
              isEditing={isEditing}
              value={
                sponsor ? (
                  <button
                    type="button"
                    onClick={() => router.push(`/sponsors/${sponsor.id}`)}
                    className="text-primary-900 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <User size={13} />
                    {sponsor.full_name}
                  </button>
                ) : (
                  <span className="text-gray-400">Không liên kết</span>
                )
              }
              editNode={
                <select
                  name="sponsor_id"
                  defaultValue={transaction.sponsor_id ?? ""}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
                >
                  <option value="">-- Không chọn --</option>
                  {sponsors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name}
                    </option>
                  ))}
                </select>
              }
            />
          </SectionCard>

          {/* System & Verification Info */}
          <SectionCard icon={Clock} title="Hệ thống & Xác minh">
            <InfoRow
              label="Trạng thái xác minh"
              isEditing={false}
              value={
                transaction.status_id === 2 ? (
                  <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                    <ShieldCheck size={14} /> Đã xác minh
                  </span>
                ) : transaction.status_id === 3 ? (
                  <span className="text-red-600 font-semibold inline-flex items-center gap-1">
                    <XCircle size={14} /> Đã từ chối
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold inline-flex items-center gap-1">
                    <Clock size={14} /> Đang chờ duyệt
                  </span>
                )
              }
            />
            {transaction.verified_by && (
              <InfoRow
                label="Xác minh bởi"
                isEditing={false}
                value={`ID Tài khoản #${transaction.verified_by}`}
              />
            )}
            {transaction.verified_at && (
              <InfoRow
                label="Ngày xác minh"
                isEditing={false}
                value={fmtDateTime(transaction.verified_at)}
              />
            )}
            {transaction.created_at && (
              <InfoRow
                label="Ngày tạo hệ thống"
                isEditing={false}
                value={fmtDateTime(transaction.created_at)}
              />
            )}
          </SectionCard>
        </div>
      </div>

      {/* Delete modal */}
      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        transactionId={transaction.id}
      />
    </form>
  );
}
