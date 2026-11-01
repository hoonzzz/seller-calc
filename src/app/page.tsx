"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Calculator, Store, DollarSign, PieChart, Info, RefreshCcw, Sparkles, ChevronRight, Share2, Check } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ProfitBoostWidgets from "@/components/ProfitBoostWidgets";

import { calculateMargin, TaxType } from "@/lib/calculator";

type Market = "smartstore" | "coupang" | "11st" | "gmarket" | "custom";

interface Preset {
  id: Market;
  name: string;
  fee: number;
}
const MARKET_PRESETS: Preset[] = [
  { id: "smartstore", name: "스마트스토어", fee: 4.8 }, // 평균 4~5%
  { id: "coupang", name: "쿠팡", fee: 10.8 },
  { id: "11st", name: "11번가", fee: 13.0 },
  { id: "gmarket", name: "G마켓", fee: 13.0 },
  { id: "custom", name: "직접입력", fee: 0 },
];

function QuickAmountInput({ 
  label, 
  value, 
  onChange, 
  highlight = false,
  showQuickButtons = true
}: { 
  label: string, 
  value: number, 
  onChange: (val: number) => void,
  highlight?: boolean,
  showQuickButtons?: boolean
}) {
  return (
    <div className={`flex flex-col p-3 rounded-xl border ${highlight ? 'bg-green-50/30 border-green-100' : 'bg-gray-50/50 border-gray-100'}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-gray-700">{label}</label>
        <div className="relative">
          <input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`w-40 text-right py-2 pl-2 pr-8 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-shadow ${highlight ? 'font-bold text-lg' : 'font-medium text-base'}`}
          />
          <span className="absolute right-3 top-2.5 text-sm text-gray-500 pointer-events-none">원</span>
        </div>
      </div>
      {showQuickButtons && (
        <div className="flex flex-col gap-1 mt-3">
          {/* 플러스 버튼 */}
          <div className="flex w-full justify-between gap-1">
            {[100000, 50000, 10000, 5000, 1000, 100].map(amt => (
              <button
                key={`plus-${amt}`}
                onClick={() => onChange(Number(value || 0) + amt)}
                className="py-1.5 bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600 text-[10px] md:text-xs font-bold rounded shadow-sm border border-gray-200 transition-colors flex-1"
              >
                +{amt >= 10000 ? `${amt/10000}만` : amt >= 1000 ? `${amt/1000}천` : amt}
              </button>
            ))}
          </div>
          {/* 마이너스 버튼 & 초기화 */}
          <div className="flex w-full justify-between gap-1">
            {[100000, 50000, 10000, 5000, 1000].map(amt => (
              <button
                key={`minus-${amt}`}
                onClick={() => onChange(Math.max(0, Number(value || 0) - amt))}
                className="py-1.5 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 text-[10px] md:text-xs font-bold rounded shadow-sm border border-gray-200 transition-colors flex-1"
              >
                -{amt >= 10000 ? `${amt/10000}만` : amt >= 1000 ? `${amt/1000}천` : amt}
              </button>
            ))}
            <button
              onClick={() => onChange(0)}
              className="py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] md:text-xs font-extrabold rounded shadow-sm border border-gray-200 transition-colors flex-1"
            >
              초기화
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [market, setMarket] = useState<Market>("smartstore");
  const [customFee, setCustomFee] = useState<number>(4.8);
  
  const [price, setPrice] = useState<number>(10000); // 판매가
  const [productName, setProductName] = useState<string>(""); // 상품명
  const [shippingCustomer, setShippingCustomer] = useState<number>(3000); // 고객부담 배송비
  
  const [cost, setCost] = useState<number>(4000); // 매입원가
  const [shippingReal, setShippingReal] = useState<number>(3000); // 실제 택배비
  const [packing, setPacking] = useState<number>(200); // 포장비
  const [other, setOther] = useState<number>(0); // 기타비용
  
  const [taxType, setTaxType] = useState<TaxType>("general");
  const [incomeTaxRate, setIncomeTaxRate] = useState<number>(0); // 소득세율
  const [sharedKeyword, setSharedKeyword] = useState<string>("");
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // 로컬스토리지 및 공유 URL 파라미터(?q=...&price=...)에서 초기값 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("sellerCalcData");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setMarket(data.market || "smartstore");
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

    // [킬러 엔진 5] 공유된 소싱 견적서 URL 파라미터 파싱 (SSR 정적 생성을 해치지 않도록 클라이언트 마운트 시 처리)
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
      }
      if (priceParam !== null && !Number.isNaN(Number(priceParam))) setPrice(Math.max(0, Number(priceParam)));
      if (costParam !== null && !Number.isNaN(Number(costParam))) setCost(Math.max(0, Number(costParam)));
      if (scParam !== null && !Number.isNaN(Number(scParam))) setShippingCustomer(Math.max(0, Number(scParam)));
      if (srParam !== null && !Number.isNaN(Number(srParam))) setShippingReal(Math.max(0, Number(srParam)));
      if (packParam !== null && !Number.isNaN(Number(packParam))) setPacking(Math.max(0, Number(packParam)));
    }

    setMounted(true);
  }, []);

  // 상태 변경 시 로컬스토리지 저장
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sellerCalcData", JSON.stringify({
        market, customFee, price, shippingCustomer, cost, shippingReal, packing, other, taxType, incomeTaxRate
      }));
    }
  }, [market, customFee, price, shippingCustomer, cost, shippingReal, packing, other, taxType, incomeTaxRate, mounted]);

  // 계산 로직
  const feeRate = market === "custom" ? customFee : (MARKET_PRESETS.find(p => p.id === market)?.fee || 0);
  
  const {
    totalRevenue,
    totalCost,
    marketFeeAmount,
    vat,
    incomeTax,
    netProfit,
    marginRate,
    roi
  } = calculateMargin({
    price,
    shippingCustomer,
    cost,
    shippingReal,
    packing,
    other,
    feeRate,
    taxType,
    incomeTaxRate
  });

  // 초기화 함수
  const handleReset = () => {
    if (confirm("모든 입력값을 초기화하시겠습니까?")) {
      setMarket("smartstore");
      setCustomFee(4.8);
      setPrice(0);
      setShippingCustomer(0);
      setCost(0);
      setShippingReal(0);
      setPacking(0);
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

  // [킬러 엔진 5] 1초 소싱 견적서 링크 복사 함수
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
    <div className="space-y-6 animate-in fade-in duration-500">
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

      {/* 셀러 꿀팁 상단 띠배너 */}
      <Link 
        href="/tips" 
        className="group flex items-center justify-between p-3 sm:p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/70 rounded-xl hover:border-[#03C75A] transition-all shadow-xs hover:shadow-sm"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex-shrink-0 bg-[#03C75A] text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3" /> 필독 꿀팁
          </span>
          <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate group-hover:text-[#03C75A] transition-colors">
            팔수록 적자? 초보 셀러가 꼭 알아야 할 숨은 비용 &amp; 절세 비법 💡
          </span>
        </div>
        <span className="flex-shrink-0 text-xs font-bold text-[#03C75A] flex items-center group-hover:translate-x-0.5 transition-transform ml-2">
          보러가기 <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </Link>

      {productName && (
        <div className="bg-primary/5 border border-primary/20 text-primary p-3 rounded-lg text-sm font-medium flex items-center justify-between mb-2">
          <span>분석 중인 상품: <strong>{productName}</strong></span>
          <button onClick={() => setProductName("")} className="text-gray-400 hover:text-red-500">✕</button>
        </div>
      )}

      <div id="calculator-section" className="flex flex-col md:flex-row gap-6 scroll-mt-20">
        
        {/* 왼쪽: 입력 폼 */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-border">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" /> 
              마켓 설정
            </h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {MARKET_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setMarket(p.id);
                    if (p.id !== "custom") setCustomFee(p.fee);
                  }}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    market === p.id 
                      ? "bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2" 
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            
            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
              <label className="text-sm font-medium">적용 수수료율 (%)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customFee}
                  onChange={(e) => {
                    setMarket("custom");
                    setCustomFee(Number(e.target.value));
                  }}
                  disabled={market !== "custom"}
                  className="w-24 text-right p-1.5 rounded border border-border focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-100 disabled:text-gray-500 font-semibold"
                  step="0.1"
                />
                <span className="text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-border space-y-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" /> 
              매출 입력
            </h2>
            
            <div className="space-y-4">
              <QuickAmountInput label="판매가" value={price} onChange={setPrice} highlight={true} />
              <QuickAmountInput label="고객부담 배송비" value={shippingCustomer} onChange={setShippingCustomer} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-border space-y-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-orange-500" /> 
              비용 입력
            </h2>
            
            <div className="space-y-4">
              <QuickAmountInput label="매입 원가 (상품대)" value={cost} onChange={setCost} />
              <QuickAmountInput label="실제 택배비" value={shippingReal} onChange={setShippingReal} />
              <QuickAmountInput label="포장비 (부자재 등)" value={packing} onChange={setPacking} showQuickButtons={false} />
              <QuickAmountInput label="기타 비용 (광고비 등)" value={other} onChange={setOther} showQuickButtons={false} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-border space-y-4">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-500" /> 
              세금 설정
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">과세 유형 (부가세용)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setTaxType("general")} className={`py-1.5 rounded-md text-sm transition-colors ${taxType === "general" ? "bg-purple-100 text-purple-700 border-purple-300 font-bold border" : "bg-gray-50 text-gray-600 border border-gray-200"}`}>일반과세</button>
                  <button onClick={() => setTaxType("simplified")} className={`py-1.5 rounded-md text-sm transition-colors ${taxType === "simplified" ? "bg-purple-100 text-purple-700 border-purple-300 font-bold border" : "bg-gray-50 text-gray-600 border border-gray-200"}`}>간이과세</button>
                  <button onClick={() => setTaxType("taxfree")} className={`py-1.5 rounded-md text-sm transition-colors ${taxType === "taxfree" ? "bg-purple-100 text-purple-700 border-purple-300 font-bold border" : "bg-gray-50 text-gray-600 border border-gray-200"}`}>면세</button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="text-sm font-medium text-gray-700">종합소득세율 (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={incomeTaxRate}
                    onChange={(e) => setIncomeTaxRate(Number(e.target.value))}
                    className="w-24 text-right p-1.5 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none text-sm"
                    step="1"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500 pointer-events-none">%</span>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleReset}
            className="w-full py-3 flex items-center justify-center gap-2 text-muted-foreground hover:bg-gray-100 rounded-xl transition-colors"
          >
            <RefreshCcw className="w-4 h-4" /> 입력 초기화
          </button>
          
        </div>

        {/* 오른쪽: 결과 요약 스티키 카드 */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl border border-primary/20 p-6 sticky top-20 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-blue-400"></div>
            
            <h2 className="text-xl font-bold mb-6 text-center">예상 정산 결과</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-gray-600">
                <span>총 매출액</span>
                <span className="font-semibold text-lg">{totalRevenue.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center text-red-500">
                <span>- 총 비용 (원가 등)</span>
                <span>{totalCost.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center text-orange-500">
                <span>- 마켓 수수료 ({feeRate}%)</span>
                <span>{marketFeeAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center text-purple-500">
                <span>- 세금 (부가세+소득세)</span>
                <span>{(vat + incomeTax).toLocaleString()}원</span>
              </div>
            </div>
            
            <div className="h-px w-full bg-gray-200 mb-6"></div>

            <div className="bg-primary/5 p-4 rounded-xl text-center mb-6 border border-primary/10">
              <div className="text-primary font-bold text-sm mb-1">최종 순수익</div>
              <div className="text-3xl font-black text-gray-900 tracking-tight">
                {netProfit.toLocaleString()}<span className="text-xl font-medium text-gray-600 ml-1">원</span>
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1 bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">마진율</div>
                <div className="font-bold text-xl text-blue-600">{marginRate.toFixed(1)}%</div>
              </div>
              <div className="flex-1 bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">투자수익률(ROI)</div>
                <div className="font-bold text-xl text-green-600">
                  {roi.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* [킬러 엔진 5] 동업자·단톡방 1초 소싱 견적서 공유 버튼 */}
            <button
              type="button"
              onClick={handleCopyShareLink}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold border flex items-center justify-center gap-1.5 transition-all ${
                copiedShare
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
              }`}
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> 분석 링크 복사 완료! 단톡방에 붙여넣으세요
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-primary" /> 이 마진 분석표 링크 복사 (동업자·단톡방 공유)
                </>
              )}
            </button>

            {/* 막대형 비용 시각화 */}
            <div className="mt-6">
              <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                <Info className="w-3 h-3" /> 매출 비중 한눈에 보기
              </div>
              <div className="h-4 w-full flex rounded-full overflow-hidden bg-gray-100 shadow-inner">
                {totalRevenue > 0 && (
                  <>
                    <div style={{ width: `${(totalCost / totalRevenue) * 100}%` }} className="bg-red-400" title={`비용: ${((totalCost/totalRevenue)*100).toFixed(1)}%`}></div>
                    <div style={{ width: `${(marketFeeAmount / totalRevenue) * 100}%` }} className="bg-orange-400" title={`수수료: ${((marketFeeAmount/totalRevenue)*100).toFixed(1)}%`}></div>
                    <div style={{ width: `${((vat + incomeTax) / totalRevenue) * 100}%` }} className="bg-purple-400" title={`세금: ${(((vat+incomeTax)/totalRevenue)*100).toFixed(1)}%`}></div>
                    <div style={{ width: `${(Math.max(0, netProfit) / totalRevenue) * 100}%` }} className="bg-primary" title={`순수익: ${marginRate.toFixed(1)}%`}></div>
                  </>
                )}
              </div>
              <div className="flex text-[10px] justify-between mt-2 text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span>비용</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400"></span>수수료</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400"></span>세금</span>
                <span className="flex items-center gap-1 text-primary font-medium"><span className="w-2 h-2 rounded-full bg-primary"></span>순수익</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* [킬러 엔진 2 & 3] 연간 포장비 손실 시뮬레이터 & 세금 방어용 경비처리 장비 체감가 계산기 */}
      <ProfitBoostWidgets
        packing={packing}
        onChangePacking={setPacking}
        unitTaxAmount={vat + incomeTax}
        taxType={taxType}
        incomeTaxRate={incomeTaxRate}
      />

      {/* 셀러 꿀팁 메인 후킹 CTA 카드 */}
      <div className="mt-8 bg-gradient-to-br from-gray-900 via-gray-900 to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-[#03C75A]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#03C75A]/20 text-[#03C75A] text-xs font-bold border border-[#03C75A]/30">
              <Sparkles className="w-3.5 h-3.5" /> 실전 셀러 노하우 무료 공개
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
              마진율 5% 더 올리는 소싱 &amp; 절세 시크릿
            </h3>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-xl">
              스마트스토어 vs 쿠팡 수수료 비교부터 간이과세자 부가세 환급 타이밍, 황금 키워드 소싱 3단계 공식까지 현직 셀러들의 실전 팁을 지금 확인해보세요.
            </p>
          </div>
          <Link
            href="/tips"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-[#03C75A] hover:bg-[#03C75A]/90 text-white shadow-lg hover:shadow-emerald-500/20 transition-all hover:scale-102"
          >
            셀러 꿀팁 보러가기
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* SEO 최적화를 위한 하단 텍스트 가이드 & FAQ */}
      <div id="guide" className="mt-10 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border space-y-8">
        <div className="text-center pb-6 border-b border-gray-100">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">쇼핑몰 마진율 계산기 및 마켓별 수수료 가이드</h2>
          <p className="text-gray-500">스마트스토어, 쿠팡, 11번가 등 오픈마켓 판매자를 위한 완벽한 순수익 분석 솔루션</p>
        </div>
        
        <div className="space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
          <section>
            <h3 className="font-bold text-xl text-[#03C75A] mb-3">왜 정확한 마진 계산이 중요한가요?</h3>
            <p className="mb-2">스마트스토어, 쿠팡, 11번가 등 오픈마켓에 상품을 올리기 전 가장 먼저 해야 할 일은 바로 정확한 마진율 파악입니다. 겉보기에는 남는 장사 같아도 막상 결제 수수료, 연동 수수료, 배송비, 그리고 종합소득세 및 부가가치세까지 납부하고 나면 오히려 적자가 나는 경우(역마진)가 빈번하게 발생합니다.</p>
            <p>따라서, 본 계산기를 통해 원가, 택배비, 포장 부자재 비용을 모두 기입하고 보수적으로 순수익을 세팅하는 습관을 들이는 것이 성공적인 셀러가 되는 지름길입니다.</p>
          </section>

          <section>
            <h3 className="font-bold text-xl text-[#03C75A] mb-3">셀러마진 계산기의 주요 기능</h3>
            <ul className="list-disc pl-5 space-y-2 bg-gray-50 p-4 rounded-xl">
              <li><strong>마켓별 수수료 실시간 반영</strong>: 스마트스토어(약 6%), 쿠팡(약 11%), 11번가 등 주요 마켓의 평균 수수료율이 버튼 하나로 자동 반영됩니다.</li>
              <li><strong>세금 공제 로직 탑재</strong>: 일반과세자, 간이과세자, 면세사업자에 따른 부가가치세(VAT) 차이와 연말 종합소득세 예상치를 미리 차감해 실제 통장에 꽂히는 진짜 마진을 보여줍니다.</li>
              <li><strong>무료 키워드 트렌드 분석</strong>: 상단 검색창에 소싱할 상품명을 입력하면, 최근 30일간의 네이버 검색 트렌드 지수를 보여주어 수요 증감을 파악할 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-xl text-[#03C75A] mb-3">주요 오픈마켓 수수료율 및 정산 주기 비교표</h3>
            <p className="mb-3 text-gray-600">플랫폼마다 결제 수수료, 매출 연동 수수료, 정산 주기가 상이하므로 입점 전 아래 기준표를 참고하여 판매가를 설계하시기 바랍니다.</p>
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-800">
                    <th className="p-3 font-bold">플랫폼</th>
                    <th className="p-3 font-bold">평균 수수료율 (VAT 별도)</th>
                    <th className="p-3 font-bold">정산 주기</th>
                    <th className="p-3 font-bold">핵심 특징</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  <tr>
                    <td className="p-3 font-semibold text-gray-900">네이버 스마트스토어</td>
                    <td className="p-3">약 3.63% ~ 5.63%</td>
                    <td className="p-3">구매확정 후 +1영업일 (빠른정산 가능)</td>
                    <td className="p-3">국내 최저 수준 수수료, 검색 유입 연동 수수료(1.81%) 별도</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-900">쿠팡 마켓플레이스(윙)</td>
                    <td className="p-3">약 5.0% ~ 10.8%</td>
                    <td className="p-3">주정산 / 월정산 (구매확정 기준)</td>
                    <td className="p-3">강력한 트래픽과 아이템위너 시스템, 배송비에도 약 3.3% 수수료 부과</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-900">쿠팡 로켓그로스</td>
                    <td className="p-3">판매수수료 + 입출고·배송 요금</td>
                    <td className="p-3">구매확정일 기준 정산 규정 적용</td>
                    <td className="p-3">로켓배송 배지 부여, 쿠팡 풀필먼트 센터 입고·보관·CS 일괄 대행</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-900">11번가 / G마켓 / 옥션</td>
                    <td className="p-3">약 8.0% ~ 13.0%</td>
                    <td className="p-3">구매확정 후 +1~2영업일</td>
                    <td className="p-3">기획전 및 쿠폰 할인 프로모션 비중이 높음, 카테고리별 수수료 편차 큼</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-gray-900">분야별 셀러 실무 심층 가이드</h3>
              <Link href="/tips" className="text-xs font-bold text-[#03C75A] hover:underline">전체 칼럼 보기 &rarr;</Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/tips/smartstore-vs-coupang" className="p-4 rounded-xl border border-gray-200 hover:border-[#03C75A] transition-colors bg-gray-50/50">
                <div className="text-xs font-bold text-[#03C75A] mb-1">수수료 비교</div>
                <div className="font-bold text-gray-900 text-sm mb-1">스마트스토어 vs 쿠팡 수수료 및 마진율 완벽 비교</div>
                <div className="text-xs text-gray-500 line-clamp-1">결제 수수료와 연동 수수료, 배송비 수수료까지 반영한 실전 비교</div>
              </Link>
              <Link href="/tips/tax-differences" className="p-4 rounded-xl border border-gray-200 hover:border-[#03C75A] transition-colors bg-gray-50/50">
                <div className="text-xs font-bold text-[#03C75A] mb-1">세무·절세</div>
                <div className="font-bold text-gray-900 text-sm mb-1">간이과세자 vs 일반과세자 세금 차이와 전환 타이밍</div>
                <div className="text-xs text-gray-500 line-clamp-1">연 매출 기준과 부가가치세 계산 공식, 매입세액 공제 전략</div>
              </Link>
              <Link href="/tips/coupang-rocket-growth-guide" className="p-4 rounded-xl border border-gray-200 hover:border-[#03C75A] transition-colors bg-gray-50/50">
                <div className="text-xs font-bold text-[#03C75A] mb-1">풀필먼트</div>
                <div className="font-bold text-gray-900 text-sm mb-1">쿠팡 로켓그로스 입점 수수료 및 물류 보관비 계산 가이드</div>
                <div className="text-xs text-gray-500 line-clamp-1">크기 구간별 입출고 요금과 장기 보관료 할증 방어 노하우</div>
              </Link>
              <Link href="/tips/ad-roas-bep-calculation" className="p-4 rounded-xl border border-gray-200 hover:border-[#03C75A] transition-colors bg-gray-50/50">
                <div className="text-xs font-bold text-[#03C75A] mb-1">마케팅·ROAS</div>
                <div className="font-bold text-gray-900 text-sm mb-1">검색광고 ROAS 분석과 손익분기점(BEP) 광고비 계산 공식</div>
                <div className="text-xs text-gray-500 line-clamp-1">마진율 구간별 최소 목표 ROAS 산출과 광고비 누수 차단법</div>
              </Link>
              <Link href="/tips/overseas-purchasing-customs-guide" className="p-4 rounded-xl border border-gray-200 hover:border-[#03C75A] transition-colors bg-gray-50/50">
                <div className="text-xs font-bold text-[#03C75A] mb-1">글로벌 소싱</div>
                <div className="font-bold text-gray-900 text-sm mb-1">해외구매대행 관부가세 산출 공식 및 목록통관 실무</div>
                <div className="text-xs text-gray-500 line-clamp-1">미화 150달러 면세 기준과 배대지 운임, 순액 매출 소명 절차</div>
              </Link>
              <Link href="/tips/consignment-vs-wholesale-sourcing" className="p-4 rounded-xl border border-gray-200 hover:border-[#03C75A] transition-colors bg-gray-50/50">
                <div className="text-xs font-bold text-[#03C75A] mb-1">소싱 전략</div>
                <div className="font-bold text-gray-900 text-sm mb-1">위탁판매 vs 사입(도매) 소싱 비교 및 창업 로드맵</div>
                <div className="text-xs text-gray-500 line-clamp-1">초기 자본금 규모에 맞춘 무실패 3단계 하이브리드 사입 전환법</div>
              </Link>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h3 className="font-bold text-xl text-gray-900 mb-4">자주 묻는 질문 (FAQ)</h3>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">Q. 마진율과 투자수익률(ROI)은 무엇이 다른가요?</h4>
                <p className="text-gray-600">마진율은 <strong>총 매출액 대비 순수익의 비율</strong>을 뜻하며, ROI(Return On Investment)는 <strong>내가 투자한 총비용(매입 원가+택배비 등) 대비 얻은 순수익의 비율</strong>을 말합니다. 자본금이 적은 초보 셀러일수록 단순히 마진율만 보지 말고, 적은 돈을 투자해 큰 돈을 벌어들이는 ROI가 높은 상품을 소싱하는 것이 유리합니다.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">Q. 쿠팡 수수료는 왜 카테고리마다 다른가요?</h4>
                <p className="text-gray-600">쿠팡은 전자제품, 패션, 식품 등 카테고리별로 최저 5%에서 최고 11% 이상의 각기 다른 판매 수수료를 적용하고 있습니다. 본 계산기에서는 가장 보수적인 접근을 위해 평균적으로 11%의 수수료율을 기본 프리셋으로 제공하고 있으며, 필요시 사용자가 직접 수정할 수 있습니다.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">Q. 간이과세자인데 부가세를 빼고 계산해야 하나요?</h4>
                <p className="text-gray-600">간이과세자의 경우 일반과세자(10%)에 비해 부가가치세 부담(약 1.5% 수준)이 매우 적습니다. 하지만 매출 규모가 커지면 언제든 일반과세자로 전환될 수 있으므로, 처음부터 10%의 부가세를 제외하고 마진을 계산하는 보수적인 습관을 들이는 것이 좋습니다.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
