export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 900, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 40 }}>
        <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b", margin: 0 }}>
          WhatsApp Business API Demo
        </p>
        <h1 style={{ fontSize: 42, lineHeight: 1.1, marginTop: 16, marginBottom: 12 }}>
          Connect, send, and manage WhatsApp messages
        </h1>
        <p style={{ fontSize: 18, color: "#475569", maxWidth: 700, marginBottom: 28 }}>
          Simple demo starter for showing your client a working WhatsApp dashboard flow.
        </p>
        <a
          href="/dashboard"
          style={{
            display: "inline-block",
            background: "#0f172a",
            color: "#fff",
            padding: "14px 22px",
            borderRadius: 16,
            fontWeight: 700,
          }}
        >
          Open Dashboard
        </a>
      </div>
    </main>
  );
}
