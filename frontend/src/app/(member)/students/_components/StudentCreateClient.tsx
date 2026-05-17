"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X } from "lucide-react";
import { createStudent, CreateStudentPayload } from "@/services/students";

export default function StudentCreateClient() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "Male",
    phone: "",
    grade: "",
    family_condition: "",
    monthly_amount: "500000",
    is_active: true,
    address: "",
    school: "",
    status: "INFO",
  });

  const set = (field: string, val: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const payload: CreateStudentPayload = {
        ...form,
        monthly_amount: Number(form.monthly_amount) || 0,
      };
      await createStudent(payload);
      router.push("/students");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo học sinh.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-900 transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại
        </button>
        <h1 className="text-xl font-bold text-gray-800">Thêm học sinh mới</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSave} className="space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Họ và tên *</label>
              <input
                type="text"
                required
                value={form.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Ngày sinh *</label>
              <input
                type="date"
                required
                value={form.date_of_birth}
                onChange={(e) => set("date_of_birth", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Giới tính</label>
              <select
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 bg-white"
              >
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Trường học</label>
              <input
                type="text"
                value={form.school}
                onChange={(e) => set("school", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Lớp</label>
              <input
                type="text"
                value={form.grade}
                onChange={(e) => set("grade", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Địa chỉ</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Hoàn cảnh gia đình</label>
            <textarea
              rows={3}
              value={form.family_condition}
              onChange={(e) => set("family_condition", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Mức hỗ trợ / tháng (VNĐ)</label>
              <input
                type="number"
                value={form.monthly_amount}
                onChange={(e) => set("monthly_amount", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Trạng thái</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 bg-white"
              >
                <option value="INFO">Thông tin</option>
                <option value="CONTACTED">Đã liên hệ</option>
                <option value="ACTIVE">Đang học</option>
                <option value="PAUSED">Tạm dừng</option>
                <option value="DROPPED_OUT">Nghỉ học</option>
                <option value="GRADUATED">Tốt nghiệp</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => set("is_active", e.target.checked)}
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
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <X size={15} /> Huỷ
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 shadow-sm transition-colors disabled:opacity-50"
            >
              <Save size={15} /> {isSaving ? "Đang lưu..." : "Lưu học sinh"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
