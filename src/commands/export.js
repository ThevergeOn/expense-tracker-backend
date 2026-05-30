const fs = require("fs");
const readExpenses = require("../utils/readExpenses");

function exportCSV() {
  const expenses = readExpenses();

  if (expenses.length === 0) {
    console.log("No expenses to export");
    return;
  }

  const header = "ID,Date,Category,Description,Amount";

  const rows = expenses.map((expense) => {
    return `${expense.id},${expense.date},${expense.category},${expense.description},${expense.amount}`;
  });

  const csv = [header, ...rows].join("\n");

  fs.writeFileSync("expenses.csv", csv);

  console.log("Expenses exported successfully");
}
module.exports = exportCSV;
