"use client";

import { useState, useRef } from "react";
import {
  PackageCheck,
  ShieldCheck,
  ExternalLink,
  Loader2,
  ArrowRight,
  ChevronRight,
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
}

const SUPPLY_PRESETS: SupplyPreset[] = [
  { id: "box", label: "택배박스 묶음", keyword: "택배박스 대량 묶음" },
  { id: "bag", label: "안전봉투·에어캡", keyword: "택배 안전봉투 대량" },
  { id: "tape", label: "무소음 테이프", keyword: "무소음 박스테이프 박스단위" },
  { id: "printer", label: "무잉크 송장프린터", keyword: "감열식 택배 송장 프린터" },
];

interface HighTicketPreset {
  id: string;
  label: string;
  keyword: string;
}

const HIGH_TICKET_PRESETS: HighTicketPreset[] = [
  { id: "laptop", label: "노트북·모니터", keyword: "비즈니스 사무용 노트북" },
  { id: "studio", label: "촬영 조명·포토박스", keyword: "쇼핑몰 제품 촬영 조명 세트" },
  { id: "chair", label: "사무용 의자·데스크", keyword: "시디즈 사무용 의자" },
  { id: "rack", label: "재고 경량랙·카트", keyword: "무볼트 경량랙 진열대" },
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
  const [activeTab, setActiveTab] = useState<"packing" | "tax">("packing");
  const [monthlyOrders, setMonthlyOrders] = useState<number>(1000);

  // [탭 1] 포장비 절감 시뮬레이터 상태
  const [isBulkSimOn, setIsBulkSimOn] = useState(false);
  const previousPackingRef = useRef<number>(200);
  const [activeSupplyId, setActiveSupplyId] = useState<string | null>(null);
  const [supplyProducts, setSupplyProducts] = useState<CoupangCardItem[]>([]);
  const [supplySearchUrl, setSupplySearchUrl] = useState<string>("https://link.coupang.com/a/gBfL9ZBm7o");
  const [isLoadingSupply, setIsLoadingSupply] = useState(false);

  // [탭 2] 사업자 경비처리·절세 시뮬레이터 상태
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

  const basePackingForCompare = isBulkSimOn ? previousPackingRef.current : packing;
  const perOrderDiff = Math.max(0, basePackingForCompare - BULK_BENCHMARK_PACKING_COST);
  const annualPackingLoss = perOrderDiff * monthlyOrders * 12;

  const annualEstimatedTax = Math.max(0, unitTaxAmount) * monthlyOrders * 12;
  const sampleShield = calculateTaxShieldPrice({
    itemPrice: sampleEquipPrice,
    taxType,
    incomeTaxRate,
  });

  const formatManWon = (won: number) => {
    if (won >= 10000) {
      return `${Math.round(won / 10000).toLocaleString()}만 원`;
    }
    return `${won.toLocaleString()}원`;
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* 카드 상단 헤더 + 월 판매량 선택 */}
      <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            순수익 개선 &amp; 절세 시뮬레이터
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            월 출고량 기준으로 새나가는 포장 원가와 사업자 경비 공제액을 시뮬레이션합니다.
          </p>
        </div>

        {/* 월 출고량 컴팩트 세그먼트 */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto shrink-0">
          {[
            { count: 300, label: "월 300건" },
            { count: 1000, label: "월 1,000건" },
            { count: 3000, label: "월 3,000건" },
          ].map((opt) => (
            <button
              key={opt.count}
              type="button"
              onClick={() => setMonthlyOrders(opt.count)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                monthlyOrders === opt.count
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 모바일 친화형 2분할 탭 네비게이션 (한 번에 하나의 도구에만 집중) */}
      <div className="grid grid-cols-2 bg-slate-50/70 border-b border-slate-200/80 p-1.5 gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab("packing")}
          className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "packing"
              ? "bg-white text-slate-900 shadow-xs border border-slate-200/70"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <PackageCheck className={`w-4 h-4 shrink-0 ${activeTab === "packing" ? "text-primary" : "text-slate-400"}`} />
          <span>포장 원가 절감</span>
          {annualPackingLoss > 0 && (
            <span className="hidden xs:inline-block text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              +{formatManWon(annualPackingLoss)}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tax")}
          className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "tax"
              ? "bg-white text-slate-900 shadow-xs border border-slate-200/70"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck className={`w-4 h-4 shrink-0 ${activeTab === "tax" ? "text-primary" : "text-slate-400"}`} />
          <span>장비 경비·절세</span>
          <span className="hidden xs:inline-block text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-50 text-primary">
            -{sampleShield.savePercent.toFixed(0)}%
          </span>
        </button>
      </div>

      {/* ============================================================
          탭 1: 포장·부자재 원가 절감 시뮬레이터
         ============================================================ */}
      {activeTab === "packing" ? (
        <div className="p-4 sm:p-6 space-y-5 animate-in fade-in duration-200">
          {/* Before -> After 비교 요약 카드 */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-center min-w-[92px]">
                  <div className="text-[11px] text-slate-500 font-medium">현재 포장비</div>
                  <div className="text-sm font-bold text-slate-700">
                    {basePackingForCompare.toLocaleString()}원
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="bg-blue-50/80 border border-blue-200 rounded-lg px-3 py-2 text-center min-w-[92px]">
                  <div className="text-[11px] text-primary font-semibold">대량 묶음 단가</div>
                  <div className="text-sm font-extrabold text-primary">
                    {BULK_BENCHMARK_PACKING_COST}원
                  </div>
                </div>
              </div>

              <div className="sm:text-right">
                {perOrderDiff > 0 ? (
                  <>
                    <div className="text-xs font-semibold text-slate-500">
                      월 {monthlyOrders.toLocaleString()}건 출고 시 연간 절감액
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
                      +연 {annualPackingLoss.toLocaleString()}원
                    </div>
                  </>
                ) : (
                  <div className="text-xs sm:text-sm font-bold text-emerald-700">
                    현재 최적의 부자재 단가로 세팅되어 있습니다
                  </div>
                )}
              </div>
            </div>

            {/* 토스 스타일 iOS 스위치 행 */}
            <div
              onClick={handleToggleBulkSimulator}
              className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200/80 cursor-pointer select-none"
            >
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  대량 단가({BULK_BENCHMARK_PACKING_COST}원) 위 계산기에 바로 적용해보기
                </div>
                <div className="text-[11px] text-slate-500">
                  스위치를 켜면 위 정산 결과의 순수익과 마진율 변화를 즉시 확인할 수 있습니다.
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isBulkSimOn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleBulkSimulator();
                }}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                  isBulkSimOn ? "bg-primary" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                    isBulkSimOn ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 품목별 대량 부자재 시세 조회 가로 스크롤 알약 버튼 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                품목별 대량 묶음 실시간 시세 조회
              </span>
              <span className="text-[11px] text-slate-400">품목 선택 시 조회</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {SUPPLY_PRESETS.map((preset) => {
                const isSelected = activeSupplyId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => loadSupplyCategory(preset)}
                    className={`shrink-0 min-h-[38px] px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? "bg-slate-900 border-slate-900 text-white shadow-2xs"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 active:bg-slate-50"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {activeSupplyId && (
              <div className="pt-1 space-y-2.5 animate-in fade-in duration-200">
                {isLoadingSupply ? (
                  <div className="py-8 flex items-center justify-center text-xs text-slate-500 gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" /> 실시간 부자재 시세를 불러오는 중...
                  </div>
                ) : supplyProducts.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {supplyProducts.map((item, idx) => (
                        <a
                          key={item.productId || idx}
                          href={item.productUrl || supplySearchUrl}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="flex sm:flex-col justify-between gap-3 p-3 rounded-xl border border-slate-200 hover:border-primary bg-white transition-all group"
                        >
                          <div className="flex sm:flex-col gap-3 min-w-0">
                            {item.productImage && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                loading="lazy"
                                className="w-14 h-14 sm:w-full sm:h-28 rounded-lg object-cover border border-slate-100 shrink-0 bg-slate-50"
                              />
                            )}
                            <div className="min-w-0">
                              {item.isRocket && (
                                <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 mb-1">
                                  로켓배송
                                </span>
                              )}
                              <p className="text-xs font-medium text-slate-800 line-clamp-2 group-hover:text-primary leading-snug">
                                {item.productName}
                              </p>
                            </div>
                          </div>
                          <div className="flex sm:w-full items-center justify-between pt-1 sm:border-t sm:border-slate-100 shrink-0">
                            <span className="text-sm font-extrabold text-slate-900">
                              {item.productPrice.toLocaleString()}원
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                          </div>
                        </a>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 text-right">
                      이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                    </p>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <a
                      href={supplySearchUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="min-h-[42px] w-full px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      대량 부자재 로켓배송 최저가 확인하기 <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <p className="text-[10px] text-slate-400 text-right">
                      이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ============================================================
           탭 2: 사업자 장비 경비처리·절세 체감가 시뮬레이터
           ============================================================ */
        <div className="p-4 sm:p-6 space-y-5 animate-in fade-in duration-200">
          {/* 절세 계산 슬라이더 & 3분할 요약 영수증 */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold text-slate-700">
                사업용 장비 구매 예산 선택{" "}
                <span className="text-slate-400 font-medium">
                  ({taxType === "general" ? "일반과세" : taxType === "simplified" ? "간이과세" : "면세"} · 종소세{" "}
                  {sampleShield.appliedIncomeTaxRate}% 기준)
                </span>
              </div>
              {annualEstimatedTax > 0 && (
                <span className="text-[11px] font-semibold text-slate-500">
                  연 예상 세액 약 {formatManWon(annualEstimatedTax)}
                </span>
              )}
            </div>

            {/* 원클릭 금액 프리셋 + 모바일 터치 슬라이더 */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-4 gap-1.5">
                {[300000, 800000, 1200000, 2000000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSampleEquipPrice(val)}
                    className={`min-h-[36px] rounded-lg text-xs font-bold border transition-all ${
                      sampleEquipPrice === val
                        ? "bg-primary text-white border-primary shadow-2xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {val / 10000}만 원
                  </button>
                ))}
              </div>
              <input
                type="range"
                min={100000}
                max={3000000}
                step={50000}
                value={sampleEquipPrice}
                onChange={(e) => setSampleEquipPrice(Number(e.target.value))}
                aria-label="장비 구매 예산 슬라이더"
                className="w-full accent-primary cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            </div>

            {/* 깔끔한 3칸 절세 영수증 */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="bg-white border border-slate-200 rounded-xl p-3">
                <div className="text-[11px] text-slate-500">카드 결제가</div>
                <div className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5">
                  {sampleEquipPrice.toLocaleString()}원
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3">
                <div className="text-[11px] text-emerald-700 font-semibold">부가세+종소세 절감</div>
                <div className="text-xs sm:text-sm font-extrabold text-emerald-600 mt-0.5">
                  -{sampleShield.totalTaxSaved.toLocaleString()}원
                </div>
              </div>
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3">
                <div className="text-[11px] text-primary font-bold">실질 체감가</div>
                <div className="text-xs sm:text-sm font-black text-primary mt-0.5">
                  {sampleShield.effectivePrice.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>

          {/* 실제 업무 장비 시세 + 절세 체감가 자동 대입 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                실제 업무용 장비에 내 절세 체감가 대입해보기
              </span>
              <span className="text-[11px] text-slate-400">품목 선택 시 조회</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {HIGH_TICKET_PRESETS.map((preset) => {
                const isSelected = activeEquipId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => loadEquipCategory(preset)}
                    className={`shrink-0 min-h-[38px] px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? "bg-slate-900 border-slate-900 text-white shadow-2xs"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 active:bg-slate-50"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {activeEquipId && (
              <div className="pt-1 space-y-2.5 animate-in fade-in duration-200">
                {isLoadingEquip ? (
                  <div className="py-8 flex items-center justify-center text-xs text-slate-500 gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" /> 장비 시세 및 절세 체감가 계산 중...
                  </div>
                ) : equipProducts.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
                            className="flex sm:flex-col justify-between gap-3 p-3 rounded-xl border border-slate-200 hover:border-primary bg-white transition-all group"
                          >
                            <div className="flex sm:flex-col gap-3 min-w-0">
                              {item.productImage && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  loading="lazy"
                                  className="w-14 h-14 sm:w-full sm:h-28 rounded-lg object-cover border border-slate-100 shrink-0 bg-slate-50"
                                />
                              )}
                              <div className="min-w-0">
                                <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 mb-1">
                                  -{shield.totalTaxSaved.toLocaleString()}원 절세
                                </span>
                                <p className="text-xs font-medium text-slate-800 line-clamp-2 group-hover:text-primary leading-snug">
                                  {item.productName}
                                </p>
                              </div>
                            </div>
                            <div className="flex sm:w-full items-end justify-between pt-1 sm:border-t sm:border-slate-100 shrink-0">
                              <div>
                                <div className="text-[10px] text-slate-400 line-through">
                                  {item.productPrice.toLocaleString()}원
                                </div>
                                <div className="text-sm font-black text-primary">
                                  체감 {shield.effectivePrice.toLocaleString()}원
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary mb-0.5" />
                            </div>
                          </a>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-slate-400 text-right">
                      이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                    </p>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <a
                      href={equipSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="min-h-[42px] w-full px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      사업자 경비처리 추천 장비 최저가 확인 <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <p className="text-[10px] text-slate-400 text-right">
                      이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
