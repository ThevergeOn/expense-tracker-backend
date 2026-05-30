function getDateRange(period, date) {
  const baseDate = date ? new Date(date) : new Date();
  let startDate, endDate;

  switch (period) {
    case "daily":
      startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
      endDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 1);
      break;
    case "weekly":
      const dayOfWeek = baseDate.getDay();
      startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - dayOfWeek);
      endDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + (7 - dayOfWeek));
      break;
    case "monthly":
      startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
      endDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0, 23, 59, 59);
      break;
    case "yearly":
      startDate = new Date(baseDate.getFullYear(), 0, 1);
      endDate = new Date(baseDate.getFullYear(), 11, 31, 23, 59, 59);
      break;
    default:
      return null;
  }

  return { startDate, endDate };
}

function buildDateFilter(query) {
  const { startDate, endDate, period, date } = query;
  const where = {};

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  } else if (period) {
    const range = getDateRange(period, date);
    if (range) {
      where.date = {
        gte: range.startDate,
        lte: range.endDate,
      };
    }
  }

  return where;
}

module.exports = { getDateRange, buildDateFilter };
