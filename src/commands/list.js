const readExpenses = require("../utils/readExpenses");

function list() {
  const expenses = readExpenses();

  if (expenses.length === 0) {
    console.log("No expenses found");
    return;
  }

  console.log("ID  Date        Description  Amount");

  expenses.forEach((expense) => {
    console.log(
      `${expense.id}   ${expense.date}  ${expense.description}        $${expense.amount}`
    );
  });
}

module.exports = list;
