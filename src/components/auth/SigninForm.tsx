'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function SigninForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/signin', form);
      if (!res.data || !res.data.accessToken) {
        setError('로그인 실패: 응답이 올바르지 않습니다');
        return;
      }
      const currentName = useAuthStore.getState().name;
      setAuth({ ...res.data, username: form.username, name: res.data.name || currentName || form.username });
      onSuccess?.();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || '아이디 또는 비밀번호가 올바른지 않습니다';
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
      <input
        type="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full p-2 border mb-4"
        required
      />
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}
