"use client";

import { useState } from "react";
import { Activity, Play } from "lucide-react";

export default function NeedlemanWunschPage() {
  const [seq1, setSeq1] = useState("GATTACA");
  const [seq2, setSeq2] = useState("GCATGCU");
  const [dpGrid, setDpGrid] = useState<number[][]>([]);

  const matchScore = 1;
  const mismatchScore = -1;
  const gapPenalty = -2;

  const simulateNW = () => {
    if (!seq1 || !seq2) return;
    
    const rows = seq2.length + 1;
    const cols = seq1.length + 1;
    const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

    // Initialize edges
    for (let i = 0; i < rows; i++) dp[i][0] = i * gapPenalty;
    for (let j = 0; j < cols; j++) dp[0][j] = j * gapPenalty;

    // Fill matrix
    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        const match = dp[i - 1][j - 1] + (seq1[j - 1] === seq2[i - 1] ? matchScore : mismatchScore);
        const deleteScore = dp[i - 1][j] + gapPenalty;
        const insertScore = dp[i][j - 1] + gapPenalty;
        dp[i][j] = Math.max(match, deleteScore, insertScore);
      }
    }
    setDpGrid(dp);
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
          <Activity size={28} />
        </div>
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-primary)" }}>
            Dynamic Programming
          </span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem" }}>
            Needleman-Wunsch
          </h1>
        </div>
      </div>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          The Algorithm
        </h2>
        <div style={{ backgroundColor: "#1e293b", padding: "1.5rem", borderRadius: "12px", color: "#e2e8f0", fontFamily: "var(--font-dm-mono)", fontSize: "0.9rem", lineHeight: 1.6, overflowX: "auto" }}>
          <pre style={{ margin: 0 }}>
{`1. Create an (N+1) x (M+1) scoring matrix.
2. Initialize the first row and column with gap penalties (e.g., 0, -2, -4...).
3. Iterate through each cell (i, j):
     Score = max(
       Matrix[i-1][j-1] + (match or mismatch score),
       Matrix[i-1][j] + gap penalty,
       Matrix[i][j-1] + gap penalty
     )
4. Traceback from (N, M) to (0, 0) to find the optimal alignment.`}
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          How it Works
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          The Needleman-Wunsch algorithm performs a global sequence alignment of two strings. It calculates a scoring matrix that weighs matches, mismatches, and gaps (insertions or deletions). By building this matrix from the top-left to the bottom-right, and then tracing back the highest scores, it finds the mathematically optimal global alignment between the two sequences.
        </p>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Why BioCrypt Uses It
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7 }}>
          During the "Recover" phase, encrypted DNA might become corrupted (bits flipped or lost, simulating biological point mutations). Needleman-Wunsch is used to align the corrupted data string with a reference parity strand or check sequence. This alignment allows BioCrypt to accurately detect exactly where insertions, deletions, or substitutions occurred, facilitating self-healing of the data.
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
              value={seq1}
              onChange={(e) => setSeq1(e.target.value.toUpperCase())}
              placeholder="Sequence 1 (e.g. GATTACA)"
              style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none", textTransform: "uppercase" }}
            />
            <input
              type="text"
              value={seq2}
              onChange={(e) => setSeq2(e.target.value.toUpperCase())}
              placeholder="Sequence 2 (e.g. GCATGCU)"
              style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none", textTransform: "uppercase" }}
            />
            <button
              onClick={simulateNW}
              className="btn-primary"
              style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}
            >
              <Play size={16} /> Matrix
            </button>
          </div>

          {dpGrid.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", textAlign: "center", fontFamily: "var(--font-dm-mono)" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "0.5rem", borderBottom: "1px solid #e2e8f0" }}></th>
                    <th style={{ padding: "0.5rem", borderBottom: "1px solid #e2e8f0" }}>-</th>
                    {seq1.split("").map((c, i) => (
                      <th key={i} style={{ padding: "0.5rem", borderBottom: "1px solid #e2e8f0", color: "var(--accent-primary)" }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dpGrid.map((row, i) => (
                    <tr key={i}>
                      <th style={{ padding: "0.5rem", borderRight: "1px solid #e2e8f0", color: "var(--accent-primary)" }}>
                        {i === 0 ? "-" : seq2[i - 1]}
                      </th>
                      {row.map((val, j) => (
                        <td key={j} style={{ padding: "0.5rem", border: "1px solid #f1f5f9", color: "#475569" }}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
