# PerfumeGo — Luxury Fragrance House & 4:5 Admin Post Studio

A complete, production-ready full-stack e-commerce application built with **React + Vite + Tailwind CSS** (Frontend) and **Node.js + Express + PostgreSQL** (Backend).

Designed for zero-friction deployment on **Vercel** (Frontend) and **Heroku** (Backend), featuring a **strictly separated, secure `/admin` portal**, **Cash on Delivery (COD)** checkout, interactive **4:5 image cropping**, and an architected **bKash payment gateway slot** in the backend.

---

## Brand Identity & Assets

- **Brand Name**: PerfumeGo
- **Brand Monogram**: Circular PG luxury gold crest encircled by botanical wreaths
- **Logo Asset**: `frontend/public/logo.png`
- **Favicon Assets**: `frontend/public/favicon.png` & `frontend/public/favicon-32x32.png`

---

## Key Features

1. **Dedicated & Isolated Admin Portal (`/admin`)**:
   - The Admin Panel is completely separated from the storefront customer experience.
   - Accessing `/admin` requires passing through a modern, secure login gate with the PerfumeGo brand seal.
   - Customers browsing the storefront (`/`) experience a clean, distraction-free shop with zero internal controls, test badges, or developer cues.
   - Authenticated admins can inspect live orders, manage inventory, create coupons, and configure seasonal campaign banners.
   - Signed-in admin bar displays active identity with a one-click **Sign Out** button.

2. **Admins Configured Exclusively via Environment Variables**:
   - Admin accounts can **ONLY** be added, edited, or removed through environment variables (`ADMIN_USERS` in `backend/.env` or Heroku config vars).
   - Format: JSON array of admin objects, unquoted objects, or colon-separated entries (`email:password:name,email2:password:name2`).
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
   - Live side-by-side card preview ensures every perfume bottle photo is identically proportioned before publishing so no card ever looks stretched, uneven, or misaligned on the storefront.
   - Canvas-based 4:5 export (800×1000px) directly saves cropped data.

5. **Conditional Clothing Size Selector**:
   - **Clothing / Apparel**: Admin can toggle S, M, L, XL sizes. On the storefront, the product card displays interactive size selector pills and requires the customer to choose a size before adding to bag.
   - **Non-Clothing (Perfumes, Extraits, Gift Sets)**: Size options are **strictly hidden** in both the Admin post form and storefront cards, displaying a minimal "Universal Spec" badge instead.

6. **Curated Featured Board & Search**:
   - Curated perfume drop highlights with star badges.
   - Real-time search across titles, notes, and categories.

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

## Architectural Limitations & Upgrade Roadmap

The current architecture is optimized for speed, low operating costs, and fast deployment. Below is a breakdown of technical characteristics and recommended upgrade paths as the business scales:

### 1. Image Storage (Base64 in DB vs Cloud CDN)
- **Current State**: The 4:5 image studio saves cropped canvas data as compressed base64 strings directly inside the PostgreSQL database (`image_url` column), with a 15MB request limit.
- **Limitation**: Excellent for small catalogs (up to ~100–150 products). For catalogs with thousands of high-resolution product photos, storing image blobs in the database increases backup size and API payload weights.
- **Upgrade Path**: When catalog size grows past 150 items, integrate a cloud media storage provider (e.g., Cloudinary, AWS S3, or Supabase Storage) to serve assets via CDN and save only the lightweight URL in PostgreSQL.

### 2. Server Dyno Lifecycle (Cold Starts on Eco Dynos)
- **Current State**: Heroku runs the Node.js backend.
- **Limitation**: If deployed on Heroku Eco/Mini dynos, the container sleeps after 30 minutes of inactivity. The first visitor after idle periods may experience a 5–8 second cold-start delay before subsequent sub-100ms responses.
- **Upgrade Path**: Keep the dyno warm by pinging `/api/health` every 10–14 minutes using a free monitor (e.g. UptimeRobot or Cron-job.org), or upgrade to a Heroku Basic dyno ($7/mo) which runs 24/7 without sleeping.

### 3. Database Capacity (Heroku Postgres Essential Plan)
- **Current State**: Managed PostgreSQL instance (`heroku-postgresql:essential-0`).
- **Limitation**: Includes 1 GB storage, up to 10,000,000 rows, and a maximum of 20 concurrent database connections.
- **Impact**: Provides ample capacity for tens of thousands of customer orders. Only high-volume stores with extensive database requirements need larger plans.

### 4. Payment Gateway (Cash on Delivery Active)
- **Current State**: Storefront checkout is exclusively Cash on Delivery (COD). Backend routes and schema columns for bKash digital payment are architected and ready.
- **Limitation**: Customers cannot pay via Visa/Mastercard or instant mobile wallet during checkout. COD orders require manual telephone confirmation to verify delivery intent before dispatch.
- **Upgrade Path**: Supply your bKash merchant credentials to the existing backend endpoints to activate digital payments.

### 5. Customer Accounts (Guest Checkout Architecture)
- **Current State**: Minimalist guest checkout requiring only Name, Phone, and Delivery Address.
- **Limitation**: Customers do not have an authenticated buyer account portal (`/my-account`) to view past orders or save credit card details.
- **Impact**: Guest checkout provides high conversion rates for mobile fragrance shoppers. All customer details and orders are tracked and managed by the store manager in `/admin`.

### 6. Order Notifications (Manual Call vs Transactional SMS)
- **Current State**: Orders appear instantly in `/admin` with customer phone number and delivery address for dispatch confirmation.
- **Limitation**: Automated outbound SMS messages (e.g. order confirmation text messages) are not pre-integrated.
- **Upgrade Path**: Connect an SMS gateway API (such as Greenweb or BulkSMS BD) to send automated parcel tracking texts on order placement.

---

## Admin Environment Configuration

In your `backend/.env` (or Heroku Config Vars):

```env
# Admin Users (JSON array or colon-separated list)
ADMIN_USERS='[{"email":"admin@example.com","password":"ChangeThisPasswordNow!","name":"Primary Admin"},{"email":"manager@example.com","password":"RandomSecurePassword987!","name":"Store Manager"}]'

# JWT Secret for signing admin sessions
JWT_SECRET=replace_with_a_random_64_character_hex_string
```

Alternatively, colon-separated format (avoids shell escaping issues):
```env
ADMIN_USERS='admin@example.com:ChangeThisPasswordNow!:Primary Admin,manager@example.com:RandomSecurePassword987!:Store Manager'
```

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
   heroku create your-store-api
   heroku addons:create heroku-postgresql:essential-0
   ```

2. **Configure Environment Variables**:
   ```bash
   heroku config:set ADMIN_USERS='admin@example.com:YourStrongPassword!:Admin' -a your-store-api
   heroku config:set JWT_SECRET=random_secure_jwt_secret_key_64_chars -a your-store-api
   heroku config:set ALLOWED_ORIGIN=* -a your-store-api
   ```

3. **Deploy Backend Subtree**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Deploy Frontend to Vercel

1. Import your GitHub repository in [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend` (or leave as root, both are supported).
3. In **Environment Variables**, set:
   ```env
   VITE_API_URL=https://your-store-api.herokuapp.com
   ```
4. Deploy!
