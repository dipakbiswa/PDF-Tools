import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL("https://pdf-tools.vercel.app"),
  title: {
    template: "%s | PDF Tools",
    default: "Free Online PDF Tools — Merge, Split, Compress & More",
  },
  description:
    "Free, fast and secure PDF tools that work entirely in your browser. Merge, split, compress, rotate, watermark and protect PDFs — no uploads, no sign-up required.",
  keywords: [
    "PDF tools",
    "merge PDF",
    "split PDF",
    "compress PDF",
    "rotate PDF",
    "watermark PDF",
    "protect PDF",
    "PDF to images",
    "free PDF editor online",
  ],
  authors: [{ name: "PDF Tools" }],
  creator: "PDF Tools",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pdf-tools.vercel.app",
    siteName: "PDF Tools",
    title: "Free Online PDF Tools — Merge, Split, Compress & More",
    description:
      "Free, fast and secure PDF tools that work entirely in your browser. No uploads, no sign-up required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online PDF Tools",
    description: "Merge, split, compress, rotate, watermark and protect PDFs — free & private.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
