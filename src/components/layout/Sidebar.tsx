"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const steps = [
    { name: "Encode", path: "/encode", id: 1 },
    { name: "Compress", path: "/compress", id: 2 }, // Merged conceptually in Prompt 2, but we'll show it as a pipeline step
    { name: "Encrypt", path: "/encrypt", id: 3 },
    { name: "Recover", path: "/recover", id: 4 },
  ];

  return (
    <aside style={{
      width: "250px",
      borderRight: "1px solid var(--border-light)",
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      backgroundColor: "var(--background)",
      height: "calc(100vh - 64px)",
      position: "sticky",
      top: "64px"
    }}>
      <div>
        <h3 style={{
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--text-muted)",
          marginBottom: "1rem",
          fontWeight: 600
        }}>
          Pipeline Stage
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "relative" }}>
          {/* Connecting line */}
          <div style={{
            position: "absolute",
            left: "11px",
            top: "12px",
            bottom: "12px",
            width: "2px",
            backgroundColor: "var(--border-light)",
            zIndex: 0
          }} />

          {steps.map((step, index) => {
            const isActive = pathname === step.path;
            // A simplistic check to mock 'completed' states for the UI shell
            const isCompleted = false; 

            return (
              <Link 
                key={step.id} 
                href={step.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  position: "relative",
                  zIndex: 1,
                  textDecoration: "none"
                }}
              >
                <div style={{
                  backgroundColor: "var(--background)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {isCompleted ? (
                    <CheckCircle2 color="var(--accent-teal)" size={24} />
                  ) : isActive ? (
                    <div style={{ 
                      width: "24px", 
                      height: "24px", 
                      borderRadius: "50%", 
                      border: "2px solid var(--accent-teal)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--accent-teal)" }} />
                    </div>
                  ) : (
                    <Circle color="var(--border-light)" size={24} fill="var(--background)" />
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
    </aside>
  );
}
