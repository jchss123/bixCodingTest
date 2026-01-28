import { BoardCategory } from '@/types';
import Logo from '@/components/Logo';

interface WriteModalProps {
  open: boolean;
  form: {
    title: string;
    content: string;
    category: BoardCategory;
  };
  file: File | null;
  error: string;
  loading?: boolean;
  onFormChange: (form: { title: string; content: string; category: BoardCategory }) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function WriteModal({
  open,
  form,
  file,
  error,
  loading = false,
  onFormChange,
  onFileChange,
  onSubmit,
  onClose
}: WriteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <div className="flex flex-col items-center relative">
              {/* 로고 주변 커뮤니티 아이콘들 */}
              <div className="absolute inset-0 pointer-events-none opacity-50">
                <div className="absolute -top-2 -left-8 text-3xl animate-float">💬</div>
                <div className="absolute -top-1 -right-10 text-2xl animate-float-delay-1">👥</div>
                <div className="absolute top-4 -left-12 text-2xl animate-float-delay-2">📝</div>
                <div className="absolute top-6 -right-12 text-3xl animate-float-delay-3">✉️</div>
                <div className="absolute -bottom-1 -left-10 text-2xl animate-float">💭</div>
                <div className="absolute -bottom-2 -right-8 text-2xl animate-float-delay-1">🗨️</div>
              </div>
              <Logo size={48} className="mb-1" />
              <span className="text-[10px] text-gray-400 tracking-wide">Community</span>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={onClose}
                className="h-10 w-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center">글쓰기</h2>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
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
              onChange={(e) => onFormChange({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
            <select
              value={form.category}
              onChange={(e) => onFormChange({ ...form, category: e.target.value as BoardCategory })}
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
              onChange={(e) => onFormChange({ ...form, content: e.target.value })}
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
                onChange={(e) => onFileChange(e.target.files?.[0] || null)}
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
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium disabled:from-blue-400 disabled:to-blue-500 disabled:cursor-not-allowed"
            >
              {loading ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
