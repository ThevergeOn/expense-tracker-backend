const prisma = require("./prisma");

async function readBudgets() {
  const budgets = await prisma.budget.findMany({
    orderBy: { month: "asc" },
  });
  return budgets;
}

module.exports = readBudgets;
