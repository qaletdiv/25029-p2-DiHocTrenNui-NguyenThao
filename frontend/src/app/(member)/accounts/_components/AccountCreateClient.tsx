"use client";

import React, { useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X } from "lucide-react";
import { createAccountAction } from "@/services/accounts";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 shadow-sm transition-colors disabled:opacity-50 font-sans"
    >
      <Save size={15} /> {pending ? "Đang lưu..." : "Lưu tài khoản"}
    </button>
  );
}

export default function AccountCreateClient() {
  const router = useRouter();
  const [state, formAction] = useActionState(createAccountAction, { success: false, message: "" });

  useEffect(() => {
    if (state.success) {
      router.push("/accounts");
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between font-sans">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-900 transition-colors group font-sans"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Quay lại
        </button>
        <h1 className="text-xl font-bold text-gray-800">Thêm tài khoản mới</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 font-sans">
        <form action={formAction} className="space-y-5">
          {!state.success && state.message && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 font-sans">
              {state.message}
            </div>
          )}

          {/* Section: Expected Generated ID */}
          <div className="p-4 bg-primary-50/55 rounded-xl border border-primary-100/50 font-sans">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Mã tài khoản dự kiến</label>
              <input
                type="text"
                disabled
                value="TK****"
                className="w-full px-3 py-2 text-sm font-mono text-primary-700 bg-primary-900/5 border border-primary-100 rounded-lg cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mã tài khoản sẽ được hệ thống tự động tạo theo ID tăng dần của cơ sở dữ liệu khi lưu thành công.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Tên đăng nhập / Username *</label>
              <input
                type="text"
                name="username"
                required
                placeholder="Ví dụ: thao.nguyen"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 font-sans"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Địa chỉ Email *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="Ví dụ: name@dhtn.vn"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Mật khẩu *</label>
              <input
                type="password"
                name="password"
                required
                placeholder="Nhập mật khẩu tài khoản"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 font-sans"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Vai trò hệ thống *</label>
              <select
                name="role_id"
                required
                defaultValue="2"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/30 bg-white font-sans"
              >
                <option value="1">Quản trị viên (Admin)</option>
                <option value="2">Tình nguyện viên</option>
                <option value="3">Giáo viên</option>
                <option value="4">Nhà tài trợ</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 font-sans">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors font-sans"
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
