"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Menu, Search, User, X } from "lucide-react";
import Button from "../Button/Button";
import logo from '@/assets/logo.jpg';

const NAV_ITEMS = [
    { label: 'Trang chủ', href: '#home' },
    { label: 'Phương thức', href: '#campaigns' },
    { label: 'Giới thiệu', href: '#about' },
    { label: 'Hoạt động', href: '#services' },
    { label: 'Tin tức', href: '#news' },
    { label: 'Liên hệ', href: '#footer' },
]
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="w-full sticky top-0 z-50 bg-white shadow-sm transition-all">
            {/* Main Nav */}
            <div className="py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <a href="#home" className="flex-shrink-0 flex items-center gap-2">
                            <Image
                                src={logo}
                                alt="Logo"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                            <span className="font-serif text-2xl font-bold text-primary-900">ĐI HỌC TRÊN NÚI</span>
                        </a>

                        {/* Desktop Menu */}
                        <nav className="hidden lg:flex space-x-8">
                            {NAV_ITEMS.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="text-primary-900 font-medium text-lg hover:text-primary-700 transition-colors"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-6">
                            <button className="text-primary-900 hover:text-primary-700 transition-colors">
                                <Search size={30} />
                            </button>
                            <button className="text-primary-900 hover:text-primary-700 transition-colors">
                                <User size={30} />
                            </button>
                            <Button variant="primary" size="md">ỦNG HỘ NGAY</Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-primary-900 hover:text-primary-700 focus:outline-none"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden bg-white border-t absolute top-full left-0 w-full shadow-lg">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {NAV_ITEMS.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-primary-900 hover:bg-gray-50"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ))}
                            <div className="pt-4 flex flex-col gap-4 px-3 pb-4">
                                <div className="flex gap-4">
                                    <button className="flex items-center gap-2 text-primary-900"><Search size={20} /> Search</button>
                                    <button className="flex items-center gap-2 text-primary-900"><User size={20} /> Login</button>
                                </div>
                                <Button variant="primary" fullWidth>ỦNG HỘ NGAY</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}