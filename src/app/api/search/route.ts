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
      data: dummyData
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
    
    // 네이버 데이터랩 응답 파싱
    let trendData = [];
    if (result.results && result.results.length > 0) {
      trendData = result.results[0].data.map((item: { period: string; ratio: number }) => ({
        period: item.period,
        ratio: item.ratio
      }));
    }

    // ★ 핵심 캐싱 로직: 응답에 Cache-Control 헤더 추가 (24시간 캐시)
    return NextResponse.json(
      {
        keyword: query,
        startDate,
        endDate,
        data: trendData
      },
      {
        headers: {
          // s-maxage=86400 : Vercel CDN 엣지 서버에 24시간(86400초) 동안 데이터를 묶어둠
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200"
        }
      }
    );
  } catch (error) {
    console.error("Naver Datalab API Error:", error);
    return NextResponse.json({ error: "Failed to fetch trend data" }, { status: 500 });
  }
}
