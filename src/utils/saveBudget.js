const fs = require("fs");

function saveBudgets(budgets) {
  fs.writeFileSync(
    "budgets.json",

    JSON.stringify(budgets, null, 2),
  );
}
module.exports = saveBudgets;
