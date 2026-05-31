import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/auth/login", form);
      const { accessToken, email, role } = res.data.data;
      login({ email, role }, accessToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* Left — slate panel */}
      <div
        className="sidebar-noise"
        style={{
          width: "440px",
          background: "var(--slate)",
          display: "flex",
          flexDirection: "column",
          padding: "48px",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "var(--sage)",
            opacity: 0.06,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "-60px",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background: "var(--sage-light)",
            opacity: 0.05,
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "500",
              color: "white",
              letterSpacing: "-0.3px",
            }}
          >
            Pay<span style={{ color: "var(--sage-light)" }}>Stream</span>
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "var(--sage)",
              fontFamily: "DM Mono, monospace",
              letterSpacing: "2px",
              marginTop: "3px",
            }}
          >
            BANKING PLATFORM
          </div>
        </div>

        {/* Middle content */}
        <div style={{ margin: "auto 0", padding: "40px 0" }}>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "300",
              color: "white",
              lineHeight: 1.25,
              letterSpacing: "-0.5px",
              marginBottom: "16px",
            }}
          >
            Your finances,
            <br />
            <span style={{ color: "var(--sage-light)" }}>in one place.</span>
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "var(--sage-pale)",
              lineHeight: 1.75,
              opacity: 0.65,
              maxWidth: "300px",
            }}
          >
            Manage wallets, send money, and track every transaction with
            complete transparency and security.
          </p>
        </div>

        {/* Feature list */}
        <div
          style={{
            borderTop: "1px solid var(--slate-light)",
            paddingTop: "28px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {[
            { icon: "◆", text: "ACID transactions" },
            { icon: "◆", text: "Real-time transfers" },
            { icon: "◆", text: "Full audit trail" },
            { icon: "◆", text: "Role-based access" },
          ].map((f) => (
            <div
              key={f.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                color: "var(--sage-pale)",
                opacity: 0.6,
              }}
            >
              <span style={{ color: "var(--sage)", fontSize: "6px" }}>
                {f.icon}
              </span>
              {f.text}
            </div>
          ))}
        </div>
      </div>

      {/* Right — form panel */}
      <div
        className="page-grid"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
          background: "var(--cream)",
        }}
      >
        <div className="fade-up" style={{ width: "100%", maxWidth: "380px" }}>
          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: "400",
                color: "var(--ink)",
                letterSpacing: "-0.5px",
                marginBottom: "8px",
              }}
            >
              Welcome back
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "var(--ink-light)",
                lineHeight: 1.5,
              }}
            >
              Sign in to your PayStream account
            </p>
          </div>

          {/* Form card */}
          <div
            style={{
              background: "white",
              border: "1px solid var(--cream-dark)",
              borderRadius: "14px",
              padding: "32px",
              boxShadow: "0 2px 12px rgba(28,36,32,0.06)",
            }}
          >
            <form onSubmit={handleSubmit}>
              {[
                {
                  key: "email",
                  label: "Email address",
                  type: "email",
                  placeholder: "you@example.com",
                },
                {
                  key: "password",
                  label: "Password",
                  type: "password",
                  placeholder: "••••••••",
                },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key} style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "var(--ink-mid)",
                      marginBottom: "7px",
                    }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    className="input-field"
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    required
                    placeholder={placeholder}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      border: "1px solid var(--cream-dark)",
                      borderRadius: "8px",
                      background: "var(--cream)",
                      fontSize: "14px",
                      color: "var(--ink)",
                    }}
                  />
                </div>
              ))}

              {error && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "#FDF0F0",
                    border: "1px solid #F0D0D0",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#8B2B2B",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>⚠</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: loading ? "var(--ink-light)" : "var(--slate)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                  letterSpacing: "0.2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {loading && (
                  <span
                    className="pulse"
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--sage-light)",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                )}
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          <p
            style={{
              marginTop: "20px",
              fontSize: "13px",
              color: "var(--ink-light)",
              textAlign: "center",
            }}
          >
            No account?{" "}
            <Link
              to="/register"
              style={{
                color: "var(--sage)",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Create one →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
