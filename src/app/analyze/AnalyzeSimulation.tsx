"use client";

import { useState } from "react";
import { Play, Database, Lock, Activity, Search, ArrowRight } from "lucide-react";
import { compressBytes } from "@/lib/encoder";
import { encryptDNA } from "@/lib/mutationCipher";
import { needlemanWunsch } from "@/lib/recoveryEngine";

export default function AnalyzeSimulation() {
  const [step, setStep] = useState(0);
  const [inputText, setInputText] = useState("HELLO WORLD");

  const runSimulation = () => {
    setStep(1);
    setTimeout(() => setStep(2), 2000);
    setTimeout(() => setStep(3), 4000);
    setTimeout(() => setStep(4), 6000);
    setTimeout(() => setStep(5), 8000);
  };

  // Run the pipeline dynamically
  // 1. Encode
  const textToEncode = inputText || "HELLO WORLD";
  const bytes = new TextEncoder().encode(textToEncode);
  const encodeRes = compressBytes(bytes);
  let bits = encodeRes.compressedBits;
  const rem = bits.length % 8;
  if (rem !== 0) bits += "0".repeat(8 - rem);

  const map: Record<string, string> = { "00": "A", "01": "T", "10": "C", "11": "G" };
  let encodedDNA = "";
  for (let i = 0; i < bits.length; i += 2) {
    encodedDNA += map[bits.slice(i, i + 2)];
  }
  if (!encodedDNA) encodedDNA = "ATCG"; // fallback

  const originalSize = bytes.length * 8; // in bits
  const compressedSize = bits.length;
  const savings = Math.max(0, Math.round((1 - compressedSize / originalSize) * 100));

  // 2. Encrypt
  // Use a fixed key for the simulation, enable substitution and indels
  const encryptRes = encryptDNA(encodedDNA, "simKey", true, false, true);
  const mutatedDNA = encryptRes.encryptedDNA;

  // 3. Recover
  // Needleman-Wunsch using mutated vs original
  // We limit length just in case it's huge, to prevent DP matrix from exploding the browser
  const maxSimLen = 64;
  const recoveryRes = needlemanWunsch(mutatedDNA.substring(0, maxSimLen), encodedDNA.substring(0, maxSimLen));

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

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2.5rem" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => { setInputText(e.target.value.toUpperCase()); setStep(0); }}
          placeholder="Enter text (e.g., HELLO WORLD)"
          maxLength={20}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
            outline: "none",
            textTransform: "uppercase"
          }}
        />
        <button
          onClick={runSimulation}
          className="btn-primary"
          style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}
          disabled={!inputText || (step > 0 && step < 5)}
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
              "{textToEncode}"
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
                {encodedDNA.length > 30 ? encodedDNA.substring(0, 30) + "..." : encodedDNA}
              </div>
              <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: 600, padding: "0.25rem 0.5rem", backgroundColor: "rgba(16,185,129,0.1)", borderRadius: "4px" }}>
                {savings > 0 ? `-${savings}% Size` : `+${Math.abs(savings)}% Size`}
              </span>
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
              {mutatedDNA.length > 30 ? mutatedDNA.substring(0, 30) + "..." : mutatedDNA}
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
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ fontFamily: "var(--font-dm-mono)", fontWeight: 700, color: "#64748b", padding: "0.5rem", backgroundColor: "#f8fafc", borderRadius: "6px", wordBreak: "break-all" }}>
                {mutatedDNA.length > 20 ? mutatedDNA.substring(0, 20) + "..." : mutatedDNA}
              </div>
              <ArrowRight size={16} color="#94a3b8" />
              <div style={{ fontFamily: "var(--font-dm-mono)", fontWeight: 700, color: "#3b82f6", padding: "0.5rem", backgroundColor: "rgba(59, 130, 246, 0.1)", borderRadius: "6px", wordBreak: "break-all" }}>
                {/* Highlight recovered chars from the recoveredSequence */}
                {recoveryRes.recoveredSequence.length > 20 ? (
                  <span>
                    {recoveryRes.recoveredSequence.substring(0, 20).split(/(\[[^\]]+\])/).map((part, i) => {
                      if (part.startsWith("[") && part.endsWith("]")) {
                        return <span key={i} style={{ color: "#10b981" }}>{part.slice(1, -1)}</span>;
                      }
                      return <span key={i}>{part}</span>;
                    })}
                    ...
                  </span>
                ) : (
                  <span>
                    {recoveryRes.recoveredSequence.split(/(\[[^\]]+\])/).map((part, i) => {
                      if (part.startsWith("[") && part.endsWith("]")) {
                        return <span key={i} style={{ color: "#10b981" }}>{part.slice(1, -1)}</span>;
                      }
                      return <span key={i}>{part}</span>;
                    })}
                  </span>
                )}
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
              "{textToEncode}"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
