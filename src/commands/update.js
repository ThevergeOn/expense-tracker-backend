const readExpenses = require("../utils/readExpenses");
const saveExpenses = require("../utils/saveExpenses");
const getArgValue = require("../utils/getArgValue");

function update() {
  const id = getArgValue("--id");

  if (!id) {
    console.log("ID is required");
    return;
  }

  const numericId = Number(id);

  const description = getArgValue("--description");

  const amount = getArgValue("--amount");

  const expenses = readExpenses();

  const expense = expenses.find((expense) => expense.id === numericId);

  if (!expense) {
    console.log("Expense not found");
    return;
  }

  const updatedExpenses = expenses.map((expense) => {
    if (expense.id !== numericId) {
      return expense;
    }

    return {
      ...expense,
      description: description ? description : expense.description,
      amount: amount ? Number(amount) : expense.amount,
    };
  });

  saveExpenses(updatedExpenses);

  console.log("Expense updated successfully");
}

module.exports = update;
