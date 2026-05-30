const prisma = require("./prisma");

async function readExpenses() {
  const expenses = await prisma.expense.findMany({
    orderBy: { id: "asc" },
  });
  return expenses;
}

module.exports = readExpenses;
