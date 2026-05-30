const express = require("express");
const prisma = require("../utils/prisma");

const router = express.Router();

// GET /api/budgets
router.get("/", async (req, res) => {
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

module.exports = router;
