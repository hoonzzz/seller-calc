"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Info,
  RefreshCcw,
  Sparkles,
  ChevronRight,
  Share2,
  Check,
  X,
  Minus,
  Plus,
  ArrowDown,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ProfitBoostWidgets from "@/components/ProfitBoostWidgets";

import { calculateMargin, TaxType } from "@/lib/calculator";

type Market = "smartstore" | "coupang" | "11st" | "gmarket" | "fashion" | "custom";

interface Preset {
  id: Market;
  name: string;
  subLabel: string;
  fee: number;
}

const MARKET_PRESETS: Preset[] = [
  { id: "smartstore", name: "스마트스토어", subLabel: "평균 4.8%", fee: 4.8 },
  { id: "coupang", name: "쿠팡 (윙)", subLabel: "평균 10.8%", fee: 10.8 },
  { id: "fashion", name: "에이블리·지그", subLabel: "평균 10.0%", fee: 10.0 },
  { id: "11st", name: "11번가", subLabel: "평균 13.0%", fee: 13.0 },
  { id: "gmarket", name: "G마켓·옥션", subLabel: "평균 13.0%", fee: 13.0 },
  { id: "custom", name: "직접 입력", subLabel: "수수료 지정", fee: 0 },
];

interface QuickChip {
  label: string;
  value: number;
  type: "delta" | "set";
}

const PRICE_CHIPS: QuickChip[] = [
  { label: "+1만", value: 10000, type: "delta" },
  { label: "+5천", value: 5000, type: "delta" },
  { label: "+1천", value: 1000, type: "delta" },
  { label: "+500", value: 500, type: "delta" },
  { label: "-1천", value: -1000, type: "delta" },
];

const CUSTOMER_SHIPPING_CHIPS: QuickChip[] = [
  { label: "무료 (0원)", value: 0, type: "set" },
  { label: "2,500원", value: 2500, type: "set" },
  { label: "3,000원", value: 3000, type: "set" },
  { label: "3,500원", value: 3500, type: "set" },
];

const REAL_SHIPPING_CHIPS: QuickChip[] = [
  { label: "2,200원 (계약)", value: 2200, type: "set" },
  { label: "2,500원 (표준)", value: 2500, type: "set" },
  { label: "3,000원 (일반)", value: 3000, type: "set" },
  { label: "3,500원", value: 3500, type: "set" },
];

const PACKING_CHIPS: QuickChip[] = [
  { label: "78원 (봉투)", value: 78, type: "set" },
  { label: "200원 (소형박스)", value: 200, type: "set" },
  { label: "400원 (중형박스)", value: 400, type: "set" },
];

const AD_OTHER_CHIPS: QuickChip[] = [
  { label: "없음 (0원)", value: 0, type: "set" },
  { label: "500원", value: 500, type: "set" },
  { label: "1,000원", value: 1000, type: "set" },
  { label: "2,000원", value: 2000, type: "set" },
];

/**
 * 모바일 최적화 천단위 콤마 금액 입력 컴포넌트
 * - text-base(16px) 적용으로 아이폰 Safari 탭 자동 줌 현상 방지
 * - 항목 성격에 맞는 원클릭 스마트 칩(증감형 / 프리셋형) 지원
 */
function SmartMoneyInput({
  label,
  badge,
  value,
  onChange,
  chips,
  highlight = false,
}: {
  label: string;
  badge?: string;
  value: number;
  onChange: (val: number) => void;
  chips: QuickChip[];
  highlight?: boolean;
}) {
  const formatted = value > 0 ? value.toLocaleString("ko-KR") : value === 0 ? "0" : "";

  const handleTextChange = (raw: string) => {
    const digitsOnly = raw.replace(/[^0-9]/g, "");
    if (!digitsOnly) {
      onChange(0);
      return;
    }
    const parsed = Math.min(999999999, parseInt(digitsOnly, 10));
    onChange(parsed);
  };

  return (
    <div
      className={`p-3.5 rounded-xl border transition-colors ${
        highlight
          ? "bg-blue-50/40 border-blue-200/80"
          : "bg-slate-50/70 border-slate-200/70"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <label className="text-sm font-bold text-slate-800 whitespace-nowrap">{label}</label>
          {badge && (
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 whitespace-nowrap">
              {badge}
            </span>
          )}
        </div>

        <div className="relative flex items-center w-44 sm:w-48 shrink-0">
          <input
            type="text"
            inputMode="numeric"
            value={formatted}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => handleTextChange(e.target.value)}
            aria-label={label}
            className={`w-full text-right py-2 pl-3 ${
              value > 0 ? "pr-12" : "pr-8"
            } rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base ${
              highlight ? "font-extrabold text-slate-900" : "font-bold text-slate-800"
            }`}
          />
          {value > 0 && (
            <button
              type="button"
              onClick={() => onChange(0)}
              aria-label={`${label} 0원으로 지우기`}
              className="absolute right-7 p-1 text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="absolute right-3 text-xs font-semibold text-slate-400 pointer-events-none">
            원
          </span>
        </div>
      </div>

      {/* 항목 맞춤형 원클릭 스마트 칩 */}
      <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
        {chips.map((chip) => {
          const isActivePreset = chip.type === "set" && value === chip.value;
          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => {
                if (chip.type === "set") {
                  onChange(chip.value);
                } else {
                  onChange(Math.max(0, (value || 0) + chip.value));
                }
              }}
              className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-bold border transition-all whitespace-nowrap flex-1 ${
                isActivePreset
                  ? "bg-slate-900 border-slate-900 text-white shadow-2xs"
                  : chip.value < 0
                  ? "bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border-slate-200"
                  : "bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 border-slate-200"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [market, setMarket] = useState<Market>("smartstore");
  const [customFee, setCustomFee] = useState<number>(4.8);

  const [price, setPrice] = useState<number>(10000);
  const [productName, setProductName] = useState<string>("");
  const [shippingCustomer, setShippingCustomer] = useState<number>(3000);

  const [cost, setCost] = useState<number>(4000);
  const [shippingReal, setShippingReal] = useState<number>(3000);
  const [packing, setPacking] = useState<number>(200);
  const [other, setOther] = useState<number>(0);

  const [taxType, setTaxType] = useState<TaxType>("general");
  const [incomeTaxRate, setIncomeTaxRate] = useState<number>(0);
  const [sharedKeyword, setSharedKeyword] = useState<string>("");
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // 로컬스토리지 및 공유 URL 파라미터에서 초기값 복원
  useEffect(() => {
    const saved = localStorage.getItem("sellerCalcData");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.market && MARKET_PRESETS.some((p) => p.id === data.market)) {
          setMarket(data.market);
        }
        setCustomFee(data.customFee ?? 4.8);
        setPrice(data.price ?? 10000);
        setShippingCustomer(data.shippingCustomer ?? 3000);
        setCost(data.cost ?? 4000);
        setShippingReal(data.shippingReal ?? 3000);
        setPacking(data.packing ?? 200);
        setOther(data.other ?? 0);
        setTaxType(data.taxType ?? "general");
        setIncomeTaxRate(data.incomeTaxRate ?? 0);
      } catch (e) {
        console.error("저장된 계산 데이터 파싱 실패:", e);
      }
    }

    if (typeof window !== "undefined" && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const qParam = params.get("q");
      const marketParam = params.get("market") as Market | null;
      const priceParam = params.get("price");
      const costParam = params.get("cost");
      const scParam = params.get("sc");
      const srParam = params.get("sr");
      const packParam = params.get("pack");

      if (qParam) {
        const cleanQ = qParam.trim().slice(0, 60);
        setProductName(cleanQ);
        setSharedKeyword(cleanQ);
      }
      if (marketParam && MARKET_PRESETS.some((p) => p.id === marketParam)) {
        setMarket(marketParam);
        const preset = MARKET_PRESETS.find((p) => p.id === marketParam);
        if (preset && preset.id !== "custom") setCustomFee(preset.fee);
      }
      if (priceParam !== null && !Number.isNaN(Number(priceParam))) setPrice(Math.max(0, Number(priceParam)));
      if (costParam !== null && !Number.isNaN(Number(costParam))) setCost(Math.max(0, Number(costParam)));
      if (scParam !== null && !Number.isNaN(Number(scParam))) setShippingCustomer(Math.max(0, Number(scParam)));
      if (srParam !== null && !Number.isNaN(Number(srParam))) setShippingReal(Math.max(0, Number(srParam)));
      if (packParam !== null && !Number.isNaN(Number(packParam))) setPacking(Math.max(0, Number(packParam)));
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        "sellerCalcData",
        JSON.stringify({
          market,
          customFee,
          price,
          shippingCustomer,
          cost,
          shippingReal,
          packing,
          other,
          taxType,
          incomeTaxRate,
        })
      );
    }
  }, [market, customFee, price, shippingCustomer, cost, shippingReal, packing, other, taxType, incomeTaxRate, mounted]);

  const feeRate =
    market === "custom"
      ? customFee
      : MARKET_PRESETS.find((p) => p.id === market)?.fee || 0;

  const {
    totalRevenue,
    totalCost,
    marketFeeAmount,
    vat,
    incomeTax,
    netProfit,
    marginRate,
    roi,
  } = calculateMargin({
    price,
    shippingCustomer,
    cost,
    shippingReal,
    packing,
    other,
    feeRate,
    taxType,
    incomeTaxRate,
  });

  // 원가율 및 손익분기 최소 판매가 계산
  const costRatio = price > 0 ? Math.round((cost / price) * 100) : 0;
  const breakEvenPrice =
    feeRate < 100
      ? Math.max(
          0,
          Math.ceil(totalCost / (1 - feeRate / 100) - shippingCustomer)
        )
      : 0;

  // 마진 상태 진단 배지
  const getMarginStatus = () => {
    if (totalRevenue <= 0) {
      return { text: "금액을 입력해 주세요", cls: "bg-slate-100 text-slate-600" };
    }
    if (netProfit < 0) {
      return { text: "역마진 경고 (팔수록 적자)", cls: "bg-rose-100 text-rose-700" };
    }
    if (marginRate < 15) {
      return { text: "저마진 주의 (광고비 집행 주의)", cls: "bg-amber-100 text-amber-800" };
    }
    if (marginRate < 25) {
      return { text: "안정 마진 구간", cls: "bg-blue-100 text-primary" };
    }
    return { text: "고마진 우수 구조", cls: "bg-emerald-100 text-emerald-700" };
  };

  const marginStatus = getMarginStatus();

  const adjustFeeByStep = (delta: number) => {
    const base = feeRate;
    const next = Math.max(0, Math.min(99, Number((base + delta).toFixed(1))));
    setMarket("custom");
    setCustomFee(next);
  };

  const handleReset = () => {
    if (confirm("모든 입력값을 기본값으로 초기화하시겠습니까?")) {
      setMarket("smartstore");
      setCustomFee(4.8);
      setPrice(10000);
      setShippingCustomer(3000);
      setCost(4000);
      setShippingReal(3000);
      setPacking(200);
      setOther(0);
      setTaxType("general");
      setIncomeTaxRate(0);
    }
  };

  const handleApplyBenchmark = useCallback(
    ({
      productName: name,
      price: selectedPrice,
      recommendedCost,
      scrollToCalc,
    }: {
      productName: string;
      price: number;
      recommendedCost?: number;
      scrollToCalc?: boolean;
    }) => {
      setProductName(name);
      if (selectedPrice > 0) {
        setPrice(selectedPrice);
      }
      if (recommendedCost !== undefined && recommendedCost >= 0) {
        setCost(recommendedCost);
      }
      if (scrollToCalc && typeof document !== "undefined") {
        document.getElementById("calculator-section")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  const handleCopyShareLink = async () => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (productName.trim()) params.set("q", productName.trim());
    params.set("market", market);
    params.set("price", String(price));
    params.set("cost", String(cost));
    params.set("sc", String(shippingCustomer));
    params.set("sr", String(shippingReal));
    params.set("pack", String(packing));

    const shareUrl = `${window.location.origin}/?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      window.prompt("아래 마진 분석 링크를 복사해 공유하세요:", shareUrl);
    }
  };

  return (
    <div className="space-y-5">
      {/* 상단 소싱 판독 & 트렌드 검색바 */}
      <SearchBar
        initialKeyword={sharedKeyword}
        calculatorContext={{
          shippingCustomer,
          shippingReal,
          packing,
          other,
          feeRate,
          taxType,
          incomeTaxRate,
        }}
        onApplyBenchmark={handleApplyBenchmark}
      />

      {/* 슬림 실무 가이드 배너 */}
      <Link
        href="/tips"
        className="group flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl hover:border-primary transition-all shadow-2xs"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="shrink-0 bg-blue-50 text-primary text-[11px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> 실무 가이드
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate group-hover:text-primary transition-colors">
            팔수록 적자? 초보 셀러가 놓치는 숨은 수수료 &amp; 절세 공식
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary shrink-0 ml-1" />
      </Link>

      {productName && (
        <div className="bg-blue-50/70 border border-blue-200/80 text-slate-800 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between">
          <span>
            분석 중인 상품: <strong className="font-extrabold text-primary">{productName}</strong>
          </span>
          <button
            type="button"
            onClick={() => setProductName("")}
            className="text-slate-400 hover:text-slate-700 p-1"
            aria-label="선택된 상품 해제"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 메인 계산기 2단 레이아웃 */}
      <div id="calculator-section" className="flex flex-col md:flex-row gap-5 scroll-mt-20">
        {/* 왼쪽: 입력 영역 */}
        <div className="flex-[1.15] space-y-4">
          {/* 1. 마켓 및 수수료 설정 */}
          <section className="bg-white p-4 sm:p-5 rounded-2xl shadow-2xs border border-slate-200/90 space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-black">
                  1
                </span>
                판매 마켓 · 수수료
              </h2>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors"
              >
                <RefreshCcw className="w-3 h-3" /> 초기화
              </button>
            </div>

            {/* 3열 마켓 선택 카드 (수수료율 즉시 노출) */}
            <div className="grid grid-cols-3 gap-2">
              {MARKET_PRESETS.map((p) => {
                const isSelected = market === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setMarket(p.id);
                      if (p.id !== "custom") setCustomFee(p.fee);
                    }}
                    className={`min-h-[52px] py-2 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                        : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="text-xs font-extrabold leading-tight">{p.name}</span>
                    <span
                      className={`text-[10px] mt-0.5 font-medium ${
                        isSelected ? "text-slate-300" : "text-slate-400"
                      }`}
                    >
                      {p.subLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 잠금 없는 수수료 미세 조정 바 (-0.5% / 직접입력 / +0.5%) */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200/70 px-3.5 py-2.5 rounded-xl">
              <label htmlFor="fee-rate-input" className="text-xs sm:text-sm font-bold text-slate-700">
                적용 수수료율 미세 조정
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => adjustFeeByStep(-0.5)}
                  aria-label="수수료율 0.5% 내리기"
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="relative w-20">
                  <input
                    id="fee-rate-input"
                    type="number"
                    value={feeRate}
                    onFocus={(e) => e.currentTarget.select()}
                    onChange={(e) => {
                      setMarket("custom");
                      setCustomFee(Math.max(0, Math.min(99, Number(e.target.value))));
                    }}
                    step="0.1"
                    className="w-full text-right py-1.5 pl-2 pr-6 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-extrabold text-base text-slate-900"
                  />
                  <span className="absolute right-2 top-2 text-xs font-semibold text-slate-400 pointer-events-none">
                    %
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => adjustFeeByStep(0.5)}
                  aria-label="수수료율 0.5% 올리기"
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* 2. 매출 입력 (판매가 & 고객부담 배송비) */}
          <section className="bg-white p-4 sm:p-5 rounded-2xl shadow-2xs border border-slate-200/90 space-y-3">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-black">
                2
              </span>
              매출 · 배송비 설정
            </h2>

            <SmartMoneyInput
              label="상품 판매가"
              value={price}
              onChange={setPrice}
              chips={PRICE_CHIPS}
              highlight={true}
            />
            <SmartMoneyInput
              label="고객부담 배송비"
              value={shippingCustomer}
              onChange={setShippingCustomer}
              chips={CUSTOMER_SHIPPING_CHIPS}
            />
          </section>

          {/* 3. 비용 입력 (매입 원가, 택배비, 포장비, 광고비) */}
          <section className="bg-white p-4 sm:p-5 rounded-2xl shadow-2xs border border-slate-200/90 space-y-3">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-black">
                3
              </span>
              매입 원가 · 물류 비용
            </h2>

            <SmartMoneyInput
              label="매입 원가"
              badge={price > 0 ? `원가율 ${costRatio}%` : undefined}
              value={cost}
              onChange={setCost}
              chips={PRICE_CHIPS}
            />
            <SmartMoneyInput
              label="실제 출고 택배비"
              value={shippingReal}
              onChange={setShippingReal}
              chips={REAL_SHIPPING_CHIPS}
            />
            <SmartMoneyInput
              label="포장비 (박스·봉투)"
              value={packing}
              onChange={setPacking}
              chips={PACKING_CHIPS}
            />
            <SmartMoneyInput
              label="기타 비용 (광고비 등)"
              value={other}
              onChange={setOther}
              chips={AD_OTHER_CHIPS}
            />
          </section>

          {/* 4. 세금 설정 (과세유형 + 종소세 구간 원클릭 선택) */}
          <section className="bg-white p-4 sm:p-5 rounded-2xl shadow-2xs border border-slate-200/90 space-y-3.5">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-black">
                4
              </span>
              세금 설정 (부가세 · 소득세)
            </h2>

            {/* 과세 유형 3분할 세그먼트 */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                {[
                  { id: "general" as TaxType, label: "일반과세", sub: "부가세 10%" },
                  { id: "simplified" as TaxType, label: "간이과세", sub: "약 1.5%" },
                  { id: "taxfree" as TaxType, label: "면세사업자", sub: "부가세 0%" },
                ].map((t) => {
                  const active = taxType === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTaxType(t.id)}
                      className={`py-2 px-2 rounded-lg text-center transition-all ${
                        active
                          ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                          : "text-slate-500 hover:text-slate-800 font-semibold"
                      }`}
                    >
                      <div className="text-xs">{t.label}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{t.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 종합소득세율 프리셋 칩 + 직접 입력 */}
            <div className="bg-slate-50/80 border border-slate-200/70 p-3.5 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="income-tax-input" className="text-xs sm:text-sm font-bold text-slate-700">
                  예상 종합소득세율 반영
                </label>
                <div className="relative w-24">
                  <input
                    id="income-tax-input"
                    type="number"
                    value={incomeTaxRate}
                    onFocus={(e) => e.currentTarget.select()}
                    onChange={(e) =>
                      setIncomeTaxRate(Math.max(0, Math.min(50, Number(e.target.value))))
                    }
                    step="0.1"
                    className="w-full text-right py-1.5 pl-2 pr-6 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-extrabold text-base text-slate-900"
                  />
                  <span className="absolute right-2.5 top-2 text-xs font-semibold text-slate-400 pointer-events-none">
                    %
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: "미반영 0%", rate: 0 },
                  { label: "6.6% (초기)", rate: 6.6 },
                  { label: "16.5% (일반)", rate: 16.5 },
                  { label: "26.4% (고소득)", rate: 26.4 },
                ].map((opt) => (
                  <button
                    key={opt.rate}
                    type="button"
                    onClick={() => setIncomeTaxRate(opt.rate)}
                    className={`min-h-[32px] px-1.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      incomeTaxRate === opt.rate
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* 오른쪽: 정산 결과 스티키 카드 */}
        <div id="result-card" className="flex-[0.85] scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 p-5 sm:p-6 sticky top-20 overflow-hidden">
            {/* 상단 상태 배지 */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                건당 예상 정산 결과
              </h2>
              <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${marginStatus.cls}`}>
                {marginStatus.text}
              </span>
            </div>

            {/* 최종 순수익 히어로 박스 */}
            <div
              className={`p-4 rounded-xl text-center mb-4 border ${
                netProfit < 0
                  ? "bg-rose-50/70 border-rose-200"
                  : "bg-blue-50/50 border-blue-200/70"
              }`}
            >
              <div
                className={`font-bold text-xs mb-1 ${
                  netProfit < 0 ? "text-rose-600" : "text-primary"
                }`}
              >
                건당 최종 순수익
              </div>
              <div
                className={`text-3xl font-black tracking-tight ${
                  netProfit < 0 ? "text-rose-600" : "text-slate-900"
                }`}
              >
                {netProfit.toLocaleString()}
                <span className="text-lg font-bold text-slate-500 ml-1">원</span>
              </div>
            </div>

            {/* 마진율 & ROI */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-200/70">
                <div className="text-xs text-slate-500 mb-0.5 font-medium">순마진율</div>
                <div
                  className={`font-extrabold text-xl ${
                    marginRate < 0 ? "text-rose-600" : "text-primary"
                  }`}
                >
                  {marginRate.toFixed(1)}%
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-200/70">
                <div className="text-xs text-slate-500 mb-0.5 font-medium">투자수익률 (ROI)</div>
                <div
                  className={`font-extrabold text-xl ${
                    roi < 0 ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {roi.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* 상세 차감 명세서 */}
            <div className="space-y-2.5 text-sm border-t border-b border-slate-100 py-4 mb-4">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium">총 매출액 (판매가+배송비)</span>
                <span className="font-bold">{totalRevenue.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>원가 및 물류·광고비 합계</span>
                <span className="font-semibold text-slate-700">-{totalCost.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>마켓 수수료 ({feeRate}%)</span>
                <span className="font-semibold text-slate-700">-{marketFeeAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>예상 세금 (부가세+소득세)</span>
                <span className="font-semibold text-slate-700">-{(vat + incomeTax).toLocaleString()}원</span>
              </div>
              {breakEvenPrice > 0 && (
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200 text-xs text-slate-500">
                  <span>적자 면하는 최소 손익분기 판매가</span>
                  <span className="font-bold text-slate-800">{breakEvenPrice.toLocaleString()}원</span>
                </div>
              )}
            </div>

            {/* 공유 링크 복사 버튼 */}
            <button
              type="button"
              onClick={handleCopyShareLink}
              className={`min-h-[42px] w-full px-4 rounded-xl text-xs font-extrabold border flex items-center justify-center gap-1.5 transition-all ${
                copiedShare
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-slate-900 hover:bg-slate-800 border-slate-900 text-white"
              }`}
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> 분석 링크 복사 완료! 단톡방에 붙여넣으세요
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" /> 이 마진 분석표 링크 공유하기
                </>
              )}
            </button>

            {/* 매출 비중 바 시각화 */}
            <div className="mt-5">
              <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
                <Info className="w-3 h-3" /> 매출 구성 비중
              </div>
              <div className="h-3 w-full flex rounded-full overflow-hidden bg-slate-100">
                {totalRevenue > 0 && (
                  <>
                    <div
                      style={{ width: `${Math.min(100, (totalCost / totalRevenue) * 100)}%` }}
                      className="bg-slate-400"
                      title={`원가·물류비: ${((totalCost / totalRevenue) * 100).toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${Math.min(100, (marketFeeAmount / totalRevenue) * 100)}%` }}
                      className="bg-amber-400"
                      title={`수수료: ${((marketFeeAmount / totalRevenue) * 100).toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${Math.min(100, ((vat + incomeTax) / totalRevenue) * 100)}%` }}
                      className="bg-indigo-400"
                      title={`세금: ${(((vat + incomeTax) / totalRevenue) * 100).toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${Math.min(100, (Math.max(0, netProfit) / totalRevenue) * 100)}%` }}
                      className="bg-primary"
                      title={`순수익: ${marginRate.toFixed(1)}%`}
                    />
                  </>
                )}
              </div>
              <div className="flex text-[10px] justify-between mt-2 text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  원가·물류
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  수수료
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  세금
                </span>
                <span className="flex items-center gap-1 text-primary font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  순수익
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 통합 탭형 순수익 개선 & 사업자 절세 시뮬레이터 */}
      <ProfitBoostWidgets
        packing={packing}
        onChangePacking={setPacking}
        unitTaxAmount={vat + incomeTax}
        taxType={taxType}
        incomeTaxRate={incomeTaxRate}
      />

      {/* 셀러 꿀팁 메인 후킹 CTA 카드 */}
      <div className="bg-slate-900 rounded-2xl p-5 sm:p-7 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-blue-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> 셀러마진 실무 연구소 칼럼
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
              마진율 5% 더 올리는 소싱 · 물류 · 절세 실무 가이드
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              스마트스토어 vs 쿠팡 수수료 구조, 로켓그로스 보관료 방어법, 해외구매대행 관부가세 계산 공식까지 핵심 가이드를 무료로 확인하세요.
            </p>
          </div>
          <Link
            href="/tips"
            className="shrink-0 inline-flex items-center gap-1.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-primary hover:bg-primary/90 text-white transition-colors"
          >
            실무 칼럼 전체 보기
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* SEO 최적화를 위한 하단 텍스트 가이드 & FAQ */}
      <div id="guide" className="bg-white p-5 sm:p-8 rounded-2xl shadow-2xs border border-slate-200/90 space-y-8">
        <div className="text-center pb-6 border-b border-slate-100">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
            쇼핑몰 마진율 계산기 및 마켓별 수수료 가이드
          </h2>
          <p className="text-sm text-slate-500">
            스마트스토어, 쿠팡, 11번가 등 오픈마켓 판매자를 위한 정밀 순수익 분석 솔루션
          </p>
        </div>

        <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          <section>
            <h3 className="font-bold text-lg text-slate-900 mb-2">왜 정확한 마진 계산이 중요한가요?</h3>
            <p className="mb-2">
              스마트스토어, 쿠팡, 11번가 등 오픈마켓에 상품을 올리기 전 가장 먼저 해야 할 일은 바로 정확한 마진율 파악입니다. 겉보기에는 남는 장사 같아도 막상 결제 수수료, 연동 수수료, 배송비, 그리고 종합소득세 및 부가가치세까지 납부하고 나면 오히려 적자가 나는 경우(역마진)가 빈번하게 발생합니다.
            </p>
            <p>
              따라서 본 계산기를 통해 원가, 택배비, 포장 부자재 비용을 모두 기입하고 보수적으로 순수익을 세팅하는 습관을 들이는 것이 성공적인 셀러가 되는 지름길입니다.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-lg text-slate-900 mb-2">셀러마진 계산기의 주요 기능</h3>
            <ul className="list-disc pl-5 space-y-2 bg-slate-50 p-4 rounded-xl text-sm">
              <li>
                <strong>마켓별 수수료 실시간 반영</strong>: 스마트스토어, 쿠팡, 에이블리·지그재그, 11번가 등 주요 마켓의 평균 수수료율이 원클릭으로 자동 반영되며 0.1% 단위로 미세 조정이 가능합니다.
              </li>
              <li>
                <strong>세금 공제 로직 탑재</strong>: 일반과세자, 간이과세자, 면세사업자에 따른 부가가치세(VAT) 차이와 종합소득세 예상치를 미리 차감해 실제 통장에 남는 순수익을 보여줍니다.
              </li>
              <li>
                <strong>키워드 수요 및 도매 사입원가 역산</strong>: 상단 검색창에 소싱할 상품명을 입력하면 최근 30일 검색 수요 추이와 함께 목표 마진 20% 달성을 위한 도매 사입가 상한선을 자동으로 역산합니다.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-lg text-slate-900 mb-2">주요 오픈마켓 수수료율 및 정산 주기 비교표</h3>
            <p className="mb-3 text-slate-600 text-sm">
              플랫폼마다 결제 수수료, 매출 연동 수수료, 정산 주기가 상이하므로 입점 전 아래 기준표를 참고하여 판매가를 설계하시기 바랍니다.
            </p>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-800">
                    <th className="p-3 font-bold">플랫폼</th>
                    <th className="p-3 font-bold">평균 수수료율 (VAT 별도)</th>
                    <th className="p-3 font-bold">정산 주기</th>
                    <th className="p-3 font-bold">핵심 특징</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">네이버 스마트스토어</td>
                    <td className="p-3">약 3.63% ~ 5.63%</td>
                    <td className="p-3">구매확정 후 +1영업일 (빠른정산 가능)</td>
                    <td className="p-3">국내 최저 수준 수수료, 검색 유입 연동 수수료(1.81%) 별도</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">쿠팡 마켓플레이스(윙)</td>
                    <td className="p-3">약 5.0% ~ 10.8%</td>
                    <td className="p-3">주정산 / 월정산 (구매확정 기준)</td>
                    <td className="p-3">강력한 트래픽과 아이템위너 시스템, 배송비에도 약 3.3% 수수료 부과</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">쿠팡 로켓그로스</td>
                    <td className="p-3">판매수수료 + 입출고·배송 요금</td>
                    <td className="p-3">구매확정일 기준 정산 규정 적용</td>
                    <td className="p-3">로켓배송 배지 부여, 쿠팡 풀필먼트 센터 입고·보관·CS 일괄 대행</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">11번가 / G마켓 / 옥션</td>
                    <td className="p-3">약 8.0% ~ 13.0%</td>
                    <td className="p-3">구매확정 후 +1~2영업일</td>
                    <td className="p-3">기획전 및 쿠폰 할인 프로모션 비중이 높음, 카테고리별 수수료 편차 큼</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900">분야별 셀러 실무 심층 가이드</h3>
              <Link href="/tips" className="text-xs font-bold text-primary hover:underline">
                전체 칼럼 보기 &rarr;
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                href="/tips/smartstore-vs-coupang"
                className="p-4 rounded-xl border border-slate-200 hover:border-primary transition-colors bg-slate-50/50"
              >
                <div className="text-xs font-bold text-primary mb-1">수수료 비교</div>
                <div className="font-bold text-slate-900 text-sm mb-1">
                  스마트스토어 vs 쿠팡 수수료 및 마진율 완벽 비교
                </div>
                <div className="text-xs text-slate-500 line-clamp-1">
                  결제 수수료와 연동 수수료, 배송비 수수료까지 반영한 실전 비교
                </div>
              </Link>
              <Link
                href="/tips/tax-differences"
                className="p-4 rounded-xl border border-slate-200 hover:border-primary transition-colors bg-slate-50/50"
              >
                <div className="text-xs font-bold text-primary mb-1">세무·절세</div>
                <div className="font-bold text-slate-900 text-sm mb-1">
                  간이과세자 vs 일반과세자 세금 차이와 전환 타이밍
                </div>
                <div className="text-xs text-slate-500 line-clamp-1">
                  연 매출 기준과 부가가치세 계산 공식, 매입세액 공제 전략
                </div>
              </Link>
              <Link
                href="/tips/coupang-rocket-growth-guide"
                className="p-4 rounded-xl border border-slate-200 hover:border-primary transition-colors bg-slate-50/50"
              >
                <div className="text-xs font-bold text-primary mb-1">풀필먼트</div>
                <div className="font-bold text-slate-900 text-sm mb-1">
                  쿠팡 로켓그로스 입점 수수료 및 물류 보관비 계산 가이드
                </div>
                <div className="text-xs text-slate-500 line-clamp-1">
                  크기 구간별 입출고 요금과 장기 보관료 할증 방어 노하우
                </div>
              </Link>
              <Link
                href="/tips/ad-roas-bep-calculation"
                className="p-4 rounded-xl border border-slate-200 hover:border-primary transition-colors bg-slate-50/50"
              >
                <div className="text-xs font-bold text-primary mb-1">마케팅·ROAS</div>
                <div className="font-bold text-slate-900 text-sm mb-1">
                  검색광고 ROAS 분석과 손익분기점(BEP) 광고비 계산 공식
                </div>
                <div className="text-xs text-slate-500 line-clamp-1">
                  마진율 구간별 최소 목표 ROAS 산출과 광고비 누수 차단법
                </div>
              </Link>
              <Link
                href="/tips/overseas-purchasing-customs-guide"
                className="p-4 rounded-xl border border-slate-200 hover:border-primary transition-colors bg-slate-50/50"
              >
                <div className="text-xs font-bold text-primary mb-1">글로벌 소싱</div>
                <div className="font-bold text-slate-900 text-sm mb-1">
                  해외구매대행 관부가세 산출 공식 및 목록통관 실무
                </div>
                <div className="text-xs text-slate-500 line-clamp-1">
                  미화 150달러 면세 기준과 배대지 운임, 순액 매출 소명 절차
                </div>
              </Link>
              <Link
                href="/tips/consignment-vs-wholesale-sourcing"
                className="p-4 rounded-xl border border-slate-200 hover:border-primary transition-colors bg-slate-50/50"
              >
                <div className="text-xs font-bold text-primary mb-1">소싱 전략</div>
                <div className="font-bold text-slate-900 text-sm mb-1">
                  위탁판매 vs 사입(도매) 소싱 비교 및 창업 로드맵
                </div>
                <div className="text-xs text-slate-500 line-clamp-1">
                  초기 자본금 규모에 맞춘 무실패 3단계 하이브리드 사입 전환법
                </div>
              </Link>
            </div>
          </section>

          <section className="pt-6 border-t border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 mb-4">자주 묻는 질문 (FAQ)</h3>
            <div className="space-y-3">
              <div className="bg-slate-50/60 border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-800 mb-1.5 text-sm sm:text-base">
                  Q. 마진율과 투자수익률(ROI)은 무엇이 다른가요?
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm">
                  마진율은 <strong>총 매출액 대비 순수익의 비율</strong>을 뜻하며, ROI(Return On Investment)는{" "}
                  <strong>내가 투자한 총비용(매입 원가+택배비 등) 대비 얻은 순수익의 비율</strong>을 말합니다. 자본금이 적은 초보 셀러일수록 단순히 마진율만 보지 말고 적은 돈으로 높은 수익을 내는 ROI가 높은 상품을 소싱하는 것이 유리합니다.
                </p>
              </div>
              <div className="bg-slate-50/60 border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-800 mb-1.5 text-sm sm:text-base">
                  Q. 쿠팡 수수료는 왜 카테고리마다 다른가요?
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm">
                  쿠팡은 전자제품, 패션, 식품 등 카테고리별로 최저 5%에서 최고 11% 안팎의 판매 수수료를 적용하고 있습니다. 본 계산기에서는 평균적인 10.8%를 기본 프리셋으로 제공하며, 미세 조정 버튼으로 내 카테고리의 정확한 수수료율을 입력할 수 있습니다.
                </p>
              </div>
              <div className="bg-slate-50/60 border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-800 mb-1.5 text-sm sm:text-base">
                  Q. 간이과세자인데 부가세를 빼고 계산해야 하나요?
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm">
                  간이과세자의 경우 일반과세자(10%)에 비해 부가가치세 부담(약 1.5% 수준)이 적지만, 매출이 성장하면 일반과세자로 전환되므로 처음부터 일반과세 기준으로도 마진이 남는지 함께 검증하는 것이 안전합니다.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 모바일 전용 하단 고정 실시간 정산 결과 바 (스크롤 없이 순수익·마진율 즉시 확인) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-t border-white/10 px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
              <span>실시간 순수익</span>
              <span
                className={`font-extrabold px-1.5 py-0.2 rounded ${
                  marginRate < 0
                    ? "bg-rose-500/20 text-rose-300"
                    : "bg-blue-500/20 text-blue-300"
                }`}
              >
                마진 {marginRate.toFixed(1)}%
              </span>
            </div>
            <div
              className={`text-lg font-black tracking-tight truncate ${
                netProfit < 0 ? "text-rose-400" : "text-white"
              }`}
            >
              {netProfit.toLocaleString()}원
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() =>
                document.getElementById("result-card")?.scrollIntoView({ behavior: "smooth" })
              }
              className="min-h-[38px] px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1 transition-colors"
            >
              상세 <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="min-h-[38px] px-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-extrabold flex items-center gap-1 transition-colors"
            >
              {copiedShare ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedShare ? "복사됨" : "공유"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
