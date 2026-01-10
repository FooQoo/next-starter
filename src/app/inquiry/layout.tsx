import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function InquiryLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
