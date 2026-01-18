import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const features = [
    { title: "Companies House", image: "https://picsum.photos/400/300?random=3" },
    { title: "Take Action", image: "https://picsum.photos/400/300?random=4" },
    { title: "Building A Future In Africa", image: "https://picsum.photos/400/300?random=5" },
];

export default function Features() {
    return (
        <div className="bg-white relative z-10 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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