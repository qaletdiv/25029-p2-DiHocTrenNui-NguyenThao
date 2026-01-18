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

export default function Campaigns() {
    return (
        <div className="py-20 bg-gray-50" id="campaigns">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">We Need Your Help</span>
                    <h2 className="text-4xl font-serif font-bold text-primary-900 mt-2">Featured Campaigns</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {CAMPAIGNS.map((camp) => (
                        <div key={camp.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                            <div className="relative h-48">
                                <img src={camp.image} alt={camp.title} className="w-full h-full object-cover" />

                                {/* Circular Progress Overlay */}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full p-1 shadow-md">
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="28" cy="28" r="26" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                                            <circle
                                                cx="28" cy="28" r="26"
                                                stroke="#14402a"
                                                strokeWidth="4"
                                                fill="none"
                                                strokeDasharray={163}
                                                strokeDashoffset={163 - (163 * camp.percentage) / 100}
                                                className="transition-all duration-1000"
                                            />
                                        </svg>
                                        <span className="absolute text-xs font-bold text-primary-900">{camp.percentage}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 pb-8 px-6 flex-1 flex flex-col text-center">
                                <h3 className="text-xl font-bold font-serif text-primary-900 mb-3">{camp.title}</h3>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{camp.description}</p>

                                <div className="flex justify-between text-xs font-bold text-gray-500 mb-6 mt-auto border-t pt-4">
                                    <div>
                                        <span className="block text-primary-900 mb-1">Goal</span>
                                        <span>${camp.goal.toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span className="block text-primary-900 mb-1">Raised</span>
                                        <span>${camp.raised.toLocaleString()}</span>
                                    </div>
                                </div>

                                <Button variant="accent" fullWidth size="sm">DONATE NOW</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};