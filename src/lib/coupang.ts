import crypto from 'crypto';

/**
 * 쿠팡 파트너스 HMAC-SHA256 서명 생성 함수
 * @param method HTTP 메서드 (GET, POST 등)
 * @param urlPath 도메인을 제외한 경로 (쿼리스트링 포함)
 * @param secretKey 쿠팡 파트너스 Secret Key
 * @param accessKey 쿠팡 파트너스 Access Key
 */
export function generateCoupangSignature(
  method: string,
  urlPath: string,
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

  const message = `${datetime}${method}${urlPath}`;
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('hex');

  const authorization = `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;

  return { authorization, datetime };
}

/**
 * 검색어 기반 쿠팡 파트너스 딥링크 생성 함수
 * @param keyword 검색할 상품명
 */
export async function getCoupangDeepLink(keyword: string): Promise<string | null> {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;

  // 키가 없으면 null 반환 (기본 링크로 fallback 처리)
  if (!accessKey || !secretKey) {
    return null;
  }

  try {
    const targetUrl = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(keyword)}`;
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
        coupangUrls: [targetUrl],
      }),
      // 요청 캐싱 방지
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[Coupang API Error] HTTP ${response.status}: ${await response.text()}`);
      return null;
    }

    const data = await response.json();
    if (data.rCode === '0' && data.data?.[0]?.shortenUrl) {
      return data.data[0].shortenUrl;
    }

    console.warn('[Coupang API Warn] 딥링크 생성 응답 실패:', data);
    return null;
  } catch (error) {
    console.error('[Coupang API Exception] 딥링크 호출 중 에러 발생:', error);
    return null;
  }
}
