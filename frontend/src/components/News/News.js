import React from 'react';

export default function News() {
    return (
        <div className="py-24 bg-white" id="news">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-serif font-bold text-primary-900 mt-2">Tin tức</h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Main Article */}
                    <div className="group cursor-pointer">
                        <div className="rounded-2xl overflow-hidden mb-6 h-80">
                            <img src="https://picsum.photos/800/600?random=21" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Main Blog" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-primary-900 mb-3 group-hover:text-primary-700">How To Engage Millennials In Charity Work</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <div className="flex items-center text-xs text-gray-400 gap-4">
                            <span>By Admin</span>
                            <span>•</span>
                            <span>2 Comments</span>
                        </div>
                    </div>

                    {/* Side Articles List */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="group cursor-pointer">
                            <div className="rounded-xl overflow-hidden mb-4 h-48">
                                <img src="https://picsum.photos/400/300?random=22" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Blog 2" />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-primary-900 mb-2 leading-tight group-hover:text-primary-700">Creating Long-Term Partnerships with Donors</h3>
                            <p className="text-gray-500 text-xs mb-3 line-clamp-2">Developing sustainable relationships is key.</p>
                            <div className="flex items-center text-xs text-gray-400 gap-2">
                                <span>By Admin</span>
                                <span>•</span>
                                <span>5 Comments</span>
                            </div>
                        </div>

                        {/* Small List Items */}
                        <div className="flex flex-col gap-6">
                            {[
                                "The Importance of Corporate Social Responsibility",
                                "Ways to Promote Your Non-Profit on Social Media",
                                "How Technology is Changing the Charity Sector",
                                "Why Transparency is Key for Non-Profit Success"
                            ].map((title, i) => (
                                <div key={i} className="flex gap-4 group cursor-pointer">
                                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                        <img src={`https://picsum.photos/150/150?random=${23 + i}`} className="w-full h-full object-cover" alt="Thumb" />
                                    </div>
                                    <div>
                                        <h4 className="font-serif font-bold text-primary-900 text-sm leading-tight mb-1 group-hover:text-primary-700">{title}</h4>
                                        <span className="text-[10px] text-gray-400">Oct 24, 2023</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};