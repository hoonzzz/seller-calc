"use client";

import { useState } from "react";
import { PackageSearch, ExternalLink, Loader2 } from "lucide-react";

interface SupplyCategory {
  id: string;
  name: string;
  keyword: string;
  desc: string;
}

const CATEGORIES: SupplyCategory[] = [
  {
    id: "box-small",
    name: "📦 소형 택배박스 (A1·1~2호)",
    keyword: "택배박스 A1 소형 대량",
    desc: "화장품·스마트폰 액세서리·소형 잡화 출고용 (택배 최저운임 구간)",
  },
  {
    id: "box-mid",
    name: "📦 중형 표준박스 (3~4호)",
    keyword: "택배박스 3호 묶음",
    desc: "생활용품·주방잡화·소형가전 등 가장 범용적으로 쓰이는 표준 규격",
  },
  {
    id: "mailer",
    name: "🫧 안전봉투 & 폴리백",
    keyword: "택배 안전봉투 대량",
    desc: "박스 조립 시간을 없애고 부피무게 할증을 원천 차단하는 초경량 포장재",
  },
  {
    id: "tape-wrap",
    name: "🔇 무소음 테이프 & 에어캡",
    keyword: "무소음 박스테이프 박스단위",
    desc: "야간 홈오피스 작업 소음 방지 및 파손 클레임 방어용 완충재",
  },
  {
    id: "label-printer",
    name: "🖨️ 감열 송장·바코드 프린터",
    keyword: "감열식 택배 송장 프린터",
    desc: "잉크·토너 유지비 0원, 택배 송장 및 로켓그로스 바코드 고속 출력",
  },
  {
    id: "studio-rack",
    name: "📸 촬영 포토박스 & 경량랙",
    keyword: "제품 촬영 미니 스튜디오 조명",
    desc: "상세페이지 실사 촬영 부스 및 사입 재고 수직 보관용 앵글 선반",
  },
];

interface ProductItem {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  isRocket: boolean;
}

export default function SuppliesLiveExplorer() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchUrl, setSearchUrl] = useState("https://link.coupang.com/a/gBfL9ZBm7o");

  const activeCategory = CATEGORIES.find((c) => c.id === selectedId) || null;

  const handleSelect = async (cat: SupplyCategory) => {
    setSelectedId(cat.id);
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/coupang/search?keyword=${encodeURIComponent(cat.keyword)}&limit=6`
      );
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
        if (data.searchUrl) setSearchUrl(data.searchUrl);
      }
    } catch (error) {
      console.error("부자재 카테고리 시세 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border-2 border-amber-200 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
          <PackageSearch className="w-3.5 h-3.5" /> 실시간 대량 부자재·장비 시세 조회기
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
          품목별 로켓배송 대량 묶음 시세 확인하기
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          필요한 부자재 카테고리를 선택하면 현재 구매 가능한 대량 묶음 상품과 실시간 가격을 즉시 불러옵니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelect(cat)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedId === cat.id
                ? "bg-amber-50 border-amber-400 text-amber-950 shadow-xs"
                : "bg-gray-50/70 border-gray-200 hover:bg-white text-gray-800"
            }`}
          >
            <div className="text-xs sm:text-sm font-extrabold">{cat.name}</div>
            <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{cat.desc}</div>
          </button>
        ))}
      </div>

      {activeCategory && (
        <div className="pt-4 border-t border-gray-100 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs sm:text-sm font-extrabold text-gray-900">
              {activeCategory.name} 실시간 조회 결과
            </span>
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              쿠팡에서 전체 규격 더보기 <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {isLoading ? (
            <div className="py-8 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" /> 실시간 부자재 가격을 불러오는 중입니다...
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((item, idx) => (
                <a
                  key={item.productId || idx}
                  href={item.productUrl || searchUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-amber-400 bg-white transition-all group shadow-2xs"
                >
                  {item.productImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      loading="lazy"
                      className="w-16 h-16 rounded-lg object-cover border border-gray-100 shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      {item.isRocket && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                          🚀 로켓배송
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-gray-800 line-clamp-2 group-hover:text-amber-800">
                      {item.productName}
                    </p>
                    <div className="mt-1 text-sm font-black text-rose-600">
                      {item.productPrice.toLocaleString()}원
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-600 shrink-0" />
                </a>
              ))}
            </div>
          ) : (
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
            >
              {activeCategory.name} 쿠팡 로켓배송 최저가 바로가기 <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <p className="text-[10px] text-gray-400 text-right">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </div>
      )}
    </section>
  );
}
