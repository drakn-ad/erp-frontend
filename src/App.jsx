import React, { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ReportsDashboard from "./components/ReportsDashboard.jsx";
import InventoryManagement from "./components/InventoryManagement.jsx";
import OrdersTable from "./components/OrdersTable.jsx";
import { ToastProvider } from "./components/ui/Toast.jsx";
import { loadStoredCredentials, clearAuthCredentials } from "./lib/api.js";

export default function App() {
  const [username, setUsername] = useState(null);
  const [view, setView] = useState("reports");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const stored = loadStoredCredentials();
    if (stored) setUsername(stored.username);
    setCheckingSession(false);
  }, []);

  function handleLogout() {
    clearAuthCredentials();
    setUsername(null);
  }

  if (checkingSession) return null;

  return (
    <ToastProvider>
      {!username ? (
        <Login onLoggedIn={setUsername} />
      ) : (
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar
            active={view}
            onNavigate={setView}
            username={username}
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-y-auto px-8 py-8">
            <div className="mx-auto max-w-5xl">
              {view === "reports" && <ReportsDashboard />}
              {view === "inventory" && <InventoryManagement />}
              {view === "orders" && <OrdersTable />}
            </div>
          </main>
        </div>
      )}
    </ToastProvider>
  );
}
