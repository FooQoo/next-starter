export interface StatusCount {
  pending: number;
  'in-progress': number;
  completed: number;
  total: number;
}

export interface PriorityCount {
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface CategoryCount {
  general: number;
  technical: number;
  billing: number;
  complaint: number;
  other: number;
  total: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  count: number;
}

export interface InquiryStatistics {
  statusCount: StatusCount;
  priorityCount: PriorityCount;
  categoryCount: CategoryCount;
  timeSeriesData: TimeSeriesDataPoint[];
  lastUpdated: Date;
}
