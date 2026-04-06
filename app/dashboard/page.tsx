"use client";

import { useState } from "react";

type LogItem = {
  success?: boolean;
  message?: string;
  sentTo?: string;
  data?: {
    messages?: Array<{ id?: string }>;
  };
  error?: unknown;
};

export default function Dashboard() {
  const [phone, setPhone] = useState("+923058427519");
  const [message] = useState("This demo sends the approved hello_world WhatsApp template.");
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<LogItem[]>([]);

  const sendMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: phone }),
      });
      const data = await res.json();
      setLog((prev) => [data, ...prev]);
    } catch (error) {
      setLog((prev) => [{ success: false, error: String(error) }, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 28, padding: 32, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b", margin: 0 }}>
                WhatsApp Demo Dashboard
              </p>
              <h1 style={{ fontSize: 36, margin: "10px 0 8px" }}>Send and manage business messages</h1>
              <p style={{ color: "#475569", margin: 0 }}>
                Demo UI for Meta app connection, sending approved WhatsApp template messages, and viewing activity.
              </p>
            </div>
            <button
              style={{
                background: "#0f172a",
                color: "#fff",
                padding: "14px 22px",
                borderRadius: 16,
                border: "none",
                fontWeight: 700,
              }}
            >
              Connect with Meta
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            ["Connected Accounts", "1", "1 Meta-connected business"],
            ["Messages Sent Today", "Live", "Approved template demo"],
            ["Webhook Status", "Ready", "Can be extended next"],
          ].map(([title, value, note]) => (
            <div key={title} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24 }}>
              <div style={{ color: "#64748b", fontWeight: 700, fontSize: 14 }}>{title}</div>
              <div style={{ fontSize: 36, fontWeight: 800, marginTop: 10 }}>{value}</div>
              <div style={{ color: "#475569", marginTop: 8 }}>{note}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24 }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <h2 style={{ margin: 0 }}>Connected Business Number</h2>
              <span style={{ background: "#ecfdf5", color: "#047857", padding: "8px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                Connected
              </span>
            </div>

            <div style={{ marginTop: 18, border: "1px solid #e2e8f0", borderRadius: 20, padding: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>WhatsApp Business Connected</div>
              <div style={{ color: "#475569", marginTop: 6 }}>+1 555 174 8540</div>
              <div style={{ color: "#64748b", marginTop: 10, fontSize: 13 }}>WABA ID: 1954907808733105</div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24 }}>
            <h2 style={{ marginTop: 0 }}>Send Test Message</h2>

            <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>Customer Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+923001234567"
              style={{ width: "100%", padding: 14, borderRadius: 14, border: "1px solid #cbd5e1", marginBottom: 16 }}
            />

            <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>Message Type</label>
            <textarea
              value={message}
              readOnly
              rows={4}
              style={{ width: "100%", padding: 14, borderRadius: 14, border: "1px solid #cbd5e1", marginBottom: 16, resize: "vertical", background: "#f8fafc", color: "#475569" }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                background: "#0f172a",
                color: "#fff",
                padding: "14px 20px",
                borderRadius: 16,
                border: "none",
                fontWeight: 700,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Sending..." : "Send WhatsApp Message"}
            </button>

            <div style={{ marginTop: 24 }}>
              <h3>Activity Log</h3>
              <div style={{ display: "grid", gap: 12 }}>
                {log.length === 0 ? (
                  <div style={{ color: "#64748b" }}>No events yet. Send a test message.</div>
                ) : (
                  log.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        background: item.success ? "#eff6ff" : "#fef2f2",
                        border: `1px solid ${item.success ? "#bfdbfe" : "#fecaca"}`,
                        color: "#0f172a",
                        padding: 16,
                        borderRadius: 16,
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>
                        {item.success ? "✅ Message sent successfully" : "❌ Message failed"}
                      </div>
                      {item.message ? <div style={{ marginBottom: 6 }}>{item.message}</div> : null}
                      {item.sentTo ? <div style={{ color: "#475569", marginBottom: 6 }}>To: {item.sentTo}</div> : null}
                      {item.data?.messages?.[0]?.id ? (
                        <div style={{ color: "#64748b", fontSize: 13, wordBreak: "break-all" }}>
                          Message ID: {item.data.messages[0].id}
                        </div>
                      ) : null}
                      {!item.success && item.error ? (
                        <pre style={{ whiteSpace: "pre-wrap", margin: "8px 0 0", fontSize: 13 }}>
                          {JSON.stringify(item.error, null, 2)}
                        </pre>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
