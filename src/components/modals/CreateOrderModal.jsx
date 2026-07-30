import React, { useState } from "react";
import { PackagePlus } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { inventoryApi, getErrorMessage } from "../../lib/api.js";
import { useToast } from "../ui/Toast.jsx";

const EMPTY_FORM = { prodId: "", quantity: "", customerPhone: "" };

export default function CreateOrderModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!form.prodId) e.prodId = "Product ID is required.";
    if (!form.quantity || Number(form.quantity) <= 0) e.quantity = "Enter a valid quantity.";
    if (!form.customerPhone.trim()) e.customerPhone = "Customer phone is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await inventoryApi.createOrder({
        prodId: Number(form.prodId),
        quantity: Number(form.quantity),
        customerPhone: form.customerPhone.trim(),
      });
      notify("Order created successfully.", "success");
      setForm(EMPTY_FORM);
      onSuccess?.();
      onClose();
    } catch (err) {
      notify(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create new order"
      description="Place an order against an existing product."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Product ID"
          name="prodId"
          type="number"
          min="1"
          value={form.prodId}
          onChange={(e) => update("prodId", e.target.value)}
          error={errors.prodId}
          placeholder="e.g. 102"
        />
        <Input
          label="Quantity"
          name="quantity"
          type="number"
          min="1"
          value={form.quantity}
          onChange={(e) => update("quantity", e.target.value)}
          error={errors.quantity}
          placeholder="e.g. 5"
        />
        <Input
          label="Customer phone"
          name="customerPhone"
          type="tel"
          value={form.customerPhone}
          onChange={(e) => update("customerPhone", e.target.value)}
          error={errors.customerPhone}
          placeholder="e.g. +1 555 0100"
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" icon={PackagePlus} loading={loading}>
            Create order
          </Button>
        </div>
      </form>
    </Modal>
  );
}
