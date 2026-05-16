

import React from "react";
import Baner from "@/components/guest/home/Baner";
import Features from "@/components/guest/home/Features";
import About from "@/components/guest/home/About";
import Services from "@/components/guest/home/Services";
import Values from "@/components/guest/home/Values";
import Campaigns from "@/components/guest/home/Campaigns";
import News from "@/components/guest/home/News";

interface GuestHomeProps { }

export default function GuestHomePage({ }: GuestHomeProps) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-yellow-400 selection:text-primary-900">
            <main>
                <Baner />
                <Features />
                <About />
                <Services />
                <Values />
                <Campaigns />
                <News />
            </main>
        </div>
    )
}
