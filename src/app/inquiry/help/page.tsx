'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionSummary,
  AccordionContent,
  Disclosure,
  DisclosureSummary,
  Blockquote,
  Divider,
  Ol,
  Ul,
} from '@/components/atoms/digital-go-jp';

export default function HelpPage() {
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-3xl font-bold text-sea-900">
          ヘルプ・よくある質問
        </h1>
        <p className="text-solid-gray-700 mt-1">
          問い合わせ管理システムの使い方とFAQ
        </p>
      </div>

      <Divider />

      {/* クイックスタートガイド */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
        <h2 className="text-2xl font-semibold text-sea-900 mb-4">
          クイックスタートガイド
        </h2>
        <div className="space-y-4">
          <Blockquote>
            このガイドでは、問い合わせ管理システムの基本的な使い方を説明します。
            初めてご利用の方は、以下の手順に従って操作してください。
          </Blockquote>

          <div className="mt-4">
            <h3 className="font-semibold text-lg text-sea-800 mb-2">
              1. 新しい問い合わせを作成する
            </h3>
            <Ol className="ml-6 space-y-2">
              <li>ダッシュボードの「新規作成」ボタンをクリック</li>
              <li>件名、氏名、メールアドレスなどの必須項目を入力</li>
              <li>問い合わせ内容を詳しく記入</li>
              <li>優先度とカテゴリを選択</li>
              <li>「作成する」ボタンをクリックして保存</li>
            </Ol>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-lg text-sea-800 mb-2">
              2. 問い合わせを検索・フィルターする
            </h3>
            <Ol className="ml-6 space-y-2">
              <li>ダッシュボードの検索ボックスにキーワードを入力</li>
              <li>ステータスフィルターで状態を絞り込み</li>
              <li>「検索」ボタンをクリック</li>
              <li>該当する問い合わせが一覧表示されます</li>
            </Ol>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-lg text-sea-800 mb-2">
              3. 問い合わせに対応する
            </h3>
            <Ol className="ml-6 space-y-2">
              <li>ダッシュボードから対応する問い合わせをクリック</li>
              <li>詳細ページで「編集」ボタンをクリック</li>
              <li>返信内容を入力し、ステータスを更新</li>
              <li>必要に応じて対応期限を設定</li>
              <li>「保存」ボタンをクリックして完了</li>
            </Ol>
          </div>
        </div>
      </div>

      <Divider />

      {/* よくある質問 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
        <h2 className="text-2xl font-semibold text-sea-900 mb-4">
          よくある質問（FAQ）
        </h2>

        <div className="space-y-2">
          {/* 基本操作に関するFAQ */}
          <Accordion>
            <AccordionSummary>
              問い合わせの優先度はどのように設定すべきですか？
            </AccordionSummary>
            <AccordionContent>
              <div className="space-y-2">
                <p>優先度は以下の基準で設定することをお勧めします：</p>
                <Ul className="ml-6">
                  <li>
                    <strong>高:</strong>{' '}
                    緊急対応が必要な問い合わせ（システム障害、重大なクレームなど）
                  </li>
                  <li>
                    <strong>中:</strong>{' '}
                    通常の問い合わせ（一般的な質問、軽微な問題など）
                  </li>
                  <li>
                    <strong>低:</strong>{' '}
                    時間的余裕がある問い合わせ（機能要望、一般的な情報提供など）
                  </li>
                </Ul>
              </div>
            </AccordionContent>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              問い合わせを削除することはできますか？
            </AccordionSummary>
            <AccordionContent>
              <div className="space-y-2">
                <p>
                  はい、問い合わせの詳細ページから削除できます。
                  ただし、削除した問い合わせは復元できませんので、慎重に操作してください。
                </p>
                <Blockquote className="mt-2">
                  <strong>重要：</strong>{' '}
                  削除する前に、必要な情報をバックアップしておくことをお勧めします。
                </Blockquote>
              </div>
            </AccordionContent>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              一度に表示される問い合わせの件数は変更できますか？
            </AccordionSummary>
            <AccordionContent>
              <p>
                デフォルトでは1ページあたり10件の問い合わせが表示されます。
                表示件数を変更したい場合は、
                <Link
                  href="/inquiry/settings"
                  className="text-blue-600 underline"
                >
                  設定ページ
                </Link>
                から変更できます。
              </p>
            </AccordionContent>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              検索結果が表示されない場合はどうすればよいですか？
            </AccordionSummary>
            <AccordionContent>
              <div className="space-y-2">
                <p>以下の点を確認してください：</p>
                <Ol className="ml-6">
                  <li>検索キーワードが正しいか確認</li>
                  <li>ステータスフィルターを「すべて」に設定</li>
                  <li>カテゴリフィルターをクリア</li>
                  <li>
                    それでも見つからない場合は、問い合わせが削除されている可能性があります
                  </li>
                </Ol>
              </div>
            </AccordionContent>
          </Accordion>

          {/* 写真コンテンツに関するFAQ */}
          <Accordion>
            <AccordionSummary>
              写真をアップロードする際のファイルサイズ制限はありますか？
            </AccordionSummary>
            <AccordionContent>
              <p>
                写真のファイルサイズは5MB以下に制限されています。
                それより大きなファイルをアップロードする場合は、画像を圧縮してから再度お試しください。
              </p>
            </AccordionContent>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              写真の公開設定はどのように使い分けますか？
            </AccordionSummary>
            <AccordionContent>
              <div className="space-y-2">
                <Ul className="ml-6">
                  <li>
                    <strong>公開:</strong>{' '}
                    一般ユーザーも閲覧可能になります。広く共有したい写真に使用
                  </li>
                  <li>
                    <strong>非公開:</strong>{' '}
                    管理者のみが閲覧可能。内部資料や個人情報を含む写真に使用
                  </li>
                </Ul>
              </div>
            </AccordionContent>
          </Accordion>

          <Accordion>
            <AccordionSummary>タグの使い方を教えてください</AccordionSummary>
            <AccordionContent>
              <p>
                タグは写真を分類・検索するために使用します。
                カンマ区切りで複数のタグを設定できます。 例: 「市役所, イベント,
                2025年」
              </p>
            </AccordionContent>
          </Accordion>

          {/* トラブルシューティング */}
          <Accordion>
            <AccordionSummary>
              エラーが発生した場合はどうすればよいですか？
            </AccordionSummary>
            <AccordionContent>
              <div className="space-y-2">
                <p>エラーが発生した場合は、以下の手順をお試しください：</p>
                <Ol className="ml-6">
                  <li>ページを再読み込みする</li>
                  <li>ブラウザのキャッシュをクリアする</li>
                  <li>別のブラウザで試してみる</li>
                  <li>
                    それでも解決しない場合は、システム管理者にお問い合わせください
                  </li>
                </Ol>
              </div>
            </AccordionContent>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              パスワードを忘れた場合はどうすればよいですか？
            </AccordionSummary>
            <AccordionContent>
              <p>
                ログイン画面の「パスワードを忘れた方」リンクから、パスワードリセットの手続きを行ってください。
                登録されているメールアドレスに、リセット用のリンクが送信されます。
              </p>
            </AccordionContent>
          </Accordion>
        </div>
      </div>

      <Divider />

      {/* 追加情報 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
        <h2 className="text-2xl font-semibold text-sea-900 mb-4">追加情報</h2>

        <Disclosure>
          <DisclosureSummary>システム要件</DisclosureSummary>
          <div className="mt-4 space-y-2 text-sm">
            <h4 className="font-semibold">推奨ブラウザ</h4>
            <Ul className="ml-6">
              <li>Google Chrome（最新版）</li>
              <li>Mozilla Firefox（最新版）</li>
              <li>Microsoft Edge（最新版）</li>
              <li>Safari（最新版）</li>
            </Ul>

            <h4 className="font-semibold mt-4">必要な権限</h4>
            <Ul className="ml-6">
              <li>JavaScript の実行</li>
              <li>Cookie の使用</li>
            </Ul>
          </div>
        </Disclosure>

        <Disclosure>
          <DisclosureSummary>お問い合わせ先</DisclosureSummary>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              システムに関するお問い合わせは、以下の連絡先までお願いします：
            </p>
            <Ul className="ml-6">
              <li>メール: support@example.com</li>
              <li>電話: 03-1234-5678（平日 9:00-17:00）</li>
            </Ul>
          </div>
        </Disclosure>

        <Disclosure>
          <DisclosureSummary>デザインシステムについて</DisclosureSummary>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              このシステムは、デジタル庁のデザインシステムを採用しています。
              デザインシステムの詳細については、
              <a
                href="https://www.digital.go.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                デジタル庁公式サイト
              </a>
              をご覧ください。
            </p>
          </div>
        </Disclosure>
      </div>
    </div>
  );
}
