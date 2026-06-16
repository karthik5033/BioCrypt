"use client";

import { useState } from "react";
import { Layers, Play } from "lucide-react";

export default function BWTPage() {
  const [inputText, setInputText] = useState("BANANA");
  const [sortedRotations, setSortedRotations] = useState<string[]>([]);
  const [encoded, setEncoded] = useState("");

  const simulateBWT = () => {
    if (!inputText) return;
    const str = inputText.includes("$") ? inputText : inputText + "$";
    const rotations = [];
    for (let i = 0; i < str.length; i++) {
      rotations.push(str.slice(i) + str.slice(0, i));
    }
    rotations.sort();
    setSortedRotations(rotations);
    
    const bwtStr = rotations.map((r) => r[r.length - 1]).join("");
    setEncoded(bwtStr);
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
          <Layers size={28} />
        </div>
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-primary)" }}>
            String Algorithm
          </span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem" }}>
            Burrows-Wheeler Transform
          </h1>
        </div>
      </div>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          The Algorithm
        </h2>
        <div style={{ backgroundColor: "#1e293b", padding: "1.5rem", borderRadius: "12px", color: "#e2e8f0", fontFamily: "var(--font-dm-mono)", fontSize: "0.9rem", lineHeight: 1.6, overflowX: "auto" }}>
          <pre style={{ margin: 0 }}>
{`1. Append an EOF marker (e.g., '$') to the input string
2. Generate all cyclic rotations of the string
3. Sort all the cyclic rotations lexicographically
4. Extract the last column of the sorted rotations
5. The extracted sequence is the BWT output`}
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          How it Works
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          The Burrows-Wheeler Transform (BWT) rearranges a character string into runs of similar characters. This is extremely useful for compression, since identical characters clustered together can be easily compressed with techniques like Move-to-Front (MTF) and Run-Length Encoding (RLE). The transform is completely reversible without any loss of data.
        </p>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Why BioCrypt Uses It
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7 }}>
          In the BioCrypt pipeline, the BWT is utilized via a highly optimized O(N log² N) Suffix Array construction. It clusters the raw byte values of incoming files. This dramatically lowers the entropy for the subsequent MTF and RLE compression stages, ensuring that massive files are reduced to optimal sizes before being mapped into genetic sequences.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Simulation
        </h2>
        <div className="clinical-card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to transform..."
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "1rem",
                outline: "none",
              }}
            />
            <button
              onClick={simulateBWT}
              className="btn-primary"
              style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}
            >
              <Play size={16} /> Simulate
            </button>
          </div>

          {sortedRotations.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#334155", marginBottom: "1rem" }}>Sorted Rotations</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "300px", overflowY: "auto", fontFamily: "var(--font-dm-mono)", fontSize: "0.85rem" }}>
                  {sortedRotations.map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem", backgroundColor: "#f8fafc", borderRadius: "6px" }}>
                      <span style={{ color: "#64748b" }}>{r.slice(0, -1)}</span>
                      <span style={{ fontWeight: 800, color: "var(--accent-primary)" }}>{r.slice(-1)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#334155", marginBottom: "1rem" }}>BWT Output (Last Column)</h3>
                <div style={{ padding: "1rem", backgroundColor: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "8px", fontFamily: "var(--font-dm-mono)", color: "var(--accent-primary)", wordBreak: "break-all", lineHeight: 1.6, fontSize: "1.25rem", letterSpacing: "0.2em", fontWeight: 800 }}>
                  {encoded}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
