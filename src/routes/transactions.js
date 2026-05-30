const express = require("express");
const prisma = require("../utils/prisma");
const { buildDateFilter } = require("../utils/dateHelpers");
const { categories } = require("../data/constants");

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

// GET /api/transactions
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const where = buildDateFilter(req.query);

    if (type && type !== "all") {
      where.type = type;
    }

    const transactions = await prisma.transaction.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { date: "desc" },
    });

    res.json(transactions.map(formatTransaction));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// POST /api/transactions
router.post("/", async (req, res) => {
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

    res.status(201).json(formatTransaction(transaction));
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

// PUT /api/transactions/:id
router.put("/:id", async (req, res) => {
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

    res.json(formatTransaction(transaction));
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

// DELETE /api/transactions/:id
router.delete("/:id", async (req, res) => {
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
router.delete("/", async (req, res) => {
  try {
    const result = await prisma.transaction.deleteMany({});
    res.json({ success: true, deletedCount: result.count });
  } catch (error) {
    console.error("Error deleting all transactions:", error);
    res.status(500).json({ error: "Failed to delete transactions" });
  }
});

module.exports = router;
