const prisma = require("../utils/prisma");

async function summary() {
  const result = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: "expense" },
  });

  const total = Number(result._sum.amount) || 0;

  console.log(`Total expenses: $${total}`);
}

module.exports = summary;
