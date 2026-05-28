import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import PipelineStage from "@/components/layout/PipelineStage";
import Footer from "@/components/layout/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "BioCrypt-X | DNA-Inspired Encryption",
  description: "A file encryption system where data is encoded as DNA sequences and recovered from corruption.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100%", 
            objectFit: "cover", 
            zIndex: -1, 
            opacity: 0.1, 
            pointerEvents: "none" 
          }}
        >
          <source src="/dna-video.mp4" type="video/mp4" />
        </video>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />
          <PipelineStage />
          <main style={{ flex: 1, padding: "2rem", backgroundColor: "transparent" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
