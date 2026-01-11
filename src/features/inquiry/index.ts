// Actions
export {
  getInquiries,
  getInquiry,
  searchInquiries,
  filterInquiriesByStatus,
  createInquiry,
  updateInquiry,
  deleteInquiry,
  getInquiryStatistics,
} from './actions';

// Store
export { inquiryStore } from './store';

// Utils
export {
  getStatusCounts,
  getPriorityCounts,
  getCategoryCounts,
  getTimeSeriesData,
  getStatsSummary,
} from './utils';

// Types
export type {
  Inquiry,
  InquiryStatus,
  InquiryPriority,
  InquiryCategory,
  CreateInquiryInput,
  UpdateInquiryInput,
  StatusCount,
  PriorityCount,
  CategoryCount,
  TimeSeriesDataPoint,
  InquiryStatistics,
} from './types';

// Components
export { default as InquiryDashboard } from './components/InquiryDashboard';
