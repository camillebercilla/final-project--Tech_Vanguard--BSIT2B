// =========================================
// PASSWORD TOGGLE (called via HTML onclick)
// =========================================
function togglePassword() {
  const pass    = document.getElementById("password");
  const confirm = document.getElementById("confirmPassword");
  if (!pass || !confirm) return;
  const isHidden = pass.type === "password";
  pass.type    = isHidden ? "text" : "password";
  confirm.type = isHidden ? "text" : "password";
}

// =========================================
// PROFILE — EDIT / CANCEL / SAVE
// =========================================
const EDITABLE = [
  'firstName', 'lastName', 'email', 'phone',
  'dob', 'gender', 'street', 'city', 'province', 'region',
  'curPass', 'newPass', 'conPass'
];

function setEditMode(mode) {
  const isEdit = mode === 'edit';
  EDITABLE.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = !isEdit;
  });
  const editBtn   = document.getElementById('editBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const saveRow   = document.getElementById('saveRow');
  if (editBtn)   editBtn.style.display   = isEdit ? 'none'         : 'inline-block';
  if (cancelBtn) cancelBtn.style.display = isEdit ? 'inline-block' : 'none';
  if (saveRow)   saveRow.style.display   = isEdit ? 'flex'         : 'none';
}

function toggleEdit()  { setEditMode('edit'); }

function cancelEdit() {
  setEditMode('view');
  const picker = document.getElementById('avatarPicker');
  if (picker) picker.style.display = 'none';
}

function saveProfile() {
  const first = document.getElementById('firstName')?.value.trim();
  const last  = document.getElementById('lastName')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const np    = document.getElementById('newPass')?.value;
  const cp    = document.getElementById('conPass')?.value;

  if (!first || !last || !email) { alert("Please fill in required fields."); return; }
  if (np && np.length < 6)       { alert("New password must be at least 6 characters."); return; }
  if (np && np !== cp)           { alert("Passwords do not match."); return; }

  const nameEl = document.getElementById('headerName');
  const mailEl = document.getElementById('headerEmail');
  if (nameEl) nameEl.textContent = `${first} ${last}`;
  if (mailEl) mailEl.textContent = email;

  ['curPass', 'newPass', 'conPass'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  setEditMode('view');
  showToast("Changes saved!");
}

// =========================================
// AVATAR PICKER
// =========================================
function togglePicker() {
  const p = document.getElementById('avatarPicker');
  if (!p) return;
  p.style.display = p.style.display === 'block' ? 'none' : 'block';
}

function pickAvatar(el, emoji) {
  document.querySelectorAll('.avatar-opt').forEach(o => o.classList.remove('picked'));
  el.classList.add('picked');

  const main = document.getElementById('mainAvatar');
  const nav  = document.getElementById('navAvatar');
  if (main) { main.textContent = emoji; main.style.background = el.style.background; }
  if (nav)  nav.textContent = emoji;

  setTimeout(() => {
    const p = document.getElementById('avatarPicker');
    if (p) p.style.display = 'none';
  }, 250);

  showToast("Avatar updated!");
}

// =========================================
// TOAST
// =========================================
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent   = msg;
  t.style.opacity = '1';
  setTimeout(() => { t.style.opacity = '0'; }, 2000);
}

// =========================================
// DELETE ACCOUNT
// =========================================
function confirmDelete() {
  if (confirm("Are you sure? This cannot be undone.")) {
    window.location.href = "/index.html";
  }
}

// =========================================
// SHARED HELPERS  (available to all pages)
// =========================================
function formatTime(t) {
  if (!t || t === "—") return "—";
  try {
    const [h, m] = t.split(":");
    const hour   = parseInt(h, 10);
    const ampm   = hour >= 12 ? "PM" : "AM";
    const h12    = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  } catch { return t; }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^(09|\+639)\d{9}$/.test(phone.replace(/\s/g, ""));
}

// =========================================
// DOM-READY  (single listener — no duplicates)
// =========================================
document.addEventListener("DOMContentLoaded", function () {

  // ── SCROLL FADE ANIMATION ─────────────────────────────────
  const allFadeEls = document.querySelectorAll(
    ".fade, .step-box, .why-btn, .btn-start, .card"
  );
  const fadeObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); }),
    { threshold: 0.15 }
  );
  allFadeEls.forEach(el => fadeObserver.observe(el));

  // ── SEARCH TRIP (home page) ───────────────────────────────
  // Uses absolute path so it works from index.html at the root level
  window.searchTrip = function () {
    const from = "Albay";
    const to   = document.getElementById("to")?.value;
    const date = document.getElementById("date")?.value;
    if (!to || !date) { alert("Please enter destination and date"); return; }
    window.location.href = `/pages/search.html?from=${from}&to=${to}&date=${date}`;
  };

  // ── SEAT SELECTION ────────────────────────────────────────
  document.addEventListener("click", function (e) {
    if (!e.target.classList.contains("seat") || e.target.classList.contains("booked")) return;

    document.querySelectorAll(".seat.selected").forEach(s => {
      if (s !== e.target) s.classList.remove("selected");
    });
    e.target.classList.toggle("selected");

    const selected = document.querySelector(".seat.selected");
    if (selected) {
      localStorage.setItem("selectedSeat", selected.dataset.seat || selected.textContent.trim());
    } else {
      localStorage.removeItem("selectedSeat");
    }

    const display = document.getElementById("selectedSeatDisplay");
    if (display) {
      display.textContent = selected
        ? `Seat ${selected.dataset.seat || selected.textContent.trim()} selected`
        : "No seat selected";
    }
  });

  // ── TRIP CARD SELECTION (results / search page) ──────────
  // Uses absolute path so redirect works regardless of which folder calls it
  window.selectTrip = function (route, price, departure, busType) {
    localStorage.setItem("selectedRoute",     route);
    localStorage.setItem("selectedPrice",     price);
    localStorage.setItem("selectedDeparture", departure);
    localStorage.setItem("selectedBusType",   busType);
    localStorage.removeItem("selectedSeat");
    window.location.href = "/pages/seats.html";
  };

  // ── PROCEED TO BOOKING (seats page) ──────────────────────
  // Uses absolute path so redirect works regardless of which folder calls it
  window.proceedToBooking = function () {
    if (!localStorage.getItem("selectedSeat")) {
      alert("Please select a seat before proceeding.");
      return;
    }
    window.location.href = "/pages/user/booking.html";
  };

  // ── REGISTER FORM VALIDATION ──────────────────────────────
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      const password = document.getElementById("password")?.value;
      const confirm  = document.getElementById("confirmPassword")?.value;
      if (!password || !confirm) return;
      if (password.length < 6) { e.preventDefault(); alert("Password must be at least 6 characters"); return; }
      if (password !== confirm) { e.preventDefault(); alert("Passwords do not match"); }
    });
  }

  // ===========================================================
  // ADMIN DASHBOARD
  // ===========================================================
  if (document.querySelector(".dash-wrapper")) {

    let trips = JSON.parse(localStorage.getItem("trips") || "[]");

    // Sidebar nav
    document.querySelectorAll(".nav-item").forEach(item => {
      item.addEventListener("click", () => {
        const section = item.dataset.section;
        if (!section) return;
        document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
        item.classList.add("active");
        document.querySelectorAll("[id^='section-']").forEach(s => s.style.display = "none");
        const target = document.getElementById("section-" + section);
        if (target) target.style.display = "block";
        const labels = {
          trips:    ["Manage Trips",    "Add, view, and manage all available trips"],
          bookings: ["Manage Bookings", "View and handle all customer bookings"],
          users:    ["Manage Users",    "View and manage registered users"],
          reports:  ["Reports",         "View system reports and analytics"],
        };
        const titleEl    = document.getElementById("pageTitle");
        const subtitleEl = document.getElementById("pageSubtitle");
        if (titleEl)    titleEl.textContent    = labels[section]?.[0] || section;
        if (subtitleEl) subtitleEl.textContent = labels[section]?.[1] || "";

        if (section === "bookings") renderAdminBookings();
      });
    });

    // Add trip form
    const tripForm = document.getElementById("tripForm");
    if (tripForm) {
      tripForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const route     = document.getElementById("route").value.trim();
        const price     = parseFloat(document.getElementById("price").value);
        const departure = document.getElementById("departure").value;
        const busType   = document.getElementById("busType").value;
        const msg       = document.getElementById("message");

        if (!route || isNaN(price) || price <= 0) {
          showAdminMsg(msg, "Please fill in Route and a valid Price.", "danger"); return;
        }
        trips.push({ id: Date.now(), route, price, departure: departure || "—", busType: busType || "Standard" });
        saveTrips();
        renderTripTable();
        updateStats();
        this.reset();
        showAdminMsg(msg, `✅ Trip "${route}" added successfully!`, "success");
      });
    }

    function renderTripTable(filter = "") {
      const tbody = document.getElementById("tripTable");
      if (!tbody) return;
      const filtered = trips.filter(t => t.route.toLowerCase().includes(filter.toLowerCase()));
      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-msg">${
          filter ? "No trips match your search." : "No trips added yet. Add one above."
        }</td></tr>`;
        return;
      }
      tbody.innerHTML = filtered.map((t, i) => `
        <tr>
          <td style="color:var(--text-muted)">${i + 1}</td>
          <td><span class="route-badge">${t.route}</span></td>
          <td>₱${Number(t.price).toLocaleString()}</td>
          <td>${formatTime(t.departure)}</td>
          <td><span class="type-badge">${t.busType}</span></td>
          <td><button class="btn-delete" onclick="deleteTrip(${t.id})">Delete</button></td>
        </tr>
      `).join("");
    }

    window.deleteTrip = function (id) {
      if (!confirm("Delete this trip?")) return;
      trips = trips.filter(t => t.id !== id);
      saveTrips();
      renderTripTable();
      updateStats();
    };

    const searchInput = document.getElementById("searchTrip");
    if (searchInput) searchInput.addEventListener("input", function () { renderTripTable(this.value); });

    function updateStats() {
      const g = id => document.getElementById(id);
      if (g("statTotalTrips"))  g("statTotalTrips").textContent  = trips.length;
      if (g("statRoutes"))      g("statRoutes").textContent      = new Set(trips.map(t => t.route)).size;
      const avg = trips.length ? Math.round(trips.reduce((s, t) => s + t.price, 0) / trips.length) : 0;
      if (g("statAvgPrice"))    g("statAvgPrice").textContent    = `₱${avg.toLocaleString()}`;
    }

    function saveTrips() { localStorage.setItem("trips", JSON.stringify(trips)); }

    function showAdminMsg(el, text, type) {
      if (!el) return;
      el.innerHTML = `<div class="alert-${type}">${text}</div>`;
      setTimeout(() => { el.innerHTML = ""; }, 3000);
    }

    function renderAdminBookings() {
      const tbody = document.getElementById("adminBookingsTable");
      if (!tbody) return;
      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]").slice().reverse();
      if (bookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-msg">No bookings yet.</td></tr>`;
        return;
      }
      tbody.innerHTML = bookings.map((b, i) => `
        <tr>
          <td style="color:var(--text-muted)">${i + 1}</td>
          <td>${b.id}</td>
          <td>${b.passenger}</td>
          <td><span class="route-badge">${b.route}</span></td>
          <td>Seat ${b.seat}</td>
          <td>₱${Number(b.total).toLocaleString()}</td>
          <td><span class="type-badge status-${(b.status || "confirmed").toLowerCase()}">${b.status || "Confirmed"}</span></td>
        </tr>
      `).join("");
    }

    renderTripTable();
    updateStats();
    renderAdminBookings();

  } // end .dash-wrapper

  // ===========================================================
  // BOOKING PAGE
  // ===========================================================
  if (document.querySelector(".booking-container")) {

    const BOOKING_FEE   = 25;
    let   selectedPayment = "Cash";

    function loadBookingData() {
      const seat      = localStorage.getItem("selectedSeat");
      const route     = localStorage.getItem("selectedRoute")     || "—";
      const price     = parseFloat(localStorage.getItem("selectedPrice"))  || 0;
      const departure = localStorage.getItem("selectedDeparture") || "—";
      const busType   = localStorage.getItem("selectedBusType")   || "Standard";

      if (!seat) {
        const msg = document.getElementById("message");
        if (msg) {
          msg.textContent   = "⚠️ No seat selected. Please go back and choose a seat first.";
          msg.className     = "b-message danger";
          msg.style.display = "block";
        }
      }

      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set("displayRoute",     route);
      set("displayDeparture", formatTime(departure));
      set("displayBusType",   busType);
      set("displaySeat",      seat ? `Seat ${seat}` : "— (none selected)");
      set("displayPrice",     `₱${price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`);
      set("displayTotal",     `₱${(price + BOOKING_FEE).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`);
    }

    window.selectPayment = function (el) {
      document.querySelectorAll(".pay-option").forEach(o => o.classList.remove("active"));
      el.classList.add("active");
      selectedPayment = el.dataset.method;
    };

    function showMsg(el, text, type) {
      if (!el) return;
      el.textContent   = text;
      el.className     = `b-message ${type}`;
      el.style.display = "block";
    }

    const confirmBtn = document.getElementById("confirmBtn");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        const firstName = document.getElementById("firstName")?.value.trim();
        const lastName  = document.getElementById("lastName")?.value.trim();
        const email     = document.getElementById("email")?.value.trim();
        const phone     = document.getElementById("phone")?.value.trim();
        const msg       = document.getElementById("message");

        if (!firstName || !lastName || !email || !phone) {
          showMsg(msg, "⚠️ Please fill in all passenger details.", "danger"); return;
        }
        if (!isValidEmail(email)) {
          showMsg(msg, "⚠️ Please enter a valid email address.", "danger"); return;
        }
        if (!isValidPhone(phone)) {
          showMsg(msg, "⚠️ Please enter a valid PH phone number (e.g. 09XXXXXXXXX).", "danger"); return;
        }

        const seat      = localStorage.getItem("selectedSeat")      || "—";
        const route     = localStorage.getItem("selectedRoute")     || "—";
        const price     = parseFloat(localStorage.getItem("selectedPrice"))  || 0;
        const departure = localStorage.getItem("selectedDeparture") || "—";
        const busType   = localStorage.getItem("selectedBusType")   || "Standard";

        const booking = {
          id:        "BK-" + Date.now(),
          passenger: `${firstName} ${lastName}`,
          email, phone,
          route, seat, price, departure, busType,
          fee:       BOOKING_FEE,
          total:     price + BOOKING_FEE,
          payment:   selectedPayment,
          status:    "Confirmed",
          bookedAt:  new Date().toISOString(),
        };

        const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
        bookings.push(booking);
        localStorage.setItem("bookings",    JSON.stringify(bookings));
        localStorage.setItem("lastBooking", JSON.stringify(booking));
        localStorage.removeItem("selectedSeat");

        showMsg(msg, `✅ Booking confirmed! Reference: ${booking.id}`, "success");
        confirmBtn.disabled         = true;
        confirmBtn.textContent      = "Booking Confirmed!";
        confirmBtn.style.background = "#0f6e56";

        // Absolute path so redirect works from pages/user/booking.html
        setTimeout(() => { window.location.href = "/pages/user/my-bookings.html"; }, 2000);
      });
    }

    loadBookingData();

  } // end .booking-container

  // ===========================================================
  // MY BOOKINGS PAGE
  // ===========================================================
  if (document.querySelector(".my-bookings-container")) {

    function formatDate(iso) {
      if (!iso) return "—";
      try {
        return new Date(iso).toLocaleDateString("en-PH", {
          year: "numeric", month: "long", day: "numeric",
          hour: "2-digit", minute: "2-digit",
        });
      } catch { return iso; }
    }

    function renderBookings() {
      const container = document.getElementById("bookingsList");
      const emptyMsg  = document.getElementById("emptyBookings");
      if (!container) return;

      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]").slice().reverse();

      if (bookings.length === 0) {
        container.innerHTML = "";
        if (emptyMsg) emptyMsg.style.display = "block";
        return;
      }
      if (emptyMsg) emptyMsg.style.display = "none";

      container.innerHTML = bookings.map(b => {
        const statusKey   = (b.status || "confirmed").toLowerCase();
        const isCancelled = statusKey === "cancelled";
        return `
        <div class="booking-card">
          <div class="booking-card-header">
            <span class="booking-ref">${b.id}</span>
            <span class="booking-status status-${statusKey}">${b.status || "Confirmed"}</span>
          </div>
          <div class="booking-card-body">
            <div class="booking-row"><span class="booking-label">🛣️ Route</span>      <span class="booking-value">${b.route}</span></div>
            <div class="booking-row"><span class="booking-label">🕐 Departure</span>  <span class="booking-value">${formatTime(b.departure)}</span></div>
            <div class="booking-row"><span class="booking-label">🚌 Bus Type</span>   <span class="booking-value">${b.busType || "Standard"}</span></div>
            <div class="booking-row"><span class="booking-label">💺 Seat</span>       <span class="booking-value">${b.seat && b.seat !== "—" ? "Seat " + b.seat : "—"}</span></div>
            <div class="booking-row"><span class="booking-label">👤 Passenger</span>  <span class="booking-value">${b.passenger}</span></div>
            <div class="booking-row"><span class="booking-label">📧 Email</span>      <span class="booking-value">${b.email}</span></div>
            <div class="booking-row"><span class="booking-label">📞 Phone</span>      <span class="booking-value">${b.phone}</span></div>
            <div class="booking-row"><span class="booking-label">💳 Payment</span>    <span class="booking-value">${b.payment}</span></div>
            <div class="booking-row booking-row-total">
              <span class="booking-label">💰 Total Paid</span>
              <span class="booking-value booking-total">₱${Number(b.total).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="booking-row"><span class="booking-label">📅 Booked On</span>  <span class="booking-value">${formatDate(b.bookedAt)}</span></div>
          </div>
          <div class="booking-card-footer">
            ${isCancelled
              ? `<span class="cancelled-note">Booking cancelled</span>`
              : `<button class="btn-cancel-booking" onclick="cancelBooking('${b.id}')">Cancel Booking</button>`
            }
          </div>
        </div>`;
      }).join("");
    }

    window.cancelBooking = function (id) {
      if (!confirm("Are you sure you want to cancel this booking?")) return;
      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      const updated  = bookings.map(b => b.id === id ? { ...b, status: "Cancelled" } : b);
      localStorage.setItem("bookings", JSON.stringify(updated));
      renderBookings();
    };

    window.clearAllBookings = function () {
      if (!confirm("Clear ALL bookings? This cannot be undone.")) return;
      localStorage.removeItem("bookings");
      localStorage.removeItem("lastBooking");
      renderBookings();
    };

    renderBookings();

  } // end .my-bookings-container

}); // end DOMContentLoaded
