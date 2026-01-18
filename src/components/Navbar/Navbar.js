"use client";
import React, { useState } from "react";
import { Menu, Search, User, X } from "lucide-react";
import Button from "../Button/Button";

const NAV_ITEMS = [
    { label: 'Home', href: '#home' },
    { label: 'Campaigns', href: '#campaigns' },
    { label: 'About Us', href: '#about' },
    { label: 'Pages', href: '#services' },
    { label: 'News', href: '#news' },
    { label: 'Contacts', href: '#footer' },
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
                            <div className="w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center text-white">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="white" stroke="none" />
                                    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" className="text-primary-900" fill="currentColor" />
                                </svg>
                            </div>
                            <span className="font-serif text-2xl font-bold text-primary-900">KidHope</span>
                        </a>

                        {/* Desktop Menu */}
                        <nav className="hidden lg:flex space-x-8">
                            {NAV_ITEMS.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="text-primary-900 font-medium text-sm hover:text-primary-700 transition-colors"
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
                            <Button variant="primary" size="md">DONATE NOW</Button>
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
                                <Button variant="primary" fullWidth>DONATE NOW</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}