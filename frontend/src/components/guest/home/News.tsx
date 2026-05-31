import React from 'react';

interface NewsItem {
    title: string;
    description?: string;
    url: string;
    imageUrl: string;
    author?: string;
    comments?: string;
    date?: string;
}

const newsData: NewsItem[] = [
    {
        title: "'Đi học trên núi' và giấc mơ của cô bé Xơ Đăng",
        description: "Giữa bao la núi rừng, con đường đến trường của các em nhỏ DTTS nhiều nơi vẫn hiểm trở, gian nan. Thế nhưng, các em và gia đình vẫn kiên trì vượt qua bởi một khát khao mãnh liệt - được học chữ, được đổi đời.",
        url: "https://tienphong.vn/di-hoc-tren-nui-va-giac-mo-cua-co-be-xo-dang-post1766143.tpo",
        imageUrl: "https://cdn.tienphong.vn/images/64ab62f861e3c9801920e64b3e25694a38c595fd1c60bf7b5eb26971c1e5806248597b390265b11901f26988dd1c765bf0ca7ea95604f1801b5908427e7f00fe/ps-ngay-48-a8.jpg.avif",
        author: "tienphong.vn",
        comments: "2 Comments"
    },
    {
        title: "Thắp sáng ước mơ của các em nhỏ mồ côi vùng cao",
        description: "Chương trình đã trao tặng 100 phần quà gồm gạo, nhu yếu phẩm và tiền mặt trị giá 500.000 đồng cho 100 em nhỏ mồ côi, hoàn cảnh khó khăn tại 3 điểm trường.",
        url: "https://vtv.vn/giao-duc/thap-sang-uoc-mo-cua-cac-em-nho-mo-coi-vung-cao-20220906191401565.htm",
        imageUrl: "https://cdn-images.vtv.vn/2022/9/6/vtt-1662466218007783539446.jpg",
        author: "vtv.vn",
        comments: "5 Comments"
    },
    {
        title: "Chàng kỹ sư 16 năm 'treo đèo' xây trường vùng cao",
        description: "Vượt qua bao khó khăn, anh Nguyễn Văn Luyện đã gắn bó suốt 16 năm với vùng cao Tây Bắc, xây dựng hàng chục điểm trường và hỗ trợ cho hàng nghìn trẻ em vùng cao được đến trường.",
        url: "https://thanhnien.vn/chang-ky-su-16-nam-treo-deo-loi-suoi-xay-truong-vung-cao-185260529160533047.htm",
        imageUrl: "https://images2.thanhnien.vn/528068263637045248/2026/5/29/song-dep1-1780045523029266286190.jpg?_gl=1*1mqmha7*_ga*MTE1OTg5NjA2OS4xNzgwMTU2MzY0*_ga_DDKGVNZ9BG*czE3ODAxNTYzNjQkbzEkZzEkdDE3ODAxNTkyMTMkajU0JGwwJGgw",
        date: "Oct 24, 2023"
    },
    {
        title: "Những “bà tiên, ông bụt” ươm mầm tương lai cho học sinh ở miền núi",
        description: "Họ là những người đồng hành, sẻ chia với học sinh có hoàn cảnh khó khăn, giúp các em có thêm động lực để đến trường.",
        url: "https://danviet.vn/nhung-ba-tien-ong-but-uom-mam-tuong-lai-cho-hoc-sinh-o-mien-nui-da-nang-d1359493.html",
        imageUrl: "https://i.ex-cdn.com/danviet.vn/files/content/2025/08/31/z5785490180457_e5c5014d48f77b580dbfaa021925db82-0936.jpg",
        date: "Oct 24, 2023"
    },
    {
        title: "Tiếp sức hàng trăm em nhỏ đi học trên núi",
        description: "Chương trình đã trao tặng 100 phần quà gồm gạo, nhu yếu phẩm và tiền mặt trị giá 500.000 đồng cho 100 em nhỏ mồ côi, hoàn cảnh khó khăn tại 3 điểm trường.",
        url: "https://tamviet.tienphong.vn/tiep-suc-hang-tram-em-nho-di-hoc-tren-nui-post1575098.tpo",
        imageUrl: "https://cdn.tienphong.vn/images/814b5533c866dc3540018a126103e935c7dbf34aa57fdd7f6277fd3ebd557f4820d4014ef0b618c7fb4cce75471c8b4bdcfbe784df07093ac8b78944e898509f82c915bf9c4ba2188927da8f0b0695a6f0ca7ea95604f1801b5908427e7f00fe/104da-nang-di-hoc-tren-nui1-8990.jpg.avif",
        date: "Oct 24, 2023"
    },
    {
        title: "Nới dài đường đến trường",
        description: "những giúp đỡ âm thầm của nhiều cá nhân đã nối dài đường đến trường cho học sinh có hoàn cảnh đặc biệt khó khăn; Đồng thời, cải thiện thể chất, nâng cao thể lực cho các em.",
        url: "https://giaoducthoidai.vn/noi-dai-duong-den-truong-post606568.html",
        imageUrl: "https://cdn.giaoducthoidai.vn/images/a66b69a1b81b0f72a4339ef11b1c2c632817e21bc3b36f5a8cab9638b258e82cea8db2cb6f5b9801054f74f6b873ee361a72a8a3c49285977fd58ab80bdb4bd6/anh-2-dong-hanh-1432.jpg.avif",
        date: "Oct 24, 2023"
    }
];

interface NewsProps { }

export default function News({ }: NewsProps) {
    const mainNews = newsData[0];
    const sideNews = newsData[1];
    const smallNewsList = newsData.slice(2);

    return (
        <div className="py-24 bg-white" id="news">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-sans font-bold text-primary-900 mt-2">Tin tức</h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Main Article */}
                    {mainNews && (
                        <div className="group cursor-pointer">
                            <div className="rounded-2xl overflow-hidden mb-6 h-80">
                                <img src={mainNews.imageUrl} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={mainNews.title} />
                            </div>
                            <h3 className="text-2xl font-sans font-bold text-primary-900 mb-3 group-hover:text-primary-700">
                                <a href={mainNews.url} target="_blank" rel="noopener noreferrer">
                                    {mainNews.title}
                                </a>
                            </h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                {mainNews.description}
                            </p>
                            <div className="flex items-center text-xs text-gray-400 gap-4">
                                {mainNews.author && <span>By {mainNews.author}</span>}
                                {mainNews.author && mainNews.comments && <span>•</span>}
                                {mainNews.comments && <span>{mainNews.comments}</span>}
                            </div>
                        </div>
                    )}

                    {/* Side Articles List */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {sideNews && (
                            <div className="group cursor-pointer">
                                <div className="rounded-xl overflow-hidden mb-4 h-48">
                                    <img src={sideNews.imageUrl} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={sideNews.title} />
                                </div>
                                <h3 className="text-lg font-sans font-bold text-primary-900 mb-2 leading-tight group-hover:text-primary-700">
                                    <a href={sideNews.url} target="_blank" rel="noopener noreferrer">
                                        {sideNews.title}
                                    </a>
                                </h3>
                                <p className="text-gray-500 text-xs mb-3 line-clamp-2">{sideNews.description}</p>
                                <div className="flex items-center text-xs text-gray-400 gap-2">
                                    {sideNews.author && <span>By {sideNews.author}</span>}
                                    {sideNews.author && sideNews.comments && <span>•</span>}
                                    {sideNews.comments && <span>{sideNews.comments}</span>}
                                </div>
                            </div>
                        )}

                        {/* Small List Items */}
                        <div className="flex flex-col gap-6">
                            {smallNewsList.map((item, i) => (
                                <div key={i} className="flex gap-4 group cursor-pointer">
                                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                        <img src={item.imageUrl} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt={item.title} />
                                    </div>
                                    <div>
                                        <h4 className="font-sans font-bold text-primary-900 text-sm leading-tight mb-1 group-hover:text-primary-700">
                                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                {item.title}
                                            </a>
                                        </h4>
                                        {item.date && <span className="text-[10px] text-gray-400">{item.date}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}