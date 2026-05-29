"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, FileText, ArrowRight, Dna } from "lucide-react";
import { encodeFile, type EncoderResult } from "@/lib/encoder";
import { useBioCrypt } from "@/context/BioCryptContext";
import styles from "./encode.module.css";

// Color map for DNA nucleotides
const DNA_COLORS: Record<string, string> = {
  A: "#3B82F6", // blue
  T: "#10B981", // green
  C: "#F97316", // orange
  G: "#EF4444", // red
};

export default function EncodePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<EncoderResult | null>(null);
  const [isEncoding, setIsEncoding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [typedDNA, setTypedDNA] = useState("");
  const { setPipelineStep, setOriginalFile, setEncoderResult } = useBioCrypt();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Typing animation ────────────────────────────────────────────────────
  useEffect(() => {
    if (!result) return;

    const dnaPreview = result.rawDNA.slice(0, 64);
    let idx = 0;
    setTypedDNA("");

    const timer = setInterval(() => {
      if (idx < dnaPreview.length) {
        const char = dnaPreview[idx];
        setTypedDNA((prev) => prev + (char || ""));
        idx++;
      } else {
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [result]);

  // ─── File handling ────────────────────────────────────────────────────────
  const handleFile = useCallback((f: File) => {
    setFile(f);
    setOriginalFile(f);
    setResult(null);
    setEncoderResult(null);
    setTypedDNA("");
    setPipelineStep("encode", "pending");
  }, [setOriginalFile, setEncoderResult, setPipelineStep]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleConvert = async () => {
    if (!file) return;
    setIsEncoding(true);
    setPipelineStep("encode", "in-progress");
    try {
      const encoded = await encodeFile(file);
      setResult(encoded);
      setEncoderResult(encoded);
      setPipelineStep("encode", "complete");
    } catch (err) {
      console.error("Encoding failed:", err);
      setPipelineStep("encode", "pending");
    } finally {
      setIsEncoding(false);
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Dna size={28} color="var(--accent-primary)" />
          DNA Encoder
        </h1>
        <p className={styles.subtitle}>
          Upload a file to convert its binary data into a DNA nucleotide
          sequence, then compress with Huffman coding.
        </p>
      </div>

      {/* ── Upload Zone ──────────────────────────────────────────────────── */}
      <div
        className={`${styles.uploadZone} ${isDragging ? styles.uploadZoneDrag : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files?.[0]) handleFile(e.target.files[0]);
          }}
        />
        <Upload
          size={32}
          color={isDragging ? "var(--accent-primary)" : "var(--text-muted)"}
        />
        <p className={styles.uploadText}>
          {isDragging
            ? "Drop file here"
            : "Drag & drop a file, or click to upload"}
        </p>
        <span className={styles.uploadHint}>Any file type supported</span>
      </div>

      {/* ── File Info + Convert Button ───────────────────────────────────── */}
      {file && !result && (
        <div className={`${styles.fileInfo} fade-in`}>
          <div className={styles.fileDetails}>
            <FileText size={20} color="var(--accent-primary)" />
            <div>
              <p className={styles.fileName}>{file.name}</p>
              <p className={styles.fileSize}>{formatBytes(file.size)}</p>
            </div>
          </div>
          <button
            className={`btn-primary ${styles.convertBtn}`}
            onClick={handleConvert}
            disabled={isEncoding}
          >
            {isEncoding ? (
              <span className={styles.spinner} />
            ) : (
              <>
                Convert to DNA <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {result && (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Binary + DNA Panels */}
          <div className={styles.panelGrid}>
            {/* LEFT — Binary */}
            <div className={`clinical-card ${styles.panel}`}>
              <h3 className={styles.panelTitle}>Binary Representation</h3>
              <p className={styles.panelLabel}>First 64 bits</p>
              <div className={styles.sequenceBox}>
                <code className={styles.binaryCode}>
                  {result.binaryString.slice(0, 64)}
                </code>
              </div>
            </div>

            {/* RIGHT — DNA */}
            <div className={`clinical-card ${styles.panel}`}>
              <h3 className={styles.panelTitle}>DNA Sequence</h3>
              <p className={styles.panelLabel}>First 64 nucleotides</p>
              <div className={styles.sequenceBox}>
                <code className={styles.dnaCode}>
                  {typedDNA.split("").map((char, i) => (
                    <span
                      key={i}
                      style={{ color: DNA_COLORS[char] || "inherit" }}
                    >
                      {char}
                    </span>
                  ))}
                  <span className={styles.cursor}>|</span>
                </code>
              </div>
              <div className={styles.legend}>
                {Object.entries(DNA_COLORS).map(([nucleotide, color]) => (
                  <span key={nucleotide} className={styles.legendItem}>
                    <span
                      className={styles.legendDot}
                      style={{ backgroundColor: color }}
                    />
                    {nucleotide}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Compression Stats ──────────────────────────────────────── */}
          <div className={`clinical-card ${styles.statsCard}`}>
            <h3 className={styles.panelTitle}>Compression Analysis</h3>

            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Original Size</span>
                <span className={styles.statValue}>
                  {formatBytes(result.stats.originalSizeBytes)}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>After RLE & LZW</span>
                <span className={styles.statValue}>
                  {result.stats.lzwTokenCount.toLocaleString()} tokens
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Multi-Stage Compressed</span>
                <span className={styles.statValue}>
                  {formatBytes(result.stats.huffmanByteSize)}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel} title="Total compression ratio (RLE → LZW → Huffman)">
                  Ratio ⓘ
                </span>
                <span 
                  className={styles.statValueAccent}
                  style={{
                    backgroundColor: result.stats.compressionRatio > 1.2 
                      ? "rgba(16, 185, 129, 0.15)" // green
                      : result.stats.compressionRatio > 1.0 
                        ? "rgba(245, 158, 11, 0.15)" // yellow
                        : "rgba(100, 116, 139, 0.15)", // gray
                    color: result.stats.compressionRatio > 1.2 
                      ? "#10B981" 
                      : result.stats.compressionRatio > 1.0 
                        ? "#F59E0B" 
                        : "#64748b",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "6px",
                    display: "inline-block",
                    marginTop: "0.2rem"
                  }}
                >
                  {result.stats.compressionRatio.toFixed(2)}x
                </span>
              </div>
            </div>

            {/* Compression Bar */}
            <div className={styles.compressionBarWrapper}>
              <div className={styles.compressionBarLabel}>
                <span>Multi-Stage compressed</span>
                <span>Original</span>
              </div>
              <div className={styles.compressionBarTrack}>
                <div
                  className={styles.compressionBarFill}
                  style={{
                    width: `${Math.min(
                      (result.stats.huffmanByteSize /
                        result.stats.originalSizeBytes) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── Huffman Code Table ─────────────────────────────────────── */}
          <div className={`clinical-card ${styles.statsCard}`}>
            <h3 className={styles.panelTitle}>Huffman Code Table</h3>
            <div className={styles.codeTableGrid}>
              {Object.entries(result.stats.codeTable).slice(0, 48).map(
                ([byteHex, code]) => (
                  <div key={byteHex} className={styles.codeTableEntry}>
                    <span
                      className={styles.codeTableChar}
                      style={{
                        color: "var(--accent-primary)",
                        fontFamily: "var(--font-dm-mono)"
                      }}
                    >
                      {byteHex}
                    </span>
                    <span className={styles.codeTableArrow}>→</span>
                    <code className={styles.codeTableCode}>{code}</code>
                  </div>
                )
              )}
            </div>
            {Object.keys(result.stats.codeTable).length > 48 && (
              <div className={styles.codeTableNote}>
                Showing first 48 entries (out of {Object.keys(result.stats.codeTable).length} unique tokens).
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
