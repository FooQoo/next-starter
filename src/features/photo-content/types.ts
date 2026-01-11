export type PhotoCategory = 'event' | 'facility' | 'document' | 'other';

export interface PhotoContent {
  id: string;
  title: string;
  imageUrl: string; // Base64エンコードされた画像データ（data:image/png;base64,... 形式）
  category: PhotoCategory;
  description: string;
  takenAt: Date;
  isPublic: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePhotoContentInput {
  title: string;
  imageUrl: string;
  category: PhotoCategory;
  description: string;
  takenAt?: Date;
  isPublic?: boolean;
  tags?: string[];
}

export interface UpdatePhotoContentInput {
  title?: string;
  imageUrl?: string;
  category?: PhotoCategory;
  description?: string;
  takenAt?: Date;
  isPublic?: boolean;
  tags?: string[];
}
