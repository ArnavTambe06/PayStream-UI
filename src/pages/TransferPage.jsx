import { useState, useEffect } from "react";
import api from "../api/axios";

const tabs = ["deposit", "withdraw", "transfer"];

export default function TransferPage() {
  const [wallets, setWallets] = useState([]);
  const [activeTab, setActiveTab] = useState("deposit");
  const [form, setForm] = useState({
    fromWalletId: "",
    toWalletId: "",
    amount: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/wallets").then((r) => {
      const ws = r.data.data;
      setWallets(ws);
      if (ws.length > 0) setForm((f) => ({ ...f, fromWalletId: ws[0].id }));
    });
  }, []);

  const genKey = () =>
    `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const fmt = (n) =>
    `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      let res;
      if (activeTab === "deposit") {
        res = await api.post("/api/transactions/deposit", {
          walletId: form.fromWalletId,
          amount: Number(form.amount),
          description: form.description,
          idempotencyKey: genKey(),
        });
      } else if (activeTab === "withdraw") {
        res = await api.post("/api/transactions/withdraw", {
          walletId: form.fromWalletId,
          amount: Number(form.amount),
          description: form.description,
          idempotencyKey: genKey(),
        });
      } else {
        if (form.fromWalletId === form.toWalletId) {
          setError("Source and destination must be different");
          setLoading(false);
          return;
        }
        res = await api.post("/api/transactions/transfer", {
          fromWalletId: form.fromWalletId,
          toWalletId: form.toWalletId,
          amount: Number(form.amount),
          description: form.description,
          idempotencyKey: genKey(),
        });
      }
      setResult(res.data.data);
      setForm((f) => ({ ...f, amount: "", description: "" }));
    } catch (err) {
      setError(err.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid var(--cream-dark)",
    borderRadius: "8px",
    background: "white",
    fontSize: "14px",
    color: "var(--ink)",
    outline: "none",
    transition: "border 0.15s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    color: "var(--ink-mid)",
    marginBottom: "6px",
    fontFamily: "DM Mono, monospace",
    fontWeight: "300",
    letterSpacing: "0.5px",
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            fontSize: "12px",
            color: "var(--ink-light)",
            fontFamily: "DM Mono, monospace",
            fontWeight: "300",
            letterSpacing: "0.5px",
            marginBottom: "6px",
          }}
        >
          MONEY MOVEMENT
        </div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "400",
            color: "var(--ink)",
            letterSpacing: "-0.3px",
          }}
        >
          Move Money
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "440px 1fr",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* Form */}
        <div
          style={{
            background: "white",
            border: "1px solid var(--cream-dark)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--cream-dark)",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setResult(null);
                  setError("");
                }}
                style={{
                  flex: 1,
                  padding: "14px",
                  border: "none",
                  background:
                    activeTab === tab ? "var(--slate)" : "transparent",
                  color: activeTab === tab ? "white" : "var(--ink-light)",
                  fontSize: "13px",
                  fontWeight: "400",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textTransform: "capitalize",
                  letterSpacing: "0.2px",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ padding: "24px" }}>
            <form onSubmit={handleSubmit}>
              {/* From wallet */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>
                  {activeTab === "transfer" ? "FROM WALLET" : "WALLET"}
                </label>
                <select
                  value={form.fromWalletId}
                  onChange={(e) =>
                    setForm({ ...form, fromWalletId: e.target.value })
                  }
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={(e) =>
                    (e.target.style.border = "1px solid var(--sage)")
                  }
                  onBlur={(e) =>
                    (e.target.style.border = "1px solid var(--cream-dark)")
                  }
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.accountType} — ₹
                      {Number(w.balance).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </option>
                  ))}
                </select>
              </div>

              {/* To wallet */}
              {activeTab === "transfer" && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>TO WALLET</label>
                  <select
                    value={form.toWalletId}
                    onChange={(e) =>
                      setForm({ ...form, toWalletId: e.target.value })
                    }
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) =>
                      (e.target.style.border = "1px solid var(--sage)")
                    }
                    onBlur={(e) =>
                      (e.target.style.border = "1px solid var(--cream-dark)")
                    }
                  >
                    <option value="">Select destination</option>
                    {wallets.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.accountType} — ₹
                        {Number(w.balance).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Amount */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>AMOUNT (₹)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                  min="1"
                  placeholder="0.00"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.border = "1px solid var(--sage)")
                  }
                  onBlur={(e) =>
                    (e.target.style.border = "1px solid var(--cream-dark)")
                  }
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>
                  DESCRIPTION <span style={{ opacity: 0.5 }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="What's this for?"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.border = "1px solid var(--sage)")
                  }
                  onBlur={(e) =>
                    (e.target.style.border = "1px solid var(--cream-dark)")
                  }
                />
              </div>

              {error && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "#FBEAEA",
                    border: "1px solid #F5C5C5",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#8B2B2B",
                    marginBottom: "16px",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: loading ? "var(--sage-pale)" : "var(--slate)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.15s",
                  textTransform: "capitalize",
                }}
              >
                {loading ? "Processing..." : `Confirm ${activeTab}`}
              </button>
            </form>
          </div>
        </div>

        {/* Result / Info panel */}
        <div>
          {result ? (
            <div
              style={{
                background: "#EBF5EE",
                border: "1px solid #C5E0CD",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#2E6B42",
                  fontWeight: "500",
                  marginBottom: "16px",
                }}
              >
                ✓ Transaction successful
              </div>
              {[
                ["Reference", result.referenceId],
                ["Type", result.type],
                ["Amount", fmt(result.amount)],
                ["Status", result.status],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid #C5E0CD",
                    fontSize: "13px",
                  }}
                >
                  <span
                    style={{
                      color: "#4A8060",
                      fontFamily: "DM Mono, monospace",
                      fontWeight: "300",
                      fontSize: "12px",
                    }}
                  >
                    {k}
                  </span>
                  <span
                    style={{
                      color: "#1C3A2A",
                      fontFamily: "DM Mono, monospace",
                      fontWeight: "300",
                      fontSize: "12px",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "white",
                border: "1px solid var(--cream-dark)",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--ink-light)",
                  fontFamily: "DM Mono, monospace",
                  letterSpacing: "0.6px",
                  marginBottom: "16px",
                }}
              >
                TRANSACTION LIMITS
              </div>
              {[
                ["Max deposit", "₹1,00,000"],
                ["Max withdrawal", "₹50,000"],
                ["Max transfer", "₹2,00,000"],
                ["Max per hour", "10 transactions"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--cream-mid)",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ color: "var(--ink-mid)" }}>{k}</span>
                  <span
                    style={{
                      color: "var(--ink)",
                      fontFamily: "DM Mono, monospace",
                      fontWeight: "300",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
