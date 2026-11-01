"use client";

import { useState, useRef } from "react";
import {
  PackageCheck,
  ShieldCheck,
  Zap,
  ExternalLink,
  Loader2,
  TrendingUp,
  Receipt,
} from "lucide-react";
import { calculateTaxShieldPrice, TaxType } from "@/lib/calculator";

interface CoupangCardItem {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  isRocket: boolean;
}

interface SupplyPreset {
  id: string;
  label: string;
  keyword: string;
  unitHint: string;
}

const SUPPLY_PRESETS: SupplyPreset[] = [
  { id: "box", label: "📦 택배박스 묶음", keyword: "택배박스 대량 묶음", unitHint: "소형·규격 박스 대량 단가" },
  { id: "bag", label: "🫧 안전봉투·에어캡", keyword: "택배 안전봉투 대량", unitHint: "파손방지 완충 봉투" },
  { id: "tape", label: "🔇 무소음 테이프", keyword: "무소음 박스테이프 박스단위", unitHint: "야간 포장 필수 소모품" },
  { id: "printer", label: "🖨️ 무잉크 송장프린터", keyword: "감열식 택배 송장 프린터", unitHint: "잉크·토너 유지비 0원" },
];

interface HighTicketPreset {
  id: string;
  label: string;
  keyword: string;
  tag: string;
}

const HIGH_TICKET_PRESETS: HighTicketPreset[] = [
  { id: "laptop", label: "💻 업무용 노트북·모니터", keyword: "비즈니스 사무용 노트북", tag: "부가세 환급 1순위" },
  { id: "studio", label: "📸 촬영 조명·포토박스", keyword: "쇼핑몰 제품 촬영 조명 세트", tag: "상세페이지 전환율 업" },
  { id: "chair", label: "🪑 사무용 의자·데스크", keyword: "시디즈 사무용 의자", tag: "장시간 CS·소싱 작업용" },
  { id: "rack", label: "🏗️ 재고 경량랙·카트", keyword: "무볼트 경량랙 진열대", tag: "사입 재고 정리 필수" },
];

const BULK_BENCHMARK_PACKING_COST = 78;

interface ProfitBoostWidgetsProps {
  packing: number;
  onChangePacking: (val: number) => void;
  unitTaxAmount: number;
  taxType: TaxType;
  incomeTaxRate: number;
}

export default function ProfitBoostWidgets({
  packing,
  onChangePacking,
  unitTaxAmount,
  taxType,
  incomeTaxRate,
}: ProfitBoostWidgetsProps) {
  // 월간 출고량 시뮬레이션 기준 (기본 월 1,000건 = 일 약 33건)
  const [monthlyOrders, setMonthlyOrders] = useState<number>(1000);

  // [엔진 2] 포장비 원클릭 절감 시뮬레이터 상태
  const [isBulkSimOn, setIsBulkSimOn] = useState(false);
  const previousPackingRef = useRef<number>(200);
  const [activeSupplyId, setActiveSupplyId] = useState<string | null>(null);
  const [supplyProducts, setSupplyProducts] = useState<CoupangCardItem[]>([]);
  const [supplySearchUrl, setSupplySearchUrl] = useState<string>("https://link.coupang.com/a/gBfL9ZBm7o");
  const [isLoadingSupply, setIsLoadingSupply] = useState(false);

  // [엔진 3] 세금 방어용 장비 체감가 시뮬레이터 상태
  const [sampleEquipPrice, setSampleEquipPrice] = useState<number>(1100000);
  const [activeEquipId, setActiveEquipId] = useState<string | null>(null);
  const [equipProducts, setEquipProducts] = useState<CoupangCardItem[]>([]);
  const [equipSearchUrl, setEquipSearchUrl] = useState<string>("https://link.coupang.com/a/gBfL9ZBm7o");
  const [isLoadingEquip, setIsLoadingEquip] = useState(false);

  const loadSupplyCategory = async (preset: SupplyPreset) => {
    setActiveSupplyId(preset.id);
    setIsLoadingSupply(true);
    try {
      const res = await fetch(
        `/api/coupang/search?keyword=${encodeURIComponent(preset.keyword)}&limit=3`
      );
      if (res.ok) {
        const data = await res.json();
        setSupplyProducts(Array.isArray(data.products) ? data.products : []);
        if (data.searchUrl) setSupplySearchUrl(data.searchUrl);
      }
    } catch (error) {
      console.error("부자재 최저가 조회 오류:", error);
    } finally {
      setIsLoadingSupply(false);
    }
  };

  const handleToggleBulkSimulator = () => {
    if (!isBulkSimOn) {
      previousPackingRef.current = packing > BULK_BENCHMARK_PACKING_COST ? packing : 200;
      onChangePacking(BULK_BENCHMARK_PACKING_COST);
      setIsBulkSimOn(true);
      if (!activeSupplyId) {
        loadSupplyCategory(SUPPLY_PRESETS[0]);
      }
    } else {
      onChangePacking(previousPackingRef.current);
      setIsBulkSimOn(false);
    }
  };

  const loadEquipCategory = async (preset: HighTicketPreset) => {
    setActiveEquipId(preset.id);
    setIsLoadingEquip(true);
    try {
      const res = await fetch(
        `/api/coupang/search?keyword=${encodeURIComponent(preset.keyword)}&limit=3`
      );
      if (res.ok) {
        const data = await res.json();
        setEquipProducts(Array.isArray(data.products) ? data.products : []);
        if (data.searchUrl) setEquipSearchUrl(data.searchUrl);
      }
    } catch (error) {
      console.error("절세 장비 시세 조회 오류:", error);
    } finally {
      setIsLoadingEquip(false);
    }
  };

  // 손실액 계산 (시뮬레이터가 켜져 있을 때는 원래 입력값 기준으로 절감액 표시)
  const basePackingForCompare = isBulkSimOn ? previousPackingRef.current : packing;
  const perOrderDiff = Math.max(0, basePackingForCompare - BULK_BENCHMARK_PACKING_COST);
  const annualPackingLoss = perOrderDiff * monthlyOrders * 12;

  // 연간 예상 납부 세금 및 샘플 장비 절세액 계산
  const annualEstimatedTax = Math.max(0, unitTaxAmount) * monthlyOrders * 12;
  const sampleShield = calculateTaxShieldPrice({
    itemPrice: sampleEquipPrice,
    taxType,
    incomeTaxRate,
  });

  return (
    <div className="mt-8 space-y-6">
      {/* 공통 출고 규모 선택 바 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">
              월 출고량 기준 연간 손익·절세 정밀 진단
            </h3>
            <p className="text-xs text-gray-500">
              내 목표 월 판매량을 선택하면 연간 새나가는 포장비와 절세 한도를 자동 산출합니다.
            </p>
          </div>
        </div>
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
          {[
            { count: 300, label: "월 300건 (부업)" },
            { count: 1000, label: "월 1,000건 (전업)" },
            { count: 3000, label: "월 3,000건 (확장)" },
          ].map((opt) => (
            <button
              key={opt.count}
              type="button"
              onClick={() => setMonthlyOrders(opt.count)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                monthlyOrders === opt.count
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ============================================================
            [킬러 엔진 2] 연간 포장·물류비 손실 영수증 & 원클릭 절감 스위치
           ============================================================ */}
        <div className="bg-white rounded-2xl border-2 border-amber-200/80 p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                <PackageCheck className="w-3.5 h-3.5" /> 부자재 원가 누수 진단
              </span>
              <span className="text-xs font-bold text-gray-500">
                대량 기준단가 {BULK_BENCHMARK_PACKING_COST}원 비교
              </span>
            </div>

            {perOrderDiff > 0 ? (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100">
                <div className="text-xs font-bold text-rose-700 mb-0.5">
                  {isBulkSimOn
                    ? "✅ 대량 부자재 단가(78원) 시뮬레이션 적용 중!"
                    : `🚨 현재 포장비(건당 ${basePackingForCompare.toLocaleString()}원) 유지 시 초과 지출`}
                </div>
                <div className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
                  연간 {annualPackingLoss.toLocaleString()}원{" "}
                  <span className="text-sm font-bold">
                    {isBulkSimOn ? "순수익 추가 확보!" : "손실 발생 중"}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1">
                  소매 박스·테이프 대신 대량 로켓배송 묶음({BULK_BENCHMARK_PACKING_COST}원 기준) 전환 시 건당{" "}
                  <strong>+{perOrderDiff.toLocaleString()}원</strong>이 즉시 순이익으로 바뀝니다.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="text-xs font-bold text-emerald-700 mb-0.5">
                  👍 포장 단가가 매우 우수하게 세팅되어 있습니다!
                </div>
                <p className="text-xs text-gray-600">
                  출고량이 늘어날 때는 무잉크 감열 송장프린터와 무소음 테이프로 포장 작업 시간을 절반으로 줄여보세요.
                </p>
              </div>
            )}

            {/* 원클릭 마진 점프 토글 버튼 */}
            <button
              type="button"
              onClick={handleToggleBulkSimulator}
              className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
                isBulkSimOn
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              <Zap className="w-4 h-4" />
              {isBulkSimOn
                ? `시뮬레이션 켜짐 (원래 포장비 ${previousPackingRef.current}원으로 되돌리기)`
                : `⚡ 대량 부자재 단가(${BULK_BENCHMARK_PACKING_COST}원)로 내 마진율 점프 미리보기`}
            </button>

            {/* 품목별 대량 부자재 실시간 최저가 탭 */}
            <div className="pt-2">
              <div className="text-xs font-bold text-gray-700 mb-2">
                👇 품목을 누르면 현재 로켓배송 대량 부자재 시세를 바로 조회합니다
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {SUPPLY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => loadSupplyCategory(preset)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold border text-left transition-all ${
                      activeSupplyId === preset.id
                        ? "bg-amber-50 border-amber-400 text-amber-900 shadow-2xs"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 클릭 시에만 열리는 실시간 부자재 카드 목록 */}
            {activeSupplyId && (
              <div className="pt-2 space-y-2 animate-in fade-in duration-200">
                {isLoadingSupply ? (
                  <div className="py-6 flex items-center justify-center text-xs text-gray-500 gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-600" /> 실시간 대량 부자재 최저가 조회 중...
                  </div>
                ) : supplyProducts.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      {supplyProducts.map((item, idx) => (
                        <a
                          key={item.productId || idx}
                          href={item.productUrl || supplySearchUrl}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 hover:border-amber-400 bg-white transition-all group"
                        >
                          {item.productImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              loading="lazy"
                              className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-amber-700">
                              {item.productName}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm font-black text-rose-600">
                                {item.productPrice.toLocaleString()}원
                              </span>
                              {item.isRocket && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                                  🚀 로켓배송
                                </span>
                              )}
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-600 shrink-0" />
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
                      href={supplySearchUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      쿠팡 로켓배송 대량 부자재 최저가 모음 바로가기 <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <p className="text-[10px] text-gray-400 text-right">
                      이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
            [킬러 엔진 3] 세금 폭탄 방어용 '합법적 경비처리(절세)' 장비 체감가 계산기
           ============================================================ */}
        <div className="bg-white rounded-2xl border-2 border-purple-200/80 p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                <ShieldCheck className="w-3.5 h-3.5" /> 사업자 경비처리·절세 시뮬레이터
              </span>
              <span className="text-xs font-bold text-purple-700">
                {taxType === "general" ? "일반과세" : taxType === "simplified" ? "간이과세" : "면세"} · 종소세{" "}
                {sampleShield.appliedIncomeTaxRate}% 기준
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100">
              <div className="flex items-center justify-between text-xs text-purple-900 font-bold mb-1">
                <span>연간 예상 납부 세액 (월 {monthlyOrders.toLocaleString()}건 기준)</span>
                <span className="text-purple-700 font-extrabold">
                  약 {annualEstimatedTax.toLocaleString()}원
                </span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                어차피 세금으로 낼 금액이라면 사업용 장비(노트북·모니터·촬영조명·의자)를 사업자 카드로 구매해{" "}
                <strong>부가세 매입세액 환급 + 종소세 필요경비 공제</strong>로 실질 구매가를 최대{" "}
                <strong>{sampleShield.savePercent.toFixed(0)}%</strong> 낮추세요.
              </p>
            </div>

            {/* 순수 금융 계산 기능: 장비 가격별 실질 체감가 계산기 */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">장비 구매 예산별 절세 체감가</span>
                <div className="flex gap-1">
                  {[330000, 880000, 1500000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSampleEquipPrice(val)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        sampleEquipPrice === val
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white text-gray-600 border-gray-200"
                      }`}
                    >
                      {val >= 1000000 ? `${val / 10000}만` : `${val / 10000}만`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs text-gray-500 line-through">
                  결제가 {sampleEquipPrice.toLocaleString()}원
                </span>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-600 mr-1.5">
                    (-{sampleShield.totalTaxSaved.toLocaleString()}원 절세)
                  </span>
                  <strong className="text-base sm:text-lg font-black text-purple-700">
                    체감가 {sampleShield.effectivePrice.toLocaleString()}원
                  </strong>
                </div>
              </div>
              <div className="text-[10px] text-gray-500 flex justify-between border-t border-gray-200/80 pt-1.5">
                <span>부가세 환급: {sampleShield.vatRefund.toLocaleString()}원</span>
                <span>종소세 절감: {sampleShield.incomeTaxSaved.toLocaleString()}원</span>
              </div>
            </div>

            {/* 100% 경비처리 가능 고단가 장비 카테고리 탭 */}
            <div className="pt-1">
              <div className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                실제 쿠팡 장비 가격에 내 절세 체감가 대입해보기
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {HIGH_TICKET_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => loadEquipCategory(preset)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold border text-left transition-all ${
                      activeEquipId === preset.id
                        ? "bg-purple-50 border-purple-400 text-purple-900 shadow-2xs"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 클릭 시에만 열리는 실시간 고단가 장비 + 절세 체감가 카드 */}
            {activeEquipId && (
              <div className="pt-2 space-y-2 animate-in fade-in duration-200">
                {isLoadingEquip ? (
                  <div className="py-6 flex items-center justify-center text-xs text-gray-500 gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" /> 실시간 장비 시세 및 절세 체감가 계산 중...
                  </div>
                ) : equipProducts.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      {equipProducts.map((item, idx) => {
                        const shield = calculateTaxShieldPrice({
                          itemPrice: item.productPrice,
                          taxType,
                          incomeTaxRate,
                        });
                        return (
                          <a
                            key={item.productId || idx}
                            href={item.productUrl || equipSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 hover:border-purple-400 bg-white transition-all group"
                          >
                            {item.productImage && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                loading="lazy"
                                className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-purple-700">
                                {item.productName}
                              </p>
                              <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                                <span className="text-[11px] text-gray-400 line-through">
                                  {item.productPrice.toLocaleString()}원
                                </span>
                                <span className="text-xs sm:text-sm font-black text-purple-700">
                                  절세 체감가 {shield.effectivePrice.toLocaleString()}원
                                </span>
                                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  -{shield.totalTaxSaved.toLocaleString()}원 세금방어
                                </span>
                              </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600 shrink-0" />
                          </a>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-gray-400 text-right">
                      이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                    </p>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <a
                      href={equipSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      쿠팡 사업자 경비처리 추천 장비 최저가 확인 <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <p className="text-[10px] text-gray-400 text-right">
                      이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
