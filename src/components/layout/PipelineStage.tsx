"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";

export default function PipelineStage() {
  const pathname = usePathname();

  // Don't show pipeline stage on the landing page
  if (pathname === "/") return null;

  const steps = [
    { name: "Encode", path: "/encode", id: 1 },
    { name: "Encrypt", path: "/encrypt", id: 2 },
    { name: "Recover", path: "/recover", id: 3 },
    { name: "Analyze", path: "/analyze", id: 4 },
  ];

  return (
    <div style={{
      width: "100%",
      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      backgroundColor: "rgba(255, 255, 255, 0.65)",
      backdropFilter: "blur(12px)",
      padding: "1rem 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "sticky",
      top: "72px",
      zIndex: 40
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "2rem",
        position: "relative",
        maxWidth: "600px",
        width: "100%",
        justifyContent: "space-between"
      }}>
        {/* Connecting line */}
        <div style={{
          position: "absolute",
          top: "12px",
          left: "20px",
          right: "20px",
          height: "2px",
          backgroundColor: "var(--border-light)",
          zIndex: 0
        }} />

        {steps.map((step) => {
          const isActive = pathname === step.path;
          const isCompleted = false; 

          return (
            <Link 
              key={step.id} 
              href={step.path}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                position: "relative",
                zIndex: 1,
                textDecoration: "none",
                backgroundColor: "transparent",
                padding: "0 0.5rem"
              }}
            >
              <div style={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {isCompleted ? (
                  <CheckCircle2 color="var(--accent-primary)" size={24} />
                ) : isActive ? (
                  <div style={{ 
                    width: "24px", 
                    height: "24px", 
                    borderRadius: "50%", 
                    border: "2px solid var(--accent-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--accent-primary)" }} />
                  </div>
                ) : (
                  <Circle color="var(--border-light)" size={24} fill="white" />
                )}
              </div>
              <span style={{
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--foreground)" : "var(--text-muted)",
                transition: "color 0.2s ease"
              }}>
                {step.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
