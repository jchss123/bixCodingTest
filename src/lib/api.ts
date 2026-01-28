import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// Axios 인스턴스 생성
// BASE_URL을 설정하여 API 호출을 간편화
export const BASE_URL = 'https://front-mission.bigs.or.kr';

const api = axios.create({ baseURL: BASE_URL });

// 요청 인터셉터: JWT 토큰을 자동으로 헤더에 추가
// 인증이 필요한 API 호출 시 자동으로 Bearer 토큰을 포함
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 토큰 만료 시 리프레시 토큰으로 자동 재발급
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          // 리프레시 토큰으로 새 액세스 토큰 요청
          const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken: refreshToken
          });
          
          const newAccessToken = refreshResponse.data.accessToken;
          
          // 새 토큰 저장
          useAuthStore.getState().setAuth({
            accessToken: newAccessToken,
            refreshToken: refreshToken,
            username: useAuthStore.getState().username || '',
            name: useAuthStore.getState().name || ''
          });
          
          // 원래 요청에 새 토큰 설정 후 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // 리프레시 토큰도 만료되었으면 로그아웃
        console.error('Token refresh failed:', refreshError);
      }
    }
    
    // 리프레시 실패 또는 다른 에러면 로그아웃
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/?modal=signin';
    }
    
    return Promise.reject(error);
  }
);

export default api;