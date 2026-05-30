const getArgValue = require("../utils/getArgValue");
const readBudgets = require("../utils/readBudget");
const saveBudgets = require("../utils/saveBudget");

function setBudget() {
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

  const budgets = readBudgets();

  const existingBudget = budgets.find((budget) => {
    return budget.month === numericMonth;
  });

  let updatedBudgets;

  if (existingBudget) {
    updatedBudgets = budgets.map((budget) => {
      if (budget.month !== numericMonth) {
        return budget;
      }

      return {
        ...budget,
        amount: numericAmount,
      };
    });
  } else {
    updatedBudgets = [
      ...budgets,
      {
        month: numericMonth,
        amount: numericAmount,
      },
    ];
  }

  saveBudgets(updatedBudgets);

  console.log("Budget saved successfully");
}
module.exports = setBudget;
