import React from 'react';
import { Droplet, Heart, Shield, Users } from 'lucide-react';

const VALUES = [
    { icon: Droplet, title: "Clean Water & Energy", desc: "Growing up in poverty, children face tough challenges." },
    { icon: Heart, title: "Global Health", desc: "High quality healthcare and preventive services." },
    { icon: Shield, title: "Protection", desc: "Ensuring that kids are safe and have access to human rights." },
    { icon: Users, title: "Social Ventures", desc: "We find smart solutions to fight global poverty." },
];

export default function Values() {
    return (
        <div className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16">

                    <div className="space-y-12">
                        <div>
                            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Our Core Values</span>
                            <h2 className="text-4xl font-serif font-bold text-primary-900 mt-2">Helping Others <br /> Improves The World</h2>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-y-12 gap-x-8">
                            {VALUES.map((v, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-primary-900">
                                        <v.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-primary-900">{v.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <img src="https://picsum.photos/400/500?random=12" className="rounded-2xl w-full h-full object-cover translate-y-8" alt="Volunteer" />
                            <img src="https://picsum.photos/400/500?random=13" className="rounded-2xl w-full h-full object-cover" alt="Happy Kids" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};