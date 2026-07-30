import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";
import { Card, CardBody } from "./ui/Card.jsx";
import Button from "./ui/Button.jsx";
import { inventoryApi, getErrorMessage } from "../lib/api.js";
import { formatCurrency } from "../lib/format.js";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await inventoryApi.listOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Orders History</h1>
        <p className="mt-1 text-sm text-slate-500">
          Every order placed against a product, most recent first.
        </p>
      </div>

      <Card>
        <CardBody>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-ink-900">All orders</h3>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={fetchOrders}
              loading={loading}
            >
              Refresh
            </Button>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2.5">Order ID</th>
                  <th className="px-4 py-2.5">Product</th>
                  <th className="px-4 py-2.5">Customer Phone</th>
                  <th className="px-4 py-2.5 text-right">Quantity</th>
                  <th className="px-4 py-2.5 text-right">Total Price</th>
                  <th className="px-4 py-2.5 text-right">Profit</th>
                  <th className="px-4 py-2.5">Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && orders.length === 0 ? (
                  <SkeletonRows />
                ) : orders.length === 0 && !error ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                      No orders yet. Orders you create will show up here.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="text-ink-800 hover:bg-slate-50">
                      <td className="px-4 py-2.5 tabular-nums text-slate-500">#{o.id}</td>
                      <td className="px-4 py-2.5 font-medium text-ink-900">
                        {o.product?.name ?? `Product #${o.product?.id ?? "—"}`}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">{o.customerPhone}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{o.quantity}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        {formatCurrency(o.totalPrice)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-emerald-600">
                        {formatCurrency(o.profit)}
                      </td>
                      <td className="px-4 py-2.5 text-slate-500">
                        {o.orderDate ? new Date(o.orderDate).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function SkeletonRows() {
  return Array.from({ length: 4 }).map((_, i) => (
    <tr key={i}>
      {Array.from({ length: 7 }).map((__, j) => (
        <td key={j} className="px-4 py-3">
          <span className="inline-block h-4 w-full max-w-[90px] animate-pulse rounded bg-slate-200" />
        </td>
      ))}
    </tr>
  ));
}
