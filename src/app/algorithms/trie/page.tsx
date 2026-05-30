"use client";

import { useState } from "react";
import { Layers, Play } from "lucide-react";

export default function TriePage() {
  const [sequences, setSequences] = useState<string[]>(["ATC", "ATG", "CGC"]);
  const [newSeq, setNewSeq] = useState("");
  const [searchSeq, setSearchSeq] = useState("");
  const [searchResult, setSearchResult] = useState<boolean | null>(null);

  const addSequence = () => {
    if (newSeq && !sequences.includes(newSeq.toUpperCase())) {
      setSequences([...sequences, newSeq.toUpperCase()]);
    }
    setNewSeq("");
  };

  const simulateSearch = () => {
    if (!searchSeq) return;
    const isFound = sequences.some(s => s.startsWith(searchSeq.toUpperCase()) || searchSeq.toUpperCase().startsWith(s));
    // Simplified simulation for UI purposes. A real Trie checks character by character.
    setSearchResult(sequences.includes(searchSeq.toUpperCase()));
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
            Tree Data Structure
          </span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem" }}>
            Trie Indexing
          </h1>
        </div>
      </div>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          The Algorithm
        </h2>
        <div style={{ backgroundColor: "#1e293b", padding: "1.5rem", borderRadius: "12px", color: "#e2e8f0", fontFamily: "var(--font-dm-mono)", fontSize: "0.9rem", lineHeight: 1.6, overflowX: "auto" }}>
          <pre style={{ margin: 0 }}>
{`1. Initialize an empty root node.
2. Insertion:
     For each character in the string:
       If the child node doesn't exist, create it.
       Move to the child node.
     Mark the last node as 'isEndOfWord'.
3. Search:
     For each character in the string:
       If the child node doesn't exist, return false.
       Move to the child node.
     Return true if the last node is marked 'isEndOfWord'.`}
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          How it Works
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1rem" }}>
          A Trie (or Prefix Tree) is a tree-like data structure used to store a dynamic set of strings. Each node represents a character, and the path from the root to a node represents a prefix of a string. This structure is highly efficient for prefix matching and autocomplete tasks, allowing searches in O(L) time where L is the length of the string.
        </p>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Why BioCrypt Uses It
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.7 }}>
          When managing a vast library of DNA keys or short motif sequences, BioCrypt uses Trie Indexing to instantly verify if a sequence exists or to match prefixes. Instead of scanning an entire database of strings (which could take O(N*L)), the Trie allows BioCrypt to index and retrieve sequences in time proportional only to the sequence length.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>
          Simulation
        </h2>
        <div className="clinical-card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#64748b", marginBottom: "0.5rem" }}>Insert Sequence</h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={newSeq}
                  onChange={(e) => setNewSeq(e.target.value.toUpperCase())}
                  placeholder="e.g. TTA"
                  style={{ flex: 1, padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", textTransform: "uppercase" }}
                />
                <button
                  onClick={addSequence}
                  className="btn-secondary"
                  style={{ padding: "0.6rem 1rem", borderRadius: "8px", fontWeight: 600 }}
                >
                  Insert
                </button>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#64748b", marginBottom: "0.5rem" }}>Search Sequence</h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={searchSeq}
                  onChange={(e) => setSearchSeq(e.target.value.toUpperCase())}
                  placeholder="Search in Trie"
                  style={{ flex: 1, padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", textTransform: "uppercase" }}
                />
                <button
                  onClick={simulateSearch}
                  className="btn-primary"
                  style={{ padding: "0.6rem 1rem", borderRadius: "8px", fontWeight: 600 }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#334155", marginBottom: "0.75rem" }}>Stored Sequences (Trie Paths)</h3>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {sequences.map((seq, i) => (
                <span key={i} style={{ padding: "0.4rem 0.8rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", fontFamily: "var(--font-dm-mono)", fontWeight: 600, color: "#475569" }}>
                  {seq}
                </span>
              ))}
            </div>
          </div>

          {searchResult !== null && (
            <div style={{ padding: "1rem", borderRadius: "8px", backgroundColor: searchResult ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: searchResult ? "#047857" : "#b91c1c", fontWeight: 600 }}>
              {searchResult ? `Sequence "${searchSeq.toUpperCase()}" found in Trie.` : `Sequence "${searchSeq.toUpperCase()}" NOT found.`}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
