import Link from "next/link";
import { Dna, Lock, FileDigit, BarChart3, Fingerprint } from "lucide-react";

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1rem 2rem",
      backgroundColor: "rgba(15, 23, 42, 0.7)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Fingerprint color="var(--accent-primary)" size={24} />
        <Link href="/" style={{
          fontFamily: "var(--font-dm-mono)",
          color: "var(--accent-primary)",
          fontWeight: 600,
          fontSize: "1.25rem",
          letterSpacing: "-0.025em"
        }}>
          BioCrypt-X
        </Link>
      </div>

      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {[
          { name: "Encode", path: "/encode", icon: <FileDigit size={16} /> },
          { name: "Encrypt", path: "/encrypt", icon: <Lock size={16} /> },
          { name: "Recover", path: "/recover", icon: <Dna size={16} /> },
          { name: "Analyze", path: "/analyze", icon: <BarChart3 size={16} /> },
        ].map((link) => (
          <Link 
            key={link.name} 
            href={link.path}
            className="nav-link"
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
