import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const features = [
    { title: "Caption 1", image: "/images/slide1.jpg" },
    { title: "Caption 2", image: "/images/slide2.jpg" },
    { title: "Caption 3", image: "/images/slide3.jpg" },
];

export default function Features() {
    const videoId = "uZSupM_6zZQ";
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return (
        <div className="bg-white relative z-10 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Video Section */}
            <div className="w-full max-w-3xl mx-auto p-4">                

                {/* Container giữ tỷ lệ 16:9 bằng Tailwind */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg bg-black">
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={embedUrl}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                </div>

                <p className="text-xl font-bold mb-4 text-center">
                    Bản tin VTV Chuyển động 24h về dự án "ĐI HỌC TRÊN NÚI"
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, idx) => (
                    <div key={idx} className="group relative h-64 rounded-xl overflow-hidden cursor-pointer shadow-xl">
                        <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                            <div className="flex justify-between items-end">
                                <h3 className="text-white text-xl font-serif font-bold max-w-[70%]">{feature.title}</h3>
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-colors group-hover:bg-yellow-400">
                                    <ArrowUpRight size={20} className="text-black" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}