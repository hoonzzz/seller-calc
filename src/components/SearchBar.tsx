"use client";

import { useState } from "react";
import { Search, Loader2, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";

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
      
      onSelectProduct(query.trim(), 0); 
    } catch (error) {
      console.error("Search failed:", error);
      setTrendData([]);
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  const getTrendStatus = () => {
    if (trendData.length < 10) return { status: "none", text: "데이터 부족", color: "text-gray-500", icon: <Minus className="w-4 h-4" /> };
    
    const mid = Math.floor(trendData.length / 2);
    const firstHalf = trendData.slice(0, mid);
    const secondHalf = trendData.slice(mid);
    
    const firstAvg = firstHalf.reduce((sum, item) => sum + item.ratio, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.ratio, 0) / secondHalf.length;
    
    const diff = secondAvg - firstAvg;
    
    // 색상은 네이버의 긍정(빨강)/부정(파랑) 주식 차트 기준 차용
    if (diff > 5) return { status: "up", text: "상승세 (수요 증가)", color: "text-red-500", icon: <TrendingUp className="w-5 h-5" /> };
    if (diff < -5) return { status: "down", text: "하락세 (수요 감소)", color: "text-blue-500", icon: <TrendingDown className="w-5 h-5" /> };
    return { status: "stable", text: "유지 (수요 꾸준함)", color: "text-gray-600", icon: <Minus className="w-5 h-5" /> };
  };

  const trendStatus = getTrendStatus();

  return (
    <div className="w-full mb-6 space-y-4">
      <form onSubmit={handleSearch} className="relative z-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="네이버 데이터랩 실시간 검색어 트렌드 분석 (예: 탁상용 선풍기)"
          className="w-full pl-10 pr-24 py-3.5 rounded-xl border-2 border-[#03C75A]/20 bg-white shadow-sm focus:outline-none focus:ring-0 focus:border-[#03C75A] text-sm transition-all placeholder:text-gray-400 font-medium"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#03C75A]" />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="absolute inset-y-0 right-1.5 top-1.5 bottom-1.5 px-5 bg-[#03C75A] text-white text-sm font-bold rounded-lg hover:bg-[#03C75A]/90 transition-colors disabled:opacity-50"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "트렌드 검색"}
        </button>
      </form>

      {/* 검색 결과 영역 */}
      {hasSearched && (
        <div className="bg-white border-2 border-[#03C75A]/10 rounded-xl p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-extrabold text-gray-900">
                  <span className="text-[#03C75A]">&apos;{query}&apos;</span> 최근 30일 검색 트렌드
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#03C75A]/10 text-[#03C75A] px-2 py-0.5 rounded-sm">
                  <Info className="w-3 h-3" /> 데이터 출처: NAVER 데이터랩
                </span>
              </div>
            </div>
            
            {trendData.length > 0 && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 font-bold text-sm ${trendStatus.color}`}>
                {trendStatus.icon}
                {trendStatus.text}
              </div>
            )}
          </div>

          {trendData.length > 0 ? (
            <div className="h-36 flex items-end gap-1 w-full pt-4 border-b-2 border-gray-100">
              {trendData.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-medium py-1.5 px-2.5 rounded pointer-events-none z-10 whitespace-nowrap transition-opacity">
                    {item.period.substring(5)} 네이버 검색 지수: <span className="font-bold text-[#03C75A]">{Math.round(item.ratio)}</span>
                  </div>
                  {/* Bar */}
                  <div 
                    className="w-full bg-[#03C75A]/20 group-hover:bg-[#03C75A] transition-colors rounded-t-sm"
                    style={{ height: `${Math.max(2, item.ratio)}%` }}
                  ></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500 text-sm font-medium">
              해당 키워드의 네이버 검색 트렌드 데이터가 충분하지 않습니다.
            </div>
          )}
          
          <div className="mt-3 text-[11px] text-gray-400 text-right font-medium">
            ※ 그래프의 막대에 마우스를 올리면 날짜별 네이버 검색 지수 상세 수치를 확인할 수 있습니다.
          </div>
        </div>
      )}
    </div>
  );
}
