const fs = require("fs");
const path = require("path");

const expensesPath = path.join(__dirname, "../../expenses.json");

function readExpenses() {
  const data = fs.readFileSync(expensesPath, "utf8");
  return JSON.parse(data);
}

module.exports = readExpenses;
