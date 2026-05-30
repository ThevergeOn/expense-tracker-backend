const readExpenses = require("../utils/readExpenses");
const saveExpenses = require("../utils/saveExpenses");
const getArgValue = require("../utils/getArgValue");

function add() {
  const description = getArgValue("--description");
  const amount = getArgValue("--amount");

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

  const expenses = readExpenses();
  const lastExpense = expenses[expenses.length - 1];
  const newId = lastExpense ? lastExpense.id + 1 : 1;

  const newExpense = {
    id: newId,
    date: new Date().toISOString().split("T")[0],
    description,
    amount: numericAmount,
  };

  expenses.push(newExpense);

  saveExpenses(expenses);

  console.log(`Expense added successfully (ID: ${newExpense.id})`);
}

module.exports = add;
