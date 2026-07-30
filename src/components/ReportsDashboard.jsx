import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Wallet, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardBody } from "./ui/Card.jsx";
import Button from "./ui/Button.jsx";
import { reportsApi, getErrorMessage } from "../lib/api.js";
import { formatCurrency, todayISO } from "../lib/format.js";

const RANGE_OPTIONS = [
  { key: "daily", label: "Day" },
  { key: "monthly", label: "Month" },
  { key: "yearly", label: "Year" },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function ReportsDashboard() {
  const now = new Date();
  const [range, setRange] = useState("daily");
  const [date, setDate] = useState(todayISO());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchReport() {
    setLoading(true);
    setError("");
    try {
      let data;
      if (range === "daily") data = await reportsApi.daily(date);
      else if (range === "monthly") data = await reportsApi.monthly(month, year);
      else data = await reportsApi.yearly(year);
      setReport(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setReport(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, date, month, year]);

  const totalSales = report?.totalSales ?? 0;
  const totalCost = report?.totalCost ?? 0;
  const netProfit = report?.netProfit ?? 0;
  const isProfit = Number(netProfit) >= 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Financial Reports</h1>
        <p className="mt-1 text-sm text-slate-500">
          Revenue, cost, and net profit for the selected period.
        </p>
      </div>

      {/* Filter bar */}
      <Card>
        <CardBody className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink-800">Period</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setRange(opt.key)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    range === opt.key
                      ? "bg-white text-ink-900 shadow-sm"
                      : "text-slate-500 hover:text-ink-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {range === "daily" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="date-picker" className="text-sm font-medium text-ink-800">
                Date
              </label>
              <input
                id="date-picker"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-ink-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          )}

          {range === "monthly" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="month-picker" className="text-sm font-medium text-ink-800">
                  Month
                </label>
                <select
                  id="month-picker"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-ink-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  {MONTH_NAMES.map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="month-year-picker" className="text-sm font-medium text-ink-800">
                  Year
                </label>
                <input
                  id="month-year-picker"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="h-10 w-28 rounded-lg border border-slate-200 bg-white px-3 text-sm text-ink-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </>
          )}

          {range === "yearly" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="year-picker" className="text-sm font-medium text-ink-800">
                Year
              </label>
              <input
                id="year-picker"
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="h-10 w-28 rounded-lg border border-slate-200 bg-white px-3 text-sm text-ink-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          )}

          <Button variant="secondary" icon={RefreshCw} onClick={fetchReport} loading={loading} className="ml-auto">
            Refresh
          </Button>
        </CardBody>
      </Card>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label="Total Sales"
          value={totalSales}
          icon={Wallet}
          loading={loading}
          accent="text-brand-600 bg-brand-50"
        />
        <KpiCard
          label="Total Cost"
          value={totalCost}
          icon={TrendingDown}
          loading={loading}
          accent="text-amber-600 bg-amber-50"
        />
        <KpiCard
          label="Net Profit"
          value={netProfit}
          icon={TrendingUp}
          loading={loading}
          highlight
          positive={isProfit}
        />
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, loading, accent, highlight, positive }) {
  return (
    <Card
      className={
        highlight
          ? positive
            ? "border-emerald-200 bg-emerald-50/60"
            : "border-rose-200 bg-rose-50/60"
          : ""
      }
    >
      <CardBody>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">{label}</span>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              highlight
                ? positive
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-rose-100 text-rose-600"
                : accent
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p
          className={`mt-3 text-2xl font-bold tabular-nums ${
            highlight ? (positive ? "text-emerald-700" : "text-rose-700") : "text-ink-900"
          }`}
        >
          {loading ? (
            <span className="inline-block h-7 w-28 animate-pulse rounded bg-slate-200" />
          ) : (
            formatCurrency(value)
          )}
        </p>
        {highlight && !loading && (
          <span
            className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
              positive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            }`}
          >
            {positive ? "Profitable" : "At a loss"}
          </span>
        )}
      </CardBody>
    </Card>
  );
}
