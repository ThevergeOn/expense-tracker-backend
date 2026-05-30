const pool = require("./db");

async function setupDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      description TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      category TEXT NOT NULL DEFAULT 'General'
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL UNIQUE,
      amount NUMERIC NOT NULL
    );
  `);

  console.log("Database setup completed");
  await pool.end();
}

setupDatabase();
