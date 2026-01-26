import React from 'react';
import Button from '../Button/Button';


const SERVICES = [
    {
        title: "Tiếp nhận thông tin",
        desc: "CLB tiếp nhận thông tin các em học sinh mồ côi hoặc có hoàn cảnh khó khăn từ các Trường học, chọn lọc và đề xuất danh sách các em theo thứ tự ưu tiên theo mức độ khó khăn.",
        image: "/icons/register.png"
    },
    {
        title: "Kêu gọi kinh phí",
        desc: "CLB Bạn Thương Nhau chịu trách nhiệm kêu gọi kinh phí, kết nối với Mạnh Thường Quân, các nhà hảo tâm để tham gia dự án và hỗ trợ các em cho đến khi học hết các cấp học.",
        image: "/icons/sponsor.png",
    },
    {
        title: "Thành lập mối liên kết",
        desc: "Mỗi em học sinh sẽ được đặt một mã số - gắn với 1 MTQ cụ thể. Mỗi một MTQ sẽ cam kết hỗ trợ cho 1 em trong ít nhất 1 năm, và nhiều năm sau nếu dự án vận hành ổn định.",
        image: "/icons/family.png"
    },
    {
        title: "Chuyển tiền cho trường học",
        desc: "Định kỳ hằng tháng (hoặc 2 tháng 1 lần), CLB Bạn Thương Nhau sẽ chuyển khoản cho các Trường kinh phí theo số học sinh từng Trường tham gia dự án. (thông qua Tài khoản của Hiệu trưởng/GV phụ trách).",
        image: "/icons/give-money.png"
    },
    {
        title: "Thực hiện hỗ trợ",
        desc: "Các thầy cô là Hiệu trưởng các Trường tiếp nhận khoản kinh phí nói trên, và chuyển tiền cho những thầy cô giáo phụ trách/dạy học các em ấy, nhờ các thầy cô chuyển tấm lòng của MTQ đến các em học sinh.",
        image: "/icons/giving-gift.png"
    },
    {
        title: "Báo cáo kết quả",
        desc: "Các thầy cô khi trao quà hằng tháng cho các em hoặc gia đình thì chụp hình gửi về CLB cũng như báo cho thành viên CLB được phân công phụ trách, để tổng hợp và báo cáo MTQ.",
        image: "/icons/report.png"
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
                        <h2 className="text-4xl md:text-5xl font-serif font-bold">Cách thức vận hành dự án</h2>
                    </div>
                    <p className="max-w-md text-gray-300 text-sm">
                        Chúng tôi hoạt động vì sự phát triển bền vững của cộng đồng. Đồng hành cùng chúng tôi để kiến tạo một tương lai tốt đẹp hơn.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SERVICES.map((item, idx) => (
                        <div
                            key={idx}
                            className="rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 bg-white text-primary-900"
                        >
                            <div className="h-20 mb-6 rounded-lg overflow-hidden">
                                <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                            </div>
                            <h3 className="text-2xl text-center font-bold font-serif mb-4 leading-tight">{item.title}</h3>
                            <p className="mb-6 text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}