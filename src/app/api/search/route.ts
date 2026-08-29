import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  // API 키가 없으면 프론트엔드 테스트용으로 가짜(Dummy) 데이터를 내려줍니다.
  if (!clientId || !clientSecret) {
    console.log("⚠️ 네이버 API 키가 없습니다. 더미 데이터를 반환합니다.");
    return NextResponse.json({
      items: [
        {
          title: `<b>${query}</b> (인기상품)`,
          link: "https://shopping.naver.com",
          image: "https://via.placeholder.com/150?text=Product",
          lprice: "24900",
          hprice: "",
          mallName: "스마트스토어",
          productId: "dummy-1"
        },
        {
          title: `[로켓] <b>${query}</b> 가성비 끝판왕`,
          link: "https://shopping.naver.com",
          image: "https://via.placeholder.com/150?text=Product",
          lprice: "18900",
          hprice: "",
          mallName: "쿠팡",
          productId: "dummy-2"
        },
        {
          title: `도매 <b>${query}</b> 대량구매`,
          link: "https://shopping.naver.com",
          image: "https://via.placeholder.com/150?text=Product",
          lprice: "12500",
          hprice: "",
          mallName: "도매꾹",
          productId: "dummy-3"
        }
      ]
    });
  }

  try {
    const api_url = `https://naverapihub.apigw.ntruss.com/search/v1/shop?query=${encodeURIComponent(query)}&display=10`;
    
    const response = await fetch(api_url, {
      method: "GET",
      headers: {
        "X-NCP-APIGW-API-KEY-ID": clientId,
        "X-NCP-APIGW-API-KEY": clientSecret,
      },
    });

    if (!response.ok) {
      throw new Error(`Naver API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Naver Search API Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
