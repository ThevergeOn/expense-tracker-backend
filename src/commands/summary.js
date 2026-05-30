const readExpenses = require("../utils/readExpenses");

function summary() {
  const expenses = readExpenses();

  const total = expenses.reduce((sum, expense) => {
    return sum + expense.amount;
  }, 0);

  console.log(`Total expenses: $${total}`);
}

module.exports = summary;
