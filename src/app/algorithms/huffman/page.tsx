"use client";

import { useState } from "react";
import { Layers, Play } from "lucide-react";

export default function HuffmanPage() {
  const [inputText, setInputText] = useState("HELLO");
  const [frequencies, setFrequencies] = useState<{ char: string; freq: number }[]>([]);
  const [encoded, setEncoded] = useState("");

  const simulateHuffman = () => {
    if (!inputText) return;
    const freqs: Record<string, number> = {};
    for (const char of inputText) {
      freqs[char] = (freqs[char] || 0) + 1;
    }
    const freqArray = Object.entries(freqs).map(([char, freq]) => ({ char, freq }));
    freqArray.sort((a, b) => b.freq - a.freq);
    setFrequencies(freqArray);

    // Simplistic mock encoding for demonstration
    const mockMap: Record<string, string> = {};
    freqArray.forEach((item, index) => {
      mockMap[item.char] = index === 0 ? "0" : "1".repeat(index) + "0";
    });
    
    const encodedStr = inputText.split("").map((c) => mockMap[c]).join(" ");
    setEncoded(encodedStr);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "4rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "rgba(245,158,11,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-primary)",
          }}
        >
          <Layers size={28} />
        </div>
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-primary)" }}>
            Greedy Algorithm
          </span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem" }}>
            Huffman Coding
          </h1>
        </div>
      </div>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          The Algorithm
        </h2>
        <div style={{ backgroundColor: "#1e293b", padding: "1.5rem", borderRadius: "12px", color: "#e2e8f0", fontFamily: "var(--font-dm-mono)", fontSize: "0.9rem", lineHeight: 1.6, overflowX: "auto" }}>
          <pre style={{ margin: 0 }}>
{`1. Calculate frequency of each character in data
2. Create a leaf node for each character
3. Build a Min-Heap of all leaf nodes
4. While more than one node in heap:
     a. Extract two nodes with minimum frequency
     b. Create a new internal node with freq = sum of two nodes
     c. Make first extracted node as left child (0)
     d. Make second extracted node as right child (1)
     e. Insert new node into the Min-Heap
5. Root node of heap is the root of Huffman Tree`}
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          How it Works
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          Huffman coding assigns variable-length binary codes to characters based on their frequencies. Characters that appear more frequently are assigned shorter codes, while less frequent characters receive longer codes. This prefix-free property ensures that no code is a prefix of another, making the decoding process unambiguous.
        </p>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Why BioCrypt Uses It
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7 }}>
          In the encoding stage of the BioCrypt pipeline, Huffman Coding is used to heavily compress the binary representation of data before it is mapped to DNA nucleotides (A, T, C, G). This reduces the final sequence length, saving storage space and improving the efficiency of downstream encryption and sequence alignment algorithms, while maintaining perfect lossless reversibility.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Simulation
        </h2>
        <div className="clinical-card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to encode..."
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "1rem",
                outline: "none",
              }}
            />
            <button
              onClick={simulateHuffman}
              className="btn-primary"
              style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}
            >
              <Play size={16} /> Simulate
            </button>
          </div>

          {frequencies.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#334155", marginBottom: "1rem" }}>Frequencies</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {frequencies.map((f, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem", backgroundColor: "#f8fafc", borderRadius: "6px" }}>
                      <span style={{ fontWeight: 600 }}>'{f.char}'</span>
                      <span style={{ color: "#64748b" }}>{f.freq}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#334155", marginBottom: "1rem" }}>Encoded Output</h3>
                <div style={{ padding: "1rem", backgroundColor: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "8px", fontFamily: "var(--font-dm-mono)", color: "var(--accent-primary)", wordBreak: "break-all", lineHeight: 1.6 }}>
                  {encoded}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
