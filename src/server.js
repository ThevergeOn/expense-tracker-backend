require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const prisma = require("./utils/prisma");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan(":date[iso] :method :url :status :response-time ms - :res[content-length]"));

// Swagger documentation
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

const swaggerRouter = express.Router();
swaggerRouter.use("/", swaggerUi.serve);
swaggerRouter.get("/", swaggerUi.setup(swaggerSpec));
app.use("/api-docs", swaggerRouter);

// Categories data
const categories = [
  { id: "groceries", name: "Groceries", icon: "cart", color: "#22C55E", bgColor: "#DCFCE7" },
  { id: "travel", name: "Travel", icon: "airplane", color: "#3B82F6", bgColor: "#DBEAFE" },
  { id: "car", name: "Car", icon: "car", color: "#EF4444", bgColor: "#FEE2E2" },
  { id: "home", name: "Home", icon: "home", color: "#8B5CF6", bgColor: "#EDE9FE" },
  { id: "insurances", name: "Insurances", icon: "shield-checkmark", color: "#06B6D4", bgColor: "#CFFAFE" },
  { id: "education", name: "Education", icon: "school", color: "#F59E0B", bgColor: "#FEF3C7" },
  { id: "marketing", name: "Marketing", icon: "megaphone", color: "#EC4899", bgColor: "#FCE7F3" },
  { id: "shopping", name: "Shopping", icon: "bag", color: "#F97316", bgColor: "#FFEDD5" },
  { id: "internet", name: "Internet", icon: "wifi", color: "#6366F1", bgColor: "#E0E7FF" },
  { id: "water", name: "Water", icon: "water", color: "#0EA5E9", bgColor: "#E0F2FE" },
  { id: "rent", name: "Rent", icon: "business", color: "#84CC16", bgColor: "#ECFCCB" },
  { id: "gym", name: "Gym", icon: "fitness", color: "#14B8A6", bgColor: "#CCFBF1" },
  { id: "subscription", name: "Subscription", icon: "card", color: "#A855F7", bgColor: "#F3E8FF" },
  { id: "vacation", name: "Vacation", icon: "sunny", color: "#FBBF24", bgColor: "#FEF9C3" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal", color: "#6B7280", bgColor: "#F3F4F6" },
];

// GET /api/categories
app.get("/api/categories", (req, res) => {
  res.json(categories);
});

// GET /api/transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const { type } = req.query;
    const where = type && type !== "all" ? { type } : undefined;

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
    });

    const formatted = transactions.map((t) => ({
      id: String(t.id),
      title: t.title,
      category: t.category,
      amount: Number(t.amount),
      date: t.date.toISOString().split("T")[0],
      type: t.type,
      icon: t.icon,
      iconColor: t.iconColor,
      iconBg: t.iconBg,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// POST /api/transactions
app.post("/api/transactions", async (req, res) => {
  try {
    const { title, category, amount, date, type, icon, iconColor, iconBg } = req.body;

    if (!title || amount === undefined || !type) {
      return res.status(400).json({ error: "title, amount, and type are required" });
    }

    const categoryData = categories.find((c) => c.id === category);

    const transaction = await prisma.transaction.create({
      data: {
        title,
        category: category || "other",
        amount: Number(amount),
        date: date ? new Date(date) : new Date(),
        type,
        icon: icon || categoryData?.icon || "ellipsis-horizontal",
        iconColor: iconColor || categoryData?.color || "#6B7280",
        iconBg: iconBg || categoryData?.bgColor || "#F3F4F6",
      },
    });

    res.status(201).json({
      id: String(transaction.id),
      title: transaction.title,
      category: transaction.category,
      amount: Number(transaction.amount),
      date: transaction.date.toISOString().split("T")[0],
      type: transaction.type,
      icon: transaction.icon,
      iconColor: transaction.iconColor,
      iconBg: transaction.iconBg,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

// PUT /api/transactions/:id
app.put("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, amount, date, type, icon, iconColor, iconBg } = req.body;

    const existing = await prisma.transaction.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const categoryData = category ? categories.find((c) => c.id === category) : null;

    const transaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        title: title ?? existing.title,
        category: category ?? existing.category,
        amount: amount !== undefined ? Number(amount) : existing.amount,
        date: date ? new Date(date) : existing.date,
        type: type ?? existing.type,
        icon: icon ?? (categoryData?.icon || existing.icon),
        iconColor: iconColor ?? (categoryData?.color || existing.iconColor),
        iconBg: iconBg ?? (categoryData?.bgColor || existing.iconBg),
      },
    });

    res.json({
      id: String(transaction.id),
      title: transaction.title,
      category: transaction.category,
      amount: Number(transaction.amount),
      date: transaction.date.toISOString().split("T")[0],
      type: transaction.type,
      icon: transaction.icon,
      iconColor: transaction.iconColor,
      iconBg: transaction.iconBg,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

// DELETE /api/transactions/:id
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.transaction.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    await prisma.transaction.delete({
      where: { id: Number(id) },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

// GET /api/analytics/monthly
app.get("/api/analytics/monthly", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "asc" },
    });

    const monthlyMap = new Map();

    transactions.forEach((t) => {
      const monthKey = t.date.toLocaleString("en-US", { month: "short" });

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { month: monthKey, income: 0, expense: 0 });
      }

      const data = monthlyMap.get(monthKey);
      const amount = Number(t.amount);

      if (t.type === "income") {
        data.income += amount;
      } else {
        data.expense += amount;
      }
    });

    const monthlyData = Array.from(monthlyMap.values());

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((t) => {
      const amount = Number(t.amount);
      if (t.type === "income") {
        totalIncome += amount;
      } else {
        totalExpenses += amount;
      }
    });

    res.json({
      monthlyData,
      totalIncome,
      totalExpenses,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// GET /api/budgets
app.get("/api/budgets", async (req, res) => {
  try {
    const budgets = await prisma.budget.findMany({
      orderBy: { month: "asc" },
    });

    res.json(
      budgets.map((b) => ({
        id: b.id,
        month: b.month,
        amount: Number(b.amount),
      }))
    );
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});

// GET /api/health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
