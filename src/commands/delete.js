const pool = require("../../db");
const getArgValue = require("../utils/getArgValue");

async function deleteExpense() {
  const id = getArgValue("--id");

  if (!id) {
    console.log("ID is required");
    return;
  }

  const numericId = Number(id);

  const checkResult = await pool.query(
    "SELECT * FROM expenses WHERE id = $1",
    [numericId]
  );

  if (checkResult.rows.length === 0) {
    console.log("Expense not found");
    return;
  }

  await pool.query("DELETE FROM expenses WHERE id = $1", [numericId]);

  console.log("Expense deleted successfully");
}

module.exports = deleteExpense;
