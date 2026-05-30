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
    const fetchData = async () => {
      try {
        const walletRes = await api.get("/api/wallets");
        const ws = walletRes.data.data;
        setWallets(ws);
        if (ws.length > 0) {
          setSelectedWallet(ws[0]);
          const txnRes = await api.get(
            `/api/transactions/wallet/${ws[0].id}?page=0&size=5`,
          );
          setTransactions(txnRes.data.data.content || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xs text-gray-500 uppercase tracking-wider">
          Dashboard
        </h2>
        <h1 className="text-2xl font-bold text-white mt-1">
          Welcome back, {user?.email?.split("@")[0]}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total Balance"
          value={`₹${totalBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          sub="Across all wallets"
        />
        <StatCard
          label="Wallets"
          value={wallets.length}
          sub={wallets.map((w) => w.accountType).join(" · ")}
        />
        <StatCard
          label="Recent Transactions"
          value={transactions.length}
          sub="Last 5 transactions"
        />
      </div>

      {/* Wallet cards */}
      <div>
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Your Wallets
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              onClick={() => setSelectedWallet(wallet)}
              className={`border rounded-lg p-5 cursor-pointer transition-colors ${
                selectedWallet?.id === wallet.id
                  ? "border-amber-500/50 bg-amber-500/5"
                  : "border-gray-800 hover:border-gray-600"
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">
                {wallet.accountType}
              </div>
              <div className="text-xl font-bold text-white">
                ₹
                {Number(wallet.balance).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div className="text-xs text-gray-600 mt-1 font-mono">
                {wallet.id.substring(0, 8)}...
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div>
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Recent Transactions
          {selectedWallet && (
            <span className="ml-2 text-amber-500 normal-case">
              · {selectedWallet.accountType} wallet
            </span>
          )}
        </h3>
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}
