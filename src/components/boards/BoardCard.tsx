import Link from 'next/link';
import { BoardCategory } from '@/types';
import { formatDate, getCategoryBadge } from '@/utils/boardUtils';

interface BoardCardProps {
  id: number;
  title: string;
  content: string;
  category: BoardCategory;
  createdAt: string;
  imageUrls?: string[];
}

export default function BoardCard({ id, title, content, category, createdAt, imageUrls }: BoardCardProps) {
  const badge = getCategoryBadge(category);

  return (
    <Link 
      href={`/boards/${id}`}
      className="block bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${badge.color}`}>
              {badge.text}
            </span>
            <span className="text-sm text-gray-500">{formatDate(createdAt)}</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1 truncate hover:text-blue-600 transition-colors">
            {title}
          </h2>
          {content && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {content}
            </p>
          )}
        </div>
        {imageUrls && imageUrls.length > 0 && (
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={imageUrls[0]} 
              alt="" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </Link>
  );
}
