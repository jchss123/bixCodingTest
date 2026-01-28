'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Logo from '@/components/Logo';
import Modal from '@/components/Modal';
import SigninForm from '@/components/auth/SigninForm';
import SignupForm from '@/components/auth/SignupForm';

// 랜딩 페이지: 미로그인 시 로고/소개/버튼, 로그인 시 boards로 이동
export default function Home() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const searchParams = useSearchParams();
  const [openSignin, setOpenSignin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);

  useEffect(() => {
    if (accessToken) router.push('/boards');
  }, [accessToken, router]);

  if (accessToken) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-gray-100">
      {/* 배경 장식 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-64 w-64 rounded-full bg-indigo-200/50 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-1/4 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
      </div>

      {/* 히어로 섹션 */}
      <section className="max-w-6xl mx-auto px-6 min-h-[80vh] grid grid-rows-[0.6fr_auto_auto_0.4fr]">
        {/* 중앙 로고 (정중앙 고정) */}
        <div className="row-start-2 row-end-3 flex items-center justify-center">
          <div className="relative py-8">
            {/* 로고 주변 커뮤니티 아이콘들 */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
              <div className="absolute -top-4 -left-12 text-6xl animate-float">💬</div>
              <div className="absolute -top-2 -right-16 text-5xl animate-float-delay-1">👥</div>
              <div className="absolute top-8 -left-20 text-5xl animate-float-delay-2">📝</div>
              <div className="absolute top-12 -right-20 text-6xl animate-float-delay-3">✉️</div>
              <div className="absolute -bottom-2 -left-16 text-5xl animate-float">💭</div>
              <div className="absolute -bottom-4 -right-12 text-5xl animate-float-delay-1">🗨️</div>
            </div>
            
            <Logo size={96} />
          </div>
        </div>
        {/* 로고 아래 콘텐츠 */}
        <div className="row-start-3 row-end-4 mx-auto max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            CMT 커뮤니티에 오신 것을 환영합니다
          </h1>
          <p className="mt-3 text-lg md:text-xl text-gray-600">
            카테고리별로 글을 탐색하고, 이미지를 첨부해 더 풍부하게 소통하세요.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setOpenSignin(true)}
              className="w-full sm:w-auto px-7 py-3 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 transition"
            >
              로그인
            </button>
            <button
              onClick={() => setOpenSignup(true)}
              className="w-full sm:w-auto px-7 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 transition"
            >
              회원가입
            </button>
          </div>
        </div>
      </section>

      {/* 기능 하이라이트 섹션 */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <Modal open={openSignin} title="로그인" onClose={() => setOpenSignin(false)}>
        <SigninForm onSuccess={() => router.push('/boards')} />
        <div className="mt-4 text-sm text-gray-600">
          계정이 없으신가요?{' '}
          <button className="text-blue-600" onClick={() => { setOpenSignin(false); setOpenSignup(true); }}>
            회원가입
          </button>
        </div>
      </Modal>

      <Modal open={openSignup} title="회원가입" onClose={() => setOpenSignup(false)}>
        <SignupForm onSuccess={() => { setOpenSignup(false); setOpenSignin(true); }} />
      </Modal>
    </div>
  );
}
