/* ═══════════════════════════════════════════════════════════════
   QuickReserve — api.js
   ═══════════════════════════════════════════════════════════════ */

/* ─── BASE URL ───────────────────────────────────────────────── */
const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000/api"
  : "https://final-project-tech-vanguard-bsit2b.onrender.com/api";

/* ─── TOKEN HELPERS ──────────────────────────────────────────── */
const Token = {
  get()    { return localStorage.getItem("qr_token") || null; },
  set(t)   { localStorage.setItem("qr_token", t); },
  remove() { localStorage.removeItem("qr_token"); },
  headers() {
    const t = this.get();
    return t
      ? { "Content-Type": "application/json", "Authorization": "Bearer " + t }
      : { "Content-Type": "application/json" };
  },
};

/* ─── AUTH OBJECT ────────────────────────────────────────────── */
const Auth = {
  isLoggedIn()  { return !!Token.get(); },
  currentUser() {
    try {
      const raw = localStorage.getItem("qr_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  },
  getToken() { return Token.get(); },
  logout() {
    Token.remove();
    localStorage.removeItem("qr_user");
  },
};

/* ─── FETCH WRAPPER ──────────────────────────────────────────── */
async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(BASE_URL + path, {
      headers: Token.headers(),
      ...options,
    });

    if (res.status === 401) {
      Auth.logout();
      throw new Error("Session expired. Please log in again.");
    }

    // Guard against HTML error pages (404, 500, etc.)
    // If the server returns HTML instead of JSON, we get the misleading
    // "Unexpected token '<'" error. Check content-type first.
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error(
        `Backend returned non-JSON for ${path} (HTTP ${res.status}). ` +
        `Ensure the route is registered in server.js.\n\nPreview: ${text.slice(0, 150)}`
      );
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || data.error || "Something went wrong");
    }

    return data;

  } catch (err) {
    throw err;
  }
}

/* ═══════════════════════════════════════════════════════════════
   AUTH API
   ═══════════════════════════════════════════════════════════════ */
const ApiAuth = {

  async register(payload) {
    return await apiFetch("/users/register", {
      method: "POST",
      body:   JSON.stringify(payload),
    });
  },

  async login(email, password) {
    const data = await apiFetch("/users/login", {
      method: "POST",
      body:   JSON.stringify({ email, password }),
    });

    if (data && data.token) {
      Token.set(data.token);

      const src = (data.user && data.user._id) ? data.user : data;
      const user = {
        id:    src._id  || src.id  || "",
        _id:   src._id  || src.id  || "",
        name:  src.name  || "",
        email: src.email || email,
        phone: src.phone || "",
        role:  src.role  || "user",
      };

      localStorage.setItem("qr_user", JSON.stringify(user));
      return { ...data, _resolvedUser: user };
    }

    return data;
  },
};

/* ═══════════════════════════════════════════════════════════════
   TRIPS
   ═══════════════════════════════════════════════════════════════ */
const ApiTrips = {

  async getAll() {
    return await apiFetch("/trips");
  },

  async search(origin, destination) {
    const params = new URLSearchParams();
    if (origin)      params.append("origin",      origin);
    if (destination) params.append("destination", destination);
    return await apiFetch("/trips/search?" + params.toString());
  },

  async add(payload) {
    return await apiFetch("/trips", {
      method: "POST",
      body:   JSON.stringify(payload),
    });
  },

  async update(id, payload) {
    return await apiFetch("/trips/" + id, {
      method: "PUT",
      body:   JSON.stringify(payload),
    });
  },

  async delete(id) {
    return await apiFetch("/trips/" + id, { method: "DELETE" });
  },
};

/* ═══════════════════════════════════════════════════════════════
   BOOKINGS
   ═══════════════════════════════════════════════════════════════ */
const ApiBookings = {

  async create(payload) {
    return await apiFetch("/bookings", {
      method: "POST",
      body:   JSON.stringify(payload),
    });
  },

  async getAll() {
    return await apiFetch("/bookings");
  },

  async getById(bookingId) {
    return await apiFetch("/bookings/" + bookingId);
  },

  async forUser(userId) {
    return await apiFetch("/bookings/user/" + userId);
  },

  async cancel(bookingId) {
    return await apiFetch("/bookings/" + bookingId, { method: "DELETE" });
  },

  async reschedule(bookingId, payload) {
    return await apiFetch("/bookings/" + bookingId, {
      method: "PUT",
      body:   JSON.stringify(payload),
    });
  },
};

/* ═══════════════════════════════════════════════════════════════
   BUSES
   ═══════════════════════════════════════════════════════════════ */
const ApiBuses = {

  async getAll() {
    return await apiFetch("/buses");
  },

  async add(payload) {
    return await apiFetch("/buses", {
      method: "POST",
      body:   JSON.stringify(payload),
    });
  },

  async update(id, payload) {
    return await apiFetch("/buses/" + id, {
      method: "PUT",
      body:   JSON.stringify(payload),
    });
  },

  async delete(id) {
    return await apiFetch("/buses/" + id, { method: "DELETE" });
  },
};

/* ═══════════════════════════════════════════════════════════════
   ADMIN
   Mirrors exactly what adminRoutes.js exposes:
     GET    /admin/users
     DELETE /admin/users/:id
     GET    /admin/bookings
     PUT    /admin/bookings/:id
     POST   /admin/trips
     PUT    /admin/trips/:id
     DELETE /admin/trips/:id

   NOTE: There is NO DELETE /admin/bookings/:id route on the backend.
   The Delete button in the UI calls deleteBk() → this throws a clear
   error instead of silently hitting a 404 HTML page.
   Add the route to adminRoutes.js if you want hard-delete support:
     router.delete("/bookings/:id", authMiddleware, adminMiddleware, deleteBooking);
   ═══════════════════════════════════════════════════════════════ */
const ApiAdmin = {

  /* ── Users ── */
  async getUsers() {
    return await apiFetch("/admin/users");
  },

  async deleteUser(userId) {
    return await apiFetch("/admin/users/" + userId, { method: "DELETE" });
  },

  /* ── Bookings ── */
  async getBookings() {
    return await apiFetch("/admin/bookings");
  },

  async updateBooking(bookingId, payload) {
    return await apiFetch("/admin/bookings/" + bookingId, {
      method: "PUT",
      body:   JSON.stringify(payload),
    });
  },

  // ⚠️  No DELETE /admin/bookings/:id exists in adminRoutes.js yet.
  // This will throw a clear error until you add the route + controller.
  async deleteBooking(bookingId) {
    return await apiFetch("/admin/bookings/" + bookingId, { method: "DELETE" });
  },

  /* ── Trips ── */
  async addTrip(payload) {
    return await apiFetch("/admin/trips", {
      method: "POST",
      body:   JSON.stringify(payload),
    });
  },

  async editTrip(id, payload) {
    return await apiFetch("/admin/trips/" + id, {
      method: "PUT",
      body:   JSON.stringify(payload),
    });
  },

  async deleteTrip(id) {
    return await apiFetch("/admin/trips/" + id, { method: "DELETE" });
  },
};

/* ─── TOAST (shared UI helper) ───────────────────────────────── */
function showToast(msg, type) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.style.background = type === "error" ? "#dc2626" : "#0f6e56";
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 3000);
}