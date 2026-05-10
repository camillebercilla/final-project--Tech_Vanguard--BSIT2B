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

/* ─── PURGE STALE localStorage SEED DATA ─── */
(function purgeLocalStorageSeedData() {
  try {
    localStorage.removeItem('qr_trips');
    localStorage.removeItem('qr_bookings');
    localStorage.removeItem('qr_users');
  } catch(e) {
    console.warn('[QuickReserve] Could not purge seed data:', e);
  }
})();

/* ─── BOOKINGS CRUD (localStorage fallback) ─── */
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

/* ─── TRIPS CRUD (localStorage fallback) ─── */
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

/* ─── USERS CRUD (localStorage fallback) ─── */
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
  const authContainer = document.getElementById('nav-auth-btns');
  const linksContainer = document.getElementById('nav-links');
  if (!authContainer) return;

  const u = Auth.currentUser();

  /* ── GUEST (not logged in) ── */
  if (!u || (!u.id && !u._id) || !u.name) {
    if (linksContainer) {
      linksContainer.innerHTML =
        '<li class="nav-item"><a class="nav-link" href="' + toRoot('index.html') + '">Home</a></li>' +
        '<li class="nav-item"><a class="nav-link" href="' + toRoot('index.html') + '#routes">Routes</a></li>' +
        '<li class="nav-item"><a class="nav-link" href="' + toRoot('pages/user/check-status.html') + '">Booking</a></li>';
    }
    authContainer.innerHTML =
      '<a href="' + toRoot('pages/auth/login.html') + '" class="nav-login">Login</a>' +
      '<a href="' + toRoot('pages/auth/register.html') + '" class="btn-register">Register</a>';
    return;
  }

  /* ── ADMIN ── */
  if (u.role === 'admin') {
    if (linksContainer) {
      linksContainer.innerHTML =
        '<li class="nav-item"><a class="nav-link" href="' + toRoot('index.html') + '">Home</a></li>' +
        '<li class="nav-item"><a class="nav-link" href="' + toRoot('index.html') + '#routes">Routes</a></li>' +
        '<li class="nav-item"><a class="nav-link" href="' + toRoot('pages/admin/admin-mainDashboard.html') + '">Panel</a></li>' +
        '<li class="nav-item"><a class="nav-link" href="' + toRoot('pages/user/profile.html') + '">Profile</a></li>';
    }
    authContainer.innerHTML =
      '<span style="color:rgba(255,255,255,0.75);font-size:13px;font-weight:500">Hi, ' + u.name.split(' ')[0] + ' 👋</span>' +
      '<a href="' + toRoot('pages/admin/admin-mainDashboard.html') + '" class="btn-register" style="background:#16c4a1;border-color:#16c4a1">Admin Panel</a>' +
      '<button onclick="Auth.logout();window.location.href=toRoot(\'index.html\')" class="nav-login" style="cursor:pointer">Logout</button>';
    return;
  }

  /* ── REGULAR USER ── */
  if (linksContainer) {
    linksContainer.innerHTML =
      '<li class="nav-item"><a class="nav-link" href="' + toRoot('index.html') + '">Home</a></li>' +
      '<li class="nav-item"><a class="nav-link" href="' + toRoot('index.html') + '#routes">Routes</a></li>' +
      '<li class="nav-item"><a class="nav-link" href="' + toRoot('pages/user/check-status.html') + '">Booking</a></li>' +
      '<li class="nav-item"><a class="nav-link" href="' + toRoot('pages/user/profile.html') + '">Profile</a></li>';
  }
  authContainer.innerHTML =
    '<span style="color:rgba(255,255,255,0.75);font-size:13px;font-weight:500">Hi, ' + u.name.split(' ')[0] + '</span>' +
    '<button onclick="Auth.logout();window.location.href=toRoot(\'index.html\')" class="nav-login" style="cursor:pointer">Logout</button>';
}

/* ─── TOAST (floating box for pages without a #toast element) ─── */
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
  if (!dateVal) dateVal = new Date().toISOString().split('T')[0];
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