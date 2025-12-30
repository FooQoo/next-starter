'use server';

import { revalidatePath } from 'next/cache';
import { photoStore } from '@/lib/stores/photo-store';
import type {
  PhotoContent,
  PhotoCategory,
  CreatePhotoContentInput,
  UpdatePhotoContentInput,
} from '@/types/photo-content';

export async function getPhotos(): Promise<PhotoContent[]> {
  return photoStore.getAll();
}

export async function getPhoto(id: string): Promise<PhotoContent | undefined> {
  return photoStore.getById(id);
}

export async function searchPhotos(query: string): Promise<PhotoContent[]> {
  return photoStore.search(query);
}

export async function filterPhotosByCategory(
  category: PhotoCategory
): Promise<PhotoContent[]> {
  return photoStore.filterByCategory(category);
}

export async function createPhoto(formData: FormData): Promise<PhotoContent> {
  const data: CreatePhotoContentInput = {
    title: formData.get('title') as string,
    imageUrl: formData.get('imageUrl') as string,
    category: formData.get('category') as PhotoCategory,
    description: formData.get('description') as string,
    takenAt: formData.get('takenAt')
      ? new Date(formData.get('takenAt') as string)
      : undefined,
    isPublic: formData.get('isPublic') === 'true',
    tags: formData.has('tags')
      ? (formData.get('tags') as string).split(',').map((t) => t.trim())
      : undefined,
  };

  // バリデーション
  if (!data.title || data.title.trim() === '') {
    throw new Error('タイトルは必須です');
  }
  if (!data.imageUrl || data.imageUrl.trim() === '') {
    throw new Error('画像は必須です');
  }
  if (!data.description || data.description.trim() === '') {
    throw new Error('説明は必須です');
  }

  const photo = photoStore.create(data);
  revalidatePath('/inquiry/photo-content');
  return photo;
}

export async function updatePhoto(
  id: string,
  formData: FormData
): Promise<PhotoContent> {
  const data: UpdatePhotoContentInput = {};

  if (formData.has('title')) data.title = formData.get('title') as string;
  if (formData.has('imageUrl'))
    data.imageUrl = formData.get('imageUrl') as string;
  if (formData.has('category'))
    data.category = formData.get('category') as PhotoCategory;
  if (formData.has('description'))
    data.description = formData.get('description') as string;
  if (formData.has('takenAt'))
    data.takenAt = new Date(formData.get('takenAt') as string);
  if (formData.has('isPublic'))
    data.isPublic = formData.get('isPublic') === 'true';
  if (formData.has('tags'))
    data.tags = (formData.get('tags') as string)
      .split(',')
      .map((t) => t.trim());

  const photo = photoStore.update(id, data);
  revalidatePath('/inquiry/photo-content');
  revalidatePath(`/inquiry/photo-content/${id}`);
  return photo;
}

export async function deletePhoto(id: string): Promise<boolean> {
  const result = photoStore.delete(id);
  revalidatePath('/inquiry/photo-content');
  return result;
}
