const add = require("./commands/add");
const update = require("./commands/update");
const deleteExpense = require("./commands/delete");
const list = require("./commands/list");
const summary = require("./commands/summary");
const setBudget = require("./commands/setBudget");
const command = process.argv[2];
const exportData = require("./commands/export");
if (command === "add") {
  add();
} else if (command === "list") {
  list();
} else if (command === "summary") {
  summary();
} else if (command === "delete") {
  deleteExpense();
} else if (command === "update") {
  update();
} else if (command === "set-budget") {
  setBudget();
} else if (command === "export") {
  exportData();
}
