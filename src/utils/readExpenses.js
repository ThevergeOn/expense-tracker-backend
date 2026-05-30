const prisma = require("./prisma");

async function readExpenses() {
  const transactions = await prisma.transaction.findMany({
    where: { type: "expense" },
    orderBy: { id: "asc" },
  });
  return transactions;
}

module.exports = readExpenses;
