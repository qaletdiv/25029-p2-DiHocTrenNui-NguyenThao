"use client";

import React, { useState, useEffect, useMemo, useActionState } from "react";
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
  GraduationCap,
} from "lucide-react";
import StatusBadge from "@/components/member/common/StatusBadge";
import { Teacher, updateTeacherAction } from "@/services/teachers";
import { School } from "@/services/schools";
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
  teacher: Teacher;
  schools: School[];
}

export default function TeacherDetailClient({ teacher, schools }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // Pre-bind the action with the teacher ID
  const updateActionWithId = updateTeacherAction.bind(null, teacher.id);
  const [state, formAction] = useActionState(updateActionWithId, { success: false, message: "" });

  // Resolve current school ID for dropdown defaultValue
  const currentSchoolId = useMemo(() => {
    const found = schools.find((s) => s.name === teacher.school);
    return found ? found.id : "";
  }, [schools, teacher.school]);

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
              {getInitials(teacher.full_name)}
            </div>
            <div className="pb-1">
              <StatusBadge status={teacher.is_active ? "active" : "inactive"} />
            </div>
          </div>

          {/* Name & meta */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              {isEditing ? (
                <input
                  name="full_name"
                  defaultValue={teacher.full_name}
                  required
                  className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-primary-700 focus:outline-none w-full"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">{teacher.full_name}</h2>
              )}
              <p className="mt-0.5 text-sm text-gray-500 font-mono">#GV{teacher.id}</p>
            </div>

            <div className="flex gap-3 flex-wrap text-xs text-gray-500">
              <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                Giới tính: {teacher.gender}
              </span>
              {teacher.school && (
                <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                  <GraduationCap size={12} /> {teacher.school}
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold ${
                  teacher.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                }`}
              >
                {teacher.is_active ? "● Hoạt động" : "● Không hoạt động"}
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
            value={teacher.full_name}
            editNode={
              <input
                type="text"
                name="full_name"
                defaultValue={teacher.full_name}
                required
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors"
              />
            }
          />
          <InfoRow
            label="Mã giáo viên"
            isEditing={false}
            value={
              <span className="font-mono text-xs font-semibold text-primary-900 bg-primary-900/10 px-2 py-0.5 rounded-md">
                #GV{teacher.id}
              </span>
            }
          />
          <InfoRow
            label="Giới tính"
            isEditing={isEditing}
            value={teacher.gender}
            editNode={
              <select
                name="gender"
                defaultValue={teacher.gender}
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
              teacher.phone ? (
                <a
                  href={`tel:${teacher.phone}`}
                  className="text-primary-900 hover:underline inline-flex items-center gap-1"
                >
                  <Phone size={13} />
                  {teacher.phone}
                </a>
              ) : (
                "—"
              )
            }
            editNode={
              <input
                type="tel"
                name="phone"
                defaultValue={teacher.phone}
                required
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors"
              />
            }
          />
          <InfoRow
            label="Địa chỉ"
            isEditing={isEditing}
            value={
              teacher.address ? (
                <span className="inline-flex items-start gap-1">
                  <MapPin size={13} className="mt-0.5 flex-shrink-0 text-gray-400" />
                  {teacher.address}
                </span>
              ) : (
                "—"
              )
            }
            editNode={
              <input
                type="text"
                name="address"
                defaultValue={teacher.address || ""}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 transition-colors"
              />
            }
          />
          <InfoRow
            label="Ghi chú"
            isEditing={isEditing}
            value={
              teacher.note ? (
                <span className="inline-flex items-start gap-1">
                  <Heart size={13} className="mt-0.5 flex-shrink-0 text-pink-400" />
                  {teacher.note}
                </span>
              ) : (
                "—"
              )
            }
            editNode={
              <textarea
                name="note"
                defaultValue={teacher.note || ""}
                rows={3}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 resize-none"
              />
            }
          />
        </SectionCard>

        <div className="flex flex-col gap-5">
          {/* Linked Account & School Info */}
          <SectionCard icon={Link2} title="Liên kết tài khoản & Trường học">
            <InfoRow
              label="Tài khoản liên kết"
              isEditing={false}
              value={
                teacher.username ? (
                  <span className="font-mono text-sm text-gray-700">
                    {teacher.username}
                  </span>
                ) : (
                  <span className="text-gray-400">Chưa liên kết</span>
                )
              }
            />

            <InfoRow
              label="Trường học"
              isEditing={isEditing}
              value={teacher.school || "—"}
              editNode={
                <select
                  name="school_id"
                  defaultValue={currentSchoolId}
                  required
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 cursor-pointer"
                >
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              }
            />

            <InfoRow
              label="Trạng thái hoạt động"
              isEditing={isEditing}
              value={teacher.is_active ? "Hoạt động" : "Tạm dừng"}
              editNode={
                <div className="flex items-center pt-1.5">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    defaultChecked={teacher.is_active}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 hover:cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700 hover:cursor-pointer">Kích hoạt giáo viên</span>
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
                  <Clock size={13} className="text-gray-400" /> {teacher.creator || "—"}
                </span>
              }
            />
            <InfoRow
              label="Ngày tạo"
              isEditing={false}
              value={fmtDateTime(teacher.created_at || "")}
            />
            <InfoRow
              label="Cập nhật bởi"
              isEditing={false}
              value={
                <span className="inline-flex items-center gap-1 text-gray-600">
                  <Clock size={13} className="text-gray-400" /> {teacher.updater || "—"}
                </span>
              }
            />
            <InfoRow
              label="Ngày cập nhật"
              isEditing={false}
              value={fmtDateTime(teacher.updated_at || "")}
            />
          </SectionCard>
        </div>
      </div>
    </form>
  );
}
