const express = require("express");
const prisma = require("../utils/prisma");
const { buildDateFilter } = require("../utils/dateHelpers");

const router = express.Router();

// Format transaction for response
function formatTransaction(t) {
  return {
    id: String(t.id),
    title: t.title,
    category: t.category,
    amount: Number(t.amount),
    date: t.date.toISOString().split("T")[0],
    type: t.type,
    icon: t.icon,
    iconColor: t.iconColor,
    iconBg: t.iconBg,
  };
}

// GET /api/analytics
router.get("/", async (req, res) => {
  try {
    const where = buildDateFilter(req.query);

    const transactions = await prisma.transaction.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { date: "desc" },
    });

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
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactionCount: transactions.length,
      transactions: transactions.map(formatTransaction),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// GET /api/analytics/monthly
router.get("/monthly", async (req, res) => {
  try {
    const where = buildDateFilter(req.query);

    const transactions = await prisma.transaction.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
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

module.exports = router;
