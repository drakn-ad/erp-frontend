import React, { useState } from "react";
import { ShoppingCart, PackagePlus, RotateCw, Clock } from "lucide-react";
import { Card, CardBody } from "./ui/Card.jsx";
import Button from "./ui/Button.jsx";
import ProductsTable from "./ProductsTable.jsx";
import CreateOrderModal from "./modals/CreateOrderModal.jsx";
import AddProductModal from "./modals/AddProductModal.jsx";
import RestockModal from "./modals/RestockModal.jsx";

const ACTIONS = [
  {
    key: "order",
    title: "Create new order",
    description: "Place an order for a customer against an existing product.",
    icon: ShoppingCart,
    accent: "bg-brand-50 text-brand-600",
  },
  {
    key: "product",
    title: "Add new product",
    description: "Register a new product with pricing and starting stock.",
    icon: PackagePlus,
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "restock",
    title: "Restock product",
    description: "Increase the stock count for a product already in the catalog.",
    icon: RotateCw,
    accent: "bg-amber-50 text-amber-600",
  },
];

export default function InventoryManagement() {
  const [activeModal, setActiveModal] = useState(null); // "order" | "product" | "restock" | null
  const [restockProdId, setRestockProdId] = useState(null);
  const [activity, setActivity] = useState([]);
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  function logActivity(message) {
    setActivity((prev) => [
      { id: Date.now(), message, at: new Date() },
      ...prev,
    ].slice(0, 8));
  }

  function refreshTable() {
    setTableRefreshKey((k) => k + 1);
  }

  function openRestock(prodId = null) {
    setRestockProdId(prodId);
    setActiveModal("restock");
  }

  function closeModal() {
    setActiveModal(null);
    setRestockProdId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Inventory &amp; Sales Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create orders, onboard new products, and keep stock levels current.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ACTIONS.map(({ key, title, description, icon: Icon, accent }) => (
          <Card key={key} className="flex flex-col">
            <CardBody className="flex flex-1 flex-col">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-500">{description}</p>
              <Button
                variant="secondary"
                className="mt-4 w-full"
                onClick={() => (key === "restock" ? openRestock(null) : setActiveModal(key))}
              >
                {title}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <ProductsTable refreshKey={tableRefreshKey} onRestock={openRestock} />

      <Card>
        <CardBody>
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-ink-900">Recent activity this session</h3>
          </div>
          {activity.length === 0 ? (
            <p className="text-sm text-slate-400">
              Actions you take will show up here as a quick log.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-slate-100">
              {activity.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-ink-800">{a.message}</span>
                  <span className="tabular-nums text-xs text-slate-400">
                    {a.at.toLocaleTimeString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <CreateOrderModal
        open={activeModal === "order"}
        onClose={closeModal}
        onSuccess={() => logActivity("New order created.")}
      />
      <AddProductModal
        open={activeModal === "product"}
        onClose={closeModal}
        onSuccess={() => {
          logActivity("New product added to catalog.");
          refreshTable();
        }}
      />
      <RestockModal
        open={activeModal === "restock"}
        onClose={closeModal}
        presetProdId={restockProdId}
        onSuccess={() => {
          logActivity("Stock quantity updated.");
          refreshTable();
        }}
      />
    </div>
  );
}
