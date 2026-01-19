import React from "react";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Image from "next/image";
import logo from '@/assets/logo.jpg';


export default function Footer() {
    return (
        <footer className="bg-primary-900 text-white pt-20 pb-10" id="footer">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* CTA Section */}
                <div className="border-b border-white/10 pb-16 mb-16 flex flex-col md:flex-row justify-between items-center gap-8">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold max-w-xl">
                        Sống là cho đâu chỉ nhận riêng mình!
                    </h2>
                    {/* Decorative Sun Icon */}
                    <div className="text-yellow-400 hidden lg:block">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                        </svg>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            {/* Logo */}
                            <a href="#home" className="flex-shrink-0 flex items-center gap-2">
                                <Image
                                    src={logo}
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </a>
                            <span className="font-serif text-2xl font-bold">ĐI HỌC TRÊN NÚI</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Copyright © 2026 CLB Bạn Thương Nhau
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-primary-900 transition-colors"><Facebook size={16} /></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-primary-900 transition-colors"><Twitter size={16} /></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-primary-900 transition-colors"><Instagram size={16} /></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-primary-900 transition-colors"><Linkedin size={16} /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">Pages</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-yellow-400">About Us</a></li>
                            <li><a href="#" className="hover:text-yellow-400">Our Mission</a></li>
                            <li><a href="#" className="hover:text-yellow-400">Our Causes</a></li>
                            <li><a href="#" className="hover:text-yellow-400">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">Help</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-yellow-400">FAQ</a></li>
                            <li><a href="#" className="hover:text-yellow-400">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-yellow-400">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:text-yellow-400">Support</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">Contacts</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-yellow-400 mt-0.5" />
                                <span>K36/18 Lê Duẩn, Phường Hải Châu, TP. Đà Nẵng, Việt Nam</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-yellow-400" />
                                <span>+84 963.345.456</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-yellow-400" />
                                <span>btndihoctrennui@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between text-xs text-gray-500">
                    <p>© 2026 Câu Lạc Bộ Bạn Thương Nhau</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Terms & Conditions</a>
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}