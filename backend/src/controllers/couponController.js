const db = require('../config/db');
const { memoryStore } = require('../db/initDb');

function formatCoupon(row) {
  if (!row) return null;
  return {
    id: row.id,
    code: row.code,
    discountPercent: Number(row.discount_percent),
    active: Boolean(row.active),
    description: row.description,
    createdAt: row.created_at
  };
}

// GET /api/coupons (Admin)
exports.getCoupons = async (req, res) => {
  try {
    if (db.isPostgres()) {
      const result = await db.query('SELECT * FROM coupons ORDER BY id ASC');
      return res.json(result.rows.map(formatCoupon));
    }
    res.json(memoryStore.coupons.map(formatCoupon));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/coupons/active (Storefront)
exports.getActiveCoupons = async (req, res) => {
  try {
    if (db.isPostgres()) {
      const result = await db.query('SELECT * FROM coupons WHERE active = true ORDER BY discount_percent DESC');
      return res.json(result.rows.map(formatCoupon));
    }
    const activeOnes = memoryStore.coupons.filter((c) => c.active);
    res.json(activeOnes.map(formatCoupon));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/coupons/validate (Customer Drawer)
exports.validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code is required' });

    const upper = code.trim().toUpperCase();

    if (db.isPostgres()) {
      const result = await db.query('SELECT * FROM coupons WHERE UPPER(code) = $1', [upper]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: `Coupon "${upper}" does not exist` });
      }
      const coupon = formatCoupon(result.rows[0]);
      if (!coupon.active) {
        return res.status(400).json({ error: `Coupon "${upper}" is currently deactivated by Admin` });
      }
      return res.json(coupon);
    }

    const found = memoryStore.coupons.find((c) => c.code.toUpperCase() === upper);
    if (!found) {
      return res.status(404).json({ error: `Coupon "${upper}" does not exist` });
    }
    if (!found.active) {
      return res.status(400).json({ error: `Coupon "${upper}" is currently deactivated by Admin` });
    }
    res.json(formatCoupon(found));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/admin/coupons
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, description } = req.body;
    if (!code || !discountPercent) {
      return res.status(400).json({ error: 'Code and discount percentage are required' });
    }

    const cleanCode = code.trim().toUpperCase();
    const pct = Number(discountPercent);
    if (pct < 1 || pct > 90) {
      return res.status(400).json({ error: 'Discount percent must be between 1 and 90' });
    }

    if (db.isPostgres()) {
      const existing = await db.query('SELECT id FROM coupons WHERE UPPER(code) = $1', [cleanCode]);
      if (existing.rowCount > 0) {
        return res.status(400).json({ error: `Coupon "${cleanCode}" already exists` });
      }

      const result = await db.query(
        `INSERT INTO coupons (code, discount_percent, active, description)
         VALUES ($1, $2, true, $3) RETURNING *`,
        [cleanCode, pct, description ? description.trim() : null]
      );
      return res.status(201).json(formatCoupon(result.rows[0]));
    }

    if (memoryStore.coupons.some((c) => c.code.toUpperCase() === cleanCode)) {
      return res.status(400).json({ error: `Coupon "${cleanCode}" already exists` });
    }

    const newId = memoryStore.coupons.length > 0 ? Math.max(...memoryStore.coupons.map(c => c.id)) + 1 : 1;
    const newCoupon = {
      id: newId,
      code: cleanCode,
      discount_percent: pct,
      active: true,
      description: description ? description.trim() : null,
      created_at: new Date().toISOString()
    };
    memoryStore.coupons.push(newCoupon);
    res.status(201).json(formatCoupon(newCoupon));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/admin/coupons/:id/toggle
exports.toggleCouponActive = async (req, res) => {
  try {
    const { id } = req.params;

    if (db.isPostgres()) {
      const result = await db.query(
        'UPDATE coupons SET active = NOT active WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rowCount === 0) return res.status(404).json({ error: 'Coupon not found' });
      return res.json(formatCoupon(result.rows[0]));
    }

    const item = memoryStore.coupons.find((c) => String(c.id) === String(id));
    if (!item) return res.status(404).json({ error: 'Coupon not found' });
    item.active = !item.active;
    res.json(formatCoupon(item));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/admin/coupons/:id
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    if (db.isPostgres()) {
      const result = await db.query('DELETE FROM coupons WHERE id = $1 RETURNING id', [id]);
      if (result.rowCount === 0) return res.status(404).json({ error: 'Coupon not found' });
      return res.json({ message: 'Coupon deleted', id: Number(id) });
    }

    const initLen = memoryStore.coupons.length;
    memoryStore.coupons = memoryStore.coupons.filter((c) => String(c.id) !== String(id));
    if (memoryStore.coupons.length === initLen) return res.status(404).json({ error: 'Coupon not found' });
    res.json({ message: 'Coupon deleted', id: Number(id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

