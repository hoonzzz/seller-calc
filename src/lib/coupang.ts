import crypto from 'crypto';

export const COUPANG_FALLBACK_LINK = 'https://link.coupang.com/a/gBfL9ZBm7o';

export interface CoupangProduct {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  isRocket: boolean;
  isFreeShipping: boolean;
  categoryName?: string;
  rank: number;
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// 쿠팡 API 호출 한도(Rate Limit) 보호를 위한 6시간 서버 메모리 캐시
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 500;
const searchCache = new Map<string, CacheEntry<CoupangProduct[]>>();
const deepLinkCache = new Map<string, CacheEntry<string>>();

/**
 * 쿠팡 파트너스 HMAC-SHA256 서명 생성 함수
 * 주의: 쿠팡 오픈 API 규격상 쿼리스트링이 있을 때 물음표(?) 기호는 서명 메시지에서 제외되어야 합니다.
 * Message = datetime + method + path + query (물음표 제외)
 */
export function generateCoupangSignature(
  method: string,
  urlWithQuery: string,
  secretKey: string,
  accessKey: string
) {
  // 쿠팡 규격: YYMMDD'T'HHMMSS'Z' (UTC 기준)
  const now = new Date();
  const year = String(now.getUTCFullYear()).slice(-2);
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  const datetime = `${year}${month}${day}T${hours}${minutes}${seconds}Z`;

  // '?' 기준으로 경로(path)와 쿼리(query)를 분리하여 물음표 제거
  const [path, query = ''] = urlWithQuery.split('?');
  const message = `${datetime}${method}${path}${query}`;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('hex');

  const authorization = `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;

  return { authorization, datetime };
}

/**
 * 일반 쿠팡 URL 배열을 파트너스 수익 트래킹 단축 URL로 일괄 변환하는 함수
 */
export async function convertToCoupangDeepLinks(targetUrls: string[]): Promise<Record<string, string>> {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;

  if (!accessKey || !secretKey || targetUrls.length === 0) {
    return {};
  }

  try {
    const method = 'POST';
    const path = '/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink';
    const { authorization } = generateCoupangSignature(method, path, secretKey, accessKey);

    const response = await fetch(`https://api-gateway.coupang.com${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: authorization,
      },
      body: JSON.stringify({
        coupangUrls: targetUrls,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[쿠팡 딥링크 API 오류] HTTP ${response.status}: ${await response.text()}`);
      return {};
    }

    const data = await response.json();
    const resultMap: Record<string, string> = {};

    if (data.rCode === '0' && Array.isArray(data.data)) {
      for (const item of data.data) {
        if (item.originalUrl && item.shortenUrl) {
          resultMap[item.originalUrl] = item.shortenUrl;
        }
      }
    }

    return resultMap;
  } catch (error) {
    console.error('[쿠팡 딥링크 API 예외] 딥링크 변환 중 오류 발생:', error);
    return {};
  }
}

/**
 * 검색어 기반 쿠팡 검색 결과 페이지 파트너스 딥링크 생성 함수
 */
export async function getCoupangDeepLink(keyword: string): Promise<string | null> {
  const trimmed = keyword.trim();
  if (!trimmed) return null;

  const cached = deepLinkCache.get(trimmed);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const targetUrl = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(trimmed)}`;
  const converted = await convertToCoupangDeepLinks([targetUrl]);
  const shortenUrl = converted[targetUrl] || null;

  if (shortenUrl) {
    if (deepLinkCache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = deepLinkCache.keys().next().value;
      if (oldestKey) deepLinkCache.delete(oldestKey);
    }
    deepLinkCache.set(trimmed, {
      data: shortenUrl,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
  }

  return shortenUrl;
}

/**
 * 쿠팡 파트너스 상품 검색 API 호출 함수 (6시간 메모리 캐싱 포함)
 * @param keyword 검색할 키워드
 * @param limit 조회할 상품 수 (1 ~ 10)
 */
export async function searchCoupangProducts(
  keyword: string,
  limit: number = 4
): Promise<CoupangProduct[]> {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;

  const normalizedKeyword = keyword.trim();
  const safeLimit = Math.min(10, Math.max(1, Math.floor(limit)));

  if (!normalizedKeyword || !accessKey || !secretKey) {
    return [];
  }

  const cacheKey = `${normalizedKeyword.toLowerCase()}::${safeLimit}`;
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  try {
    const method = 'GET';
    const basePath = '/v2/providers/affiliate_open_api/apis/openapi/v1/products/search';
    const queryString = `keyword=${encodeURIComponent(normalizedKeyword)}&limit=${safeLimit}`;
    const requestUri = `${basePath}?${queryString}`;

    const { authorization } = generateCoupangSignature(method, requestUri, secretKey, accessKey);

    const response = await fetch(`https://api-gateway.coupang.com${requestUri}`, {
      method,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: authorization,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[쿠팡 상품검색 API 오류] HTTP ${response.status}: ${await response.text()}`);
      return [];
    }

    const json = await response.json();
    const rawList = json?.data?.productData;

    if (json?.rCode !== '0' || !Array.isArray(rawList)) {
      console.warn('[쿠팡 상품검색 API 경고] 예상치 못한 응답 구조:', json?.rMessage || json);
      return [];
    }

    const products: CoupangProduct[] = rawList
      .filter((item: Record<string, unknown>) => item && Number(item.productPrice) > 0)
      .map((item: Record<string, unknown>, idx: number) => ({
        productId: Number(item.productId || idx),
        productName: String(item.productName || ''),
        productPrice: Number(item.productPrice || 0),
        productImage: String(item.productImage || ''),
        productUrl: String(item.productUrl || ''),
        isRocket: Boolean(item.isRocket),
        isFreeShipping: Boolean(item.isFreeShipping),
        categoryName: item.categoryName ? String(item.categoryName) : undefined,
        rank: Number(item.rank || idx + 1),
      }));

    // 혹시라도 트래킹 도메인(link.coupang.com)이 아닌 원본 URL이 내려온 항목이 있다면 일괄 딥링크 변환
    const rawUrlsToConvert = products
      .map((p) => p.productUrl)
      .filter((u) => u.startsWith('https://www.coupang.com'));

    if (rawUrlsToConvert.length > 0) {
      const convertedMap = await convertToCoupangDeepLinks(rawUrlsToConvert);
      for (const product of products) {
        if (convertedMap[product.productUrl]) {
          product.productUrl = convertedMap[product.productUrl];
        }
      }
    }

    if (products.length > 0) {
      if (searchCache.size >= MAX_CACHE_ENTRIES) {
        const oldestKey = searchCache.keys().next().value;
        if (oldestKey) searchCache.delete(oldestKey);
      }
      searchCache.set(cacheKey, {
        data: products,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
    }

    return products;
  } catch (error) {
    console.error('[쿠팡 상품검색 API 예외] 검색 요청 중 오류 발생:', error);
    return [];
  }
}
