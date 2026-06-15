"use client";

import { useState } from "react";
import { Play, Activity, ArrowRight, ArrowDown, ArrowDownRight } from "lucide-react";

export default function RecoverSimulation() {
  const [step, setStep] = useState(0);
  const [refBase, setRefBase] = useState("A");
  const [corruptBase, setCorruptBase] = useState("T");

  const runSimulation = () => {
    setStep(1);
    setTimeout(() => setStep(2), 2000);
    setTimeout(() => setStep(3), 4000);
    setTimeout(() => setStep(4), 6000);
    setTimeout(() => setStep(5), 8000);
  };

  const matchScore = 2;
  const mismatchScore = -1;
  const gapScore = -2;

  const isMatch = refBase === corruptBase || corruptBase === "?";
  const diagScore = isMatch ? matchScore : mismatchScore;

  // Mock surrounding DP cell values
  const dpUpLeft = 5;
  const dpUp = 3;
  const dpLeft = 2;

  const valDiag = dpUpLeft + diagScore;
  const valUp = dpUp + gapScore;
  const valLeft = dpLeft + gapScore;

  const maxVal = Math.max(valDiag, valUp, valLeft);

  return (
    <div className="clinical-card" style={{ padding: "2.5rem", marginTop: "3rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Activity size={24} color="var(--accent-primary)" /> How Recovery Works (Needleman-Wunsch)
        </h2>
        <p style={{ color: "#475569", marginTop: "0.5rem", lineHeight: 1.6 }}>
          The recovery engine uses Global Sequence Alignment to fix corrupted DNA. Let's zoom in on how a single cell in the Dynamic Programming (DP) table makes its decision based on the characters being compared.
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#475569" }}>Reference Base:</label>
          <input
            type="text"
            value={refBase}
            onChange={(e) => { setRefBase(e.target.value.toUpperCase().replace(/[^ATCG]/g, '') || "A"); setStep(0); }}
            maxLength={1}
            style={{ width: "40px", textAlign: "center", padding: "0.5rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1rem", fontWeight: 700 }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#475569" }}>Corrupted Base:</label>
          <input
            type="text"
            value={corruptBase}
            onChange={(e) => { setCorruptBase(e.target.value.toUpperCase().replace(/[^ATCG?]/g, '') || "?"); setStep(0); }}
            maxLength={1}
            style={{ width: "40px", textAlign: "center", padding: "0.5rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1rem", fontWeight: 700 }}
          />
        </div>
        <button
          onClick={runSimulation}
          className="btn-primary"
          style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600, marginLeft: "auto" }}
          disabled={step > 0 && step < 5}
        >
          <Play size={16} /> Simulate Cell Calculation
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {/* Scenario Setup */}
        <div style={{ opacity: step >= 1 ? 1 : 0.75, transition: "opacity 0.5s" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "0.5rem" }}>1. The Scenario</h3>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "0.5rem" }}>Comparing Reference base <span style={{ fontWeight: 800, color: "#10b981" }}>'{refBase}'</span> vs Corrupted base <span style={{ fontWeight: 800, color: "#ef4444" }}>'{corruptBase}'</span></p>
              <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "#64748b" }}>
                <span>Match: <strong style={{ color: "#10b981" }}>+2</strong></span>
                <span>Mismatch: <strong style={{ color: "#ef4444" }}>-1</strong></span>
                <span>Gap: <strong style={{ color: "#f59e0b" }}>-2</strong></span>
              </div>
            </div>
            
            <table style={{ borderCollapse: "collapse", textAlign: "center" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "0.5rem", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", width: "40px", color: "#94a3b8" }}>{dpUpLeft}</td>
                  <td style={{ padding: "0.5rem", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", width: "40px", color: "#94a3b8" }}>{dpUp}</td>
                </tr>
                <tr>
                  <td style={{ padding: "0.5rem", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", color: "#94a3b8" }}>{dpLeft}</td>
                  <td style={{ padding: "0.5rem", border: "2px dashed var(--accent-primary)", fontWeight: 800, color: "var(--accent-primary)" }}>?</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagonal: Mismatch/Match */}
        <div style={{ opacity: step >= 2 ? 1 : 0.75, transition: "opacity 0.5s" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "0.5rem" }}>2. Check Diagonal (Substitution)</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <ArrowDownRight size={20} color={isMatch ? "#10b981" : "#ef4444"} />
            <span style={{ fontSize: "0.9rem", color: "#475569" }}>
              '{refBase}' {isMatch ? "=" : "≠"} '{corruptBase}', so it's a {isMatch ? "Match (+2)" : "Mismatch (-1)"}.
            </span>
            <span style={{ padding: "0.4rem 0.8rem", backgroundColor: "#f8fafc", borderRadius: "6px", fontFamily: "var(--font-dm-mono)", fontWeight: 700 }}>
              {dpUpLeft} {isMatch ? "+ 2" : "- 1"} = <span style={{ color: isMatch ? "#10b981" : "#ef4444" }}>{valDiag}</span>
            </span>
          </div>
        </div>

        {/* Up: Gap in Corrupted */}
        <div style={{ opacity: step >= 3 ? 1 : 0.75, transition: "opacity 0.5s" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "0.5rem" }}>3. Check Up (Deletion)</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <ArrowDown size={20} color="#f59e0b" />
            <span style={{ fontSize: "0.9rem", color: "#475569" }}>Introduce a Gap (-2).</span>
            <span style={{ padding: "0.4rem 0.8rem", backgroundColor: "#f8fafc", borderRadius: "6px", fontFamily: "var(--font-dm-mono)", fontWeight: 700 }}>
              {dpUp} - 2 = <span style={{ color: "#f59e0b" }}>{valUp}</span>
            </span>
          </div>
        </div>

        {/* Left: Gap in Reference */}
        <div style={{ opacity: step >= 4 ? 1 : 0.75, transition: "opacity 0.5s" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "0.5rem" }}>4. Check Left (Insertion)</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <ArrowRight size={20} color="#f59e0b" />
            <span style={{ fontSize: "0.9rem", color: "#475569" }}>Introduce a Gap (-2).</span>
            <span style={{ padding: "0.4rem 0.8rem", backgroundColor: "#f8fafc", borderRadius: "6px", fontFamily: "var(--font-dm-mono)", fontWeight: 700 }}>
              {dpLeft} - 2 = <span style={{ color: "#f59e0b" }}>{valLeft}</span>
            </span>
          </div>
        </div>

        {/* Final Decision */}
        <div style={{ opacity: step >= 5 ? 1 : 0, transition: "opacity 0.5s" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: "0.5rem" }}>5. The Decision: Max Value</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "rgba(59, 130, 246, 0.1)", padding: "1rem", borderRadius: "8px" }}>
            <span style={{ fontSize: "0.9rem", color: "#0f172a" }}>Max({valDiag}, {valUp}, {valLeft}) is <strong>{maxVal}</strong>. The cell value becomes {maxVal}.</span>
            <span style={{ marginLeft: "auto", fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-primary)" }}>{maxVal}</span>
          </div>
          <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#64748b" }}>
            * This calculation repeats for every cell in the grid. Then, the algorithm traces backwards from the bottom-right corner, following the highest scores to reconstruct the original sequence.
          </p>
        </div>
      </div>
    </div>
  );
}
