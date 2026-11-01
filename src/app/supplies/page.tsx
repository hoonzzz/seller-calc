import type { Metadata } from "next";
import Link from "next/link";
import SuppliesLiveExplorer from "@/components/SuppliesLiveExplorer";

export const metadata: Metadata = {
  title: "택배박스 규격표 & 포장 부자재 원가 절감 기준 | 셀러마진",
  description:
    "우체국 1호~5호 호환 택배박스 사이즈 규격표, 택배사 부피무게 할증 구간, 상품군별 최적 포장재 단가 기준과 대량 부자재 시세를 한눈에 확인하세요.",
};

export default function SuppliesPage() {
  return (
    <div className="space-y-8 py-4">
      {/* 상단 헤더 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-3">
        <span className="inline-block text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-[#03C75A] border border-emerald-200">
          물류·포장 원가 절감 레퍼런스
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          셀러 택배박스 표준 규격표 &amp; 포장 부자재 단가 가이드
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          온라인 쇼핑몰 순수익을 갉아먹는 가장 흔한 원인은 상품 크기에 맞지 않는 과대 포장(부피 요금 할증)과 소매 단가 부자재 매입입니다. 출고 품목에 맞는 정확한 박스 호수와 목표 포장 단가를 먼저 세팅하세요.
        </p>
      </div>

      {/* 실시간 대량 부자재 조회 위젯 */}
      <SuppliesLiveExplorer />

      {/* 표준 택배박스 호수별 규격 및 택배 운임 구간 비교표 (고밀도 SSR 정보) */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-gray-900">
          1. 표준 택배박스 호수별 치수 및 택배 운임 구간 기준표
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          국내 주요 택배사(CJ대한통운, 한진, 롯데, 우체국 등)는 <strong>가로 + 세로 + 높이 세 변의 합(cm)</strong>과 중량(kg) 중 더 큰 구간을 기준으로 계약 운임을 책정합니다. 세 변의 합이 <strong>80cm 이하(극소·소형 구간)</strong>에 들어오도록 박스를 선택해야 최저 계약 택배비를 적용받을 수 있습니다.
        </p>

        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-800">
                <th className="p-3 font-bold">규격 명칭</th>
                <th className="p-3 font-bold">가로 × 세로 × 높이 (cm)</th>
                <th className="p-3 font-bold">세 변의 합</th>
                <th className="p-3 font-bold">대량 매입 목표단가</th>
                <th className="p-3 font-bold">주요 출고 품목</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              <tr>
                <td className="p-3 font-bold text-gray-900">A1 / 극소형</td>
                <td className="p-3">18 × 12 × 8 cm</td>
                <td className="p-3 text-emerald-700 font-semibold">38 cm (최저운임)</td>
                <td className="p-3">개당 110 ~ 150원</td>
                <td className="p-3">스마트폰 케이스, 주얼리, 앰플·립스틱</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-gray-900">1호 표준</td>
                <td className="p-3">22 × 19 × 9 cm</td>
                <td className="p-3 text-emerald-700 font-semibold">50 cm (최저운임)</td>
                <td className="p-3">개당 160 ~ 210원</td>
                <td className="p-3">기초 화장품, 소형 디지털 기기, 건강기능식품</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-gray-900">2호 표준</td>
                <td className="p-3">27 × 18 × 15 cm</td>
                <td className="p-3 text-emerald-700 font-semibold">60 cm (소형구간)</td>
                <td className="p-3">개당 230 ~ 300원</td>
                <td className="p-3">머그컵·텀블러, 소형 주방용품, 반려동물 간식</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-gray-900">3호 표준</td>
                <td className="p-3">34 × 25 × 21 cm</td>
                <td className="p-3 text-amber-700 font-semibold">80 cm (소형 상한선)</td>
                <td className="p-3">개당 350 ~ 460원</td>
                <td className="p-3">의류 묶음, 신발 박스, 소형 생활가전</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-gray-900">4호 표준</td>
                <td className="p-3">41 × 31 × 28 cm</td>
                <td className="p-3 text-rose-600 font-semibold">100 cm (중형 할증주의)</td>
                <td className="p-3">개당 550 ~ 720원</td>
                <td className="p-3">침구류, 겨울 아우터, 캠핑용품, 대용량 세제</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 상품 특성별 포장비 절감 실전 조합 */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-gray-900">
          2. 파손율이 낮은 상품은 &lsquo;박스&rsquo; 대신 &lsquo;안전봉투·폴리백&rsquo;으로 전환하세요
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
            <h3 className="font-bold text-gray-900">의류·패브릭·양말 ➔ HD 폴리백 (건당 35~55원)</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              충격에 파손될 위험이 없는 섬유류는 접착식 택배 폴리백을 사용하면 박스 조립 및 테이핑 시간이 사라져 시간당 포장 속도가 3배 이상 빨라집니다.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
            <h3 className="font-bold text-gray-900">소형 플라스틱·문구·잡화 ➔ 에어캡 안전봉투 (건당 65~95원)</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              봉투 내부에 에어캡(뽁뽁이)이 일체형으로 부착된 안전봉투는 A1 박스+완충재+테이프 조합(약 200원) 대비 부자재 원가를 절반 이하로 줄여줍니다.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#03C75A] hover:bg-[#03C75A]/90 text-white text-xs sm:text-sm font-extrabold transition-colors shadow-xs"
          >
            절감된 포장비로 내 순수익 다시 계산하기 &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
