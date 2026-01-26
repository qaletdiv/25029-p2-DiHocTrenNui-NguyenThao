import React from 'react';
import Button from '../Button/Button';

const CAMPAIGNS = [
    {
        id: '1',
        title: "A Greater Reach for Uptown Bill's",
        description: "Please help us expand our services to reach out diverse communities and persons of all ability.",
        raised: 5100,
        goal: 9000,
        image: "https://picsum.photos/400/250?random=14",
        percentage: 100
    },
    {
        id: '2',
        title: "Rose & HGS Children's Sponsorship",
        description: "We are raising money in cooperation with our contact center partner HGS to be donated to C...",
        raised: 8250,
        goal: 14000,
        image: "https://picsum.photos/400/250?random=15",
        percentage: 65
    },
    {
        id: '3',
        title: "Raising money for Vision Rescue",
        description: "In East India, we run teams to raise money for the good work of Vision Rescue who help street...",
        raised: 1150,
        goal: 1500,
        image: "https://picsum.photos/400/250?random=16",
        percentage: 97
    }
];

const IMPACT_STATS = [
    { value: "400+", label: "Học sinh", gradient: "from-[#65d666] to-[#3abb5c]" }, // Green
    { value: "300+", label: "Người hỗ trợ", gradient: "from-[#ff9642] to-[#ff6a2b]" }, // Orange
    { value: "10.000+", label: "Học bổng đã trao", gradient: "from-[#2bc2d5] to-[#3498db]" }, // Blue
    { value: "3", label: "Năm hoạt động", gradient: "from-[#f566aa] to-[#f43f5e]" }, // Pink
];

export default function Campaigns() {
    return (
        <div className="py-10 bg-gray-50" id="campaigns">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">We Need Your Help</span>
                    <h2 className="text-4xl font-serif font-bold text-primary-900 mt-2">Kết quả đến nay</h2>
                </div>

                {/* Impact Statistics Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32 lg:mb-40 justify-items-center items-start">
                    {IMPACT_STATS.map((stat, idx) => (
                        <div
                            key={idx}
                            className={`w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br ${stat.gradient} flex flex-col items-center justify-center text-white shadow-xl hover:scale-105 transition-transform duration-300 cursor-default ${idx % 2 !== 0 ? 'lg:mt-24' : ''}`}
                        >
                            <span className="text-3xl sm:text-4xl font-bold mb-1 shadow-black/10 drop-shadow-md">{stat.value}</span>
                            <span className="text-sm sm:text-base font-medium opacity-95 text-center px-4">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};