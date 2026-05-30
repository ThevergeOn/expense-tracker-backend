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

module.exports = { categories, currencies, languages, appInfo };
