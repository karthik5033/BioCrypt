import Link from "next/link";
import { Dna, Lock, FileDigit, BarChart3, Fingerprint } from "lucide-react";

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 2rem",
      height: "64px",
      borderBottom: "1px solid var(--border-light)",
      backgroundColor: "var(--background)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Fingerprint color="var(--accent-teal)" size={24} />
        <Link href="/" style={{
          fontFamily: "var(--font-dm-mono)",
          color: "var(--accent-teal)",
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
