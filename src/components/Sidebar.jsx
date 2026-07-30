import React from "react";
import { Atom, LayoutDashboard, Package, ShoppingBag, LogOut, User } from "lucide-react";

const NAV_ITEMS = [
  { key: "reports", label: "Financial Reports", icon: LayoutDashboard },
  { key: "inventory", label: "Inventory & Sales", icon: Package },
  { key: "orders", label: "Orders History", icon: ShoppingBag },
];

export default function Sidebar({ active, onNavigate, username, onLogout }) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-ink-800 bg-ink-950 text-slate-300">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
          <Atom className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-wide text-white">KRYPTO ERP</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-ink-800 px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-100">{username}</p>
            <p className="text-xs text-slate-500">Signed in</p>
          </div>
          <button
            onClick={onLogout}
            aria-label="Sign out"
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
