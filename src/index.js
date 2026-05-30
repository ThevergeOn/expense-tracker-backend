const add = require("./commands/add");
const update = require("./commands/update");
const deleteExpense = require("./commands/delete");
const list = require("./commands/list");
const summary = require("./commands/summary");
const setBudget = require("./commands/setBudget");
const exportData = require("./commands/export");

const command = process.argv[2];

(async () => {
  if (command === "add") {
    await add();
  } else if (command === "list") {
    await list();
  } else if (command === "summary") {
    await summary();
  } else if (command === "delete") {
    await deleteExpense();
  } else if (command === "update") {
    await update();
  } else if (command === "set-budget") {
    await setBudget();
  } else if (command === "export") {
    await exportData();
  }
  process.exit(0);
})();
