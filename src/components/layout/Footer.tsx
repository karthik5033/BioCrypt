export default function Footer() {
  return (
    <footer style={{
      padding: "1.5rem",
      borderTop: "1px solid var(--border-light)",
      textAlign: "center",
      backgroundColor: "var(--background)",
    }}>
      <p style={{
        fontSize: "0.75rem",
        color: "var(--text-muted)",
        fontFamily: "var(--font-dm-sans)",
        letterSpacing: "0.025em"
      }}>
        DAA Project | DNA-Inspired Encryption Engine
      </p>
    </footer>
  );
}
