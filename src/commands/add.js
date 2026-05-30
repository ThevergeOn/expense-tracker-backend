const pool = require("../../db");
const getArgValue = require("../utils/getArgValue");
const readBudgets = require("../utils/readBudget");

async function add() {
  const description = getArgValue("--description");
  const amount = getArgValue("--amount");
  const category = getArgValue("--category");

  if (!description) {
    console.log("Description is required");
    return;
  }

  if (!amount) {
    console.log("Amount is required");
    return;
  }

  const numericAmount = Number(amount);

  if (isNaN(numericAmount)) {
    console.log("Amount must be a number");
    return;
  }

  if (numericAmount <= 0) {
    console.log("Amount must be greater than zero");
    return;
  }

  const date = new Date().toISOString().split("T")[0];
  const currentMonth = new Date(date).getMonth() + 1;

  const budgets = await readBudgets();

  const budget = budgets.find((budget) => {
    return budget.month === currentMonth;
  });

  if (budget) {
    const expensesResult = await pool.query(
      "SELECT SUM(amount) as total FROM expenses WHERE EXTRACT(MONTH FROM date) = $1",
      [currentMonth]
    );
    const totalForMonth = parseFloat(expensesResult.rows[0].total) || 0;

    if (totalForMonth + numericAmount > budget.amount) {
      console.log("Warning: Budget exceeded!");
    }
  }

  const result = await pool.query(
    "INSERT INTO expenses (date, description, amount, category) VALUES ($1, $2, $3, $4) RETURNING id",
    [date, description, numericAmount, category]
  );

  console.log(`Expense added successfully (ID: ${result.rows[0].id})`);
}

module.exports = add;
