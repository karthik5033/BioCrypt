"use client";

import { useState, useCallback, useEffect } from "react";
import {
  BarChart3,
  Database,
  Clock,
  Zap,
  Play,
  Search,
  Cpu,
  Activity,
  ChevronDown
} from "lucide-react";
import { useBioCrypt } from "@/context/BioCryptContext";
import styles from "./analyze.module.css";
import AnalyzeSimulation from "./AnalyzeSimulation";
import { compressBytes } from "@/lib/encoder";
import { encryptDNA } from "@/lib/mutationCipher";
import { needlemanWunsch } from "@/lib/recoveryEngine";

/* ── KMP Algorithm ── */
function computeFailureFunction(pattern: string): number[] {
  const fail = new Array(pattern.length).fill(0);
  let k = 0;
  for (let i = 1; i < pattern.length; i++) {
    while (k > 0 && pattern[k] !== pattern[i]) k = fail[k - 1];
    if (pattern[k] === pattern[i]) k++;
    fail[i] = k;
  }
  return fail;
}

function kmpSearch(text: string, pattern: string): number[] {
  if (!pattern || !text) return [];
  const fail = computeFailureFunction(pattern);
  const matches: number[] = [];
  let q = 0;

  for (let i = 0; i < text.length; i++) {
    while (q > 0 && pattern[q] !== text[i]) q = fail[q - 1];
    if (pattern[q] === text[i]) q++;
    if (q === pattern.length) {
      matches.push(i - pattern.length + 1);
      q = fail[q - 1];
    }
  }
  return matches;
}

export default function AnalyzePage() {
  const { encoderResult, cipherResult, recoveryResult, setPipelineStep } = useBioCrypt();
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  
  // Use actual data if available, fallback to demo string
  const dnaStrand = encoderResult?.rawDNA || "ATCGGCTAAGTCGATCGGATCGATCGGCTAAGTCGATCGGATCGATCGGCTAAGTCGATCGGATCG";

  const [metrics, setMetrics] = useState({
    spaceDnaBytes: 0,
    spaceBinaryBytes: 0,
    compressionRatio: 0,
    entropy: 0,
    timeRecoveryMs: 0,
    timeEncodingMs: 0,
    timeMutationMs: 0,
    mutationsApplied: 0,
    dpTableSize: "",
  });

  // KMP state
  const [kmpPattern, setKmpPattern] = useState("ATCG");
  const [kmpResults, setKmpResults] = useState<{
    matches: number[];
    failFn: number[];
    time: number;
  } | null>(null);

  const runBenchmark = useCallback(() => {
    setIsRunning(true);
    setPipelineStep("analyze", "in-progress");
    setMetrics({
      spaceDnaBytes: 0,
      spaceBinaryBytes: 0,
      compressionRatio: 0,
      entropy: 0,
      timeRecoveryMs: 0,
      timeEncodingMs: 0,
      timeMutationMs: 0,
      mutationsApplied: 0,
      dpTableSize: "",
    });

    setTimeout(() => {
      let timeEnc = 0, timeMut = 0, timeRec = 0;
      let compRatio = 0, ent = 0, mutApplied = 0, dpRows = 0, dpCols = 0;
      let spaceBinaryBytes = 0, spaceDnaBytes = 0;

      // Benchmark Encoding
      const t0 = performance.now();
      const rawBytes = new TextEncoder().encode(dnaStrand); 
      // If we have actual file stats, use those. Otherwise simulate with the dnaStrand text.
      const originalBytes = encoderResult?.stats.originalSizeBytes || rawBytes.length;
      spaceBinaryBytes = originalBytes;

      const simEncode = compressBytes(rawBytes);
      timeEnc = parseFloat((performance.now() - t0).toFixed(2));
      
      const huffmanBytes = encoderResult?.stats.huffmanByteSize || simEncode.stats.compressedSize;
      spaceDnaBytes = huffmanBytes;
      compRatio = encoderResult?.stats.compressionRatio || simEncode.stats.ratio;

      // Benchmark Mutation
      const t1 = performance.now();
      const testDNA = encoderResult?.rawDNA || dnaStrand;
      const simCipher = encryptDNA(testDNA, "benchmarkKey", true, true, true);
      timeMut = parseFloat((performance.now() - t1).toFixed(2));
      mutApplied = cipherResult?.mutationMap.length || simCipher.mutationMap.length;
      const dnaLen = cipherResult?.encryptedDNA.length || simCipher.encryptedDNA.length || 1;
      ent = mutApplied > 0 ? Math.min(Math.round((mutApplied / dnaLen) * 100 * 5), 100) : 0;

      // Benchmark Recovery (Limit to 64 bases)
      const maxLen = Math.min(simCipher.encryptedDNA.length, 64);
      const t2 = performance.now();
      const simRec = needlemanWunsch(
        simCipher.encryptedDNA.substring(0, maxLen),
        testDNA.substring(0, maxLen)
      );
      timeRec = parseFloat((performance.now() - t2).toFixed(2));
      
      dpRows = recoveryResult?.dpMatrix.length || simRec.dpMatrix.length;
      dpCols = recoveryResult?.dpMatrix[0]?.length || simRec.dpMatrix[0]?.length || 0;

      setMetrics({
        spaceDnaBytes,
        spaceBinaryBytes,
        compressionRatio: compRatio,
        entropy: ent,
        timeRecoveryMs: timeRec,
        timeEncodingMs: timeEnc,
        timeMutationMs: timeMut,
        mutationsApplied: mutApplied,
        dpTableSize: dpRows > 0 ? `${dpRows} × ${dpCols}` : "0 × 0",
      });
      setHasRun(true);
      setIsRunning(false);
      setPipelineStep("analyze", "complete");
    }, 1500);
  }, [encoderResult, cipherResult, recoveryResult, setPipelineStep]);

  const runKmpSearch = useCallback(() => {
    if (!kmpPattern) return;
    const clean = kmpPattern.toUpperCase().replace(/[^ATCG]/g, "");
    if (!clean) return;

    const t0 = performance.now();
    const matches = kmpSearch(dnaStrand, clean);
    const t1 = performance.now();
    const failFn = computeFailureFunction(clean);

    setKmpResults({
      matches,
      failFn,
      time: parseFloat((t1 - t0).toFixed(3)),
    });
  }, [kmpPattern, dnaStrand]);

  const renderKmpStrand = () => {
    const MAX_PREVIEW = 5000;
    const isTruncated = dnaStrand.length > MAX_PREVIEW;
    const previewDNA = dnaStrand.substring(0, MAX_PREVIEW);

    if (!kmpResults || kmpResults.matches.length === 0) {
      return (
        <div className={styles.kmpStrand}>
          <span className={styles.kmpNormal}>
            {previewDNA}
            {isTruncated && " ... (truncated for preview)"}
          </span>
        </div>
      );
    }

    const cleanPat = kmpPattern.toUpperCase().replace(/[^ATCG]/g, "");
    if (!cleanPat) return <div className={styles.kmpStrand}>
      <span className={styles.kmpNormal}>
        {previewDNA}
        {isTruncated && " ... (truncated for preview)"}
      </span>
    </div>;

    const patLen = cleanPat.length;
    const elements = [];
    let lastIndex = 0;

    // Merge overlapping intervals
    const mergedIntervals: {start: number, end: number}[] = [];
    for (const start of kmpResults.matches) {
      if (start > MAX_PREVIEW) break; // Optimization since matches are sorted
      const end = Math.min(start + patLen, MAX_PREVIEW);
      if (mergedIntervals.length > 0) {
        const last = mergedIntervals[mergedIntervals.length - 1];
        if (start <= last.end) {
          last.end = Math.max(last.end, end);
        } else {
          mergedIntervals.push({ start, end });
        }
      } else {
        mergedIntervals.push({ start, end });
      }
    }

    for (let i = 0; i < mergedIntervals.length; i++) {
      const { start, end } = mergedIntervals[i];
      if (start > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`} className={styles.kmpNormal}>
            {previewDNA.substring(lastIndex, start)}
          </span>
        );
      }
      elements.push(
        <span key={`match-${start}`} className={styles.kmpMatch}>
          {previewDNA.substring(start, end)}
        </span>
      );
      lastIndex = end;
    }

    if (lastIndex < previewDNA.length) {
      elements.push(
        <span key={`text-${lastIndex}`} className={styles.kmpNormal}>
          {previewDNA.substring(lastIndex)}
        </span>
      );
    }
    
    if (isTruncated) {
      elements.push(<span key="truncate" className={styles.kmpNormal}> ... (truncated for preview)</span>);
    }

    return (
      <div className={styles.kmpStrand}>
        {elements}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>
          <Activity size={12} /> Complexity Analysis
        </div>
        <h1 className={styles.title}>
          <BarChart3 size={28} color="var(--accent-primary)" />
          Analysis Dashboard
        </h1>
        <p className={styles.subtitle}>
          Benchmark the pipeline, measure algorithmic complexity, and search DNA
          patterns with KMP — all computed live in your browser.
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

      {/* Run Benchmark */}
      <button
        className={`btn-primary ${styles.benchmarkBtn}`}
        onClick={runBenchmark}
        disabled={isRunning}
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderRadius: "8px" }}
      >
        {isRunning ? (
          <>
            <div className="spinner" style={{ width: "16px", height: "16px" }} />
            Running Benchmark...
          </>
        ) : (
          <>
            <Play size={16} /> {hasRun ? "Re-run Benchmark" : "Run Full Benchmark"}
          </>
        )}
      </button>

      <div className={styles.grid}>

        {/* ── Card 1: Compression ── */}
        <div className={`clinical-card ${styles.card}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Compression Efficiency</span>
            <div className={styles.cardIcon}>
              <Database size={20} />
            </div>
          </div>

          <div className={styles.chartContainer}>
            {/* Big ratio */}
            {hasRun && (
              <div style={{ marginBottom: "1rem" }}>
                <div className={styles.compressionRatio}>{metrics.compressionRatio}×</div>
                <div className={styles.compressionUnit}>compression ratio</div>
              </div>
            )}

            <div className={styles.barRow}>
              <div className={styles.barLabel}>
                <span>Standard Binary</span>
                <span>{metrics.spaceBinaryBytes > 0 ? (metrics.spaceBinaryBytes < 1024 ? `${metrics.spaceBinaryBytes} B` : `${Math.round(metrics.spaceBinaryBytes / 1024)} KB`) : "—"}</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${styles.barFillAlt}`}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div className={styles.barRow}>
              <div className={styles.barLabel}>
                <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                  Multi-Stage DNA
                </span>
                <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                  {metrics.spaceDnaBytes > 0 ? (metrics.spaceDnaBytes < 1024 ? `${metrics.spaceDnaBytes} B` : `${Math.round(metrics.spaceDnaBytes / 1024)} KB`) : "—"}
                </span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: metrics.spaceBinaryBytes > 0 ? `${Math.min(Math.round((metrics.spaceDnaBytes / metrics.spaceBinaryBytes) * 100), 100)}%` : "0%" }}
                />
              </div>
            </div>

            <p className={styles.cardSubtext}>
              4-stage pipeline: BWT clusters repeated patterns → MTF converts to low-valued indices → RLE collapses zero-runs → Huffman produces optimal prefix-free codes.
            </p>
          </div>
        </div>

        {/* ── Card 2: Time Complexity ── */}
        <div className={`clinical-card ${styles.card}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Time Complexity</span>
            <div className={styles.cardIcon}>
              <Clock size={20} />
            </div>
          </div>

          <div className={styles.chartContainer}>
            <div className={styles.bigOContainer}>
              <div className={styles.bigOItem}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className={styles.bigOLabel}>BWT</span>
                  <span className={styles.bigOSub}>Burrows-Wheeler Transform · O(N) space</span>
                </div>
                <span className={styles.bigOValue}>O(N²)</span>
              </div>

              <div className={styles.bigOItem}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className={styles.bigOLabel}>MTF</span>
                  <span className={styles.bigOSub}>Move-to-Front · A = 257 · O(A) space</span>
                </div>
                <span className={styles.bigOValue}>O(N × A)</span>
              </div>

              <div className={styles.bigOItem}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className={styles.bigOLabel}>RLE</span>
                  <span className={styles.bigOSub}>Zero-run collapsing · O(N) space</span>
                </div>
                <span className={styles.bigOValue}>O(N)</span>
              </div>

              <div className={styles.bigOItem}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className={styles.bigOLabel}>Huffman</span>
                  <span className={styles.bigOSub}>
                    Prefix-free coding · K symbols · O(K) space
                    {hasRun && ` · ${metrics.timeEncodingMs}ms`}
                  </span>
                </div>
                <span className={styles.bigOValue}>O(N log K)</span>
              </div>

              <div className={styles.bigOItem}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className={styles.bigOLabel}>Mutation Cipher</span>
                  <span className={styles.bigOSub}>
                    LCG seed + apply mutations
                    {hasRun && ` · ${metrics.timeMutationMs}ms`}
                  </span>
                </div>
                <span className={styles.bigOValue}>O(N)</span>
              </div>

              <div className={styles.bigOItem}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className={styles.bigOLabel}>Recovery Engine</span>
                  <span className={styles.bigOSub}>
                    Needleman-Wunsch DP
                    {hasRun && ` · ${metrics.timeRecoveryMs}ms`}
                  </span>
                </div>
                <span className={styles.bigOValue}>O(N × M)</span>
              </div>

              <div className={styles.bigOItem}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className={styles.bigOLabel}>KMP Pattern Search</span>
                  <span className={styles.bigOSub}>Failure function + scan</span>
                </div>
                <span className={styles.bigOValue}>O(N + M)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Card 3: Mutation Entropy ── */}
        <div className={`clinical-card ${styles.card}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Mutation Entropy</span>
            <div className={styles.cardIcon}>
              <Zap size={20} />
            </div>
          </div>

          <div className={styles.chartContainer} style={{ justifyContent: "center", alignItems: "center" }}>
            <div className={styles.entropyContainer}>
              <div className={styles.entropyRing}>
                <div className={styles.entropyRingBg} />
                <div
                  className={styles.entropyRingFill}
                  style={{
                    transform: `rotate(${hasRun ? -90 + (metrics.entropy / 100) * 270 : -90}deg)`,
                  }}
                />
                <div className={styles.entropyInner}>
                  <span className={styles.entropyValue}>{hasRun ? metrics.entropy : 0}</span>
                  <span className={styles.entropyUnit}>percent</span>
                </div>
              </div>
              <span className={styles.entropyLabel}>Cryptographic Dispersion</span>
            </div>

            {hasRun && (
              <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "2rem", fontSize: "0.8rem" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-dm-mono)", fontWeight: 800, fontSize: "1.5rem", color: "var(--foreground)" }}>
                    {metrics.mutationsApplied}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
                    Mutations
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-dm-mono)", fontWeight: 800, fontSize: "1.5rem", color: "var(--foreground)" }}>
                    {metrics.dpTableSize}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
                    DP Table
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Card 4: Algorithm Map ── */}
        <div className={`clinical-card ${styles.card}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Algorithm Coverage</span>
            <div className={styles.cardIcon}>
              <Cpu size={20} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { stage: "Compression 1", algo: "Burrows-Wheeler Transform (BWT)", type: "String" },
              { stage: "Compression 2", algo: "Move-to-Front (MTF)", type: "Lossless" },
              { stage: "Compression 3", algo: "Run-Length Encoding (RLE)", type: "Lossless" },
              { stage: "Compression 4", algo: "Huffman Coding", type: "Greedy" },
              { stage: "Indexing", algo: "Suffix Arrays / String Rotation", type: "String" },
              { stage: "Encryption", algo: "LCG + Substitution", type: "String" },
              { stage: "Detection", algo: "KMP / Rabin-Karp", type: "String" },
              { stage: "Recovery", algo: "Needleman-Wunsch", type: "DP" },
              { stage: "Analysis", algo: "LCS + Edit Distance", type: "DP" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  backgroundColor: "rgba(248, 250, 252, 0.7)",
                  border: "1px solid var(--border-light)",
                  fontSize: "0.8rem",
                }}
              >
                <span style={{ color: "var(--text-muted)", fontWeight: 500, minWidth: "80px" }}>
                  {item.stage}
                </span>
                <span style={{ fontWeight: 600, color: "var(--foreground)", flex: 1, marginLeft: "0.75rem" }}>
                  {item.algo}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    color: "var(--accent-primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Card 5: KMP Pattern Search (Full width) ── */}
        <div className={`clinical-card ${styles.card} ${styles.gridFull}`}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>
              <Search size={12} />
            </span>
            KMP Pattern Search Demo
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Search Pattern
              </label>
              <input
                type="text"
                className={styles.kmpInput}
                placeholder="e.g. ATCG"
                value={kmpPattern}
                onChange={(e) => setKmpPattern(e.target.value.toUpperCase())}
              />
            </div>
            <button
              className="btn-primary"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderRadius: "8px", height: "fit-content" }}
              onClick={runKmpSearch}
              disabled={!kmpPattern}
            >
              <Search size={16} /> Search
            </button>
          </div>

          {/* DNA Strand */}
          <div>
            <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.5rem", display: "block" }}>
              DNA Strand ({dnaStrand.length} bases)
            </label>
            {renderKmpStrand()}
          </div>

          {/* KMP Results */}
          {kmpResults && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Stats */}
              <div className={styles.kmpStats}>
                <div className={styles.kmpStatItem}>
                  <span className={styles.kmpStatLabel}>Matches Found</span>
                  <span className={styles.kmpStatValueAccent}>{kmpResults.matches.length}</span>
                </div>
                <div className={styles.kmpStatItem}>
                  <span className={styles.kmpStatLabel}>Positions</span>
                  <span className={styles.kmpStatValue}>
                    {kmpResults.matches.length > 0 ? kmpResults.matches.join(", ") : "—"}
                  </span>
                </div>
                <div className={styles.kmpStatItem}>
                  <span className={styles.kmpStatLabel}>Execution</span>
                  <span className={styles.kmpStatValue}>{kmpResults.time}ms</span>
                </div>
                <div className={styles.kmpStatItem}>
                  <span className={styles.kmpStatLabel}>Complexity</span>
                  <span className={styles.kmpStatValueAccent}>O(N+M)</span>
                </div>
              </div>

              {/* Failure Function */}
              <div>
                <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.5rem", display: "block" }}>
                  KMP Failure Function
                </label>
                <div className={styles.failureFnContainer}>
                  {kmpPattern.toUpperCase().replace(/[^ATCG]/g, "").split("").map((c, i) => (
                    <div key={i} className={styles.failureFnCell}>
                      <div className={styles.failureFnChar}>{c}</div>
                      <div className={styles.failureFnVal}>{kmpResults.failFn[i]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Educational Simulation Section */}
      <div id="simulation-section">
        <AnalyzeSimulation />
      </div>
    </div>
  );
}
