// API Client for Storefront & Admin Panel
// Supports Vercel -> Heroku production URL via VITE_API_URL, or local /api proxy

const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';

export const authStorage = {
  getToken: () => localStorage.getItem('admin_token'),
  setToken: (token) => localStorage.setItem('admin_token', token),
  removeToken: () => localStorage.removeItem('admin_token'),
  getAdmin: () => {
    try {
      const data = localStorage.getItem('admin_profile');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setAdmin: (admin) => localStorage.setItem('admin_profile', JSON.stringify(admin)),
  removeAdmin: () => localStorage.removeItem('admin_profile')
};

async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = authStorage.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 401 && endpoint.includes('/admin/')) {
        // Token expired or invalid
        authStorage.removeToken();
        authStorage.removeAdmin();
      }
      const errorMsg = data?.error || data?.message || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(errorMsg);
    }

    return { data, isOnline: true };
  } catch (err) {
    return { error: err.message, isOnline: false };
  }
}

export const api = {
  // Admin Authentication
  adminLogin: async (email, password) => {
    const res = await fetchJson('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.data?.token) {
      authStorage.setToken(res.data.token);
      authStorage.setAdmin(res.data.admin);
    }
    return res;
  },

  adminGetMe: () => fetchJson('/api/admin/me'),

  adminLogout: () => {
    authStorage.removeToken();
    authStorage.removeAdmin();
  },

  // Health
  checkHealth: () => fetchJson('/api/health'),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.featured) query.append('featured', 'true');
    const qs = query.toString() ? `?${query.toString()}` : '';
    return fetchJson(`/api/products${qs}`);
  },

  createProduct: (payload) => fetchJson('/api/products/admin', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  updateProduct: (id, payload) => fetchJson(`/api/products/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),

  toggleFeatured: (id) => fetchJson(`/api/products/admin/${id}/featured`, {
    method: 'PATCH'
  }),

  deleteProduct: (id) => fetchJson(`/api/products/admin/${id}`, {
    method: 'DELETE'
  }),

  // Coupons
  getCoupons: () => fetchJson('/api/coupons'),
  getActiveCoupons: () => fetchJson('/api/coupons/active'),
  validateCoupon: (code) => fetchJson('/api/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code })
  }),
  createCoupon: (payload) => fetchJson('/api/coupons/admin', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  toggleCoupon: (id) => fetchJson(`/api/coupons/admin/${id}/toggle`, {
    method: 'PATCH'
  }),
  deleteCoupon: (id) => fetchJson(`/api/coupons/admin/${id}`, {
    method: 'DELETE'
  }),

  // Campaign
  getCampaign: () => fetchJson('/api/campaign'),
  updateCampaign: (payload) => fetchJson('/api/campaign/admin', {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  toggleCampaign: () => fetchJson('/api/campaign/admin/toggle', {
    method: 'PATCH'
  }),

  // Orders
  getOrders: (status) => {
    const qs = status && status !== 'All' ? `?status=${status}` : '';
    return fetchJson(`/api/orders/admin/all${qs}`);
  },
  createOrder: (payload) => fetchJson('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateOrderStatus: (id, payload) => fetchJson(`/api/orders/admin/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),

  // bKash (Reserved)
  getBkashStatus: (orderId) => fetchJson(`/api/payments/bkash/status/${orderId}`)
};
