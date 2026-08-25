const SITE_URL = "https://seller-calc-sable.vercel.app/";

interface Product {
  name: string;
  wholesalePrice: number;
  retailPrice: number;
  shippingFee: number; // 고객 부담 배송비
}

const products: Product[] = [
  { name: "우드 상판 캠핑 폴딩박스", wholesalePrice: 9500, retailPrice: 23900, shippingFee: 3000 },
  { name: "차량용 소형 무선 청소기", wholesalePrice: 12000, retailPrice: 29800, shippingFee: 3000 },
  { name: "대용량 스텐 텀블러 (900ml)", wholesalePrice: 5500, retailPrice: 16900, shippingFee: 3000 },
  { name: "접이식 휴대용 노트북 거치대", wholesalePrice: 4200, retailPrice: 13500, shippingFee: 3000 },
  { name: "가을용 경량 바람막이 자켓", wholesalePrice: 13500, retailPrice: 32000, shippingFee: 3000 },
  { name: "캠핑용 감성 랜턴 조명", wholesalePrice: 8000, retailPrice: 21900, shippingFee: 3000 },
  { name: "홈트레이닝 요가매트 (두꺼운형)", wholesalePrice: 6500, retailPrice: 18900, shippingFee: 3000 }
];

const templates = [
  (p: Product, margin: number, marginRate: number) => 
`도매꾹 보다가 마진율 미친 아이템 발견함 ㄷㄷ
'${p.name}' 이거 원가가 ${p.wholesalePrice.toLocaleString()}원인데 네이버에선 ${p.retailPrice.toLocaleString()}원에 팔리네요?

셀러마진 계산기로 진짜 순수익 얼마 남는지 돌려봤습니다.

🛒 판매가: ${p.retailPrice.toLocaleString()}원
📦 매입가: ${p.wholesalePrice.toLocaleString()}원
✅ 수수료 & 부가세 싹 다 떼고 나면...

✨ 찐 순수익: ${margin.toLocaleString()}원 (마진율 ${marginRate}%)

이거 하루에 10개만 팔아도 한달 부수입이 얼마야... 소싱하실 분들 눈대중으로 계산하다 적자 보지 마시고 무조건 마진율 계산기부터 돌려보세요!
👉 ${SITE_URL}`,

  (p: Product, margin: number, marginRate: number) =>
`스마트스토어 초보 셀러들이 제일 많이 하는 실수: 부가세 계산 안 함 💸

요즘 잘 팔리는 '${p.name}' 
도매가 ${p.wholesalePrice.toLocaleString()}원에 떼와서 ${p.retailPrice.toLocaleString()}원에 팔면 얼마나 남을까요?

수수료랑 세금까지 다 계산해 주는 사이트로 팩트체크 해봤습니다.
결과는 1개 팔 때마다 순수익 ${margin.toLocaleString()}원! (마진율 ${marginRate}%)

지금 팔고 있는 내 상품 진짜 순수익 얼만지 당장 돌려보세요. 무료입니다.
👉 ${SITE_URL}`,

  (p: Product, margin: number, marginRate: number) =>
`엑셀로 수수료 세금 계산하느라 빡쳐서 만든 계산기 ㅋㅋㅋ

예를 들어 '${p.name}' 소싱한다고 쳐봅시다.
판매가 ${p.retailPrice.toLocaleString()}원 - 매입가 ${p.wholesalePrice.toLocaleString()}원 = 순수익? 
절대 아닙니다. 

여기에 플랫폼 수수료 떼고, 종소세 부가세 떼야 진짜 내 돈이죠.
계산기 돌려보니 이 상품 찐 마진은 ${margin.toLocaleString()}원 (${marginRate}%) 나옵니다.

수수료 세금 알아서 싹 다 계산해 주니까 마진 안 남는 헛고생 그만하시고 1초 만에 확인하세요!
👉 ${SITE_URL}`
];

function calculateMargin(product: Product) {
  const platformFeeRate = 0.05; // 5% 가정 (스마트스토어 평균)
  const platformFee = Math.round(product.retailPrice * platformFeeRate);
  
  // 부가세: (매출 - 매입)의 10% 가정 (단순화)
  const vat = Math.round((product.retailPrice - product.wholesalePrice) * 0.1);
  
  const netMargin = product.retailPrice - product.wholesalePrice - platformFee - vat;
  const marginRate = ((netMargin / product.retailPrice) * 100).toFixed(1);
  
  return { margin: netMargin, marginRate };
}

async function postToThreads(text: string) {
  const USER_ID = process.env.THREADS_USER_ID;
  const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN;

  if (!USER_ID || !ACCESS_TOKEN) {
    console.log("⚠️ THREADS_USER_ID 또는 THREADS_ACCESS_TOKEN이 없습니다.");
    console.log("======== 생성된 포스트 미리보기 ========\n");
    console.log(text);
    console.log("\n========================================");
    return;
  }

  try {
    // 1. 미디어 컨테이너 생성 (텍스트)
    console.log("Threads 미디어 컨테이너 생성 중...");
    const createUrl = `https://graph.threads.net/v1.0/${USER_ID}/threads?media_type=TEXT&text=${encodeURIComponent(text)}&access_token=${ACCESS_TOKEN}`;
    const createRes = await fetch(createUrl, { method: 'POST' });
    const createData = await createRes.json();

    if (createData.error) {
      throw new Error(`컨테이너 생성 실패: ${JSON.stringify(createData.error)}`);
    }

    const containerId = createData.id;
    console.log(`컨테이너 생성 성공! ID: ${containerId}`);

    // 2. 발행
    console.log("Threads 게시물 발행 중...");
    const publishUrl = `https://graph.threads.net/v1.0/${USER_ID}/threads_publish?creation_id=${containerId}&access_token=${ACCESS_TOKEN}`;
    const publishRes = await fetch(publishUrl, { method: 'POST' });
    const publishData = await publishRes.json();

    if (publishData.error) {
      throw new Error(`게시물 발행 실패: ${JSON.stringify(publishData.error)}`);
    }

    console.log(`🎉 스레드 자동 포스팅 성공! Post ID: ${publishData.id}`);
  } catch (error) {
    console.error("❌ 스레드 포스팅 중 에러 발생:", error);
  }
}

async function main() {
  // 랜덤 상품 선택
  const randomProduct = products[Math.floor(Math.random() * products.length)];
  
  // 랜덤 템플릿 선택
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  // 마진 계산
  const { margin, marginRate } = calculateMargin(randomProduct);
  
  // 최종 텍스트 생성
  const postText = randomTemplate(randomProduct, margin, parseFloat(marginRate));
  
  // API 전송
  await postToThreads(postText);
}

main();
