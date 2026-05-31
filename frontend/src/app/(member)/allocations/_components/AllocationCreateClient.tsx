"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Wallet,
  CircleDollarSign,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import { createDisbursement, CreateDisbursementPayload, BudgetSummary } from "@/services/disbursements";
import { fmtAmount } from "@/hooks/convertData";
import { DISBURSEMENT_STATUS, DISBURSEMENT_STATUS_TRANSLATIONS } from "@/hooks/constants";

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function FormField({
  label,
  required,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
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
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
interface Props {
  students: any[];
  teachers: any[];
  budgetSummary: BudgetSummary;
}

export default function AllocationCreateClient({ students, teachers = [], budgetSummary }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    student_id: "",
    teacher_id: "",
    bank_transaction_id: "",
    amount: "500000",
    support_month: String(new Date().getMonth() + 1),
    support_year: String(new Date().getFullYear()),
    status: DISBURSEMENT_STATUS.HOLDING,
    delivered_at: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: string, val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  // Available bank transaction IDs from budget summary
  const txOptions = useMemo(() => {
    return Object.entries(budgetSummary).map(([id, info]) => ({
      id: Number(id),
      label: `${info.transaction_code} — Tổng: ${fmtAmount(info.total_amount)} (Còn: ${fmtAmount(info.remaining)})`,
      remaining: info.remaining,
    }));
  }, [budgetSummary]);

  // Compute real-time remaining for selected transaction
  const selectedBudget = useMemo(() => {
    if (!form.bank_transaction_id) return null;
    const info = budgetSummary[form.bank_transaction_id];
    if (!info) return null;
    const newAllocated = info.allocated + (Number(form.amount) || 0);
    return {
      ...info,
      newAllocated,
      newRemaining: info.total_amount - newAllocated,
    };
  }, [form.bank_transaction_id, form.amount, budgetSummary]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const payload: CreateDisbursementPayload = {
        student_id: form.student_id,
        teacher_id: Number(form.teacher_id) || undefined,
        bank_transaction_id: Number(form.bank_transaction_id),
        amount: Number(form.amount),
        support_month: Number(form.support_month),
        support_year: Number(form.support_year),
        status: form.status,
        delivered_at: form.delivered_at || undefined,
      };
      await createDisbursement(payload);
      router.push("/allocations");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo phân bổ.");
    } finally {
      setIsSaving(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors";
  const selectClass =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors cursor-pointer";

  return (
    <section className="space-y-6 max-w-3xl">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-900 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Quay lại
        </button>
      </div>

      {/* ── Title ── */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-teal-900/10 text-teal-900">
          <Wallet size={22} strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Tạo phân bổ mới</h2>
          <p className="text-sm text-gray-500 mt-0.5">Phân bổ kinh phí hỗ trợ cho học sinh</p>
        </div>
      </div>

      {/* ── Budget Impact (real-time) ── */}
      {selectedBudget && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <TrendingDown size={15} strokeWidth={2} />
            </div>
            <h3 className="text-sm font-semibold text-gray-700">Tác động ngân sách</h3>
            <span className="ml-auto font-mono text-xs text-gray-400">{selectedBudget.transaction_code}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-xs text-gray-400 font-medium">Tổng giao dịch</p>
              <p className="text-lg font-bold text-gray-800 mt-1">{fmtAmount(selectedBudget.total_amount)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 font-medium">Sau phân bổ này</p>
              <p className="text-lg font-bold text-teal-700 mt-1">{fmtAmount(selectedBudget.newAllocated)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 font-medium">Còn lại</p>
              <p className={`text-lg font-bold mt-1 ${selectedBudget.newRemaining < 0 ? "text-red-600" : "text-amber-600"}`}>
                {fmtAmount(selectedBudget.newRemaining)}
              </p>
            </div>
          </div>

          <BudgetBar allocated={selectedBudget.newAllocated} total={selectedBudget.total_amount} />

          {selectedBudget.newRemaining < 0 && (
            <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              <AlertTriangle size={14} />
              <span>Số tiền phân bổ vượt quá ngân sách còn lại!</span>
            </div>
          )}
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Học sinh" required>
            <select
              value={form.student_id}
              onChange={(e) => set("student_id", e.target.value)}
              required
              className={selectClass}
            >
              <option value="">Chọn học sinh</option>
              {students.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.full_name} ({s.id})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Giao dịch ngân hàng" required>
            <select
              value={form.bank_transaction_id}
              onChange={(e) => set("bank_transaction_id", e.target.value)}
              required
              className={selectClass}
            >
              <option value="">Chọn giao dịch</option>
              {txOptions.map((tx) => (
                <option key={tx.id} value={tx.id}>
                  {tx.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Số tiền" required>
            <div className="relative">
              <CircleDollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                required
                min="1"
                placeholder="500000"
                className={`${inputClass} pl-9`}
              />
            </div>
          </FormField>

          <FormField label="Giáo viên phụ trách">
            <select
              value={form.teacher_id}
              onChange={(e) => set("teacher_id", e.target.value)}
              className={selectClass}
            >
              <option value="">Chọn giáo viên</option>
              {teachers.map((t: any) => (
                <option key={t.id} value={t.id}>
                  {t.full_name} (ID: {t.id})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Tháng hỗ trợ" required>
            <select
              value={form.support_month}
              onChange={(e) => set("support_month", e.target.value)}
              required
              className={selectClass}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Năm hỗ trợ" required>
            <input
              type="number"
              value={form.support_year}
              onChange={(e) => set("support_year", e.target.value)}
              required
              min="2000"
              max="2100"
              className={inputClass}
            />
          </FormField>

          <FormField label="Trạng thái">
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={selectClass}
            >
              <option value={DISBURSEMENT_STATUS.HOLDING}>{DISBURSEMENT_STATUS_TRANSLATIONS[DISBURSEMENT_STATUS.HOLDING]}</option>
              <option value={DISBURSEMENT_STATUS.SENT_TO_TEACHER}>{DISBURSEMENT_STATUS_TRANSLATIONS[DISBURSEMENT_STATUS.SENT_TO_TEACHER]}</option>
              <option value={DISBURSEMENT_STATUS.DELIVERED_TO_STUDENT}>{DISBURSEMENT_STATUS_TRANSLATIONS[DISBURSEMENT_STATUS.DELIVERED_TO_STUDENT]}</option>
            </select>
          </FormField>

          <FormField label="Ngày giao">
            <input
              type="date"
              value={form.delivered_at}
              onChange={(e) => set("delivered_at", e.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={isSaving || (selectedBudget?.newRemaining ?? 0) < 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {isSaving ? "Đang lưu..." : "Tạo phân bổ"}
          </button>
        </div>
      </form>
    </section>
  );
}
