import React from "react";
import Navbar from "@/components/guest/common/Navbar";
import Footer from "@/components/guest/common/Footer";

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