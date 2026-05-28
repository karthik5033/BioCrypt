"use client";

import { useState } from "react";
import { BarChart3, Database, Clock, Zap, Play } from "lucide-react";
import styles from "./analyze.module.css";

export default function AnalyzePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState({
    spaceDna: 0,
    spaceBinary: 0,
    entropy: 0,
    timeRecoveryMs: 0
  });

  const runBenchmark = () => {
    setIsRunning(true);
    // Reset to 0 for animation effect
    setMetrics({ spaceDna: 0, spaceBinary: 0, entropy: 0, timeRecoveryMs: 0 });
    
    // Mock a 2 second benchmark run
    setTimeout(() => {
      setMetrics({
        spaceDna: 45, // roughly 45% of original binary size via Huffman
        spaceBinary: 100, // baseline
        entropy: 92, // high mutation entropy %
        timeRecoveryMs: 124 // DP execution time mock
      });
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <BarChart3 size={28} color="var(--accent-primary)" />
          Complexity Dashboard
        </h1>
        <p className={styles.subtitle}>
          Analyze the algorithmic performance, space constraints, and entropy of the BioCrypt engine.
        </p>
      </div>

      <button 
        className={`btn-primary ${styles.benchmarkBtn}`} 
        onClick={runBenchmark}
        disabled={isRunning}
        style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        {isRunning ? (
          <>
            <div className="spinner" style={{ width: "16px", height: "16px" }} />
            Running Benchmark...
          </>
        ) : (
          <>
            <Play size={16} /> Run Full Benchmark
          </>
        )}
      </button>

      <div className={styles.grid}>
        
        {/* Space Complexity Card */}
        <div className={`clinical-card ${styles.card}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Space Complexity</span>
            <div className={styles.cardIcon}>
              <Database size={20} />
            </div>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.barRow}>
              <div className={styles.barLabel}>
                <span>Standard Binary</span>
                <span>{metrics.spaceBinary > 0 ? "100 MB" : "-"}</span>
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
                <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>Huffman DNA Encoding</span>
                <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                  {metrics.spaceDna > 0 ? `${metrics.spaceDna} MB` : "-"}
                </span>
              </div>
              <div className={styles.barTrack}>
                <div 
                  className={styles.barFill} 
                  style={{ width: `${metrics.spaceDna}%` }} 
                />
              </div>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
              * Based on optimal prefix tree compression mapped to quaternary bases.
            </p>
          </div>
        </div>

        {/* Time Complexity Card */}
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
                  <span className={styles.bigOLabel}>DNA Encoding (Huffman)</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Tree building & encoding</span>
                </div>
                <span className={styles.bigOValue}>O(N log K)</span>
              </div>

              <div className={styles.bigOItem}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className={styles.bigOLabel}>Self-Healing (Recovery)</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Needleman-Wunsch DP</span>
                </div>
                <span className={styles.bigOValue}>O(N × M)</span>
              </div>

            </div>
          </div>
        </div>

        {/* Mutation Entropy Card */}
        <div className={`clinical-card ${styles.card}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Mutation Entropy</span>
            <div className={styles.cardIcon}>
              <Zap size={20} />
            </div>
          </div>
          <div className={styles.chartContainer} style={{ justifyContent: "center" }}>
            <div className={styles.entropyContainer}>
              <div 
                className={styles.entropyCircle} 
                style={{ 
                  transform: `rotate(${metrics.entropy > 0 ? 45 : -135}deg)`,
                  borderTopColor: metrics.entropy > 0 ? "var(--accent-primary)" : "var(--border-light)",
                  borderRightColor: metrics.entropy > 0 ? "var(--accent-primary)" : "var(--border-light)",
                  borderBottomColor: metrics.entropy > 80 ? "var(--accent-primary)" : "var(--border-light)"
                }}
              >
                <span 
                  className={styles.entropyValue}
                  style={{ transform: `rotate(${metrics.entropy > 0 ? -45 : 135}deg)` }}
                >
                  {metrics.entropy}%
                </span>
              </div>
              <span className={styles.entropyLabel}>Cryptographic Dispersion</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
