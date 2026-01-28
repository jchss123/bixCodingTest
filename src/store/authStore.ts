import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthResponse, User } from '@/types';

// Zustand를 사용한 전역 상태 관리
// JWT 토큰과 사용자 정보를 관리하여 인증 상태를 유지
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  username: string | null;
  name: string | null;
  setAuth: (data: AuthResponse & User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      username: null,
      name: null,
      setAuth: (data) => set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        username: data.username,
        name: data.name,
      }),
      logout: () => set({
        accessToken: null,
        refreshToken: null,
        username: null,
        name: null,
      }),
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);