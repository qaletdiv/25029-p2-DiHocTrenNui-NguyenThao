import React from 'react';
import { LayoutGrid, Bell, Settings, LogOut, Users, Baby, Group } from 'lucide-react';

export default function SideBar() {
    return (
        <>
            <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex flex-col fixed h-full z-20">
                <div className="h-16 flex items-center px-6 border-b border-gray-100 gap-2">
                    {/* Logo */}
                    <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl">
                        K
                    </div>
                    <span className="font-serif text-xl font-bold text-primary-900">KidHope</span>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    <a href='#'> Dashboard </a>
                    <a href='#'> Users </a>
                    <a href='#'> Danh sách học sinh </a>
                    <a href='#'> Danh sách Người hỗ trợ </a>
                    <a href='#'> Thông báo </a>
                    <a href='#'> Quản lý tài khoản </a>
                    
                </nav>

                <div className="p-3 mb-6">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 w-full px-3 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        <span>Log out</span>
                    </button>
                </div>
            </aside>

        </>
    )
}