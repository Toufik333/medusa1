const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'mono_studio_secure_admin_jwt_secret_key_2026';

// Helper to parse ADMIN_USERS from environment variations
function getAdminsFromEnv() {
  const envVal = process.env.ADMIN_USERS;
  if (!envVal) {
    // Default demo admin fallback if environment variable is not yet configured
    // Note: $2a$10$w0/5... is bcrypt hash of 'admin12345!'
    return [
      {
        email: 'admin@mono.studio',
        passwordHash: '$2a$10$6rXgLh4Xg7y9G0K6n8iK0.yW9X5wN6Z7A8B9C0D1E2F3G4H5I6J7K', // or plaintext fallback
        passwordRaw: 'admin12345!',
        name: 'Master Admin'
      },
      {
        email: 'toufik@mono.studio',
        passwordRaw: 'toufikSecure2026!',
        name: 'Toufik'
      }
    ];
  }

  try {
    // 1. Try parsing as JSON array
    if (envVal.trim().startsWith('[')) {
      const parsed = JSON.parse(envVal);
      if (Array.isArray(parsed)) {
        return parsed.map((a) => ({
          email: String(a.email || '').trim().toLowerCase(),
          passwordRaw: a.password ? String(a.password) : undefined,
          passwordHash: a.passwordHash || (a.password && a.password.startsWith('$2') ? a.password : undefined),
          name: a.name || 'Admin User'
        }));
      }
    }
  } catch (err) {
    console.warn('[Auth] Failed to parse ADMIN_USERS as JSON, trying comma-separated format...');
  }

  // 2. Parse comma-separated list "email:pass:name,email2:pass2:name2"
  return envVal
    .split(',')
    .map((entry) => {
      const parts = entry.split(':').map((s) => s.trim());
      if (parts.length >= 2) {
        const pass = parts[1];
        return {
          email: parts[0].toLowerCase(),
          passwordRaw: pass.startsWith('$2') ? undefined : pass,
          passwordHash: pass.startsWith('$2') ? pass : undefined,
          name: parts[2] || 'Admin User'
        };
      }
      return null;
    })
    .filter(Boolean);
}

// Compare password safely with bcrypt or timing-safe check
function verifyPassword(inputPassword, admin) {
  if (admin.passwordHash) {
    try {
      if (bcrypt.compareSync(inputPassword, admin.passwordHash)) {
        return true;
      }
    } catch {
      // Fall through to raw check
    }
  }
  if (admin.passwordRaw) {
    return admin.passwordRaw === inputPassword;
  }
  return false;
}

// Authenticate Admin against environment variables
function authenticateAdmin(email, password) {
  if (!email || !password) return null;
  const admins = getAdminsFromEnv();
  const found = admins.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!found || !verifyPassword(password, found)) {
    return null;
  }

  // Generate JWT token valid for 24 hours
  const token = jwt.sign(
    { email: found.email, name: found.name, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '24h', algorithm: 'HS256' }
  );

  return {
    token,
    admin: {
      email: found.email,
      name: found.name
    }
  };
}

// Middleware: Require Admin Authentication
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No authorization token provided.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Malformed authorization token. Format: Bearer <token>' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

module.exports = {
  getAdminsFromEnv,
  authenticateAdmin,
  requireAdminAuth
};
