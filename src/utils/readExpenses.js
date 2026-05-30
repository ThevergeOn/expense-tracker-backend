const pool = require("../../db");

async function readExpenses() {
  const result = await pool.query("SELECT * FROM expenses ORDER BY id");
  return result.rows;
}

module.exports = readExpenses;
