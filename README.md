# Expense Tracker Backend

A REST API backend for the Expense Tracker mobile application, built with Node.js, Express, and Prisma ORM.

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js 5
- **Database**: PostgreSQL (Neon for production)
- **ORM**: Prisma 7
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Render + Docker

## Live Demo

- **API**: https://expense-tracker-backend-bdj4.onrender.com
- **Swagger Docs**: https://expense-tracker-backend-bdj4.onrender.com/api-docs

## Project Structure

```
expense-tracker-backend/
├── prisma/
│   └── schema.prisma        # Database schema
├── src/
│   ├── server.js            # Express app entry point
│   ├── data/
│   │   └── constants.js     # Static data (categories, currencies, etc.)
│   ├── docs/
│   │   └── swagger.js       # OpenAPI specification
│   ├── routes/
│   │   ├── transactions.js  # Transaction CRUD endpoints
│   │   ├── analytics.js     # Analytics & reports
│   │   ├── account.js       # Profile & payment methods
│   │   ├── budgets.js       # Budget management
│   │   └── categories.js    # Categories list
│   ├── utils/
│   │   ├── prisma.js        # Prisma client instance
│   │   └── dateHelpers.js   # Date filtering utilities
│   └── commands/            # CLI commands (legacy)
├── .github/
│   └── workflows/
│       ├── ci.yml           # Continuous Integration
│       ├── cd.yml           # Continuous Deployment
│       └── pr-check.yml     # Pull Request checks
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or Neon)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ThevergeOn/expense-tracker-backend.git
   cd expense-tracker-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database connection:
   ```env
   # Local development
   DATABASE_URL=postgresql://postgres:password@localhost:5432/expense_tracker

   # Or Neon (production)
   DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require

   PORT=3000
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   ```

5. **Generate Prisma client**
   ```bash
   npm run db:generate
   ```

6. **Start the server**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

7. **Open Swagger docs**
   ```
   http://localhost:3000/api-docs
   ```

### Using Docker

```bash
# Start with Docker Compose (includes PostgreSQL)
docker-compose up -d

# Or build and run manually
docker build -t expense-tracker-api .
docker run -p 3000:3000 -e DATABASE_URL=your_db_url expense-tracker-api
```

## API Endpoints

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List all transactions |
| POST | `/api/transactions` | Create a transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |
| DELETE | `/api/transactions` | Delete all transactions |

**Query Parameters for filtering:**
- `type` - Filter by type (`income`, `expense`, `all`)
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `period` - Period filter (`daily`, `weekly`, `monthly`, `yearly`)
- `date` - Base date for period calculation

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get summary (income, expenses, balance) |
| GET | `/api/analytics/monthly` | Get monthly breakdown |

### Account

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update user profile |
| GET | `/api/payment-methods` | List payment methods |
| POST | `/api/payment-methods` | Add payment method |
| PUT | `/api/payment-methods/:id` | Update payment method |
| DELETE | `/api/payment-methods/:id` | Delete payment method |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| GET | `/api/budgets` | List all budgets |
| GET | `/api/currencies` | List supported currencies |
| GET | `/api/languages` | List supported languages |
| GET | `/api/app-info` | Get app information |
| GET | `/api/health` | Health check |

## Database Schema

```prisma
model Transaction {
  id        Int      @id @default(autoincrement())
  title     String
  category  String   @default("other")
  amount    Decimal
  date      DateTime @db.Date
  type      String   @default("expense")  // "income" or "expense"
  icon      String?
  iconColor String?
  iconBg    String?
}

model Budget {
  id     Int     @id @default(autoincrement())
  month  Int     @unique
  amount Decimal
}

model User {
  id             Int             @id @default(autoincrement())
  name           String
  email          String          @unique
  phone          String?
  avatar         String?
  currency       String          @default("USD")
  language       String          @default("en")
  notifications  Boolean         @default(true)
  paymentMethods PaymentMethod[]
}

model PaymentMethod {
  id        Int     @id @default(autoincrement())
  type      String
  last4     String
  expiry    String
  isDefault Boolean @default(false)
  userId    Int
  user      User    @relation(...)
}
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `npm run db:setup` | Create database tables |
| `npm run db:generate` | Generate Prisma client |
| `npm run cli` | Run CLI commands |
| `npm test` | Run tests |
| `npm run lint` | Run linting |

## Remaining Tasks / TODOs

### High Priority
- [ ] Add authentication (JWT or session-based)
- [ ] Add input validation middleware (express-validator or zod)
- [ ] Add rate limiting
- [ ] Write unit and integration tests

### Medium Priority
- [ ] Add budget CRUD operations (create, update, delete)
- [ ] Add expense categories CRUD (custom categories)
- [ ] Add recurring transactions support
- [ ] Add export to CSV/PDF functionality
- [ ] Add transaction search/filter by title

### Low Priority
- [ ] Add multi-user support (currently single user)
- [ ] Add notifications/reminders for budgets
- [ ] Add currency conversion API integration
- [ ] Add data backup/restore functionality
- [ ] Add transaction attachments (receipts)

### DevOps
- [ ] Set up staging environment
- [ ] Add database migrations with Prisma Migrate
- [ ] Add error monitoring (Sentry)
- [ ] Add performance monitoring
- [ ] Add automated backups

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PORT` | Server port | 3000 |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Related

- [Expense Tracker Frontend](https://github.com/ThevergeOn/expense-tracker) - React Native mobile app
