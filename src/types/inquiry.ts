export type InquiryStatus = 'pending' | 'in-progress' | 'completed';
export type InquiryPriority = 'high' | 'medium' | 'low';
export type InquiryCategory =
  | 'general'
  | 'technical'
  | 'billing'
  | 'complaint'
  | 'other';

export interface Inquiry {
  id: string;
  subject: string;
  name: string;
  email: string;
  phone?: string;
  category: InquiryCategory;
  priority: InquiryPriority;
  status: InquiryStatus;
  content: string;
  response?: string;
  receivedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  attachments?: string[]; // 画像URLの配列
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInquiryInput {
  subject: string;
  name: string;
  email: string;
  phone?: string;
  category: InquiryCategory;
  priority: InquiryPriority;
  content: string;
  receivedAt?: Date;
  dueDate?: Date;
  attachments?: string[];
}

export interface UpdateInquiryInput {
  subject?: string;
  name?: string;
  email?: string;
  phone?: string;
  category?: InquiryCategory;
  priority?: InquiryPriority;
  status?: InquiryStatus;
  content?: string;
  response?: string;
  dueDate?: Date;
  completedAt?: Date;
  attachments?: string[];
}
