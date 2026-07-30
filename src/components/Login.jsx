import React, { useState } from "react";
import { Atom, Lock, User, AlertCircle } from "lucide-react";
import Input from "./ui/Input.jsx";
import Button from "./ui/Button.jsx";
import { setAuthCredentials, verifyCredentials, getErrorMessage } from "../lib/api.js";

export default function Login({ onLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      setError("Enter both username and password.");
      return;
    }
    setError("");
    setLoading(true);
    setAuthCredentials(username, password);
    try {
      await verifyCredentials();
      onLoggedIn(username);
    } catch (err) {
      setAuthCredentials(null, null);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-ink-950">
            <Atom className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-ink-900">Sign in to Ledger</h1>
          <p className="mt-1 text-sm text-slate-500">Inventory &amp; financial operations console</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
        >
          <Input
            label="Username"
            name="username"
            icon={User}
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            icon={Lock}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" loading={loading} className="mt-1 w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Connects to the API at{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">https://spring-boot-erp-production-3ed5.up.railway.app</code> using
          HTTP Basic Authentication.
        </p>
      </div>
    </div>
  );
}
