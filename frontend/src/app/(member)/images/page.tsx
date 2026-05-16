"use client";

import React, { useState } from "react";
import { Images, Download, Trash2 } from "lucide-react";
import Image from "next/image";
import PageShell from "@/components/member/common/PageShell";
import ListToolbar from "@/components/member/common/ListToolbar";

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  album: string;
  uploadedAt: string;
  uploadedBy: string;
}

// Using placeholder service for demonstration — replace with real image URLs
const SEED_DATA: GalleryImage[] = [
  { id: "IMG001", url: "https://picsum.photos/seed/dhtn1/400/300", caption: "Trao học bổng tháng 9/2024", album: "Trao quà 2024", uploadedAt: "2024-09-15", uploadedBy: "Admin" },
  { id: "IMG002", url: "https://picsum.photos/seed/dhtn2/400/300", caption: "Chuyến đi Điện Biên", album: "Chuyến đi 2024", uploadedAt: "2024-10-02", uploadedBy: "Phan Anh Vũ" },
  { id: "IMG003", url: "https://picsum.photos/seed/dhtn3/400/300", caption: "Học sinh trường TH Pú Nhung", album: "Học sinh 2024", uploadedAt: "2024-10-03", uploadedBy: "Phan Anh Vũ" },
  { id: "IMG004", url: "https://picsum.photos/seed/dhtn4/400/300", caption: "Buổi phát học bổng tại Yên Bái", album: "Trao quà 2024", uploadedAt: "2024-11-10", uploadedBy: "Admin" },
  { id: "IMG005", url: "https://picsum.photos/seed/dhtn5/400/300", caption: "Tình nguyện viên tập hợp", album: "Tình nguyện viên", uploadedAt: "2025-01-20", uploadedBy: "Trịnh Thị Thu" },
  { id: "IMG006", url: "https://picsum.photos/seed/dhtn6/400/300", caption: "Cảnh quan vùng núi Lào Cai", album: "Phong cảnh", uploadedAt: "2025-02-05", uploadedBy: "Lý Minh Khoa" },
];

export default function ImagesPage() {
  const [search, setSearch] = useState("");
  const filtered = SEED_DATA.filter(
    (img) =>
      img.caption.toLowerCase().includes(search.toLowerCase()) ||
      img.album.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell
      title="Thư viện Hình ảnh"
      subtitle={`${SEED_DATA.length} hình ảnh trong thư viện`}
      icon={Images}
      iconColor="bg-pink-100 text-pink-700"
    >
      <ListToolbar
        searchPlaceholder="Tìm theo tên ảnh, album..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Tải ảnh lên"
        onAdd={() => {}}
      />

      {/* Masonry-style grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((img) => (
          <div
            key={img.id}
            className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            {/* Image */}
            <div className="relative w-full aspect-[4/3] bg-gray-100">
              <Image
                src={img.url}
                alt={img.caption}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-700 hover:text-primary-900 shadow transition-colors" aria-label="Tải xuống">
                  <Download size={16} />
                </button>
                <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-700 hover:text-red-600 shadow transition-colors" aria-label="Xoá">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Meta */}
            <div className="p-3">
              <p className="text-sm font-medium text-gray-800 truncate">{img.caption}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-primary-900 bg-primary-900/10 px-2 py-0.5 rounded-full font-medium">{img.album}</span>
                <span className="text-xs text-gray-400">{img.uploadedAt}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">by {img.uploadedBy}</p>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-400">
            <Images size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Không tìm thấy hình ảnh phù hợp</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}