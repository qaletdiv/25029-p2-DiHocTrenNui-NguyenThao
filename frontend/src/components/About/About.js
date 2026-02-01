import React from "react";
import Image from "next/image";


export default function About() {
    return (
        <div className="py-20 bg-gray-50" id="about">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-8">
                        {/* Left Images */}
                        <div className="grid grid-cols-2 gap-6 items-stretch">
                            {/* Column 1: Image + Quote */}
                            <div className="space-y-6 flex flex-col">
                                <Image
                                    src="/Images/Girl to school.jpg"
                                    alt="Girl to school"
                                    width={400}
                                    height={200}
                                    className="rounded-2xl object-cover h-56 w-full shadow-lg"
                                />
                                <div className="bg-white p-6 shadow-xl rounded-2xl flex-1 flex flex-col justify-center">
                                    <p className="text-gray-600 italic font-sans text-sm mb-4 leading-relaxed">
                                        Trên những làng bản xa xôi lẫn khuất giữa đại ngàn Trường Sơn, hàng ngàn bạn nhỏ có hoàn cảnh khó khăn đang phải đi học qua những cung đường núi cheo leo. Những ngôi nhà tạm bợ nằm hút sâu trong núi, những đứa trẻ lem luốc nhưng lễ phép hiền lành. Hành trình học chữ hết sức gian nan. Đặc biệt đối với các bạn nhỏ mồ côi thì cơ cực hơn rất nhiều...
                                    </p>
                                </div>
                            </div>

                            {/* Column 2: Tall Image */}
                            <div className="h-full">
                                <Image
                                    src="/Images/Children smiling.jpg"
                                    alt="Children smiling"
                                    width={400}
                                    height={600}
                                    className="rounded-2xl object-cover w-full h-full shadow-lg min-h-[300px]"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4">
                        {/* Right Content */}
                        <div className="lg:col-span-5 space-y-8 pt-4">
                            <h2 className="text-4xl md:text-5xl font-sans font-bold text-primary-900 leading-tight">
                                Giới thiệu dự án
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                <b>Phụ trách:</b> CLB Bạn Thương Nhau - Đà Nẵng
                                <br />
                                <b>Mục tiêu:</b> hỗ trợ các em học sinh mồ côi/đặc biệt khó khăn ở vùng cao bám trường, bám lớp đi học lâu dài
                                <br />
                                <b>Điều kiện nhận hỗ trợ:</b> Các bạn nhỏ phải đi học
                                <br />
                                <b>Mức hỗ trợ:</b> 500.000 đồng/em/tháng (6.000.000 đồng/em/năm)
                                <br />
                                <b>Hình thức hỗ trợ:</b> Hằng tháng, dự án gửi tiền đến Trường/thầy cô, thầy cô mua sắm những vật dụng cần thiết hoặc nhu yếu phẩm... tùy thuộc vào nhu cầu học sinh và gia đình để trao đến các em.
                            </p>

                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
    );
}