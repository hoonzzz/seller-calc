import React from 'react';
import Link from 'next/link';
import { Store, ShieldCheck, HeartHandshake, TrendingUp, ArrowRight } from 'lucide-react';

export const metadata = {
  title: '서비스 소개 (About Us) | 셀러마진',
  description: '온라인 쇼핑몰 초보 셀러의 역마진을 방지하고 정확한 순수익 분석을 돕는 셀러마진의 미션과 팀 소개입니다.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-12">
      {/* 헤더 섹션 */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#03C75A] border border-emerald-200 uppercase tracking-wider">
          About SellerMargin
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          &quot;팔수록 손해 보는 초보 셀러가<br className="hidden sm:inline" /> 단 한 명도 없도록&quot;
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
          셀러마진(SellerMargin)은 스마트스토어, 쿠팡, 오픈마켓 셀러들이 복잡한 수수료와 세금 계산의 함정에서 벗어나 진짜 순이익을 지킬 수 있도록 돕는 실무자 중심 솔루션입니다.
        </p>
      </div>

      {/* 창립 배경 스토리 */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[#03C75A]" />
          셀러마진이 탄생한 이유
        </h2>
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
          <p>
            온라인 이커머스 시장에 처음 뛰어든 수많은 1인 창업자와 초보 셀러들은 매달 늘어나는 매출 지표를 보며 기뻐합니다. 하지만 월말 정산서를 받아보고 종합소득세와 부가가치세를 납부하고 나면, 통장 잔고가 생각보다 턱없이 적거나 심지어 마이너스인 이른바 <strong>&apos;역마진의 늪&apos;</strong>을 경험하곤 합니다.
          </p>
          <p>
            단순히 <em>&apos;판매가 - 사입가 = 마진&apos;</em>이라는 계산법은 위험합니다. 실제 이커머스 비즈니스에서는 <strong>플랫폼별 상이한 카테고리 수수료(4%~13% 이상), 결제 연동 수수료, 택배 및 포장 부자재 비용, 반품/교환 손실 로스율, 그리고 간이/일반과세자에 따른 부가가치세와 누진 소득세</strong>가 복잡하게 얽혀 있습니다.
          </p>
          <p>
            셀러마진 팀은 현업에서 수많은 시행착오를 겪으며 축적한 실무 데이터를 바탕으로, 누구나 10초 만에 판매 전 실제 주머니에 들어오는 순이익을 한눈에 검증할 수 있는 직관적인 계산기와 정보 공유 플랫폼을 구축했습니다.
          </p>
        </div>
      </div>

      {/* 3대 핵심 가치 */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#03C75A] flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">정확한 마켓 수수료</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            스마트스토어, 쿠팡, 11번가, G마켓 등 주요 오픈마켓의 최신 정산 수수료율을 실시간으로 분석하여 오차 없는 마진을 산출합니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">세무·부가세 완벽 반영</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            일반과세자와 간이과세자의 부가세율 차이 및 종합소득세 예상치를 자동으로 분리 차감하여 진짜 통장에 남는 순수익을 보여줍니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">100% 무료 공익 도구</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            별도의 유료 결제나 회원가입 강요 없이, 모든 초보 셀러들이 자립할 수 있도록 양질의 지식과 계산 도구를 투명하게 무료 제공합니다.
          </p>
        </div>
      </div>

      {/* 운영 철학 및 이용자 약속 */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8 rounded-2xl border border-gray-200 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">운영 원칙 및 신뢰성(E-E-A-T) 약속</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed">
          <li><strong>데이터의 객관성</strong>: 각 플랫폼의 공식 판매자 센터 이용약관 및 국세청 고시 세법을 근거로 계산 공식을 정기 업데이트합니다.</li>
          <li><strong>이용자 개인정보 보호</strong>: 계산기에 입력되는 모든 상품가, 원가 정보는 서버에 저장되지 않고 이용자의 브라우저 로컬 저장소에만 남습니다.</li>
          <li><strong>피드백에 열려 있는 서비스</strong>: 이커머스 정책 변경이나 개선 요청은 언제든 피드백 창구를 통해 즉각 검토 후 반영합니다.</li>
        </ul>
      </div>

      {/* 하단 CTA */}
      <div className="text-center pt-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-[#03C75A] hover:bg-[#03C75A]/90 text-white shadow-md transition-all"
        >
          지금 마진 계산하러 가기
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
