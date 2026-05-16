import React from "react";

interface DashboardFooterProps {
  slogan?: string;
}

export default function DashboardFooter({
  slogan = "Sống là cho đâu chỉ nhận riêng mình — Kết nối yêu thương, nâng bước em tới trường",
}: DashboardFooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 h-10 bg-white border-t border-gray-100 flex items-center justify-center px-4">
      <p className="text-xs text-gray-400 text-center truncate">
        <span className="font-medium text-primary-900/70">
          © {year} Đi Học Trên Núi
        </span>
        <span className="mx-2 text-gray-300">·</span>
        <span className="italic">{slogan}</span>
      </p>
    </footer>
  );
}
