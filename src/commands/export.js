const fs = require("fs");
const readExpenses = require("../utils/readExpenses");

async function exportCSV() {
  const expenses = await readExpenses();

  if (expenses.length === 0) {
    console.log("No expenses to export");
    return;
  }

  const header = "ID,Date,Category,Description,Amount";

  const rows = expenses.map((expense) => {
    const dateStr = expense.date instanceof Date
      ? expense.date.toISOString().split("T")[0]
      : expense.date;
    return `${expense.id},${dateStr},${expense.category},${expense.description},${expense.amount}`;
  });

  const csv = [header, ...rows].join("\n");

  fs.writeFileSync("expenses.csv", csv);

  console.log("Expenses exported successfully");
}

module.exports = exportCSV;
