import { NextRequest, NextResponse } from 'next/server';
import {
  COUPANG_FALLBACK_LINK,
  getCoupangDeepLink,
  searchCoupangProducts,
} from '@/lib/coupang';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawKeyword = searchParams.get('keyword') || '';
  const rawLimit = Number(searchParams.get('limit') || '4');

  // 보안 및 API 보호: 검색어 길이 제한 및 공백 정리
  const keyword = rawKeyword.trim().slice(0, 60);
  const limit = Number.isFinite(rawLimit) ? Math.min(8, Math.max(1, Math.floor(rawLimit))) : 4;

  if (!keyword) {
    return NextResponse.json(
      { error: '검색어(keyword)가 필요합니다.', products: [], searchUrl: COUPANG_FALLBACK_LINK },
      { status: 400 }
    );
  }

  try {
    const [products, deepSearchUrl] = await Promise.all([
      searchCoupangProducts(keyword, limit),
      getCoupangDeepLink(keyword),
    ]);

    const searchUrl = deepSearchUrl || COUPANG_FALLBACK_LINK;

    // 상위 노출 상품들의 가격 및 로켓배송 점유율 통계 계산
    let summary = null;
    if (products.length > 0) {
      const prices = products.map((p) => p.productPrice);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
      const rocketCount = products.filter((p) => p.isRocket).length;
      const rocketRatio = Math.round((rocketCount / products.length) * 100);

      summary = {
        count: products.length,
        minPrice,
        avgPrice,
        maxPrice,
        rocketCount,
        rocketRatio,
      };
    }

    // 상품 데이터가 있을 때만 Vercel Edge CDN에 6시간 캐싱하여 쿠팡 API 호출 한도를 보호
    const headers: Record<string, string> =
      products.length > 0
        ? { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=43200' }
        : { 'Cache-Control': 'no-store' };

    return NextResponse.json(
      {
        keyword,
        products,
        summary,
        searchUrl,
      },
      { headers }
    );
  } catch (error) {
    console.error('[API /api/coupang/search 오류]:', error);
    return NextResponse.json(
      {
        keyword,
        products: [],
        summary: null,
        searchUrl: COUPANG_FALLBACK_LINK,
      },
      { status: 200 }
    );
  }
}
