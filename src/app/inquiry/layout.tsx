'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Breadcrumbs,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbsLabel,
  HamburgerMenuButton,
  LanguageSelector,
  LanguageSelectorButton,
  LanguageSelectorMenu,
  LanguageSelectorMenuItem,
  UtilityLink,
} from '@/components/atoms/digital-go-jp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { ScrollToTopButton } from '@/components/atoms/digital-go-jp/v1/ScrollToTopButton';

interface LayoutProps {
  children: ReactNode;
}

export default function InquiryLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('ja');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageSelectorRef = useRef<HTMLDivElement>(null);

  // メニュー外クリック時の閉じる処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageSelectorRef.current &&
        !languageSelectorRef.current.contains(event.target as Node)
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    if (isLanguageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageMenuOpen]);

  // パスからパンくずリストを生成
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'ホーム', href: '/' }];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      let label = path;

      // パスに基づいてラベルを日本語化
      if (path === 'inquiry') label = '問い合わせ管理';
      else if (path === 'photo-content') label = '写真コンテンツ';
      else if (path === 'settings') label = '設定';
      else if (path === 'help') label = 'ヘルプ';
      else if (path === 'new') label = '新規作成';
      else if (!isNaN(Number(path))) label = `詳細 (${path})`;

      // 最後のパスでない場合のみリンクを追加
      if (index < paths.length - 1) {
        breadcrumbs.push({ label, href: currentPath });
      } else {
        breadcrumbs.push({ label, href: '' });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // ナビゲーションリンク
  const navLinks = [
    { href: '/inquiry', label: 'ダッシュボード' },
    { href: '/inquiry/photo-content', label: '写真管理' },
    { href: '/inquiry/settings', label: '設定' },
    { href: '/inquiry/help', label: 'ヘルプ' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-solid-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-solid-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ロゴ・タイトル */}
            <div className="flex items-center space-x-4">
              <HamburgerMenuButton
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden"
                aria-label="メニューを開く"
              />
              <Link href="/inquiry" className="flex items-center">
                <h1 className="text-xl font-bold text-sea-900">
                  問い合わせ管理システム
                </h1>
              </Link>
            </div>

            {/* デスクトップナビゲーション */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-sea-100 text-sea-900'
                      : 'text-solid-gray-700 hover:bg-solid-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ユーティリティリンク */}
            <div className="flex items-center space-x-4">
              <LanguageSelector ref={languageSelectorRef}>
                <LanguageSelectorButton
                  aria-label="言語を選択"
                  aria-expanded={isLanguageMenuOpen}
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center gap-1.5 pr-2"
                >
                  <FontAwesomeIcon icon={faGlobe} className="w-4 h-4" />
                  <span className="text-sm">Language</span>
                </LanguageSelectorButton>
                {isLanguageMenuOpen && (
                  <LanguageSelectorMenu className="absolute top-full right-0 mt-1 z-50">
                    <LanguageSelectorMenuItem
                      onClick={() => {
                        setCurrentLanguage('ja');
                        setIsLanguageMenuOpen(false);
                      }}
                    >
                      {currentLanguage === 'ja' ? '✓ ' : ''}日本語
                    </LanguageSelectorMenuItem>
                    <LanguageSelectorMenuItem
                      onClick={() => {
                        setCurrentLanguage('en');
                        setIsLanguageMenuOpen(false);
                      }}
                    >
                      {currentLanguage === 'en' ? '✓ ' : ''}English
                    </LanguageSelectorMenuItem>
                  </LanguageSelectorMenu>
                )}
              </LanguageSelector>
              <UtilityLink href="/" className="hidden sm:block">
                ログアウト
              </UtilityLink>
            </div>
          </div>
        </div>

        {/* モバイルナビゲーション */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-solid-gray-200">
            <nav className="px-4 py-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2 rounded-md text-sm font-medium ${
                    pathname === link.href
                      ? 'bg-sea-100 text-sea-900'
                      : 'text-solid-gray-700 hover:bg-solid-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* パンくずナビゲーション */}
      <div className="bg-white border-b border-solid-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumbs>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={index}>
                  {crumb.href ? (
                    <Link href={crumb.href}>
                      <BreadcrumbsLabel>{crumb.label}</BreadcrumbsLabel>
                    </Link>
                  ) : (
                    <BreadcrumbsLabel aria-current="page">
                      {crumb.label}
                    </BreadcrumbsLabel>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumbs>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-solid-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-sea-900 mb-4">関連リンク</h3>
              <ul className="space-y-2">
                <li>
                  <UtilityLink href="/">トップページ</UtilityLink>
                </li>
                <li>
                  <UtilityLink href="/inquiry/help">使い方ガイド</UtilityLink>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sea-900 mb-4">お問い合わせ</h3>
              <p className="text-sm text-solid-gray-700">
                システムに関するお問い合わせは、ヘルプページをご確認ください。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sea-900 mb-4">
                デザインシステム
              </h3>
              <p className="text-sm text-solid-gray-700">
                このシステムは
                <UtilityLink href="https://www.digital.go.jp/" target="_blank">
                  デジタル庁
                </UtilityLink>
                のデザインシステムを採用しています。
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-solid-gray-200 text-center text-sm text-solid-gray-600">
            <p>&copy; 2025 問い合わせ管理システム. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* トップへ戻るボタン */}
      <ScrollToTopButton />
    </div>
  );
}
