'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
  Textarea,
  Label,
  RequirementBadge,
  Select,
  Radio,
  Checkbox,
  ErrorText,
  Dl,
  Dt,
  Dd,
  Disclosure,
  DisclosureSummary,
  Blockquote,
  Divider,
} from '@/components/atoms/digital-go-jp';
import { Dialog, DialogBody } from '@/components/atoms/digital-go-jp/v1/Dialog';
import { getInquiry, updateInquiry, deleteInquiry } from '../actions';
import type {
  Inquiry,
  InquiryStatus,
  InquiryCategory,
  InquiryPriority,
} from '@/types/inquiry';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InquiryDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  // フォームデータ
  const [formData, setFormData] = useState({
    subject: '',
    name: '',
    email: '',
    phone: '',
    category: 'general' as InquiryCategory,
    priority: 'medium' as InquiryPriority,
    status: 'pending' as InquiryStatus,
    content: '',
    response: '',
    receivedAt: '',
    dueDate: '',
    completedAt: '',
  });

  // params の取得
  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  // データ取得
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getInquiry(id);
        if (data) {
          setInquiry(data);
          setFormData({
            subject: data.subject,
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            category: data.category,
            priority: data.priority,
            status: data.status,
            content: data.content,
            response: data.response || '',
            receivedAt: new Date(data.receivedAt).toISOString().split('T')[0],
            dueDate: data.dueDate
              ? new Date(data.dueDate).toISOString().split('T')[0]
              : '',
            completedAt: data.completedAt
              ? new Date(data.completedAt).toISOString().split('T')[0]
              : '',
          });
        } else {
          router.push('/inquiry');
        }
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

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

  // 保存処理
  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataObj.append(key, value);
      });

      await updateInquiry(id, formDataObj);
      const updatedData = await getInquiry(id);
      if (updatedData) {
        setInquiry(updatedData);
      }
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error('保存に失敗しました:', error);
      setErrors({ submit: '保存に失敗しました。もう一度お試しください。' });
    } finally {
      setIsSaving(false);
    }
  };

  // 削除処理
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteInquiry(id);
      router.push('/inquiry');
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

  if (!inquiry) {
    return (
      <div className="text-center py-8">
        <p className="text-solid-gray-600">問い合わせが見つかりませんでした</p>
        <Link href="/inquiry">
          <Button size="md" className="mt-4">
            一覧に戻る
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sea-900">問い合わせ詳細</h1>
          <p className="text-solid-gray-700 mt-1">ID: {inquiry.id}</p>
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
                onClick={() => router.push('/inquiry')}
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

      {/* 基本情報（表示モード） */}
      {!isEditing && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
          <h2 className="text-xl font-semibold text-sea-900 mb-4">基本情報</h2>
          <Dl className="space-y-3">
            <div>
              <Dt>件名</Dt>
              <Dd>{inquiry.subject}</Dd>
            </div>
            <div>
              <Dt>氏名</Dt>
              <Dd>{inquiry.name}</Dd>
            </div>
            <div>
              <Dt>メールアドレス</Dt>
              <Dd>{inquiry.email}</Dd>
            </div>
            {inquiry.phone && (
              <div>
                <Dt>電話番号</Dt>
                <Dd>{inquiry.phone}</Dd>
              </div>
            )}
            <div>
              <Dt>カテゴリ</Dt>
              <Dd>{inquiry.category}</Dd>
            </div>
            <div>
              <Dt>優先度</Dt>
              <Dd>{inquiry.priority}</Dd>
            </div>
            <div>
              <Dt>ステータス</Dt>
              <Dd>{inquiry.status}</Dd>
            </div>
            <div>
              <Dt>受付日</Dt>
              <Dd>
                {new Date(inquiry.receivedAt).toLocaleDateString('ja-JP')}
              </Dd>
            </div>
            {inquiry.dueDate && (
              <div>
                <Dt>対応期限</Dt>
                <Dd>{new Date(inquiry.dueDate).toLocaleDateString('ja-JP')}</Dd>
              </div>
            )}
            {inquiry.completedAt && (
              <div>
                <Dt>完了日</Dt>
                <Dd>
                  {new Date(inquiry.completedAt).toLocaleDateString('ja-JP')}
                </Dd>
              </div>
            )}
          </Dl>
        </div>
      )}

      {/* 基本情報（編集モード） */}
      {isEditing && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
          <h2 className="text-xl font-semibold text-sea-900 mb-4">基本情報</h2>
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
                blockSize="md"
              />
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
                blockSize="md"
              />
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
                blockSize="md"
              />
            </div>

            {/* カテゴリ */}
            <div>
              <Label htmlFor="category">カテゴリ</Label>
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
                <option value="general">一般</option>
                <option value="technical">技術的な問題</option>
                <option value="billing">請求・支払い</option>
                <option value="complaint">苦情・要望</option>
                <option value="other">その他</option>
              </Select>
            </div>

            {/* 優先度（ラジオボタン） */}
            <div>
              <Label>優先度</Label>
              <div className="space-y-2 mt-2">
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
                  高
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
                  中
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
                  低
                </Radio>
              </div>
            </div>

            {/* ステータス */}
            <div>
              <Label htmlFor="status">ステータス</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as InquiryStatus,
                  })
                }
              >
                <option value="pending">未対応</option>
                <option value="in-progress">対応中</option>
                <option value="completed">完了</option>
              </Select>
            </div>

            {/* 受付日 */}
            <div>
              <Label htmlFor="receivedAt">受付日</Label>
              <Input
                id="receivedAt"
                type="date"
                value={formData.receivedAt}
                onChange={(e) =>
                  setFormData({ ...formData, receivedAt: e.target.value })
                }
                blockSize="md"
              />
            </div>

            {/* 対応期限 */}
            <div>
              <Label htmlFor="dueDate">対応期限</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                blockSize="md"
              />
            </div>

            {/* 対応完了確認（Checkbox） */}
            {formData.status === 'completed' && (
              <div>
                <Checkbox
                  checked={!!formData.completedAt}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      completedAt: e.target.checked
                        ? new Date().toISOString().split('T')[0]
                        : '',
                    })
                  }
                >
                  対応完了日を記録する
                </Checkbox>
              </div>
            )}
          </div>
        </div>
      )}

      <Divider />

      {/* 問い合わせ内容 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
        <h2 className="text-xl font-semibold text-sea-900 mb-4">
          問い合わせ内容
        </h2>
        {!isEditing ? (
          <Blockquote>{inquiry.content}</Blockquote>
        ) : (
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
              rows={6}
            />
            {errors.content && <ErrorText>{errors.content}</ErrorText>}
          </div>
        )}
      </div>

      {/* 返信内容 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
        <h2 className="text-xl font-semibold text-sea-900 mb-4">返信内容</h2>
        {!isEditing ? (
          inquiry.response ? (
            <p className="text-solid-gray-700 whitespace-pre-wrap">
              {inquiry.response}
            </p>
          ) : (
            <p className="text-solid-gray-500 italic">まだ返信していません</p>
          )
        ) : (
          <div>
            <Label htmlFor="response">
              返信内容{' '}
              <RequirementBadge isOptional={true}>任意</RequirementBadge>
            </Label>
            <Textarea
              id="response"
              value={formData.response}
              onChange={(e) =>
                setFormData({ ...formData, response: e.target.value })
              }
              rows={6}
              placeholder="問い合わせへの返信を入力してください"
            />
          </div>
        )}
      </div>

      {/* 添付画像 */}
      {inquiry.attachments && inquiry.attachments.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
          <h2 className="text-xl font-semibold text-sea-900 mb-4">添付画像</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {inquiry.attachments.map((url, idx) => (
              <Image
                key={idx}
                src={url}
                alt={`添付画像 ${idx + 1}`}
                width={400}
                height={300}
                unoptimized
                className="w-full h-auto rounded object-cover"
              />
            ))}
          </div>
        </div>
      )}

      {/* 追加情報（Disclosure） */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-solid-gray-200">
        <Disclosure>
          <DisclosureSummary>追加情報を表示</DisclosureSummary>
          <div className="mt-4 space-y-2 text-sm text-solid-gray-700">
            <p>
              <strong>作成日時:</strong>{' '}
              {new Date(inquiry.createdAt).toLocaleString('ja-JP')}
            </p>
            <p>
              <strong>更新日時:</strong>{' '}
              {new Date(inquiry.updatedAt).toLocaleString('ja-JP')}
            </p>
            <p>
              <strong>問い合わせID:</strong> {inquiry.id}
            </p>
          </div>
        </Disclosure>
      </div>

      {/* 削除確認ダイアログ */}
      <Dialog ref={deleteDialogRef}>
        <DialogBody>
          <h2 className="text-xl font-semibold text-sea-900 mb-4">
            問い合わせを削除しますか？
          </h2>
          <p className="text-solid-gray-700 mb-6">
            この操作は取り消せません。本当に削除してもよろしいですか？
          </p>
          <div className="flex justify-end gap-2">
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
