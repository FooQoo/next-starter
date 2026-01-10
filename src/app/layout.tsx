import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { AppLayout } from '@/components/organizms/app-layout';

export const metadata: Metadata = {
  title: '問い合わせ管理システム',
  description: '行政の問い合わせを効率的に管理する統合プラットフォーム',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
