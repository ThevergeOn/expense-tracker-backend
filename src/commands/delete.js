const readExpenses = require("../utils/readExpenses");
const saveExpenses = require("../utils/saveExpenses");
const getArgValue = require("../utils/getArgValue");

function deleteExpense() {
  const id = getArgValue("--id");

  if (!id) {
    console.log("ID is required");
    return;
  }

  const numericId = Number(id);

  const expenses = readExpenses();

  const expense = expenses.find((expense) => expense.id === numericId);

  if (!expense) {
    console.log("Expense not found");
    return;
  }

  const updatedExpenses = expenses.filter(
    (expense) => expense.id !== numericId
  );

  saveExpenses(updatedExpenses);

  console.log("Expense deleted successfully");
}

module.exports = deleteExpense;
