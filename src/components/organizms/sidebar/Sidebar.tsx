'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  faChartLine,
  faImage,
  faCog,
  faQuestionCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SidebarNavItem } from './SidebarNavItem';

const navLinks = [
  { href: '/', label: 'ダッシュボード', icon: faChartLine },
  { href: '/photo-content', label: '写真管理', icon: faImage },
  { href: '/settings', label: '設定', icon: faCog },
  { href: '/help', label: 'ヘルプ', icon: faQuestionCircle },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* デスクトップサイドバー */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-solid-gray-200 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* サイドバーヘッダー */}
        <div className="h-16 px-4 flex items-center">
          <h1 className="text-lg font-bold text-sea-900">
            問い合わせ管理システム
          </h1>
        </div>

        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <SidebarNavItem
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                />
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* モバイルDrawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* オーバーレイ */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.aside
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-lg"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Drawerヘッダー */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-solid-gray-200">
                <span className="text-lg font-bold text-sea-900">メニュー</span>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md hover:bg-solid-gray-100 transition-colors"
                  aria-label="メニューを閉じる"
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="w-5 h-5 text-solid-gray-700"
                  />
                </button>
              </div>

              {/* ナビゲーション */}
              <nav className="py-4">
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <SidebarNavItem
                        href={link.href}
                        label={link.label}
                        icon={link.icon}
                        onClick={onClose}
                      />
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
