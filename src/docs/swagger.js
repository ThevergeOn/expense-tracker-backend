const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Expense Tracker API",
      version: "1.0.0",
      description: "REST API for expense tracking application",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Development server",
      },
    ],
    tags: [
      { name: "Transactions", description: "Transaction management" },
      { name: "Categories", description: "Expense categories" },
      { name: "Analytics", description: "Financial analytics" },
      { name: "Budgets", description: "Budget management" },
      { name: "Health", description: "Server health" },
    ],
    components: {
      schemas: {
        Transaction: {
          type: "object",
          properties: {
            id: { type: "string", example: "1" },
            title: { type: "string", example: "Grocery shopping" },
            category: { type: "string", example: "groceries" },
            amount: { type: "number", example: 50.0 },
            date: { type: "string", format: "date", example: "2026-05-30" },
            type: {
              type: "string",
              enum: ["income", "expense"],
              example: "expense",
            },
            icon: { type: "string", example: "cart" },
            iconColor: { type: "string", example: "#22C55E" },
            iconBg: { type: "string", example: "#DCFCE7" },
          },
        },
        TransactionInput: {
          type: "object",
          required: ["title", "amount", "type"],
          properties: {
            title: { type: "string", example: "Grocery shopping" },
            category: { type: "string", example: "groceries" },
            amount: { type: "number", example: 50.0 },
            date: { type: "string", format: "date", example: "2026-05-30" },
            type: {
              type: "string",
              enum: ["income", "expense"],
              example: "expense",
            },
            icon: { type: "string", example: "cart" },
            iconColor: { type: "string", example: "#22C55E" },
            iconBg: { type: "string", example: "#DCFCE7" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string", example: "groceries" },
            name: { type: "string", example: "Groceries" },
            icon: { type: "string", example: "cart" },
            color: { type: "string", example: "#22C55E" },
            bgColor: { type: "string", example: "#DCFCE7" },
          },
        },
        Budget: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            month: { type: "integer", minimum: 1, maximum: 12, example: 6 },
            amount: { type: "number", example: 1000.0 },
          },
        },
        MonthlyData: {
          type: "object",
          properties: {
            month: { type: "string", example: "May" },
            income: { type: "number", example: 3000 },
            expense: { type: "number", example: 1500 },
          },
        },
        Analytics: {
          type: "object",
          properties: {
            monthlyData: {
              type: "array",
              items: { $ref: "#/components/schemas/MonthlyData" },
            },
            totalIncome: { type: "number", example: 12000 },
            totalExpenses: { type: "number", example: 8000 },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Error message" },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
          },
        },
      },
    },
    paths: {
      "/api/categories": {
        get: {
          summary: "Get all categories",
          tags: ["Categories"],
          responses: {
            200: {
              description: "List of categories",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Category" },
                  },
                },
              },
            },
          },
        },
      },
      "/api/transactions": {
        get: {
          summary: "Get all transactions",
          tags: ["Transactions"],
          parameters: [
            {
              in: "query",
              name: "type",
              schema: {
                type: "string",
                enum: ["all", "income", "expense"],
              },
              description: "Filter by transaction type",
            },
          ],
          responses: {
            200: {
              description: "List of transactions",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Transaction" },
                  },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a new transaction",
          tags: ["Transactions"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionInput" },
              },
            },
          },
          responses: {
            201: {
              description: "Transaction created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Transaction" },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/transactions/{id}": {
        put: {
          summary: "Update a transaction",
          tags: ["Transactions"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "Transaction ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionInput" },
              },
            },
          },
          responses: {
            200: {
              description: "Transaction updated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Transaction" },
                },
              },
            },
            404: {
              description: "Transaction not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        delete: {
          summary: "Delete a transaction",
          tags: ["Transactions"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
              description: "Transaction ID",
            },
          ],
          responses: {
            200: {
              description: "Transaction deleted",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
            404: {
              description: "Transaction not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/analytics/monthly": {
        get: {
          summary: "Get monthly analytics",
          tags: ["Analytics"],
          responses: {
            200: {
              description: "Monthly analytics data",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Analytics" },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/budgets": {
        get: {
          summary: "Get all budgets",
          tags: ["Budgets"],
          responses: {
            200: {
              description: "List of budgets",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Budget" },
                  },
                },
              },
            },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/health": {
        get: {
          summary: "Health check",
          tags: ["Health"],
          responses: {
            200: {
              description: "Server is healthy",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
