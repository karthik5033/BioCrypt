"use client";

import { useState } from "react";
import { Play, Database, Lock, Activity, Search, ArrowRight } from "lucide-react";

export default function AnalyzeSimulation() {
  const [step, setStep] = useState(0);

  const runSimulation = () => {
    setStep(1);
    setTimeout(() => setStep(2), 2000);
    setTimeout(() => setStep(3), 4000);
    setTimeout(() => setStep(4), 6000);
    setTimeout(() => setStep(5), 8000);
  };

  return (
    <div className="clinical-card" style={{ padding: "2.5rem", marginTop: "3rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Search size={24} color="var(--accent-primary)" /> Full Pipeline Tracer
        </h2>
        <p style={{ color: "#475569", marginTop: "0.5rem", lineHeight: 1.6 }}>
          Watch a single piece of data flow through the entire BioCrypt ecosystem, transforming from plain text into compressed DNA, getting mutated for encryption, and finally being recovered back to its original state.
        </p>
      </div>

      <div style={{ marginBottom: "2.5rem" }}>
        <button
          onClick={runSimulation}
          className="btn-primary"
          style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}
          disabled={step > 0 && step < 5}
        >
          <Play size={16} /> Trace Pipeline Flow
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", position: "relative" }}>
        {/* Vertical Line Connector */}
        <div style={{ position: "absolute", left: "24px", top: "30px", bottom: "30px", width: "2px", backgroundColor: "#e2e8f0", zIndex: 0 }} />

        {/* Stage 1: Input */}
        <div style={{ opacity: step >= 1 ? 1 : 0.75, transition: "opacity 0.5s", display: "flex", gap: "1.5rem", position: "relative", zIndex: 1 }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#f1f5f9", border: step >= 1 ? "2px solid var(--accent-primary)" : "2px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontWeight: 800, color: step >= 1 ? "var(--accent-primary)" : "#64748b" }}>1</span>
          </div>
          <div style={{ flex: 1, padding: "1.5rem", backgroundColor: "white", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>Raw Data Input</h3>
            <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "1rem" }}>A user uploads a small text file.</p>
            <div style={{ fontFamily: "var(--font-dm-mono)", fontWeight: 700, color: "#0f172a", padding: "0.75rem", backgroundColor: "#f8fafc", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
              "HELLO WORLD"
            </div>
          </div>
        </div>

        {/* Stage 2: Encode */}
        <div style={{ opacity: step >= 2 ? 1 : 0.75, transition: "opacity 0.5s", display: "flex", gap: "1.5rem", position: "relative", zIndex: 1 }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#f1f5f9", border: step >= 2 ? "2px solid #10b981" : "2px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Database size={20} color={step >= 2 ? "#10b981" : "#64748b"} />
          </div>
          <div style={{ flex: 1, padding: "1.5rem", backgroundColor: "white", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>Encode & Compress</h3>
            <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "1rem" }}>Text is mapped to ATCG and compressed using Huffman coding.</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ fontFamily: "var(--font-dm-mono)", fontWeight: 700, color: "#10b981", padding: "0.75rem", backgroundColor: "rgba(16, 185, 129, 0.1)", borderRadius: "6px", wordBreak: "break-all" }}>
                ATCGGCTAAGC...
              </div>
              <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: 600, padding: "0.25rem 0.5rem", backgroundColor: "rgba(16,185,129,0.1)", borderRadius: "4px" }}>-40% Size</span>
            </div>
          </div>
        </div>

        {/* Stage 3: Encrypt */}
        <div style={{ opacity: step >= 3 ? 1 : 0.75, transition: "opacity 0.5s", display: "flex", gap: "1.5rem", position: "relative", zIndex: 1 }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#f1f5f9", border: step >= 3 ? "2px solid #f59e0b" : "2px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={20} color={step >= 3 ? "#f59e0b" : "#64748b"} />
          </div>
          <div style={{ flex: 1, padding: "1.5rem", backgroundColor: "white", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>Mutation Cipher</h3>
            <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "1rem" }}>A seeded LCG applies biological mutations (substitutions/indels).</p>
            <div style={{ fontFamily: "var(--font-dm-mono)", fontWeight: 700, color: "#f59e0b", padding: "0.75rem", backgroundColor: "rgba(245, 158, 11, 0.1)", borderRadius: "6px", wordBreak: "break-all" }}>
              ATC<span style={{ color: "#ef4444", textDecoration: "underline" }}>T</span>GCT<span style={{ color: "#ef4444", textDecoration: "underline" }}>T</span>AGC...
            </div>
          </div>
        </div>

        {/* Stage 4: Recover */}
        <div style={{ opacity: step >= 4 ? 1 : 0.75, transition: "opacity 0.5s", display: "flex", gap: "1.5rem", position: "relative", zIndex: 1 }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#f1f5f9", border: step >= 4 ? "2px solid #3b82f6" : "2px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={20} color={step >= 4 ? "#3b82f6" : "#64748b"} />
          </div>
          <div style={{ flex: 1, padding: "1.5rem", backgroundColor: "white", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>Recovery Engine</h3>
            <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "1rem" }}>Needleman-Wunsch alignment fixes the mutated errors.</p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ fontFamily: "var(--font-dm-mono)", fontWeight: 700, color: "#64748b", padding: "0.5rem", backgroundColor: "#f8fafc", borderRadius: "6px" }}>
                ATC<span style={{ color: "#ef4444" }}>T</span>GCT<span style={{ color: "#ef4444" }}>T</span>A...
              </div>
              <ArrowRight size={16} color="#94a3b8" />
              <div style={{ fontFamily: "var(--font-dm-mono)", fontWeight: 700, color: "#3b82f6", padding: "0.5rem", backgroundColor: "rgba(59, 130, 246, 0.1)", borderRadius: "6px" }}>
                ATC<span style={{ color: "#10b981" }}>G</span>GCT<span style={{ color: "#10b981" }}>A</span>A...
              </div>
            </div>
          </div>
        </div>

        {/* Stage 5: Final Output */}
        <div style={{ opacity: step >= 5 ? 1 : 0, transition: "opacity 0.5s", display: "flex", gap: "1.5rem", position: "relative", zIndex: 1 }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#f1f5f9", border: step >= 5 ? "2px solid var(--accent-primary)" : "2px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontWeight: 800, color: step >= 5 ? "var(--accent-primary)" : "#64748b" }}>✓</span>
          </div>
          <div style={{ flex: 1, padding: "1.5rem", backgroundColor: "white", borderRadius: "8px", border: "2px solid var(--accent-primary)", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent-primary)", marginBottom: "0.5rem" }}>Data Restored</h3>
            <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "1rem" }}>The repaired DNA is decoded back to its original binary, and finally to the exact starting text.</p>
            <div style={{ fontFamily: "var(--font-dm-mono)", fontWeight: 700, color: "#0f172a", padding: "0.75rem", backgroundColor: "#f8fafc", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
              "HELLO WORLD"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
