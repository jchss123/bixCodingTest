'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function SignupForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setNameError('');
    setPasswordError('');
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.username)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    if (!form.name.trim()) {
      setNameError('이름을 입력해주세요.');
      return;
    }
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!%*#?&])[A-Za-z\d!%*#?&]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setPasswordError('비밀번호는 8자 이상, 숫자, 영문자, 특수문자(!%*#?&) 1개 이상의 조합이어야 합니다.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        username: form.username,
        name: form.name,
        password: form.password,
        confirmPassword: form.confirmPassword,
      };
      await api.post('/auth/signup', requestData);
      // 회원가입 성공 시 이름을 임시로 저장
      if (typeof window !== 'undefined') {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          parsed.state.name = form.name;
          localStorage.setItem('auth-storage', JSON.stringify(parsed));
        }
      }
      onSuccess?.();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || '회원가입 실패';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-0">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="email"
        placeholder="이메일"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        className="w-full p-2 border mb-4"
        required
      />
      {emailError && <p className="text-red-500 mb-2">{emailError}</p>}
      <input
        type="text"
        placeholder="이름"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full p-2 border mb-4"
        required
      />
      {nameError && <p className="text-red-500 mb-2">{nameError}</p>}
      <input
        type="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full p-2 border mb-4"
        required
      />
      {passwordError && <p className="text-red-500 mb-2">{passwordError}</p>}
      <input
        type="password"
        placeholder="비밀번호 확인"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        className="w-full p-2 border mb-4"
        required
      />
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {loading ? '회원가입 중...' : '회원가입'}
      </button>
    </form>
  );
}
