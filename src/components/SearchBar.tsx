"use client";

import { useState } from "react";
import { Search, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface TrendData {
  period: string;
  ratio: number;
}

interface SearchBarProps {
  onSelectProduct: (productName: string, price: number) => void;
}

export default function SearchBar({ onSelectProduct }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(false);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data.data) {
        setTrendData(data.data);
      } else {
        setTrendData([]);
      }
      
      // 검색 시 자동으로 상품명은 입력해줌 (가격은 0 또는 기존 유지)
      onSelectProduct(query.trim(), 0); 
    } catch (error) {
      console.error("Search failed:", error);
      setTrendData([]);
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  // 트렌드 분석 로직 (전반부 15일 vs 후반부 15일 평균 비교)
  const getTrendStatus = () => {
    if (trendData.length < 10) return { status: "none", text: "데이터 부족", color: "text-gray-500", icon: <Minus className="w-4 h-4" /> };
    
    const mid = Math.floor(trendData.length / 2);
    const firstHalf = trendData.slice(0, mid);
    const secondHalf = trendData.slice(mid);
    
    const firstAvg = firstHalf.reduce((sum, item) => sum + item.ratio, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.ratio, 0) / secondHalf.length;
    
    const diff = secondAvg - firstAvg;
    
    if (diff > 5) return { status: "up", text: "상승세 (수요 증가)", color: "text-red-500", icon: <TrendingUp className="w-5 h-5" /> };
    if (diff < -5) return { status: "down", text: "하락세 (수요 감소)", color: "text-blue-500", icon: <TrendingDown className="w-5 h-5" /> };
    return { status: "stable", text: "유지 (수요 꾸준함)", color: "text-green-600", icon: <Minus className="w-5 h-5" /> };
  };

  const trendStatus = getTrendStatus();

  return (
    <div className="w-full mb-6 space-y-4">
      <form onSubmit={handleSearch} className="relative z-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="상품 트렌드 분석 및 상품명 자동입력 (예: 탁상용 선풍기)"
          className="w-full pl-10 pr-24 py-3 rounded-xl border border-primary/20 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="absolute inset-y-0 right-2 top-1.5 bottom-1.5 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "트렌드 분석"}
        </button>
      </form>

      {/* 검색 결과 영역 */}
      {hasSearched && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                <span className="text-primary">'{query}'</span> 최근 30일 검색 트렌드
              </h3>
              <p className="text-xs text-gray-500 mt-1">네이버 데이터랩(검색어 트렌드) 기준 상대적 수치</p>
            </div>
            
            {trendData.length > 0 && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 font-bold ${trendStatus.color}`}>
                {trendStatus.icon}
                {trendStatus.text}
              </div>
            )}
          </div>

          {trendData.length > 0 ? (
            <div className="h-32 flex items-end gap-1 w-full pt-4 border-b border-gray-100">
              {trendData.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded pointer-events-none z-10 whitespace-nowrap transition-opacity">
                    {item.period.substring(5)}: {Math.round(item.ratio)}
                  </div>
                  {/* Bar */}
                  <div 
                    className="w-full bg-primary/20 group-hover:bg-primary transition-colors rounded-t-sm"
                    style={{ height: `${Math.max(2, item.ratio)}%` }}
                  ></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 text-sm">
              해당 키워드의 트렌드 데이터가 충분하지 않습니다.
            </div>
          )}
          
          <div className="mt-3 text-xs text-gray-400 text-right">
            마우스를 올리면 날짜별 상세 수치를 확인할 수 있습니다. (상품명은 계산기에 자동 입력되었습니다!)
          </div>
        </div>
      )}
    </div>
  );
}
