import type { ReactNode } from 'react';
import { Divider, SupportText } from '@/components/ui';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  colorClass?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  colorClass = 'text-blue-600',
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-solid-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-solid-gray-600">{title}</h3>
        {icon && <div className={`${colorClass} text-xl`}>{icon}</div>}
      </div>
      <div className={`text-4xl font-bold ${colorClass} mb-2`}>{value}</div>
      {subtitle && (
        <>
          <Divider className="my-3" />
          <SupportText className="text-xs">{subtitle}</SupportText>
        </>
      )}
    </div>
  );
}
