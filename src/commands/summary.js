const prisma = require("../utils/prisma");

async function summary() {
  const result = await prisma.expense.aggregate({
    _sum: { amount: true },
  });

  const total = Number(result._sum.amount) || 0;

  console.log(`Total expenses: $${total}`);
}

module.exports = summary;
