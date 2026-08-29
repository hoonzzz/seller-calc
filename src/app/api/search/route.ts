import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  // 30일 전 날짜 계산
  const endDateObj = new Date();
  const startDateObj = new Date();
  startDateObj.setDate(startDateObj.getDate() - 30);

  const endDate = endDateObj.toISOString().split("T")[0];
  const startDate = startDateObj.toISOString().split("T")[0];

  // API 키가 없으면 프론트엔드 테스트용으로 가짜(Dummy) 트렌드 데이터를 내려줍니다.
  if (!clientId || !clientSecret) {
    console.log("⚠️ 네이버 API 키가 없습니다. 더미 트렌드 데이터를 반환합니다.");
    
    // 가상의 30일 데이터 생성 (랜덤 패턴)
    const dummyData = Array.from({ length: 30 }).map((_, i) => {
      const d = new Date(startDateObj);
      d.setDate(d.getDate() + i);
      // 우상향하는 패턴에 약간의 노이즈 추가
      const baseRatio = (i / 30) * 80;
      const noise = Math.random() * 20;
      return {
        period: d.toISOString().split("T")[0],
        ratio: Math.min(100, Math.max(0, baseRatio + noise))
      };
    });

    return NextResponse.json({
      keyword: query,
      startDate,
      endDate,
      data: dummyData,
      shoppingData: {
        averagePrice: 15000 + Math.floor(Math.random() * 20000),
        minPrice: 9900 + Math.floor(Math.random() * 5000)
      }
    });
  }

  try {
    const api_url = "https://naverapihub.apigw.ntruss.com/search-trend/v1/search";
    
    const requestBody = {
      startDate: startDate,
      endDate: endDate,
      timeUnit: "date",
      keywordGroups: [
        {
          groupName: query,
          keywords: [query]
        }
      ]
    };

    // 1. 네이버 데이터랩 검색 트렌드 호출
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "X-NCP-APIGW-API-KEY-ID": clientId,
        "X-NCP-APIGW-API-KEY": clientSecret,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Naver API responded with status: ${response.status}`);
    }

    const result = await response.json();
    
    let trendData = [];
    if (result.results && result.results.length > 0) {
      trendData = result.results[0].data.map((item: { period: string; ratio: number }) => ({
        period: item.period,
        ratio: item.ratio
      }));
    }

    // 2. 네이버 쇼핑 검색 API 호출 (상위 10개 상품의 가격 통계)
    let shoppingData = null;
    const devClientId = process.env.NAVER_DEV_CLIENT_ID || clientId;
    const devClientSecret = process.env.NAVER_DEV_CLIENT_SECRET || clientSecret;
    
    try {
      const shopRes = await fetch(`https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(query)}&display=10`, {
        headers: {
          "X-Naver-Client-Id": devClientId,
          "X-Naver-Client-Secret": devClientSecret
        }
      });
      if (shopRes.ok) {
        const shopResult = await shopRes.json();
        if (shopResult.items && shopResult.items.length > 0) {
          let sum = 0;
          let count = 0;
          let min = Infinity;
          shopResult.items.forEach((item: any) => {
            const price = parseInt(item.lprice, 10);
            if (price > 0) {
              sum += price;
              count++;
              if (price < min) min = price;
            }
          });
          if (count > 0) {
            shoppingData = {
              averagePrice: Math.round(sum / count),
              minPrice: min
            };
          }
        }
      }
    } catch (e) {
      console.error("Shopping API Error:", e);
    }

    // 쇼핑 데이터를 못 가져왔을 경우 더미 데이터 폴백
    if (!shoppingData) {
      shoppingData = {
        averagePrice: 15000 + Math.floor(Math.random() * 20000),
        minPrice: 9900 + Math.floor(Math.random() * 5000)
      };
    }

    // ★ 핵심 캐싱 로직: 응답에 Cache-Control 헤더 추가 (24시간 캐시)
    return NextResponse.json(
      {
        keyword: query,
        startDate,
        endDate,
        data: trendData,
        shoppingData
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200"
        }
      }
    );
  } catch (error) {
    console.error("Naver Datalab API Error:", error);
    return NextResponse.json({ error: "Failed to fetch trend data" }, { status: 500 });
  }
}
