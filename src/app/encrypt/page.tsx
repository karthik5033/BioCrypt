"use client";

import { useState } from "react";
import { Lock, Download, Wand2 } from "lucide-react";
import { encryptDNA, type CipherResult } from "@/lib/mutationCipher";
import styles from "./encrypt.module.css";

export default function EncryptPage() {
  const [dnaInput, setDnaInput] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [useSub, setUseSub] = useState(true);
  const [useInv, setUseInv] = useState(true);
  const [useIndel, setUseIndel] = useState(false);
  
  const [result, setResult] = useState<CipherResult | null>(null);

  const handleEncrypt = () => {
    if (!dnaInput || !keyInput) return;
    const res = encryptDNA(dnaInput.toUpperCase().replace(/[^ATCG]/g, ""), keyInput, useSub, useInv, useIndel);
    setResult(res);
  };

  const downloadEncrypted = () => {
    if (!result) return;
    const blob = new Blob([result.encryptedDNA], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "encrypted.biocrypt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMutatedDNA = () => {
    if (!result) return null;
    
    // Create a map of changed positions for quick lookup
    const mutatedPositions = new Set<number>();
    result.mutationMap.forEach(m => {
      for (let i = 0; i < m.mutated.length; i++) {
        mutatedPositions.add(m.position + i);
      }
    });

    return (
      <div className={styles.sequenceData}>
        {result.encryptedDNA.split("").map((char, i) => (
          <span key={i} className={mutatedPositions.has(i) ? styles.mutatedChar : ""}>
            {char}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Lock size={28} color="var(--accent-primary)" />
          Mutation Cipher
        </h1>
        <p className={styles.subtitle}>
          Encrypt your DNA sequence by applying biologically-inspired mutations seeded by a secret key.
        </p>
      </div>

      {/* Input Section */}
      <div className={`clinical-card ${styles.card}`}>
        <div>
          <label className={styles.label}>DNA Sequence</label>
          <textarea 
            className={styles.textarea}
            placeholder="Paste your ATCG sequence here..."
            value={dnaInput}
            onChange={(e) => setDnaInput(e.target.value)}
          />
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Encryption Key</label>
            <input 
              type="password"
              className={styles.input}
              placeholder="Enter a secret phrase..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                className={styles.checkbox}
                checked={useSub}
                onChange={(e) => setUseSub(e.target.checked)}
              />
              Substitution
            </label>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                className={styles.checkbox}
                checked={useInv}
                onChange={(e) => setUseInv(e.target.checked)}
              />
              Inversion
            </label>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                className={styles.checkbox}
                checked={useIndel}
                onChange={(e) => setUseIndel(e.target.checked)}
              />
              Deletion-Insertion
            </label>
          </div>
        </div>

        <button 
          className="btn-primary" 
          style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "0.5rem" }}
          onClick={handleEncrypt}
          disabled={!dnaInput || !keyInput}
        >
          <Wand2 size={16} /> Apply Mutations
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className={styles.sequenceContainer}>
            <div className={styles.sequenceRow}>
              <span className={styles.sequenceTitle}>Original Strand</span>
              <div className={styles.sequenceData} style={{ color: "var(--text-muted)" }}>
                {dnaInput.toUpperCase().replace(/[^ATCG]/g, "")}
              </div>
            </div>
            
            <div className={styles.sequenceRow}>
              <span className={styles.sequenceTitle}>Encrypted Strand</span>
              {renderMutatedDNA()}
            </div>

            <button 
              className={`btn-secondary ${styles.downloadBtn}`}
              onClick={downloadEncrypted}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Download size={16} /> Download .biocrypt
            </button>
          </div>

          <div className={`clinical-card ${styles.card}`}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "0 0 0.5rem 0" }}>Mutation Map</h3>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Original</th>
                    <th>Mutated</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {result.mutationMap.map((m, i) => (
                    <tr key={i}>
                      <td className={styles.mono}>{m.position}</td>
                      <td className={styles.mono} style={{ color: "var(--text-muted)" }}>{m.original}</td>
                      <td className={styles.mono} style={{ color: "var(--accent-primary)", fontWeight: 500 }}>{m.mutated}</td>
                      <td>
                        <span className={styles.badge}>{m.type}</span>
                      </td>
                    </tr>
                  ))}
                  {result.mutationMap.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                        No mutations applied. Sequence was too short or no types selected.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
