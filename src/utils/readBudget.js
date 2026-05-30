const pool = require("../../db");

async function readBudgets() {
  const result = await pool.query("SELECT * FROM budgets ORDER BY month");
  return result.rows;
}

module.exports = readBudgets;
