const pool = require("../../db");

async function summary() {
  const result = await pool.query("SELECT SUM(amount) as total FROM expenses");

  const total = parseFloat(result.rows[0].total) || 0;

  console.log(`Total expenses: $${total}`);
}

module.exports = summary;
