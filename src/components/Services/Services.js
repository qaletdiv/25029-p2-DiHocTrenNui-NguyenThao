import React from 'react';
import Button from '../Button/Button';


const SERVICES = [
    {
        title: "Fight Poverty Programs & Service Children",
        desc: "Provides nutritious food, clean water, medical care and educational training to children.",
        image: "https://picsum.photos/400/300?random=8"
    },
    {
        title: "Bright Futures, Education For Every Child",
        desc: "Provides nutritious food, educational training to ensure brighter futures.",
        image: "https://picsum.photos/400/300?random=9",
    },
    {
        title: "Nourish Hope Feeding Children In Crisis",
        desc: "Provides nutritious food, clean water, medical care and educational training to children.",
        image: "https://picsum.photos/400/300?random=10"
    },
    {
        title: "Safe And Sound Shelter For Child",
        desc: "Provides nutritious food, infrastructure, and emotional support for children in crisis.",
        image: "https://picsum.photos/400/300?random=11"
    }
];

export default function Services() {
    return (
        <div className="bg-primary-900 text-white py-24 relative overflow-hidden" id="services">
            {/* Background decoration */}
            <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
                <svg width="400" height="400" viewBox="0 0 100 100">
                    <path d="M0 100 Q 50 0 100 100" fill="none" stroke="white" strokeWidth="2" />
                    <path d="M10 100 Q 60 10 110 100" fill="none" stroke="white" strokeWidth="2" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-2 block">How We Help</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold">Delivering Solutions</h2>
                    </div>
                    <p className="max-w-md text-gray-300 text-sm">
                        We are a dedicated charity organization focused on creating sustainable impact in communities. Join us in our mission to build a better future.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SERVICES.map((item, idx) => (
                        <div
                            key={idx}
                            className="rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 bg-white text-primary-900"
                        >
                            <div className="h-40 mb-6 rounded-lg overflow-hidden">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-bold font-serif mb-4 leading-tight">{item.title}</h3>
                            <p className="text-sm mb-6 text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button variant="outline" className="border-white/30 hover:bg-white hover:text-primary-900">
                        EXPLORE MORE
                    </Button>
                </div>
            </div>
        </div>
    )
}