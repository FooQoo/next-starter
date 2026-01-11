'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import StatCard from './StatCard';
import BarChart from './BarChart';
import TrendChart from './TrendChart';
import type { InquiryStatistics } from '@/features/inquiry';
import { getInquiryStatistics } from '@/features/inquiry';

export default function StatisticsDashboard() {
  const [statistics, setStatistics] = useState<InquiryStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stats = await getInquiryStatistics();
      setStatistics(stats);
    } catch (err) {
      setError('統計情報の読み込みに失敗しました');
      console.error('Failed to fetch statistics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-solid-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-red-600">{error || 'データが見つかりません'}</div>
        <Button onClick={fetchStatistics} variant="outline" size="md">
          再読み込み
        </Button>
      </div>
    );
  }

  const { statusCount, priorityCount, categoryCount, timeSeriesData } =
    statistics;

  // Prepare data for category bar chart
  const categoryChartData = [
    {
      label: '一般',
      value: categoryCount.general,
      color: 'bg-blue-500',
    },
    {
      label: '技術',
      value: categoryCount.technical,
      color: 'bg-purple-500',
    },
    {
      label: '請求',
      value: categoryCount.billing,
      color: 'bg-green-500',
    },
    {
      label: 'クレーム',
      value: categoryCount.complaint,
      color: 'bg-red-500',
    },
    {
      label: 'その他',
      value: categoryCount.other,
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sea-900 mb-2">
            統計ダッシュボード
          </h1>
          <p className="text-solid-gray-600">
            問い合わせの統計情報を確認できます
          </p>
        </div>
        <Link href="/inquiry">
          <Button variant="solid-fill" size="md">
            問い合わせ一覧へ
          </Button>
        </Link>
      </div>

      {/* Status Metrics */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-sea-900 mb-4">
          ステータス別
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="未対応"
            value={statusCount.pending}
            subtitle={`全体の${Math.round((statusCount.pending / statusCount.total) * 100)}%`}
            colorClass="text-yellow-600"
          />
          <StatCard
            title="対応中"
            value={statusCount['in-progress']}
            subtitle={`全体の${Math.round((statusCount['in-progress'] / statusCount.total) * 100)}%`}
            colorClass="text-blue-600"
          />
          <StatCard
            title="完了"
            value={statusCount.completed}
            subtitle={`全体の${Math.round((statusCount.completed / statusCount.total) * 100)}%`}
            colorClass="text-green-600"
          />
        </div>
      </section>

      {/* Priority Metrics */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-sea-900 mb-4">優先度別</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="高"
            value={priorityCount.high}
            subtitle={`全体の${Math.round((priorityCount.high / priorityCount.total) * 100)}%`}
            colorClass="text-red-600"
          />
          <StatCard
            title="中"
            value={priorityCount.medium}
            subtitle={`全体の${Math.round((priorityCount.medium / priorityCount.total) * 100)}%`}
            colorClass="text-blue-600"
          />
          <StatCard
            title="低"
            value={priorityCount.low}
            subtitle={`全体の${Math.round((priorityCount.low / priorityCount.total) * 100)}%`}
            colorClass="text-gray-600"
          />
        </div>
      </section>

      {/* Category Distribution */}
      <section className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-solid-gray-200 p-6">
          <h2 className="text-xl font-semibold text-sea-900 mb-6">
            カテゴリー別分布
          </h2>
          <BarChart data={categoryChartData} height={300} />
        </div>
      </section>

      {/* Time Series Trend */}
      <section>
        <div className="bg-white rounded-lg shadow-sm border border-solid-gray-200 p-6">
          <h2 className="text-xl font-semibold text-sea-900 mb-6">
            問い合わせ推移
          </h2>
          <TrendChart data={timeSeriesData} height={250} />
        </div>
      </section>
    </div>
  );
}
