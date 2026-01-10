'use client';

import { useEffect, useState, useRef } from 'react';
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
  Divider,
} from '@/components/atoms/digital-go-jp';
import { Dialog, DialogBody } from '@/components/atoms/digital-go-jp/Dialog';
import { getPhoto, updatePhoto, deletePhoto } from '../actions';
import type { PhotoContent, PhotoCategory } from '@/types/photo-content';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PhotoDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [photo, setPhoto] = useState<PhotoContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'event' as PhotoCategory,
    description: '',
    takenAt: '',
    isPublic: true,
    tags: '',
  });

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getPhoto(id);
        if (data) {
          setPhoto(data);
          setFormData({
            title: data.title,
            category: data.category,
            description: data.description,
            takenAt: new Date(data.takenAt).toISOString().split('T')[0],
            isPublic: data.isPublic,
            tags: data.tags?.join(', ') || '',
          });
        } else {
          router.push('/inquiry/photo-content');
        }
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }
    if (!formData.description.trim()) {
      newErrors.description = '説明は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('category', formData.category);
      formDataObj.append('description', formData.description);
      formDataObj.append('takenAt', formData.takenAt);
      formDataObj.append('isPublic', String(formData.isPublic));
      formDataObj.append('tags', formData.tags);

      await updatePhoto(id, formDataObj);
      const updatedData = await getPhoto(id);
      if (updatedData) {
        setPhoto(updatedData);
      }
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error('保存に失敗しました:', error);
      setErrors({ submit: '保存に失敗しました' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePhoto(id);
      router.push('/inquiry/photo-content');
    } catch (error) {
      console.error('削除に失敗しました:', error);
      alert('削除に失敗しました');
    } finally {
      setIsDeleting(false);
      deleteDialogRef.current?.close();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-solid-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="text-center py-8">
        <p className="text-solid-gray-600">写真が見つかりませんでした</p>
        <Link href="/inquiry/photo-content">
          <Button size="md" className="mt-4">
            一覧に戻る
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sea-900">写真詳細</h1>
          <p className="text-solid-gray-700 mt-1">ID: {photo.id}</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button
                size="md"
                variant="solid-fill"
                onClick={() => setIsEditing(true)}
              >
                編集
              </Button>
              <Button
                size="md"
                variant="outline"
                onClick={() => router.push('/inquiry/photo-content')}
              >
                一覧に戻る
              </Button>
            </>
          ) : (
            <>
              <Button
                size="md"
                variant="solid-fill"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? '保存中...' : '保存'}
              </Button>
              <Button
                size="md"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                }}
              >
                キャンセル
              </Button>
              <Button
                size="md"
                variant="text"
                onClick={() => deleteDialogRef.current?.showModal()}
                className="text-red-600 hover:bg-red-50"
              >
                削除
              </Button>
            </>
          )}
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <ErrorText>{errors.submit}</ErrorText>
        </div>
      )}

      <Divider />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 画像プレビュー */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
          <h2 className="text-xl font-semibold text-sea-900 mb-4">画像</h2>
          <div className="relative w-full h-96 bg-solid-gray-100 rounded-lg overflow-hidden">
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* 情報 */}
        <div className="space-y-6">
          {!isEditing ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
              <h2 className="text-xl font-semibold text-sea-900 mb-4">
                基本情報
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-solid-gray-600">タイトル</p>
                  <p className="font-medium text-sea-900">{photo.title}</p>
                </div>
                <div>
                  <p className="text-sm text-solid-gray-600">カテゴリ</p>
                  <p className="font-medium text-sea-900">{photo.category}</p>
                </div>
                <div>
                  <p className="text-sm text-solid-gray-600">説明</p>
                  <p className="text-sea-900 whitespace-pre-wrap">
                    {photo.description}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-solid-gray-600">撮影日</p>
                  <p className="font-medium text-sea-900">
                    {new Date(photo.takenAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-solid-gray-600">公開設定</p>
                  <p className="font-medium text-sea-900">
                    {photo.isPublic ? '公開' : '非公開'}
                  </p>
                </div>
                {photo.tags && photo.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-solid-gray-600 mb-2">タグ</p>
                    <div className="flex flex-wrap gap-1">
                      {photo.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
              <h2 className="text-xl font-semibold text-sea-900 mb-4">
                基本情報
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">
                    タイトル{' '}
                    <RequirementBadge isOptional={false}>必須</RequirementBadge>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    blockSize="md"
                  />
                  {errors.title && <ErrorText>{errors.title}</ErrorText>}
                </div>

                <div>
                  <Label htmlFor="category">カテゴリ</Label>
                  <Select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as PhotoCategory,
                      })
                    }
                  >
                    <option value="event">イベント</option>
                    <option value="facility">施設</option>
                    <option value="document">書類</option>
                    <option value="other">その他</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">
                    説明{' '}
                    <RequirementBadge isOptional={false}>必須</RequirementBadge>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                  />
                  {errors.description && (
                    <ErrorText>{errors.description}</ErrorText>
                  )}
                </div>

                <div>
                  <Label htmlFor="takenAt">撮影日</Label>
                  <Input
                    id="takenAt"
                    type="date"
                    value={formData.takenAt}
                    onChange={(e) =>
                      setFormData({ ...formData, takenAt: e.target.value })
                    }
                    blockSize="md"
                  />
                </div>

                <div>
                  <Checkbox
                    checked={formData.isPublic}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublic: e.target.checked })
                    }
                  >
                    公開する
                  </Checkbox>
                </div>

                <div>
                  <Label htmlFor="tags">
                    タグ{' '}
                    <RequirementBadge isOptional={true}>任意</RequirementBadge>
                  </Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="タグをカンマ区切りで入力"
                    blockSize="md"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog ref={deleteDialogRef}>
        <DialogBody>
          <h2 className="text-xl font-semibold text-sea-900 mb-4">
            写真を削除しますか？
          </h2>
          <p className="text-solid-gray-700 mb-6">
            この操作は取り消せません。本当に削除してもよろしいですか？
          </p>
          <div className="flex justify-end gap-2 w-full">
            <Button
              size="md"
              variant="outline"
              onClick={() => deleteDialogRef.current?.close()}
            >
              キャンセル
            </Button>
            <Button
              size="md"
              variant="solid-fill"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? '削除中...' : '削除する'}
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
}
