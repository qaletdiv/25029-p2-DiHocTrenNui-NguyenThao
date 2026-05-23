"use client";

import React, { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import {
  ArrowLeft,
  Pencil,
  Check,
  X,
  User,
  Phone,
  MapPin,
  Heart,
  Info,
  Clock,
  Link2,
} from "lucide-react";
import StatusBadge from "@/components/member/common/StatusBadge";
import { Volunteer, updateVolunteerAction } from "@/services/volunteers";
import { fmtDateTime } from "@/hooks/convertData";

function getInitials(name: string) {
  return (name || "")
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
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
// Main Client Component
// ─────────────────────────────────────────────
interface Props {
  volunteer: Volunteer;
}

export default function VolunteerDetailClient({ volunteer }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // Pre-bind the action with the volunteer ID
  const updateActionWithId = updateVolunteerAction.bind(null, volunteer.id);
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

  return (
    <form action={formAction} className="space-y-6">
      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-900 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Quay lại danh sách
        </button>

        <div className="flex items-center gap-2">
          {!state.success && state.message && (
            <span className="text-xs text-red-600 font-medium">{state.message}</span>
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
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 shadow-sm transition-colors"
            >
              <Pencil size={15} /> Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      {/* ── Profile hero card ── */}
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-10 mb-4 flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-primary-900/10 text-primary-900 flex items-center justify-center flex-shrink-0 text-2xl font-bold">
              {getInitials(volunteer.full_name)}
            </div>
            <div className="pb-1">
              <StatusBadge status={volunteer.is_active ? "active" : "inactive"} />
            </div>
          </div>

          {/* Name & meta */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              {isEditing ? (
                <input
                  name="full_name"
                  defaultValue={volunteer.full_name}
                  required
                  className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-primary-700 focus:outline-none w-full"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">{volunteer.full_name}</h2>
              )}
              <p className="mt-0.5 text-sm text-gray-500 font-mono">#TNV{volunteer.id}</p>
            </div>

            <div className="flex gap-3 flex-wrap text-xs text-gray-500">
              <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                Giới tính: {volunteer.gender}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold ${
                  volunteer.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                }`}
              >
                {volunteer.is_active ? "● Hoạt động" : "● Không hoạt động"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info sections ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Personal Info */}
        <SectionCard icon={User} title="Thông tin cá nhân">
          <InfoRow
            label="Họ và tên"
            isEditing={isEditing}
            value={volunteer.full_name}
            editNode={
              <input
                type="text"
                name="full_name"
                defaultValue={volunteer.full_name}
                required
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors"
              />
            }
          />
          <InfoRow
            label="Mã tình nguyện viên"
            isEditing={false}
            value={
              <span className="font-mono text-xs font-semibold text-primary-900 bg-primary-900/10 px-2 py-0.5 rounded-md">
                #TNV{volunteer.id}
              </span>
            }
          />
          <InfoRow
            label="Giới tính"
            isEditing={isEditing}
            value={volunteer.gender}
            editNode={
              <select
                name="gender"
                defaultValue={volunteer.gender}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            }
          />
          <InfoRow
            label="Số điện thoại"
            isEditing={isEditing}
            value={
              volunteer.phone ? (
                <a
                  href={`tel:${volunteer.phone}`}
                  className="text-primary-900 hover:underline inline-flex items-center gap-1"
                >
                  <Phone size={13} />
                  {volunteer.phone}
                </a>
              ) : (
                "—"
              )
            }
            editNode={
              <input
                type="tel"
                name="phone"
                defaultValue={volunteer.phone}
                required
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors"
              />
            }
          />
          <InfoRow
            label="Địa chỉ"
            isEditing={isEditing}
            value={
              volunteer.address ? (
                <span className="inline-flex items-start gap-1">
                  <MapPin size={13} className="mt-0.5 flex-shrink-0 text-gray-400" />
                  {volunteer.address}
                </span>
              ) : (
                "—"
              )
            }
            editNode={
              <input
                type="text"
                name="address"
                defaultValue={volunteer.address || ""}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors"
              />
            }
          />
          <InfoRow
            label="Ghi chú"
            isEditing={isEditing}
            value={
              volunteer.note ? (
                <span className="inline-flex items-start gap-1">
                  <Heart size={13} className="mt-0.5 flex-shrink-0 text-pink-400" />
                  {volunteer.note}
                </span>
              ) : (
                "—"
              )
            }
            editNode={
              <textarea
                name="note"
                defaultValue={volunteer.note || ""}
                rows={3}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 resize-none"
              />
            }
          />
        </SectionCard>

        <div className="flex flex-col gap-5">
          {/* Linked Account & Active State */}
          <SectionCard icon={Link2} title="Liên kết tài khoản & Trạng thái">
            <InfoRow
              label="Tài khoản"
              isEditing={false}
              value={
                volunteer.username ? (
                  <span className="font-mono text-sm text-gray-700">
                    {volunteer.username}
                  </span>
                ) : (
                  <span className="text-gray-400">Chưa liên kết</span>
                )
              }
            />

            <InfoRow
              label="Trạng thái hoạt động"
              isEditing={isEditing}
              value={volunteer.is_active ? "Hoạt động" : "Tạm dừng"}
              editNode={
                <div className="flex items-center pt-1.5">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    defaultChecked={volunteer.is_active}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 hover:cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700 hover:cursor-pointer">Kích hoạt tình nguyện viên</span>
                </div>
              }
            />
          </SectionCard>

          {/* System Info */}
          <SectionCard icon={Info} title="Thông tin hệ thống">
            <InfoRow
              label="Tạo bởi"
              isEditing={false}
              value={
                <span className="inline-flex items-center gap-1 text-gray-600">
                  <Clock size={13} className="text-gray-400" /> {volunteer.creator || "—"}
                </span>
              }
            />
            <InfoRow
              label="Ngày tạo"
              isEditing={false}
              value={fmtDateTime(volunteer.created_at || "")}
            />
            <InfoRow
              label="Cập nhật bởi"
              isEditing={false}
              value={
                <span className="inline-flex items-center gap-1 text-gray-600">
                  <Clock size={13} className="text-gray-400" /> {volunteer.updater || "—"}
                </span>
              }
            />
            <InfoRow
              label="Ngày cập nhật"
              isEditing={false}
              value={fmtDateTime(volunteer.updated_at || "")}
            />
          </SectionCard>
        </div>
      </div>
    </form>
  );
}
