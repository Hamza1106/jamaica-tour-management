const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("irie_token");
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export async function apiSignup(fullName: string, email: string, password: string, phone?: string) {
  const data = await request("/auth/signup", { method: "POST", body: JSON.stringify({ fullName, email, password, phone }) });
  localStorage.setItem("irie_token", data.token);
  return data;
}

export async function apiLogin(email: string, password: string) {
  const data = await request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  localStorage.setItem("irie_token", data.token);
  return data;
}

export async function apiLogout() {
  localStorage.removeItem("irie_token");
}

export async function apiMe() {
  return request("/auth/me");
}

export async function apiCreateBooking(data: Record<string, unknown>) {
  return request("/bookings", { method: "POST", body: JSON.stringify(data) });
}

export async function apiMyBookings() {
  return request("/bookings/my");
}

export async function apiAllBookings(params?: { status?: string; search?: string }) {
  const q = new URLSearchParams(params as Record<string, string>).toString();
  return request(`/bookings${q ? "?" + q : ""}`);
}

export async function apiBookingStats() {
  return request("/bookings/stats");
}

export async function apiUpdateStatus(id: string, status: string) {
  return request(`/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export async function apiDeleteBooking(id: string) {
  return request(`/bookings/${id}`, { method: "DELETE" });
}

export async function apiCancelBooking(id: string) {
  return request(`/bookings/${id}/cancel`, { method: "PATCH" });
}

export async function apiAllUsers() {
  return request("/admin/users");
}
