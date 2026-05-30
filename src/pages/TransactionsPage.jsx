import { useState, useEffect } from "react";
import api from "../api/axios";
import TransactionTable from "../components/TransactionTable";

export default function TransactionsPage() {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/api/wallets").then((res) => {
      const ws = res.data.data;
      setWallets(ws);
      if (ws.length > 0) setSelectedWallet(ws[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedWallet) return;
    setLoading(true);
    api
      .get(`/api/transactions/wallet/${selectedWallet}?page=${page}&size=10`)
      .then((res) => {
        setTransactions(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedWallet, page]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xs text-gray-500 uppercase tracking-wider">
          Transactions
        </h2>
        <h1 className="text-2xl font-bold text-white mt-1">
          Transaction History
        </h1>
      </div>

      {/* Wallet selector */}
      <div className="flex gap-3">
        {wallets.map((w) => (
          <button
            key={w.id}
            onClick={() => {
              setSelectedWallet(w.id);
              setPage(0);
            }}
            className={`px-4 py-1.5 rounded text-sm border transition-colors ${
              selectedWallet === w.id
                ? "border-amber-500 text-amber-400 bg-amber-500/10"
                : "border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            {w.accountType}
            <span className="ml-2 text-xs opacity-60">
              ₹{Number(w.balance).toLocaleString("en-IN")}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-gray-600 text-sm">Loading...</div>
      ) : (
        <TransactionTable transactions={transactions} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 border border-gray-700 rounded text-gray-400 
                       hover:border-gray-500 disabled:opacity-30"
          >
            ← Prev
          </button>
          <span className="text-gray-500">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 border border-gray-700 rounded text-gray-400 
                       hover:border-gray-500 disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
