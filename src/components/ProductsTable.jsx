import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, RefreshCw, RotateCw, PackageSearch } from "lucide-react";
import { Card, CardBody } from "./ui/Card.jsx";
import Button from "./ui/Button.jsx";
import { inventoryApi, getErrorMessage } from "../lib/api.js";
import { formatCurrency } from "../lib/format.js";

const LOW_STOCK_THRESHOLD = 10;

export default function ProductsTable({ refreshKey, onRestock }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await inventoryApi.listProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, refreshKey]);

  return (
    <Card>
      <CardBody>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageSearch className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-ink-900">Product catalog</h3>
          </div>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchProducts} loading={loading}>
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
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2.5">ID</th>
                <th className="px-4 py-2.5">Product Name</th>
                <th className="px-4 py-2.5">Company</th>
                <th className="px-4 py-2.5">Supplier</th>
                <th className="px-4 py-2.5 text-right">Price</th>
                <th className="px-4 py-2.5 text-right">Cost Price</th>
                <th className="px-4 py-2.5 text-right">Stock</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && products.length === 0 ? (
                <SkeletonRows />
              ) : products.length === 0 && !error ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">
                    No products yet. Add one with &ldquo;Add new product&rdquo; above.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const lowStock = Number(p.stockQuantity) <= LOW_STOCK_THRESHOLD;
                  return (
                    <tr key={p.id} className="text-ink-800 hover:bg-slate-50">
                      <td className="px-4 py-2.5 tabular-nums text-slate-500">#{p.id}</td>
                      <td className="px-4 py-2.5 font-medium text-ink-900">{p.name}</td>
                      <td className="px-4 py-2.5 text-slate-600">{p.companyName}</td>
                      <td className="px-4 py-2.5 text-slate-600">{p.supplierName}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{formatCurrency(p.price)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-slate-500">
                        {formatCurrency(p.costPrice)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                            lowStock ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {p.stockQuantity}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={RotateCw}
                          onClick={() => onRestock(p.id)}
                        >
                          Restock
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}

function SkeletonRows() {
  return Array.from({ length: 4 }).map((_, i) => (
    <tr key={i}>
      {Array.from({ length: 8 }).map((__, j) => (
        <td key={j} className="px-4 py-3">
          <span className="inline-block h-4 w-full max-w-[90px] animate-pulse rounded bg-slate-200" />
        </td>
      ))}
    </tr>
  ));
}
