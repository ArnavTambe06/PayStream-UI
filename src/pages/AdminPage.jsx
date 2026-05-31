import { useState, useEffect } from "react";
import api from "../api/axios";
import StatCard from "../components/StatCard";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/admin/dashboard"),
      api.get("/api/admin/users?page=0&size=20"),
      api.get("/api/admin/audit-logs?page=0&size=20"),
    ])
      .then(([s, u, l]) => {
        setStats(s.data.data);
        setUsers(u.data.data.content || []);
        setLogs(l.data.data.content || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (user) => {
    try {
      const action = user.isActive ? "deactivate" : "reactivate";
      await api.patch(`/api/admin/users/${user.id}/${action}`);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isActive: !u.isActive } : u,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const fmt = (n) =>
    `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          color: "var(--ink-light)",
          fontSize: "14px",
        }}
      >
        Loading...
      </div>
    );

  const tabs = ["overview", "users", "audit logs"];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <div>
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
            CONTROL CENTER
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "400",
              color: "var(--ink)",
              letterSpacing: "-0.3px",
            }}
          >
            Admin Panel
          </h1>
        </div>
        <span
          style={{
            padding: "6px 14px",
            background: "var(--slate)",
            color: "var(--sage-light)",
            borderRadius: "6px",
            fontSize: "11px",
            fontFamily: "DM Mono, monospace",
            letterSpacing: "0.8px",
          }}
        >
          ADMIN ACCESS
        </span>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0",
          borderBottom: "1px solid var(--cream-dark)",
          marginBottom: "28px",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "10px 18px",
              border: "none",
              background: "transparent",
              color: tab === t ? "var(--ink)" : "var(--ink-light)",
              fontSize: "13px",
              cursor: "pointer",
              borderBottom: `2px solid ${tab === t ? "var(--sage)" : "transparent"}`,
              marginBottom: "-1px",
              fontWeight: tab === t ? "500" : "400",
              textTransform: "capitalize",
              transition: "all 0.15s",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
          }}
        >
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            sub="Registered accounts"
            accent
          />
          <StatCard
            label="Active Users"
            value={stats.activeUsers}
            sub="Currently active"
          />
          <StatCard
            label="Total Wallets"
            value={stats.totalWallets}
            sub="Across all users"
          />
          <StatCard
            label="Total Transactions"
            value={stats.totalTransactions}
            sub="All time"
          />
          <StatCard
            label="Successful Payments"
            value={stats.successfulPayments}
            sub="Via payment gateway"
          />
          <StatCard
            label="Failed Payments"
            value={stats.failedPayments}
            sub="Gateway failures"
          />
          <div style={{ gridColumn: "span 3" }}>
            <StatCard
              label="Volume Processed"
              value={fmt(stats.totalVolumeProcessed)}
              sub="Successful transactions only"
              accent
            />
          </div>
        </div>
      )}

      {/* Users */}
      {tab === "users" && (
        <div
          style={{
            background: "white",
            border: "1px solid var(--cream-dark)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "var(--cream)",
                  borderBottom: "1px solid var(--cream-dark)",
                }}
              >
                {["Name", "Email", "Role", "Wallets", "Status", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "11px",
                        fontWeight: "400",
                        color: "var(--ink-light)",
                        letterSpacing: "0.6px",
                        fontFamily: "DM Mono, monospace",
                      }}
                    >
                      {h.toUpperCase()}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom:
                      i < users.length - 1
                        ? "1px solid var(--cream-mid)"
                        : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: "13px",
                      fontWeight: "400",
                      color: "var(--ink)",
                    }}
                  >
                    {u.fullName}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: "12px",
                      color: "var(--ink-mid)",
                      fontFamily: "DM Mono, monospace",
                      fontWeight: "300",
                    }}
                  >
                    {u.email}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontFamily: "DM Mono, monospace",
                        background:
                          u.role === "ADMIN" ? "#F5F0E0" : "var(--cream)",
                        color:
                          u.role === "ADMIN" ? "#7A5210" : "var(--ink-mid)",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: "13px",
                      color: "var(--ink-mid)",
                      fontFamily: "DM Mono, monospace",
                      fontWeight: "300",
                    }}
                  >
                    {u.walletCount}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontFamily: "DM Mono, monospace",
                        background: u.isActive ? "#EBF5EE" : "#FBEAEA",
                        color: u.isActive ? "#2E6B42" : "#8B2B2B",
                      }}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {u.role !== "ADMIN" && (
                      <button
                        onClick={() => toggle(u)}
                        style={{
                          padding: "5px 12px",
                          border: `1px solid ${u.isActive ? "#F5C5C5" : "#C5E0CD"}`,
                          borderRadius: "6px",
                          background: "transparent",
                          color: u.isActive ? "#8B2B2B" : "#2E6B42",
                          fontSize: "12px",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {u.isActive ? "Deactivate" : "Reactivate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Audit Logs */}
      {tab === "audit logs" && (
        <div
          style={{
            background: "white",
            border: "1px solid var(--cream-dark)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "var(--cream)",
                  borderBottom: "1px solid var(--cream-dark)",
                }}
              >
                {["User", "Action", "Entity", "Details", "Time"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: "400",
                      color: "var(--ink-light)",
                      letterSpacing: "0.6px",
                      fontFamily: "DM Mono, monospace",
                    }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr
                  key={log.id}
                  style={{
                    borderBottom:
                      i < logs.length - 1
                        ? "1px solid var(--cream-mid)"
                        : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      color: "var(--ink-mid)",
                      fontFamily: "DM Mono, monospace",
                      fontWeight: "300",
                    }}
                  >
                    {log.userEmail}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        background: "var(--cream)",
                        color: "var(--sage)",
                        fontFamily: "DM Mono, monospace",
                        fontWeight: "400",
                      }}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      color: "var(--ink-light)",
                      fontFamily: "DM Mono, monospace",
                      fontWeight: "300",
                    }}
                  >
                    {log.entityType}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      color: "var(--ink-light)",
                      maxWidth: "260px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {log.details}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      color: "var(--ink-light)",
                      fontFamily: "DM Mono, monospace",
                      fontWeight: "300",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(log.createdAt).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
