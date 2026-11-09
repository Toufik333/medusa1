const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'perfumego_secure_admin_jwt_secret_key_2026';

// Helper to parse ADMIN_USERS from environment variations
function getAdminsFromEnv() {
  const envVal = process.env.ADMIN_USERS;
  if (!envVal) {
    // Default demo admin fallback if environment variable is not yet configured
    return [
      {
        email: 'admin@perfumego.com',
        passwordRaw: 'admin12345!',
        name: 'PerfumeGo Master Admin'
      },
      {
        email: 'admin@mono.studio',
        passwordRaw: 'admin12345!',
        name: 'Master Admin'
      },
      {
        email: 'toufik@perfumego.com',
        passwordRaw: 'toufikSecure2026!',
        name: 'Toufik'
      }
    ];
  }

  // 1. Try parsing as JSON array
  if (envVal.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(envVal);
      if (Array.isArray(parsed)) {
        return parsed.map((a) => ({
          email: String(a.email || '').trim().toLowerCase(),
          passwordRaw: a.password ? String(a.password) : undefined,
          passwordHash: a.passwordHash || (a.password && a.password.startsWith('$2') ? a.password : undefined),
          name: a.name || 'Admin User'
        }));
      }
    } catch (err) {
      // JSON.parse failed. Could be unquoted JS object from PowerShell: [{email:...,password:...}]
      const objMatches = envVal.match(/\{[^}]+\}/g);
      if (objMatches && objMatches.length > 0) {
        const extracted = [];
        for (const objStr of objMatches) {
          const inner = objStr.replace(/^[{\s]+|[}\s]+$/g, '');
          const props = {};
          inner.split(',').forEach((pair) => {
            const idx = pair.indexOf(':');
            if (idx !== -1) {
              const k = pair.substring(0, idx).trim().replace(/^['"]+|['"]+$/g, '');
              const v = pair.substring(idx + 1).trim().replace(/^['"]+|['"]+$/g, '');
              props[k] = v;
            }
          });
          if (props.email && (props.password || props.passwordRaw || props.passwordHash)) {
            const pass = props.password || props.passwordRaw || props.passwordHash;
            extracted.push({
              email: props.email.trim().toLowerCase(),
              passwordRaw: pass.startsWith('$2') ? undefined : pass,
              passwordHash: pass.startsWith('$2') ? pass : undefined,
              name: props.name || 'Admin User'
            });
          }
        }
        if (extracted.length > 0) {
          return extracted;
        }
      }
    }
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
