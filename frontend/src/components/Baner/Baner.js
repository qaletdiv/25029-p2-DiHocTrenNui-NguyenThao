import { Play } from "lucide-react";
import Button from "../Button/Button";


export default function Baner() {

    return (
        <div className="relative overflow-hidden min-h-[600px] flex items-center bg-yellow-400" id="home">
            {/* Background Split */}
            <div className="absolute top-0 left-0 w-full lg:w-[45%] h-full bg-primary-900 z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center py-12 lg:py-20">

                {/* Left Content */}
                <div className="text-white space-y-8 relative">
                    {/* Decorative Sparkle */}
                    <div className="absolute -top-6 right-10 lg:right-20 text-yellow-400 hidden sm:block">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="currentColor" />
                        </svg>
                    </div>

                    <p className="text-gray-300 font-bold tracking-[0.2em] text-medium uppercase">
                        DỰ ÁN CỘNG ĐỒNG
                    </p>

                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium font-bold leading-[1.1]">
                        Hỗ Trợ những bạn nhỏ <br />
                        mồ côi, khó khăn ở vùng cao <br />
                        đi học lâu dài.
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 pt-4">
                        <Button variant="accent" size="lg" className="rounded-full px-8">ỦNG HỘ NGAY</Button>
                    </div>
                </div>

                {/* Right Content - Single Image with Decor */}
                <div className="relative h-full flex items-center justify-center lg:justify-end">
                    <div className="relative w-full aspect-[4/3] max-w-xl">
                        {/* Main Image */}
                        <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10">
                            <img
                                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop"
                                alt="Smiling children group"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Decorative Pink Sunburst */}
                        <div className="absolute -bottom-10 -right-10 z-20 text-[#fca5a5]">
                            <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                {/* 16 point starburst */}
                                <path d="M50 0L57 35L90 20L70 50L90 80L57 65L50 100L43 65L10 80L30 50L10 20L43 35L50 0Z" />
                                {/* Circle center to make it look like the icon in image */}
                                <circle cx="50" cy="50" r="15" fill="#fca5a5" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}