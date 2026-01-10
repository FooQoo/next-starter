import Link from 'next/link';
import { Button } from '@/components/atoms/digital-go-jp';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-8">
      {/* ヘッダー */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-sea-900">
          問い合わせ管理システム
        </h1>
        <p className="text-lg md:text-xl text-solid-gray-800">
          行政の問い合わせを効率的に管理する統合プラットフォーム
        </p>
      </div>

      {/* 説明 */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-solid-gray-200">
        <h2 className="text-2xl font-semibold text-sea-900 mb-4">
          システムの特徴
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="space-y-2">
            <h3 className="font-semibold text-sea-800 text-lg">
              問い合わせ管理
            </h3>
            <p className="text-solid-gray-700">
              市民からの問い合わせを一元管理。ステータス管理、優先度設定、期限管理に対応しています。
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sea-800 text-lg">
              写真コンテンツ管理
            </h3>
            <p className="text-solid-gray-700">
              問い合わせに関連する写真を登録・管理。カテゴリ分類、日時記録、公開設定が可能です。
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sea-800 text-lg">
              高度な検索・フィルター
            </h3>
            <p className="text-solid-gray-700">
              キーワード検索、ステータスフィルター、カテゴリフィルターで目的の情報を素早く見つけられます。
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sea-800 text-lg">
              アクセシビリティ対応
            </h3>
            <p className="text-solid-gray-700">
              デジタル庁デザインシステムを採用し、すべての市民が利用しやすいインターフェースを実現しています。
            </p>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/inquiry">
          <Button size="lg" variant="solid-fill" className="min-w-[200px]">
            問い合わせ管理を開く
          </Button>
        </Link>
        <Link href="/inquiry/help">
          <Button size="lg" variant="outline" className="min-w-[200px]">
            使い方を見る
          </Button>
        </Link>
      </div>

      {/* フッター */}
      <div className="text-sm text-solid-gray-600 pt-8">
        <p>
          このシステムはデジタル庁のデザインシステムコンポーネントを使用して構築されています。
        </p>
      </div>
    </div>
  );
}
