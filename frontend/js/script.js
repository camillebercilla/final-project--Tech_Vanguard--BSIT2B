document.addEventListener("DOMContentLoaded", function () {

  // ================= SCROLL FADE ANIMATION =================
  const fadeSelectors = [
    ".fade",
    ".step-box",
    ".why-btn",
    ".btn-start",
    ".card"
  ];

  const allFadeEls = document.querySelectorAll(fadeSelectors.join(","));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 }
  );

  allFadeEls.forEach((el) => observer.observe(el));

  // ================= SEARCH TRIP =================
  window.searchTrip = function () {
    const from = "Albay";
    const to   = document.getElementById("to")?.value;
    const date = document.getElementById("date")?.value;

    if (!to || !date) {
      alert("Please enter destination and date");
      return;
    }

    window.location.href = `results.html?from=${from}&to=${to}&date=${date}`;
  };

  // ================= SEAT SELECTION =================
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("seat") &&
      !e.target.classList.contains("booked")
    ) {
      e.target.classList.toggle("selected");
    }
  });

  // ================= FORM VALIDATION =================
  const form = document.getElementById("registerForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      const password = document.getElementById("password")?.value;
      const confirm  = document.getElementById("confirmPassword")?.value;

      if (!password || !confirm) return;

      if (password.length < 6) {
        e.preventDefault();
        alert("Password must be at least 6 characters");
        return;
      }

      if (password !== confirm) {
        e.preventDefault();
        alert("Passwords do not match");
        return;
      }
    });
  }

  // =============================================
  // ADMIN DASHBOARD LOGIC
  // =============================================
  if (document.querySelector(".dash-wrapper")) {

    let trips = JSON.parse(localStorage.getItem("trips") || "[]");

    // ---- SIDEBAR NAVIGATION ----
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
        document.getElementById("pageTitle").textContent    = labels[section][0];
        document.getElementById("pageSubtitle").textContent = labels[section][1];
      });
    });

    // ---- ADD TRIP FORM ----
    const tripForm = document.getElementById("tripForm");
    if (tripForm) {
      tripForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const route     = document.getElementById("route").value.trim();
        const price     = parseFloat(document.getElementById("price").value);
        const departure = document.getElementById("departure").value;
        const busType   = document.getElementById("busType").value;
        const msg       = document.getElementById("message");

        if (!route || !price) {
          showMessage(msg, "Please fill in Route and Price.", "danger");
          return;
        }

        const trip = {
          id:        Date.now(),
          route,
          price,
          departure: departure || "—",
          busType:   busType   || "Standard",
        };

        trips.push(trip);
        saveTrips();
        renderTable();
        updateStats();
        this.reset();
        showMessage(msg, `✅ Trip "${route}" added successfully!`, "success");
      });
    }

    // ---- RENDER TABLE ----
    function renderTable(filter = "") {
      const tbody    = document.getElementById("tripTable");
      if (!tbody) return;
      const filtered = trips.filter(t =>
        t.route.toLowerCase().includes(filter.toLowerCase())
      );

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
          <td>
            <button class="btn-delete" onclick="deleteTrip(${t.id})">Delete</button>
          </td>
        </tr>
      `).join("");
    }

    // ---- DELETE TRIP ----
    window.deleteTrip = function (id) {
      if (!confirm("Are you sure you want to delete this trip?")) return;
      trips = trips.filter(t => t.id !== id);
      saveTrips();
      renderTable();
      updateStats();
    };

    // ---- SEARCH ----
    const searchInput = document.getElementById("searchTrip");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        renderTable(this.value);
      });
    }

    // ---- STATS ----
    function updateStats() {
      const statTotal = document.getElementById("statTotalTrips");
      const statRoutes = document.getElementById("statRoutes");
      const statAvg = document.getElementById("statAvgPrice");
      if (statTotal)  statTotal.textContent  = trips.length;
      if (statRoutes) statRoutes.textContent = new Set(trips.map(t => t.route)).size;
      const avg = trips.length
        ? Math.round(trips.reduce((s, t) => s + t.price, 0) / trips.length)
        : 0;
      if (statAvg) statAvg.textContent = `₱${avg.toLocaleString()}`;
    }

    // ---- HELPERS ----
    function saveTrips() {
      localStorage.setItem("trips", JSON.stringify(trips));
    }

    function showMessage(el, text, type) {
      el.innerHTML = `<div class="alert-${type}">${text}</div>`;
      setTimeout(() => el.innerHTML = "", 3000);
    }

    function formatTime(t) {
      if (!t || t === "—") return "—";
      const [h, m] = t.split(":");
      const hour   = parseInt(h);
      const ampm   = hour >= 12 ? "PM" : "AM";
      const h12    = hour % 12 || 12;
      return `${h12}:${m} ${ampm}`;
    }

    // ---- INIT ----
    renderTable();
    updateStats();

  } // end .dash-wrapper

  // =============================================
  // BOOKING PAGE LOGIC
  // =============================================
  if (document.querySelector(".booking-container")) {

    const BOOKING_FEE    = 25;
    let selectedPayment  = "Cash";

    function loadBookingData() {
      const seat      = localStorage.getItem("selectedSeat");
      const route     = localStorage.getItem("selectedRoute")    || "Manila → Quezon";
      const price     = parseFloat(localStorage.getItem("selectedPrice")) || 500;
      const departure = localStorage.getItem("selectedDeparture") || "—";
      const busType   = localStorage.getItem("selectedBusType")   || "Standard";

      document.getElementById("displayRoute").textContent     = route;
      document.getElementById("displayDeparture").textContent = departure;
      document.getElementById("displayBusType").textContent   = busType;
      document.getElementById("displaySeat").textContent      = seat ? `Seat ${seat}` : "—";

      const total = price + BOOKING_FEE;
      document.getElementById("displayPrice").textContent = `₱${price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
      document.getElementById("displayTotal").textContent = `₱${total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
    }

    window.selectPayment = function (el) {
      document.querySelectorAll(".pay-option").forEach(opt => opt.classList.remove("active"));
      el.classList.add("active");
      selectedPayment = el.dataset.method;
    };

    function showBookingMessage(el, text, type) {
      el.textContent  = text;
      el.className    = `b-message ${type}`;
      el.style.display = "block";
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
      return /^(09|\+639)\d{9}$/.test(phone.replace(/\s/g, ""));
    }

    const confirmBtn = document.getElementById("confirmBtn");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        const firstName = document.getElementById("firstName").value.trim();
        const lastName  = document.getElementById("lastName").value.trim();
        const email     = document.getElementById("email").value.trim();
        const phone     = document.getElementById("phone").value.trim();
        const msg       = document.getElementById("message");

        if (!firstName || !lastName || !email || !phone) {
          showBookingMessage(msg, "⚠️ Please fill in all passenger details.", "danger");
          return;
        }
        if (!isValidEmail(email)) {
          showBookingMessage(msg, "⚠️ Please enter a valid email address.", "danger");
          return;
        }
        if (!isValidPhone(phone)) {
          showBookingMessage(msg, "⚠️ Please enter a valid PH phone number.", "danger");
          return;
        }

        const seat  = localStorage.getItem("selectedSeat")  || "—";
        const route = localStorage.getItem("selectedRoute") || "Manila → Quezon";
        const price = parseFloat(localStorage.getItem("selectedPrice")) || 500;

        const booking = {
          id:        "BK-" + Date.now(),
          passenger: `${firstName} ${lastName}`,
          email, phone, route, seat, price,
          fee:       BOOKING_FEE,
          total:     price + BOOKING_FEE,
          payment:   selectedPayment,
          status:    "Confirmed",
          bookedAt:  new Date().toISOString(),
        };

        const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
        bookings.push(booking);
        localStorage.setItem("bookings", JSON.stringify(bookings));
        localStorage.setItem("lastBooking", JSON.stringify(booking));
        localStorage.removeItem("selectedSeat");

        showBookingMessage(msg, `✅ Booking confirmed! Reference: ${booking.id}`, "success");

        confirmBtn.disabled    = true;
        confirmBtn.textContent = "Booking Confirmed!";
        confirmBtn.style.background = "#0f6e56";

        setTimeout(() => { window.location.href = "my-bookings.html"; }, 2000);
      });
    }

    loadBookingData();

  } // end .booking-container

}); // end DOMContentLoaded

// ================= PASSWORD TOGGLE =================
// Must stay outside DOMContentLoaded — called via HTML onclick=""
function togglePassword() {
  const pass    = document.getElementById("password");
  const confirm = document.getElementById("confirmPassword");

  if (!pass || !confirm) return;

  const isHidden = pass.type === "password";
  pass.type      = isHidden ? "text" : "password";
  confirm.type   = isHidden ? "text" : "password";
}