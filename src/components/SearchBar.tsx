"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  ExternalLink,
  Target,
  ShieldAlert,
  Sparkles,
  ArrowDownToLine,
} from "lucide-react";
import { calculateMaxAllowedCost, TaxType } from "@/lib/calculator";

export interface TrendData {
  period: string;
  ratio: number;
}

interface CoupangProductItem {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  isRocket: boolean;
  isFreeShipping: boolean;
  rank: number;
}

interface CoupangSummary {
  count: number;
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
  rocketCount: number;
  rocketRatio: number;
}

interface SearchBarProps {
  initialKeyword?: string;
  calculatorContext: {
    shippingCustomer: number;
    shippingReal: number;
    packing: number;
    other: number;
    feeRate: number;
    taxType: TaxType;
    incomeTaxRate: number;
  };
  onApplyBenchmark: (params: {
    productName: string;
    price: number;
    recommendedCost?: number;
    scrollToCalc?: boolean;
  }) => void;
}

const HOT_KEYWORDS = [
  "규조토 발매트",
  "접이식 캠핑카트",
  "차량용 무선충전 거치대",
  "스텐 배수구망",
  "실리콘 조리도구 세트",
];

export default function SearchBar({
  initialKeyword,
  calculatorContext,
  onApplyBenchmark,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [coupangProducts, setCoupangProducts] = useState<CoupangProductItem[]>([]);
  const [coupangSummary, setCoupangSummary] = useState<CoupangSummary | null>(null);
  const [coupangSearchUrl, setCoupangSearchUrl] = useState("https://link.coupang.com/a/gBfL9ZBm7o");
  const [hasSearched, setHasSearched] = useState(false);

  const executeSearch = useCallback(
    async (targetKeyword: string) => {
      const trimmed = targetKeyword.trim();
      if (!trimmed) return;

      setQuery(trimmed);
      setSearchedQuery(trimmed);
      setIsSearching(true);

      try {
        // 네이버 30일 검색 트렌드와 쿠팡 실시간 상위 상품 API를 병렬 호출
        const [trendRes, coupangRes] = await Promise.all([
          fetch(`/api/search?q=${encodeURIComponent(trimmed)}`),
          fetch(`/api/coupang/search?keyword=${encodeURIComponent(trimmed)}&limit=4`),
        ]);

        if (trendRes.ok) {
          const tJson = await trendRes.json();
          setTrendData(Array.isArray(tJson.data) ? tJson.data : []);
        } else {
          setTrendData([]);
        }

        if (coupangRes.ok) {
          const cJson = await coupangRes.json();
          setCoupangProducts(Array.isArray(cJson.products) ? cJson.products : []);
          setCoupangSummary(cJson.summary || null);
          if (cJson.searchUrl) setCoupangSearchUrl(cJson.searchUrl);

          // 쿠팡 평균가가 있으면 상품명만 먼저 연동 (사용자가 입력 중인 가격을 강제로 덮어쓰지 않고 선택권 부여)
          onApplyBenchmark({ productName: trimmed, price: 0 });
        } else {
          setCoupangProducts([]);
          setCoupangSummary(null);
          onApplyBenchmark({ productName: trimmed, price: 0 });
        }
      } catch (error) {
        console.error("통합 트렌드 및 시세 검색 실패:", error);
        setTrendData([]);
        setCoupangProducts([]);
        setCoupangSummary(null);
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    },
    [onApplyBenchmark]
  );

  // 공유 링크(?q=키워드)로 진입한 경우 자동으로 분석 실행
  useEffect(() => {
    if (initialKeyword && initialKeyword.trim()) {
      executeSearch(initialKeyword);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKeyword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const getTrendStatus = () => {
    if (trendData.length < 10)
      return {
        status: "none" as const,
        text: "데이터 부족",
        color: "text-gray-500",
        icon: <Minus className="w-4 h-4" />,
      };

    const mid = Math.floor(trendData.length / 2);
    const firstHalf = trendData.slice(0, mid);
    const secondHalf = trendData.slice(mid);

    const firstAvg = firstHalf.reduce((sum, item) => sum + item.ratio, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.ratio, 0) / secondHalf.length;
    const diff = secondAvg - firstAvg;

    if (diff > 5)
      return {
        status: "up" as const,
        text: "상승세 (수요 증가)",
        color: "text-red-500",
        icon: <TrendingUp className="w-5 h-5" />,
      };
    if (diff < -5)
      return {
        status: "down" as const,
        text: "하락세 (수요 감소)",
        color: "text-blue-500",
        icon: <TrendingDown className="w-5 h-5" />,
      };
    return {
      status: "stable" as const,
      text: "유지 (수요 꾸준함)",
      color: "text-gray-600",
      icon: <Minus className="w-5 h-5" />,
    };
  };

  const trendStatus = getTrendStatus();

  // [킬러 엔진 4] 네이버 트렌드 + 쿠팡 로켓배송 점유율 결합 '소싱 매력도 신호등' 판정
  const getSourcingSignal = () => {
    if (!coupangSummary) return null;
    const { rocketRatio, avgPrice } = coupangSummary;

    if (rocketRatio <= 50 && trendStatus.status !== "down" && avgPrice >= 9000) {
      return {
        badge: "🟢 진입 추천 (꿀통 기회)",
        bgClass: "bg-emerald-50 border-emerald-200 text-emerald-900",
        badgeClass: "bg-emerald-600 text-white",
        desc: `검색 수요는 견고한데 상위권 로켓배송 비중이 ${rocketRatio}%로 낮습니다. 일반 판매자(윙/로켓그로스)도 상세페이지 차별화로 1페이지 안착 승산이 높은 시장입니다.`,
      };
    }

    if (rocketRatio > 75 || avgPrice < 7000) {
      return {
        badge: "🔴 진입 주의 (로켓 강세·저단가)",
        bgClass: "bg-rose-50 border-rose-200 text-rose-900",
        badgeClass: "bg-rose-600 text-white",
        desc:
          avgPrice < 7000
            ? `상위 평균 판매가가 ${avgPrice.toLocaleString()}원으로 낮아 낱개 판매 시 택배비 방어가 어렵습니다. 반드시 2+1 묶음 구성으로 객단가를 높여 진입하세요.`
            : `상위 노출의 ${rocketRatio}%가 로켓배송입니다. 정면 최저가 경쟁 대신 사은품 추가·틈새 세부 키워드로 우회 공략이 필요합니다.`,
      };
    }

    return {
      badge: "🟡 틈새 공략 (옵션·번들 차별화)",
      bgClass: "bg-amber-50 border-amber-200 text-amber-900",
      badgeClass: "bg-amber-500 text-white",
      desc: `로켓배송 비중 ${rocketRatio}%, 상위 평균가 ${avgPrice.toLocaleString()}원 시장입니다. 아래 1~4위 경쟁사 최저가가 본품인지 '미끼옵션'인지 먼저 검증하세요.`,
    };
  };

  const sourcingSignal = getSourcingSignal();

  // [킬러 엔진 1] 순마진 20% 달성을 위한 도매 사입원가 상한선 실시간 역산
  const maxCostAtMin = coupangSummary
    ? calculateMaxAllowedCost({
        targetSellingPrice: coupangSummary.minPrice,
        targetMarginRate: 20,
        ...calculatorContext,
      })
    : 0;

  const maxCostAtAvg = coupangSummary
    ? calculateMaxAllowedCost({
        targetSellingPrice: coupangSummary.avgPrice,
        targetMarginRate: 20,
        ...calculatorContext,
      })
    : 0;

  return (
    <div className="w-full mb-6 space-y-3">
      <form onSubmit={handleSubmit} className="relative z-10 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="소싱할 아이템 입력 (트렌드 + 쿠팡 시세·최대 도매원가 1초 역산)"
            className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-[#03C75A]/30 bg-white shadow-sm focus:outline-none focus:ring-0 focus:border-[#03C75A] text-sm transition-all placeholder:text-gray-400 font-medium"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#03C75A]" />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="shrink-0 px-4 md:px-6 bg-[#03C75A] text-white text-sm font-bold rounded-xl hover:bg-[#03C75A]/90 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[88px] shadow-sm"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "소싱 판독"}
        </button>
      </form>

      {/* 빠른 소싱 판독 추천 키워드 칩 */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs">
        <span className="font-bold text-gray-500 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 원클릭 판독 예시:
        </span>
        {HOT_KEYWORDS.map((kw) => (
          <button
            key={kw}
            type="button"
            onClick={() => executeSearch(kw)}
            className="px-2.5 py-1 rounded-full bg-white border border-gray-200 hover:border-[#03C75A] hover:text-[#03C75A] text-gray-600 font-medium transition-colors shadow-2xs"
          >
            {kw}
          </button>
        ))}
      </div>

      {/* 검색 결과 영역 */}
      {hasSearched ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-1">
          {/* [엔진 4] 소싱 매력도 신호등 배너 */}
          {sourcingSignal && (
            <div className={`p-4 rounded-xl border ${sourcingSignal.bgClass} flex flex-col gap-1.5 shadow-2xs`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${sourcingSignal.badgeClass}`}>
                  {sourcingSignal.badge}
                </span>
                <span className="text-[11px] font-semibold opacity-80">
                  네이버 30일 트렌드 × 쿠팡 상위 노출 실시간 교차 판독
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed mt-0.5">
                {sourcingSignal.desc}
              </p>
            </div>
          )}

          {/* [엔진 1] 쿠팡 실시간 시세 기반 '최대 허용 사입원가(목표 마진 20%)' 역산 리포트 */}
          <div className="bg-white border-2 border-indigo-100 rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mb-1">
                  <Target className="w-3.5 h-3.5" /> 쿠팡 1페이지 공략 &amp; 도매 사입원가 역산기
                </div>
                <h3 className="text-base md:text-lg font-extrabold text-gray-900">
                  &lsquo;{searchedQuery}&rsquo; 얼마 이하로 사입해야 마진 20% 남을까?
                </h3>
              </div>
              <a
                href={coupangSearchUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                쿠팡 1페이지 전체 시세·리뷰 보기 <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {coupangSummary ? (
              <>
                {/* 최저가 vs 평균가 기준 도매 원가 상한선 비교 박스 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 flex flex-col justify-between gap-2">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span className="font-bold text-rose-700">상위권 최저가 맞대결 시</span>
                        <span className="font-semibold">판매가 {coupangSummary.minPrice.toLocaleString()}원</span>
                      </div>
                      {maxCostAtMin > 0 ? (
                        <div className="text-sm text-gray-800">
                          순마진 20% 확보 도매 상한선:{" "}
                          <strong className="text-lg font-black text-rose-600">
                            {maxCostAtMin.toLocaleString()}원 이하
                          </strong>
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-rose-600 flex items-start gap-1 leading-snug">
                          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>
                            원가 0원이어도 택배비·수수료 때문에 마진 20% 불가! (본품 아닌 &lsquo;미끼옵션&rsquo; 가능성 높음)
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onApplyBenchmark({
                          productName: searchedQuery,
                          price: coupangSummary.minPrice,
                          recommendedCost: maxCostAtMin > 0 ? maxCostAtMin : undefined,
                          scrollToCalc: true,
                        })
                      }
                      className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-rose-100/60 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" /> 이 가격·원가 계산기에 자동 입력
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between gap-2">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span className="font-bold text-indigo-700">상위권 평균가 안착 시</span>
                        <span className="font-semibold">판매가 {coupangSummary.avgPrice.toLocaleString()}원</span>
                      </div>
                      {maxCostAtAvg > 0 ? (
                        <div className="text-sm text-gray-800">
                          순마진 20% 확보 도매 상한선:{" "}
                          <strong className="text-lg font-black text-indigo-700">
                            {maxCostAtAvg.toLocaleString()}원 이하
                          </strong>
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-amber-700 leading-snug">
                          현재 배송비·수수료 설정 대비 단가가 낮습니다. 묶음 판매로 객단가를 높여보세요.
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onApplyBenchmark({
                          productName: searchedQuery,
                          price: coupangSummary.avgPrice,
                          recommendedCost: maxCostAtAvg > 0 ? maxCostAtAvg : undefined,
                          scrollToCalc: true,
                        })
                      }
                      className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-indigo-100/60 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" /> 이 가격·원가 계산기에 자동 입력
                    </button>
                  </div>
                </div>

                {/* 상위 1~4위 실물 경쟁사 상품 카드 & 미끼옵션 판독 링크 */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-gray-700">
                      🔥 현재 쿠팡 상위 노출 경쟁사 벤치마킹 (옵션 구성·리뷰 장벽 필수 체크)
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500">
                      로켓배송 비중 {coupangSummary.rocketRatio}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {coupangProducts.map((item, idx) => (
                      <div
                        key={item.productId || idx}
                        className="flex flex-col justify-between p-3 rounded-xl border border-gray-200 hover:border-rose-300 bg-white transition-all shadow-2xs gap-2.5"
                      >
                        <div className="flex gap-3">
                          {item.productImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              loading="lazy"
                              className="w-16 h-16 rounded-lg object-cover border border-gray-100 shrink-0 bg-gray-50"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center text-xs text-gray-400 font-bold">
                              TOP {idx + 1}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-gray-900 text-white">
                                TOP {idx + 1}
                              </span>
                              {item.isRocket && (
                                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                                  🚀 로켓배송
                                </span>
                              )}
                              {!item.isRocket && item.isFreeShipping && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                  무료배송
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">
                              {item.productName}
                            </p>
                            <div className="mt-1 text-sm font-black text-rose-600">
                              {item.productPrice.toLocaleString()}원
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() =>
                              onApplyBenchmark({
                                productName: searchedQuery,
                                price: item.productPrice,
                                scrollToCalc: true,
                              })
                            }
                            className="py-1.5 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold transition-colors text-center"
                          >
                            이 가격 계산기 적용
                          </button>
                          <a
                            href={item.productUrl || coupangSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="py-1.5 px-2 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 text-[11px] font-extrabold transition-colors flex items-center justify-center gap-1"
                          >
                            미끼옵션·리뷰 확인 <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  <strong className="text-rose-700 font-bold">
                    💡 소싱 전 필수 체크:
                  </strong>{" "}
                  쿠팡 1페이지 상위 셀러들의 최저가가 본품인지 <strong>추가옵션 미끼가격</strong>인지, 리뷰 장벽이 몇 개인지 직접 확인한 뒤 아래 계산기에 판매가를 입력하세요.
                </div>
                <a
                  href={coupangSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-xs transition-colors"
                >
                  &lsquo;{searchedQuery}&rsquo; 미끼옵션·리뷰 검증하기 <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <p className="text-[10px] text-gray-400 text-right">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </div>

          {/* 네이버 30일 검색 트렌드 차트 박스 */}
          <div className="bg-white border border-[#03C75A]/20 rounded-2xl p-4 md:p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-base md:text-lg font-extrabold text-gray-900 break-keep">
                  <span className="text-[#03C75A]">&lsquo;{searchedQuery}&rsquo;</span> 최근 30일 네이버 검색 수요
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#03C75A]/10 text-[#03C75A] px-2 py-0.5 rounded-sm whitespace-nowrap">
                  <Info className="w-3 h-3" /> NAVER 데이터랩
                </span>
              </div>

              {trendData.length > 0 && (
                <div
                  className={`self-start md:self-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 font-bold text-xs md:text-sm ${trendStatus.color}`}
                >
                  {trendStatus.icon}
                  {trendStatus.text}
                </div>
              )}
            </div>

            {trendData.length > 0 ? (
              <div className="relative h-40 w-full pt-8 pb-2 border-b-2 border-gray-100 mt-4">
                <div
                  className="absolute left-0 right-0 border-t border-dashed border-gray-300 pointer-events-none flex items-center justify-end pr-1 z-0"
                  style={{
                    bottom: `${Math.max(
                      5,
                      trendData.reduce((acc, cur) => acc + cur.ratio, 0) / trendData.length
                    )}%`,
                  }}
                >
                  <span className="text-[9px] font-bold text-gray-400 bg-white px-1 -translate-y-1/2">
                    평균 {Math.round(trendData.reduce((acc, cur) => acc + cur.ratio, 0) / trendData.length)}
                  </span>
                </div>

                <div className="flex items-end gap-1 w-full h-full relative z-10">
                  {trendData.map((item, i) => {
                    const maxItem = trendData.reduce((prev, curr) =>
                      prev.ratio > curr.ratio ? prev : curr
                    );
                    const minItem = trendData.reduce((prev, curr) =>
                      prev.ratio < curr.ratio ? prev : curr
                    );
                    const isMax = item === maxItem;
                    const isMin = item === minItem && !isMax;

                    return (
                      <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] md:text-[11px] font-bold py-1.5 px-2.5 rounded pointer-events-none z-30 whitespace-nowrap transition-opacity shadow-lg">
                          {item.period.substring(5)} 지수:{" "}
                          <span className="text-[#03C75A]">{Math.round(item.ratio)}</span>
                        </div>

                        {(isMax || isMin) && (
                          <div
                            className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap z-20 pointer-events-none text-center pb-1 ${
                              isMax ? "text-red-500" : "text-blue-500"
                            }`}
                            style={{ bottom: `${Math.max(2, item.ratio)}%` }}
                          >
                            <div className="text-[9px] font-bold leading-tight bg-white/80 px-1 rounded">
                              {isMax ? "최고" : "최저"} {Math.round(item.ratio)}
                            </div>
                            <div className="text-[7px] text-gray-500 font-medium leading-none bg-white/80 px-1 rounded mt-0.5">
                              {item.period.substring(5)}
                            </div>
                          </div>
                        )}

                        <div
                          className={`w-full transition-colors rounded-t-sm ${
                            i === trendData.length - 1
                              ? "bg-[#03C75A]"
                              : "bg-[#03C75A]/20 group-hover:bg-[#03C75A]/60"
                          }`}
                          style={{ height: `${Math.max(2, item.ratio)}%` }}
                        ></div>
                      </div>
                    );
                  })}
                </div>

                <div className="absolute -bottom-5 left-0 text-[9px] text-gray-400 font-medium">
                  {trendData[0].period.substring(5)}
                </div>
                <div className="absolute -bottom-5 right-0 text-[9px] text-[#03C75A] font-bold">
                  {trendData[trendData.length - 1].period.substring(5)} (최근)
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500 text-xs md:text-sm font-medium">
                해당 키워드의 네이버 검색 트렌드 데이터가 충분하지 않습니다.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
