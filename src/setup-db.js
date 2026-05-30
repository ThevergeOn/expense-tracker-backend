require("dotenv").config();
const { Pool } = require("pg");

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log("Setting up database tables...");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'other',
      amount NUMERIC NOT NULL,
      date DATE NOT NULL,
      type TEXT NOT NULL DEFAULT 'expense',
      icon TEXT,
      "iconColor" TEXT,
      "iconBg" TEXT
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL UNIQUE,
      amount NUMERIC NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      avatar TEXT,
      currency TEXT DEFAULT 'USD',
      language TEXT DEFAULT 'en',
      notifications BOOLEAN DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS payment_methods (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      last4 TEXT NOT NULL,
      expiry TEXT NOT NULL,
      "isDefault" BOOLEAN DEFAULT false,
      "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  console.log("Database setup complete");
  await pool.end();
}

setupDatabase().catch((err) => {
  console.error("Database setup failed:", err);
  process.exit(1);
});
