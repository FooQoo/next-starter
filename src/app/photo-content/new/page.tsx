'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Button,
  Input,
  Textarea,
  Label,
  RequirementBadge,
  Select,
  Checkbox,
  ErrorText,
  SupportText,
  Divider,
} from '@/components/atoms/digital-go-jp';
import { createPhoto } from '../actions';
import type { PhotoCategory } from '@/types/photo-content';

export default function NewPhotoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    category: 'event' as PhotoCategory,
    description: '',
    takenAt: new Date().toISOString().split('T')[0],
    isPublic: true,
    tags: '',
  });

  // 画像アップロード処理（Base64変換）
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: '画像サイズは5MB以下にしてください' });
      return;
    }

    // 画像ファイルチェック
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, image: '画像ファイルを選択してください' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, imageUrl: base64String });
      setImagePreview(base64String);
      setErrors({ ...errors, image: '' });
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }
    if (!formData.imageUrl) {
      newErrors.image = '画像は必須です';
    }
    if (!formData.description.trim()) {
      newErrors.description = '説明は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('imageUrl', formData.imageUrl);
      formDataObj.append('category', formData.category);
      formDataObj.append('description', formData.description);
      formDataObj.append('takenAt', formData.takenAt);
      formDataObj.append('isPublic', String(formData.isPublic));
      formDataObj.append('tags', formData.tags);

      const photo = await createPhoto(formDataObj);
      router.push(`/photo-content/${photo.id}`);
    } catch (error) {
      console.error('登録に失敗しました:', error);
      setErrors({ submit: '登録に失敗しました。もう一度お試しください。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sea-900">新規写真登録</h1>
          <p className="text-solid-gray-700 mt-1">
            写真と情報を入力してください
          </p>
        </div>
        <Link href="/photo-content">
          <Button size="md" variant="outline">
            一覧に戻る
          </Button>
        </Link>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <ErrorText>{errors.submit}</ErrorText>
        </div>
      )}

      <Divider />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 画像アップロード */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
          <h2 className="text-xl font-semibold text-sea-900 mb-6">
            画像アップロード
          </h2>
          <div className="space-y-6">
            <div>
              <Label htmlFor="image" className="block mb-2">
                画像ファイル{' '}
                <RequirementBadge isOptional={false}>必須</RequirementBadge>
              </Label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-solid-gray-700
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-sea-50 file:text-sea-700
                  hover:file:bg-sea-100
                  cursor-pointer"
              />
              <SupportText>
                JPG、PNG、GIF形式の画像をアップロードできます（最大5MB）
              </SupportText>
              {errors.image && <ErrorText>{errors.image}</ErrorText>}
            </div>

            {imagePreview && (
              <div className="mt-4">
                <Label className="block mb-2">プレビュー</Label>
                <div className="relative w-full h-64 bg-solid-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="プレビュー"
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <Divider />

        {/* 基本情報 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
          <h2 className="text-xl font-semibold text-sea-900 mb-6">基本情報</h2>
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="block mb-2">
                タイトル{' '}
                <RequirementBadge isOptional={false}>必須</RequirementBadge>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="写真のタイトルを入力してください"
                blockSize="md"
                className="w-full"
              />
              <SupportText className="mt-1">
                写真の内容が分かりやすいタイトルを入力してください
              </SupportText>
              {errors.title && (
                <ErrorText className="mt-1">{errors.title}</ErrorText>
              )}
            </div>

            <div>
              <Label htmlFor="category" className="block mb-2">
                カテゴリ{' '}
                <RequirementBadge isOptional={false}>必須</RequirementBadge>
              </Label>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as PhotoCategory,
                  })
                }
                className="w-full"
              >
                <option value="event">イベント</option>
                <option value="facility">施設</option>
                <option value="document">書類</option>
                <option value="other">その他</option>
              </Select>
              <SupportText className="mt-1">
                写真の種類を選択してください
              </SupportText>
            </div>

            <div>
              <Label htmlFor="description" className="block mb-2">
                説明{' '}
                <RequirementBadge isOptional={false}>必須</RequirementBadge>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="写真の詳細な説明を入力してください"
                rows={6}
                className="w-full"
              />
              <SupportText className="mt-1">
                写真の内容、撮影場所、背景情報などを詳しく記載してください
              </SupportText>
              {errors.description && (
                <ErrorText className="mt-1">{errors.description}</ErrorText>
              )}
            </div>

            <div>
              <Label htmlFor="takenAt" className="block mb-2">
                撮影日{' '}
                <RequirementBadge isOptional={false}>必須</RequirementBadge>
              </Label>
              <Input
                id="takenAt"
                type="date"
                value={formData.takenAt}
                onChange={(e) =>
                  setFormData({ ...formData, takenAt: e.target.value })
                }
                blockSize="md"
                className="w-full"
              />
              <SupportText className="mt-1">
                写真を撮影した日付を選択してください
              </SupportText>
            </div>

            <div>
              <Label htmlFor="tags" className="block mb-2">
                タグ <RequirementBadge isOptional={true}>任意</RequirementBadge>
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="例: 市役所, イベント, 2025年"
                blockSize="md"
                className="w-full"
              />
              <SupportText className="mt-1">
                タグをカンマ区切りで入力してください。検索時に便利です。
              </SupportText>
            </div>

            <div>
              <Checkbox
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData({ ...formData, isPublic: e.target.checked })
                }
              >
                この写真を公開する
              </Checkbox>
              <SupportText className="ml-6">
                公開設定にすると、一般ユーザーも閲覧できるようになります
              </SupportText>
            </div>
          </div>
        </div>

        <Divider />

        <div className="flex justify-end gap-4">
          <Link href="/photo-content">
            <Button size="md" variant="outline" type="button">
              キャンセル
            </Button>
          </Link>
          <Button
            size="md"
            variant="solid-fill"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? '登録中...' : '登録する'}
          </Button>
        </div>
      </form>
    </div>
  );
}
