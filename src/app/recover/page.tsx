"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Activity, RotateCcw, Sparkles, Clock, Cpu, ChevronRight, ArrowDownRight, ArrowRight, ChevronDown } from "lucide-react";
import { needlemanWunsch, type RecoveryResult } from "@/lib/recoveryEngine";
import { useBioCrypt } from "@/context/BioCryptContext";
import styles from "./recover.module.css";
import RecoverSimulation from "./RecoverSimulation";

/* ── Presets for quick demo ── */
const PRESETS = [
  {
    label: "Basic Recovery",
    corrupted: "ATCG??TAAGT",
    reference: "ATCGGCTAAGT",
  },
  {
    label: "Multi-Gap",
    corrupted: "AT??GC??AGT",
    reference: "ATCGGCTAAGT",
  },
  {
    label: "Long Strand",
    corrupted: "ATCGGC??AGTCG??TCGA??CG",
    reference: "ATCGGCTAAGTCGATCGATCGCG",
  },
];

export default function RecoverPage() {
  const { cipherResult, encoderResult, setPipelineStep, setRecoveryResult: setGlobalRecoveryResult } = useBioCrypt();
  const [corruptedInput, setCorruptedInput] = useState("");
  const [referenceInput, setReferenceInput] = useState("");

  // Auto-populate from encrypt/encode step (limited to 64 chars to prevent DP table memory crashes)
  useEffect(() => {
    if (cipherResult && !corruptedInput) {
      setCorruptedInput(cipherResult.encryptedDNA.substring(0, 64));
    }
    if (encoderResult && !referenceInput) {
      setReferenceInput(encoderResult.rawDNA.substring(0, 64));
    }
  }, [cipherResult, encoderResult, corruptedInput, referenceInput]);

  const [result, setResult] = useState<RecoveryResult | null>(null);
  const [animatedRows, setAnimatedRows] = useState<number>(0);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const animationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleRecover = useCallback(() => {
    if (!corruptedInput || !referenceInput) return;
    setPipelineStep("recover", "in-progress");

    // Enforce 64-character hard limit to prevent OOM / Browser crash
    const cleanCorrupted = corruptedInput.toUpperCase().replace(/[^ATCG?]/g, "").substring(0, 64);
    const cleanRef = referenceInput.toUpperCase().replace(/[^ATCG]/g, "").substring(0, 64);

    setCorruptedInput(cleanCorrupted);
    setReferenceInput(cleanRef);

    const t0 = performance.now();
    const res = needlemanWunsch(cleanCorrupted, cleanRef);
    const t1 = performance.now();

    setExecutionTime(parseFloat((t1 - t0).toFixed(2)));
    setResult(res);
    setGlobalRecoveryResult(res);
    setPipelineStep("recover", "complete");
    setAnimatedRows(0);
  }, [corruptedInput, referenceInput, setPipelineStep, setGlobalRecoveryResult]);

  // Animate DP table row by row
  useEffect(() => {
    if (!result) return;

    const totalRows = result.dpMatrix.length;
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

  // Render recovered sequence with highlighted chars
  const renderRecoveredSequence = () => {
    if (!result) return null;
    const parts = result.recoveredSequence.split(/(\[[^\]]+\])/);

    return (
      <div className={styles.recoveredSequenceBox}>
        {parts.map((part, i) => {
          if (part.startsWith("[") && part.endsWith("]")) {
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

  // Render the before/after alignment view
  const renderAlignmentComparison = () => {
    if (!result) return null;

    return (
      <div className={styles.alignmentBox}>
        <div className={styles.alignmentRow}>
          <span className={styles.alignmentLabel}>Corrupted</span>
          <span>
            {corruptedInput.split("").map((c, i) => (
              <span
                key={i}
                className={c === "?" ? styles.alignmentCorrupt : styles.alignmentMatch}
              >
                {c}
              </span>
            ))}
          </span>
        </div>
        <div className={styles.alignmentRow}>
          <span className={styles.alignmentLabel}>Reference</span>
          <span className={styles.alignmentMatch}>{referenceInput}</span>
        </div>
        <div className={styles.alignmentRow}>
          <span className={styles.alignmentLabel}>Recovered</span>
          <span>
            {result.recoveredSequence.split(/(\[[^\]]+\])/).map((part, i) => {
              if (part.startsWith("[") && part.endsWith("]")) {
                return (
                  <span key={i} className={styles.alignmentRecovered}>
                    {part.slice(1, -1)}
                  </span>
                );
              }
              return <span key={i} className={styles.alignmentMatch}>{part}</span>;
            })}
            <span style={{ color: "#10b981", fontWeight: 800, marginLeft: "0.5rem" }}>✓</span>
          </span>
        </div>
      </div>
    );
  };

  // Traceback path character-by-character
  const renderTracebackPath = () => {
    if (!result) return null;
    const parts = result.recoveredSequence.split(/(\[[^\]]+\])/);

    return (
      <div className={styles.tracebackRow}>
        {parts.map((part, i) => {
          if (part.startsWith("[") && part.endsWith("]")) {
            return (
              <div key={i} className={styles.tracebackCharRecovered}>
                {part.slice(1, -1)}
              </div>
            );
          }
          return part.split("").map((c, j) => (
            <div key={`${i}-${j}`} className={styles.tracebackChar}>
              {c}
            </div>
          ));
        })}
      </div>
    );
  };

  // Cell color for heatmap
  const getCellColor = (val: number, maxVal: number, minVal: number) => {
    const range = maxVal - minVal;
    if (range === 0) return "rgba(255,255,255,0.5)";

    const normalized = (val - minVal) / range;
    // White → Amber heatmap
    const r = Math.round(255 - normalized * (255 - 245));
    const g = Math.round(255 - normalized * (255 - 158));
    const b = Math.round(255 - normalized * (255 - 11));
    return `rgba(${r}, ${g}, ${b}, ${0.15 + normalized * 0.55})`;
  };

  // DP table min/max
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

  // Traceback path for highlighting
  const tracebackCells = new Set<string>();
  if (result) {
    let ti = result.dpMatrix.length - 1;
    let tj = result.dpMatrix[0].length - 1;
    while (ti > 0 || tj > 0) {
      tracebackCells.add(`${ti}-${tj}`);
      const src = result.dpMatrix[ti][tj].source;
      if (src === "diag" && ti > 0 && tj > 0) { ti--; tj--; }
      else if (src === "up" && ti > 0) { ti--; }
      else if (tj > 0) { tj--; }
      else break;
    }
    tracebackCells.add("0-0");
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>
          <Cpu size={12} /> Needleman-Wunsch DP
        </div>
        <h1 className={styles.title}>
          <Activity size={28} color="var(--accent-primary)" />
          Recovery Engine
        </h1>
        <p className={styles.subtitle}>
          Reconstruct corrupted DNA segments using global sequence alignment.
          The DP table visualizes the optimal edit path in real-time.
        </p>
        <div style={{ marginTop: "1rem" }}>
          <button 
            className="btn-secondary" 
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "8px" }}
            onClick={() => document.getElementById("simulation-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            How it works <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className={`clinical-card ${styles.card}`}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionNumber}>1</span>
          Input Sequences
        </div>

        <div className={styles.inputGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Corrupted DNA
              <span className={styles.labelHint}> — Use ? for unknown characters</span>
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. ATCG??TAAGT"
              value={corruptedInput}
              onChange={(e) => setCorruptedInput(e.target.value.toUpperCase())}
              maxLength={64}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Reference Fragment
              <span className={styles.labelHint}> — Known-good checksum</span>
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. ATCGGCTAAGT"
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value.toUpperCase())}
              maxLength={64}
            />
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderRadius: "8px" }}
            onClick={handleRecover}
            disabled={!corruptedInput || !referenceInput}
          >
            <RotateCcw size={16} /> Run Recovery
          </button>

          <div style={{ height: "1px", width: "1px" }} />

          {PRESETS.map((p, i) => (
            <button
              key={i}
              className={styles.presetBtn}
              onClick={() => {
                setCorruptedInput(p.corrupted);
                setReferenceInput(p.reference);
              }}
            >
              <Sparkles size={12} /> {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Stats */}
          <div className={`clinical-card ${styles.card}`}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>2</span>
              Recovery Results
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Edit Distance</span>
                <span className={styles.statValue}>{result.stats.editDistance}</span>
                <span className={styles.statUnit}>operations</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Chars Recovered</span>
                <span className={styles.statValueAccent}>{result.stats.charsRecovered}</span>
                <span className={styles.statUnit}>nucleotides</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Accuracy</span>
                <span className={styles.statValueAccent}>{result.stats.recoveryAccuracy}%</span>
                <span className={styles.statUnit}>match rate</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Execution Time</span>
                <span className={styles.statValue}>{executionTime}</span>
                <span className={styles.statUnit}>ms</span>
              </div>
            </div>

            <div className={styles.complexityRow}>
              <div className={styles.complexityBadge}>
                <span className={styles.complexityBadgeLabel}>Time:</span>
                <span className={styles.complexityBadgeValue}>O(N × M)</span>
              </div>
              <div className={styles.complexityBadge}>
                <span className={styles.complexityBadgeLabel}>Space:</span>
                <span className={styles.complexityBadgeValue}>O(N × M)</span>
              </div>
              <div className={styles.complexityBadge}>
                <span className={styles.complexityBadgeLabel}>Table Size:</span>
                <span className={styles.complexityBadgeValue}>
                  {(corruptedInput.length + 1)} × {(referenceInput.length + 1)}
                </span>
              </div>
            </div>
          </div>

          {/* Alignment Comparison */}
          <div className={`clinical-card ${styles.card}`}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>3</span>
              Sequence Alignment
            </div>
            {renderAlignmentComparison()}
          </div>

          {/* Recovered Sequence */}
          <div className={`clinical-card ${styles.card}`}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>4</span>
              Recovered Strand
              <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 600, marginLeft: "auto" }}>
                ● Complete
              </span>
            </div>
            {renderRecoveredSequence()}
            {renderTracebackPath()}
          </div>

          {/* DP Table */}
          <div className={`clinical-card ${styles.card}`}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>5</span>
              Needleman-Wunsch DP Matrix
              {animatedRows < result.dpMatrix.length && (
                <span className={styles.computingIndicator}>
                  <div className="spinner-teal" style={{ width: "12px", height: "12px", borderWidth: "1.5px" }} />
                  Computing...
                </span>
              )}
              {animatedRows >= result.dpMatrix.length && (
                <span style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: 600, marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px" }}>
                  <ArrowDownRight size={12} /> Traceback path highlighted
                </span>
              )}
            </div>

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
                          const isOnPath = tracebackCells.has(`${i}-${j}`) && animatedRows >= result.dpMatrix.length;
                          const bgColor = isVisible ? getCellColor(cell.val, maxDpVal, minDpVal) : "transparent";

                          return (
                            <td
                              key={`cell-${i}-${j}`}
                              className={`${isVisible ? styles.dpCellFilled : styles.dpCellEmpty} ${isOnPath ? styles.dpCellOnPath : ""}`}
                              style={{
                                backgroundColor: isOnPath ? "rgba(245, 158, 11, 0.2)" : bgColor,
                                color: isVisible ? "var(--foreground)" : "transparent",
                              }}
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

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.7rem", color: "var(--text-muted)" }}>
              <span>Match: +2</span>
              <span>Mismatch: -1</span>
              <span>Gap: -2</span>
              <span style={{ marginLeft: "auto", color: "var(--accent-primary)", fontWeight: 600 }}>
                Optimal score: {result.dpMatrix[result.dpMatrix.length - 1][result.dpMatrix[0].length - 1].val}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <Link href="/analyze" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Proceed to Analyze <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* Educational Simulation Section */}
      <div id="simulation-section">
        <RecoverSimulation />
      </div>
    </div>
  );
}
