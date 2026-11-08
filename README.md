# MONO.STUDIO — Modern Minimalist Storefront & 4:5 Admin Post Studio

A complete, production-ready full-stack e-commerce application built with **React + Vite + Tailwind CSS** (Frontend) and **Node.js + Express + PostgreSQL** (Backend).

Designed for seamless deployment on **Vercel** (Frontend) and **Heroku** (Backend), with **Cash on Delivery (COD)** checkout and an architected **bKash payment gateway slot** in the backend ready for merchant credentials.

---

## Key Features

1. **Strict 4:5 Uniform Image Cropping & Alignment**:
   - Built-in interactive 4:5 aspect ratio image cropper in the Admin Panel with mouse/touch drag-to-pan and zoom controls.
   - Live side-by-side card preview ensures every photo is identically proportioned before publishing so no card ever looks stretched, uneven, or misaligned on the storefront.
   - Canvas-based 4:5 export (800x1000px) directly saves cropped data.

2. **Conditional Clothing Size Selector**:
   - **Clothing / Apparel**: Admin can toggle S, M, L, XL sizes. On the storefront, the product card displays interactive size selector pills and requires the customer to choose a size before adding to bag.
   - **Non-Clothing (Accessories / Gear)**: Size options are **strictly hidden** in both the Admin post form and storefront cards, displaying a minimal "Universal Spec" badge instead.

3. **Curated Featured Board**:
   - Star/pin items from the Admin Panel to display them in the top "Featured Board" section.

4. **Special Discount Campaign Manager**:
   - Admin can activate/pause a top announcement bar and hero banner.
   - Customizable badge, headline, subtext, and featured promo code chip.

5. **Discount Coupon Engine**:
   - Admin can create coupons with custom percentage discounts (1–90%).
   - **One-click Activate / Deactivate Toggle**: Deactivating a coupon instantly blocks it from being applied in customer checkout.

6. **Payment System (COD + bKash Ready)**:
   - **Customer Checkout**: Exclusively **Cash on Delivery (COD)** with automated delivery fee calculation (৳60 Dhaka Metro / ৳120 Outside Dhaka).
   - **bKash Digital Payment Gateway**: Fully architected backend routes (`/api/payments/bkash/create`, `/api/payments/bkash/callback`, `/api/payments/bkash/status/:orderId`) and PostgreSQL columns (`bkash_payment_id`, `bkash_trx_id`, `payment_status`) ready for your future bKash merchant credentials.

7. **Pre-seeded Demo Database**:
   - Includes demo products (Hoodies, Cargo Pants, Oxford Shirt with sizes; Leather Cardholder, Backpack, Tumbler without sizes), active coupons (`WINTER15`, `WELCOME10`), active seasonal campaign, and sample customer order.

---

## Project Structure

```
├── backend/                  # Node.js + Express + PostgreSQL (Heroku ready)
│   ├── Procfile              # Heroku process definition (web: node src/server.js)
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── config/db.js      # PostgreSQL connection pool with in-memory fallback
│       ├── controllers/      # Products, Coupons, Campaigns, Orders, Payments
│       ├── routes/           # REST API routes
│       ├── db/               # PostgreSQL schema & demo seed script
│       └── server.js         # Express server with CORS & 15MB payload support
│
├── frontend/                 # React + Vite + Tailwind CSS (Vercel ready)
│   ├── package.json
│   ├── vite.config.js        # Configured with proxy to localhost:5000
│   ├── tailwind.config.js    # Custom 4:5 aspect ratio utilities
│   ├── vercel.json           # Vercel SPA rewrite rule
│   ├── .env.example          # VITE_API_URL configuration
│   └── src/
│       ├── api/client.js     # API integration with fallback resilience
│       ├── components/       # Storefront & Admin components
│       │   ├── AdminPanel/   # 4:5 Cropper, Product, Coupon, Campaign, Order managers
│       │   ├── Navbar.jsx
│       │   ├── CampaignBanner.jsx
│       │   ├── FeaturedBoard.jsx
│       │   ├── ProductCard.jsx
│       │   ├── ProductImageFrame.jsx
│       │   ├── CartDrawer.jsx
│       │   └── Toast.jsx
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
└── package.json              # Root helper scripts
```

---

## Quick Start (Local Development)

### 1. Run the Backend
```bash
# In first terminal:
npm run dev:backend
# Server runs on http://localhost:5000
# Healthcheck: http://localhost:5000/api/health
```

### 2. Run the Frontend
```bash
# In second terminal:
npm run dev:frontend
# Vite opens on http://localhost:3000
```

Switch between the **Storefront** and **Admin Panel** anytime using the top mode switch buttons in the header.

---

## Deployment Guide

### Deploy Backend to Heroku
1. Push the `backend` directory to your Heroku app:
   ```bash
   git subtree push --prefix backend heroku main
   ```
2. Attach a PostgreSQL database to your Heroku app:
   ```bash
   heroku addons:create heroku-postgresql:essential-0
   ```
   *(Heroku will automatically populate `DATABASE_URL` in your app settings)*
3. Set your CORS origin:
   ```bash
   heroku config:set ALLOWED_ORIGIN=https://your-store.vercel.app
   ```

### Deploy Frontend to Vercel
1. Import your GitHub repository in [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. In **Environment Variables**, set:
   ```env
   VITE_API_URL=https://your-heroku-app-name.herokuapp.com
   ```
4. Deploy!
