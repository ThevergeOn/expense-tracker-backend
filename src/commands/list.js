const prisma = require("../utils/prisma");
const getArgValue = require("../utils/getArgValue");

async function list() {
  const category = getArgValue("--category");

  const expenses = await prisma.expense.findMany({
    where: category ? { category: category } : undefined,
    orderBy: { id: "asc" },
  });

  if (expenses.length === 0) {
    console.log("No expenses found");
    return;
  }

  console.log("ID  Date        Category  Description  Amount");

  expenses.forEach((expense) => {
    const dateStr = expense.date instanceof Date
      ? expense.date.toISOString().split("T")[0]
      : expense.date;
    console.log(
      `${expense.id}   ${dateStr}  ${expense.category}  ${expense.description}  $${expense.amount}`,
    );
  });
}

module.exports = list;
