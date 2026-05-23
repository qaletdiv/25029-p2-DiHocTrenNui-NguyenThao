"use client";

import React, { useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X } from "lucide-react";
import { createStudentAction } from "@/services/students";
import { STUDENT_STATUS, STUDENT_STATUS_TRANSLATIONS } from "@/hooks/constants";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 shadow-sm transition-colors disabled:opacity-50"
    >
      <Save size={15} /> {pending ? "Đang lưu..." : "Lưu học sinh"}
    </button>
  );
}

export default function StudentCreateClient() {
  const router = useRouter();
  const [state, formAction] = useActionState(createStudentAction, { success: false, message: "" });

  useEffect(() => {
    if (state.success) {
      router.push("/students");
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
        <h1 className="text-xl font-bold text-gray-800">Thêm học sinh mới</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form action={formAction} className="space-y-5">
          {!state.success && state.message && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              {state.message}
            </div>
          )}

          {/* Section: Expected Generated ID */}
          <div className="p-4 bg-primary-50/50 rounded-xl border border-primary-100/50">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Mã học sinh dự kiến</label>
              <input
                type="text"
                disabled
                value="HS****"
                className="w-full px-3 py-2 text-sm font-mono text-primary-700 bg-primary-900/5 border border-primary-100 rounded-lg cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mã sẽ được hệ thống tự động tạo theo thứ tự tăng dần (ví dụ: HS0031) khi lưu thành công.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Họ và tên *</label>
              <input
                type="text"
                name="full_name"
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Ngày sinh *</label>
              <input
                type="date"
                name="date_of_birth"
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Giới tính</label>
              <select
                name="gender"
                defaultValue="Nam"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 bg-white"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Trường học</label>
              <input
                type="text"
                name="school"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Lớp</label>
              <input
                type="text"
                name="grade"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Địa chỉ cụ thể</label>
            <input
              type="text"
              name="address"
              placeholder="Ví dụ: Bản Nà Lốc"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Hoàn cảnh gia đình</label>
            <textarea
              name="family_condition"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Mức hỗ trợ / tháng (VNĐ)</label>
              <input
                type="number"
                name="monthly_amount"
                defaultValue="500000"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Trạng thái</label>
              <select
                name="status"
                defaultValue="INFO"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 bg-white"
              >
                {Object.entries(STUDENT_STATUS_TRANSLATIONS).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              defaultChecked={true}
              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Đang hoạt động (Kích hoạt tài khoản)
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

