'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Button,
  Input,
  Label,
  Select,
  StatusBadge,
  Divider,
} from '@/components/atoms/digital-go-jp';
import { getPhotos, searchPhotos } from './actions';
import type { PhotoContent, PhotoCategory } from '@/types/photo-content';

export default function PhotoContentListPage() {
  const [photos, setPhotos] = useState<PhotoContent[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<PhotoContent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PhotoCategory | 'all'>(
    'all'
  );
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 12;

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getPhotos();
        setPhotos(data);
        setFilteredPhotos(data);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // フィルター適用
  const applyFilters = () => {
    let results = [...photos];

    // 検索クエリ
    if (searchQuery.trim()) {
      results = results.filter(
        (photo) =>
          photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          photo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          photo.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // カテゴリフィルター
    if (categoryFilter !== 'all') {
      results = results.filter((photo) => photo.category === categoryFilter);
    }

    // 日付フィルター
    if (startDate) {
      const start = new Date(startDate);
      results = results.filter((photo) => new Date(photo.takenAt) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      results = results.filter((photo) => new Date(photo.takenAt) <= end);
    }

    setFilteredPhotos(results);
    setCurrentPage(1);
  };

  // カテゴリラベル
  const getCategoryLabel = (category: PhotoCategory) => {
    switch (category) {
      case 'event':
        return 'イベント';
      case 'facility':
        return '施設';
      case 'document':
        return '書類';
      case 'other':
        return 'その他';
    }
  };

  // ページネーション
  const totalPages = Math.ceil(filteredPhotos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPhotos = filteredPhotos.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sea-900">
            写真コンテンツ管理
          </h1>
          <p className="text-solid-gray-700 mt-1">写真の一覧と管理</p>
        </div>
        <Link href="/photo-content/new">
          <Button size="md" variant="solid-fill">
            新規登録
          </Button>
        </Link>
      </div>

      <Divider />

      {/* 検索セクション */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
        <h2 className="text-xl font-semibold text-sea-900 mb-4">検索</h2>
        <div className="space-y-4">
          {/* 1段目: カテゴリ + キーワード検索 + 検索ボタン */}
          <div>
            <Label className="mb-2 block">検索対象</Label>
            <div className="flex gap-3 items-end">
              <Select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as PhotoCategory | 'all')
                }
                className="w-40"
              >
                <option value="all">すべて</option>
                <option value="event">イベント</option>
                <option value="facility">施設</option>
                <option value="document">書類</option>
                <option value="other">その他</option>
              </Select>
              <Input
                id="search"
                type="text"
                placeholder="サイト内検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                blockSize="md"
                className="flex-1"
              />
              <Button size="md" variant="solid-fill" onClick={applyFilters}>
                検索
              </Button>
            </div>
          </div>

          {/* 2段目: 撮影日(開始) + 撮影日(終了) + クリアボタン */}
          <div>
            <Label className="mb-2 block">撮影日</Label>
            <div className="flex gap-3 items-end">
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                blockSize="md"
                className="w-40"
              />
              <span className="pb-3 text-solid-gray-600">〜</span>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                blockSize="md"
                className="w-40"
              />
              <Button
                size="md"
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setStartDate('');
                  setEndDate('');
                  setFilteredPhotos(photos);
                  setCurrentPage(1);
                }}
              >
                クリア
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* 写真一覧 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-sea-900">写真一覧</h2>
          <span className="text-sm text-solid-gray-600">
            {filteredPhotos.length}件
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-solid-gray-600">
            読み込み中...
          </div>
        ) : currentPhotos.length === 0 ? (
          <div className="text-center py-8 text-solid-gray-600">
            写真が見つかりませんでした
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPhotos.map((photo) => (
                <Link
                  key={photo.id}
                  href={`/photo-content/${photo.id}`}
                  className="group h-full"
                >
                  <div className="h-full flex flex-col border border-solid-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {/* 画像 */}
                    <div className="relative w-full h-48 bg-solid-gray-100 flex-shrink-0">
                      <Image
                        src={photo.imageUrl}
                        alt={photo.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    {/* 情報 */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sea-900 line-clamp-2 group-hover:text-sea-700">
                          {photo.title}
                        </h3>
                        <StatusBadge
                          className={
                            photo.isPublic
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-500 text-white'
                          }
                        >
                          {photo.isPublic ? '公開' : '非公開'}
                        </StatusBadge>
                      </div>
                      <p className="text-sm text-solid-gray-700 line-clamp-2 mt-2">
                        {photo.description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-solid-gray-600 mt-2">
                        <span className="px-2 py-1 bg-solid-gray-100 rounded">
                          {getCategoryLabel(photo.category)}
                        </span>
                        <span className="py-1">
                          {new Date(photo.takenAt).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-auto pt-2">
                        {photo.tags && photo.tags.length > 0 ? (
                          photo.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded"
                            >
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs py-1 invisible">
                            placeholder
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <Button
                  size="md"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  前へ
                </Button>
                <span className="flex items-center px-4">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  size="md"
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  次へ
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
