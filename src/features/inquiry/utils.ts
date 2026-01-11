import type {
  Inquiry,
  StatusCount,
  PriorityCount,
  CategoryCount,
  TimeSeriesDataPoint,
  InquiryStatistics,
} from './types';

export function getStatusCounts(inquiries: Inquiry[]): StatusCount {
  const counts = {
    pending: 0,
    'in-progress': 0,
    completed: 0,
    total: inquiries.length,
  };

  inquiries.forEach((inquiry) => {
    counts[inquiry.status]++;
  });

  return counts;
}

export function getPriorityCounts(inquiries: Inquiry[]): PriorityCount {
  const counts = {
    high: 0,
    medium: 0,
    low: 0,
    total: inquiries.length,
  };

  inquiries.forEach((inquiry) => {
    counts[inquiry.priority]++;
  });

  return counts;
}

export function getCategoryCounts(inquiries: Inquiry[]): CategoryCount {
  const counts = {
    general: 0,
    technical: 0,
    billing: 0,
    complaint: 0,
    other: 0,
    total: inquiries.length,
  };

  inquiries.forEach((inquiry) => {
    counts[inquiry.category]++;
  });

  return counts;
}

export function getTimeSeriesData(
  inquiries: Inquiry[],
  period: 'daily' | 'weekly' | 'monthly' = 'daily'
): TimeSeriesDataPoint[] {
  if (inquiries.length === 0) {
    return [];
  }

  // Group inquiries by date
  const dateMap = new Map<string, number>();

  inquiries.forEach((inquiry) => {
    const date = new Date(inquiry.receivedAt);
    let key: string;

    switch (period) {
      case 'daily':
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        break;
      case 'weekly': {
        // Get the Monday of the week
        const weekStart = new Date(date);
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
        weekStart.setDate(diff);
        key = weekStart.toISOString().split('T')[0];
        break;
      }
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
    }

    dateMap.set(key, (dateMap.get(key) || 0) + 1);
  });

  // Convert to array and sort by date
  return Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getStatsSummary(inquiries: Inquiry[]): InquiryStatistics {
  return {
    statusCount: getStatusCounts(inquiries),
    priorityCount: getPriorityCounts(inquiries),
    categoryCount: getCategoryCounts(inquiries),
    timeSeriesData: getTimeSeriesData(inquiries, 'daily'),
    lastUpdated: new Date(),
  };
}
