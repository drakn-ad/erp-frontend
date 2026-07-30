export function formatCurrency(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
