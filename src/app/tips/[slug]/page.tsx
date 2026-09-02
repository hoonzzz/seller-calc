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
          <p className="text-sm font-semibold text-[#03C75A] tracking-wide uppercase mb-2">
            {postData.date}
          </p>
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {postData.title}
          </h1>
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
