"use client";

import { useState } from "react";
import { Fingerprint, Play } from "lucide-react";

export default function LcgPage() {
  const [seed, setSeed] = useState(42);
  const [multiplier, setMultiplier] = useState(1664525);
  const [increment, setIncrement] = useState(1013904223);
  const [modulus, setModulus] = useState(4294967296); // 2^32
  const [results, setResults] = useState<number[]>([]);

  const simulateLcg = () => {
    let current = seed;
    const seq: number[] = [];
    for (let i = 0; i < 10; i++) {
      current = (multiplier * current + increment) % modulus;
      seq.push(current);
    }
    setResults(seq);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "4rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "rgba(245,158,11,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-primary)",
          }}
        >
          <Fingerprint size={28} />
        </div>
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-primary)" }}>
            Number Theory
          </span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem" }}>
            Linear Congruential Generator
          </h1>
        </div>
      </div>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          The Algorithm
        </h2>
        <div style={{ backgroundColor: "#1e293b", padding: "1.5rem", borderRadius: "12px", color: "#e2e8f0", fontFamily: "var(--font-dm-mono)", fontSize: "0.9rem", lineHeight: 1.6, overflowX: "auto" }}>
          <pre style={{ margin: 0 }}>
{`1. Choose parameters:
     m (modulus) > 0
     a (multiplier), 0 < a < m
     c (increment), 0 <= c < m
     X_0 (seed), 0 <= X_0 < m
2. Generate the next number in sequence using:
     X_{n+1} = (a * X_n + c) mod m
3. Repeat step 2 to generate a stream of pseudo-random numbers.`}
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          How it Works
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          The Linear Congruential Generator (LCG) is one of the oldest and best-known pseudorandom number generator algorithms. It yields a sequence of randomized numbers calculated with a discontinuous piecewise linear equation. Because it uses a simple mathematical formula, the sequence is completely deterministic as long as the initial seed and parameters are known.
        </p>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Why BioCrypt Uses It
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7 }}>
          During the "Encrypt" phase, BioCrypt introduces controlled biological mutations (substitutions and inversions) to the DNA strand. To make these mutations unpredictable to attackers yet perfectly reversible for decryption, BioCrypt seeds an LCG with a private key. The deterministic pseudo-random stream tells the encryptor exactly where and how to mutate the sequence. The decryptor, armed with the same key, reproduces the exact same pseudo-random stream to reverse the mutations.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Simulation
        </h2>
        <div className="clinical-card" style={{ padding: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#64748b", marginBottom: "0.25rem" }}>Seed (X_0)</label>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                style={{ width: "100%", padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontFamily: "var(--font-dm-mono)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#64748b", marginBottom: "0.25rem" }}>Multiplier (a)</label>
              <input
                type="number"
                value={multiplier}
                onChange={(e) => setMultiplier(Number(e.target.value))}
                style={{ width: "100%", padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontFamily: "var(--font-dm-mono)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#64748b", marginBottom: "0.25rem" }}>Increment (c)</label>
              <input
                type="number"
                value={increment}
                onChange={(e) => setIncrement(Number(e.target.value))}
                style={{ width: "100%", padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontFamily: "var(--font-dm-mono)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#64748b", marginBottom: "0.25rem" }}>Modulus (m)</label>
              <input
                type="number"
                value={modulus}
                onChange={(e) => setModulus(Number(e.target.value))}
                style={{ width: "100%", padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontFamily: "var(--font-dm-mono)" }}
              />
            </div>
          </div>
          
          <button
            onClick={simulateLcg}
            className="btn-primary"
            style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontWeight: 600, marginBottom: "2rem" }}
          >
            <Play size={16} /> Generate First 10 Numbers
          </button>

          {results.length > 0 && (
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#334155", marginBottom: "0.75rem" }}>Generated Stream</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {results.map((res, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.5rem", backgroundColor: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                    <span style={{ color: "#94a3b8", fontSize: "0.85rem", minWidth: "30px" }}>X_{i+1}</span>
                    <span style={{ fontFamily: "var(--font-dm-mono)", fontWeight: 700, color: "var(--accent-primary)" }}>{res}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
