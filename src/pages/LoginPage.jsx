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
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Pay<span className="text-amber-500">Stream</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 
                         text-sm text-white focus:outline-none focus:border-amber-500 
                         transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 
                         text-sm text-white focus:outline-none focus:border-amber-500 
                         transition-colors"
              placeholder="••••••••"
              required
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 
                       text-black font-bold rounded px-4 py-2 text-sm transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-600">
          No account?{" "}
          <Link to="/register" className="text-amber-500 hover:text-amber-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
