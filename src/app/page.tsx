"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Dna,
  Lock,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  ChevronRight,
  Zap,
  Binary,
  Fingerprint,
  Activity,
  Github,
  FileText,
  Cpu,
  Layers,
  FlaskConical,
} from "lucide-react";

/* ──────────────────── Scroll-reveal hook ──────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ──────────────────── Animated Counter ──────────────────── */
function Counter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ──────────────────── Typing DNA animation ──────────────────── */
function TypingDNA() {
  const strand = "ATCGGCTAAGTCGATCGGATCGATCGGCTAAGTCGATCGGATCGATCG";
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (chars < strand.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 40);
      return () => clearTimeout(t);
    }
  }, [chars, strand.length]);

  const colorMap: Record<string, string> = {
    A: "#3b82f6",
    T: "#10b981",
    C: "#f59e0b",
    G: "#ef4444",
  };

  return (
    <div
      style={{
        fontFamily: "var(--font-dm-mono)",
        fontSize: "1.1rem",
        letterSpacing: "0.15em",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "2px",
        userSelect: "none",
      }}
    >
      {strand.slice(0, chars).split("").map((c, i) => (
        <span
          key={i}
          style={{
            color: colorMap[c] || "#64748b",
            fontWeight: 700,
            opacity: i === chars - 1 ? 0.6 : 1,
            transition: "opacity 0.3s",
          }}
        >
          {c}
        </span>
      ))}
      <span style={{ color: "var(--accent-primary)", animation: "blink 1s step-end infinite" }}>▎</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ════════════════════════════════════════════════════════════ */
export default function Home() {
  const hero = useReveal(0.1);
  const pipeline = useReveal(0.1);
  const features = useReveal(0.1);
  const algorithms = useReveal(0.1);
  const stats = useReveal(0.2);
  const cta = useReveal(0.2);

  const revealStyle = (v: boolean, delay = 0): React.CSSProperties => ({
    opacity: v ? 1 : 0,
    transform: v ? "translateY(0)" : "translateY(40px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

      {/* ═══ HERO ═══ */}
      <section
        ref={hero.ref}
        style={{
          textAlign: "center",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "5rem 1.5rem 3rem",
          ...revealStyle(hero.visible),
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 1rem",
            borderRadius: "9999px",
            backgroundColor: "rgba(245, 158, 11, 0.12)",
            color: "var(--accent-primary)",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "2rem",
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}
        >
          <FlaskConical size={14} /> DAA Project v1.0
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.25rem)",
            fontWeight: 800,
            lineHeight: 1.08,
            color: "#0f172a",
            marginBottom: "1.5rem",
            letterSpacing: "-0.035em",
            textShadow: "0 2px 20px rgba(255,255,255,0.9)",
          }}
        >
          DNA-Inspired{" "}
          <span
            style={{
              color: "var(--accent-primary)",
              textShadow: "0 2px 20px rgba(255,255,255,0.9)",
            }}
          >
            Self-Healing
          </span>
          <br />
          Encryption Engine
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            fontWeight: 400,
            color: "#475569",
            lineHeight: 1.7,
            maxWidth: "640px",
            margin: "0 auto 2.5rem",
            textShadow: "0 1px 8px rgba(255,255,255,0.7)",
          }}
        >
          A resilient storage engine that encodes data as DNA sequences,
          encrypts via biological mutations, and self-heals corruption using
          Needleman-Wunsch dynamic programming.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/encode"
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "1rem",
              padding: "0.85rem 2rem",
              borderRadius: "8px",
            }}
          >
            Enter Pipeline <ArrowRight size={16} />
          </Link>
          <a
            href="https://github.com/karthik5033/BioCrypt"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "1rem",
              padding: "0.85rem 2rem",
              borderRadius: "8px",
            }}
          >
            <Github size={16} /> View Repository
          </a>
        </div>

        {/* DNA typing animation */}
        <div
          style={{
            marginTop: "3rem",
            padding: "1.25rem 2rem",
            borderRadius: "12px",
            backgroundColor: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.5)",
            maxWidth: "640px",
            margin: "3rem auto 0",
          }}
        >
          <TypingDNA />
        </div>
      </section>

      {/* ═══ HOW IT WORKS — PIPELINE ═══ */}
      <section
        ref={pipeline.ref}
        style={{
          padding: "5rem 1.5rem",
          maxWidth: "1100px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3.5rem", ...revealStyle(pipeline.visible) }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-primary)" }}>
            How It Works
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: "#0f172a",
              marginTop: "0.5rem",
              textShadow: "0 2px 15px rgba(255,255,255,0.9)",
            }}
          >
            The BioCrypt Pipeline
          </h2>
          <p style={{ color: "#64748b", maxWidth: "560px", margin: "1rem auto 0", lineHeight: 1.6, textShadow: "0 1px 5px rgba(255,255,255,0.7)" }}>
            Data flows through four algorithmic stages — each grounded in DAA theory — from raw file to self-healing encrypted DNA.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            {
              step: "01",
              title: "Encode",
              desc: "Binary data is mapped to nucleotide bases (A, T, C, G) and compressed via Huffman coding.",
              icon: <Binary size={28} />,
              href: "/encode",
            },
            {
              step: "02",
              title: "Encrypt",
              desc: "Controlled mutations — substitutions and inversions — scramble the strand using a key-seeded cipher.",
              icon: <Lock size={28} />,
              href: "/encrypt",
            },
            {
              step: "03",
              title: "Recover",
              desc: "Needleman-Wunsch DP sequence alignment reconstructs corrupted segments character by character.",
              icon: <ShieldCheck size={28} />,
              href: "/recover",
            },
            {
              step: "04",
              title: "Analyze",
              desc: "Full complexity dashboard — space, time, entropy, and compression metrics across the pipeline.",
              icon: <BarChart3 size={28} />,
              href: "/analyze",
            },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              style={{
                textDecoration: "none",
                color: "inherit",
                ...revealStyle(pipeline.visible, 150 * i),
              }}
            >
              <div
                className="clinical-card"
                style={{
                  padding: "2rem 1.75rem",
                  height: "100%",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Step number watermark */}
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "12px",
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "5rem",
                    fontWeight: 800,
                    color: "rgba(245, 158, 11, 0.06)",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {item.step}
                </span>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.04))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                    color: "var(--accent-primary)",
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.5rem", color: "#0f172a" }}>
                  {item.title}
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.55 }}>
                  {item.desc}
                </p>
                <div
                  style={{
                    marginTop: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    color: "var(--accent-primary)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  Explore <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ KEY FEATURES — 3 COLUMNS ═══ */}
      <section
        ref={features.ref}
        style={{
          padding: "4rem 1.5rem 5rem",
          maxWidth: "1100px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3.5rem", ...revealStyle(features.visible) }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-primary)" }}>
            Core Technology
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: "#0f172a",
              marginTop: "0.5rem",
              textShadow: "0 2px 15px rgba(255,255,255,0.9)",
            }}
          >
            What Powers BioCrypt-X
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {[
            {
              icon: <Dna size={32} />,
              title: "Huffman DNA Encoding",
              desc: "Raw bytes are converted to quaternary DNA bases, then compressed with an optimal prefix-free Huffman tree — achieving up to 55% size reduction while preserving perfect reversibility.",
              tag: "Greedy Algorithm",
            },
            {
              icon: <Fingerprint size={32} />,
              title: "Mutation Cipher",
              desc: "A deterministic key-seeded LCG generates controlled substitutions and inversions across the strand. Every mutation is logged in a reversible map for perfect decryption.",
              tag: "String Algorithms",
            },
            {
              icon: <Cpu size={32} />,
              title: "Needleman-Wunsch Recovery",
              desc: "The crown jewel — a global sequence alignment DP table reconstructs corrupted characters by finding the optimal edit path between corrupted and reference fragments.",
              tag: "Dynamic Programming",
            },
          ].map((feat, i) => (
            <div
              key={i}
              className="clinical-card"
              style={{
                padding: "2.5rem 2rem",
                ...revealStyle(features.visible, 200 * i),
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                  color: "var(--accent-primary)",
                }}
              >
                {feat.icon}
              </div>
              <span
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--accent-primary)",
                  backgroundColor: "rgba(245,158,11,0.1)",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  display: "inline-block",
                }}
              >
                {feat.tag}
              </span>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem", color: "#0f172a" }}>
                {feat.title}
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.9375rem", lineHeight: 1.65 }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ALGORITHM CARDS ═══ */}
      <section
        ref={algorithms.ref}
        style={{
          padding: "4rem 1.5rem 5rem",
          maxWidth: "1100px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3.5rem", ...revealStyle(algorithms.visible) }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-primary)" }}>
            DAA Coverage
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: "#0f172a",
              marginTop: "0.5rem",
              textShadow: "0 2px 15px rgba(255,255,255,0.9)",
            }}
          >
            Algorithms Under the Hood
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {[
            { name: "Huffman Coding", complexity: "O(N log N)", type: "Greedy", icon: <Layers size={20} /> },
            { name: "Needleman-Wunsch", complexity: "O(N × M)", type: "DP", icon: <Activity size={20} /> },
            { name: "LCS / Edit Distance", complexity: "O(N × M)", type: "DP", icon: <FileText size={20} /> },
            { name: "KMP Pattern Search", complexity: "O(N + M)", type: "String", icon: <Zap size={20} /> },
            { name: "Trie Indexing", complexity: "O(L)", type: "Tree", icon: <Layers size={20} /> },
            { name: "LCG Mutation Seed", complexity: "O(1)", type: "Number Theory", icon: <Fingerprint size={20} /> },
          ].map((algo, i) => (
            <div
              key={i}
              className="clinical-card"
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                ...revealStyle(algorithms.visible, 100 * i),
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(245,158,11,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-primary)",
                  }}
                >
                  {algo.icon}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    backgroundColor: "#f1f5f9",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {algo.type}
                </span>
              </div>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>{algo.name}</h4>
              <span
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "var(--accent-primary)",
                }}
              >
                {algo.complexity}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section
        ref={stats.ref}
        style={{
          padding: "3rem 1.5rem",
          maxWidth: "1100px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          className="clinical-card"
          style={{
            padding: "3rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "2rem",
            textAlign: "center",
            ...revealStyle(stats.visible),
          }}
        >
          {[
            { value: 5, suffix: "+", label: "DAA Algorithms" },
            { value: 55, suffix: "%", label: "Compression Ratio" },
            { value: 100, suffix: "%", label: "Recovery Accuracy" },
            { value: 4, suffix: "", label: "Pipeline Stages" },
          ].map((stat, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
              <span
                style={{
                  fontSize: "2.75rem",
                  fontWeight: 800,
                  color: "var(--accent-primary)",
                  fontFamily: "var(--font-dm-mono)",
                  lineHeight: 1,
                }}
              >
                <Counter end={stat.value} suffix={stat.suffix} />
              </span>
              <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500, marginTop: "0.25rem" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ LIVE DEMO PREVIEW ═══ */}
      <section
        style={{
          padding: "4rem 1.5rem",
          maxWidth: "800px",
          margin: "0 auto",
          width: "100%",
          ...revealStyle(stats.visible, 200),
        }}
      >
        <div
          className="clinical-card"
          style={{ padding: "2.5rem", overflow: "hidden" }}
        >
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-primary)", marginBottom: "1rem", display: "block" }}>
            Live Recovery Preview
          </span>
          <div
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.95rem",
              lineHeight: 2.2,
              letterSpacing: "0.08em",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ color: "#94a3b8", fontSize: "0.7rem", minWidth: "80px", textTransform: "uppercase", fontWeight: 600 }}>Original</span>
              <span style={{ color: "#0f172a" }}>A T C G G C T A A G T</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ color: "#94a3b8", fontSize: "0.7rem", minWidth: "80px", textTransform: "uppercase", fontWeight: 600 }}>Corrupted</span>
              <span>
                {"A T C G".split("").map((c, i) => (
                  <span key={i} style={{ color: "#0f172a" }}>{c}</span>
                ))}
                <span style={{ color: "#ef4444", fontWeight: 800 }}> ? ? </span>
                {"T A A G T".split("").map((c, i) => (
                  <span key={i} style={{ color: "#0f172a" }}>{c}</span>
                ))}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ color: "#94a3b8", fontSize: "0.7rem", minWidth: "80px", textTransform: "uppercase", fontWeight: 600 }}>Recovered</span>
              <span>
                {"A T C G ".split("").map((c, i) => (
                  <span key={i} style={{ color: "#0f172a" }}>{c}</span>
                ))}
                <span
                  style={{
                    color: "var(--accent-primary)",
                    fontWeight: 800,
                    backgroundColor: "rgba(245,158,11,0.12)",
                    padding: "2px 4px",
                    borderRadius: "4px",
                  }}
                >
                  G C
                </span>
                {" T A A G T".split("").map((c, i) => (
                  <span key={i} style={{ color: "#0f172a" }}>{c}</span>
                ))}
                <span style={{ color: "#10b981", fontWeight: 800, marginLeft: "0.5rem" }}>✓</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section
        ref={cta.ref}
        style={{
          padding: "5rem 1.5rem 6rem",
          textAlign: "center",
          ...revealStyle(cta.visible),
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "1rem",
            textShadow: "0 2px 15px rgba(255,255,255,0.9)",
          }}
        >
          Ready to See It In Action?
        </h2>
        <p
          style={{
            color: "#64748b",
            maxWidth: "480px",
            margin: "0 auto 2rem",
            lineHeight: 1.6,
            textShadow: "0 1px 5px rgba(255,255,255,0.7)",
          }}
        >
          Upload a file, watch it transform into DNA, encrypt it with biological mutations, and recover it from corruption — all in real-time.
        </p>
        <Link
          href="/encode"
          className="btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.1rem",
            padding: "1rem 2.5rem",
            borderRadius: "10px",
          }}
        >
          Start the Pipeline <ArrowRight size={18} />
        </Link>
      </section>

      {/* Blink keyframe injected inline */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
