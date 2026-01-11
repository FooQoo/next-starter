'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: IconDefinition;
  onClick?: () => void;
}

export const SidebarNavItem = ({
  href,
  label,
  icon,
  onClick,
}: SidebarNavItemProps) => {
  const pathname = usePathname();

  // アクティブ状態の判定（完全一致、または子ルートの場合）
  const isActive =
    pathname === href ||
    (href !== '/' && pathname.startsWith(href) && pathname !== '/');

  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-r-lg cursor-pointer
          transition-colors duration-200
          ${
            isActive
              ? 'bg-sea-100 text-sea-900 border-l-4 border-sea-600 font-bold'
              : 'text-solid-gray-700 hover:bg-solid-gray-100 hover:text-solid-gray-900 border-l-4 border-transparent'
          }
        `}
        whileHover={{ x: isActive ? 0 : 2 }}
        transition={{ duration: 0.2 }}
      >
        <FontAwesomeIcon icon={icon} className="w-5 h-5 shrink-0" />
        <span className="text-sm">{label}</span>
      </motion.div>
    </Link>
  );
};
