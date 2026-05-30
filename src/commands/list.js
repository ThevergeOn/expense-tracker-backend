const readExpenses = require("../utils/readExpenses");
const getArgValue = require("../utils/getArgValue");
function list() {
  const expenses = readExpenses();
  const category = getArgValue("--category");

  let filteredExpenses = expenses;

  if (category) {
    filteredExpenses = expenses.filter((expense) => {
      return expense.category === category;
    });
  }

  if (filteredExpenses.length === 0) {
    console.log("No expenses found");
    return;
  }

  console.log("ID  Date        Category  Description  Amount");

  filteredExpenses.forEach((expense) => {
    console.log(
      `${expense.id}   ${expense.date}  ${expense.category}  ${expense.description}  $${expense.amount}`,
    );
  });
}

module.exports = list;
