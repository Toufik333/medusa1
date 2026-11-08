const db = require('../config/db');
const { memoryStore } = require('../db/initDb');

function formatOrder(row) {
  if (!row) return null;
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    address: row.address,
    area: row.area,
    items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []),
    couponCode: row.coupon_code,
    discountAmount: Number(row.discount_amount || 0),
    deliveryFee: Number(row.delivery_fee || 60),
    total: Number(row.total),
    paymentMethod: row.payment_method || 'COD',
    paymentStatus: row.payment_status || 'UNPAID_COD',
    bkashTrxId: row.bkash_trx_id,
    bkashPaymentId: row.bkash_payment_id,
    status: row.status || 'Pending',
    createdAt: row.created_at
  };
}

// GET /api/admin/orders
exports.getOrders = async (req, res) => {
  try {
    const { status } = req.query;

    if (db.isPostgres()) {
      let query = 'SELECT * FROM orders WHERE 1=1';
      const params = [];
      if (status && status !== 'All') {
        params.push(status);
        query += ` AND status = $${params.length}`;
      }
      query += ' ORDER BY created_at DESC';
      const result = await db.query(query, params);
      return res.json(result.rows.map(formatOrder));
    }

    let list = [...memoryStore.orders];
    if (status && status !== 'All') {
      list = list.filter((o) => o.status === status);
    }
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(list.map(formatOrder));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (db.isPostgres()) {
      const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
      if (result.rowCount === 0) return res.status(404).json({ error: 'Order not found' });
      return res.json(formatOrder(result.rows[0]));
    }

    const order = memoryStore.orders.find((o) => o.id === id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(formatOrder(order));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/orders (Customer Checkout with COD)
exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      area,
      items,
      couponCode,
      discountAmount,
      deliveryFee,
      total
    } = req.body;

    if (!customerName || !phone || !address || !items || !items.length) {
      return res.status(400).json({ error: 'Name, phone, address, and items are required.' });
    }

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const fee = area === 'Outside Dhaka' ? 120 : 60;
    const finalTotal = Number(total);

    if (db.isPostgres()) {
      const result = await db.query(
        `INSERT INTO orders (
          id, customer_name, phone, address, area, items, coupon_code, discount_amount, delivery_fee, total, payment_method, payment_status, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'COD', 'UNPAID_COD', 'Pending')
        RETURNING *`,
        [
          orderId,
          customerName.trim(),
          phone.trim(),
          address.trim(),
          area || 'Dhaka Metro',
          JSON.stringify(items),
          couponCode ? couponCode.trim().toUpperCase() : null,
          Number(discountAmount || 0),
          fee,
          finalTotal
        ]
      );
      return res.status(201).json(formatOrder(result.rows[0]));
    }

    const newOrder = {
      id: orderId,
      customer_name: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      area: area || 'Dhaka Metro',
      items,
      coupon_code: couponCode ? couponCode.trim().toUpperCase() : null,
      discount_amount: Number(discountAmount || 0),
      delivery_fee: fee,
      total: finalTotal,
      payment_method: 'COD',
      payment_status: 'UNPAID_COD',
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    memoryStore.orders.unshift(newOrder);
    res.status(201).json(formatOrder(newOrder));
  } catch (err) {
    console.error('createOrder error:', err);
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    if (db.isPostgres()) {
      let query = 'UPDATE orders SET ';
      const updates = [];
      const params = [];

      if (status) {
        params.push(status);
        updates.push(`status = $${params.length}`);
      }
      if (paymentStatus) {
        params.push(paymentStatus);
        updates.push(`payment_status = $${params.length}`);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No status provided' });
      }

      params.push(id);
      query += updates.join(', ') + ` WHERE id = $${params.length} RETURNING *`;

      const result = await db.query(query, params);
      if (result.rowCount === 0) return res.status(404).json({ error: 'Order not found' });
      return res.json(formatOrder(result.rows[0]));
    }

    const order = memoryStore.orders.find((o) => o.id === id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (status) order.status = status;
    if (paymentStatus) order.payment_status = paymentStatus;

    res.json(formatOrder(order));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
