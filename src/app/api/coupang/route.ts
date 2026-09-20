import { NextRequest, NextResponse } from 'next/server';
import { getCoupangDeepLink } from '@/lib/coupang';

const FALLBACK_LINK = 'https://link.coupang.com/a/gBfL9ZBm7o';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword || !keyword.trim()) {
    return NextResponse.json({
      url: FALLBACK_LINK,
      isDeepLink: false,
    });
  }

  try {
    const deepLink = await getCoupangDeepLink(keyword.trim());

    if (deepLink) {
      return NextResponse.json({
        url: deepLink,
        isDeepLink: true,
      });
    }
  } catch (error) {
    console.error('[API /api/coupang Error]:', error);
  }

  // 키 미설정 또는 API 호출 실패 시 기본 파트너스 링크 반환
  return NextResponse.json({
    url: FALLBACK_LINK,
    isDeepLink: false,
  });
}
