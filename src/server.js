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

// DELETE /api/transactions (delete all)
app.delete("/api/transactions", async (req, res) => {
  try {
    const result = await prisma.transaction.deleteMany({});
    res.json({ success: true, deletedCount: result.count });
  } catch (error) {
    console.error("Error deleting all transactions:", error);
    res.status(500).json({ error: "Failed to delete transactions" });
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

// ==================== ACCOUNT APIs ====================

// Static data
const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "ru", name: "Russian" },
];

const appInfo = {
  name: "Expense Tracker",
  version: "1.0.0",
  description: "Your personal finance companion. Track expenses, manage budgets, and achieve your financial goals.",
  copyright: "© 2024 Expense Tracker. All rights reserved.",
  features: [
    "Track income and expenses",
    "Categorize transactions",
    "View detailed analytics",
    "Set and manage budgets",
    "Export financial reports",
    "Multi-currency support",
  ],
};

// GET /api/currencies
app.get("/api/currencies", (req, res) => {
  res.json(currencies);
});

// GET /api/languages
app.get("/api/languages", (req, res) => {
  res.json(languages);
});

// GET /api/app-info
app.get("/api/app-info", (req, res) => {
  res.json(appInfo);
});

// GET /api/profile
app.get("/api/profile", async (req, res) => {
  try {
    let user = await prisma.user.findFirst();

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "John Doe",
          email: "john.doe@email.com",
          phone: "+1 234 567 8900",
        },
      });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      currency: user.currency,
      language: user.language,
      notifications: user.notifications,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT /api/profile
app.put("/api/profile", async (req, res) => {
  try {
    const { name, email, phone, avatar, currency, language, notifications } = req.body;

    let user = await prisma.user.findFirst();

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name || "John Doe",
          email: email || "john.doe@email.com",
          phone,
          avatar,
          currency,
          language,
          notifications,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name ?? user.name,
          email: email ?? user.email,
          phone: phone ?? user.phone,
          avatar: avatar ?? user.avatar,
          currency: currency ?? user.currency,
          language: language ?? user.language,
          notifications: notifications ?? user.notifications,
        },
      });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      currency: user.currency,
      language: user.language,
      notifications: user.notifications,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// GET /api/payment-methods
app.get("/api/payment-methods", async (req, res) => {
  try {
    const user = await prisma.user.findFirst();

    if (!user) {
      return res.json([]);
    }

    const methods = await prisma.paymentMethod.findMany({
      where: { userId: user.id },
      orderBy: { id: "asc" },
    });

    res.json(
      methods.map((m) => ({
        id: String(m.id),
        type: m.type,
        last4: m.last4,
        expiry: m.expiry,
        isDefault: m.isDefault,
      }))
    );
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    res.status(500).json({ error: "Failed to fetch payment methods" });
  }
});

// POST /api/payment-methods
app.post("/api/payment-methods", async (req, res) => {
  try {
    const { type, last4, expiry, isDefault } = req.body;

    if (!type || !last4 || !expiry) {
      return res.status(400).json({ error: "type, last4, and expiry are required" });
    }

    let user = await prisma.user.findFirst();

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "John Doe",
          email: "john.doe@email.com",
        },
      });
    }

    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const method = await prisma.paymentMethod.create({
      data: {
        type,
        last4,
        expiry,
        isDefault: isDefault || false,
        userId: user.id,
      },
    });

    res.status(201).json({
      id: String(method.id),
      type: method.type,
      last4: method.last4,
      expiry: method.expiry,
      isDefault: method.isDefault,
    });
  } catch (error) {
    console.error("Error creating payment method:", error);
    res.status(500).json({ error: "Failed to create payment method" });
  }
});

// PUT /api/payment-methods/:id
app.put("/api/payment-methods/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, last4, expiry, isDefault } = req.body;

    const existing = await prisma.paymentMethod.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ error: "Payment method not found" });
    }

    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: existing.userId },
        data: { isDefault: false },
      });
    }

    const method = await prisma.paymentMethod.update({
      where: { id: Number(id) },
      data: {
        type: type ?? existing.type,
        last4: last4 ?? existing.last4,
        expiry: expiry ?? existing.expiry,
        isDefault: isDefault ?? existing.isDefault,
      },
    });

    res.json({
      id: String(method.id),
      type: method.type,
      last4: method.last4,
      expiry: method.expiry,
      isDefault: method.isDefault,
    });
  } catch (error) {
    console.error("Error updating payment method:", error);
    res.status(500).json({ error: "Failed to update payment method" });
  }
});

// DELETE /api/payment-methods/:id
app.delete("/api/payment-methods/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.paymentMethod.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ error: "Payment method not found" });
    }

    await prisma.paymentMethod.delete({
      where: { id: Number(id) },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    res.status(500).json({ error: "Failed to delete payment method" });
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
