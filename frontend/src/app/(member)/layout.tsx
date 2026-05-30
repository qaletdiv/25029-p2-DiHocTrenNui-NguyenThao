"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/member/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/member/dashboard/DashboardSidebar";
import DashboardFooter from "@/components/member/dashboard/DashboardFooter";
import { PermissionProvider, usePermission } from "@/contexts/PermissionContext";

interface MemberLayoutProps {
  children: React.ReactNode;
}

export default function MemberLayout({ children }: MemberLayoutProps) {
  return (
    <PermissionProvider>
      <MemberLayoutContent>{children}</MemberLayoutContent>
    </PermissionProvider>
  );
}

function MemberLayoutContent({ children }: MemberLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { account, loading } = usePermission();

  const ROLE_MAP: Record<number, string> = {
    1: "Quản trị viên",
    2: "Tình nguyện viên",
    3: "Giáo viên",
    4: "Nhà tài trợ",
  };

  const userProp = account
    ? { name: account.username, role: ROLE_MAP[account.role_id] || "Người dùng" }
    : loading
    ? { name: "Đang tải...", role: "..." }
    : { name: "Admin", role: "Quản trị viên" };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Sticky Header — h-16 */}
      <DashboardHeader
        pageTitle="Dashboard Overview"
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
        user={userProp}
      />

      {/* Sidebar — fixed, starts below header */}
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content — offset for header (top-16) and sidebar (lg:pl-60) and footer (pb-10) */}
      <main className="pt-16 pb-10 lg:pl-60 min-h-screen transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      {/* Sticky Footer — h-10 */}
      <DashboardFooter />
    </div>
  );
}