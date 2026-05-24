"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Check,
  X,
  User,
  GraduationCap,
  Heart,
  BookUser,
  Receipt,
  Wallet,
  Calendar,
  CircleDollarSign,
  Info,
  Clock,
  TrendingDown,
  Trash2,
} from "lucide-react";
import StatusBadge from "@/components/member/common/StatusBadge";
import { Disbursement, updateDisbursement, UpdateDisbursementPayload, deleteDisbursement } from "@/services/disbursements";
import { fmtAmount, fmtDate, fmtDateTime } from "@/hooks/convertData";
import { DISBURSEMENT_STATUS, DISBURSEMENT_STATUS_TRANSLATIONS } from "@/hooks/constants";


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

function EditInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors"
    />
  );
}

function SectionCard({
  icon: Icon,
  title,
  children,
  accentColor = "bg-primary-900/10 text-primary-900",
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${accentColor}`}>
          <Icon size={15} strokeWidth={2} />
        </div>
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <dl className="px-5">{children}</dl>
    </div>
  );
}

function BudgetBar({ allocated, total }: { allocated: number; total: number }) {
  const pct = total > 0 ? Math.min((allocated / total) * 100, 100) : 0;
  const isOverBudget = allocated > total;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-gray-500">Đã phân bổ: {fmtAmount(allocated)}</span>
        <span className={isOverBudget ? "text-red-600 font-bold" : "text-gray-500"}>
          Còn lại: {fmtAmount(total - allocated)}
        </span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isOverBudget ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-teal-500"
          }`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 text-right">{pct.toFixed(1)}% đã sử dụng</p>
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
  allocationId,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  allocationId: number;
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
              Xóa phân bổ
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Bạn có chắc chắn muốn xóa phân bổ #{allocationId}? Hành động này không thể hoàn tác.
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
// Edit-form state shape
// ─────────────────────────────────────────────
interface FormState {
  student_id: string;
  teacher_id: string;
  bank_transaction_id: string;
  sponsor_student_id: string;
  amount: string;
  support_month: string;
  support_year: string;
  status: string;
  delivered_at: string;
}

function toForm(d: Disbursement): FormState {
  return {
    student_id: d.student_id || "",
    teacher_id: String(d.teacher_id || ""),
    bank_transaction_id: String(d.bank_transaction_id || ""),
    sponsor_student_id: String(d.sponsor_student_id || ""),
    amount: String(d.amount || 0),
    support_month: String(d.support_month || ""),
    support_year: String(d.support_year || ""),
    status: d.status || "HOLDING",
    delivered_at: d.delivered_at ? new Date(d.delivered_at).toISOString().substring(0, 10) : "",
  };
}

// ─────────────────────────────────────────────
// Main Client Component
// ─────────────────────────────────────────────
interface Props {
  disbursement: Disbursement;
  students: any[];
  teachers: any[];
  transactions: any[];
  budgetSummary: Record<string, {
    transaction_code: string;
    total_amount: number;
    allocated: number;
    remaining: number;
  }>;
}

export default function AllocationDetailClient({
  disbursement,
  students = [],
  teachers = [],
  transactions = [],
  budgetSummary = {},
}: Props) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [form, setForm] = useState<FormState>(toForm(disbursement));
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await deleteDisbursement(disbursement.id);
      setShowDeleteModal(false);
      router.push("/allocations");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Không thể xóa phân bổ.");
    }
  };


  const set = (field: keyof FormState, val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  // Extract related data from the disbursement response
  const studentDetail = disbursement.student as any;
  const sponsorDetail = disbursement.sponsor as any;
  const teacherDetail = disbursement.teacher as any;
  const transactionDetail = disbursement.transaction as any;
  const budgetInfo = disbursement.budget;

  // Find current budget info from budgetSummary
  const currentBudgetInfo = useMemo(() => {
    const selectedTxId = form.bank_transaction_id;
    if (!selectedTxId) return null;
    const summary = budgetSummary[selectedTxId];
    if (summary) {
      const isOriginalTx = Number(selectedTxId) === disbursement.bank_transaction_id;
      const otherAllocated = isOriginalTx 
        ? summary.allocated - disbursement.amount
        : summary.allocated;

      const currentAmount = Number(form.amount) || 0;
      const totalAmount = summary.total_amount;
      const newAllocated = otherAllocated + currentAmount;
      const newRemaining = totalAmount - newAllocated;

      return {
        transaction_code: summary.transaction_code,
        total_amount: totalAmount,
        allocated: isEditing ? newAllocated : summary.allocated,
        remaining: isEditing ? newRemaining : summary.remaining,
      };
    }

    return budgetInfo;
  }, [form.bank_transaction_id, form.amount, budgetSummary, budgetInfo, disbursement, isEditing]);

  async function handleSave() {
    setIsSaving(true);
    setSaveError(null);
    try {
      const payload: UpdateDisbursementPayload = {
        student_id: form.student_id,
        teacher_id: Number(form.teacher_id) || undefined,
        bank_transaction_id: Number(form.bank_transaction_id) || undefined,
        sponsor_student_id: Number(form.sponsor_student_id) || undefined,
        amount: Number(form.amount),
        support_month: Number(form.support_month),
        support_year: Number(form.support_year),
        status: form.status,
        delivered_at: form.delivered_at || undefined,
      };
      await updateDisbursement(disbursement.id, payload);
      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      setSaveError(err.message || "Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setForm(toForm(disbursement));
    setSaveError(null);
    setIsEditing(false);
  }


  return (
    <section className="space-y-6">
      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-900 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Quay lại danh sách
        </button>

        <div className="flex items-center gap-2">
          {saveError && (
            <span className="text-xs text-red-600 font-medium">{saveError}</span>
          )}
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <X size={15} /> Huỷ
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || (currentBudgetInfo?.remaining ?? 0) < 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 shadow-sm transition-colors disabled:opacity-50"
              >
                <Check size={15} /> {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 shadow-sm transition-colors"
              >
                <Pencil size={15} /> Chỉnh sửa
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 shadow-sm transition-colors"
              >
                <Trash2 size={15} /> Xóa
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Hero card ── */}
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-20 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-600" />

        <div className="px-6 pb-6">
          <div className="-mt-8 mb-4 flex items-end gap-4">
            <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-md bg-teal-900/10 text-teal-900 flex items-center justify-center flex-shrink-0">
              <Wallet size={28} strokeWidth={1.5} />
            </div>
            <div className="pb-1">
              <StatusBadge status={form.status} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Phân bổ #{disbursement.id}
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {disbursement.student_name} · {String(disbursement.support_month).padStart(2, "0")}/{disbursement.support_year}
              </p>
            </div>

            <div className="flex gap-3 flex-wrap text-xs text-gray-500">
              <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 rounded-full px-3 py-1 font-semibold">
                <CircleDollarSign size={12} />
                {fmtAmount(disbursement.amount)}
              </span>
              <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                <Calendar size={12} />
                T{disbursement.support_month}/{disbursement.support_year}
              </span>
              {disbursement.transaction_code && (
                <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 font-mono">
                  <Receipt size={12} />
                  {disbursement.transaction_code}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Budget Impact ── */}
      {currentBudgetInfo && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <TrendingDown size={15} strokeWidth={2} />
            </div>
            <h3 className="text-sm font-semibold text-gray-700">Ngân sách giao dịch</h3>
            <span className="ml-auto font-mono text-xs text-gray-400">{currentBudgetInfo.transaction_code}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-xs text-gray-400 font-medium">Tổng giao dịch</p>
              <p className="text-lg font-bold text-gray-800 mt-1">{fmtAmount(currentBudgetInfo.total_amount)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 font-medium">Sau phân bổ này</p>
              <p className="text-lg font-bold text-teal-700 mt-1">{fmtAmount(currentBudgetInfo.allocated)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 font-medium">Còn lại</p>
              <p className={`text-lg font-bold mt-1 ${
                currentBudgetInfo.remaining < 0 ? "text-red-600" : "text-amber-600"
              }`}>
                {fmtAmount(currentBudgetInfo.remaining)}
              </p>
            </div>
          </div>

          <BudgetBar
            allocated={currentBudgetInfo.allocated}
            total={currentBudgetInfo.total_amount}
          />
        </div>
      )}

      {/* ── Info sections ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Disbursement Info */}
        <SectionCard icon={Wallet} title="Thông tin phân bổ" accentColor="bg-teal-900/10 text-teal-900">
          <InfoRow
            label="Học sinh"
            isEditing={isEditing}
            value={
              <div>
                <span className="font-medium">{disbursement.student_name}</span>
                <span className="ml-2 font-mono text-xs text-gray-400">{disbursement.student_id}</span>
              </div>
            }
            editNode={
              <select
                value={form.student_id}
                onChange={(e) => set("student_id", e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              >
                <option value="">Chọn học sinh</option>
                {students.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name} ({s.id})
                  </option>
                ))}
              </select>
            }
          />
          <InfoRow
            label="Giao dịch"
            isEditing={isEditing}
            value={
              disbursement.transaction_code ? (
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{disbursement.transaction_code}</span>
              ) : "—"
            }
            editNode={
              <select
                value={form.bank_transaction_id}
                onChange={(e) => set("bank_transaction_id", e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              >
                <option value="">Chọn giao dịch</option>
                {transactions.map((tx: any) => (
                  <option key={tx.id} value={String(tx.id)}>
                    {tx.transaction_code} — {fmtAmount(tx.amount)} ({tx.bank_name})
                  </option>
                ))}
              </select>
            }
          />
          <InfoRow
            label="Giáo viên"
            isEditing={isEditing}
            value={disbursement.teacher_name || "—"}
            editNode={
              <select
                value={form.teacher_id}
                onChange={(e) => set("teacher_id", e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              >
                <option value="">Chọn giáo viên</option>
                {teachers.map((t: any) => (
                  <option key={t.id} value={String(t.id)}>
                    {t.full_name} (ID: {t.id})
                  </option>
                ))}
              </select>
            }
          />
          <InfoRow
            label="Số tiền"
            isEditing={isEditing}
            value={
              <span className="inline-flex items-center gap-1 font-semibold text-teal-800">
                <CircleDollarSign size={14} className="text-teal-600" />
                {fmtAmount(disbursement.amount)}
              </span>
            }
            editNode={
              <div>
                <EditInput
                  type="number"
                  value={form.amount}
                  onChange={(v) => set("amount", v)}
                  placeholder="500000"
                />
                {currentBudgetInfo !== null && currentBudgetInfo.remaining < 0 && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    ⚠ Vượt quá ngân sách còn lại ({fmtAmount(Math.abs(currentBudgetInfo.remaining))})
                  </p>
                )}
              </div>
            }
          />
          <InfoRow
            label="Tháng"
            isEditing={isEditing}
            value={`Tháng ${disbursement.support_month}`}
            editNode={
              <select
                value={form.support_month}
                onChange={(e) => set("support_month", e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                ))}
              </select>
            }
          />
          <InfoRow
            label="Năm"
            isEditing={isEditing}
            value={String(disbursement.support_year)}
            editNode={
              <EditInput
                type="number"
                value={form.support_year}
                onChange={(v) => set("support_year", v)}
                placeholder="2025"
              />
            }
          />
          <InfoRow
            label="Trạng thái"
            isEditing={isEditing}
            value={<StatusBadge status={form.status} />}
            editNode={
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              >
                <option value={DISBURSEMENT_STATUS.HOLDING}>{DISBURSEMENT_STATUS_TRANSLATIONS[DISBURSEMENT_STATUS.HOLDING]}</option>
                <option value={DISBURSEMENT_STATUS.SENT_TO_TEACHER}>{DISBURSEMENT_STATUS_TRANSLATIONS[DISBURSEMENT_STATUS.SENT_TO_TEACHER]}</option>
                <option value={DISBURSEMENT_STATUS.DELIVERED_TO_STUDENT}>{DISBURSEMENT_STATUS_TRANSLATIONS[DISBURSEMENT_STATUS.DELIVERED_TO_STUDENT]}</option>
              </select>
            }
          />
          <InfoRow
            label="Ngày giao"
            isEditing={isEditing}
            value={disbursement.delivered_at ? fmtDate(disbursement.delivered_at) : "Chưa giao"}
            editNode={
              <EditInput
                type="date"
                value={form.delivered_at}
                onChange={(v) => set("delivered_at", v)}
              />
            }
          />
          <InfoRow
            label="Ngày tạo"
            isEditing={false}
            value={fmtDateTime(disbursement.created_at)}
          />
        </SectionCard>

        <div className="flex flex-col gap-5">
          {/* Student Info */}
          {studentDetail && (
            <SectionCard icon={GraduationCap} title="Thông tin học sinh" accentColor="bg-blue-900/10 text-blue-900">
              <InfoRow label="Họ và tên" isEditing={false} value={studentDetail.full_name} />
              <InfoRow
                label="Mã HS"
                isEditing={false}
                value={
                  <span className="font-mono text-xs font-semibold text-primary-900 bg-primary-900/10 px-2 py-0.5 rounded-md">
                    #{studentDetail.id}
                  </span>
                }
              />
              <InfoRow label="Trường" isEditing={false} value={studentDetail.school || "—"} />
              <InfoRow label="Lớp" isEditing={false} value={studentDetail.grade || "—"} />
              <InfoRow label="Hỗ trợ/tháng" isEditing={false} value={fmtAmount(studentDetail.monthly_amount || 0)} />
            </SectionCard>
          )}

          {/* Sponsor Info */}
          {sponsorDetail && (
            <SectionCard icon={Heart} title="Nhà tài trợ" accentColor="bg-pink-900/10 text-pink-900">
              <InfoRow label="Họ và tên" isEditing={false} value={sponsorDetail.full_name} />
              <InfoRow
                label="Số điện thoại"
                isEditing={false}
                value={
                  sponsorDetail.phone ? (
                    <a href={`tel:${sponsorDetail.phone}`} className="text-primary-900 hover:underline">
                      {sponsorDetail.phone}
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
              <InfoRow label="Địa chỉ" isEditing={false} value={sponsorDetail.address || "—"} />
            </SectionCard>
          )}

          {/* Teacher Info */}
          {teacherDetail && (
            <SectionCard icon={BookUser} title="Giáo viên phụ trách" accentColor="bg-violet-900/10 text-violet-900">
              <InfoRow label="Họ và tên" isEditing={false} value={teacherDetail.full_name} />
              <InfoRow
                label="Số điện thoại"
                isEditing={false}
                value={
                  teacherDetail.phone ? (
                    <a href={`tel:${teacherDetail.phone}`} className="text-primary-900 hover:underline">
                      {teacherDetail.phone}
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
              <InfoRow label="Trường" isEditing={false} value={teacherDetail.school || "—"} />
            </SectionCard>
          )}

          {/* Transaction Info */}
          {transactionDetail && (
            <SectionCard icon={Receipt} title="Giao dịch ngân hàng" accentColor="bg-sky-900/10 text-sky-900">
              <InfoRow label="Mã giao dịch" isEditing={false} value={
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{transactionDetail.transaction_code}</span>
              } />
              <InfoRow label="Ngân hàng" isEditing={false} value={transactionDetail.bank_name || "—"} />
              <InfoRow label="Số tài khoản" isEditing={false} value={transactionDetail.account_number || "—"} />
              <InfoRow label="Số tiền" isEditing={false} value={fmtAmount(transactionDetail.amount || 0)} />
              <InfoRow label="Nội dung" isEditing={false} value={transactionDetail.transfer_content || "—"} />
              <InfoRow label="Ngày chuyển" isEditing={false} value={fmtDate(transactionDetail.transfer_date)} />
            </SectionCard>
          )}
        </div>
      </div>

      {/* Delete modal */}
      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        allocationId={disbursement.id}
      />
    </section>
  );
}

