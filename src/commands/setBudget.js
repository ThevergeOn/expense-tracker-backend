const pool = require("../../db");
const getArgValue = require("../utils/getArgValue");

async function setBudget() {
  const month = getArgValue("--month");
  const amount = getArgValue("--amount");

  if (!month) {
    console.log("Month is required");
    return;
  }

  if (!amount) {
    console.log("Amount is required");
    return;
  }

  const numericMonth = Number(month);
  const numericAmount = Number(amount);

  if (isNaN(numericMonth) || numericMonth < 1 || numericMonth > 12) {
    console.log("Month must be between 1 and 12");
    return;
  }

  if (isNaN(numericAmount) || numericAmount <= 0) {
    console.log("Budget amount must be greater than zero");
    return;
  }

  await pool.query(
    "INSERT INTO budgets (month, amount) VALUES ($1, $2) ON CONFLICT (month) DO UPDATE SET amount = $2",
    [numericMonth, numericAmount]
  );

  console.log("Budget saved successfully");
}

module.exports = setBudget;
