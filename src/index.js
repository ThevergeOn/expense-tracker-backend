const add = require("./commands/add");
const update = require("./commands/update");
const deleteExpense = require("./commands/delete");
const list = require("./commands/list");
const summary = require("./commands/summary");

const command = process.argv[2];

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
}
