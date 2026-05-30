"use client";

import { useState } from "react";
import { Zap, Play } from "lucide-react";

export default function KmpPage() {
  const [text, setText] = useState("ATCGGCTAAGTCGAT");
  const [pattern, setPattern] = useState("GCTA");
  const [lps, setLps] = useState<number[]>([]);
  const [matchIndex, setMatchIndex] = useState<number | null>(null);

  const simulateKmp = () => {
    if (!text || !pattern) return;
    
    // Compute LPS
    const m = pattern.length;
    const n = text.length;
    const lpsArray = Array(m).fill(0);
    let len = 0;
    let i = 1;
    
    while (i < m) {
      if (pattern[i] === pattern[len]) {
        len++;
        lpsArray[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lpsArray[len - 1];
        } else {
          lpsArray[i] = 0;
          i++;
        }
      }
    }
    setLps(lpsArray);

    // KMP Search
    i = 0;
    let j = 0;
    let found = -1;
    while (n - i >= m - j) {
      if (pattern[j] === text[i]) {
        j++;
        i++;
      }
      if (j === m) {
        found = i - j;
        break; // Find first match
      } else if (i < n && pattern[j] !== text[i]) {
        if (j !== 0) {
          j = lpsArray[j - 1];
        } else {
          i++;
        }
      }
    }
    setMatchIndex(found !== -1 ? found : null);
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
          <Zap size={28} />
        </div>
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-primary)" }}>
            String Matching
          </span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem" }}>
            Knuth-Morris-Pratt (KMP)
          </h1>
        </div>
      </div>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          The Algorithm
        </h2>
        <div style={{ backgroundColor: "#1e293b", padding: "1.5rem", borderRadius: "12px", color: "#e2e8f0", fontFamily: "var(--font-dm-mono)", fontSize: "0.9rem", lineHeight: 1.6, overflowX: "auto" }}>
          <pre style={{ margin: 0 }}>
{`1. Preprocess the pattern to create an LPS (Longest Proper Prefix 
   which is also Suffix) array.
2. Initialize i = 0 (text index), j = 0 (pattern index).
3. While traversing the text:
     If Text[i] == Pattern[j]:
       Increment i and j.
     If j == Pattern Length:
       Match found at index (i - j).
     Else if Text[i] != Pattern[j]:
       If j != 0:
         Set j = LPS[j-1] (fallback without retreating i)
       Else:
         Increment i.`}
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          How it Works
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          The Knuth-Morris-Pratt string matching algorithm improves upon the naive approach by ensuring the search index never moves backwards in the text. By precomputing an LPS array, KMP knows exactly how much of the pattern can be skipped when a mismatch occurs, resulting in a linear time complexity of O(N + M).
        </p>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Why BioCrypt Uses It
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7 }}>
          In a large encoded DNA sequence, quickly finding specific markers or sequences is crucial. BioCrypt uses KMP for extremely fast O(N) pattern searching within long strands, aiding in targeted decryption and quickly locating mutation sites without redundantly scanning characters.
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
              value={text}
              onChange={(e) => setText(e.target.value.toUpperCase())}
              placeholder="Text (e.g. ATCGGCTAAGTCGAT)"
              style={{ flex: 2, padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none", textTransform: "uppercase" }}
            />
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value.toUpperCase())}
              placeholder="Pattern"
              style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none", textTransform: "uppercase" }}
            />
            <button
              onClick={simulateKmp}
              className="btn-primary"
              style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}
            >
              <Play size={16} /> Search
            </button>
          </div>

          {lps.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#334155", marginBottom: "0.75rem" }}>LPS Array</h3>
              <div style={{ display: "flex", gap: "0.25rem", overflowX: "auto" }}>
                {lps.map((val, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "40px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px", padding: "0.5rem" }}>
                    <span style={{ fontWeight: 700, color: "var(--accent-primary)" }}>{pattern[i]}</span>
                    <span style={{ color: "#64748b", fontSize: "0.9rem" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchIndex !== null && (
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#334155", marginBottom: "0.75rem" }}>Search Result</h3>
              <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: "1.2rem", letterSpacing: "2px", wordBreak: "break-all" }}>
                {text.split("").map((c, i) => {
                  const isMatch = i >= matchIndex && i < matchIndex + pattern.length;
                  return (
                    <span
                      key={i}
                      style={{
                        backgroundColor: isMatch ? "rgba(16, 185, 129, 0.2)" : "transparent",
                        color: isMatch ? "#047857" : "#0f172a",
                        fontWeight: isMatch ? 800 : 500,
                        padding: "2px",
                        borderRadius: "2px",
                      }}
                    >
                      {c}
                    </span>
                  );
                })}
              </div>
              <p style={{ marginTop: "1rem", color: "#10b981", fontWeight: 600 }}>Pattern found at index: {matchIndex}</p>
            </div>
          )}
          {matchIndex === null && lps.length > 0 && (
            <p style={{ marginTop: "1rem", color: "#ef4444", fontWeight: 600 }}>Pattern not found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
