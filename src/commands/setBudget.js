const prisma = require("../utils/prisma");
const getArgValue = require("../utils/getArgValue");

async function setBudget() {
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

  await prisma.budget.upsert({
    where: { month: numericMonth },
    update: { amount: numericAmount },
    create: { month: numericMonth, amount: numericAmount },
  });

  console.log("Budget saved successfully");
}

module.exports = setBudget;
