"use client";

import React, { useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X } from "lucide-react";
import { createSchoolAction } from "@/services/schools";
import { Teacher } from "@/services/teachers";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 shadow-sm transition-colors disabled:opacity-50"
    >
      <Save size={15} /> {pending ? "Đang lưu..." : "Lưu trường học"}
    </button>
  );
}

interface Props {
  teachers: Teacher[];
}

export default function SchoolCreateClient({ teachers }: Props) {
  const router = useRouter();
  const [state, formAction] = useActionState(createSchoolAction, { success: false, message: "" });

  useEffect(() => {
    if (state.success) {
      router.push("/schools");
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-900 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Quay lại
        </button>
        <h1 className="text-xl font-bold text-gray-800">Thêm trường học mới</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form action={formAction} className="space-y-5">
          {!state.success && state.message && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              {state.message}
            </div>
          )}

          {/* Expected generated ID warning */}
          <div className="p-4 bg-primary-50/50 rounded-xl border border-primary-100/50">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Mã trường dự kiến</label>
              <input
                type="text"
                disabled
                value="Tự động tạo số thứ tự"
                className="w-full px-3 py-2 text-sm font-medium text-primary-700 bg-primary-900/5 border border-primary-100 rounded-lg cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Hệ thống sẽ tự động cấp mã số cho trường học mới khi lưu thành công.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Tên trường *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Ví dụ: Trường Tiểu học Bản Khoang"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Người đại diện / Giáo viên liên hệ *</label>
              <select
                name="teacher_id"
                required
                defaultValue=""
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 bg-white cursor-pointer"
              >
                <option value="" disabled>-- Chọn giáo viên --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.full_name} ({t.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                placeholder="Ví dụ: 0252012074"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Ví dụ: school@domain.com"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Địa chỉ *</label>
            <input
              type="text"
              name="address"
              required
              placeholder="Ví dụ: Bản Nà Lốc, Xã Nùng Nàng, Huyện Tam Đường, Quảng Nam"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Ghi chú</label>
            <textarea
              name="note"
              rows={3}
              placeholder="Nhập thông tin bổ sung nếu có..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              defaultChecked={true}
              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 hover:cursor-pointer"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700 hover:cursor-pointer">
              Đang hoạt động (Kích hoạt trường học)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <X size={15} /> Huỷ
            </button>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
