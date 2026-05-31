"use client";

import React from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/member/common/PageShell";

interface AccessDeniedProps {
  title?: string;
  message?: string;
}

export default function AccessDenied({
  title = "Không có quyền truy cập",
  message = "Bạn không có quyền xem trang này. Vui lòng liên hệ với Quản trị viên nếu bạn tin rằng đây là một sự nhầm lẫn.",
}: AccessDeniedProps) {
  const router = useRouter();

  return (
    <PageShell
      title={title}
      subtitle="Truy cập bị từ chối"
      icon={ShieldAlert}
      iconColor="bg-red-50 text-red-600 border border-red-100"
    >
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 max-w-md mx-auto text-center my-8 flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center animate-pulse">
          <ShieldAlert size={32} />
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-gray-800">Quyền truy cập bị hạn chế</h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {message}
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gray-150 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          <ArrowLeft size={16} />
          Quay lại trang trước
        </button>
      </div>
    </PageShell>
  );
}
