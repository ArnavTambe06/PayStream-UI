import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const nav = [
  { to: "/dashboard", label: "Overview", icon: "▣" },
  { to: "/transactions", label: "Transactions", icon: "⇅" },
  { to: "/transfer", label: "Move Money", icon: "→" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const now = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{ display: "flex", height: "100vh", background: "var(--cream)" }}
    >
      <aside
        className="sidebar-noise"
        style={{
          width: "230px",
          background: "var(--slate)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative top-right glow */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "var(--sage)",
            opacity: 0.06,
            pointerEvents: "none",
          }}
        />

        {/* Logo + status */}
        <div
          style={{
            padding: "28px 24px 22px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              fontSize: "18px",
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
              letterSpacing: "1.5px",
              marginTop: "3px",
            }}
          >
            BANKING PLATFORM
          </div>
          {/* Live status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "14px",
            }}
          >
            <span
              className="pulse"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--sage-light)",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                color: "var(--sage)",
                fontFamily: "DM Mono, monospace",
                fontWeight: "300",
              }}
            >
              LIVE · {now}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          <div
            style={{
              fontSize: "10px",
              color: "var(--sage)",
              letterSpacing: "1.2px",
              padding: "0 12px",
              marginBottom: "8px",
              fontFamily: "DM Mono, monospace",
              opacity: 0.7,
            }}
          >
            NAVIGATION
          </div>
          {nav.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                marginBottom: "2px",
                fontSize: "13.5px",
                fontWeight: "400",
                textDecoration: "none",
                transition: "all 0.15s",
                background: isActive ? "rgba(92,122,107,0.15)" : "transparent",
                color: isActive ? "white" : "var(--sage-pale)",
                borderLeft: isActive
                  ? "2px solid var(--sage-light)"
                  : "2px solid transparent",
                paddingLeft: isActive ? "10px" : "12px",
              })}
            >
              <span
                style={{
                  fontSize: "13px",
                  opacity: 0.8,
                  width: "16px",
                  textAlign: "center",
                }}
              >
                {icon}
              </span>
              {label}
            </NavLink>
          ))}

          {user?.role === "ADMIN" && (
            <>
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--sage)",
                  letterSpacing: "1.2px",
                  padding: "0 12px",
                  margin: "20px 0 8px",
                  fontFamily: "DM Mono, monospace",
                  opacity: 0.7,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  paddingTop: "16px",
                }}
              >
                SYSTEM
              </div>
              <NavLink
                to="/admin"
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "13.5px",
                  textDecoration: "none",
                  transition: "all 0.15s",
                  background: isActive
                    ? "rgba(92,122,107,0.15)"
                    : "transparent",
                  color: isActive ? "white" : "var(--sage-pale)",
                  borderLeft: isActive
                    ? "2px solid var(--sage-light)"
                    : "2px solid transparent",
                  paddingLeft: isActive ? "10px" : "12px",
                })}
              >
                <span
                  style={{
                    fontSize: "13px",
                    opacity: 0.8,
                    width: "16px",
                    textAlign: "center",
                  }}
                >
                  ⚙
                </span>
                Control Center
              </NavLink>
            </>
          )}
        </nav>

        {/* User footer */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, var(--sage), var(--slate-light))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "500",
                color: "white",
                flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "white",
                  fontWeight: "400",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.email?.split("@")[0]}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--sage)",
                  fontFamily: "DM Mono, monospace",
                  letterSpacing: "0.5px",
                  marginTop: "1px",
                }}
              >
                {user?.role}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={{
              width: "100%",
              padding: "8px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "7px",
              color: "var(--sage-pale)",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.15s",
              letterSpacing: "0.2px",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.06)";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "var(--sage-pale)";
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main
        className="page-grid"
        style={{ flex: 1, overflow: "auto", background: "var(--cream)" }}
      >
        <div
          className="fade-up"
          style={{ maxWidth: "1100px", margin: "0 auto", padding: "44px 52px" }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
