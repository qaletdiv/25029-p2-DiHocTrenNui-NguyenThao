"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Check,
  X,
  User,
  Calendar,
  GraduationCap,
  Phone,
  MapPin,
  Heart,
  CircleDollarSign,
  Info,
  Clock,
} from "lucide-react";
import StatusBadge from "@/components/member/common/StatusBadge";
import { Student, updateStudent, UpdateStudentPayload } from "@/services/students";
import { fmtAmount, fmtDate, fmtDateTime, calcAge } from "@/hooks/convertData";
import { STUDENT_STATUS, STUDENT_STATUS_TRANSLATIONS } from "@/hooks/constants";
import { School } from "@/services/schools";
import { Sponsor } from "@/services/sponsors";
import { Teacher } from "@/services/teachers";
import { Volunteer } from "@/services/volunteers";


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

// ─────────────────────────────────────────────
// Edit-form state shape
// ─────────────────────────────────────────────
interface FormState {
  full_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  grade: string;
  family_condition: string;
  monthly_amount: string;
  is_active: boolean;
  address: string;
  school: string;
  status: string;
}

function toForm(student: Student): FormState {
  return {
    full_name: student.full_name || "",
    date_of_birth: student.date_of_birth ? student.date_of_birth.substring(0, 10) : "",
    gender: student.gender || "Nam",
    phone: student.phone || "",
    grade: student.grade || "",
    family_condition: student.family_condition || "",
    monthly_amount: String(student.monthly_amount || 0),
    is_active: student.is_active ?? true,
    address: student.address || "",
    school: student.school || "",
    status: student.status || "INFO",
  };
}

// ─────────────────────────────────────────────
// Main Client Component
// ─────────────────────────────────────────────
interface Props {
  student: Student;
  schoolDetail?: School | null;
  sponsorDetail?: Sponsor | null;
  teacherDetail?: Teacher | null;
  volunteerDetail?: Volunteer | null;
  schools?: School[];
}

export default function StudentDetailClient({
  student,
  schoolDetail,
  sponsorDetail,
  teacherDetail,
  volunteerDetail,
  schools = [],
}: Props) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<FormState>(toForm(student));
  const [saveError, setSaveError] = useState<string | null>(null);

  const set = (field: keyof FormState, val: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  async function handleSave() {
    setIsSaving(true);
    setSaveError(null);
    try {
      const payload: UpdateStudentPayload = {
        full_name: form.full_name,
        date_of_birth: form.date_of_birth,
        gender: form.gender,
        phone: form.phone,
        grade: form.grade,
        family_condition: form.family_condition,
        monthly_amount: Number(form.monthly_amount),
        is_active: form.is_active,
        address: form.address,
        school: form.school,
        status: form.status,
      };
      await updateStudent(student.id, payload);
      setIsEditing(false);
      // Refresh to reflect saved data (RSC revalidation)
      router.refresh();
    } catch {
      setSaveError("Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setForm(toForm(student));
    setSaveError(null);
    setIsEditing(false);
  }

  const age = calcAge(form.date_of_birth || student.date_of_birth);

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
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-10 mb-4 flex items-end gap-4">
            {student.avatar_url ? (
              <img
                src={student.avatar_url}
                alt={form.full_name}
                className="w-20 h-20 rounded-2xl border-4 border-white shadow-md object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-primary-900/10 text-primary-900 flex items-center justify-center flex-shrink-0 text-2xl font-bold">
                {getInitials(form.full_name)}
              </div>
            )}
            <div className="pb-1">
              <StatusBadge status={form.status} />
            </div>
          </div>

          {/* Name & meta */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              {isEditing ? (
                <input
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-primary-700 focus:outline-none w-full"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">{form.full_name}</h2>
              )}
              <p className="mt-0.5 text-sm text-gray-500 font-mono">#{student.id}</p>
            </div>

            <div className="flex gap-3 flex-wrap text-xs text-gray-500">
              {(form.school || form.grade) && (
                <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                  <GraduationCap size={12} />
                  {form.grade ? `Lớp ${form.grade} · ` : ""}
                  {form.school}
                </span>
              )}
              <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                <Calendar size={12} /> {age} tuổi
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold ${form.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                  }`}
              >
                {form.is_active ? "● Đang hoạt động" : "● Đã dừng"}
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
            value={form.full_name}
            editNode={
              <EditInput value={form.full_name} onChange={(v) => set("full_name", v)} />
            }
          />
          <InfoRow
            label="Mã học sinh"
            isEditing={false}
            value={
              <span className="font-mono text-xs font-semibold text-primary-900 bg-primary-900/10 px-2 py-0.5 rounded-md">
                #{student.id}
              </span>
            }
          />
          <InfoRow
            label="Ngày sinh"
            isEditing={isEditing}
            value={`${fmtDate(form.date_of_birth)} (${age} tuổi)`}
            editNode={
              <EditInput
                type="date"
                value={form.date_of_birth}
                onChange={(v) => set("date_of_birth", v)}
              />
            }
          />
          <InfoRow
            label="Giới tính"
            isEditing={isEditing}
            value={form.gender === "Nam" ? "Nam" : form.gender === "Nữ" ? "Nữ" : "Khác"}
            editNode={
              <select
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
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
              form.phone ? (
                <a
                  href={`tel:${form.phone}`}
                  className="text-primary-900 hover:underline inline-flex items-center gap-1"
                >
                  <Phone size={13} />
                  {form.phone}
                </a>
              ) : (
                "—"
              )
            }
            editNode={
              <EditInput type="tel" value={form.phone} onChange={(v) => set("phone", v)} />
            }
          />
          <InfoRow
            label="Địa chỉ"
            isEditing={isEditing}
            value={
              form.address ? (
                <span className="inline-flex items-start gap-1">
                  <MapPin size={13} className="mt-0.5 flex-shrink-0 text-gray-400" />
                  {form.address}
                </span>
              ) : (
                "—"
              )
            }
            editNode={
              <EditInput value={form.address} onChange={(v) => set("address", v)} />
            }
          />
          <InfoRow
            label="Hoàn cảnh"
            isEditing={isEditing}
            value={
              form.family_condition ? (
                <span className="inline-flex items-start gap-1">
                  <Heart size={13} className="mt-0.5 flex-shrink-0 text-pink-400" />
                  {form.family_condition}
                </span>
              ) : (
                "—"
              )
            }
            editNode={
              <textarea
                value={form.family_condition}
                onChange={(e) => set("family_condition", e.target.value)}
                rows={3}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 resize-none"
              />
            }
          />
        </SectionCard>

        <div className="flex flex-col gap-5">
          {/* Academic & Support */}
          <SectionCard icon={GraduationCap} title="Học tập & Hỗ trợ">
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
                  <option value="INFO">{STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.INFO]}</option>
                  <option value="CONTACTED">{STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.CONTACTED]}</option>
                  <option value="ACTIVE">{STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.ACTIVE]}</option>
                  <option value="PAUSED">{STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.PAUSED]}</option>
                  <option value="DROPPED_OUT">{STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.DROPPED_OUT]}</option>
                  <option value="GRADUATED">{STUDENT_STATUS_TRANSLATIONS[STUDENT_STATUS.GRADUATED]}</option>
                </select>
              }
            />
            <InfoRow
              label="Trường học"
              isEditing={isEditing}
              value={form.school || "—"}
              editNode={
                <select
                  value={form.school}
                  onChange={(e) => set("school", e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
                >
                  <option value="">Không (hoặc Trường khác / Trường mới)</option>
                  {schools
                    .filter((school) => school.is_active)
                    .map((school) => (
                      <option key={school.id} value={school.name}>
                        {school.name}
                      </option>
                    ))}
                </select>
              }
            />
            <InfoRow
              label="Lớp"
              isEditing={isEditing}
              value={form.grade || "—"}
              editNode={
                <EditInput value={form.grade} onChange={(v) => set("grade", v)} />
              }
            />
            <InfoRow
              label="Hỗ trợ / tháng"
              isEditing={isEditing}
              value={
                <span className="inline-flex items-center gap-1 font-semibold text-primary-900">
                  <CircleDollarSign size={14} className="text-primary-700" />
                  {fmtAmount(Number(form.monthly_amount))}
                </span>
              }
              editNode={
                <EditInput
                  type="number"
                  value={form.monthly_amount}
                  onChange={(v) => set("monthly_amount", v)}
                  placeholder="500000"
                />
              }
            />
            <InfoRow
              label="Hoạt động"
              isEditing={isEditing}
              value={form.is_active ? "Có" : "Không"}
              editNode={
                <div className="flex items-center pt-1.5">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => set("is_active", e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Kích hoạt</span>
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
                  <Clock size={13} className="text-gray-400" /> {student.creator || "—"}
                </span>
              }
            />
            <InfoRow
              label="Ngày tạo"
              isEditing={false}
              value={fmtDateTime(student.created_at)}
            />
            <InfoRow
              label="Cập nhật bởi"
              isEditing={false}
              value={
                <span className="inline-flex items-center gap-1 text-gray-600">
                  <Clock size={13} className="text-gray-400" /> {student.updater || "—"}
                </span>
              }
            />
            <InfoRow
              label="Ngày cập nhật"
              isEditing={false}
              value={fmtDateTime(student.updated_at)}
            />
          </SectionCard>
        </div>
      </div>

      {(schoolDetail || sponsorDetail || teacherDetail || volunteerDetail) && (
        <div className="mt-8 space-y-4">
          <h3 className="text-base font-bold text-gray-800">Thông tin liên quan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* School Info */}
            {schoolDetail && (
              <SectionCard icon={GraduationCap} title="Thông tin trường học">
                <InfoRow label="Tên trường" isEditing={false} value={schoolDetail.name} />
                <InfoRow
                  label="Số điện thoại"
                  isEditing={false}
                  value={
                    schoolDetail.phone ? (
                      <a href={`tel:${schoolDetail.phone}`} className="text-primary-900 hover:underline">
                        {schoolDetail.phone}
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
                <InfoRow
                  label="Email"
                  isEditing={false}
                  value={
                    schoolDetail.email ? (
                      <a href={`mailto:${schoolDetail.email}`} className="text-primary-900 hover:underline">
                        {schoolDetail.email}
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
                <InfoRow label="Địa chỉ" isEditing={false} value={schoolDetail.address || "—"} />
              </SectionCard>
            )}

            {/* Sponsor Info */}
            {sponsorDetail && (
              <SectionCard icon={Heart} title="Thông tin nhà tài trợ">
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
                <InfoRow label="Giới tính" isEditing={false} value={sponsorDetail.gender || "—"} />
                <InfoRow label="Địa chỉ" isEditing={false} value={sponsorDetail.address || "—"} />
                <InfoRow
                  label="Tài khoản"
                  isEditing={false}
                  value={
                    sponsorDetail.username ? (
                      <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                        {sponsorDetail.username}
                      </span>
                    ) : (
                      <span className="text-gray-400">Chưa liên kết</span>
                    )
                  }
                />
              </SectionCard>
            )}

            {/* Teacher Info */}
            {teacherDetail && (
              <SectionCard icon={User} title="Giáo viên phụ trách">
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
                <InfoRow label="Giới tính" isEditing={false} value={teacherDetail.gender || "—"} />
                <InfoRow label="Địa chỉ" isEditing={false} value={teacherDetail.address || "—"} />
                <InfoRow
                  label="Tài khoản"
                  isEditing={false}
                  value={
                    teacherDetail.username ? (
                      <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                        {teacherDetail.username}
                      </span>
                    ) : (
                      <span className="text-gray-400">Chưa liên kết</span>
                    )
                  }
                />
              </SectionCard>
            )}

            {/* Volunteer Info */}
            {volunteerDetail && (
              <SectionCard icon={User} title="Thông tin tình nguyện viên">
                <InfoRow label="Họ và tên" isEditing={false} value={volunteerDetail.full_name} />
                <InfoRow
                  label="Số điện thoại"
                  isEditing={false}
                  value={
                    volunteerDetail.phone ? (
                      <a href={`tel:${volunteerDetail.phone}`} className="text-primary-900 hover:underline">
                        {volunteerDetail.phone}
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
                <InfoRow label="Giới tính" isEditing={false} value={volunteerDetail.gender || "—"} />
                <InfoRow label="Địa chỉ" isEditing={false} value={volunteerDetail.address || "—"} />
                <InfoRow
                  label="Tài khoản"
                  isEditing={false}
                  value={
                    volunteerDetail.username ? (
                      <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                        {volunteerDetail.username}
                      </span>
                    ) : (
                      <span className="text-gray-400">Chưa liên kết</span>
                    )
                  }
                />
              </SectionCard>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
