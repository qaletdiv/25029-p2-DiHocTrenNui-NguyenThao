"use client";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { Lock, User} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        router.push('/dashboard');
    }
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-yellow-400 selection:text-primary-900">
            <Navbar />
            
            <div className="flex items-center justify-center p-15">
                {/* Main Card */}
                <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] animate-in fade-in zoom-in duration-300">
                    {/* Left Side - Image & Logo */}
                    <div className="relative w-full md:w-1/2 bg-primary-900 overflow-hidden flex items-center justify-center min-h-[200px] md:min-h-full">
                        <img
                            src="/images/background/heart.jpg"
                            alt="Leaves background"
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                        />
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white/95 backdrop-blur-sm relative">
                        <div className="max-w-xs mx-auto w-full">
                            <h2 className="text-3xl font-bold text-gray-800 text-center mb-5">Xin chào!</h2>
                            <p className="text-gray-800 text-left mb-10">
                                Bạn đang đăng nhập vào hệ thống quản lý của chương trình <b>"Đi Học Trên Núi". </b>
                                <br/>
                                Đây là nền tảng trực tuyến để lưu trữ thông tin, quản lý quá trình trao - nhận học bổng và các báo cáo thu/chi, hoạt động của chương trình.
                            </p>
                            <form className="space-y-6" onSubmit={handleLogin}>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-yellow-600/70">
                                        <User size={18} />
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors bg-gray-50/50"
                                        id="email"
                                        type="email"
                                        placeholder="@username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-yellow-600/70">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors bg-gray-50/50"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <a href="#" className="text-xs text-gray-500 hover:text-green-600 transition-colors">Quên mật khẩu?</a>
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-[#9dc84c] to-[#7aa335] text-white px-8 py-2.5 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold text-sm tracking-wide uppercase"
                                    >
                                        Đăng nhập
                                    </button>
                                </div>

                                {error && <p className="text-red-500 mt-2">{error}</p>}
                            </form>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}