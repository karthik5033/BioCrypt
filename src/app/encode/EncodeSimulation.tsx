"use client";

import { useState } from "react";
import { Play, ArrowRight, Dna, Binary } from "lucide-react";

export default function EncodeSimulation() {
  const [inputText, setInputText] = useState("HELLO");
  const [step, setStep] = useState(0);

  // Helper mappings
  const stringToBinary = (str: string) => {
    return str.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    });
  };

  const binaryToDna = (binArray: string[]) => {
    const map: Record<string, string> = { "00": "A", "01": "T", "10": "C", "11": "G" };
    return binArray.map(bin => {
      let dna = "";
      for (let i = 0; i < bin.length; i += 2) {
        dna += map[bin.slice(i, i + 2)];
      }
      return dna;
    });
  };

  const runSimulation = () => {
    setStep(1);
    setTimeout(() => setStep(2), 1500);
    setTimeout(() => setStep(3), 3000);
    setTimeout(() => setStep(4), 4500);
  };

  const binaries = stringToBinary(inputText);
  const dnas = binaryToDna(binaries);

  return (
    <div className="clinical-card" style={{ padding: "2.5rem", marginTop: "3rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Dna size={24} color="var(--accent-primary)" /> How Encoding Works
        </h2>
        <p style={{ color: "#475569", marginTop: "0.5rem", lineHeight: 1.6 }}>
          Watch how raw text is converted step-by-step into DNA nucleotides. This simulation demonstrates the core concept behind BioCrypt's encoding stage.
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2.5rem" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => { setInputText(e.target.value.toUpperCase()); setStep(0); }}
          placeholder="Enter short text (e.g., HELLO)"
          maxLength={10}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
            outline: "none",
            textTransform: "uppercase"
          }}
        />
        <button
          onClick={runSimulation}
          className="btn-primary"
          style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}
          disabled={!inputText || step > 0 && step < 4}
        >
          <Play size={16} /> Simulate Process
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Step 1: Text */}
        <div style={{ opacity: step >= 1 ? 1 : 0.75, transition: "opacity 0.5s" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "0.5rem" }}>1. Raw Input Text</h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {inputText.split('').map((char, i) => (
              <div key={i} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f1f5f9", borderRadius: "8px", fontWeight: 700, fontSize: "1.2rem", color: "#0f172a", border: "1px solid #e2e8f0" }}>
                {char}
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: ASCII Binary */}
        <div style={{ opacity: step >= 2 ? 1 : 0.75, transition: "opacity 0.5s" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ArrowRight size={14} /> 2. Convert to ASCII Binary
          </h3>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {binaries.map((bin, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.7rem", color: "#475569", fontWeight: 500 }}>{inputText[i]}</span>
                <div style={{ padding: "0.5rem", backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#2563eb", borderRadius: "6px", fontFamily: "var(--font-dm-mono)", fontWeight: 600, fontSize: "0.9rem" }}>
                  {bin}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: DNA Mapping */}
        <div style={{ opacity: step >= 3 ? 1 : 0.75, transition: "opacity 0.5s" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ArrowRight size={14} /> 3. Map to DNA Nucleotides (00=A, 01=T, 10=C, 11=G)
          </h3>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {dnas.map((dna, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.7rem", color: "#475569", fontWeight: 500 }}>{binaries[i]}</span>
                <div style={{ padding: "0.5rem", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#059669", borderRadius: "6px", fontFamily: "var(--font-dm-mono)", fontWeight: 800, fontSize: "1rem", letterSpacing: "2px" }}>
                  {dna}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 4: Final Strand */}
        <div style={{ opacity: step >= 4 ? 1 : 0, transition: "opacity 0.5s" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ArrowRight size={14} /> 4. Final Encoded DNA Strand
          </h3>
          <div style={{ padding: "1rem", backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "8px", fontFamily: "var(--font-dm-mono)", fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-primary)", wordBreak: "break-all", lineHeight: 1.5 }}>
            {dnas.join("")}
          </div>
          <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#64748b" }}>
            * Note: The actual BioCrypt pipeline further compresses this strand using Run-Length Encoding, LZW, and Huffman coding to significantly reduce its size before encryption.
          </p>
        </div>
      </div>
    </div>
  );
}
