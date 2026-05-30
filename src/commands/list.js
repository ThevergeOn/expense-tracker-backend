const pool = require("../../db");
const getArgValue = require("../utils/getArgValue");

async function list() {
  const category = getArgValue("--category");

  let result;
  if (category) {
    result = await pool.query(
      "SELECT * FROM expenses WHERE category = $1 ORDER BY id",
      [category]
    );
  } else {
    result = await pool.query("SELECT * FROM expenses ORDER BY id");
  }

  const expenses = result.rows;

  if (expenses.length === 0) {
    console.log("No expenses found");
    return;
  }

  console.log("ID  Date        Category  Description  Amount");

  expenses.forEach((expense) => {
    const dateStr = expense.date instanceof Date
      ? expense.date.toISOString().split("T")[0]
      : expense.date;
    console.log(
      `${expense.id}   ${dateStr}  ${expense.category}  ${expense.description}  $${expense.amount}`,
    );
  });
}

module.exports = list;
