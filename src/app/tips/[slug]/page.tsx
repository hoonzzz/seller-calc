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
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
              셀러마진 실무 연구소
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {postData.title}
          </h1>
        </header>
        
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-[#03C75A] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
          <ReactMarkdown>{postData.content || ''}</ReactMarkdown>
        </div>

        {/* 콘텐츠 참고 안내 (하단) */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs md:text-sm text-gray-600 flex items-start gap-2.5 leading-relaxed">
            <span className="text-base leading-none mt-0.5">📌</span>
            <div>
              <strong className="font-semibold text-gray-800">실무 활용 참고 안내:</strong> 본 가이드는 온라인 커머스 셀러들의 합리적인 의사결정을 돕기 위해 작성되었습니다. 오픈마켓 플랫폼별 수수료 정책 및 세법 개정에 따라 일부 기준이 변동될 수 있으므로, 실제 정산 및 세무 신고 시에는 각 마켓의 최신 공지사항을 함께 확인하시기 바랍니다.
            </div>
          </div>
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
