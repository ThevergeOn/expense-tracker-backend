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
      { name: "Account", description: "User profile and settings" },
      { name: "Payment Methods", description: "Payment method management" },
      { name: "Settings", description: "App settings and configuration" },
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
            type: { type: "string", enum: ["income", "expense"], example: "expense" },
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
            type: { type: "string", enum: ["income", "expense"], example: "expense" },
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
            monthlyData: { type: "array", items: { $ref: "#/components/schemas/MonthlyData" } },
            totalIncome: { type: "number", example: 12000 },
            totalExpenses: { type: "number", example: 8000 },
          },
        },
        UserProfile: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john.doe@email.com" },
            phone: { type: "string", example: "+1 234 567 8900" },
            avatar: { type: "string", example: "https://example.com/avatar.jpg" },
            currency: { type: "string", example: "USD" },
            language: { type: "string", example: "en" },
            notifications: { type: "boolean", example: true },
          },
        },
        UserProfileInput: {
          type: "object",
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john.doe@email.com" },
            phone: { type: "string", example: "+1 234 567 8900" },
            avatar: { type: "string", example: "https://example.com/avatar.jpg" },
            currency: { type: "string", example: "USD" },
            language: { type: "string", example: "en" },
            notifications: { type: "boolean", example: true },
          },
        },
        PaymentMethod: {
          type: "object",
          properties: {
            id: { type: "string", example: "1" },
            type: { type: "string", enum: ["visa", "mastercard", "amex", "discover"], example: "visa" },
            last4: { type: "string", example: "4242" },
            expiry: { type: "string", example: "12/25" },
            isDefault: { type: "boolean", example: true },
          },
        },
        PaymentMethodInput: {
          type: "object",
          required: ["type", "last4", "expiry"],
          properties: {
            type: { type: "string", enum: ["visa", "mastercard", "amex", "discover"], example: "visa" },
            last4: { type: "string", example: "4242" },
            expiry: { type: "string", example: "12/25" },
            isDefault: { type: "boolean", example: false },
          },
        },
        Currency: {
          type: "object",
          properties: {
            code: { type: "string", example: "USD" },
            symbol: { type: "string", example: "$" },
            name: { type: "string", example: "US Dollar" },
          },
        },
        Language: {
          type: "object",
          properties: {
            code: { type: "string", example: "en" },
            name: { type: "string", example: "English" },
          },
        },
        AppInfo: {
          type: "object",
          properties: {
            name: { type: "string", example: "Expense Tracker" },
            version: { type: "string", example: "1.0.0" },
            description: { type: "string", example: "Your personal finance companion." },
            copyright: { type: "string", example: "© 2024 Expense Tracker" },
            features: { type: "array", items: { type: "string" } },
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
              content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Category" } } } },
            },
          },
        },
      },
      "/api/transactions": {
        get: {
          summary: "Get all transactions",
          tags: ["Transactions"],
          parameters: [
            { in: "query", name: "type", schema: { type: "string", enum: ["all", "income", "expense"] }, description: "Filter by transaction type" },
            { in: "query", name: "startDate", schema: { type: "string", format: "date" }, description: "Start date (ISO format)" },
            { in: "query", name: "endDate", schema: { type: "string", format: "date" }, description: "End date (ISO format)" },
            { in: "query", name: "period", schema: { type: "string", enum: ["daily", "weekly", "monthly", "yearly"] }, description: "Filter by period" },
            { in: "query", name: "date", schema: { type: "string", format: "date" }, description: "Base date for period calculation" },
          ],
          responses: {
            200: { description: "List of transactions", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Transaction" } } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
        post: {
          summary: "Create a new transaction",
          tags: ["Transactions"],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/TransactionInput" } } } },
          responses: {
            201: { description: "Transaction created", content: { "application/json": { schema: { $ref: "#/components/schemas/Transaction" } } } },
            400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
        delete: {
          summary: "Delete all transactions",
          tags: ["Transactions"],
          responses: {
            200: { description: "All transactions deleted", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, deletedCount: { type: "integer" } } } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/transactions/{id}": {
        put: {
          summary: "Update a transaction",
          tags: ["Transactions"],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" }, description: "Transaction ID" }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/TransactionInput" } } } },
          responses: {
            200: { description: "Transaction updated", content: { "application/json": { schema: { $ref: "#/components/schemas/Transaction" } } } },
            404: { description: "Transaction not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
        delete: {
          summary: "Delete a transaction",
          tags: ["Transactions"],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" }, description: "Transaction ID" }],
          responses: {
            200: { description: "Transaction deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
            404: { description: "Transaction not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/analytics": {
        get: {
          summary: "Get analytics with date filtering",
          tags: ["Analytics"],
          parameters: [
            { in: "query", name: "startDate", schema: { type: "string", format: "date" }, description: "Start date (ISO format)" },
            { in: "query", name: "endDate", schema: { type: "string", format: "date" }, description: "End date (ISO format)" },
            { in: "query", name: "period", schema: { type: "string", enum: ["daily", "weekly", "monthly", "yearly"] }, description: "Filter by period" },
            { in: "query", name: "date", schema: { type: "string", format: "date" }, description: "Base date for period calculation" },
          ],
          responses: {
            200: { description: "Analytics data with transactions", content: { "application/json": { schema: { type: "object", properties: { totalIncome: { type: "number" }, totalExpenses: { type: "number" }, balance: { type: "number" }, transactionCount: { type: "integer" }, transactions: { type: "array", items: { $ref: "#/components/schemas/Transaction" } } } } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/analytics/monthly": {
        get: {
          summary: "Get monthly analytics breakdown",
          tags: ["Analytics"],
          parameters: [
            { in: "query", name: "startDate", schema: { type: "string", format: "date" }, description: "Start date (ISO format)" },
            { in: "query", name: "endDate", schema: { type: "string", format: "date" }, description: "End date (ISO format)" },
            { in: "query", name: "period", schema: { type: "string", enum: ["daily", "weekly", "monthly", "yearly"] }, description: "Filter by period" },
            { in: "query", name: "date", schema: { type: "string", format: "date" }, description: "Base date for period calculation" },
          ],
          responses: {
            200: { description: "Monthly analytics data", content: { "application/json": { schema: { $ref: "#/components/schemas/Analytics" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/budgets": {
        get: {
          summary: "Get all budgets",
          tags: ["Budgets"],
          responses: {
            200: { description: "List of budgets", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Budget" } } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/profile": {
        get: {
          summary: "Get user profile",
          tags: ["Account"],
          responses: {
            200: { description: "User profile", content: { "application/json": { schema: { $ref: "#/components/schemas/UserProfile" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
        put: {
          summary: "Update user profile",
          tags: ["Account"],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UserProfileInput" } } } },
          responses: {
            200: { description: "Profile updated", content: { "application/json": { schema: { $ref: "#/components/schemas/UserProfile" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/payment-methods": {
        get: {
          summary: "Get all payment methods",
          tags: ["Payment Methods"],
          responses: {
            200: { description: "List of payment methods", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/PaymentMethod" } } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
        post: {
          summary: "Add a payment method",
          tags: ["Payment Methods"],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PaymentMethodInput" } } } },
          responses: {
            201: { description: "Payment method added", content: { "application/json": { schema: { $ref: "#/components/schemas/PaymentMethod" } } } },
            400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/payment-methods/{id}": {
        put: {
          summary: "Update a payment method",
          tags: ["Payment Methods"],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" }, description: "Payment method ID" }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PaymentMethodInput" } } } },
          responses: {
            200: { description: "Payment method updated", content: { "application/json": { schema: { $ref: "#/components/schemas/PaymentMethod" } } } },
            404: { description: "Payment method not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
        delete: {
          summary: "Delete a payment method",
          tags: ["Payment Methods"],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" }, description: "Payment method ID" }],
          responses: {
            200: { description: "Payment method deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
            404: { description: "Payment method not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/currencies": {
        get: {
          summary: "Get supported currencies",
          tags: ["Settings"],
          responses: {
            200: { description: "List of currencies", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Currency" } } } } },
          },
        },
      },
      "/api/languages": {
        get: {
          summary: "Get supported languages",
          tags: ["Settings"],
          responses: {
            200: { description: "List of languages", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Language" } } } } },
          },
        },
      },
      "/api/app-info": {
        get: {
          summary: "Get app information",
          tags: ["Settings"],
          responses: {
            200: { description: "App information", content: { "application/json": { schema: { $ref: "#/components/schemas/AppInfo" } } } },
          },
        },
      },
      "/api/health": {
        get: {
          summary: "Health check",
          tags: ["Health"],
          responses: {
            200: { description: "Server is healthy", content: { "application/json": { schema: { type: "object", properties: { status: { type: "string", example: "ok" } } } } } },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
