'use server';

import { revalidatePath } from 'next/cache';
import { inquiryStore } from './store';
import type {
  Inquiry,
  InquiryStatus,
  InquiryCategory,
  InquiryPriority,
  CreateInquiryInput,
  UpdateInquiryInput,
  InquiryStatistics,
} from './types';
import { getStatsSummary } from './utils';

export async function getInquiries(): Promise<Inquiry[]> {
  return inquiryStore.getAll();
}

export async function getInquiry(id: string): Promise<Inquiry | undefined> {
  return inquiryStore.getById(id);
}

export async function searchInquiries(query: string): Promise<Inquiry[]> {
  return inquiryStore.search(query);
}

export async function filterInquiriesByStatus(
  status: InquiryStatus
): Promise<Inquiry[]> {
  return inquiryStore.filterByStatus(status);
}

export async function createInquiry(formData: FormData): Promise<Inquiry> {
  const data: CreateInquiryInput = {
    subject: formData.get('subject') as string,
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || undefined,
    category: formData.get('category') as InquiryCategory,
    priority: formData.get('priority') as InquiryPriority,
    content: formData.get('content') as string,
    receivedAt: formData.get('receivedAt')
      ? new Date(formData.get('receivedAt') as string)
      : undefined,
    dueDate: formData.get('dueDate')
      ? new Date(formData.get('dueDate') as string)
      : undefined,
    attachments: formData.getAll('attachments') as string[],
  };

  // バリデーション
  if (!data.subject || data.subject.trim() === '') {
    throw new Error('件名は必須です');
  }
  if (!data.name || data.name.trim() === '') {
    throw new Error('氏名は必須です');
  }
  if (!data.email || data.email.trim() === '') {
    throw new Error('メールアドレスは必須です');
  }
  if (!data.content || data.content.trim() === '') {
    throw new Error('問い合わせ内容は必須です');
  }

  const inquiry = inquiryStore.create(data);
  revalidatePath('/');
  revalidatePath('/inquiry');
  return inquiry;
}

export async function updateInquiry(
  id: string,
  formData: FormData
): Promise<Inquiry> {
  const data: UpdateInquiryInput = {};

  if (formData.has('subject')) data.subject = formData.get('subject') as string;
  if (formData.has('name')) data.name = formData.get('name') as string;
  if (formData.has('email')) data.email = formData.get('email') as string;
  if (formData.has('phone')) data.phone = formData.get('phone') as string;
  if (formData.has('category'))
    data.category = formData.get('category') as InquiryCategory;
  if (formData.has('priority'))
    data.priority = formData.get('priority') as InquiryPriority;
  if (formData.has('status'))
    data.status = formData.get('status') as InquiryStatus;
  if (formData.has('content')) data.content = formData.get('content') as string;
  if (formData.has('response'))
    data.response = formData.get('response') as string;
  if (formData.has('dueDate'))
    data.dueDate = new Date(formData.get('dueDate') as string);
  if (formData.has('completedAt'))
    data.completedAt = new Date(formData.get('completedAt') as string);
  if (formData.has('attachments'))
    data.attachments = formData.getAll('attachments') as string[];

  const inquiry = inquiryStore.update(id, data);
  revalidatePath('/');
  revalidatePath('/inquiry');
  revalidatePath(`/inquiry/${id}`);
  return inquiry;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const result = inquiryStore.delete(id);
  revalidatePath('/');
  revalidatePath('/inquiry');
  return result;
}

export async function getInquiryStatistics(): Promise<InquiryStatistics> {
  const inquiries = inquiryStore.getAll();
  return getStatsSummary(inquiries);
}
