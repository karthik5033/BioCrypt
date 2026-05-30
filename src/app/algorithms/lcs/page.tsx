"use client";

import { useState } from "react";
import { FileText, Play } from "lucide-react";

export default function LcsPage() {
  const [seq1, setSeq1] = useState("ATCGGCTA");
  const [seq2, setSeq2] = useState("ATGCCTA");
  const [dpGrid, setDpGrid] = useState<number[][]>([]);
  const [lcsString, setLcsString] = useState("");

  const simulateLcs = () => {
    if (!seq1 || !seq2) return;
    
    const rows = seq2.length + 1;
    const cols = seq1.length + 1;
    const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

    // Fill matrix
    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        if (seq2[i - 1] === seq1[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    setDpGrid(dp);

    // Traceback
    let i = rows - 1;
    let j = cols - 1;
    let lcs = "";
    while (i > 0 && j > 0) {
      if (seq2[i - 1] === seq1[j - 1]) {
        lcs = seq1[j - 1] + lcs;
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    setLcsString(lcs);
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
          <FileText size={28} />
        </div>
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-primary)" }}>
            Dynamic Programming
          </span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem" }}>
            LCS / Edit Distance
          </h1>
        </div>
      </div>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          The Algorithm
        </h2>
        <div style={{ backgroundColor: "#1e293b", padding: "1.5rem", borderRadius: "12px", color: "#e2e8f0", fontFamily: "var(--font-dm-mono)", fontSize: "0.9rem", lineHeight: 1.6, overflowX: "auto" }}>
          <pre style={{ margin: 0 }}>
{`1. Create an (M+1) x (N+1) DP matrix filled with 0s.
2. For each character i in string1 and j in string2:
     If string1[i] == string2[j]:
       Matrix[i][j] = Matrix[i-1][j-1] + 1
     Else:
       Matrix[i][j] = max(Matrix[i-1][j], Matrix[i][j-1])
3. Traceback from (M, N) diagonally when characters match,
   otherwise move to the max of left or top cell.`}
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          How it Works
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          The Longest Common Subsequence (LCS) algorithm finds the longest sequence of characters that appear in the same relative order in both strings, though not necessarily contiguously. It uses dynamic programming to build a table where each cell represents the length of the LCS for the substrings evaluated up to that point. 
        </p>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Why BioCrypt Uses It
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7 }}>
          Similar to Needleman-Wunsch, LCS and Edit Distance algorithms are foundational for analyzing similarities between DNA strands. BioCrypt uses LCS as a metric during the analysis phase to determine the extent of deviation a mutated/encrypted strand has from its original form, giving insights into entropy and corruption levels.
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
              placeholder="Sequence 1"
              style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none", textTransform: "uppercase" }}
            />
            <input
              type="text"
              value={seq2}
              onChange={(e) => setSeq2(e.target.value.toUpperCase())}
              placeholder="Sequence 2"
              style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none", textTransform: "uppercase" }}
            />
            <button
              onClick={simulateLcs}
              className="btn-primary"
              style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}
            >
              <Play size={16} /> Matrix
            </button>
          </div>

          {lcsString && (
            <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#047857", borderRadius: "8px", fontWeight: 600 }}>
              Longest Common Subsequence: <span style={{ fontFamily: "var(--font-dm-mono)", letterSpacing: "2px" }}>{lcsString}</span> (Length: {lcsString.length})
            </div>
          )}

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
