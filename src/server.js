require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

// Import routes
const transactionsRouter = require("./routes/transactions");
const analyticsRouter = require("./routes/analytics");
const accountRouter = require("./routes/account");
const budgetsRouter = require("./routes/budgets");
const categoriesRouter = require("./routes/categories");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
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

// API Routes
app.use("/api/transactions", transactionsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api", accountRouter);
app.use("/api/budgets", budgetsRouter);
app.use("/api/categories", categoriesRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
