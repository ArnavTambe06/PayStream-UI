import { useState, useEffect } from "react";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import TransactionTable from "../components/TransactionTable";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, usersRes, logsRes] = await Promise.all([
          api.get("/api/admin/dashboard"),
          api.get("/api/admin/users?page=0&size=20"),
          api.get("/api/admin/audit-logs?page=0&size=20"),
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data.content || []);
        setAuditLogs(logsRes.data.data.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDeactivate = async (userId) => {
    try {
      await api.patch(`/api/admin/users/${userId}/deactivate`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: false } : u)),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to deactivate");
    }
  };

  const handleReactivate = async (userId) => {
    try {
      await api.patch(`/api/admin/users/${userId}/reactivate`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: true } : u)),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reactivate");
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading admin data...</div>;
  }

  const tabs = ["overview", "users", "audit logs"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs text-gray-500 uppercase tracking-wider">
            Admin
          </h2>
          <h1 className="text-2xl font-bold text-white mt-1">Admin Panel</h1>
        </div>
        <span
          className="text-xs border border-amber-500/30 text-amber-500 
                         bg-amber-500/10 px-3 py-1 rounded-full"
        >
          ADMIN ACCESS
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && stats && (
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Active Users" value={stats.activeUsers} />
          <StatCard label="Total Wallets" value={stats.totalWallets} />
          <StatCard
            label="Total Transactions"
            value={stats.totalTransactions}
          />
          <StatCard
            label="Successful Payments"
            value={stats.successfulPayments}
          />
          <StatCard label="Failed Payments" value={stats.failedPayments} />
          <StatCard
            label="Volume Processed"
            value={`₹${Number(stats.totalVolumeProcessed || 0).toLocaleString(
              "en-IN",
              { minimumFractionDigits: 2 },
            )}`}
            sub="Successful transactions only"
          />
        </div>
      )}

      {/* Users */}
      {activeTab === "users" && (
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/80">
                <th className="text-left px-4 py-3 text-gray-500 font-normal">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-normal">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-normal">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-normal">
                  Wallets
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-normal">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-800/50">
                  <td className="px-4 py-3 text-white">{user.fullName}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        user.role === "ADMIN"
                          ? "text-amber-400 bg-amber-400/10"
                          : "text-blue-400 bg-blue-400/10"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {user.walletCount}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        user.isActive
                          ? "text-green-400 bg-green-400/10"
                          : "text-red-400 bg-red-400/10"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.role !== "ADMIN" && (
                      <button
                        onClick={() =>
                          user.isActive
                            ? handleDeactivate(user.id)
                            : handleReactivate(user.id)
                        }
                        className={`text-xs px-2 py-1 rounded border transition-colors ${
                          user.isActive
                            ? "border-red-800 text-red-400 hover:bg-red-900/20"
                            : "border-green-800 text-green-400 hover:bg-green-900/20"
                        }`}
                      >
                        {user.isActive ? "Deactivate" : "Reactivate"}
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
      {activeTab === "audit logs" && (
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/80">
                <th className="text-left px-4 py-3 text-gray-500 font-normal">
                  User
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-normal">
                  Action
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-normal">
                  Entity
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-normal">
                  Details
                </th>
                <th className="text-left px-4 py-3 text-gray-500 font-normal">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-800/50">
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {log.userEmail}
                  </td>
                  <td className="px-4 py-3 text-amber-400 text-xs font-mono">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {log.entityType}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
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
