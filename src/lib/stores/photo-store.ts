import type {
  PhotoContent,
  PhotoCategory,
  CreatePhotoContentInput,
  UpdatePhotoContentInput,
} from '@/types/photo-content';

class PhotoStore {
  private photos: Map<string, PhotoContent> = new Map();
  private idCounter = 1;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // プレースホルダー画像のBase64データ（小さな透明PNG）
    const placeholderBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const mockPhotos: PhotoContent[] = [
      {
        id: '1',
        title: '市役所正面玄関の様子',
        imageUrl: placeholderBase64,
        category: 'facility',
        description:
          '改装後の市役所正面玄関です。バリアフリー対応が完了しました。',
        takenAt: new Date('2025-01-02T10:00:00'),
        isPublic: true,
        tags: ['市役所', 'バリアフリー', '施設'],
        createdAt: new Date('2025-01-02T14:00:00'),
        updatedAt: new Date('2025-01-02T14:00:00'),
      },
      {
        id: '2',
        title: '新年交流イベント',
        imageUrl: placeholderBase64,
        category: 'event',
        description:
          '地域住民との新年交流イベントの様子。100名以上の参加者がありました。',
        takenAt: new Date('2025-01-03T14:30:00'),
        isPublic: true,
        tags: ['イベント', '交流', '地域'],
        createdAt: new Date('2025-01-03T16:00:00'),
        updatedAt: new Date('2025-01-03T16:00:00'),
      },
      {
        id: '3',
        title: '申請書類サンプル',
        imageUrl: placeholderBase64,
        category: 'document',
        description:
          '住民票申請書の記入例です。参考資料として使用してください。',
        takenAt: new Date('2025-01-04T09:00:00'),
        isPublic: false,
        tags: ['申請書', '記入例', '住民票'],
        createdAt: new Date('2025-01-04T11:00:00'),
        updatedAt: new Date('2025-01-04T11:00:00'),
      },
      {
        id: '4',
        title: '図書館新コーナー',
        imageUrl: placeholderBase64,
        category: 'facility',
        description:
          '図書館に新設された子ども向けコーナーです。カラフルな本棚が特徴です。',
        takenAt: new Date('2025-01-05T15:20:00'),
        isPublic: true,
        tags: ['図書館', '子ども', '施設'],
        createdAt: new Date('2025-01-05T17:00:00'),
        updatedAt: new Date('2025-01-05T17:00:00'),
      },
      {
        id: '5',
        title: '防災訓練の様子',
        imageUrl: placeholderBase64,
        category: 'event',
        description:
          '地域合同防災訓練の実施風景。消火器の使い方を学んでいます。',
        takenAt: new Date('2025-01-06T10:00:00'),
        isPublic: true,
        tags: ['防災', '訓練', 'イベント'],
        createdAt: new Date('2025-01-06T12:00:00'),
        updatedAt: new Date('2025-01-06T12:00:00'),
      },
      {
        id: '6',
        title: '窓口対応マニュアル',
        imageUrl: placeholderBase64,
        category: 'document',
        description: '職員用の窓口対応マニュアルの一部です。',
        takenAt: new Date('2025-01-07T13:00:00'),
        isPublic: false,
        tags: ['マニュアル', '窓口', '職員'],
        createdAt: new Date('2025-01-07T14:00:00'),
        updatedAt: new Date('2025-01-07T14:00:00'),
      },
    ];

    mockPhotos.forEach((photo) => {
      this.photos.set(photo.id, photo);
      const idNum = parseInt(photo.id);
      if (idNum >= this.idCounter) {
        this.idCounter = idNum + 1;
      }
    });
  }

  getAll(): PhotoContent[] {
    return Array.from(this.photos.values()).sort(
      (a, b) => b.takenAt.getTime() - a.takenAt.getTime()
    );
  }

  getById(id: string): PhotoContent | undefined {
    return this.photos.get(id);
  }

  create(data: CreatePhotoContentInput): PhotoContent {
    const id = String(this.idCounter++);
    const now = new Date();

    const photo: PhotoContent = {
      id,
      title: data.title,
      imageUrl: data.imageUrl,
      category: data.category,
      description: data.description,
      takenAt: data.takenAt || now,
      isPublic: data.isPublic ?? true,
      tags: data.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    this.photos.set(id, photo);
    return photo;
  }

  update(id: string, data: UpdatePhotoContentInput): PhotoContent {
    const photo = this.photos.get(id);
    if (!photo) {
      throw new Error(`PhotoContent with id ${id} not found`);
    }

    const updated: PhotoContent = {
      ...photo,
      ...data,
      id: photo.id,
      createdAt: photo.createdAt,
      updatedAt: new Date(),
    };

    this.photos.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.photos.delete(id);
  }

  filterByCategory(category: PhotoCategory): PhotoContent[] {
    return this.getAll().filter((photo) => photo.category === category);
  }

  search(query: string): PhotoContent[] {
    if (!query.trim()) {
      return this.getAll();
    }

    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(
      (photo) =>
        photo.title.toLowerCase().includes(lowerQuery) ||
        photo.description.toLowerCase().includes(lowerQuery) ||
        photo.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

// シングルトンインスタンス
export const photoStore = new PhotoStore();
