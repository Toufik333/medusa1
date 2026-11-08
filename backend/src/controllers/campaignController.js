const db = require('../config/db');
const { memoryStore } = require('../db/initDb');

function formatCampaign(row) {
  if (!row) return null;
  return {
    id: row.id,
    active: Boolean(row.active),
    badge: row.badge,
    headline: row.headline,
    subtext: row.subtext,
    promoCode: row.promo_code,
    updatedAt: row.updated_at
  };
}

// GET /api/campaign
exports.getCampaign = async (req, res) => {
  try {
    if (db.isPostgres()) {
      const result = await db.query('SELECT * FROM campaigns ORDER BY id ASC LIMIT 1');
      if (result.rowCount === 0) {
        return res.json({
          active: true,
          badge: 'SEASONAL DROP',
          headline: 'WINTER DROP CAMPAIGN — Up to 25% OFF Selected Items',
          subtext: 'Minimalist essentials crafted for everyday utility. Free shipping on orders over ৳5,000.',
          promoCode: 'WINTER15'
        });
      }
      return res.json(formatCampaign(result.rows[0]));
    }
    res.json(formatCampaign(memoryStore.campaign));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/admin/campaign
exports.updateCampaign = async (req, res) => {
  try {
    const { active, badge, headline, subtext, promoCode } = req.body;

    if (db.isPostgres()) {
      let result = await db.query('SELECT id FROM campaigns ORDER BY id ASC LIMIT 1');
      if (result.rowCount === 0) {
        result = await db.query(
          `INSERT INTO campaigns (active, badge, headline, subtext, promo_code)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [Boolean(active), badge, headline, subtext, promoCode ? promoCode.toUpperCase() : null]
        );
      } else {
        const id = result.rows[0].id;
        result = await db.query(
          `UPDATE campaigns SET
            active = $1,
            badge = $2,
            headline = $3,
            subtext = $4,
            promo_code = $5,
            updated_at = CURRENT_TIMESTAMP
           WHERE id = $6 RETURNING *`,
          [Boolean(active), badge, headline, subtext, promoCode ? promoCode.toUpperCase() : null, id]
        );
      }
      return res.json(formatCampaign(result.rows[0]));
    }

    memoryStore.campaign = {
      ...memoryStore.campaign,
      active: active !== undefined ? Boolean(active) : memoryStore.campaign.active,
      badge: badge || memoryStore.campaign.badge,
      headline: headline || memoryStore.campaign.headline,
      subtext: subtext !== undefined ? subtext : memoryStore.campaign.subtext,
      promo_code: promoCode ? promoCode.toUpperCase() : memoryStore.campaign.promo_code,
      updated_at: new Date().toISOString()
    };

    res.json(formatCampaign(memoryStore.campaign));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/admin/campaign/toggle
exports.toggleCampaign = async (req, res) => {
  try {
    if (db.isPostgres()) {
      const result = await db.query(
        'UPDATE campaigns SET active = NOT active, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM campaigns ORDER BY id ASC LIMIT 1) RETURNING *'
      );
      if (result.rowCount === 0) return res.status(404).json({ error: 'No campaign configured' });
      return res.json(formatCampaign(result.rows[0]));
    }

    memoryStore.campaign.active = !memoryStore.campaign.active;
    res.json(formatCampaign(memoryStore.campaign));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

