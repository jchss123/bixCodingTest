"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BoardCategory } from '@/types';
import { useAuthStore } from '@/store/authStore';

export default function Sidebar({
  categories,
  onSelect,
  open = false,
  onClose,
  collapsed = false,
  onToggle,
  onWriteClick,
}: {
  categories?: BoardCategory[];
  onSelect?: (c: BoardCategory | '') => void;
  open?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
  onWriteClick?: () => void;
}) {
  const router = useRouter();
  const { username, name, logout } = useAuthStore();

  const displayName = name && name.trim().length > 0 ? name : username || '';
  const email = username || '';

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!open) return null;

  return (
    <>
      {/* 배경 오버레이: 접히지 않았을 때만 표시 */}
      {onClose && !collapsed && <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />}

      {/* 사이드바 패널 */}
      <aside className={`fixed left-0 top-0 z-50 ${collapsed ? 'w-20' : 'w-64'} h-screen bg-white border-r shadow-lg transition-all duration-300 flex flex-col`}>
        {/* 사용자 정보 */}
        <div className="p-4 border-b">
          <div className={`flex ${collapsed ? 'flex-col items-center gap-2' : 'items-center justify-between gap-3'}`}>
            <div className={`flex items-center gap-3 min-w-0 ${collapsed ? 'flex-col' : 'flex-1'}`}>
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                {displayName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <div className="font-semibold truncate">{displayName || '사용자'}</div>
                  <div className="text-xs text-gray-500 truncate">{email}</div>
                </div>
              )}
            </div>
            {onToggle && (
              <button
                onClick={onToggle}
                title={collapsed ? '펼치기' : '접기'}
                className="h-8 w-8 flex-shrink-0 grid place-items-center rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
              >
                <svg 
                  className="w-4 h-4 transition-transform duration-300" 
                  style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="mt-3 w-full text-sm px-3 py-2 rounded border hover:bg-gray-50"
            >
              로그아웃
            </button>
          )}
        </div>

        {/* 탐색 */}
        <nav className="p-2 space-y-1 border-b">
          <Link href="/boards" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
            <span>📃</span>
            {!collapsed && <span>게시글 목록</span>}
          </Link>
          {onWriteClick && (
            <button 
              onClick={onWriteClick}
              className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-left"
            >
              <span>✍️</span>
              {!collapsed && <span>글쓰기</span>}
            </button>
          )}
        </nav>

        {/* 카테고리 */}
        {categories && onSelect && (
          <div className="mt-2">
            {!collapsed && <div className="px-4 py-2 text-sm text-gray-500">카테고리</div>}
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
              onClick={() => onSelect('')}
              title={collapsed ? '전체' : undefined}
            >
              <span className="text-lg">📋</span>
              {!collapsed && <span>전체</span>}
            </button>
            {categories.map((cat) => {
              const getCategoryIcon = () => {
                switch(cat) {
                  case 'NOTICE': return { icon: '📢', color: 'text-red-600' };
                  case 'FREE': return { icon: '💬', color: 'text-green-600' };
                  case 'QNA': return { icon: '❓', color: 'text-blue-600' };
                  case 'ETC': return { icon: '📝', color: 'text-purple-600' };
                  default: return { icon: '🏷️', color: 'text-gray-600' };
                }
              };
              const getCategoryName = () => {
                switch(cat) {
                  case 'NOTICE': return '공지';
                  case 'FREE': return '자유';
                  case 'QNA': return 'Q&A';
                  case 'ETC': return '기타';
                  default: return cat;
                }
              };
              const { icon, color } = getCategoryIcon();
              return (
                <button
                  key={cat}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => onSelect(cat)}
                  title={collapsed ? getCategoryName() : undefined}
                >
                  <span className={`text-lg ${color}`}>{icon}</span>
                  {!collapsed && <span>{getCategoryName()}</span>}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-auto p-4 text-xs text-gray-400">© CMT</div>
      </aside>
    </>
  );
}
