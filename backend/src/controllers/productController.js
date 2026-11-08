const db = require('../config/db');
const { memoryStore } = require('../db/initDb');

// Helper to normalize product format
function formatProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    price: Number(row.price),
    discountPrice: row.discount_price ? Number(row.discount_price) : null,
    isClothing: Boolean(row.is_clothing),
    category: row.category,
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    featured: Boolean(row.featured),
    stock: Number(row.stock || 0),
    imageUrl: row.image_url,
    cropMeta: typeof row.crop_meta === 'string' ? JSON.parse(row.crop_meta) : (row.crop_meta || { zoom: 1, panX: 0, panY: 0 }),
    createdAt: row.created_at
  };
}

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, search, featured } = req.query;

    if (db.isPostgres()) {
      let query = 'SELECT * FROM products WHERE 1=1';
      const params = [];

      if (category && category !== 'All') {
        params.push(category.toLowerCase());
        query += ` AND LOWER(category) = $${params.length}`;
      }

      if (featured === 'true') {
        query += ' AND featured = true';
      }

      if (search) {
        params.push(`%${search.toLowerCase()}%`);
        query += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(subtitle) LIKE $${params.length} OR LOWER(category) LIKE $${params.length})`;
      }

      query += ' ORDER BY id DESC';
      const result = await db.query(query, params);
      return res.json(result.rows.map(formatProduct));
    }

    // In-memory fallback
    let list = [...memoryStore.products];
    if (category && category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (featured === 'true') {
      list = list.filter((p) => p.featured);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => b.id - a.id);
    res.json(list.map(formatProduct));
  } catch (err) {
    console.error('getProducts error:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (db.isPostgres()) {
      const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
      return res.json(formatProduct(result.rows[0]));
    }

    const item = memoryStore.products.find((p) => String(p.id) === String(id));
    if (!item) return res.status(404).json({ error: 'Product not found' });
    res.json(formatProduct(item));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/admin/products
exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      price,
      discountPrice,
      isClothing,
      category,
      sizes,
      featured,
      stock,
      imageUrl,
      cropMeta
    } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: 'Title and price are required' });
    }

    const clothingBool = Boolean(isClothing);
    // Clothing items: sizes must be populated. Non-clothing: strictly empty
    const normalizedSizes = clothingBool
      ? (Array.isArray(sizes) && sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'])
      : [];

    const normalizedCrop = cropMeta || { zoom: 1, panX: 0, panY: 0 };

    if (db.isPostgres()) {
      const result = await db.query(
        `INSERT INTO products (
          title, subtitle, price, discount_price, is_clothing, category, sizes, featured, stock, image_url, crop_meta
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
        [
          title.trim(),
          subtitle ? subtitle.trim() : null,
          Number(price),
          discountPrice ? Number(discountPrice) : null,
          clothingBool,
          category || (clothingBool ? 'Clothing' : 'Accessories'),
          normalizedSizes,
          Boolean(featured),
          Number(stock || 15),
          imageUrl,
          JSON.stringify(normalizedCrop)
        ]
      );
      return res.status(201).json(formatProduct(result.rows[0]));
    }

    // In-memory fallback
    const newId = memoryStore.products.length > 0 ? Math.max(...memoryStore.products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : null,
      price: Number(price),
      discount_price: discountPrice ? Number(discountPrice) : null,
      is_clothing: clothingBool,
      category: category || (clothingBool ? 'Clothing' : 'Accessories'),
      sizes: normalizedSizes,
      featured: Boolean(featured),
      stock: Number(stock || 15),
      image_url: imageUrl,
      crop_meta: normalizedCrop,
      created_at: new Date().toISOString()
    };
    memoryStore.products.unshift(newProduct);
    res.status(201).json(formatProduct(newProduct));
  } catch (err) {
    console.error('createProduct error:', err);
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/admin/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      price,
      discountPrice,
      isClothing,
      category,
      sizes,
      featured,
      stock,
      imageUrl,
      cropMeta
    } = req.body;

    const clothingBool = Boolean(isClothing);
    const normalizedSizes = clothingBool
      ? (Array.isArray(sizes) && sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'])
      : [];
    const normalizedCrop = cropMeta || { zoom: 1, panX: 0, panY: 0 };

    if (db.isPostgres()) {
      const result = await db.query(
        `UPDATE products SET
          title = $1,
          subtitle = $2,
          price = $3,
          discount_price = $4,
          is_clothing = $5,
          category = $6,
          sizes = $7,
          featured = $8,
          stock = $9,
          image_url = $10,
          crop_meta = $11,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $12
        RETURNING *`,
        [
          title.trim(),
          subtitle ? subtitle.trim() : null,
          Number(price),
          discountPrice ? Number(discountPrice) : null,
          clothingBool,
          category || (clothingBool ? 'Clothing' : 'Accessories'),
          normalizedSizes,
          Boolean(featured),
          Number(stock || 15),
          imageUrl,
          JSON.stringify(normalizedCrop),
          id
        ]
      );
      if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
      return res.json(formatProduct(result.rows[0]));
    }

    const idx = memoryStore.products.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });

    memoryStore.products[idx] = {
      ...memoryStore.products[idx],
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : null,
      price: Number(price),
      discount_price: discountPrice ? Number(discountPrice) : null,
      is_clothing: clothingBool,
      category: category || (clothingBool ? 'Clothing' : 'Accessories'),
      sizes: normalizedSizes,
      featured: Boolean(featured),
      stock: Number(stock || 15),
      image_url: imageUrl,
      crop_meta: normalizedCrop
    };

    res.json(formatProduct(memoryStore.products[idx]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/admin/products/:id/featured
exports.toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    if (db.isPostgres()) {
      const result = await db.query(
        `UPDATE products SET featured = NOT featured, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
      return res.json(formatProduct(result.rows[0]));
    }

    const item = memoryStore.products.find((p) => String(p.id) === String(id));
    if (!item) return res.status(404).json({ error: 'Product not found' });
    item.featured = !item.featured;
    res.json(formatProduct(item));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/admin/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (db.isPostgres()) {
      const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
      if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
      return res.json({ message: 'Product deleted', id: Number(id) });
    }

    const initialLen = memoryStore.products.length;
    memoryStore.products = memoryStore.products.filter((p) => String(p.id) !== String(id));
    if (memoryStore.products.length === initialLen) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted', id: Number(id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

