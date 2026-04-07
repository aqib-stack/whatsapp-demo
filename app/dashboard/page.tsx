"use client";

import { useEffect, useMemo, useState } from "react";

type DemoConnectionState = {
  status: "not_connected" | "connecting" | "connected";
  businessName: string;
  phoneNumber: string;
  wabaId: string;
  phoneNumberId?: string;
  connectedAt?: string;
};

type LogItem = {
  success?: boolean;
  title?: string;
  message?: string;
  phone?: string;
  messageId?: string;
  error?: unknown;
};

const STORAGE_KEY = "waDemoConnectionState";

const defaultConnectionState: DemoConnectionState = {
  status: "not_connected",
  businessName: "Meta onboarding demo not completed yet",
  phoneNumber: "Click Connect with Meta to simulate business onboarding",
  wabaId: "Pending demo connection",
};

const fakeBusiness = {
  businessName: "Connected via Meta Demo",
  phoneNumber: "+1 555 174 8540",
  wabaId: "1954907808733105",
  phoneNumberId: "1016211464917076",
};

export default function Dashboard() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [log, setLog] = useState<LogItem[]>([]);
  const [connectionState, setConnectionState] = useState<DemoConnectionState>(defaultConnectionState);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setConnectionState(JSON.parse(saved) as DemoConnectionState);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(connectionState));
  }, [connectionState]);

  const sendMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: phone }),
      });
      const data = await res.json();

      if (data?.success) {
        setLog((prev) => [
          {
            success: true,
            title: "Message sent successfully",
            message: data?.message || "Approved template message sent successfully.",
            phone,
            messageId: data?.data?.messages?.[0]?.id,
          },
          ...prev,
        ]);
      } else {
        setLog((prev) => [
          {
            success: false,
            title: "Message failed",
            error: data?.error || data,
          },
          ...prev,
        ]);
      }
    } catch (error) {
      setLog((prev) => [
        {
          success: false,
          title: "Message failed",
          error: String(error),
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startMetaConnect = () => {
    setMetaLoading(true);
    setShowDemoModal(true);
  };

  const completeDemoConnection = () => {
    const nextState: DemoConnectionState = {
      status: "connected",
      businessName: fakeBusiness.businessName,
      phoneNumber: fakeBusiness.phoneNumber,
      wabaId: fakeBusiness.wabaId,
      phoneNumberId: fakeBusiness.phoneNumberId,
      connectedAt: new Date().toLocaleString(),
    };

    setConnectionState(nextState);
    setMetaLoading(false);
    setShowDemoModal(false);
    setLog((prev) => [
      {
        success: true,
        title: "Meta connection completed",
        message: "Connect with Meta flow completed successfully.",
      },
      ...prev,
    ]);
  };

  const cancelDemoConnection = () => {
    setMetaLoading(false);
    setShowDemoModal(false);
    setLog((prev) => [
      {
        success: false,
        title: "Meta connection cancelled",
        message: "The demo Meta onboarding popup was closed before completion.",
      },
      ...prev,
    ]);
  };

  const resetDemoConnection = () => {
    setConnectionState(defaultConnectionState);
    window.localStorage.removeItem(STORAGE_KEY);
    setLog((prev) => [
      {
        success: true,
        title: "Connection reset",
        message: "Demo Meta connection was cleared so onboarding can be shown again.",
      },
      ...prev,
    ]);
  };

  const connectionBadge = useMemo(() => {
    if (connectionState.status === "connected") {
      return { label: "Connected", background: "#ecfdf5", color: "#047857" };
    }
    if (connectionState.status === "connecting") {
      return { label: "Connecting", background: "#eff6ff", color: "#1d4ed8" };
    }
    return { label: "Demo flow", background: "#f8fafc", color: "#475569" };
  }, [connectionState.status]);

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
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={startMetaConnect}
                disabled={metaLoading}
                style={{
                  background: "#0f172a",
                  color: "#fff",
                  padding: "14px 22px",
                  borderRadius: 16,
                  border: "none",
                  fontWeight: 700,
                  opacity: metaLoading ? 0.7 : 1,
                }}
              >
                {metaLoading ? "Opening Meta…" : "Connect with Meta"}
              </button>
                
            </div>
          </div>
          
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            ["Connected Accounts", "1", connectionState.status === "connected" ? "1 business connected in demo" : "Demo onboarding ready to show"],
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
              <span
                style={{
                  background: connectionBadge.background,
                  color: connectionBadge.color,
                  padding: "8px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {connectionBadge.label}
              </span>
            </div>

            <div style={{ marginTop: 18, border: "1px solid #e2e8f0", borderRadius: 20, padding: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{connectionState.businessName}</div>
              <div style={{ color: "#475569", marginTop: 6 }}>{connectionState.phoneNumber}</div>
              <div style={{ color: "#64748b", marginTop: 10, fontSize: 13 }}>
                {connectionState.wabaId.startsWith("Pending") ? connectionState.wabaId : `WABA ID: ${connectionState.wabaId}`}
              </div>
              {connectionState.phoneNumberId && (
                <div style={{ color: "#64748b", marginTop: 6, fontSize: 13 }}>
                  Phone Number ID: {connectionState.phoneNumberId}
                </div>
              )}
              {connectionState.connectedAt && (
                <div style={{ color: "#64748b", marginTop: 6, fontSize: 13 }}>
                  Connected at: {connectionState.connectedAt}
                </div>
              )}
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
              value="This demo sends the approved hello_world WhatsApp template."
              readOnly
              rows={5}
              style={{ width: "100%", padding: 14, borderRadius: 14, border: "1px solid #cbd5e1", marginBottom: 16, resize: "vertical", color: "#475569" }}
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
                  <div style={{ color: "#64748b" }}>No events yet. Connect Meta demo or send a test message.</div>
                ) : (
                  log.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        background: item.success ? "#eff6ff" : "#fef2f2",
                        border: `1px solid ${item.success ? "#bfdbfe" : "#fecaca"}`,
                        color: item.success ? "#1e3a8a" : "#991b1b",
                        padding: 16,
                        borderRadius: 16,
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
                        {item.success ? "✅" : "❌"} {item.title}
                      </div>
                      {item.message && <div style={{ marginBottom: 4 }}>{item.message}</div>}
                      {item.phone && <div style={{ marginBottom: 4 }}>To: {item.phone}</div>}
                      {item.messageId && <div style={{ fontSize: 13, opacity: 0.8 }}>Message ID: {item.messageId}</div>}
                      {item.error && (
                        <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: 13, overflowX: "auto" }}>
                          {JSON.stringify(item.error, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDemoModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            display: "grid",
            placeItems: "center",
            padding: 24,
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              background: "#fff",
              borderRadius: 28,
              border: "1px solid #e2e8f0",
              boxShadow: "0 30px 80px rgba(15,23,42,0.22)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: 24, borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b" }}>
                Meta Onboarding Demo
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8, color: "#0f172a" }}>
                Connect with Meta
              </div>
              <div style={{ color: "#475569", marginTop: 8, lineHeight: 1.5 }}>
                This simulates the SaaS onboarding flow where a business signs in with Meta and connects a WhatsApp Business account.
              </div>
            </div>

            <div style={{ padding: 24 }}>
              <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
                {[
                  "Meta login approved",
                  "WhatsApp business account selected",
                  "Business phone number linked",
                  "Connection saved in dashboard",
                ].map((step, index) => (
                  <div key={step} style={{ display: "flex", gap: 12, alignItems: "center", color: "#0f172a" }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        background: "#0f172a",
                        color: "#fff",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 13,
                        fontWeight: 800,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>{step}</div>
                  </div>
                ))}
              </div>

              
            </div>

            <div style={{ padding: 24, display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid #e2e8f0" }}>
              <button
                onClick={cancelDemoConnection}
                style={{ background: "#fff", border: "1px solid #cbd5e1", color: "#0f172a", padding: "12px 18px", borderRadius: 14, fontWeight: 700 }}
              >
                Cancel
              </button>
              <button
                onClick={completeDemoConnection}
                style={{ background: "#0f172a", border: "none", color: "#fff", padding: "12px 18px", borderRadius: 14, fontWeight: 700 }}
              >
                Complete Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
