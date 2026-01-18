import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Baner from "@/components/Baner/Baner";
import Features from "@/components/Features/Features";
import About from "@/components/About/About";
import Services from "@/components/Services/Services";
import Values from "@/components/Values/Values";
import Campaigns from "@/components/Campaigns/Campaigns";
import News from "@/components/News/News";

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-yellow-400 selection:text-primary-900">
            <Navbar />
            <main>
                <Baner />
                <Features />
                <About />
                <Services />
                <Values />
                <Campaigns />
                <News />
            </main>
            <Footer />
        </div>
    )
}
