import { useState, useEffect } from "react";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import StatCard from "../components/StatCard";
import TransactionTable from "../components/TransactionTable";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const wr = await api.get("/api/wallets");
        const ws = wr.data.data;
        setWallets(ws);
        if (ws.length > 0) {
          setSelectedWallet(ws[0]);
          const tr = await api.get(
            `/api/transactions/wallet/${ws[0].id}?page=0&size=5`,
          );
          setTransactions(tr.data.data.content || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalBalance = wallets.reduce((s, w) => s + Number(w.balance), 0);
  const fmt = (n) =>
    `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

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

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
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
          OVERVIEW
        </div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "400",
            color: "var(--ink)",
            letterSpacing: "-0.3px",
          }}
        >
          Good day, {user?.email?.split("@")[0]}
        </h1>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          label="Total Balance"
          value={fmt(totalBalance)}
          sub="Across all wallets"
          accent
        />
        <StatCard
          label="Active Wallets"
          value={wallets.length}
          sub={wallets.map((w) => w.accountType).join(" · ")}
        />
        <StatCard
          label="Recent Activity"
          value={transactions.length}
          sub="Last 5 transactions"
        />
      </div>

      {/* Wallet cards */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            fontSize: "11px",
            color: "var(--ink-light)",
            fontFamily: "DM Mono, monospace",
            letterSpacing: "0.6px",
            marginBottom: "12px",
          }}
        >
          WALLETS
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}
        >
          {wallets.map((w) => (
            <div
              key={w.id}
              onClick={async () => {
                setSelectedWallet(w);
                const tr = await api.get(
                  `/api/transactions/wallet/${w.id}?page=0&size=5`,
                );
                setTransactions(tr.data.data.content || []);
              }}
              style={{
                background:
                  selectedWallet?.id === w.id ? "var(--slate)" : "white",
                border: `1px solid ${selectedWallet?.id === w.id ? "var(--slate)" : "var(--cream-dark)"}`,
                borderRadius: "10px",
                padding: "20px 22px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "DM Mono, monospace",
                  fontWeight: "300",
                  letterSpacing: "0.6px",
                  color:
                    selectedWallet?.id === w.id
                      ? "var(--sage)"
                      : "var(--ink-light)",
                  marginBottom: "10px",
                }}
              >
                {w.accountType} ACCOUNT
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "300",
                  fontFamily: "DM Mono, monospace",
                  color: selectedWallet?.id === w.id ? "white" : "var(--ink)",
                  letterSpacing: "-0.5px",
                  marginBottom: "6px",
                }}
              >
                {fmt(w.balance)}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "DM Mono, monospace",
                  fontWeight: "300",
                  color:
                    selectedWallet?.id === w.id
                      ? "var(--sage-light)"
                      : "var(--ink-light)",
                }}
              >
                {w.id.substring(0, 16)}…
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "var(--ink-light)",
              fontFamily: "DM Mono, monospace",
              letterSpacing: "0.6px",
            }}
          >
            RECENT TRANSACTIONS
            {selectedWallet && (
              <span style={{ color: "var(--sage)", marginLeft: "8px" }}>
                · {selectedWallet.accountType}
              </span>
            )}
          </div>
        </div>
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}
