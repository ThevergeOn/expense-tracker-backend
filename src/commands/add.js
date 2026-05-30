const prisma = require("../utils/prisma");
const getArgValue = require("../utils/getArgValue");

async function add() {
  const description = getArgValue("--description");
  const amount = getArgValue("--amount");
  const category = getArgValue("--category") || "General";

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

  const date = new Date();
  const currentMonth = date.getMonth() + 1;

  const budget = await prisma.budget.findFirst({
    where: { month: currentMonth },
  });

  if (budget) {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const result = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const totalForMonth = Number(result._sum.amount) || 0;

    if (totalForMonth + numericAmount > Number(budget.amount)) {
      console.log("Warning: Budget exceeded!");
    }
  }

  const expense = await prisma.expense.create({
    data: {
      date: date,
      description: description,
      amount: numericAmount,
      category: category,
    },
  });

  console.log(`Expense added successfully (ID: ${expense.id})`);
}

module.exports = add;
