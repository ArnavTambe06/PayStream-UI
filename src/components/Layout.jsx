import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "◈" },
  { to: "/transactions", label: "Transactions", icon: "↕" },
  { to: "/transfer", label: "Transfer", icon: "→" },
];

const adminItems = [{ to: "/admin", label: "Admin Panel", icon: "⚙" }];

export default function Layout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-100 font-mono">
      {/* Sidebar */}
      <aside className="w-56 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <span className="text-white font-bold text-lg tracking-tight">
            Pay<span className="text-amber-500">Stream</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                  isActive
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}

          {user?.role === "ADMIN" && (
            <>
              <div className="pt-4 pb-1 px-3 text-xs text-gray-600 uppercase tracking-wider">
                Admin
              </div>
              {adminItems.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                      isActive
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                    }`
                  }
                >
                  <span>{icon}</span>
                  {label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 mb-1">{user?.email}</div>
          <div className="text-xs text-amber-500 mb-3">{user?.role}</div>
          <button
            onClick={handleLogout}
            className="w-full text-xs text-gray-400 hover:text-red-400 
                       border border-gray-700 hover:border-red-800 
                       rounded px-3 py-1.5 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
