const fs = require("fs");
const path = require("path");

const expensesPath = path.join(__dirname, "../../expenses.json");

function saveExpenses(expenses) {
  fs.writeFileSync(expensesPath, JSON.stringify(expenses, null, 2));
}

module.exports = saveExpenses;
