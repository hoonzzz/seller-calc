"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

export interface SearchResult {
  title: string;
  link: string;
  image: string;
  lprice: string;
  hprice: string;
  mallName: string;
  productId: string;
}

interface SearchBarProps {
  onSelectProduct: (productName: string, price: number) => void;
}

export default function SearchBar({ onSelectProduct }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setIsOpen(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data.items) {
        setResults(data.items);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (item: SearchResult) => {
    // 네이버 API의 제목에는 <b> 태그가 포함되어 있을 수 있음
    const cleanTitle = item.title.replace(/<[^>]+>/g, "");
    onSelectProduct(cleanTitle, parseInt(item.lprice, 10));
    setIsOpen(false);
  };

  return (
    <div className="relative z-20 w-full mb-6">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="네이버 쇼핑 상품 검색 (예: 탁상용 선풍기)"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary/20 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="absolute inset-y-0 right-2 top-1.5 bottom-1.5 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "검색"}
        </button>
      </form>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-[400px] overflow-y-auto">
          {isSearching ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <span>상품을 찾고 있습니다...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-400 mb-2 px-2">검색 결과 (클릭하여 판매가 자동 입력)</div>
              {results.map((item) => (
                <button
                  key={item.productId}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  {item.image && (
                    <img src={item.image} alt="thumbnail" className="w-12 h-12 rounded object-cover border border-gray-100" />
                  )}
                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-medium text-gray-900 truncate" dangerouslySetInnerHTML={{ __html: item.title }} />
                    <div className="text-xs text-gray-500 mt-0.5">{item.mallName}</div>
                  </div>
                  <div className="font-bold text-primary whitespace-nowrap">
                    {parseInt(item.lprice).toLocaleString()}원
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              검색 결과가 없습니다.
            </div>
          )}
          
          <div className="p-2 border-t border-gray-100 bg-gray-50 flex justify-end rounded-b-xl">
            <button onClick={() => setIsOpen(false)} className="text-xs text-gray-500 hover:text-gray-900">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
