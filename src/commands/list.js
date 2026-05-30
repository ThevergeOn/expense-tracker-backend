const prisma = require("../utils/prisma");
const getArgValue = require("../utils/getArgValue");

async function list() {
  const category = getArgValue("--category");

  const transactions = await prisma.transaction.findMany({
    where: {
      type: "expense",
      ...(category ? { category } : {}),
    },
    orderBy: { id: "asc" },
  });

  if (transactions.length === 0) {
    console.log("No expenses found");
    return;
  }

  console.log("ID  Date        Category  Description  Amount");

  transactions.forEach((t) => {
    const dateStr = t.date instanceof Date
      ? t.date.toISOString().split("T")[0]
      : t.date;
    console.log(
      `${t.id}   ${dateStr}  ${t.category}  ${t.title}  $${t.amount}`,
    );
  });
}

module.exports = list;
