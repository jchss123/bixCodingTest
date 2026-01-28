# BIGS 프론트엔드 채용 과제

이 프로젝트는 BIGS 프론트엔드 채용 과제를 기반으로 구현된 Next.js 애플리케이션입니다. 
제공된 백엔드 API([API 문서](https://documenter.getpostman.com/view/18478200/2sAY4vfh1u#intro))를 연동하여 게시판 기능을 제공합니다.

## 📋 목차
- [실행 방법](#실행-방법)
- [기술 스택](#기술-스택)
- [주요 기능](#주요-기능)
- [프로젝트 구조](#프로젝트-구조)
- [기능 구현 상세](#기능-구현-상세)

---

## 🚀 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 브라우저 접속
브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 4. 사용 흐름
1. 메인 페이지에서 **회원가입** 클릭
2. 이메일, 이름, 비밀번호 입력하여 회원가입
3. 회원가입 후 자동으로 로그인 화면으로 전환
4. 로그인하면 게시판 페이지(`/boards`)로 이동
5. 우측의 **글쓰기** 버튼으로 게시글 작성
6. 게시글 클릭 시 상세 페이지로 이동
7. 하단의 **수정/삭제** 버튼으로 게시글 관리

---

## 🛠 기술 스택

### Frontend
- **Next.js 16.1.4** - React 프레임워크 (App Router 사용)
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성 확보

### 상태 관리
- **Zustand** - 전역 상태 관리 (JWT 토큰, 사용자 정보)
- **Zustand Persist** - 로컬스토리지 자동 동기화

### HTTP 통신
- **Axios** - HTTP 클라이언트
- Axios Interceptor로 JWT 토큰 자동 헤더 추가
- 리프레시 토큰 자동 갱신 로직 구현

### 스타일링
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- 반응형 디자인 (`sm:`, `md:`, `lg:` 브레이크포인트)
- 커스텀 애니메이션 (floating icons)

---

## ✨ 주요 기능

### 1. 사용자 인증
- ✅ 회원가입 (이메일 형식 검증, 비밀번호 복잡도 검증)
- ✅ 로그인 (JWT 토큰 발급)
- ✅ 자동 로그인 (리프레시 토큰)
- ✅ 로그아웃
- ✅ 사용자 정보 표시 (사이드바에 아이디/이름 표시)

### 2. 게시글 관리
- ✅ 게시글 목록 조회 (페이지네이션)
- ✅ 카테고리별 필터링 (공지/자유/Q&A/기타)
- ✅ 게시글 작성 (이미지 첨부 가능)
- ✅ 게시글 상세 조회
- ✅ 게시글 수정
- ✅ 게시글 삭제

### 3. UI/UX
- ✅ 반응형 디자인 (모바일/태블릿/데스크톱)
- ✅ 로딩 스켈레톤 UI
- ✅ 에러 처리 및 사용자 피드백
- ✅ 애니메이션 효과 (floating icons)
- ✅ 사이드바 접기/펼치기
- ✅ 공지사항 사이드 패널

---

## 📁 프로젝트 구조

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 메인 페이지 (로그인/회원가입)
│   ├── layout.tsx                # 전역 레이아웃
│   ├── globals.css               # 전역 CSS (Tailwind + 커스텀 애니메이션)
│   └── boards/
│       ├── page.tsx              # 게시글 목록 페이지
│       ├── [id]/page.tsx         # 게시글 상세 페이지
│       └── edit/[id]/page.tsx    # 게시글 수정 페이지
│
├── components/                   # 재사용 컴포넌트
│   ├── Logo.tsx                  # 로고 컴포넌트
│   ├── Modal.tsx                 # 공통 모달
│   ├── Sidebar.tsx               # 사이드바 (사용자 정보, 네비게이션)
│   ├── auth/
│   │   ├── SigninForm.tsx        # 로그인 폼
│   │   └── SignupForm.tsx        # 회원가입 폼
│   └── boards/
│       ├── BoardCard.tsx         # 게시글 카드
│       ├── BoardHeader.tsx       # 게시판 헤더
│       ├── CategoryFilter.tsx    # 카테고리 필터
│       ├── NoticePanel.tsx       # 공지사항 패널
│       └── WriteModal.tsx        # 글쓰기 모달
│
├── lib/
│   └── api.ts                    # Axios 인스턴스 및 인터셉터
│
├── store/
│   └── authStore.ts              # Zustand 인증 스토어
│
├── types/
│   └── index.ts                  # TypeScript 타입 정의
│
└── utils/
    └── boardUtils.ts             # 게시판 유틸 함수
```

---

## 🔍 기능 구현 상세

### 1. 회원가입 및 로그인

#### 구현 위치
- `src/components/auth/SignupForm.tsx`
- `src/components/auth/SigninForm.tsx`

#### 구현 내용
```typescript
// 회원가입 유효성 검증
- 이메일 형식 검증: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- 비밀번호 규칙: 8자 이상, 영문+숫자+특수문자(!%*#?&) 조합
- 비밀번호 확인 일치 검증

// API 호출
POST /auth/signup
Body: { username, name, password, confirmPassword }

// 로그인
POST /auth/signin
Body: { username, password }
Response: { accessToken, refreshToken, name }
```

#### 상태 관리
```typescript
// Zustand 스토어 (src/store/authStore.ts)
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  username: string | null;
  name: string | null;
  setAuth: (data) => void;
  logout: () => void;
}

// localStorage에 자동 저장 (persist 미들웨어)
```

---

### 2. JWT 토큰 관리

#### 구현 위치
- `src/lib/api.ts`

#### 구현 내용
```typescript
// 요청 인터셉터: 모든 요청에 JWT 토큰 자동 추가
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 에러 시 리프레시 토큰으로 자동 재발급
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 리프레시 토큰으로 새 액세스 토큰 요청
      const refreshToken = useAuthStore.getState().refreshToken;
      const newToken = await refreshAccessToken(refreshToken);
      
      // 실패한 요청 재시도
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

---

### 3. 게시글 목록 조회 및 페이지네이션

#### 구현 위치
- `src/app/boards/page.tsx`

#### 구현 내용
```typescript
// API 호출
GET /boards?page=0&size=1000

// 클라이언트 사이드 필터링 및 페이징
const fetchBoards = async () => {
  const res = await api.get(`/boards?page=0&size=1000`);
  const allData = res.data.content;
  
  // 카테고리 필터링
  let filtered = category 
    ? allData.filter(board => board.category === category)
    : allData;
  
  // 페이징 (10개씩)
  const start = page * 10;
  const pagedContent = filtered.slice(start, start + 10);
  
  setData({
    content: pagedContent,
    totalPages: Math.ceil(filtered.length / 10),
    totalElements: filtered.length
  });
};
```

#### UI 구성
- 로딩 스켈레톤 애니메이션
- 게시글 카드 (제목, 내용 미리보기, 카테고리 배지)
- 페이지네이션 버튼 (이전/다음)
- 공지사항 사이드 패널 (최신 5개)

---

### 4. 게시글 작성

#### 구현 위치
- `src/components/boards/WriteModal.tsx`
- `src/app/boards/page.tsx`

#### 구현 내용
```typescript
// API 호출 (multipart/form-data)
POST /boards
Content-Type: multipart/form-data

// FormData 구성
const formData = new FormData();
const requestData = { title, content, category };
const blob = new Blob([JSON.stringify(requestData)], {
  type: 'application/json'
});
formData.append('request', blob);
formData.append('file', imageFile); // 이미지 첨부 (선택)
```

#### UI 구성
- 모달 형태의 글쓰기 폼
- 제목, 내용, 카테고리 선택
- 이미지 파일 첨부
- 로고 주변 애니메이션 아이콘

---

### 5. 게시글 수정 및 삭제

#### 수정 구현 위치
- `src/app/boards/edit/[id]/page.tsx`

#### 수정 구현 내용
```typescript
// 기존 데이터 로드
GET /boards/{id}

// 수정 API 호출
PATCH /boards/{id}
Content-Type: multipart/form-data
Body: { request: JSON(title, content, category), file?: File }
```

#### 삭제 구현 위치
- `src/app/boards/[id]/page.tsx`

#### 삭제 구현 내용
```typescript
// 삭제 API 호출
DELETE /boards/{id}

// 삭제 후 목록 페이지로 이동
router.push('/boards');
```

---

### 6. 반응형 디자인

#### 구현 방식
```typescript
// Tailwind CSS 브레이크포인트 사용
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* 모바일: 1열, 태블릿 이상: 3열 */}
</div>

<div className="flex flex-col sm:flex-row gap-3">
  {/* 모바일: 세로, 태블릿 이상: 가로 */}
</div>

// 사이드바 접기/펼치기
<main className={`transition-all ${collapsed ? 'ml-20' : 'ml-64'}`}>
  {/* 사이드바 너비에 따라 메인 영역 조정 */}
</main>
```

---

### 7. 커스텀 애니메이션

#### 구현 위치
- `src/app/globals.css`

#### 구현 내용
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delay-1 {
  animation: float-delay-1 7s ease-in-out infinite 1s;
}
```

---

## 🎯 주요 구현 포인트

### 1. 타입 안정성
- TypeScript로 모든 데이터 타입 정의
- API 응답 타입, 컴포넌트 Props 타입 명시

### 2. 에러 처리
- try-catch로 모든 API 호출 래핑
- 사용자 친화적인 에러 메시지 표시
- 401 에러 시 자동 로그아웃 및 로그인 페이지 이동

### 3. 성능 최적화
- 로딩 스켈레톤으로 UX 개선
- 이미지 lazy loading
- 컴포넌트 재사용으로 번들 크기 최소화

### 4. 코드 품질
- 컴포넌트 단위 분리 (관심사 분리)
- 유틸 함수 분리 (`boardUtils.ts`)
- 일관된 코드 스타일

---

## 📝 API 연동 정보

**Base URL**: `https://front-mission.bigs.or.kr`

**사용된 엔드포인트**:
- `POST /auth/signup` - 회원가입
- `POST /auth/signin` - 로그인
- `POST /auth/refresh` - 토큰 갱신
- `GET /boards` - 게시글 목록
- `GET /boards/{id}` - 게시글 상세
- `POST /boards` - 게시글 작성
- `PATCH /boards/{id}` - 게시글 수정
- `DELETE /boards/{id}` - 게시글 삭제

---

## 💡 참고사항

- 사용자 조회 API가 없어 로그인 시 받은 이름을 로컬스토리지에 저장하여 관리
- 페이지네이션은 전체 데이터를 가져와 클라이언트에서 처리 (서버 사이드 페이징 미지원 대응)
- 이미지 업로드 시 `multipart/form-data` 형식으로 전송
- 모든 인증이 필요한 페이지는 로그인 체크 후 미로그인 시 메인 페이지로 리다이렉트




   