const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function authHeader() {
  const token = localStorage.getItem("drop_token");
  return token ? { Authorization: "Bearer " + token } : {};
}

export async function apiRegister({ name, email, password }) {
  const r = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Falha no cadastro");
  localStorage.setItem("drop_token", data.token);
  localStorage.setItem("drop_current_user", data.user.email);
  return data;
}

export async function apiLogin({ email, password }) {
  const r = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Falha no login");
  localStorage.setItem("drop_token", data.token);
  localStorage.setItem("drop_current_user", data.user.email);
  return data;
}

export async function apiVehicles() {
  const r = await fetch(`${BASE_URL}/api/vehicles`);
  if (!r.ok) throw new Error("Erro ao listar veículos");
  return r.json();
}

export async function apiPrice({ items, couponCode }) {
  const r = await fetch(`${BASE_URL}/api/orders/price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, couponCode })
  });
  return r.json();
}

export async function apiCreateOrder({ items, couponCode, origin, destination }) {
  const r = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ items, couponCode, origin, destination })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Erro ao criar pedido");
  return data;
}

export async function apiMyOrders() {
  const r = await fetch(`${BASE_URL}/api/orders/me`, {
    headers: { ...authHeader() }
  });
  return r.json();
}
