import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Đi Học Trên Núi",
    description: "Hành trình kết nối yêu thương, nâng bước em tới trường",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
            <body className="antialiased">{children}</body>
        </html>
    );
}