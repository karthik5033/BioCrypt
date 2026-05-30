"use client";

import { useState } from "react";
import { Play, Lock } from "lucide-react";

export default function EncryptSimulation() {
  const [dna, setDna] = useState("ATCGGCTA");
  const [key, setKey] = useState("secret");
  const [step, setStep] = useState(0);

  // Simplified deterministic RNG based on key
  const pseudoRnd = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const seed = pseudoRnd(key);
  const targetIndex = seed % dna.length;
  
  // Predict mutation
  const charToMutate = dna[targetIndex];
  const map: Record<string, string> = { "A": "T", "T": "A", "C": "G", "G": "C" };
  const mutatedChar = map[charToMutate] || "A";
  
  const mutatedDna = dna.substring(0, targetIndex) + mutatedChar + dna.substring(targetIndex + 1);

  const runSimulation = () => {
    setStep(1);
    setTimeout(() => setStep(2), 1500);
    setTimeout(() => setStep(3), 3000);
    setTimeout(() => setStep(4), 4500);
  };

  return (
    <div className="clinical-card" style={{ padding: "2.5rem", marginTop: "3rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Lock size={24} color="var(--accent-primary)" /> How Encryption Works
        </h2>
        <p style={{ color: "#475569", marginTop: "0.5rem", lineHeight: 1.6 }}>
          BioCrypt encryption is not standard block encryption like AES. It uses the input key to seed an LCG (Linear Congruential Generator) that deterministically pseudo-randomizes which DNA bases to mutate (substitute/invert).
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
        <input
          type="text"
          value={dna}
          onChange={(e) => { setDna(e.target.value.toUpperCase().replace(/[^ATCG]/g, '')); setStep(0); }}
          placeholder="Short DNA Sequence"
          maxLength={15}
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
        <input
          type="text"
          value={key}
          onChange={(e) => { setKey(e.target.value); setStep(0); }}
          placeholder="Encryption Key"
          maxLength={10}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
            outline: "none"
          }}
        />
        <button
          onClick={runSimulation}
          className="btn-primary"
          style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}
          disabled={!dna || !key || (step > 0 && step < 4)}
        >
          <Play size={16} /> Simulate Mutation
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Step 1: Input & Seed Generation */}
        <div style={{ opacity: step >= 1 ? 1 : 0.75, transition: "opacity 0.5s" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "0.5rem" }}>1. Key to LCG Seed</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontWeight: 600, color: "#0f172a" }}>Key: "{key}"</span>
            <span style={{ color: "var(--accent-primary)", fontWeight: 800 }}>→</span>
            <span style={{ padding: "0.4rem 0.8rem", backgroundColor: "rgba(245,158,11,0.1)", color: "var(--accent-primary)", borderRadius: "6px", fontFamily: "var(--font-dm-mono)", fontWeight: 700 }}>
              Seed: {seed}
            </span>
          </div>
        </div>

        {/* Step 2: Target Selection */}
        <div style={{ opacity: step >= 2 ? 1 : 0.75, transition: "opacity 0.5s" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "0.5rem" }}>2. Target Position Generation</h3>
          <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "0.5rem" }}>
            The seeded LCG generates a number mapped to an index.
            ({seed} % {dna.length}) = Index <span style={{ fontWeight: 800, color: "var(--accent-primary)" }}>{targetIndex}</span>
          </p>
          <div style={{ display: "flex", gap: "0.25rem", fontFamily: "var(--font-dm-mono)", fontSize: "1.2rem", fontWeight: 700 }}>
            {dna.split('').map((c, i) => (
              <span key={i} style={{ 
                padding: "0.25rem 0.5rem", 
                borderRadius: "4px",
                border: i === targetIndex ? "2px solid var(--accent-primary)" : "1px solid #e2e8f0",
                backgroundColor: i === targetIndex ? "rgba(245,158,11,0.1)" : "transparent",
                color: i === targetIndex ? "var(--accent-primary)" : "#0f172a"
              }}>
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Step 3: Mutation Rule */}
        <div style={{ opacity: step >= 3 ? 1 : 0.75, transition: "opacity 0.5s" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "0.5rem" }}>3. Apply Biological Mutation</h3>
          <p style={{ fontSize: "0.9rem", color: "#475569" }}>
            Applying Base Substitution (A ↔ T, C ↔ G).
            The target base <span style={{ fontWeight: 800 }}>{charToMutate}</span> mutates into <span style={{ fontWeight: 800, color: "var(--accent-primary)" }}>{mutatedChar}</span>.
          </p>
        </div>

        {/* Step 4: Final Encrypted */}
        <div style={{ opacity: step >= 4 ? 1 : 0, transition: "opacity 0.5s" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: "0.5rem" }}>4. Encrypted Sequence</h3>
          <div style={{ display: "flex", gap: "0.25rem", fontFamily: "var(--font-dm-mono)", fontSize: "1.2rem", fontWeight: 700 }}>
            {mutatedDna.split('').map((c, i) => (
              <span key={i} style={{ 
                padding: "0.25rem 0.5rem", 
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                backgroundColor: i === targetIndex ? "rgba(239, 68, 68, 0.1)" : "transparent",
                color: i === targetIndex ? "#ef4444" : "#0f172a"
              }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
