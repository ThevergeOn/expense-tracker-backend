const fs = require("fs");

function readBudgets() {
  const data = fs.readFileSync("budgets.json", "utf8");

  return JSON.parse(data);
}
module.exports = readBudgets;
