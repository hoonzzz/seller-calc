import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const postData = getPostData(params.slug);
  if (!postData) return { title: 'Post Not Found' };
  
  return {
    title: `${postData.title} | 셀러 꿀팁`,
    description: postData.excerpt,
  };
}

export default function Post({ params }: { params: { slug: string } }) {
  const postData = getPostData(params.slug);

  if (!postData) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <Link href="/tips" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#03C75A] transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-1" />
        목록으로 돌아가기
      </Link>
      
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        <header className="mb-10 border-b border-gray-100 pb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#03C75A] border border-emerald-200">
              {postData.date}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
              🤖 AI 활용 콘텐츠
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            {postData.title}
          </h1>

          {/* AI 투명성 가이드라인 준수 안내 박스 */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs md:text-sm text-amber-900 text-left flex items-start gap-2.5 leading-relaxed">
            <span className="text-base leading-none mt-0.5">ℹ️</span>
            <div>
              <strong className="font-semibold">생성형 AI 작성 콘텐츠 안내:</strong> 본 게시글은 최신 이커머스 트렌드 및 판매자 데이터를 바탕으로 생성형 AI를 활용하여 정보 제공 목적으로 작성되었습니다. 마켓별 정책 및 세법 변경에 따라 최신 정보와 차이가 있을 수 있으므로 실제 거래 및 세무 신고 시 반드시 공식 공지를 재확인하시기 바랍니다.
            </div>
          </div>
        </header>
        
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-[#03C75A] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
          <ReactMarkdown>{postData.content || ''}</ReactMarkdown>
        </div>
      </article>

      {/* 내부 링크 미끼용 계산기 유도 박스 */}
      <div className="mt-12 bg-blue-50 rounded-2xl p-6 text-center border border-blue-100">
        <h3 className="text-lg font-bold text-blue-900 mb-2">내 마진율은 과연 안전할까?</h3>
        <p className="text-blue-700 mb-4 text-sm">지금 바로 최신 마켓 수수료와 세금이 반영된 마진을 확인해보세요.</p>
        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
          무료로 마진 계산하기
        </Link>
      </div>
    </div>
  );
}
