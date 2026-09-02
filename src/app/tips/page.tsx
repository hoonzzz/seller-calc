import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: '셀러 꿀팁 | 셀러마진 계산기',
  description: '스마트스토어, 쿠팡 등 오픈마켓 초보 셀러를 위한 마진 계산 꿀팁과 세금 절세 노하우를 제공합니다.',
};

export default function TipsPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          초보 셀러 필수 꿀팁 💡
        </h1>
        <p className="text-lg text-gray-500">
          마진율 계산부터 세금 신고까지, 성공적인 쇼핑몰 창업을 위한 노하우
        </p>
      </div>

      <div className="grid gap-6">
        {allPostsData.map(({ slug, date, title, excerpt }) => (
          <Link href={`/tips/${slug}`} key={slug}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#03C75A]/30 transition-all group">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-400 font-medium">{date}</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                      🤖 AI 콘텐츠
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#03C75A] transition-colors">
                    {title}
                  </h2>
                  <p className="text-gray-600 line-clamp-2 leading-relaxed text-sm">
                    {excerpt}
                  </p>
                </div>
                <div className="pt-2">
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#03C75A] transition-colors" />
                </div>
              </div>
            </div>
          </Link>
        ))}
        {allPostsData.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            아직 등록된 꿀팁이 없습니다.
          </div>
        )}
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#03C75A] hover:bg-[#03C75A]/90 transition-colors shadow-sm">
          마진 계산기 메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
