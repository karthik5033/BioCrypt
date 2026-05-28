import Link from "next/link";
import { ShieldAlert, Dna, Activity, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "4rem", padding: "2rem 0" }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.25rem 0.75rem",
          borderRadius: "9999px",
          backgroundColor: "rgba(13, 148, 136, 0.1)",
          color: "var(--accent-teal)",
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "2rem"
        }}>
          <Activity size={14} /> DAA Project v1.0
        </div>
        
        <h1 style={{
          fontSize: "3.75rem",
          fontWeight: 800,
          lineHeight: 1.1,
          color: "#0f172a",
          marginBottom: "1.5rem",
          letterSpacing: "-0.03em",
          textShadow: "0px 2px 15px rgba(255, 255, 255, 0.9)"
        }}>
          DNA-Inspired <br />
          <span style={{ color: "var(--accent-teal)", textShadow: "0px 2px 15px rgba(255, 255, 255, 0.9)" }}>Self-Healing</span> Encryption
        </h1>
        
        <p style={{
          fontSize: "1.25rem",
          fontWeight: 500,
          color: "#334155",
          lineHeight: 1.6,
          marginBottom: "3rem",
          maxWidth: "600px",
          margin: "0 auto 3rem auto",
          textShadow: "0px 1px 5px rgba(255, 255, 255, 0.8)"
        }}>
          A resilient storage engine that models data corruption and recovery using sequence alignment algorithms from computational biology.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link href="/encode" className="btn-primary" style={{ display: "inline-block", fontSize: "1rem" }}>
            Enter Pipeline
          </Link>
          <a href="https://github.com/karthik5033/BioCrypt" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            View Repository
          </a>
        </div>
      </section>

      {/* Abstract DNA/Data Graphic (CSS Only) */}
      <div className="slide-up delay-100" style={{ 
        position: "relative", 
        height: "120px", 
        width: "100%", 
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.6
      }}>
        <div style={{
          fontFamily: "var(--font-dm-mono)",
          color: "var(--border-light)",
          fontSize: "1.5rem",
          letterSpacing: "0.5rem",
          whiteSpace: "nowrap",
          userSelect: "none",
          maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)"
        }}>
          ATCG GCTA TAGC CGAT ATCG GCTA TAGC CGAT ATCG GCTA
        </div>
        <div style={{
          position: "absolute",
          fontFamily: "var(--font-dm-mono)",
          color: "var(--accent-teal)",
          fontSize: "1.5rem",
          letterSpacing: "0.5rem",
          whiteSpace: "nowrap",
          userSelect: "none",
          clipPath: "inset(0 60% 0 30%)", // Expose only a part
        }}>
          ATCG GCTA TAGC CGAT ATCG GCTA TAGC CGAT ATCG GCTA
        </div>
      </div>

      {/* Features Grid */}
      <section className="slide-up delay-200" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "2rem",
        maxWidth: "1000px",
        margin: "0 auto",
        width: "100%"
      }}>
        {[
          {
            title: "Huffman DNA Encoding",
            desc: "Convert binary data to nucleotide sequences (A, T, C, G) and compress optimally.",
            icon: <Dna size={24} color="var(--accent-teal)" />
          },
          {
            title: "Mutation Cipher",
            desc: "Encrypt strands using biologically-inspired, reversible key-seeded mutations.",
            icon: <Lock size={24} color="var(--accent-teal)" />
          },
          {
            title: "Needleman-Wunsch Recovery",
            desc: "Reconstruct corrupted segments via dynamic programming sequence alignment.",
            icon: <ShieldAlert size={24} color="var(--accent-teal)" />
          }
        ].map((feature, i) => (
          <div key={i} className="clinical-card" style={{ padding: "2rem", textAlign: "left" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "8px",
              backgroundColor: "rgba(13, 148, 136, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem"
            }}>
              {feature.icon}
            </div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem" }}>
              {feature.title}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: 1.5 }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </section>

    </div>
  );
}
