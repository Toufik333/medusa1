const { Pool } = require('pg');
require('dotenv').config();

let pool = null;
let isPostgres = false;

if (process.env.DATABASE_URL) {
  try {
    const isProd = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL.includes('compute.amazonaws.com') || process.env.DATABASE_URL.includes('neon.tech') || process.env.DATABASE_URL.includes('supabase.co');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isProd ? { rejectUnauthorized: false } : false
    });
    isPostgres = true;
    console.log('[Database] Configured PostgreSQL client with connection string.');
  } catch (err) {
    console.error('[Database] Error initializing PostgreSQL pool:', err.message);
  }
} else {
  console.log('[Database] DATABASE_URL not detected. Running with In-Memory / Local Repository fallback.');
}

module.exports = {
  pool,
  isPostgres: () => isPostgres,
  query: async (text, params) => {
    if (pool) {
      return pool.query(text, params);
    }
    throw new Error('PostgreSQL pool not initialized.');
  }
};
