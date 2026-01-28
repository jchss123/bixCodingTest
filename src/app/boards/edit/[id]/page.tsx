'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { BoardDetail, BoardCategory } from '@/types';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/Sidebar';
import Logo from '@/components/Logo';

// 게시글 수정 페이지
export default function EditBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'FREE' as BoardCategory,
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) {
      router.push('/?modal=signin');
      return;
    }
    fetchBoard();
  }, [accessToken, router]);

  const fetchBoard = async () => {
    try {
      const res = await api.get(`/boards/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const board: BoardDetail = res.data;
      setForm({
        title: board.title,
        content: board.content,
        category: board.boardCategory,
      });
    } catch (err: any) {
      setError('게시글이 존재하지 않습니다');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.content) {
      setError('제목과 내용을 입력해주세요');
      return;
    }

    try {
      const requestData = {
        title: form.title,
        content: form.content,
        category: form.category,
      };

      const formData = new FormData();
      // JSON을 request key에 Blob으로 넣기
      const blob = new Blob([JSON.stringify(requestData)], { type: 'application/json' });
      formData.append('request', blob);

      if (file) formData.append('file', file);

      await api.patch(`/boards/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      router.push(`/boards/${id}`);
    } catch (err: any) {
      console.error('=== UPDATE ERROR DEBUG ===');
      console.error('Status:', err.response?.status);
      console.error('Response:', err.response?.data);
      setError('게시글 수정 실패');
    }
  };

  if (!accessToken) return <div>로딩 중...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">{error}</div>;

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

        {/* 수정 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">글 수정</h1>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as BoardCategory })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="NOTICE">📢 공지</option>
              <option value="FREE">💬 자유</option>
              <option value="QNA">❓ Q&A</option>
              <option value="ETC">📝 기타</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
            <textarea
              placeholder="내용을 입력하세요"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">이미지 첨부</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
                accept="image/*"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-sm text-gray-600">
                  {file ? file.name : '이미지를 선택하세요'}
                </p>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Link
              href={`/boards/${id}`}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
            >
              취소
            </Link>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
            >
              수정 완료
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
