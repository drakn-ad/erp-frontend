import React, { useState, useEffect } from "react";
import { PackageCheck } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { inventoryApi, getErrorMessage } from "../../lib/api.js";
import { useToast } from "../ui/Toast.jsx";

const EMPTY_FORM = { prodId: "", quantity: "" };

export default function RestockModal({ open, onClose, onSuccess, presetProdId }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    if (open) setForm({ prodId: presetProdId ?? "", quantity: "" });
  }, [open, presetProdId]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!form.prodId) e.prodId = "Product ID is required.";
    if (!form.quantity || Number(form.quantity) <= 0) e.quantity = "Enter a valid quantity.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await inventoryApi.addStock(Number(form.prodId), Number(form.quantity));
      notify(`Added ${form.quantity} units to product #${form.prodId}.`, "success");
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
      title="Restock product"
      description="Increase the stock count for an existing product."
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
          label="Quantity to add"
          name="quantity"
          type="number"
          min="1"
          value={form.quantity}
          onChange={(e) => update("quantity", e.target.value)}
          error={errors.quantity}
          placeholder="e.g. 50"
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" icon={PackageCheck} loading={loading}>
            Update stock
          </Button>
        </div>
      </form>
    </Modal>
  );
}
