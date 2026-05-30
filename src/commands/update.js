const prisma = require("../utils/prisma");
const getArgValue = require("../utils/getArgValue");

async function update() {
  const id = getArgValue("--id");

  if (!id) {
    console.log("ID is required");
    return;
  }

  const numericId = Number(id);

  const description = getArgValue("--description");
  const amount = getArgValue("--amount");

  const expense = await prisma.expense.findUnique({
    where: { id: numericId },
  });

  if (!expense) {
    console.log("Expense not found");
    return;
  }

  const newDescription = description ? description : expense.description;
  const newAmount = amount ? Number(amount) : expense.amount;

  await prisma.expense.update({
    where: { id: numericId },
    data: {
      description: newDescription,
      amount: newAmount,
    },
  });

  console.log("Expense updated successfully");
}

module.exports = update;
