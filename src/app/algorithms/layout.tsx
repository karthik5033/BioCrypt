"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AlgorithmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }}>
      <header
        style={{
          padding: "1.5rem 2rem",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#64748b",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        >
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </header>
      <main style={{ flex: 1, padding: "3rem 1.5rem" }}>{children}</main>
    </div>
  );
}
