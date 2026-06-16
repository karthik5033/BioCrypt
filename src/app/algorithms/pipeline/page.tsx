"use client";

import { Database, Lock, Activity } from "lucide-react";

export default function PipelinePage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "4rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "rgba(16,185,129,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#10b981",
          }}
        >
          <Database size={28} />
        </div>
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#10b981" }}>
            System Design
          </span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem" }}>
            Full BioCrypt-X Pipeline Walkthrough
          </h1>
        </div>
      </div>

      <section style={{ marginBottom: "3rem" }}>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem", fontSize: "1.1rem" }}>
          Let's take the simplest possible input to demonstrate how the BioCrypt-X compression pipeline achieves massive data reduction before mapping to DNA sequences.
        </p>
        <div style={{ backgroundColor: "#1e293b", padding: "1rem 1.5rem", borderRadius: "8px", color: "#e2e8f0", fontFamily: "var(--font-dm-mono)", fontSize: "1.1rem", display: "inline-block", fontWeight: 700 }}>
          Input: "AAABBC"
        </div>
      </section>

      {/* Part 1: Encoding Pipeline */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", marginTop: "2rem", paddingTop: "2rem", borderTop: "2px dashed #e2e8f0" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
            <Layers size={20} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Part 1: Encoding & Compression Pipeline
          </h2>
        </div>

        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Step 1: Raw Bytes
        </h3>
        <div className="clinical-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontFamily: "var(--font-dm-mono)" }}>
          <div>A = 65</div>
          <div>A = 65</div>
          <div>A = 65</div>
          <div>B = 66</div>
          <div>B = 66</div>
          <div>C = 67</div>
          <div style={{ marginTop: "1rem", fontWeight: 700, color: "var(--accent-primary)" }}>6 bytes going in.</div>
        </div>
      </section>

      {/* Step 2 */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Step 2: BWT (Burrows-Wheeler Transform)
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          Append a terminator <code>$</code> (lowest value) and generate all rotations:
        </p>
        <div className="clinical-card" style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", fontFamily: "var(--font-dm-mono)" }}>
          <div>
            <div style={{ fontWeight: 700, color: "#334155", marginBottom: "0.75rem" }}>Rotations</div>
            <div>AAABBC$</div>
            <div>AABBC$A</div>
            <div>ABBC$AA</div>
            <div>BBC$AAA</div>
            <div>BC$AAAB</div>
            <div>C$AAABB</div>
            <div>$AAABBC</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#334155", marginBottom: "0.75rem" }}>Sorted Alphabetically</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>$AAABB</span><span style={{ color: "#10b981", fontWeight: 800 }}>C</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>AAABBC</span><span style={{ color: "#10b981", fontWeight: 800 }}>$</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>AABBC$</span><span style={{ color: "#10b981", fontWeight: 800 }}>A</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>ABBC$A</span><span style={{ color: "#10b981", fontWeight: 800 }}>A</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>BBC$AA</span><span style={{ color: "#10b981", fontWeight: 800 }}>A</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>BC$AAA</span><span style={{ color: "#10b981", fontWeight: 800 }}>B</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>C$AAAB</span><span style={{ color: "#10b981", fontWeight: 800 }}>B</span></div>
          </div>
        </div>
        <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "rgba(16,185,129,0.1)", borderRadius: "8px", fontWeight: 700 }}>
          <div style={{ color: "#10b981", marginBottom: "0.5rem" }}>BWT output (Last Column) → C$AAABB</div>
          <div style={{ color: "#0f172a", fontSize: "0.95rem", lineHeight: 1.6 }}>
            <strong>What happened?</strong> All the A's got clustered together. That's the entire point of BWT — it reorganizes data so identical characters sit next to each other, making the next stages very effective.
          </div>
        </div>
      </section>

      {/* Step 3 */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Step 3: MTF (Move-to-Front)
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          Start with alphabet list: <code>[$ A B C ...]</code>. Process each BWT output character:
        </p>
        <div className="clinical-card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontFamily: "var(--font-dm-mono)" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                <th style={{ padding: "1rem" }}>Character</th>
                <th style={{ padding: "1rem" }}>Position in list</th>
                <th style={{ padding: "1rem", color: "var(--accent-primary)" }}>Output</th>
                <th style={{ padding: "1rem" }}>New list front</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: "0.75rem 1rem" }}>C</td><td style={{ padding: "0.75rem 1rem" }}>3</td><td style={{ padding: "0.75rem 1rem", color: "var(--accent-primary)", fontWeight: 700 }}>3</td><td style={{ padding: "0.75rem 1rem" }}>[C $ A B ...]</td></tr>
              <tr style={{ backgroundColor: "#f8fafc" }}><td style={{ padding: "0.75rem 1rem" }}>$</td><td style={{ padding: "0.75rem 1rem" }}>2</td><td style={{ padding: "0.75rem 1rem", color: "var(--accent-primary)", fontWeight: 700 }}>2</td><td style={{ padding: "0.75rem 1rem" }}>[$ C A B ...]</td></tr>
              <tr><td style={{ padding: "0.75rem 1rem" }}>A</td><td style={{ padding: "0.75rem 1rem" }}>2</td><td style={{ padding: "0.75rem 1rem", color: "var(--accent-primary)", fontWeight: 700 }}>2</td><td style={{ padding: "0.75rem 1rem" }}>[A $ C B ...]</td></tr>
              <tr style={{ backgroundColor: "#f8fafc" }}><td style={{ padding: "0.75rem 1rem" }}>A</td><td style={{ padding: "0.75rem 1rem" }}>0</td><td style={{ padding: "0.75rem 1rem", color: "var(--accent-primary)", fontWeight: 700 }}>0</td><td style={{ padding: "0.75rem 1rem" }}>[A $ C B ...]</td></tr>
              <tr><td style={{ padding: "0.75rem 1rem" }}>A</td><td style={{ padding: "0.75rem 1rem" }}>0</td><td style={{ padding: "0.75rem 1rem", color: "var(--accent-primary)", fontWeight: 700 }}>0</td><td style={{ padding: "0.75rem 1rem" }}>[A $ C B ...]</td></tr>
              <tr style={{ backgroundColor: "#f8fafc" }}><td style={{ padding: "0.75rem 1rem" }}>B</td><td style={{ padding: "0.75rem 1rem" }}>3</td><td style={{ padding: "0.75rem 1rem", color: "var(--accent-primary)", fontWeight: 700 }}>3</td><td style={{ padding: "0.75rem 1rem" }}>[B A $ C ...]</td></tr>
              <tr><td style={{ padding: "0.75rem 1rem" }}>B</td><td style={{ padding: "0.75rem 1rem" }}>0</td><td style={{ padding: "0.75rem 1rem", color: "var(--accent-primary)", fontWeight: 700 }}>0</td><td style={{ padding: "0.75rem 1rem" }}>[B A $ C ...]</td></tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "rgba(59,130,246,0.1)", borderRadius: "8px" }}>
          <div style={{ color: "#3b82f6", marginBottom: "0.5rem", fontFamily: "var(--font-dm-mono)", fontWeight: 700 }}>MTF output → [3, 2, 2, 0, 0, 3, 0]</div>
          <div style={{ color: "#0f172a", fontSize: "0.95rem", lineHeight: 1.6 }}>
            <strong>What happened?</strong> After BWT clustered the A's together, MTF converted those clusters into runs of zeros. Notice three A's became 2, 0, 0 — the first A costs a 2, every repeat after that is a 0. The more repetition BWT creates, the more zeros MTF produces.
          </div>
        </div>
      </section>

      {/* Step 4 */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Step 4: RLE (Run-Length Encoding)
        </h2>
        <div className="clinical-card" style={{ padding: "1.5rem", fontFamily: "var(--font-dm-mono)" }}>
          <div style={{ color: "#64748b", marginBottom: "1rem" }}>Input: [3, 2, 2, 0, 0, 3, 0]</div>
          <div style={{ marginBottom: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ color: "#0f172a" }}>3<br/>2<br/>2<br/>0, 0<br/>3<br/>0</div>
            <div style={{ color: "var(--accent-primary)" }}>→ [3]<br/>→ [2]<br/>→ [2]<br/>→ [ZERO_RUN, 2]<br/>→ [3]<br/>→ [ZERO_RUN, 1]</div>
          </div>
          <div style={{ fontWeight: 700, padding: "0.75rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
            RLE output → [3, 2, 2, ZERO_RUN, 2, 3, ZERO_RUN, 1]
          </div>
        </div>
        <div style={{ marginTop: "1rem", color: "#475569", lineHeight: 1.7 }}>
          8 tokens. Doesn't look impressive on 6 bytes — but on a 10,000 character repetitive sequence, a run of 5,000 zeros collapses to just <code>[ZERO_RUN, 5000]</code>. That's where the massive compression happens.
        </div>
      </section>

      {/* Step 5 */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Step 5: Huffman Coding
        </h2>
        <div className="clinical-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", fontFamily: "var(--font-dm-mono)", marginBottom: "2rem" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#334155", marginBottom: "0.75rem" }}>Frequencies</div>
              <div>ZERO_RUN → 2 times</div>
              <div>2 → 2 times</div>
              <div>3 → 2 times</div>
              <div>count_2 → 1 time</div>
              <div>count_1 → 1 time</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#334155", marginBottom: "0.75rem" }}>Huffman Tree Codes</div>
              <div>ZERO_RUN → 10 <span style={{ color: "#64748b" }}>(2 bits)</span></div>
              <div>2 → 11 <span style={{ color: "#64748b" }}>(2 bits)</span></div>
              <div>3 → 00 <span style={{ color: "#64748b" }}>(2 bits)</span></div>
              <div>count_2 → 010 <span style={{ color: "#64748b" }}>(3 bits)</span></div>
              <div>count_1 → 011 <span style={{ color: "#64748b" }}>(3 bits)</span></div>
            </div>
          </div>
          <div style={{ backgroundColor: "#1e293b", padding: "1.5rem", borderRadius: "8px", color: "#e2e8f0", fontFamily: "var(--font-dm-mono)" }}>
            <div style={{ color: "#94a3b8", marginBottom: "0.5rem" }}>Encoded bitstring:</div>
            <div style={{ marginBottom: "0.5rem" }}>[3]=00, [2]=11, [2]=11, [ZERO_RUN]=10, [2]=010, [3]=00, [ZERO_RUN]=10, [1]=011</div>
            <div style={{ color: "#38bdf8", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>→ 00 11 11 10 010 00 10 011</div>
            <div style={{ color: "#10b981", fontWeight: 700 }}>→ 19 bits = ~3 bytes</div>
          </div>
          <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
            Original: 6 bytes → Final: ~3 bytes = <span style={{ color: "var(--accent-primary)" }}>2x compression</span>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Why it gets much better on real data
        </h2>
        <div style={{ padding: "1.5rem", backgroundColor: "rgba(245,158,11,0.1)", borderRadius: "12px", border: "1px solid rgba(245,158,11,0.2)" }}>
          <p style={{ color: "#0f172a", lineHeight: 1.7, marginBottom: "1rem" }}>
            On "AAABBC" you get 2x. On 10,000 characters of repetitive biological text like:
          </p>
          <div style={{ fontFamily: "var(--font-dm-mono)", color: "#b45309", wordBreak: "break-all", marginBottom: "1rem", fontWeight: 700 }}>
            ATGATGATGATGATGATGATGATGATGATGATGATGATG...
          </div>
          <p style={{ color: "#0f172a", lineHeight: 1.7, margin: 0 }}>
            BWT clusters thousands of identical characters together → MTF produces thousands of consecutive zeros → RLE collapses all of them into a handful of <code>[ZERO_RUN, count]</code> pairs → Huffman encodes those efficiently.
            <br/><br/>
            <strong>That's how you get 3x–5x on repetitive sequences</strong>, and why pre-compressed data like PDFs stay stuck at 1.3x.
          </p>
        </div>
      </section>

      {/* Step 6: Binary to DNA & Encryption */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", marginTop: "4rem", paddingTop: "2rem", borderTop: "2px dashed #e2e8f0" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b" }}>
            <Lock size={20} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Part 2: Encryption Pipeline
          </h2>
        </div>

        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Step 6: DNA Mapping & LCG Mutation
        </h3>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          First, the 18 compressed bits are mapped directly to DNA nucleotides (00=A, 01=T, 10=C, 11=G). Then, a seeded LCG applies biological mutations (substitutions and indels) to encrypt the sequence.
        </p>

        <div className="clinical-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", fontFamily: "var(--font-dm-mono)" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#64748b", marginBottom: "0.5rem", fontSize: "0.9rem", textTransform: "uppercase" }}>1. Binary to DNA Mapping</div>
              <div style={{ color: "#0f172a" }}>00 11 11 10 01 00 01 00 11</div>
              <div style={{ color: "var(--accent-primary)", fontWeight: 700, fontSize: "1.2rem", marginTop: "0.25rem" }}>A  G  G  C  T  A  T  A  G</div>
            </div>

            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }}>
              <div style={{ fontWeight: 700, color: "#64748b", marginBottom: "0.5rem", fontSize: "0.9rem", textTransform: "uppercase" }}>2. LCG Mutation Cipher (Key = "SECRET")</div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ color: "#0f172a" }}>Original:</span>
                <span style={{ letterSpacing: "2px" }}>AGG<span style={{ color: "#3b82f6", fontWeight: 800 }}>C</span>TATAG</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem" }}>
                <span style={{ color: "#0f172a" }}>Mutated: </span>
                <span style={{ letterSpacing: "2px" }}>AGG<span style={{ color: "#ef4444", fontWeight: 800 }}>A</span>TA<span style={{ color: "#ef4444", fontWeight: 800 }}>C</span>TAG</span>
              </div>
            </div>
            
            <div style={{ backgroundColor: "#fef2f2", padding: "1rem", borderRadius: "8px", border: "1px solid #fecaca" }}>
              <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: "0.25rem" }}>Biological Noise Applied:</div>
              <div style={{ color: "#7f1d1d", fontSize: "0.95rem" }}>• Substitution at Pos 4: <strong>C → A</strong></div>
              <div style={{ color: "#7f1d1d", fontSize: "0.95rem" }}>• Insertion at Pos 7: <strong>+C</strong></div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 7: Recovery Engine */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", marginTop: "4rem", paddingTop: "2rem", borderTop: "2px dashed #e2e8f0" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
            <Activity size={20} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Part 3: Recovery Pipeline
          </h2>
        </div>

        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Step 7: Needleman-Wunsch Alignment
        </h3>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          To decrypt the data, the corrupted sequence must be aligned against the original (using stored redundant reference fragments). A dynamic programming matrix calculates the optimal edit distance to reverse the mutations.
        </p>

        <div className="clinical-card" style={{ padding: "1.5rem" }}>
          <div style={{ fontFamily: "var(--font-dm-mono)" }}>
            <div style={{ fontWeight: 700, color: "#334155", marginBottom: "1rem" }}>Optimal Alignment Path Found:</div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", backgroundColor: "#f8fafc", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <span style={{ width: "100px", color: "#64748b" }}>Reference:</span>
                <span style={{ letterSpacing: "4px", fontWeight: 700, color: "#0f172a" }}>A G G <span style={{ color: "#10b981" }}>C</span> T A <span style={{ color: "#10b981" }}>-</span> T A G</span>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <span style={{ width: "100px", color: "#64748b" }}>Match:</span>
                <span style={{ letterSpacing: "4px", fontWeight: 700, color: "#94a3b8" }}>| | | <span style={{ color: "#ef4444" }}>x</span> | | <span style={{ color: "#ef4444" }}>+</span> | | |</span>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <span style={{ width: "100px", color: "#64748b" }}>Corrupted:</span>
                <span style={{ letterSpacing: "4px", fontWeight: 700, color: "#0f172a" }}>A G G <span style={{ color: "#ef4444" }}>A</span> T A <span style={{ color: "#ef4444" }}>C</span> T A G</span>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
              <div style={{ padding: "1rem", backgroundColor: "rgba(59,130,246,0.1)", borderRadius: "8px", border: "1px solid rgba(59,130,246,0.2)" }}>
                <div style={{ color: "#3b82f6", fontWeight: 700, marginBottom: "0.5rem" }}>Corrections Applied:</div>
                <div style={{ color: "#1e3a8a", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  1. Mismatch detected: Reverted mutated <strong>A</strong> back to original <strong>C</strong>.<br/>
                  2. Gap detected in reference: Discarded the inserted <strong>C</strong> from corrupted strand.
                </div>
              </div>
              
              <div style={{ padding: "1rem", backgroundColor: "rgba(16,185,129,0.1)", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.2)" }}>
                <div style={{ color: "#10b981", fontWeight: 700, marginBottom: "0.25rem" }}>Perfect Sequence Restored:</div>
                <div style={{ color: "#065f46", fontSize: "1.2rem", fontWeight: 800, letterSpacing: "2px" }}>AGGCTATAG</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 8 & 9: Analysis Pipeline */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", marginTop: "4rem", paddingTop: "2rem", borderTop: "2px dashed #e2e8f0" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ec4899" }}>
            <Activity size={20} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Part 4: Data Analysis Pipeline
          </h2>
        </div>

        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Step 8: KMP Pattern Search
        </h3>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          Before decrypting, BioCrypt-X allows users to scan massive corrupted DNA databases for specific patterns or signatures. The Knuth-Morris-Pratt (KMP) algorithm achieves this in blazing fast O(N + M) time without ever backtracking.
        </p>
        <div className="clinical-card" style={{ padding: "1.5rem", marginBottom: "3rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", fontFamily: "var(--font-dm-mono)" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#64748b", marginBottom: "0.5rem", fontSize: "0.9rem", textTransform: "uppercase" }}>Search Target</div>
              <div style={{ color: "#0f172a", marginBottom: "0.5rem" }}>Pattern: <span style={{ color: "var(--accent-primary)", fontWeight: 700 }}>ATA</span></div>
              <div style={{ color: "#64748b", fontSize: "0.9rem" }}>LPS Array (Longest Prefix Suffix): [0, 0, 1]</div>
            </div>
            
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }}>
              <div style={{ fontWeight: 700, color: "#64748b", marginBottom: "0.5rem", fontSize: "0.9rem", textTransform: "uppercase" }}>Scanning Sequence</div>
              <div style={{ letterSpacing: "4px", fontWeight: 700, color: "#0f172a", marginBottom: "1rem", overflowX: "auto", whiteSpace: "nowrap" }}>
                A G G <span style={{ backgroundColor: "rgba(236,72,153,0.1)", color: "#ec4899", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>A T A</span> C T A G
              </div>
              <div style={{ color: "#ec4899", fontWeight: 700 }}>
                Match found at index 3 in O(N) time!
              </div>
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Step 9: LCS / Edit Distance (Entropy Analysis)
        </h3>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          To measure data corruption severity and biological entropy, the system calculates the Longest Common Subsequence (LCS) and Levenshtein Edit Distance.
        </p>
        <div className="clinical-card" style={{ padding: "1.5rem", fontFamily: "var(--font-dm-mono)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#334155", marginBottom: "0.75rem" }}>Sequences</div>
              <div style={{ color: "#64748b", marginBottom: "0.25rem" }}>Original: AGGCTATAG</div>
              <div style={{ color: "#64748b", marginBottom: "1rem" }}>Corrupted: AGGATACTAG</div>
              <div style={{ fontWeight: 700, color: "#10b981", padding: "0.5rem", backgroundColor: "rgba(16,185,129,0.1)", borderRadius: "6px" }}>
                LCS: AGG TATAG (Length: 8)
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#334155", marginBottom: "0.75rem" }}>Edit Distance: 2</div>
              <div style={{ color: "#ef4444", fontSize: "0.9rem", lineHeight: 1.6 }}>
                - 1 Substitution (Pos 4: C → A)<br/>
                - 1 Insertion (Pos 7: +C)<br/>
              </div>
              <div style={{ marginTop: "1rem", color: "#3b82f6", fontWeight: 700 }}>
                Corruption Severity: 22.2%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 5: Detailed Inverse Pipeline */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", marginTop: "4rem", paddingTop: "2rem", borderTop: "2px dashed #e2e8f0" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
            <Database size={20} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Part 5: Inverse Pipeline
          </h2>
        </div>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "2rem" }}>
          Now that the DNA is flawless, it is mapped back to binary (<code>AGGCTATAG → 001111100100010011</code>). From there, it flows entirely backward through the lossless compression algorithms step-by-step to perfectly reconstruct the original text.
        </p>

        {/* Step 10: Inverse Huffman */}
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Step 10: Inverse Huffman
        </h3>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          The decoder walks the Huffman tree bit-by-bit to recover the original tokens.
        </p>
        <div className="clinical-card" style={{ padding: "1.5rem", marginBottom: "3rem", fontFamily: "var(--font-dm-mono)" }}>
          <div style={{ color: "#64748b", marginBottom: "1rem" }}>Input Bitstring: 00 11 11 10 010 00 10 011</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <div style={{ color: "var(--accent-primary)", fontWeight: 700 }}>00</div>
              <div style={{ color: "var(--accent-primary)", fontWeight: 700 }}>11</div>
              <div style={{ color: "var(--accent-primary)", fontWeight: 700 }}>11</div>
              <div style={{ color: "var(--accent-primary)", fontWeight: 700 }}>10</div>
              <div style={{ color: "var(--accent-primary)", fontWeight: 700 }}>010</div>
              <div style={{ color: "var(--accent-primary)", fontWeight: 700 }}>00</div>
              <div style={{ color: "var(--accent-primary)", fontWeight: 700 }}>10</div>
              <div style={{ color: "var(--accent-primary)", fontWeight: 700 }}>011</div>
            </div>
            <div>
              <div style={{ color: "#0f172a" }}>→ 3</div>
              <div style={{ color: "#0f172a" }}>→ 2</div>
              <div style={{ color: "#0f172a" }}>→ 2</div>
              <div style={{ color: "#0f172a" }}>→ ZERO_RUN</div>
              <div style={{ color: "#0f172a" }}>→ count: 2</div>
              <div style={{ color: "#0f172a" }}>→ 3</div>
              <div style={{ color: "#0f172a" }}>→ ZERO_RUN</div>
              <div style={{ color: "#0f172a" }}>→ count: 1</div>
            </div>
          </div>
          <div style={{ fontWeight: 700, padding: "0.75rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
            Decoded Tokens: [3, 2, 2, ZERO_RUN, 2, 3, ZERO_RUN, 1]
          </div>
        </div>

        {/* Step 11: Inverse RLE */}
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Step 11: Inverse RLE
        </h3>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          Any <code>ZERO_RUN</code> tokens are expanded based on the count that follows them.
        </p>
        <div className="clinical-card" style={{ padding: "1.5rem", marginBottom: "3rem", fontFamily: "var(--font-dm-mono)" }}>
          <div style={{ color: "#64748b", marginBottom: "1rem" }}>Input: [3, 2, 2, ZERO_RUN, 2, 3, ZERO_RUN, 1]</div>
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ color: "#ef4444" }}>[ZERO_RUN, 2]</span> expands to <span style={{ color: "#10b981", fontWeight: 700 }}>0, 0</span><br/>
            <span style={{ color: "#ef4444" }}>[ZERO_RUN, 1]</span> expands to <span style={{ color: "#10b981", fontWeight: 700 }}>0</span>
          </div>
          <div style={{ fontWeight: 700, padding: "0.75rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
            RLE Restored: [3, 2, 2, 0, 0, 3, 0]
          </div>
        </div>

        {/* Step 12: Inverse MTF */}
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Step 12: Inverse MTF
        </h3>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          Using the exact same starting alphabet list <code>[$ A B C ...]</code>, we reverse the Move-to-Front operations to recover the original characters.
        </p>
        <div className="clinical-card" style={{ overflowX: "auto", marginBottom: "3rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontFamily: "var(--font-dm-mono)" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                <th style={{ padding: "1rem" }}>Token (Index)</th>
                <th style={{ padding: "1rem" }}>Current Alphabet</th>
                <th style={{ padding: "1rem", color: "var(--accent-primary)" }}>Extracted Char</th>
                <th style={{ padding: "1rem" }}>New Alphabet</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: "0.75rem 1rem" }}>3</td><td style={{ padding: "0.75rem 1rem" }}>[$ A B C ...]</td><td style={{ padding: "0.75rem 1rem", color: "var(--accent-primary)", fontWeight: 700 }}>C</td><td style={{ padding: "0.75rem 1rem" }}>[C $ A B ...]</td></tr>
              <tr style={{ backgroundColor: "#f8fafc" }}><td style={{ padding: "0.75rem 1rem" }}>2</td><td style={{ padding: "0.75rem 1rem" }}>[C $ A B ...]</td><td style={{ padding: "0.75rem 1rem", color: "var(--accent-primary)", fontWeight: 700 }}>$</td><td style={{ padding: "0.75rem 1rem" }}>[$ C A B ...]</td></tr>
              <tr><td style={{ padding: "0.75rem 1rem" }}>2</td><td style={{ padding: "0.75rem 1rem" }}>[$ C A B ...]</td><td style={{ padding: "0.75rem 1rem", color: "var(--accent-primary)", fontWeight: 700 }}>A</td><td style={{ padding: "0.75rem 1rem" }}>[A $ C B ...]</td></tr>
              <tr style={{ backgroundColor: "#f8fafc" }}><td style={{ padding: "0.75rem 1rem" }}>0</td><td style={{ padding: "0.75rem 1rem" }}>[A $ C B ...]</td><td style={{ padding: "0.75rem 1rem", color: "var(--accent-primary)", fontWeight: 700 }}>A</td><td style={{ padding: "0.75rem 1rem" }}>[A $ C B ...]</td></tr>
              <tr><td style={{ padding: "0.75rem 1rem" }}>0</td><td style={{ padding: "0.75rem 1rem" }}>[A $ C B ...]</td><td style={{ padding: "0.75rem 1rem", color: "var(--accent-primary)", fontWeight: 700 }}>A</td><td style={{ padding: "0.75rem 1rem" }}>[A $ C B ...]</td></tr>
              <tr style={{ backgroundColor: "#f8fafc" }}><td style={{ padding: "0.75rem 1rem" }}>3</td><td style={{ padding: "0.75rem 1rem" }}>[A $ C B ...]</td><td style={{ padding: "0.75rem 1rem", color: "var(--accent-primary)", fontWeight: 700 }}>B</td><td style={{ padding: "0.75rem 1rem" }}>[B A $ C ...]</td></tr>
              <tr><td style={{ padding: "0.75rem 1rem" }}>0</td><td style={{ padding: "0.75rem 1rem" }}>[B A $ C ...]</td><td style={{ padding: "0.75rem 1rem", color: "var(--accent-primary)", fontWeight: 700 }}>B</td><td style={{ padding: "0.75rem 1rem" }}>[B A $ C ...]</td></tr>
            </tbody>
          </table>
          <div style={{ padding: "1rem", backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0", fontWeight: 700, fontFamily: "var(--font-dm-mono)" }}>
            BWT Last Column Restored: C$AAABB
          </div>
        </div>

        {/* Step 13: Inverse BWT (LF-Mapping) */}
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Step 13: Inverse BWT (LF-Mapping)
        </h3>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          The final piece is the LF-Mapping (Last-to-First mapping). By sorting the BWT Output (Last Column), we get the First Column. Tracing from Last → First allows us to rebuild the string backwards!
        </p>
        <div className="clinical-card" style={{ padding: "1.5rem", marginBottom: "3rem", fontFamily: "var(--font-dm-mono)" }}>
          <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem", overflowX: "auto" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "#334155", marginBottom: "0.5rem" }}>First Column (Sorted)</div>
              <div style={{ color: "#10b981", fontWeight: 800 }}>$</div>
              <div style={{ color: "#10b981", fontWeight: 800 }}>A<span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "4px", fontWeight: 500 }}>₁</span></div>
              <div style={{ color: "#10b981", fontWeight: 800 }}>A<span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "4px", fontWeight: 500 }}>₂</span></div>
              <div style={{ color: "#10b981", fontWeight: 800 }}>A<span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "4px", fontWeight: 500 }}>₃</span></div>
              <div style={{ color: "#10b981", fontWeight: 800 }}>B<span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "4px", fontWeight: 500 }}>₁</span></div>
              <div style={{ color: "#10b981", fontWeight: 800 }}>B<span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "4px", fontWeight: 500 }}>₂</span></div>
              <div style={{ color: "#10b981", fontWeight: 800 }}>C</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "#334155", marginBottom: "0.5rem" }}>Last Column (Input)</div>
              <div style={{ color: "#ef4444", fontWeight: 800 }}>C</div>
              <div style={{ color: "#ef4444", fontWeight: 800 }}>$</div>
              <div style={{ color: "#ef4444", fontWeight: 800 }}>A<span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "4px", fontWeight: 500 }}>₁</span></div>
              <div style={{ color: "#ef4444", fontWeight: 800 }}>A<span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "4px", fontWeight: 500 }}>₂</span></div>
              <div style={{ color: "#ef4444", fontWeight: 800 }}>A<span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "4px", fontWeight: 500 }}>₃</span></div>
              <div style={{ color: "#ef4444", fontWeight: 800 }}>B<span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "4px", fontWeight: 500 }}>₁</span></div>
              <div style={{ color: "#ef4444", fontWeight: 800 }}>B<span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "4px", fontWeight: 500 }}>₂</span></div>
            </div>
            <div style={{ flex: 2 }}>
              <div style={{ fontWeight: 700, color: "#334155", marginBottom: "0.5rem" }}>Traceback Path</div>
              <div style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: 1.6 }}>
                1. Start at First: <strong>$</strong> → Link is Last: <strong style={{ color: "#3b82f6" }}>C</strong><br/>
                2. Go to First: <strong>C</strong> → Link is Last: <strong style={{ color: "#3b82f6" }}>B₂</strong><br/>
                3. Go to First: <strong>B₂</strong> → Link is Last: <strong style={{ color: "#3b82f6" }}>B₁</strong><br/>
                4. Go to First: <strong>B₁</strong> → Link is Last: <strong style={{ color: "#3b82f6" }}>A₃</strong><br/>
                5. Go to First: <strong>A₃</strong> → Link is Last: <strong style={{ color: "#3b82f6" }}>A₂</strong><br/>
                6. Go to First: <strong>A₂</strong> → Link is Last: <strong style={{ color: "#3b82f6" }}>A₁</strong><br/>
                7. Go to First: <strong>A₁</strong> → Link is Last: <strong style={{ color: "#3b82f6" }}>$</strong>
              </div>
            </div>
          </div>
          <div style={{ padding: "1rem", backgroundColor: "rgba(59,130,246,0.1)", borderRadius: "8px", border: "1px solid rgba(59,130,246,0.2)" }}>
            <div style={{ color: "#1e3a8a", fontWeight: 700 }}>String Read Backwards: C → B → B → A → A → A → $</div>
            <div style={{ color: "#2563eb", fontWeight: 800, fontSize: "1.2rem", marginTop: "0.5rem" }}>Original Reconstructed: AAABBC$</div>
          </div>
        </div>

        {/* Step 14: Final Output */}
        <div style={{ backgroundColor: "#1e293b", padding: "2rem", borderRadius: "12px", border: "1px solid #334155", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f8fafc", margin: "0 0 1rem 0" }}>
            Final Data Extraction
          </h3>
          <p style={{ color: "#94a3b8", marginBottom: "1.5rem", fontSize: "1.1rem" }}>
            The EOF terminator (<code>$</code>) is stripped, and the original file is recovered with 0% data loss.
          </p>
          <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: "2rem", fontWeight: 800, color: "var(--accent-primary)", letterSpacing: "4px" }}>
            "AAABBC"
          </div>
        </div>
      </section>

    </div>
  );
}
