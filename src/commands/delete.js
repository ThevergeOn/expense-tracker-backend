const prisma = require("../utils/prisma");
const getArgValue = require("../utils/getArgValue");

async function deleteExpense() {
  const id = getArgValue("--id");

  if (!id) {
    console.log("ID is required");
    return;
  }

  const numericId = Number(id);

  const transaction = await prisma.transaction.findUnique({
    where: { id: numericId },
  });

  if (!transaction) {
    console.log("Expense not found");
    return;
  }

  await prisma.transaction.delete({
    where: { id: numericId },
  });

  console.log("Expense deleted successfully");
}

module.exports = deleteExpense;
