"use client";

import { useState, useEffect } from "react";
import { Calculator, Store, DollarSign, PieChart, Info, RefreshCcw } from "lucide-react";
import SearchBar from "@/components/SearchBar";

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

  // 로컬스토리지에서 불러오기
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
        console.error("Failed to parse saved data", e);
      }
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

  const handleSelectProduct = (name: string, selectedPrice: number) => {
    setProductName(name);
    if (selectedPrice > 0) {
      setPrice(selectedPrice);
    }
  };

  if (!mounted) return <div className="animate-pulse h-screen bg-gray-100 rounded-xl" />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SearchBar onSelectProduct={handleSelectProduct} />

      {productName && (
        <div className="bg-primary/5 border border-primary/20 text-primary p-3 rounded-lg text-sm font-medium flex items-center justify-between mb-2">
          <span>선택된 상품: {productName}</span>
          <button onClick={() => setProductName("")} className="text-gray-400 hover:text-red-500">✕</button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        
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
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" /> 
              매출 입력
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">판매가</label>
                <div className="relative">
                  <input
                    type="number"
                    value={price || ""}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-32 text-right py-2 pl-2 pr-8 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none font-semibold text-lg"
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-gray-500 pointer-events-none">원</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">고객부담 배송비</label>
                <div className="relative">
                  <input
                    type="number"
                    value={shippingCustomer || ""}
                    onChange={(e) => setShippingCustomer(Number(e.target.value))}
                    className="w-32 text-right py-2 pl-2 pr-8 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none font-medium"
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-gray-500 pointer-events-none">원</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-border space-y-4">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-orange-500" /> 
              비용 입력
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">매입 원가 (상품대)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={cost || ""}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-32 text-right py-2 pl-2 pr-8 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none font-medium"
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-gray-500 pointer-events-none">원</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">실제 택배비</label>
                <div className="relative">
                  <input
                    type="number"
                    value={shippingReal || ""}
                    onChange={(e) => setShippingReal(Number(e.target.value))}
                    className="w-32 text-right py-2 pl-2 pr-8 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none font-medium"
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-gray-500 pointer-events-none">원</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">포장비 (부자재 등)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={packing || ""}
                    onChange={(e) => setPacking(Number(e.target.value))}
                    className="w-32 text-right py-2 pl-2 pr-8 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none font-medium text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-gray-500 pointer-events-none">원</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">기타 비용 (광고비 등)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={other || ""}
                    onChange={(e) => setOther(Number(e.target.value))}
                    className="w-32 text-right py-2 pl-2 pr-8 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none font-medium text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-gray-500 pointer-events-none">원</span>
                </div>
              </div>
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

            <div className="flex gap-4 mb-6">
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

            <button 
              onClick={() => {
                if (productName) {
                  navigator.clipboard.writeText(productName).then(() => {
                    alert(`✔️ 검색어 [ ${productName} ] 복사 완료!\n\n새 창이 열리면 쿠팡 검색창에 '붙여넣기' 하세요!`);
                    window.open('https://link.coupang.com/a/gBfL9ZBm7o', '_blank');
                  }).catch(() => {
                    window.open('https://link.coupang.com/a/gBfL9ZBm7o', '_blank');
                  });
                } else {
                  window.open('https://link.coupang.com/a/gBfL9ZBm7o', '_blank');
                }
              }}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2 animate-pulse-slow"
            >
              <span className="text-xl">🛒</span> 쿠팡에서 현재 시세 확인하기
            </button>
            
            <div className="mt-3 text-center">
              <p className="text-[10px] text-gray-400">
                &quot;이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.&quot;
              </p>
            </div>

            {/* 막대형 비용 시각화 */}
            <div className="mt-8">
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

      {/* SEO 최적화를 위한 하단 텍스트 가이드 */}
      <div id="guide" className="mt-12 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">쇼핑몰 순수익 마진 계산기 이용 가이드</h2>
        
        <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
          <section>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">왜 정확한 마진 계산이 중요한가요?</h3>
            <p>스마트스토어, 쿠팡, 11번가 등 오픈마켓에 상품을 올리기 전 가장 먼저 해야 할 일은 바로 정확한 마진율 파악입니다. 겉보기에는 남는 장사 같아도 막상 결제 수수료, 연동 수수료, 배송비, 그리고 종합소득세 및 부가가치세까지 납부하고 나면 오히려 적자가 나는 경우(역마진)가 빈번하게 발생합니다.</p>
          </section>

          <section>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">셀러마진 계산기의 특징</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>마켓별 수수료 자동 반영</strong>: 스마트스토어, 쿠팡 등 주요 마켓의 평균 수수료율이 프리셋으로 제공됩니다.</li>
              <li><strong>세금 공제 로직</strong>: 일반/간이/면세 사업자에 따른 부가세 차이와 종합소득세를 한 번에 계산할 수 있습니다.</li>
              <li><strong>시각화 데이터</strong>: 매출 중 세금, 수수료, 비용이 차지하는 비중을 막대 그래프로 쉽게 이해할 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">마진율과 투자수익률(ROI)의 차이</h3>
            <p>마진율은 <strong>총 매출액 대비 순수익의 비율</strong>을 뜻하며, ROI(Return On Investment)는 <strong>내가 투자한 비용(원가+택배비 등) 대비 얻은 순수익의 비율</strong>을 말합니다. 자본금이 적은 초보 셀러일수록 마진율뿐만 아니라 ROI가 높은 상품을 소싱하는 것이 유리합니다.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
