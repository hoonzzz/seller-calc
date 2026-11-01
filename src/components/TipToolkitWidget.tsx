"use client";

import { useState } from "react";
import { Wrench, ExternalLink, Loader2 } from "lucide-react";

interface ToolkitConfig {
  title: string;
  reason: string;
  keyword: string;
}

const SLUG_TOOLKIT_MAP: Record<string, ToolkitConfig> = {
  "coupang-rocket-growth-guide": {
    title: "로켓그로스 입고용 감열 바코드 라벨 프린터 & 라벨지",
    reason: "로켓그로스 물류센터 입고 시 상품별 전용 바코드 부착이 필수입니다. 잉크값이 들지 않는 감열식 라벨 프린터를 구비하면 외주 라벨 작업비를 전액 아낄 수 있습니다.",
    keyword: "감열 바코드 라벨 프린터",
  },
  "packaging-logistics-3pl-guide": {
    title: "자가 출고 원가 절감용 대량 택배박스 & 완충 안전봉투",
    reason: "3PL 전환 전 월 1,000건 미만 구간에서는 규격 택배박스와 안전봉투를 대량 묶음으로 매입해 건당 포장비를 80원 이하로 낮추는 것이 핵심입니다.",
    keyword: "택배박스 대량 묶음",
  },
  "detail-page-conversion-guide": {
    title: "상세페이지 전환율 높이는 홈스튜디오 미니 포토박스 & 조명",
    reason: "도매처 원본 이미지를 그대로 쓰면 아이템위너에 묶이거나 전환율이 떨어집니다. 소형 LED 포토박스로 직접 찍은 실사 3장만 추가해도 구매전환율이 크게 상승합니다.",
    keyword: "제품 촬영 미니 스튜디오 조명",
  },
  "return-exchange-cs-management": {
    title: "악성 반품·파손 분쟁 방어용 포장대 촬영 웹캠 & 거치대",
    reason: "출고 포장 과정을 상단 웹캠으로 녹화해 두면 오배송 클레임이나 쿠팡 반품 손실보상 신청 시 100% 승소할 수 있는 결정적 증빙 자료가 됩니다.",
    keyword: "웹캠 수직 촬영 거치대",
  },
  "overseas-purchasing-customs-guide": {
    title: "해외직구·사입 샘플 실측 검수용 디지털 택배 전자저울",
    reason: "배대지 부피무게·실측무게 요금 오류를 막고 택배 구간 요금을 정확히 산출하려면 정밀 전자저울과 줄자를 통한 샘플 실측이 필수입니다.",
    keyword: "택배 디지털 전자저울",
  },
  "consignment-vs-wholesale-sourcing": {
    title: "소량 사입 전환 셀러 필수 무볼트 경량랙 재고 선반",
    reason: "위탁에서 사입으로 넘어갈 때 가정이나 소형 사무실 공간을 수직으로 활용하는 무볼트 경량랙을 설치하면 선입선출과 재고 파손 방지가 훨씬 수월해집니다.",
    keyword: "무볼트 경량랙 진열대",
  },
  "income-tax-saving-tips": {
    title: "종소세 필요경비 & 부가세 환급 1순위 업무용 노트북",
    reason: "사업 전용 카드로 구매한 업무용 노트북과 PC 장비는 부가세 10% 환급(일반과세자)과 종합소득세 경비 산입을 동시에 받을 수 있는 대표 절세 자산입니다.",
    keyword: "비즈니스 사무용 노트북",
  },
  "tax-differences": {
    title: "일반과세 전환 시즌 매입세액 공제용 업무용 모니터·장비",
    reason: "일반과세자는 사업용 비품 매입 시 부가가치세 10%를 전액 공제받으므로, 장비 교체 타이밍을 일반과세 과세기간에 맞추면 체감 구매가를 대폭 낮출 수 있습니다.",
    keyword: "27인치 사무용 4K 모니터",
  },
};

const DEFAULT_TOOLKIT: ToolkitConfig = {
  title: "초보·전업 셀러 출고 효율 2배 높이는 감열 송장 프린터",
  reason: "A4 용지에 송장을 뽑아 테이프로 붙이는 시간을 줄여주는 잉크 제로 감열식 택배 송장 프린터는 셀러 필수 장비 1순위입니다.",
  keyword: "감열식 택배 송장 프린터",
};

interface ProductItem {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  isRocket: boolean;
}

export default function TipToolkitWidget({ slug }: { slug: string }) {
  const config = SLUG_TOOLKIT_MAP[slug] || DEFAULT_TOOLKIT;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchUrl, setSearchUrl] = useState("https://link.coupang.com/a/gBfL9ZBm7o");

  const handleLoadProducts = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
    if (products.length > 0) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/coupang/search?keyword=${encodeURIComponent(config.keyword)}&limit=3`
      );
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
        if (data.searchUrl) setSearchUrl(data.searchUrl);
      }
    } catch (error) {
      console.error("가이드 맞춤 장비 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-amber-50/60 border border-amber-200 rounded-2xl p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            <Wrench className="w-3.5 h-3.5" /> 이 칼럼 실전 적용 추천 장비
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-gray-900">
            {config.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {config.reason}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLoadProducts}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition-colors shadow-xs"
        >
          {isOpen ? "시세 접기" : "로켓배송 실무 장비 시세 보기"}
        </button>
      </div>

      {isOpen && (
        <div className="pt-3 border-t border-amber-200/70 space-y-2.5 animate-in fade-in duration-200">
          {isLoading ? (
            <div className="py-5 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" /> 실시간 쿠팡 최저가 조회 중...
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {products.map((item, idx) => (
                  <a
                    key={item.productId || idx}
                    href={item.productUrl || searchUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="p-3 rounded-xl bg-white border border-amber-200/80 hover:border-amber-500 flex sm:flex-col gap-3 justify-between transition-all group shadow-2xs"
                  >
                    <div className="flex sm:flex-col gap-2.5 min-w-0">
                      {item.productImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          loading="lazy"
                          className="w-14 h-14 sm:w-full sm:h-28 rounded-lg object-cover border border-gray-100 shrink-0"
                        />
                      )}
                      <p className="text-xs font-semibold text-gray-800 line-clamp-2 group-hover:text-amber-800">
                        {item.productName}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1 shrink-0">
                      <span className="text-sm font-black text-rose-600">
                        {item.productPrice.toLocaleString()}원
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-600" />
                    </div>
                  </a>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 text-right">
                이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
              </p>
            </>
          ) : (
            <div className="space-y-1.5">
              <a
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-amber-100/50 border border-amber-300 text-amber-900 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
              >
                &lsquo;{config.keyword}&rsquo; 쿠팡 로켓배송 최저가 비교하기 <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-[10px] text-gray-400 text-right">
                이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
