import React from "react";
import Navbar from "@/components/guest/common/Navbar/Navbar";
import Footer from "@/components/guest/common/Footer/Footer";

interface GuestLayoutProps {
    children: React.ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}