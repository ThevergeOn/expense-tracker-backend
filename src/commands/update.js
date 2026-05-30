const prisma = require("../utils/prisma");
const getArgValue = require("../utils/getArgValue");

async function update() {
  const id = getArgValue("--id");

  if (!id) {
    console.log("ID is required");
    return;
  }

  const numericId = Number(id);

  const title = getArgValue("--description") || getArgValue("--title");
  const amount = getArgValue("--amount");

  const transaction = await prisma.transaction.findUnique({
    where: { id: numericId },
  });

  if (!transaction) {
    console.log("Expense not found");
    return;
  }

  const newTitle = title ? title : transaction.title;
  const newAmount = amount ? Number(amount) : transaction.amount;

  await prisma.transaction.update({
    where: { id: numericId },
    data: {
      title: newTitle,
      amount: newAmount,
    },
  });

  console.log("Expense updated successfully");
}

module.exports = update;
