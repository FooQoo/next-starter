import type {
  Inquiry,
  InquiryStatus,
  CreateInquiryInput,
  UpdateInquiryInput,
} from '@/types/inquiry';

class InquiryStore {
  private inquiries: Map<string, Inquiry> = new Map();
  private idCounter = 1;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockInquiries: Inquiry[] = [
      {
        id: '1',
        subject: 'システムの利用方法について',
        name: '山田太郎',
        email: 'yamada@example.com',
        phone: '090-1234-5678',
        category: 'general',
        priority: 'medium',
        status: 'completed',
        content:
          '問い合わせ管理システムの利用方法について教えてください。特に、新規問い合わせの登録方法について知りたいです。',
        response:
          'お問い合わせありがとうございます。新規問い合わせの登録方法については、ダッシュボードの「新規作成」ボタンからフォームを開いていただき、必要事項を入力後「保存」ボタンを押すだけで完了します。',
        receivedAt: new Date('2025-01-01T09:00:00'),
        dueDate: new Date('2025-01-03T17:00:00'),
        completedAt: new Date('2025-01-02T14:30:00'),
        attachments: [],
        createdAt: new Date('2025-01-01T09:00:00'),
        updatedAt: new Date('2025-01-02T14:30:00'),
      },
      {
        id: '2',
        subject: 'ログインできない',
        name: '佐藤花子',
        email: 'sato@example.com',
        category: 'technical',
        priority: 'high',
        status: 'in-progress',
        content:
          'ユーザー名とパスワードを入力してもログインできません。「認証に失敗しました」というエラーメッセージが表示されます。',
        response:
          '現在調査中です。パスワードのリセットをお試しいただけますでしょうか。',
        receivedAt: new Date('2025-01-03T10:15:00'),
        dueDate: new Date('2025-01-04T17:00:00'),
        attachments: [],
        createdAt: new Date('2025-01-03T10:15:00'),
        updatedAt: new Date('2025-01-03T15:20:00'),
      },
      {
        id: '3',
        subject: '請求書の発行について',
        name: '鈴木一郎',
        email: 'suzuki@example.com',
        phone: '03-1234-5678',
        category: 'billing',
        priority: 'medium',
        status: 'pending',
        content: '先月分の請求書を発行していただきたいです。',
        receivedAt: new Date('2025-01-04T13:45:00'),
        dueDate: new Date('2025-01-06T17:00:00'),
        attachments: [],
        createdAt: new Date('2025-01-04T13:45:00'),
        updatedAt: new Date('2025-01-04T13:45:00'),
      },
      {
        id: '4',
        subject: 'データのエクスポート機能について',
        name: '田中美咲',
        email: 'tanaka@example.com',
        category: 'general',
        priority: 'low',
        status: 'pending',
        content:
          '問い合わせデータをCSV形式でエクスポートする機能はありますか？',
        receivedAt: new Date('2025-01-05T11:00:00'),
        dueDate: new Date('2025-01-10T17:00:00'),
        attachments: [],
        createdAt: new Date('2025-01-05T11:00:00'),
        updatedAt: new Date('2025-01-05T11:00:00'),
      },
      {
        id: '5',
        subject: 'サービスの改善要望',
        name: '高橋健太',
        email: 'takahashi@example.com',
        phone: '080-9876-5432',
        category: 'complaint',
        priority: 'medium',
        status: 'pending',
        content:
          '検索機能の精度をもっと向上させてほしいです。キーワード検索では期待した結果が得られないことが多いです。',
        receivedAt: new Date('2025-01-06T16:30:00'),
        dueDate: new Date('2025-01-13T17:00:00'),
        attachments: [],
        createdAt: new Date('2025-01-06T16:30:00'),
        updatedAt: new Date('2025-01-06T16:30:00'),
      },
    ];

    mockInquiries.forEach((inquiry) => {
      this.inquiries.set(inquiry.id, inquiry);
      const idNum = parseInt(inquiry.id);
      if (idNum >= this.idCounter) {
        this.idCounter = idNum + 1;
      }
    });
  }

  getAll(): Inquiry[] {
    return Array.from(this.inquiries.values()).sort(
      (a, b) => b.receivedAt.getTime() - a.receivedAt.getTime()
    );
  }

  getById(id: string): Inquiry | undefined {
    return this.inquiries.get(id);
  }

  create(data: CreateInquiryInput): Inquiry {
    const id = String(this.idCounter++);
    const now = new Date();

    const inquiry: Inquiry = {
      id,
      subject: data.subject,
      name: data.name,
      email: data.email,
      phone: data.phone,
      category: data.category,
      priority: data.priority,
      status: 'pending',
      content: data.content,
      receivedAt: data.receivedAt || now,
      dueDate: data.dueDate,
      attachments: data.attachments || [],
      createdAt: now,
      updatedAt: now,
    };

    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  update(id: string, data: UpdateInquiryInput): Inquiry {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) {
      throw new Error(`Inquiry with id ${id} not found`);
    }

    const updated: Inquiry = {
      ...inquiry,
      ...data,
      id: inquiry.id,
      createdAt: inquiry.createdAt,
      updatedAt: new Date(),
    };

    // ステータスが完了になった場合、completedAtを設定
    if (data.status === 'completed' && !updated.completedAt) {
      updated.completedAt = new Date();
    }

    this.inquiries.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.inquiries.delete(id);
  }

  filterByStatus(status: InquiryStatus): Inquiry[] {
    return this.getAll().filter((inquiry) => inquiry.status === status);
  }

  search(query: string): Inquiry[] {
    if (!query.trim()) {
      return this.getAll();
    }

    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(
      (inquiry) =>
        inquiry.subject.toLowerCase().includes(lowerQuery) ||
        inquiry.name.toLowerCase().includes(lowerQuery) ||
        inquiry.email.toLowerCase().includes(lowerQuery) ||
        inquiry.content.toLowerCase().includes(lowerQuery) ||
        (inquiry.response &&
          inquiry.response.toLowerCase().includes(lowerQuery))
    );
  }
}

// シングルトンインスタンス
export const inquiryStore = new InquiryStore();
