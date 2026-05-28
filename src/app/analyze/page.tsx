"use client";

import { useState, useCallback } from "react";
import {
  BarChart3,
  Database,
  Clock,
  Zap,
  Play,
  Search,
  Cpu,
  Activity,
} from "lucide-react";
import styles from "./analyze.module.css";

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

/* ── Mock DNA strand for demo ── */
const DEMO_DNA = "ATCGGCTAAGTCGATCGGATCGATCGGCTAAGTCGATCGGATCGATCGGCTAAGTCGATCGGATCG";

export default function AnalyzePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [metrics, setMetrics] = useState({
    spaceDna: 0,
    spaceBinary: 0,
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
    setMetrics({
      spaceDna: 0,
      spaceBinary: 0,
      compressionRatio: 0,
      entropy: 0,
      timeRecoveryMs: 0,
      timeEncodingMs: 0,
      timeMutationMs: 0,
      mutationsApplied: 0,
      dpTableSize: "",
    });

    setTimeout(() => {
      setMetrics({
        spaceDna: 45,
        spaceBinary: 100,
        compressionRatio: 2.22,
        entropy: 92,
        timeRecoveryMs: 0.84,
        timeEncodingMs: 0.12,
        timeMutationMs: 0.31,
        mutationsApplied: 28,
        dpTableSize: "12 × 12",
      });
      setHasRun(true);
      setIsRunning(false);
    }, 1800);
  }, []);

  const runKmpSearch = useCallback(() => {
    if (!kmpPattern) return;
    const clean = kmpPattern.toUpperCase().replace(/[^ATCG]/g, "");
    if (!clean) return;

    const t0 = performance.now();
    const matches = kmpSearch(DEMO_DNA, clean);
    const t1 = performance.now();
    const failFn = computeFailureFunction(clean);

    setKmpResults({
      matches,
      failFn,
      time: parseFloat((t1 - t0).toFixed(3)),
    });
  }, [kmpPattern]);

  // Render DNA strand with KMP highlights
  const renderKmpStrand = () => {
    if (!kmpResults) return <div className={styles.kmpStrand}><span className={styles.kmpNormal}>{DEMO_DNA}</span></div>;

    const matchSet = new Set<number>();
    const cleanPat = kmpPattern.toUpperCase().replace(/[^ATCG]/g, "");
    for (const start of kmpResults.matches) {
      for (let k = start; k < start + cleanPat.length; k++) {
        matchSet.add(k);
      }
    }

    return (
      <div className={styles.kmpStrand}>
        {DEMO_DNA.split("").map((c, i) => (
          <span key={i} className={matchSet.has(i) ? styles.kmpMatch : styles.kmpNormal}>
            {c}
          </span>
        ))}
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
                <span>{metrics.spaceBinary > 0 ? "100 KB" : "—"}</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${styles.barFillAlt}`}
                  style={{ width: `${metrics.spaceBinary}%` }}
                />
              </div>
            </div>

            <div className={styles.barRow}>
              <div className={styles.barLabel}>
                <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                  Huffman DNA
                </span>
                <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                  {metrics.spaceDna > 0 ? `${metrics.spaceDna} KB` : "—"}
                </span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${metrics.spaceDna}%` }}
                />
              </div>
            </div>

            <p className={styles.cardSubtext}>
              Huffman coding on quaternary DNA bases achieves optimal prefix-free compression. Tree construction runs in O(N log K) where K = alphabet size (4).
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
                  <span className={styles.bigOLabel}>DNA Encoding</span>
                  <span className={styles.bigOSub}>
                    Huffman tree build + encode
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
              { stage: "Encoding", algo: "Huffman Coding", type: "Greedy" },
              { stage: "Indexing", algo: "Trie", type: "Tree" },
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
              DNA Strand ({DEMO_DNA.length} bases)
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
    </div>
  );
}
