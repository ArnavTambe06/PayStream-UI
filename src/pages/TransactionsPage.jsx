import { useState, useEffect } from "react";
import api from "../api/axios";
import TransactionTable from "../components/TransactionTable";

export default function TransactionsPage() {
  const [wallets, setWallets] = useState([]);
  const [selected, setSelected] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/api/wallets").then((r) => {
      const ws = r.data.data;
      setWallets(ws);
      if (ws.length > 0) setSelected(ws[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    api
      .get(`/api/transactions/wallet/${selected}?page=${page}&size=10`)
      .then((r) => {
        setTransactions(r.data.data.content || []);
        setTotalPages(r.data.data.totalPages || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selected, page]);

  const fmt = (n) =>
    `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

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
          TRANSACTIONS
        </div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "400",
            color: "var(--ink)",
            letterSpacing: "-0.3px",
          }}
        >
          Transaction History
        </h1>
      </div>

      {/* Wallet tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {wallets.map((w) => (
          <button
            key={w.id}
            onClick={() => {
              setSelected(w.id);
              setPage(0);
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid",
              borderColor:
                selected === w.id ? "var(--sage)" : "var(--cream-dark)",
              background: selected === w.id ? "var(--slate)" : "white",
              color: selected === w.id ? "white" : "var(--ink-mid)",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {w.accountType}
            <span
              style={{
                marginLeft: "8px",
                fontFamily: "DM Mono, monospace",
                fontSize: "12px",
                fontWeight: "300",
                opacity: 0.7,
              }}
            >
              {fmt(w.balance)}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div
          style={{
            padding: "48px 0",
            textAlign: "center",
            color: "var(--ink-light)",
            fontSize: "14px",
          }}
        >
          Loading...
        </div>
      ) : (
        <TransactionTable transactions={transactions} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              padding: "7px 14px",
              border: "1px solid var(--cream-dark)",
              borderRadius: "6px",
              background: "white",
              color: page === 0 ? "var(--ink-light)" : "var(--ink)",
              fontSize: "13px",
              cursor: page === 0 ? "not-allowed" : "pointer",
              opacity: page === 0 ? 0.4 : 1,
            }}
          >
            ← Prev
          </button>
          <span
            style={{
              fontSize: "13px",
              color: "var(--ink-light)",
              fontFamily: "DM Mono, monospace",
              fontWeight: "300",
            }}
          >
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            style={{
              padding: "7px 14px",
              border: "1px solid var(--cream-dark)",
              borderRadius: "6px",
              background: "white",
              color: page >= totalPages - 1 ? "var(--ink-light)" : "var(--ink)",
              fontSize: "13px",
              cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
              opacity: page >= totalPages - 1 ? 0.4 : 1,
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
