"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { logoutAction } from "@/services/login";

interface DashboardHeaderProps {
  pageTitle: string;
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  user?: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
}

export default function DashboardHeader({
  pageTitle,
  mobileMenuOpen,
  onMobileMenuToggle,
  user,
}: DashboardHeaderProps) {
  const displayUser = user ?? { name: "Admin", role: "Quản trị viên" };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-100 shadow-sm flex items-center px-4 gap-4">
      {/* Left: Mobile menu button + Logo + Page title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger (mobile only) */}
        <button
          id="mobile-menu-toggle"
          onClick={onMobileMenuToggle}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-primary-900 hover:bg-gray-100 transition-colors"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo */}
        <Link
          href="/"
          id="logoBTN"
          className="flex-shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="Về trang chủ"
        >
          <Image
            src="/logoBTN.jpg"
            alt="Đi Học Trên Núi Logo"
            width={36}
            height={36}
            className="rounded-md object-contain"
            priority
          />
          <span className="hidden sm:block font-bold text-primary-900 text-sm leading-tight">
            ĐI HỌC
            <br />
            TRÊN NÚI
          </span>
        </Link>

        {/* Divider */}
        <span className="hidden sm:block h-6 w-px bg-gray-200" />

        {/* Page title */}
        <h1 className="font-semibold text-gray-700 text-sm sm:text-base truncate">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Notification + User */}
      <div className="ml-auto flex items-center gap-3">
        {/* TODO:Notification bell */}
        {/* <button
          className="relative flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100 hover:text-primary-900 transition-colors"
          aria-label="Thông báo"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 block w-2 h-2 bg-accent-orange rounded-full ring-2 ring-white" />
        </button> */}

        {/* User info */}
        <Link
          id="user-profile-btn"
          href="/profile"
          className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-gray-100 transition-colors group"
          aria-label="Hồ sơ người dùng"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ring-2 ring-primary-700/30">
            {displayUser.avatarUrl ? (
              <Image
                src={displayUser.avatarUrl}
                alt={displayUser.name}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <span>{displayUser.name.charAt(0).toUpperCase()}</span>
            )}
          </div>

          {/* Name + role — hidden on xs */}
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-xs font-semibold text-gray-800 truncate max-w-[120px]">
              {displayUser.name}
            </span>
            <span className="text-[10px] text-gray-500 truncate max-w-[120px]">
              {displayUser.role}
            </span>
          </div>

          <ChevronDown
            size={14}
            className="hidden sm:block text-gray-400 group-hover:text-gray-600 transition-transform group-hover:rotate-180"
          />
        </Link>

        {/* Logout button */}
        <button
          id="logout-btn"
          onClick={() => logoutAction()}
          className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
          title="Đăng xuất"
          aria-label="Đăng xuất"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
