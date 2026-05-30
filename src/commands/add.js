const readExpenses = require("../utils/readExpenses");
const saveExpenses = require("../utils/saveExpenses");
const getArgValue = require("../utils/getArgValue");
const readBudgets = require("../utils/readBudget");

function add() {
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

  const expenses = readExpenses();
  const lastExpense = expenses[expenses.length - 1];
  const newId = lastExpense ? lastExpense.id + 1 : 1;

  const newExpense = {
    id: newId,
    date: new Date().toISOString().split("T")[0],
    description,
    amount: numericAmount,
    category,
  };
  const budgets = readBudgets();

  const currentMonth = new Date(newExpense.date).getMonth() + 1;

  const budget = budgets.find((budget) => {
    return budget.month === currentMonth;
  });

  if (budget) {
    const totalForMonth = expenses
      .filter((expense) => {
        const expenseMonth = new Date(expense.date).getMonth() + 1;
        return expenseMonth === currentMonth;
      })
      .reduce((sum, expense) => {
        return sum + expense.amount;
      }, 0);

    if (totalForMonth > budget.amount) {
      console.log("Warning: Budget exceeded!");
    }
  }
  expenses.push(newExpense);

  saveExpenses(expenses);

  console.log(`Expense added successfully (ID: ${newExpense.id})`);
}

module.exports = add;
