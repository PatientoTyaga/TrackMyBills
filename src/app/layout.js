import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Loading from "./loading";
import Footer from "@/components/footer";
import { Toaster } from "sonner";
import NavbarWrapper from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TrackMyBills",
  description: "Simple way to keep track of your bills.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}
      >
        <NavbarWrapper />
        <main className="flex-1">
          <Suspense fallback={<Loading />}>
            {children}
            <Toaster position="top-right" richColors/>
          </Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}
