'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { BoardListResponse, BoardCategory } from '@/types';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/store/authStore';
import BoardHeader from '@/components/boards/BoardHeader';
import CategoryFilter from '@/components/boards/CategoryFilter';
import BoardCard from '@/components/boards/BoardCard';
import NoticePanel from '@/components/boards/NoticePanel';
import WriteModal from '@/components/boards/WriteModal';

// 게시글 목록 페이지
export default function BoardsPage() {
  const [data, setData] = useState<BoardListResponse | null>(null);
  const categories: BoardCategory[] = ['NOTICE', 'FREE', 'QNA', 'ETC'];
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState<BoardCategory | ''>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notices, setNotices] = useState<BoardListResponse['content']>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [writeForm, setWriteForm] = useState({
    title: '',
    content: '',
    category: 'FREE' as BoardCategory,
  });
  const [file, setFile] = useState<File | null>(null);
  const [writeError, setWriteError] = useState('');
  const [writeLoading, setWriteLoading] = useState(false);
  const router = useRouter();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) {
      router.push('/?modal=signin');
      return;
    }
    fetchBoards();
  }, [page, category, accessToken, router]);

  useEffect(() => {
    setPage(0); // 카테고리 변경 시 페이지 리셋
  }, [category]);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      setError('');
      // 전체 데이터를 가져와서 클라이언트 사이드에서 필터링 및 페이징
      const params = new URLSearchParams({ page: '0', size: '1000' });
      const res = await api.get(`/boards?${params}`);
      const allData = res.data.content;
      let filtered = allData;
      if (category) {
        filtered = allData.filter((board: any) => board.category === category);
      }
      // 페이징 적용
      const start = page * 10;
      const end = start + 10;
      const pagedContent = filtered.slice(start, end);
      const totalElements = filtered.length;
      const totalPages = Math.ceil(totalElements / 10);
      setData({
        content: pagedContent,
        totalPages,
        totalElements,
      });
      setNotices(allData.filter((board: any) => board.category === 'NOTICE').slice(0, 5));
    } catch (err: any) {
      setError('글 목록을 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleWriteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWriteError('');

    if (!writeForm.title || !writeForm.content) {
      setWriteError('제목과 내용을 입력해주세요');
      return;
    }

    setWriteLoading(true);
    try {
      const requestData = {
        title: writeForm.title,
        content: writeForm.content,
        category: writeForm.category,
      };

      const formData = new FormData();
      const blob = new Blob([JSON.stringify(requestData)], {
        type: 'application/json',
      });
      formData.append('request', blob);

      if (file) formData.append('file', file);

      const response = await api.post('/boards', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data) {
        setWriteError('게시글 등록에 실패했습니다');
        return;
      }

      // 성공 시 모달 닫고 폼 초기화
      handleCloseWriteModal();
      fetchBoards();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || '게시글 등록 실패';
      setWriteError(errorMsg);
    } finally {
      setWriteLoading(false);
    }
  };

  const handleCloseWriteModal = () => {
    setWriteModalOpen(false);
    setWriteForm({ title: '', content: '', category: 'FREE' });
    setFile(null);
    setWriteError('');
  };

  if (!accessToken) return <div>로딩 중...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* 오버레이 사이드바 */}
      <Sidebar
        open
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        categories={categories}
        onSelect={(c) => {
          setCategory(c);
        }}
        onWriteClick={() => setWriteModalOpen(true)}
      />

      <main className={`p-6 pt-20 max-w-7xl mx-auto transition-all duration-300 ${
        collapsed ? 'ml-20' : 'ml-64'
      }`}>
        {/* 헤더 영역 */}
        <div className="mb-8">
          <BoardHeader />
          <CategoryFilter 
            categories={categories}
            selectedCategory={category}
            onSelect={setCategory}
          />
        </div>

        {/* 메인 콘텐츠 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 게시글 목록 (왼쪽 2/3) */}
          <div className="md:col-span-2 space-y-3">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}
            {loading && (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse-skeleton">
                    {/* 카테고리 배지 스켈레톤 */}
                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
                    </div>
                    {/* 제목 스켈레톤 */}
                    <div className="mb-2 h-5 bg-gray-300 rounded w-3/4"></div>
                    {/* 내용 미리보기 스켈레톤 */}
                    <div className="mb-3 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    </div>
                    {/* 메타정보 스켈레톤 */}
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            )}
            {!loading && data?.content.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500 text-lg">등록된 글이 없습니다</p>
              </div>
            )}
            {data?.content.map((board) => (
              <BoardCard
                key={board.id}
                id={board.id}
                title={board.title}
                content={board.content}
                category={board.category}
                createdAt={board.createdAt}
                imageUrls={board.imageUrls}
              />
            ))}

            {/* 페이지네이션 */}
            {data && data.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {page > 0 && (
                  <button 
                    onClick={() => setPage(page - 1)} 
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    이전
                  </button>
                )}
                <div className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg">
                  <span className="font-medium">{page + 1}</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-gray-600">{data.totalPages}</span>
                </div>
                {page < data.totalPages - 1 && (
                  <button 
                    onClick={() => setPage(page + 1)} 
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    다음
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 공지사항 사이드바 (오른쪽 1/3) */}
          <div className="md:col-span-1 space-y-4">
            {/* 글쓰기 버튼 */}
            <button
              onClick={() => setWriteModalOpen(true)}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium text-sm"
            >
              ✏️ 글쓰기
            </button>
            
            {/* 공지사항 패널 */}
            <NoticePanel notices={notices} />
          </div>
        </div>

        {/* 기능 하이라이트 섹션 */}
        <section className="mt-20 pb-12 border-t border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm hover:shadow transition">
              <div className="text-3xl">📝</div>
              <h3 className="mt-3 text-lg font-semibold">빠른 글쓰기</h3>
              <p className="mt-1 text-gray-600">간단한 폼으로 바로 게시글을 작성하고 공유하세요.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm hover:shadow transition">
              <div className="text-3xl">🏷️</div>
              <h3 className="mt-3 text-lg font-semibold">카테고리 필터</h3>
              <p className="mt-1 text-gray-600">공지/자유/Q&A/기타로 원하는 글만 깔끔하게.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm hover:shadow transition">
              <div className="text-3xl">🖼️</div>
              <h3 className="mt-3 text-lg font-semibold">이미지 첨부</h3>
              <p className="mt-1 text-gray-600">이미지를 함께 첨부해 더 풍부한 소통을 만들어보세요.</p>
            </div>
          </div>
        </section>
      </main>

      <WriteModal
        open={writeModalOpen}
        form={writeForm}
        file={file}
        error={writeError}
        loading={writeLoading}
        onFormChange={setWriteForm}
        onFileChange={setFile}
        onSubmit={handleWriteSubmit}
        onClose={handleCloseWriteModal}
      />
    </div>
  );
}