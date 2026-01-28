// 타입 정의
// PRD에 따라 타입을 정의하여 타입 안정성을 높임
export type BoardCategory = 'NOTICE' | 'FREE' | 'QNA' | 'ETC';

export interface User {
  username: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface BoardDetail {
  id: number;
  title: string;
  content: string;
  boardCategory: BoardCategory;
  imageUrl?: string;
  createdAt: string;
}

export interface BoardListResponse {
  content: {
    id: number;
    title: string;
    category: BoardCategory;
    content: string;
    createdAt: string;
    imageUrls?: string[];
  }[];
  totalPages: number;
  totalElements: number;
}

export interface BoardCreateRequest {
  title: string;
  content: string;
  category: BoardCategory;
}

export interface BoardUpdateRequest extends BoardCreateRequest {}