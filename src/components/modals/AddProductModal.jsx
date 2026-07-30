import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { inventoryApi, getErrorMessage } from "../../lib/api.js";
import { useToast } from "../ui/Toast.jsx";

const EMPTY_FORM = {
  name: "",
  companyName: "",
  supplierName: "",
  price: "",
  costPrice: "",
  stockQuantity: "",
};

export default function AddProductModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required.";
    if (!form.companyName.trim()) e.companyName = "Company name is required.";
    if (!form.supplierName.trim()) e.supplierName = "Supplier name is required.";
    if (!form.price || Number(form.price) <= 0) e.price = "Enter a valid selling price.";
    if (!form.costPrice || Number(form.costPrice) < 0) e.costPrice = "Enter a valid cost price.";
    if (form.stockQuantity === "" || Number(form.stockQuantity) < 0)
      e.stockQuantity = "Enter a valid stock quantity.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await inventoryApi.addProduct({
        name: form.name.trim(),
        companyName: form.companyName.trim(),
        supplierName: form.supplierName.trim(),
        price: Number(form.price),
        costPrice: Number(form.costPrice),
        stockQuantity: Number(form.stockQuantity),
      });
      notify(`"${form.name.trim()}" added to inventory.`, "success");
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
      title="Add new product"
      description="Register a new product in the catalog."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Product name"
          name="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          error={errors.name}
          placeholder="e.g. Wireless Mouse"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Company name"
            name="companyName"
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            error={errors.companyName}
            placeholder="e.g. Logitech"
          />
          <Input
            label="Supplier name"
            name="supplierName"
            value={form.supplierName}
            onChange={(e) => update("supplierName", e.target.value)}
            error={errors.supplierName}
            placeholder="e.g. TechDistro"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Selling price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            error={errors.price}
            placeholder="0.00"
          />
          <Input
            label="Cost price"
            name="costPrice"
            type="number"
            step="0.01"
            min="0"
            value={form.costPrice}
            onChange={(e) => update("costPrice", e.target.value)}
            error={errors.costPrice}
            placeholder="0.00"
          />
        </div>
        <Input
          label="Initial stock quantity"
          name="stockQuantity"
          type="number"
          min="0"
          value={form.stockQuantity}
          onChange={(e) => update("stockQuantity", e.target.value)}
          error={errors.stockQuantity}
          placeholder="e.g. 100"
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" icon={PlusCircle} loading={loading}>
            Add product
          </Button>
        </div>
      </form>
    </Modal>
  );
}
