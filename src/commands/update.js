const pool = require("../../db");
const getArgValue = require("../utils/getArgValue");

async function update() {
  const id = getArgValue("--id");

  if (!id) {
    console.log("ID is required");
    return;
  }

  const numericId = Number(id);

  const description = getArgValue("--description");
  const amount = getArgValue("--amount");

  const checkResult = await pool.query(
    "SELECT * FROM expenses WHERE id = $1",
    [numericId]
  );

  if (checkResult.rows.length === 0) {
    console.log("Expense not found");
    return;
  }

  const expense = checkResult.rows[0];

  const newDescription = description ? description : expense.description;
  const newAmount = amount ? Number(amount) : expense.amount;

  await pool.query(
    "UPDATE expenses SET description = $1, amount = $2 WHERE id = $3",
    [newDescription, newAmount, numericId]
  );

  console.log("Expense updated successfully");
}

module.exports = update;
