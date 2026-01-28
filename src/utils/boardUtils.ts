import { BoardCategory } from '@/types';

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${hh}:${mm}`;
};

export const getCategoryBadge = (cat: BoardCategory) => {
  const badges = {
    NOTICE: { text: '공지', color: 'bg-red-100 text-red-700' },
    FREE: { text: '자유', color: 'bg-green-100 text-green-700' },
    QNA: { text: 'Q&A', color: 'bg-blue-100 text-blue-700' },
    ETC: { text: '기타', color: 'bg-purple-100 text-purple-700' }
  };
  return badges[cat] || { text: cat, color: 'bg-gray-100 text-gray-700' };
};
