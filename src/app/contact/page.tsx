import React from 'react';
import { Mail, Clock, MessageSquare, AlertCircle } from 'lucide-react';

export const metadata = {
  title: '문의하기 & 피드백 (Contact Us) | 셀러마진',
  description: '셀러마진 서비스 이용 중 제휴, 오류 제보, 기능 건의 및 피드백을 전달할 수 있는 공식 소통 창구입니다.',
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* 헤더 */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#03C75A] border border-emerald-200 uppercase tracking-wider">
          Contact &amp; Support
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          문의하기 &amp; 피드백
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          셀러마진은 셀러 여러분의 소중한 피드백으로 발전합니다.<br />
          계산기 오류 제보, 새로운 오픈마켓 수수료 제안, 제휴 문의는 언제든 편하게 남겨주세요.
        </p>
      </div>

      {/* 안내 카드들 */}
      <div className="grid gap-4">
        {/* 이메일 문의 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#03C75A] flex items-center justify-center flex-shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <h2 className="font-bold text-gray-900 text-base">공식 이메일 문의</h2>
            <p className="text-xs text-gray-500">모든 제안 및 오류 제보는 이메일로 24시간 접수됩니다.</p>
            <p className="pt-2">
              <a 
                href="mailto:contact.sellermargin@gmail.com" 
                className="text-sm font-bold text-[#03C75A] hover:underline bg-emerald-50 px-3 py-1.5 rounded-lg inline-block"
              >
                contact.sellermargin@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* 운영 시간 안내 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-gray-900 text-base">피드백 검토 및 회신</h2>
            <p className="text-xs text-gray-500">평일 영업일 기준 24~48시간 이내 검토 후 답변드립니다.</p>
            <p className="text-xs text-gray-600 pt-1">
              • 운영 시간: 평일 10:00 ~ 18:00 (주말 및 공휴일 휴무)
            </p>
          </div>
        </div>

        {/* 오류 제보 안내 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-xs text-gray-600">
            <h2 className="font-bold text-gray-900 text-base">이런 문의를 환영합니다</h2>
            <ul className="list-disc pl-4 space-y-1 pt-1">
              <li>특정 마켓(쿠팡 로켓그로스 등)의 최근 수수료 개정 정보 제보</li>
              <li>마진 계산기 결과값 검증 및 새로운 비용 항목 추가 제안</li>
              <li>콘텐츠 제휴 및 비즈니스 협력 제안</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 안내 참고사항 */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200/80 flex items-start gap-3 text-xs text-gray-600 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
        <p>
          셀러마진은 판매자를 위한 무료 계산 편의 도구이며, 실제 마켓 정산 및 세무 신고의 최종 책임은 각 사업자 본인에게 있습니다. 복잡한 세무 관련 상담은 전문 세무사와의 상담을 권장합니다.
        </p>
      </div>
    </div>
  );
}
