const fs = require("fs");

const command = process.argv[2];

function readExpenses() {
  const data = fs.readFileSync("expenses.json", "utf8");
  return JSON.parse(data);
}

function saveExpenses(expenses) {
  fs.writeFileSync("expenses.json", JSON.stringify(expenses, null, 2));
}

function getArgValue(argName) {
  const index = process.argv.indexOf(argName);

  if (index === -1) {
    return null;
  }

  return process.argv[index + 1];
}

if (command === "add") {
  const description = getArgValue("--description");
  const amount = getArgValue("--amount");

  if (!description) {
    console.log("Description is required");
    return;
  }

  if (!amount) {
    console.log("Amount is required");
    return;
  }

  const numericAmount = Number(amount);

  if (isNaN(numericAmount)) {
    console.log("Amount must be a number");
    return;
  }

  if (numericAmount <= 0) {
    console.log("Amount must be greater than zero");
    return;
  }

  const expenses = readExpenses();
  const lastExpense = expenses[expenses.length - 1];
  const newId = lastExpense ? lastExpense.id + 1 : 1;

  const newExpense = {
    id: newId,
    date: new Date().toISOString().split("T")[0],
    description,
    amount: numericAmount,
  };

  expenses.push(newExpense);

  saveExpenses(expenses);

  console.log(`Expense added successfully (ID: ${newExpense.id})`);
} else if (command === "list") {
  const expenses = readExpenses();

  if (expenses.length === 0) {
    console.log("No expenses found");
    return;
  }

  console.log("ID  Date        Description  Amount");

  expenses.forEach((expense) => {
    console.log(
      `${expense.id}   ${expense.date}  ${expense.description}        $${expense.amount}`,
    );
  });
} else if (command === "summary") {
  const expenses = readExpenses();

  const total = expenses.reduce((sum, expense) => {
    return sum + expense.amount;
  }, 0);

  console.log(`Total expenses: $${total}`);
} else if (command === "delete") {
  const id = getArgValue("--id");

  if (!id) {
    console.log("ID is required");
    return;
  }

  const numericId = Number(id);

  const expenses = readExpenses();

  const expense = expenses.find((expense) => expense.id === numericId);

  if (!expense) {
    console.log("Expense not found");
    return;
  }

  const updatedExpenses = expenses.filter(
    (expense) => expense.id !== numericId,
  );

  saveExpenses(updatedExpenses);

  console.log("Expense deleted successfully");
} else if (command === "update") {
  const id = getArgValue("--id");

  if (!id) {
    console.log("ID is required");
    return;
  }

  const numericId = Number(id);

  const description = getArgValue("--description");

  const amount = getArgValue("--amount");

  const expenses = readExpenses();

  const expense = expenses.find((expense) => expense.id === numericId);

  if (!expense) {
    console.log("Expense not found");
    return;
  }

  const updatedExpenses = expenses.map((expense) => {
    if (expense.id !== numericId) {
      return expense;
    }

    return {
      ...expense,

      description: description ? description : expense.description,

      amount: amount ? Number(amount) : expense.amount,
    };
  });

  saveExpenses(updatedExpenses);

  console.log("Expense updated successfully");
}
