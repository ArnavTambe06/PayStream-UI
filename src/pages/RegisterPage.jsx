import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuthStore from "../store/authStore";

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/auth/register", form);
      const { accessToken, email, role } = res.data.data;
      login({ email, role }, accessToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: "fullName",
      label: "FULL NAME",
      type: "text",
      placeholder: "Arnav Tambe",
    },
    {
      key: "email",
      label: "EMAIL",
      type: "email",
      placeholder: "you@example.com",
    },
    {
      key: "password",
      label: "PASSWORD",
      type: "password",
      placeholder: "Min 8 characters",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--cream)",
        display: "flex",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "var(--slate)",
          display: "flex",
          flexDirection: "column",
          padding: "48px",
          flexShrink: 0,
        }}
      >
        <div style={{ marginBottom: "auto" }}>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "500",
              color: "white",
              marginBottom: "4px",
            }}
          >
            Pay<span style={{ color: "var(--sage-light)" }}>Stream</span>
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--sage)",
              fontFamily: "DM Mono, monospace",
              letterSpacing: "1px",
            }}
          >
            BANKING PLATFORM
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "300",
              color: "white",
              marginBottom: "12px",
              lineHeight: 1.2,
            }}
          >
            Get started
            <br />
            in seconds.
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "var(--sage-pale)",
              lineHeight: 1.7,
              opacity: 0.7,
            }}
          >
            A savings wallet is created automatically on signup.
          </p>
        </div>
        <div style={{ marginTop: "auto" }} />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "360px" }}>
          <div style={{ marginBottom: "36px" }}>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: "500",
                color: "var(--ink)",
                marginBottom: "6px",
              }}
            >
              Create account
            </h1>
            <p style={{ fontSize: "14px", color: "var(--ink-light)" }}>
              Free to use — no card required
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key} style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "var(--ink-mid)",
                    marginBottom: "6px",
                    fontFamily: "DM Mono, monospace",
                    fontWeight: "300",
                    letterSpacing: "0.5px",
                  }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                  placeholder={placeholder}
                  minLength={key === "password" ? 8 : undefined}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: "1px solid var(--cream-dark)",
                    borderRadius: "8px",
                    background: "white",
                    fontSize: "14px",
                    color: "var(--ink)",
                    outline: "none",
                    transition: "border 0.15s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.border = "1px solid var(--sage)")
                  }
                  onBlur={(e) =>
                    (e.target.style.border = "1px solid var(--cream-dark)")
                  }
                />
              </div>
            ))}

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
              }}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p
            style={{
              marginTop: "24px",
              fontSize: "13px",
              color: "var(--ink-light)",
              textAlign: "center",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "var(--sage)",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
