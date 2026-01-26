import React from 'react';
import { Heart, Users } from 'lucide-react';

const VALUES = [
    { 
        icon: Heart, 
        title: "Thấu hiểu", 
        desc: `Trên những làng bản xa xôi lẫn khuất giữa đại ngàn Trường Sơn, hàng ngàn bạn nhỏ có hoàn cảnh
                khó khăn đang phải đi học qua những cung đường núi cheo leo. Những ngôi nhà tạm bợ nằm hút
                sâu trong núi, những đứa trẻ lem luốc nhưng lễ phép hiền lành. Hành trình học chữ hết sức
                gian nan. Đặc biệt đối với các bạn nhỏ mồ côi thì cơ cực hơn rất nhiều...`
    },
    { 
        icon: Users,
        title: "Chia sẻ - Hỗ trợ", 
        desc: `Dự án sẽ hỗ trợ hằng tháng hoặc hằng quý tuỳ vào hoàn cảnh thực tế của các em. Số tiền hỗ trợ sẽ
                được sử dụng để mua thực phẩm thức ăn, hoặc sách vở và dụng cụ học tập, hoặc quần áo, hoặc
                những vật dụng cần thiết cho sinh hoạt đời thường. Chỉ cần 1 gia đình dưới phố nhận nuôi 1
                em trên núi, sẽ giúp cho hành trình học chữ của các em bớt gian nan.` 
    },
];

export default function Values() {
    return (
        <div className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16">

                    <div className="space-y-12">
                        <div className="grid sm:grid-cols-2 gap-y-12 gap-x-8">
                            {VALUES.map((v, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-primary-900">
                                        <v.icon size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-primary-900">{v.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <img src="/images/hoan-canh.jpg" className="rounded-2xl w-full h-full object-cover translate-y-8" alt="Volunteer" />
                            <img src="/images/trao qua.jpg" className="rounded-2xl w-full h-full object-cover" alt="Happy Kids" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};