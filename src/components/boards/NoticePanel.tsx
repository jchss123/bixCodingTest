import Link from 'next/link';
import { formatDate } from '@/utils/boardUtils';

interface NoticePanelProps {
  notices: Array<{
    id: number;
    title: string;
    createdAt: string;
  }>;
}

export default function NoticePanel({ notices }: NoticePanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-6">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
          <span className="text-xl">📢</span>
          공지사항
        </h3>
      </div>
      <div className="p-4 space-y-3">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <Link
              key={notice.id}
              href={`/boards/${notice.id}`}
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 hover:border-red-200"
            >
              <h4 className="font-medium text-sm text-gray-900 truncate mb-1">
                {notice.title}
              </h4>
              <p className="text-xs text-gray-500">
                {formatDate(notice.createdAt)}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">
            등록된 공지사항이 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
