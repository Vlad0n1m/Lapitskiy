import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import localFont from "next/font/local";

export const metadata: Metadata = {
    title: "Urpaq - Coffe & Bakeryhouse",
    description: "Love Croisante & Love",
    // verification: {
    //     google: "WWvdjAgThfmXZzZtckGCy8vpV-0f3fM7c6zzFhswF9Q"
    // }
};

const gilroy = localFont({
    src: [
        {
            path: "./fonts/GilroyRegular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "./fonts/GilroyBold.woff2",
            weight: "700",
            style: "normal",
        },
        {
            path: "./fonts/GilroyBlack.woff2",
            weight: "800",
            style: "normal",
        },
    ],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html className={gilroy.className} lang="en">
            <body className="bg-elbone transition-all ">
                <Navbar />
                <div className="max-w-[1360px] px-[10px] mx-auto mt-[10px]">
                    {children}
                </div>
                <Footer />
            </body>
        </html>
    );
}
