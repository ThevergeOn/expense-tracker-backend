const express = require("express");
const prisma = require("../utils/prisma");
const { currencies, languages, appInfo } = require("../data/constants");

const router = express.Router();

// GET /api/currencies
router.get("/currencies", (req, res) => {
  res.json(currencies);
});

// GET /api/languages
router.get("/languages", (req, res) => {
  res.json(languages);
});

// GET /api/app-info
router.get("/app-info", (req, res) => {
  res.json(appInfo);
});

// GET /api/profile
router.get("/profile", async (req, res) => {
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
router.put("/profile", async (req, res) => {
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
router.get("/payment-methods", async (req, res) => {
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
router.post("/payment-methods", async (req, res) => {
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
router.put("/payment-methods/:id", async (req, res) => {
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
router.delete("/payment-methods/:id", async (req, res) => {
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

module.exports = router;
