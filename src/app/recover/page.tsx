"use client";

import { useState, useEffect, useRef } from "react";
import { Dna, Activity, RotateCcw } from "lucide-react";
import { needlemanWunsch, type RecoveryResult } from "@/lib/recoveryEngine";
import styles from "./recover.module.css";

export default function RecoverPage() {
  const [corruptedInput, setCorruptedInput] = useState("ATCG??TAAGT");
  const [referenceInput, setReferenceInput] = useState("ATCGGCTAAGT");
  
  const [result, setResult] = useState<RecoveryResult | null>(null);
  const [animatedRows, setAnimatedRows] = useState<number>(0);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleRecover = () => {
    if (!corruptedInput || !referenceInput) return;
    
    // Clean inputs: only ATCG and ? allowed
    const cleanCorrupted = corruptedInput.toUpperCase().replace(/[^ATCG?]/g, "");
    const cleanRef = referenceInput.toUpperCase().replace(/[^ATCG]/g, "");
    
    setCorruptedInput(cleanCorrupted);
    setReferenceInput(cleanRef);

    const res = needlemanWunsch(cleanCorrupted, cleanRef);
    setResult(res);
    setAnimatedRows(0);
  };

  // Animate DP table row by row
  useEffect(() => {
    if (!result) return;
    
    const totalRows = result.dpMatrix.length;
    
    // Clear any existing timer
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);

    animationTimerRef.current = setInterval(() => {
      setAnimatedRows((prev) => {
        if (prev >= totalRows) {
          if (animationTimerRef.current) clearInterval(animationTimerRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 50);

    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, [result]);

  // Render the reconstructed sequence formatting
  const renderRecoveredSequence = () => {
    if (!result) return null;
    
    // The recoveredSequence has format ATCG[G]CTAAGT
    // We split by [ and ] to highlight the recovered parts
    const parts = result.recoveredSequence.split(/(\[[^\]]+\])/);

    return (
      <div className={styles.recoveredSequenceBox}>
        {parts.map((part, i) => {
          if (part.startsWith("[") && part.endsWith("]")) {
            // Strip brackets for display, but wrap in span
            return (
              <span key={i} className={styles.recoveredChar}>
                {part.slice(1, -1)}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  };

  // Helper to calculate cell color based on value
  const getCellColor = (val: number, maxVal: number, minVal: number) => {
    // Normalize value between 0 and 1
    const range = maxVal - minVal;
    if (range === 0) return "white";
    
    const normalized = (val - minVal) / range;
    // Map to a teal scale: 
    // rgb(255,255,255) to rgb(13, 148, 136) -> #0D9488
    
    // Teal is roughly R:13, G:148, B:136
    const r = Math.round(255 - normalized * (255 - 13));
    const g = Math.round(255 - normalized * (255 - 148));
    const b = Math.round(255 - normalized * (255 - 136));
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Find max and min for heatmap scaling
  let maxDpVal = -Infinity;
  let minDpVal = Infinity;
  if (result) {
    for (const row of result.dpMatrix) {
      for (const cell of row) {
        if (cell.val > maxDpVal) maxDpVal = cell.val;
        if (cell.val < minDpVal) minDpVal = cell.val;
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Activity size={28} color="var(--accent-teal)" />
          Recovery Engine
        </h1>
        <p className={styles.subtitle}>
          Reconstruct corrupted DNA using Needleman-Wunsch dynamic programming alignment.
        </p>
      </div>

      {/* Input Section */}
      <div className={`clinical-card ${styles.card}`}>
        <div>
          <label className={styles.label}>Corrupted DNA Sequence (Use ? for unknown)</label>
          <input 
            type="text"
            className={styles.input}
            placeholder="e.g. ATCG??TAAGT"
            value={corruptedInput}
            onChange={(e) => setCorruptedInput(e.target.value.toUpperCase())}
          />
        </div>

        <div>
          <label className={styles.label}>Reference Fragment / Checksum</label>
          <input 
            type="text"
            className={styles.input}
            placeholder="e.g. ATCGGCTAAGT"
            value={referenceInput}
            onChange={(e) => setReferenceInput(e.target.value.toUpperCase())}
          />
        </div>

        <button 
          className="btn-primary" 
          style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "0.5rem" }}
          onClick={handleRecover}
          disabled={!corruptedInput || !referenceInput}
        >
          <RotateCcw size={16} /> Run Recovery
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* SECTION 1 — Recovered Sequence */}
          <div className={`clinical-card ${styles.card}`}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              Recovered Sequence
            </h3>
            {renderRecoveredSequence()}
          </div>

          {/* SECTION 3 — Stats (Placed above DP table for better flow) */}
          <div className={`clinical-card ${styles.card}`}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              Recovery Statistics
            </h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Edit Distance</span>
                <span className={styles.statValue}>{result.stats.editDistance}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Characters Recovered</span>
                <span className={styles.statValueAccent}>{result.stats.charsRecovered}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Recovery Accuracy</span>
                <span className={styles.statValue}>
                  {result.stats.recoveryAccuracy}%
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2 — Needleman-Wunsch DP Table */}
          <div className={`clinical-card ${styles.card}`}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Needleman-Wunsch Alignment Matrix
              {animatedRows < result.dpMatrix.length && (
                <span style={{ fontSize: "0.75rem", color: "var(--accent-teal)", fontWeight: "normal", display: "flex", alignItems: "center", gap: "4px" }}>
                  <div className="spinner-teal" style={{ width: "12px", height: "12px", borderWidth: "1.5px" }} />
                  Computing...
                </span>
              )}
            </h3>
            
            <div className={styles.dpTableContainer}>
              <table className={styles.dpTable}>
                <thead>
                  <tr>
                    <th></th>
                    <th>-</th>
                    {referenceInput.split("").map((char, j) => (
                      <th key={`ref-${j}`}>{char}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.dpMatrix.map((row, i) => {
                    const isRowVisible = i < animatedRows;
                    const charA = i === 0 ? "-" : corruptedInput[i - 1];
                    
                    return (
                      <tr key={`row-${i}`}>
                        <th>{charA}</th>
                        {row.map((cell, j) => {
                          const isVisible = isRowVisible;
                          const bgColor = isVisible ? getCellColor(cell.val, maxDpVal, minDpVal) : "transparent";
                          const color = isVisible && cell.val > (maxDpVal + minDpVal) / 2 ? "white" : "var(--foreground)";
                          
                          return (
                            <td 
                              key={`cell-${i}-${j}`}
                              className={isVisible ? styles.dpCellFilled : styles.dpCellEmpty}
                              style={{ backgroundColor: bgColor, color: isVisible ? color : "transparent" }}
                            >
                              {cell.val}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
