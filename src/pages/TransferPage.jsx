import { useState, useEffect } from "react";
import api from "../api/axios";

export default function TransferPage() {
  const [wallets, setWallets] = useState([]);
  const [form, setForm] = useState({
    fromWalletId: "",
    toWalletId: "",
    amount: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("transfer"); // transfer | deposit | withdraw

  useEffect(() => {
    api.get("/api/wallets").then((res) => {
      const ws = res.data.data;
      setWallets(ws);
      if (ws.length > 0) setForm((f) => ({ ...f, fromWalletId: ws[0].id }));
    });
  }, []);

  const generateKey = () =>
    `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const handleDeposit = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.post("/api/transactions/deposit", {
        walletId: form.fromWalletId,
        amount: Number(form.amount),
        description: form.description,
        idempotencyKey: generateKey(),
      });
      setResult({
        type: "success",
        message: "Deposit successful!",
        data: res.data.data,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.post("/api/transactions/withdraw", {
        walletId: form.fromWalletId,
        amount: Number(form.amount),
        description: form.description,
        idempotencyKey: generateKey(),
      });
      setResult({
        type: "success",
        message: "Withdrawal successful!",
        data: res.data.data,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (form.fromWalletId === form.toWalletId) {
      setError("Source and destination wallets must be different");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.post("/api/transactions/transfer", {
        fromWalletId: form.fromWalletId,
        toWalletId: form.toWalletId,
        amount: Number(form.amount),
        description: form.description,
        idempotencyKey: generateKey(),
      });
      setResult({
        type: "success",
        message: "Transfer successful!",
        data: res.data.data,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "deposit") handleDeposit();
    if (activeTab === "withdraw") handleWithdraw();
    if (activeTab === "transfer") handleTransfer();
  };

  const tabs = [
    { id: "deposit", label: "Deposit" },
    { id: "withdraw", label: "Withdraw" },
    { id: "transfer", label: "Transfer" },
  ];

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="text-xs text-gray-500 uppercase tracking-wider">
          Money
        </h2>
        <h1 className="text-2xl font-bold text-white mt-1">Move Money</h1>
      </div>

      {/* Tabs */}
      <div className="flex border border-gray-800 rounded-lg overflow-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setResult(null);
              setError("");
            }}
            className={`flex-1 py-2 text-sm transition-colors ${
              activeTab === tab.id
                ? "bg-amber-500 text-black font-bold"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* From wallet */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            {activeTab === "transfer" ? "From Wallet" : "Wallet"}
          </label>
          <select
            value={form.fromWalletId}
            onChange={(e) => setForm({ ...form, fromWalletId: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 
                       text-sm text-white focus:outline-none focus:border-amber-500"
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

        {/* To wallet (transfer only) */}
        {activeTab === "transfer" && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              To Wallet
            </label>
            <select
              value={form.toWalletId}
              onChange={(e) => setForm({ ...form, toWalletId: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 
                         text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Select destination wallet</option>
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
        <div>
          <label className="block text-xs text-gray-500 mb-1">Amount (₹)</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 
                       text-sm text-white focus:outline-none focus:border-amber-500"
            placeholder="0.00"
            min="1"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Description <span className="text-gray-600">(optional)</span>
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 
                       text-sm text-white focus:outline-none focus:border-amber-500"
            placeholder="What's this for?"
          />
        </div>

        {error && (
          <div
            className="text-red-400 text-xs border border-red-800 
                          bg-red-900/20 rounded px-3 py-2"
          >
            {error}
          </div>
        )}

        {result && (
          <div
            className="text-green-400 text-xs border border-green-800 
                          bg-green-900/20 rounded px-3 py-2"
          >
            <div className="font-bold mb-1">{result.message}</div>
            <div>Ref: {result.data?.referenceId}</div>
            <div>Status: {result.data?.status}</div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 
                     text-black font-bold rounded px-4 py-2 text-sm transition-colors"
        >
          {loading
            ? "Processing..."
            : `Confirm ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        </button>
      </form>
    </div>
  );
}
