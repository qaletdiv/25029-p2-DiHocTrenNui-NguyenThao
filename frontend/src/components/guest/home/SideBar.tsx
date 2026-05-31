"use client";
import React, { useState } from 'react';
import { LayoutGrid, Settings, Users, Baby, Group } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SideBarProps {}

type NavItem = {
    name: string;
    icon: typeof LayoutGrid;
    path: string;
};

export default function SideBar({}: SideBarProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Dashboard');

    const navItems: NavItem[] = [
        { name: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
        { name: 'Tài Khoản', icon: Users, path: '/account' },
        { name: 'Học Sinh', icon: Baby, path: '/students' },
        { name: 'Người Hỗ Trợ', icon: Group, path: '/sponsors' },
        { name: 'Quản Lý', icon: Settings, path: '/settings' },
    ];

    const handleNavClick = (item: NavItem) => {
        setActiveTab(item.name);
        router.push(item.path);
    };

    
    return (
        <aside className="w-64 h-full bg-primary-900 text-white flex flex-col">
            <div className="p-8">
                <h1 className="text-2xl font-bold tracking-wider">Đi Học Trên Núi</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => handleNavClick(item)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${activeTab === item.name ? 'bg-white/20' : 'hover:bg-white/10'
                            }`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.name}</span>
                    </button>
                ))}
            </nav>
        </aside>


    )
}