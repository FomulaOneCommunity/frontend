"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer/Footer";

export default function FooterOnHome() {
    const pathname = usePathname();

    // 루트 경로("/en", "/ko" 등)만 Footer 노출
    const isHome = /^\/[^/?#]+$/.test(pathname);

    return isHome ? <Footer /> : null;
}