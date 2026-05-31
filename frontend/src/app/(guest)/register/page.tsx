"use client";
import React, { useActionState } from "react";
import { Lock, User, Mail, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import heartBg from "@/assets/images/background/heart.jpg";
import { registerAction } from "@/services/register";

const ROLES = [
  { id: 1, code: 'ADMIN', name: 'Administrator' },
  { id: 2, code: 'VOLUNTEER', name: 'Volunteer' },
  { id: 3, code: 'TEACHER', name: 'Teacher' },
  { id: 4, code: 'SPONSOR', name: 'Sponsor' },
];

export default function RegisterPage() {
    const [preState, formAction, isPending] = useActionState(registerAction, { username: null, email: null, password: null, role_id: null, error: null });

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-yellow-400 selection:text-primary-900">

            <div className="flex items-center justify-center p-15">
                {/* Main Card */}
                <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] animate-in fade-in zoom-in duration-300">
                    {/* Left Side - Image & Logo */}
                    <div className="relative w-full md:w-1/2 bg-primary-900 overflow-hidden flex items-center justify-center min-h-[200px] md:min-h-full">
                        <Image
                            src={heartBg}
                            alt="Leaves background"
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                        />
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white/95 backdrop-blur-sm relative">
                        <div className="max-w-xs mx-auto w-full">
                            <h2 className="text-3xl font-bold text-gray-800 text-center mb-5">Đăng ký tài khoản</h2>
                            <p className="text-gray-600 text-center mb-8">
                                Điền thông tin bên dưới để tạo tài khoản mới trong hệ thống <b>"Đi Học Trên Núi".</b>
                            </p>
                            <form className="space-y-4" action={formAction}>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-yellow-600/70">
                                        <User size={18} />
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors bg-gray-50/50"
                                        id="username"
                                        type="text"
                                        name="username"
                                        placeholder="@username"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-yellow-600/70">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors bg-gray-50/50"
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Email (ví dụ: email@gmail.com)"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-yellow-600/70">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        placeholder="Mật khẩu"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors bg-gray-50/50"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-yellow-600/70">
                                        <Shield size={18} />
                                    </div>
                                    <select
                                        id="role_id"
                                        name="role_id"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors bg-gray-50/50 appearance-none"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Chọn vai trò của bạn</option>
                                        {ROLES.map(role => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <Link href="/login" className="text-xs text-gray-500 hover:text-green-600 transition-colors">
                                        Đã có tài khoản? Đăng nhập
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="bg-gradient-to-r from-[#9dc84c] to-[#7aa335] text-white px-8 py-2.5 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold text-sm tracking-wide uppercase"
                                    >
                                        {isPending ? "Đang xử lý..." : "Đăng ký"}
                                    </button>
                                </div>

                                {preState.error && <p className="text-red-500 mt-2 text-sm text-center">{preState.error}</p>}
                            </form>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
