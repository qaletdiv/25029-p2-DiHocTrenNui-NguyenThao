"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Check,
  X,
  User,
  Mail,
  Lock,
  Shield,
  Info,
} from "lucide-react";
import StatusBadge from "@/components/member/common/StatusBadge";
import { Account, updateAccount, UpdateAccountPayload } from "@/services/accounts";

function getInitials(name: string) {
  return (name || "")
    .substring(0, 2)
    .toUpperCase();
}

const ROLE_MAP: Record<number, { label: string; class: string }> = {
  1: { label: "Quản trị viên", class: "bg-primary-900/15 text-primary-900" },
  2: { label: "Tình nguyện viên", class: "bg-violet-100 text-violet-700" },
  3: { label: "Giáo viên", class: "bg-sky-100 text-sky-700" },
  4: { label: "Nhà tài trợ", class: "bg-amber-100 text-amber-700" },
};

function RoleBadge({ roleId }: { roleId: number }) {
  const cfg = ROLE_MAP[roleId] || { label: "Người dùng", class: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${cfg.class}`}>
      {cfg.label}
    </span>
  );
}

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
    <div className="py-3.5 grid grid-cols-[140px_1fr] gap-4 border-b border-gray-100 last:border-0 items-start font-sans">
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
      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors font-sans"
    />
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden font-sans">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/60 font-sans">
        <div className="w-7 h-7 rounded-lg bg-primary-900/10 text-primary-900 flex items-center justify-center flex-shrink-0">
          <Icon size={15} strokeWidth={2} />
        </div>
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <dl className="px-5">{children}</dl>
    </div>
  );
}

// ─────────────────────────────────────────────
// Edit-form state shape
// ─────────────────────────────────────────────
interface FormState {
  username: string;
  email: string;
  password?: string;
  role_id: number;
  is_active: boolean;
}

function toForm(account: Account): FormState {
  return {
    username: account.username || "",
    email: account.email || "",
    password: "",
    role_id: account.role_id || 1,
    is_active: account.is_active ?? true,
  };
}

// ─────────────────────────────────────────────
// Main Client Component
// ─────────────────────────────────────────────
interface Props {
  account: Account;
}

export default function AccountDetailClient({ account }: Props) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<FormState>(toForm(account));
  const [saveError, setSaveError] = useState<string | null>(null);

  const set = (field: keyof FormState, val: string | boolean | number) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  async function handleSave() {
    setIsSaving(true);
    setSaveError(null);
    try {
      const payload: UpdateAccountPayload = {
        username: form.username,
        email: form.email,
        role_id: form.role_id,
        is_active: form.is_active,
      };

      if (form.password && form.password.trim() !== "") {
        payload.password = form.password;
      }

      await updateAccount(account.id, payload);
      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      setSaveError(err.message || "Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setForm(toForm(account));
    setSaveError(null);
    setIsEditing(false);
  }

  return (
    <section className="space-y-6 font-sans">
      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-sans">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-900 transition-colors group font-sans"
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
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 shadow-sm transition-colors disabled:opacity-50"
              >
                <Check size={15} /> {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 shadow-sm transition-colors"
            >
              <Pencil size={15} /> Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      {/* ── Profile hero card ── */}
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden font-sans">
        <div className="h-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-10 mb-4 flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-primary-900/10 text-primary-900 flex items-center justify-center flex-shrink-0 text-2xl font-bold font-sans">
              {getInitials(form.username)}
            </div>
            <div className="pb-1">
              <StatusBadge status={form.is_active ? "active" : "inactive"} />
            </div>
          </div>

          {/* Username & meta */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              {isEditing ? (
                <input
                  value={form.username}
                  onChange={(e) => set("username", e.target.value)}
                  className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-primary-700 focus:outline-none w-full font-sans"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800 font-sans">{form.username}</h2>
              )}
              <p className="mt-0.5 text-sm text-gray-500 font-mono">#{account.id}</p>
            </div>

            <div className="flex gap-3 flex-wrap text-xs text-gray-500">
              <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                <Shield size={12} />
                <RoleBadge roleId={form.role_id} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info sections ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-sans">
        {/* Account Info */}
        <SectionCard icon={User} title="Thông tin tài khoản">
          <InfoRow
            label="Tên đăng nhập"
            isEditing={isEditing}
            value={form.username}
            editNode={
              <EditInput value={form.username} onChange={(v) => set("username", v)} />
            }
          />
          <InfoRow
            label="Mã tài khoản"
            isEditing={false}
            value={
              <span className="font-mono text-xs font-semibold text-primary-900 bg-primary-900/10 px-2 py-0.5 rounded-md">
                #{account.id}
              </span>
            }
          />
          <InfoRow
            label="Email"
            isEditing={isEditing}
            value={
              form.email ? (
                <a
                  href={`mailto:${form.email}`}
                  className="text-primary-900 hover:underline inline-flex items-center gap-1"
                >
                  <Mail size={13} />
                  {form.email}
                </a>
              ) : (
                "—"
              )
            }
            editNode={
              <EditInput type="email" value={form.email} onChange={(v) => set("email", v)} />
            }
          />
          <InfoRow
            label="Mật khẩu"
            isEditing={isEditing}
            value="••••••••"
            editNode={
              <EditInput
                type="password"
                value={form.password || ""}
                onChange={(v) => set("password", v)}
                placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
              />
            }
          />
        </SectionCard>

        {/* Roles & Status */}
        <SectionCard icon={Info} title="Vai trò & Trạng thái">
          <InfoRow
            label="Vai trò hệ thống"
            isEditing={isEditing}
            value={<RoleBadge roleId={form.role_id} />}
            editNode={
              <select
                value={form.role_id}
                onChange={(e) => set("role_id", Number(e.target.value))}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 font-sans"
              >
                <option value="1">Quản trị viên</option>
                <option value="2">Tình nguyện viên</option>
                <option value="3">Giáo viên</option>
                <option value="4">Nhà tài trợ</option>
              </select>
            }
          />
          <InfoRow
            label="Trạng thái"
            isEditing={isEditing}
            value={<StatusBadge status={form.is_active ? "active" : "inactive"} />}
            editNode={
              <div className="flex items-center pt-1.5 font-sans">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => set("is_active", e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 cursor-pointer"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700 cursor-pointer">
                  Đang hoạt động (Kích hoạt tài khoản)
                </label>
              </div>
            }
          />
        </SectionCard>
      </div>
    </section>
  );
}
