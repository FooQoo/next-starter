'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionContent,
  Checkbox,
  Radio,
  Divider,
  Button,
  Label,
  Input,
  Select,
} from '@/components/ui';

export default function SettingsPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotification: true,
    pushNotification: false,
    newInquiry: true,
    statusChange: true,
    dailySummary: false,
  });

  const [displaySettings, setDisplaySettings] = useState({
    theme: 'light',
    itemsPerPage: '10',
    language: 'ja',
  });

  const [privacySettings, setPrivacySettings] = useState({
    showEmail: true,
    showPhone: false,
    analyticsEnabled: true,
  });

  const handleSave = () => {
    alert('設定を保存しました');
  };

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div>
        <h1 className="text-3xl font-bold text-sea-900">設定</h1>
        <p className="text-solid-gray-700 mt-1">
          システムの各種設定を管理します
        </p>
      </div>

      <Divider />

      {/* 通知設定 */}
      <div className="bg-white rounded-lg shadow-sm border border-solid-gray-200">
        <Accordion open>
          <AccordionSummary className="px-8 py-5">
            <h2 className="text-xl font-semibold text-sea-900">通知設定</h2>
          </AccordionSummary>
          <AccordionContent className="px-8 pb-8">
            <div className="space-y-6">
              <p className="text-sm text-solid-gray-700 mb-4">
                通知の受信方法と通知する内容を設定できます
              </p>

              <div className="space-y-4">
                <div className="font-semibold text-sea-800 mb-3">通知方法</div>
                <Checkbox
                  checked={notificationSettings.emailNotification}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotification: e.target.checked,
                    })
                  }
                >
                  メール通知を有効にする
                </Checkbox>
                <Checkbox
                  checked={notificationSettings.pushNotification}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      pushNotification: e.target.checked,
                    })
                  }
                >
                  プッシュ通知を有効にする
                </Checkbox>
              </div>

              <Divider />

              <div className="space-y-4">
                <div className="font-semibold text-sea-800 mb-3">通知内容</div>
                <Checkbox
                  checked={notificationSettings.newInquiry}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      newInquiry: e.target.checked,
                    })
                  }
                >
                  新しい問い合わせが登録されたとき
                </Checkbox>
                <Checkbox
                  checked={notificationSettings.statusChange}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      statusChange: e.target.checked,
                    })
                  }
                >
                  問い合わせのステータスが変更されたとき
                </Checkbox>
                <Checkbox
                  checked={notificationSettings.dailySummary}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      dailySummary: e.target.checked,
                    })
                  }
                >
                  毎日の問い合わせサマリーを受け取る
                </Checkbox>
              </div>
            </div>
          </AccordionContent>
        </Accordion>
      </div>

      {/* 表示設定 */}
      <div className="bg-white rounded-lg shadow-sm border border-solid-gray-200">
        <Accordion>
          <AccordionSummary className="px-8 py-5">
            <h2 className="text-xl font-semibold text-sea-900">表示設定</h2>
          </AccordionSummary>
          <AccordionContent className="px-8 pb-8">
            <div className="space-y-6">
              <p className="text-sm text-solid-gray-700 mb-4">
                画面表示に関する設定を行います
              </p>

              {/* テーマ選択 - ライトモード固定 */}
              <div>
                <Label className="font-semibold text-sea-800 mb-3 block">
                  テーマ
                </Label>
                <div className="mt-2">
                  <p className="text-sm text-solid-gray-700">
                    ライトモードで固定されています
                  </p>
                </div>
              </div>

              <Divider />

              {/* 1ページあたりの表示件数 */}
              <div>
                <Label
                  htmlFor="items-per-page"
                  className="font-semibold text-sea-800 mb-3 block"
                >
                  1ページあたりの表示件数
                </Label>
                <Select
                  id="items-per-page"
                  value={displaySettings.itemsPerPage}
                  onChange={(e) =>
                    setDisplaySettings({
                      ...displaySettings,
                      itemsPerPage: e.target.value,
                    })
                  }
                  className="max-w-xs"
                >
                  <option value="5">5件</option>
                  <option value="10">10件</option>
                  <option value="20">20件</option>
                  <option value="50">50件</option>
                </Select>
              </div>

              <Divider />

              {/* 言語設定 */}
              <div>
                <Label
                  htmlFor="language"
                  className="font-semibold text-sea-800 mb-3 block"
                >
                  言語
                </Label>
                <Select
                  id="language"
                  value={displaySettings.language}
                  onChange={(e) =>
                    setDisplaySettings({
                      ...displaySettings,
                      language: e.target.value,
                    })
                  }
                  className="max-w-xs"
                >
                  <option value="ja">日本語</option>
                  <option value="en">English</option>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </Accordion>
      </div>

      {/* プライバシー設定 */}
      <div className="bg-white rounded-lg shadow-sm border border-solid-gray-200">
        <Accordion>
          <AccordionSummary className="px-8 py-5">
            <h2 className="text-xl font-semibold text-sea-900">
              プライバシー設定
            </h2>
          </AccordionSummary>
          <AccordionContent className="px-8 pb-8">
            <div className="space-y-6">
              <p className="text-sm text-solid-gray-700 mb-4">
                個人情報の表示と分析に関する設定を行います
              </p>

              <div className="space-y-4">
                <Checkbox
                  checked={privacySettings.showEmail}
                  onChange={(e) =>
                    setPrivacySettings({
                      ...privacySettings,
                      showEmail: e.target.checked,
                    })
                  }
                >
                  メールアドレスを他のユーザーに表示する
                </Checkbox>
                <Checkbox
                  checked={privacySettings.showPhone}
                  onChange={(e) =>
                    setPrivacySettings({
                      ...privacySettings,
                      showPhone: e.target.checked,
                    })
                  }
                >
                  電話番号を他のユーザーに表示する
                </Checkbox>
                <Checkbox
                  checked={privacySettings.analyticsEnabled}
                  onChange={(e) =>
                    setPrivacySettings({
                      ...privacySettings,
                      analyticsEnabled: e.target.checked,
                    })
                  }
                >
                  使用状況の分析を許可する
                </Checkbox>
              </div>

              <Divider />

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>注意:</strong>{' '}
                  プライバシー設定を変更すると、他のユーザーからあなたの情報がどのように見えるかが変わります。慎重に設定してください。
                </p>
              </div>
            </div>
          </AccordionContent>
        </Accordion>
      </div>

      {/* アカウント設定 */}
      <div className="bg-white rounded-lg shadow-sm border border-solid-gray-200">
        <Accordion>
          <AccordionSummary className="px-8 py-5">
            <h2 className="text-xl font-semibold text-sea-900">
              アカウント設定
            </h2>
          </AccordionSummary>
          <AccordionContent className="px-8 pb-8">
            <div className="space-y-6">
              <p className="text-sm text-solid-gray-700 mb-4">
                アカウントに関する設定を行います
              </p>

              <div>
                <Label htmlFor="username" className="mb-3 block">
                  ユーザー名
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="山田 太郎"
                  blockSize="md"
                  className="max-w-md"
                />
              </div>

              <div>
                <Label htmlFor="email" className="mb-3 block">
                  メールアドレス
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="yamada@example.com"
                  blockSize="md"
                  className="max-w-md"
                />
              </div>

              <Divider />

              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="md"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  パスワードを変更
                </Button>
              </div>

              <Divider />

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-900 font-semibold mb-2">
                  危険な操作
                </p>
                <p className="text-sm text-red-900 mb-4">
                  アカウントを削除すると、すべてのデータが永久に失われます。
                </p>
                <Button
                  variant="outline"
                  size="md"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  アカウントを削除
                </Button>
              </div>
            </div>
          </AccordionContent>
        </Accordion>
      </div>

      <Divider />

      {/* 保存ボタン */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          size="md"
          onClick={() => window.location.reload()}
        >
          リセット
        </Button>
        <Button variant="solid-fill" size="md" onClick={handleSave}>
          設定を保存
        </Button>
      </div>
    </div>
  );
}
