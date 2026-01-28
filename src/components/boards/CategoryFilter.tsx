import { BoardCategory } from '@/types';
import { getCategoryBadge } from '@/utils/boardUtils';

interface CategoryFilterProps {
  categories: BoardCategory[];
  selectedCategory: BoardCategory | '';
  onSelect: (category: BoardCategory | '') => void;
}

export default function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onSelect('')}
        className={`px-4 py-2 rounded-full font-medium transition-all ${
          selectedCategory === '' 
            ? 'bg-gray-900 text-white shadow-md' 
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        }`}
      >
        전체
      </button>
      {categories.map((cat) => {
        const badge = getCategoryBadge(cat);
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === cat 
                ? 'bg-gray-900 text-white shadow-md' 
                : `bg-white hover:bg-gray-50 border border-gray-200 ${badge.color.split(' ')[1]}`
            }`}
          >
            {badge.text}
          </button>
        );
      })}
    </div>
  );
}
