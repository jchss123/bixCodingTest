import Logo from '@/components/Logo';

export default function BoardHeader() {
  return (
    <div className="relative flex flex-col items-center mb-6 py-8">
      {/* 로고 주변 커뮤니티 아이콘들 */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-2 left-8 text-5xl animate-float">💬</div>
        <div className="absolute top-4 right-12 text-4xl animate-float-delay-1">👥</div>
        <div className="absolute top-10 left-20 text-4xl animate-float-delay-2">📝</div>
        <div className="absolute top-8 right-24 text-5xl animate-float-delay-3">✉️</div>
        <div className="absolute bottom-4 left-16 text-4xl animate-float">💭</div>
        <div className="absolute bottom-6 right-16 text-4xl animate-float-delay-1">🗨️</div>
      </div>
      
      <div className="relative flex flex-col items-center">
        <Logo size={64} className="mb-1" />
        <span className="text-[10px] text-gray-400 tracking-wide">Community</span>
      </div>
    </div>
  );
}
