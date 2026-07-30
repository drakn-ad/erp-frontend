import axios from "axios";

const BASE_URL = "https://spring-boot-erp-production-3ed5.up.railway.app";
                

// Axios instance shared across the app. Basic Auth credentials are attached
// per-request via setAuthCredentials() once the user logs in.
export const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Store the username/password used for HTTP Basic Auth and attach it
 * to every outgoing request as an Authorization header.
 */
export function setAuthCredentials(username, password) {
  if (!username || !password) {
    delete client.defaults.headers.common["Authorization"];
    sessionStorage.removeItem("erp_auth");
    return;
  }
  const token = btoa(`${username}:${password}`);
  client.defaults.headers.common["Authorization"] = `Basic ${token}`;
  // Session-only persistence so a refresh doesn't force a re-login,
  // but credentials never touch localStorage / disk.
  sessionStorage.setItem("erp_auth", JSON.stringify({ username, password }));
}

export function loadStoredCredentials() {
  const raw = sessionStorage.getItem("erp_auth");
  if (!raw) return null;
  try {
    const { username, password } = JSON.parse(raw);
    setAuthCredentials(username, password);
    return { username, password };
  } catch {
    return null;
  }
}

export function clearAuthCredentials() {
  setAuthCredentials(null, null);
}

/** Verifies credentials are valid by hitting a lightweight, authenticated endpoint. */
export async function verifyCredentials() {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await client.get("/req/reports/daily", { params: { date: today } });
  return data;
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

export const reportsApi = {
  daily: (date) => client.get("/req/reports/daily", { params: { date } }).then((r) => r.data),
  monthly: (month, year) =>
    client.get("/req/reports/monthly", { params: { month, year } }).then((r) => r.data),
  yearly: (year) => client.get("/req/reports/yearly", { params: { year } }).then((r) => r.data),
};

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

export const inventoryApi = {
  listProducts: () => client.get("/req/inventory/products").then((r) => r.data),

  listOrders: () => client.get("/req/inventory/orders").then((r) => r.data),

  createOrder: ({ prodId, quantity, customerPhone }) =>
    client
      .post("/req/inventory/order", { prodId, quantity, customerPhone })
      .then((r) => r.data),

  addStock: (prodId, quantity) =>
    client
      .put("/req/inventory/add_stock", null, { params: { prodId, quantity } })
      .then((r) => r.data),

  addProduct: ({ name, companyName, supplierName, price, costPrice, stockQuantity }) =>
    client
      .post("/req/inventory/Adder", {
        name,
        companyName,
        supplierName,
        price,
        costPrice,
        stockQuantity,
      })
      .then((r) => r.data),
};

/** Extracts a human-readable message from an Axios error. */
export function getErrorMessage(error) {
  if (error?.response) {
    if (error.response.status === 401) return "Invalid username or password.";
    if (error.response.data?.message) return error.response.data.message;
    if (typeof error.response.data === "string") return error.response.data;
    return `Request failed (${error.response.status}).`;
  }
  if (error?.request) return "No response from server. Is the API running on https://spring-boot-erp-production-3ed5.up.railway.app?";
  return error?.message || "Something went wrong.";
}
