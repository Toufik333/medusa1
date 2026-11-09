const db = require('../config/db');
const { DEMO_PRODUCTS, DEMO_COUPONS, DEMO_CAMPAIGN, DEMO_ORDERS } = require('./seedData');

// In-Memory storage fallback when PostgreSQL is not configured locally
const memoryStore = {
  products: DEMO_PRODUCTS.map((p, idx) => ({ id: idx + 1, ...p })),
  coupons: DEMO_COUPONS.map((c, idx) => ({ id: idx + 1, ...c })),
  campaign: { id: 1, ...DEMO_CAMPAIGN },
  orders: DEMO_ORDERS.map((o) => ({ ...o, created_at: new Date().toISOString() }))
};

async function initPostgres() {
  if (!db.pool) return false;

  try {
    console.log('[Database] Checking & creating PostgreSQL tables if needed...');
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(180) NOT NULL,
        subtitle VARCHAR(255),
        price INTEGER NOT NULL,
        discount_price INTEGER,
        is_clothing BOOLEAN DEFAULT true,
        category VARCHAR(80) NOT NULL DEFAULT 'Clothing',
        sizes TEXT[] DEFAULT '{}',
        attributes JSONB,
        featured BOOLEAN DEFAULT false,
        stock INTEGER DEFAULT 20,
        image_url TEXT NOT NULL,
        crop_meta JSONB DEFAULT '{"zoom": 1, "panX": 0, "panY": 0}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE products ADD COLUMN IF NOT EXISTS attributes JSONB;

      CREATE TABLE IF NOT EXISTS coupons (
        id SERIAL PRIMARY KEY,
        code VARCHAR(40) UNIQUE NOT NULL,
        discount_percent INTEGER NOT NULL CHECK (discount_percent BETWEEN 1 AND 90),
        active BOOLEAN DEFAULT true,
        description VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        active BOOLEAN DEFAULT true,
        badge VARCHAR(60) DEFAULT 'SEASONAL DROP',
        headline VARCHAR(255) NOT NULL,
        subtext TEXT,
        promo_code VARCHAR(40),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(40) PRIMARY KEY,
        customer_name VARCHAR(140) NOT NULL,
        phone VARCHAR(40) NOT NULL,
        address TEXT NOT NULL,
        area VARCHAR(60) NOT NULL,
        items JSONB NOT NULL,
        coupon_code VARCHAR(40),
        discount_amount INTEGER DEFAULT 0,
        delivery_fee INTEGER DEFAULT 60,
        total INTEGER NOT NULL,
        payment_method VARCHAR(20) DEFAULT 'COD',
        bkash_payment_id VARCHAR(120),
        bkash_trx_id VARCHAR(120),
        payment_status VARCHAR(30) DEFAULT 'UNPAID_COD',
        status VARCHAR(30) DEFAULT 'Pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if products exist, seed if empty
    const productCheck = await db.query('SELECT COUNT(*) FROM products');
    if (parseInt(productCheck.rows[0].count, 10) === 0) {
      console.log('[Database] Seeding initial products...');
      for (const p of DEMO_PRODUCTS) {
        await db.query(
          `INSERT INTO products (title, subtitle, price, discount_price, is_clothing, category, sizes, featured, stock, image_url, crop_meta)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [p.title, p.subtitle, p.price, p.discount_price, p.is_clothing, p.category, p.sizes, p.featured, p.stock, p.image_url, JSON.stringify(p.crop_meta)]
        );
      }
    }

    // Check if coupons exist, seed if empty
    const couponCheck = await db.query('SELECT COUNT(*) FROM coupons');
    if (parseInt(couponCheck.rows[0].count, 10) === 0) {
      console.log('[Database] Seeding initial coupons...');
      for (const c of DEMO_COUPONS) {
        await db.query(
          `INSERT INTO coupons (code, discount_percent, active, description)
           VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO NOTHING`,
          [c.code, c.discount_percent, c.active, c.description]
        );
      }
    }

    // Check if campaign exists, seed if empty
    const campaignCheck = await db.query('SELECT COUNT(*) FROM campaigns');
    if (parseInt(campaignCheck.rows[0].count, 10) === 0) {
      console.log('[Database] Seeding initial campaign banner...');
      await db.query(
        `INSERT INTO campaigns (active, badge, headline, subtext, promo_code)
         VALUES ($1, $2, $3, $4, $5)`,
        [DEMO_CAMPAIGN.active, DEMO_CAMPAIGN.badge, DEMO_CAMPAIGN.headline, DEMO_CAMPAIGN.subtext, DEMO_CAMPAIGN.promo_code]
      );
    }

    // Check if orders exist, seed if empty
    const orderCheck = await db.query('SELECT COUNT(*) FROM orders');
    if (parseInt(orderCheck.rows[0].count, 10) === 0) {
      console.log('[Database] Seeding initial demo order...');
      for (const o of DEMO_ORDERS) {
        await db.query(
          `INSERT INTO orders (id, customer_name, phone, address, area, items, coupon_code, discount_amount, delivery_fee, total, payment_method, payment_status, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [o.id, o.customer_name, o.phone, o.address, o.area, JSON.stringify(o.items), o.coupon_code, o.discount_amount, o.delivery_fee, o.total, o.payment_method, o.payment_status, o.status]
        );
      }
    }

    console.log('[Database] PostgreSQL initialized and ready.');
    return true;
  } catch (err) {
    console.error('[Database] Failed to initialize PostgreSQL:', err.message);
    return false;
  }
}

module.exports = {
  initPostgres,
  memoryStore
};

