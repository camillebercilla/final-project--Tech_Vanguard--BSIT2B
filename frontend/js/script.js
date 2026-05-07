/* ─── LOCAL STORAGE HELPERS ─── */
const QR = {
  get(k, fallback = null) {
    try {
      const v = localStorage.getItem(k);
      if (v === null || v === undefined) return fallback;
      try { return JSON.parse(v); } catch { return v; }
    } catch { return fallback; }
  },
  set(k, v) {
    try { localStorage.setItem(k, typeof v === 'object' ? JSON.stringify(v) : String(v)); }
    catch(e) { console.warn('QR.set error', e); }
  },
  remove(k) { try { localStorage.removeItem(k); } catch {} },
};

/* ─── PATH HELPER ─── */
function toRoot(rootRelPath) {
  const p = window.location.pathname;
  let prefix = '';
  if (/\/pages\/(admin|auth|user)\//.test(p)) prefix = '../../';
  else if (/\/pages\//.test(p))               prefix = '../';
  return prefix + rootRelPath;
}

/* ─── AUTH ─── */
const Auth = {
  isLoggedIn() {
    const u = this.currentUser();
    return !!u && typeof u === 'object' && !!u.id;
  },
  currentUser() {
    try {
      const raw = localStorage.getItem('qr_user');
      if (!raw) return null;
      const u = JSON.parse(raw);
      return (u && u.id) ? u : null;
    } catch { return null; }
  },
  login(user) {
    localStorage.setItem('qr_user', JSON.stringify(user));
  },
  logout() {
    localStorage.removeItem('qr_user');
    localStorage.removeItem('qr_token');
    window.location.href = toRoot('index.html');
  },
  requireAuth() { return this.isLoggedIn(); },
  requireAdmin() {
    const u = this.currentUser();
    return !!(u && u.role === 'admin');
  },

  /* ── ADMIN GUARD ──
     Checks for admin session. If not found, redirects to login.
     Returns true if admin is logged in, false otherwise. */
  guardAdmin() {
    try {
      const u = this.currentUser();
      if (!u || u.role !== 'admin') {
        console.warn('[QuickReserve] guardAdmin: no admin session. Redirecting to login.', u);
        window.location.replace(toRoot('pages/auth/login.html'));
        return false;
      }
      return true;
    } catch(e) {
      console.error('[QuickReserve] guardAdmin error:', e);
      window.location.replace(toRoot('pages/auth/login.html'));
      return false;
    }
  },

  /* ── DEV BYPASS ──
     Call this to instantly log in as admin for testing.
     Open browser console and type: Auth.devLogin() */
  devLogin() {
    const adminUser = { id: 1, name: 'Admin User', email: 'admin@quickreserve.com', role: 'admin' };
    this.login(adminUser);
    console.log('[QuickReserve] Dev admin login successful. Reloading page...');
    window.location.reload();
  },
};

/* ─── SEED DEFAULT DATA ─── */
function seedData() {
  if (!QR.get('qr_users')) {
    QR.set('qr_users', [
      { id: 1, name: 'Admin User',     email: 'admin@quickreserve.com', password: 'admin123', role: 'admin', phone: '09001234567', joined: '2024-01-01' },
      { id: 2, name: 'Maria Santos',   email: 'maria@example.com',      password: 'user123',  role: 'user',  phone: '09171234567', joined: '2024-06-10' },
      { id: 3, name: 'Juan dela Cruz', email: 'juan@example.com',       password: 'user123',  role: 'user',  phone: '09281234567', joined: '2024-07-22' },
    ]);
  }
  if (!QR.get('qr_trips')) {
    QR.set('qr_trips', [
      { id: 1, route: 'Legazpi City → Sorsogon City', duration: '1-2 hrs',    priceMin: 150, priceMax: 250, departures: ['06:00','09:00','12:00','15:00','18:00'],                     totalSeats: 45 },
      { id: 2, route: 'Legazpi City → Naga City',     duration: '2-3 hrs',    priceMin: 200, priceMax: 350, departures: ['06:00','09:00','12:00','18:00','21:00'],                     totalSeats: 45 },
      { id: 3, route: 'Naga City → Daet',             duration: '3-4 hrs',    priceMin: 300, priceMax: 450, departures: ['07:00','13:00','19:00'],                                    totalSeats: 45 },
      { id: 4, route: 'Iriga City → Naga City',       duration: '1-2 hrs',    priceMin: 150, priceMax: 250, departures: ['06:00','09:00','12:00','15:00','18:00'],                     totalSeats: 45 },
      { id: 5, route: 'Ligao City → Legazpi City',    duration: '30-45 mins', priceMin: 80,  priceMax: 150, departures: ['06:00','08:00','10:00','12:00','14:00','16:00','18:00'],     totalSeats: 45 },
      { id: 6, route: 'Polangui → Legazpi City',      duration: '45-60 mins', priceMin: 60,  priceMax: 120, departures: ['06:00','08:00','10:00','12:00','14:00','16:00','18:00'],     totalSeats: 45 },
    ]);
  }
  if (!QR.get('qr_bookings')) {
    QR.set('qr_bookings', [
      { id: 'QR-0001', userId: 2, userName: 'Maria Santos',   route: 'Legazpi City → Naga City',     seat: 'A1', date: '2026-05-10', departure: '09:00', price: 250, status: 'confirmed', paymentMethod: 'GCash',       createdAt: '2026-04-20' },
      { id: 'QR-0002', userId: 3, userName: 'Juan dela Cruz', route: 'Legazpi City → Sorsogon City', seat: 'B3', date: '2026-05-15', departure: '06:00', price: 200, status: 'confirmed', paymentMethod: 'Cash',        createdAt: '2026-04-21' },
      { id: 'QR-0003', userId: 2, userName: 'Maria Santos',   route: 'Naga City → Daet',             seat: 'C2', date: '2026-04-30', departure: '07:00', price: 350, status: 'pending',   paymentMethod: 'Credit Card', createdAt: '2026-04-22' },
    ]);
  }
}

// Clear stale data and re-seed if routes are missing
(function migrateRouteData() {
  try {
    var trips = localStorage.getItem('qr_trips');
    if (trips && trips.indexOf('Legazpi') === -1) {
      localStorage.removeItem('qr_trips');
      localStorage.removeItem('qr_bookings');
    }
  } catch(e) {}
})();
seedData();

/* ─── BOOKINGS CRUD ─── */
const Bookings = {
  all()        { return QR.get('qr_bookings', []); },
  forUser(uid) { return this.all().filter(b => Number(b.userId) === Number(uid)); },
  byId(id)     { return this.all().find(b => b.id === id); },
  add(booking) {
    const all = this.all();
    const id  = 'QR-' + String(all.length + 1).padStart(4, '0');
    const nb  = { id, ...booking, createdAt: new Date().toISOString().split('T')[0] };
    all.push(nb);
    QR.set('qr_bookings', all);
    return nb;
  },
  update(id, data) {
    const all = this.all();
    const i   = all.findIndex(b => b.id === id);
    if (i > -1) { all[i] = { ...all[i], ...data }; QR.set('qr_bookings', all); }
  },
  cancel(id) { this.update(id, { status: 'cancelled' }); },
  delete(id) { QR.set('qr_bookings', this.all().filter(b => b.id !== id)); },
};

/* ─── TRIPS CRUD ─── */
const Trips = {
  all()    { return QR.get('qr_trips', []); },
  byId(id) { return this.all().find(t => Number(t.id) === Number(id)); },
  add(trip) {
    const all = this.all();
    const id  = Math.max(...all.map(t => t.id), 0) + 1;
    all.push({ id, ...trip });
    QR.set('qr_trips', all);
  },
  update(id, data) {
    const all = this.all();
    const i   = all.findIndex(t => Number(t.id) === Number(id));
    if (i > -1) { all[i] = { ...all[i], ...data }; QR.set('qr_trips', all); }
  },
  delete(id) { QR.set('qr_trips', this.all().filter(t => Number(t.id) !== Number(id))); },
};

/* ─── USERS CRUD ─── */
const Users = {
  all()          { return QR.get('qr_users', []); },
  byId(id)       { return this.all().find(u => Number(u.id) === Number(id)); },
  byEmail(email) { return this.all().find(u => u.email === email); },
  add(user) {
    const all = this.all();
    const id  = Math.max(...all.map(u => u.id), 0) + 1;
    const nu  = { id, role: 'user', joined: new Date().toISOString().split('T')[0], ...user };
    all.push(nu);
    QR.set('qr_users', all);
    return nu;
  },
  update(id, data) {
    const all = this.all();
    const i   = all.findIndex(u => Number(u.id) === Number(id));
    if (i > -1) {
      all[i] = { ...all[i], ...data };
      QR.set('qr_users', all);
      const cur = Auth.currentUser();
      if (cur && Number(cur.id) === Number(id)) Auth.login(all[i]);
    }
  },
  delete(id) { QR.set('qr_users', this.all().filter(u => Number(u.id) !== Number(id))); },
};

/* ─── SEAT HELPERS ─── */
const Seats = {
  _key(route, date, dep) {
    return ('seats_' + route + '_' + date + '_' + dep)
      .replace(/\s*→\s*/g, '_').replace(/\s+/g, '_');
  },
  getTaken(route, date, dep) { return QR.get(this._key(route, date, dep), []); },
  book(route, date, dep, seat) {
    const key = this._key(route, date, dep);
    const t   = QR.get(key, []);
    if (!t.includes(seat)) { t.push(seat); QR.set(key, t); }
  },
  free(route, date, dep, seat) {
    const key = this._key(route, date, dep);
    QR.set(key, QR.get(key, []).filter(s => s !== seat));
  },
};

/* ─── NAVBAR ─── */
function renderNavUser() {
  const container = document.getElementById('nav-auth-btns');
  if (!container) return;
  const u = Auth.currentUser();
  if (u && u.id) {
    container.innerHTML =
      '<span style="color:rgba(255,255,255,0.75);font-size:13px;font-weight:500">Hi, ' + u.name.split(' ')[0] + '</span>' +
      (u.role === 'admin' ? '<a href="' + toRoot('pages/admin/admin-dashboard.html') + '" class="btn-register">Admin</a>' : '') +
      '<button onclick="Auth.logout()" class="nav-login" style="cursor:pointer">Logout</button>';
  } else {
    container.innerHTML =
      '<a href="' + toRoot('pages/auth/login.html') + '" class="nav-login">Login</a>' +
      '<a href="' + toRoot('pages/auth/register.html') + '" class="btn-register">Register</a>';
  }
}

/* ─── TOAST ─── */
function showToast(msg, type) {
  type = type || 'success';
  let box = document.getElementById('qr-toast-box');
  if (!box) {
    box = document.createElement('div');
    box.id = 'qr-toast-box';
    box.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none';
    document.body.appendChild(box);
  }
  const t  = document.createElement('div');
  const bg = type === 'error' ? '#dc2626' : type === 'warning' ? '#d97706' : '#0f6e56';
  t.style.cssText = 'background:' + bg + ';color:#fff;padding:12px 20px;border-radius:10px;font-size:13.5px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,0.2);font-family:Poppins,sans-serif;max-width:320px';
  t.textContent = msg;
  box.appendChild(t);
  setTimeout(function() { t.remove(); }, 3000);
}

/* ─── CONFIRM ─── */
function confirmAction(msg, cb) { if (window.confirm(msg)) cb(); }

/* ─── FORMATTERS ─── */
function formatDate(d) {
  if (!d) return '—';
  try { return new Date(d + 'T00:00:00').toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return d; }
}
function formatPeso(n) { return '₱' + Number(n || 0).toLocaleString(); }

/* ─── SEARCH / BOOK ─── */
function searchTrip() {
  const fromEl = document.getElementById('from');
  const from   = fromEl ? fromEl.value.trim() : 'Legazpi City';
  const to     = (document.getElementById('to') ? document.getElementById('to').value : '').trim();
  const date   = document.getElementById('date') ? document.getElementById('date').value : '';
  if (!from) { showToast('Please enter an origin.', 'error'); return; }
  if (!to)   { showToast('Please enter a destination.', 'error'); return; }
  if (!date) { showToast('Please select a travel date.', 'error'); return; }
  localStorage.setItem('selectedRoute',    from + ' → ' + to);
  localStorage.setItem('selectedDuration', 'varies');
  localStorage.setItem('selectedPriceMin', '0');
  localStorage.setItem('selectedPriceMax', '0');
  localStorage.setItem('selectedDate',     date);
  localStorage.removeItem('selectedSeat');
  window.location.href = toRoot('seats.html');
}

function quickBook(origin, destination, routeKey, priceMin, priceMax, duration) {
  var dateEl  = document.getElementById('date');
  var dateVal = dateEl ? dateEl.value : '';

  // If no date selected by user, default to today
  if (!dateVal) {
    dateVal = new Date().toISOString().split('T')[0];
  }

  localStorage.setItem('selectedRoute',    origin + ' → ' + destination);
  localStorage.setItem('selectedDuration', duration);
  localStorage.setItem('selectedPriceMin', String(priceMin));
  localStorage.setItem('selectedPriceMax', String(priceMax));
  localStorage.setItem('selectedDate',     dateVal);
  localStorage.removeItem('selectedSeat');
  window.location.href = toRoot('seats.html');
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', function() {
  renderNavUser();
  var dateEl = document.getElementById('date');
  if (dateEl && !dateEl.value) dateEl.min = new Date().toISOString().split('T')[0];
});