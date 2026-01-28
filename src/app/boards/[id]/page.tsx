'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { BoardDetail } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { BASE_URL } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import Logo from '@/components/Logo';
import { formatDate, getCategoryBadge } from '@/utils/boardUtils';

// 게시글 상세 페이지
export default function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const { accessToken } = useAuthStore();

  // 이미지 URL을 절대 URL로 변환하는 함수
  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl; // 이미 절대 URL인 경우
    }
    // 상대 경로인 경우 BASE_URL과 결합
    const fullUrl = `${BASE_URL}${imageUrl}`;
    console.log('Image URL:', imageUrl, '->', fullUrl); // 디버깅용
    return fullUrl;
  };

  useEffect(() => {
    if (!accessToken) {
      router.push('/?modal=signin');
      return;
    }
    fetchBoard();
  }, [accessToken, router]);

  const fetchBoard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/boards/${id}`);
      if (!res.data) {
        setError('게시글을 불러올 수 없습니다');
        return;
      }
      setBoard(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('게시글이 존재하지 않습니다');
      } else {
        setError('게시글을 불러오지 못했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      const response = await api.delete(`/boards/${id}`);
      if (!response.data) {
        setError('게시글 삭제에 실패했습니다');
        return;
      }
      router.push('/boards');
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('게시글이 존재하지 않습니다');
      } else {
        setError('게시글 삭제 실패');
      }
    }
  };

  if (!accessToken) return <div>로딩 중...</div>;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600">게시글을 불러오는 중...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <Link href="/boards" className="text-blue-600 hover:underline">목록으로 돌아가기</Link>
      </div>
    </div>
  );
  if (!board) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">게시글을 찾을 수 없습니다</p>
    </div>
  );

  const badge = getCategoryBadge(board.boardCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar
        open
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        onSelect={() => {}}
      />

      <main className={`p-6 pt-20 max-w-5xl mx-auto transition-all duration-300 ${
        collapsed ? 'ml-20' : 'ml-64'
      }`}>
        {/* 헤더 영역 */}
        <div className="mb-8">
          <div className="relative flex flex-col items-center mb-6 py-8">
            {/* 로고 주변 커뮤니티 아이콘들 */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
              <div className="absolute top-2 left-8 text-5xl animate-float">💬</div>
              <div className="absolute top-4 right-12 text-4xl animate-float-delay-1">👥</div>
              <div className="absolute top-10 left-20 text-4xl animate-float-delay-2">📝</div>
              <div className="absolute top-8 right-24 text-5xl animate-float-delay-3">✉️</div>
              <div className="absolute bottom-4 left-16 text-4xl animate-float">💭</div>
              <div className="absolute bottom-6 right-16 text-4xl animate-float-delay-1">🗨️</div>
            </div>
            
            <div className="relative flex flex-col items-center">
              <Logo size={64} className="mb-1" />
              <span className="text-[10px] text-gray-400 tracking-wide">Community</span>
            </div>
          </div>
        </div>

        {/* 게시글 상세 */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* 게시글 헤더 */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-sm px-3 py-1 rounded-full font-semibold ${badge.color}`}>
                {badge.text}
              </span>
              <span className="text-sm text-gray-500">{formatDate(board.createdAt)}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{board.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>작성일: {formatDate(board.createdAt)}</span>
            </div>
          </div>

          {/* 게시글 본문 */}
          <div className="p-8">
            <div className="prose max-w-none mb-8">
              <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                {board.content}
              </p>
            </div>

            {/* 이미지 */}
            {board.imageUrl && (
              <div className="mt-6">
                <img 
                  src={getImageUrl(board.imageUrl)} 
                  alt="첨부 이미지" 
                  className="w-full rounded-xl shadow-md"
                />
              </div>
            )}
          </div>

          {/* 게시글 푸터 */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <Link 
              href="/boards"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <span>←</span>
              <span>목록으로 돌아가기</span>
            </Link>
            <div className="flex gap-2">
              <Link 
                href={`/boards/edit/${board.id}`}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              >
                수정
              </Link>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}