'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  Input,
  Textarea,
  Label,
  RequirementBadge,
  Select,
  Radio,
  ErrorText,
  Legend,
  SupportText,
  Divider,
} from '@/components/atoms/digital-go-jp';
import { createInquiry } from '../actions';
import type { InquiryCategory, InquiryPriority } from '@/types/inquiry';

export default function NewInquiryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    subject: '',
    name: '',
    email: '',
    phone: '',
    category: 'general' as InquiryCategory,
    priority: 'medium' as InquiryPriority,
    content: '',
    receivedAt: new Date().toISOString().split('T')[0],
    dueDate: '',
  });

  // バリデーション
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = '件名は必須です';
    }
    if (!formData.name.trim()) {
      newErrors.name = '氏名は必須です';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    if (!formData.content.trim()) {
      newErrors.content = '問い合わせ内容は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataObj.append(key, value);
      });

      const inquiry = await createInquiry(formDataObj);
      router.push(`/inquiry/${inquiry.id}`);
    } catch (error) {
      console.error('作成に失敗しました:', error);
      setErrors({ submit: '作成に失敗しました。もう一度お試しください。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sea-900">
            新規問い合わせ作成
          </h1>
          <p className="text-solid-gray-700 mt-1">
            問い合わせ情報を入力してください
          </p>
        </div>
        <Link href="/inquiry">
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
        {/* 基本情報 */}
        <fieldset className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
          <Legend className="text-xl font-semibold text-sea-900 mb-4">
            基本情報
          </Legend>
          <SupportText className="mb-4">
            問い合わせ者の基本情報を入力してください。必須項目は必ず入力が必要です。
          </SupportText>

          <div className="space-y-4">
            {/* 件名 */}
            <div>
              <Label htmlFor="subject">
                件名 <RequirementBadge>必須</RequirementBadge>
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="問い合わせの件名を入力してください"
                blockSize="md"
              />
              <SupportText>
                簡潔で分かりやすい件名を入力してください
              </SupportText>
              {errors.subject && <ErrorText>{errors.subject}</ErrorText>}
            </div>

            {/* 氏名 */}
            <div>
              <Label htmlFor="name">
                氏名 <RequirementBadge>必須</RequirementBadge>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="山田 太郎"
                blockSize="md"
              />
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
            </div>

            {/* メールアドレス */}
            <div>
              <Label htmlFor="email">
                メールアドレス <RequirementBadge>必須</RequirementBadge>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="example@example.com"
                blockSize="md"
              />
              <SupportText>
                返信先のメールアドレスを入力してください
              </SupportText>
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </div>

            {/* 電話番号 */}
            <div>
              <Label htmlFor="phone">
                電話番号{' '}
                <RequirementBadge isOptional={true}>任意</RequirementBadge>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="090-1234-5678"
                blockSize="md"
              />
              <SupportText>緊急時の連絡先として使用します</SupportText>
            </div>

            {/* カテゴリ */}
            <div>
              <Label htmlFor="category">
                カテゴリ <RequirementBadge>必須</RequirementBadge>
              </Label>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as InquiryCategory,
                  })
                }
              >
                <option value="general">一般的な問い合わせ</option>
                <option value="technical">技術的な問題</option>
                <option value="billing">請求・支払いに関する問い合わせ</option>
                <option value="complaint">苦情・要望</option>
                <option value="other">その他</option>
              </Select>
              <SupportText>問い合わせの種類を選択してください</SupportText>
            </div>
          </div>
        </fieldset>

        <Divider />

        {/* 問い合わせ詳細 */}
        <fieldset className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
          <Legend className="text-xl font-semibold text-sea-900 mb-4">
            問い合わせ詳細
          </Legend>
          <SupportText className="mb-4">
            問い合わせの内容や優先度などの詳細情報を入力してください。
          </SupportText>

          <div className="space-y-4">
            {/* 優先度（ラジオボタン） */}
            <div>
              <Label>
                優先度 <RequirementBadge>必須</RequirementBadge>
              </Label>
              <SupportText className="mb-2">
                問い合わせの緊急度に応じて優先度を選択してください
              </SupportText>
              <div className="space-y-2">
                <Radio
                  name="priority"
                  value="high"
                  checked={formData.priority === 'high'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as InquiryPriority,
                    })
                  }
                >
                  高 - 緊急対応が必要
                </Radio>
                <Radio
                  name="priority"
                  value="medium"
                  checked={formData.priority === 'medium'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as InquiryPriority,
                    })
                  }
                >
                  中 - 通常対応
                </Radio>
                <Radio
                  name="priority"
                  value="low"
                  checked={formData.priority === 'low'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as InquiryPriority,
                    })
                  }
                >
                  低 - 時間的余裕がある
                </Radio>
              </div>
            </div>

            {/* 問い合わせ内容 */}
            <div>
              <Label htmlFor="content">
                問い合わせ内容 <RequirementBadge>必須</RequirementBadge>
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="問い合わせ内容を詳しく入力してください"
                rows={8}
              />
              <SupportText>
                できるだけ具体的に状況を説明してください。必要に応じてエラーメッセージや操作手順なども記載してください。
              </SupportText>
              {errors.content && <ErrorText>{errors.content}</ErrorText>}
            </div>

            {/* 受付日 */}
            <div>
              <Label htmlFor="receivedAt">
                受付日 <RequirementBadge>必須</RequirementBadge>
              </Label>
              <Input
                id="receivedAt"
                type="date"
                value={formData.receivedAt}
                onChange={(e) =>
                  setFormData({ ...formData, receivedAt: e.target.value })
                }
                blockSize="md"
              />
              <SupportText>
                問い合わせを受け付けた日付を選択してください
              </SupportText>
            </div>

            {/* 対応期限 */}
            <div>
              <Label htmlFor="dueDate">
                対応期限{' '}
                <RequirementBadge isOptional={true}>任意</RequirementBadge>
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                blockSize="md"
              />
              <SupportText>
                対応が必要な期限がある場合は設定してください
              </SupportText>
            </div>
          </div>
        </fieldset>

        <Divider />

        {/* 送信ボタン */}
        <div className="flex justify-end gap-4">
          <Link href="/inquiry">
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
            {isSubmitting ? '作成中...' : '作成する'}
          </Button>
        </div>
      </form>
    </div>
  );
}
