/**
 * Security Middleware: Input Sanitization, XSS Prevention & Field Tampering Protection
 */

// Escape HTML characters to prevent Cross-Site Scripting (XSS)
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Recursively sanitize all strings in request body
function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    const sanitizeObj = (obj) => {
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'string') {
          // Do not escape image data URLs or URLs
          if (!obj[key].startsWith('data:image/') && !obj[key].startsWith('http://') && !obj[key].startsWith('https://')) {
            obj[key] = escapeHtml(obj[key].trim());
          } else {
            obj[key] = obj[key].trim();
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObj(obj[key]);
        }
      }
    };
    sanitizeObj(req.body);
  }
  next();
}

// Validate Customer Order submission (Blocks field tampering)
function validateOrderPayload(req, res, next) {
  const { customerName, phone, address, area, items, total } = req.body;

  if (!customerName || typeof customerName !== 'string' || customerName.length > 120) {
    return res.status(400).json({ error: 'Valid customer name (max 120 chars) is required' });
  }

  // Bangladesh Phone validation or international phone format
  const phoneClean = String(phone || '').replace(/[\s-]/g, '');
  if (!phoneClean || phoneClean.length < 8 || phoneClean.length > 20) {
    return res.status(400).json({ error: 'Valid contact phone number is required' });
  }

  if (!address || typeof address !== 'string' || address.length < 5 || address.length > 300) {
    return res.status(400).json({ error: 'Detailed delivery address (5-300 chars) is required' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  // Validate items structure (prevent price/stock tampering)
  for (const item of items) {
    if (!item.title || !item.price || item.price < 1 || !item.qty || item.qty < 1) {
      return res.status(400).json({ error: 'Invalid item data in order' });
    }
  }

  if (!total || isNaN(total) || Number(total) < 0) {
    return res.status(400).json({ error: 'Invalid total calculation' });
  }

  // Strip any disallowed fields to prevent document tampering
  delete req.body.payment_status;
  delete req.body.status;
  delete req.body.is_admin;
  delete req.body.role;

  next();
}

// Validate Product submission (Blocks invalid categories, tampering)
function validateProductPayload(req, res, next) {
  const { title, price, discountPrice, isClothing, category } = req.body;

  if (!title || typeof title !== 'string' || title.length > 180) {
    return res.status(400).json({ error: 'Product title is required (max 180 chars)' });
  }

  const p = Number(price);
  if (isNaN(p) || p <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  if (discountPrice !== undefined && discountPrice !== null && discountPrice !== '') {
    const dp = Number(discountPrice);
    if (isNaN(dp) || dp < 0 || dp >= p) {
      return res.status(400).json({ error: 'Discount price must be less than the regular price' });
    }
  }

  const allowedCategories = ['Clothing', 'Accessories', 'Gear'];
  if (category && !allowedCategories.includes(category)) {
    return res.status(400).json({ error: `Category must be one of: ${allowedCategories.join(', ')}` });
  }

  next();
}

module.exports = {
  sanitizeInput,
  validateOrderPayload,
  validateProductPayload
};
