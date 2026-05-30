import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import TransferPage from "./pages/TransferPage";
import AdminPage from "./pages/AdminPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function AppLayout({ children, adminOnly }) {
  return (
    <ProtectedRoute adminOnly={adminOnly}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />
        <Route
          path="/transactions"
          element={
            <AppLayout>
              <TransactionsPage />
            </AppLayout>
          }
        />
        <Route
          path="/transfer"
          element={
            <AppLayout>
              <TransferPage />
            </AppLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <AppLayout adminOnly>
              <AdminPage />
            </AppLayout>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
