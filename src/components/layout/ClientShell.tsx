"use client";

import { BioCryptProvider } from "@/context/BioCryptContext";
import Navbar from "@/components/layout/Navbar";
import PipelineStage from "@/components/layout/PipelineStage";
import Footer from "@/components/layout/Footer";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <BioCryptProvider>
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
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <source src="/dna-video.mp4" type="video/mp4" />
      </video>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
          backgroundColor: "transparent",
        }}
      >
        <Navbar />
        <PipelineStage />
        <main style={{ flex: 1, padding: "2rem", backgroundColor: "transparent" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </BioCryptProvider>
  );
}
