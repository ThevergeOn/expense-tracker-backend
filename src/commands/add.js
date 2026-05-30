const prisma = require("../utils/prisma");
const getArgValue = require("../utils/getArgValue");

async function add() {
  const title = getArgValue("--description") || getArgValue("--title");
  const amount = getArgValue("--amount");
  const category = getArgValue("--category") || "other";

  if (!title) {
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

    const result = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        type: "expense",
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

  const transaction = await prisma.transaction.create({
    data: {
      date: date,
      title: title,
      amount: numericAmount,
      category: category,
      type: "expense",
    },
  });

  console.log(`Expense added successfully (ID: ${transaction.id})`);
}

module.exports = add;
