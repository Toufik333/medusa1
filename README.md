# MONO.STUDIO — Modern Minimalist Storefront & 4:5 Admin Post Studio

A complete, production-ready full-stack e-commerce application built with **React + Vite + Tailwind CSS** (Frontend) and **Node.js + Express + PostgreSQL** (Backend).

Designed for zero-friction deployment on **Vercel** (Frontend) and **Heroku** (Backend), featuring a **strictly separated, secure `/admin` portal**, **Cash on Delivery (COD)** checkout, interactive **4:5 image cropping**, and an architected **bKash payment gateway slot** in the backend.

---

## Key Features

1. **Dedicated & Isolated Admin Portal (`/admin`)**:
   - The Admin Panel is completely separated from the storefront customer experience.
   - Accessing `/admin` requires passing through a modern, secure login gate.
   - Customers browsing the storefront (`/`) experience a clean, distraction-free shop with zero internal controls, test badges, or developer cues.
   - Authenticated admins can inspect live orders, manage inventory, create coupons, and configure seasonal campaign banners.
   - Signed-in admin bar displays active identity with a one-click **Sign Out** button.

2. **Admins Configured Exclusively via Environment Variables**:
   - Admin accounts can **ONLY** be added, edited, or removed through environment variables (`ADMIN_USERS` in `backend/.env` or Heroku config vars).
   - Format: JSON array of admin objects (or comma-separated `email:password:name` entries).
   - Supports standard `bcryptjs` password hashes (`$2a$...`) as well as secure plain strings.
   - Backend issues signed **JWT session tokens** (24-hour expiration) for authorized endpoints.

3. **Enterprise Production Security & Hardening**:
   - **Input Sanitization & XSS Escaping**: Automated recursive HTML entity escaping and sanitization for all request bodies and query parameters.
   - **Strict Schema Validation & Tamper Protection**: Rigorous bounding and field-stripping middleware blocks client payload tampering on products and orders.
   - **Rate Limiting**: `express-rate-limit` prevents brute-force login attacks (10 attempts / 15 minutes) and checkout spam (30 orders / hour).
   - **Security Headers & Helmet**: `helmet` enabled on backend, and strict HTTP headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, HSTS) configured in `frontend/vercel.json`.
   - **Enforced HTTPS**: Automatic SSL redirection on production proxies (`x-forwarded-proto`).
   - **Zero Demo / Trial Traces**: Pure customer-facing checkout with clean order confirmation screens, zero test badges, and zero internal links.

4. **Strict 4:5 Uniform Image Cropping & Alignment**:
   - Built-in interactive 4:5 aspect ratio image cropper in the Admin Post Studio with mouse/touch drag-to-pan and zoom controls.
   - Live side-by-side card preview ensures every photo is identically proportioned before publishing so no card ever looks stretched, uneven, or misaligned on the storefront.
   - Canvas-based 4:5 export (800×1000px) directly saves cropped data.

5. **Conditional Clothing Size Selector**:
   - **Clothing / Apparel**: Admin can toggle S, M, L, XL sizes. On the storefront, the product card displays interactive size selector pills and requires the customer to choose a size before adding to bag.
   - **Non-Clothing (Accessories / Gear)**: Size options are **strictly hidden** in both the Admin post form and storefront cards, displaying a minimal "Universal Spec" badge instead.

6. **Curated Featured Board & Search**:
   - Curated drop highlights with star badges.
   - Real-time search across titles, subtitles, and categories.

7. **Special Discount Campaign Manager**:
   - Admin can activate/pause a top announcement bar and hero banner.
   - Customizable badge, headline, subtext, and featured promo code chip.

8. **Discount Coupon Engine**:
   - Admin can create coupons with custom percentage discounts (1–90%).
   - **One-click Activate / Deactivate Toggle**: Deactivating a coupon instantly blocks it from being applied in customer checkout.

9. **Payment System (COD Active + bKash Ready)**:
   - **Customer Checkout**: Exclusively **Cash on Delivery (COD)** with automated delivery fee calculation (৳60 Dhaka Metro / ৳120 Outside Dhaka).
   - **bKash Digital Payment Gateway**: Fully architected backend routes (`/api/payments/bkash/create`, `/api/payments/bkash/callback`, `/api/payments/bkash/status/:orderId`) and PostgreSQL columns (`bkash_payment_id`, `bkash_trx_id`, `payment_status`) ready for your future bKash merchant credentials.

---

## Admin Environment Configuration

In your `backend/.env` (or Heroku Config Vars):

```env
# Admin Users (JSON array or comma-separated)
ADMIN_USERS='[{"email":"admin@mono.studio","password":"admin12345!","name":"Master Admin"},{"email":"toufik@mono.studio","password":"toufikSecure2026!","name":"Toufik"}]'

# JWT Secret for signing admin sessions
JWT_SECRET=your_super_secret_jwt_key_here
```

### Pre-configured Demo Admins for Testing:
| Admin Name | Email | Password |
|---|---|---|
| Master Admin | `admin@mono.studio` | `admin12345!` |
| Toufik | `toufik@mono.studio` | `toufikSecure2026!` |

---

## Quick Start (Local Development)

```bash
# Terminal 1: Backend API (http://localhost:5000)
npm run dev:backend

# Terminal 2: Frontend (http://localhost:3000)
npm run dev:frontend
```

* **Customer Storefront**: [http://localhost:3000/](http://localhost:3000/)
* **Secure Admin Portal**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Deployment Guide

### Deploy Backend to Heroku

1. **Create Heroku App & Provision Postgres**:
   ```bash
   heroku create your-mono-store-api
   heroku addons:create heroku-postgresql:essential-0
   ```

2. **Configure Environment Variables**:
   ```bash
   heroku config:set ADMIN_USERS='[{"email":"admin@mono.studio","password":"YourSecretPassword","name":"Admin"}]'
   heroku config:set JWT_SECRET=random_secure_jwt_secret_key_64_chars
   heroku config:set ALLOWED_ORIGIN=https://your-store.vercel.app
   ```

3. **Deploy Backend Subtree**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Deploy Frontend to Vercel

1. Import your GitHub repository in [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. In **Environment Variables**, set:
   ```env
   VITE_API_URL=https://your-mono-store-api.herokuapp.com
   ```
4. Deploy!
