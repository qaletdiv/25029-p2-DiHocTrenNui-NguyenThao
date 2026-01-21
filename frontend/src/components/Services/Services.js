import React from 'react';
import Button from '../Button/Button';


const SERVICES = [
    {
        title: "Tiếp nhận thông tin",
        desc: "Nhận thông tin về các em học sinh (thông tin cá nhân, hoàn cảnh gia đình và đề xuất ưu tiên) qua website dihoctrennui.com, Fb Nguyễn Bình Nam hoặc người giới thiệu khác.",
        image: "https://picsum.photos/400/300?random=8"
    },
    {
        title: "Kêu gọi kinh phí",
        desc: "CLB Bạn Thương Nhau chịu trách nhiệm xác nhận thông tin và hoàn cảnh các em học sinh, kêu gọi kinh phí, kết nối với Mạnh Thường Quân, các nhà hảo tâm để tham gia dự án.",
        image: "https://picsum.photos/400/300?random=9",
    },
    {
        title: "Thành lập mối liên kết",
        desc: "Mỗi MTQ cam kết hỗ trợ ít nhất một em trong một năm, có thể kéo dài nếu dự án ổn định. Trong năm, CLB sẽ tổ chức chuyến thăm để các đại diện MTQ gặp gỡ các em tại trường học.",
        image: "https://picsum.photos/400/300?random=10"
    },
    {
        title: "Chuyển tiền cho trường học",
        desc: "Đại diện các Trường sau khi tiếp nhận kinh phí sẽ chuyển tiền cho những thầy cô giáo phụ trách hoặc dạy học của các em, nhờ các thầy cô chuyển tấm lòng của MTQ đến các em.",
        image: "https://picsum.photos/400/300?random=11"
    },
    {
        title: "Thực hiện hỗ trợ",
        desc: "Các thầy cô khi trao quà hằng tháng cho các em hoặc gia đình thì chụp hình gửi về CLB cũng như báo cho thành viên CLB được phân công phụ trách, để tổng hợp và báo cáo MTQ.",
        image: "https://picsum.photos/400/300?random=12"
    },
    {
        title: "Báo cáo kết quả",
        desc: "Các thầy cô khi trao quà hằng tháng cho các em hoặc gia đình thì chụp hình gửi về CLB cũng như báo cho thành viên CLB được phân công phụ trách, để tổng hợp và báo cáo MTQ.",
        image: "https://picsum.photos/400/300?random=13"
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
                        <h2 className="text-4xl md:text-5xl font-serif font-bold">Cách thức vận hành dự án</h2>
                    </div>
                    <p className="max-w-md text-gray-300 text-sm">
                        We are a dedicated charity organization focused on creating sustainable impact in communities. Join us in our mission to build a better future.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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