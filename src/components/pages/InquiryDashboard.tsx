'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Input,
  Label,
  Select,
  StatusBadge,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionContent,
  SupportText,
  Ul,
} from '@/components/atoms/digital-go-jp';
import {
  Pagination,
  PaginationFirst,
  PaginationPrev,
  PaginationNext,
  PaginationLast,
  PaginationItem,
  PaginationCurrent,
} from '@/components/atoms/digital-go-jp/Pagination';
import {
  getInquiries,
  searchInquiries,
  filterInquiriesByStatus,
} from '@/app/actions';
import type { Inquiry, InquiryStatus } from '@/types/inquiry';

export default function InquiryDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>(
    'all'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getInquiries();
        setInquiries(data);
        setFilteredInquiries(data);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 検索処理
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      let results: Inquiry[];
      if (searchQuery.trim()) {
        results = await searchInquiries(searchQuery);
      } else {
        results = await getInquiries();
      }

      // ステータスフィルター適用
      if (statusFilter !== 'all') {
        results = results.filter((inquiry) => inquiry.status === statusFilter);
      }

      setFilteredInquiries(results);
      setCurrentPage(1);
    } catch (error) {
      console.error('検索に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ステータスフィルター変更
  const handleStatusFilterChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value as InquiryStatus | 'all';
    setStatusFilter(newStatus);
    setIsLoading(true);
    try {
      let results: Inquiry[];
      if (searchQuery.trim()) {
        results = await searchInquiries(searchQuery);
      } else {
        results = await getInquiries();
      }

      if (newStatus !== 'all') {
        results = results.filter((inquiry) => inquiry.status === newStatus);
      }

      setFilteredInquiries(results);
      setCurrentPage(1);
    } catch (error) {
      console.error('フィルタリングに失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ステータスバッジの色
  const getStatusColor = (status: InquiryStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
    }
  };

  // ステータスラベル
  const getStatusLabel = (status: InquiryStatus) => {
    switch (status) {
      case 'pending':
        return '未対応';
      case 'in-progress':
        return '対応中';
      case 'completed':
        return '完了';
    }
  };

  // 優先度ラベル
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return priority;
    }
  };

  // ページネーション
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInquiries = filteredInquiries.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sea-900">問い合わせ一覧</h1>
          <p className="text-solid-gray-700 mt-1">
            問い合わせの検索・フィルター・管理
          </p>
        </div>
        <Link href="/inquiry/new">
          <Button size="md" variant="solid-fill">
            新規作成
          </Button>
        </Link>
      </div>

      <Divider />

      {/* 検索セクション */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-solid-gray-200">
        <h2 className="text-xl font-semibold text-sea-900 mb-6">検索</h2>
        <div className="space-y-6">
          <SupportText className="mb-4">
            検索結果は検索フォームの下に表示されます。
          </SupportText>

          {/* 検索対象 */}
          <div>
            <Label className="mb-3 block">検索対象</Label>
            <div className="flex gap-3">
              <Select
                id="status-filter"
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="w-40"
              >
                <option value="all">すべて</option>
                <option value="pending">未対応</option>
                <option value="in-progress">対応中</option>
                <option value="completed">完了</option>
              </Select>
              <Input
                id="search"
                type="text"
                placeholder="サイト内検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                blockSize="md"
                className="flex-1"
              />
              <Button size="md" variant="solid-fill" onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
                検索
              </Button>
            </div>
          </div>

          {/* 表示件数 */}
          <div>
            <Label className="mb-3 block">表示件数</Label>
            <Select className="w-40">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Select>
          </div>
        </div>
      </div>

      <Divider />

      {/* 問い合わせ一覧 */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-solid-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-sea-900">問い合わせ一覧</h2>
          <span className="text-sm text-solid-gray-600">
            {filteredInquiries.length}件
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-solid-gray-600">
            読み込み中...
          </div>
        ) : currentInquiries.length === 0 ? (
          <div className="text-center py-8 text-solid-gray-600">
            問い合わせが見つかりませんでした
          </div>
        ) : (
          <div className="space-y-6">
            <Ul unstyled className="space-y-4">
              {currentInquiries.map((inquiry) => (
                <li
                  key={inquiry.id}
                  className="border border-solid-gray-200 rounded-lg p-5 hover:bg-solid-gray-50 transition-colors"
                >
                  <Link href={`/inquiry/${inquiry.id}`}>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sea-900 text-lg">
                            {inquiry.subject}
                          </h3>
                          <p className="text-sm text-solid-gray-600 mt-1">
                            {inquiry.name} ({inquiry.email})
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge
                            className={getStatusColor(inquiry.status)}
                          >
                            {getStatusLabel(inquiry.status)}
                          </StatusBadge>
                          <span className="text-xs px-2 py-1 bg-solid-gray-100 text-solid-gray-700 rounded">
                            優先度: {getPriorityLabel(inquiry.priority)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-solid-gray-700 line-clamp-2">
                        {inquiry.content}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-solid-gray-600">
                        <span>
                          受付:{' '}
                          {new Date(inquiry.receivedAt).toLocaleDateString(
                            'ja-JP'
                          )}
                        </span>
                        {inquiry.dueDate && (
                          <span>
                            期限:{' '}
                            {new Date(inquiry.dueDate).toLocaleDateString(
                              'ja-JP'
                            )}
                          </span>
                        )}
                        <span>カテゴリ: {inquiry.category}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </Ul>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination aria-label="ページナビゲーション">
                  <PaginationFirst
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(1);
                    }}
                    aria-disabled={currentPage === 1}
                  />
                  <PaginationPrev
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    aria-disabled={currentPage === 1}
                  />
                  <PaginationCurrent current={currentPage} max={totalPages} />
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    aria-disabled={currentPage === totalPages}
                  />
                  <PaginationLast
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(totalPages);
                    }}
                    aria-disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            )}
          </div>
        )}
      </div>

      <Divider />

      {/* FAQセクション */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-solid-gray-200">
        <h2 className="text-xl font-semibold text-sea-900 mb-6">
          よくある質問
        </h2>
        <div className="space-y-3">
          <Accordion>
            <AccordionSummary>
              問い合わせのステータスを変更するには？
            </AccordionSummary>
            <AccordionContent>
              問い合わせの詳細ページを開き、ステータス選択欄から変更したいステータスを選択してください。保存ボタンを押すと変更が反映されます。
            </AccordionContent>
          </Accordion>

          <Accordion>
            <AccordionSummary>検索結果が表示されない場合は？</AccordionSummary>
            <AccordionContent>
              検索キーワードを変更するか、ステータスフィルターを「すべて」に設定してみてください。それでも見つからない場合は、問い合わせが削除されている可能性があります。
            </AccordionContent>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              問い合わせを削除することはできますか？
            </AccordionSummary>
            <AccordionContent>
              問い合わせの詳細ページから削除できます。削除した問い合わせは復元できませんので、ご注意ください。
            </AccordionContent>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              一度に表示される問い合わせの件数は？
            </AccordionSummary>
            <AccordionContent>
              1ページあたり10件の問い合わせが表示されます。ページネーションを使って次のページに移動できます。
            </AccordionContent>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
