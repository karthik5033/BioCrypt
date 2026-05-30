"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useBioCrypt, type PipelineState } from "@/context/BioCryptContext";

export default function PipelineStage() {
  const pathname = usePathname();
  const { pipeline } = useBioCrypt();

  // Don't show pipeline on landing page
  if (pathname === "/") return null;

  const steps: { name: string; path: string; key: keyof PipelineState }[] = [
    { name: "Encode", path: "/encode", key: "encode" },
    { name: "Encrypt", path: "/encrypt", key: "encrypt" },
    { name: "Recover", path: "/recover", key: "recover" },
    { name: "Analyze", path: "/analyze", key: "analyze" },
  ];

  return (
    <>
      {/* Desktop pipeline bar */}
      <div className="pipeline-bar">
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
          {/* Progress fill */}
          <div style={{
            position: "absolute",
            top: "12px",
            left: "20px",
            width: `${getProgressWidth(pathname, pipeline)}%`,
            maxWidth: "calc(100% - 40px)",
            height: "2px",
            backgroundColor: "var(--accent-primary)",
            zIndex: 0,
            transition: "width 0.5s ease"
          }} />

          {steps.map((step) => {
            const isActive = pathname === step.path;
            const status = pipeline[step.key];

            return (
              <Link
                key={step.key}
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
                  {isActive ? (
                    <div style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: "2px solid var(--accent-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "var(--background)",
                      boxShadow: "0 0 0 4px rgba(245, 158, 11, 0.2)"
                    }}>
                      <div style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "var(--accent-primary)"
                      }} />
                    </div>
                  ) : status === "complete" ? (
                    <CheckCircle2 color="var(--accent-primary)" size={24} />
                  ) : status === "in-progress" ? (
                    <Loader2
                      color="var(--accent-primary)"
                      size={24}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    <Circle color="var(--border-light)" size={24} fill="white" />
                  )}
                </div>
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: isActive || status === "complete" ? 700 : 500,
                  color: isActive
                    ? "var(--foreground)"
                    : status === "complete"
                      ? "var(--accent-primary)"
                      : "var(--text-muted)",
                  transition: "color 0.2s ease",
                  fontFamily: "var(--font-dm-sans)",
                  letterSpacing: "0.02em"
                }}>
                  {step.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <div className="mobile-tab-bar">
        {steps.map((step) => {
          const isActive = pathname === step.path;
          const status = pipeline[step.key];
          return (
            <Link
              key={step.key}
              href={step.path}
              className={`mobile-tab ${isActive ? "mobile-tab-active" : ""}`}
            >
              {isActive ? (
                <div style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  border: "2px solid var(--accent-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "var(--background)",
                  boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.2)"
                }}>
                  <div style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "var(--accent-primary)"
                  }} />
                </div>
              ) : status === "complete" ? (
                <CheckCircle2 size={18} color="var(--accent-primary)" />
              ) : status === "in-progress" ? (
                <Loader2
                  size={18}
                  color="var(--accent-primary)"
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <Circle
                  size={18}
                  color="var(--text-muted)"
                  fill="transparent"
                />
              )}
              <span>{step.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function getProgressWidth(pathname: string, pipeline: PipelineState): number {
  const steps = ["/encode", "/encrypt", "/recover", "/analyze"];
  const order: (keyof PipelineState)[] = ["encode", "encrypt", "recover", "analyze"];
  
  const currentIndex = steps.indexOf(pathname);
  let lastComplete = -1;
  
  for (let i = 0; i < order.length; i++) {
    if (pipeline[order[i]] === "complete") {
      lastComplete = i;
    }
  }
  
  const targetIndex = Math.max(currentIndex, lastComplete);
  if (targetIndex <= 0) return 0;
  return (targetIndex / (steps.length - 1)) * 100;
}
