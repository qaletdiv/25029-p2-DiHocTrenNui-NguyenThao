"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  HandHeart,
  School,
  BookUser,
  Users,
  Images,
  Receipt,
  BarChart3,
  UserCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Học sinh", href: "/students", icon: GraduationCap },
  { label: "Nhà tài trợ", href: "/sponsors", icon: HandHeart },
  { label: "Trường học", href: "/schools", icon: School },
  { label: "Giáo viên", href: "/teachers", icon: BookUser },
  { label: "Tình nguyện viên", href: "/volunteers", icon: Users },
  { label: "Hình ảnh", href: "/images", icon: Images },
  { label: "Giao dịch", href: "/transactions", icon: Receipt },
  { label: "Báo cáo", href: "/reports", icon: BarChart3 },
  { label: "Hồ sơ", href: "/profile", icon: UserCircle },
  { label: "Tài khoản", href: "/accounts", icon: ShieldCheck },
];

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function DashboardSidebar({
  mobileOpen,
  onMobileClose,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-primary-900 text-white flex flex-col transition-all duration-300 ease-in-out",
          /* mobile: slide in/out */
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          /* desktop collapsed width */
          collapsed ? "lg:w-16" : "lg:w-60",
          /* always full width panel on mobile */
          "w-60",
        ].join(" ")}
      >
        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <ul className="space-y-1 px-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onMobileClose}
                    title={collapsed ? item.label : undefined}
                    className={[
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                      isActive
                        ? "bg-white/20 text-accent-yellow shadow-inner"
                        : "text-white/80 hover:bg-white/10 hover:text-white",
                      collapsed ? "lg:justify-center lg:px-0" : "",
                    ].join(" ")}
                  >
                    <item.icon
                      size={20}
                      className={[
                        "flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
                        isActive ? "text-accent-yellow" : "",
                      ].join(" ")}
                    />
                    <span
                      className={[
                        "truncate transition-all duration-200",
                        collapsed ? "lg:hidden" : "",
                      ].join(" ")}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop collapse toggle */}
        <div className="hidden lg:flex items-center justify-end border-t border-white/10 px-3 py-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
