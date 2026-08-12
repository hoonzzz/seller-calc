import React from 'react';

export const metadata = {
  title: '이용약관 - 셀러마진',
  description: '셀러마진 서비스 이용약관',
};

export default function TermsPage() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-border mt-4">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">이용약관</h1>
      
      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-semibold text-base text-gray-900 mb-2">제1조 (목적)</h2>
          <p>본 약관은 &quot;셀러마진&quot; (이하 &quot;서비스&quot;)가 제공하는 모든 기능 및 정보의 이용 조건, 의무, 권리 및 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-gray-900 mb-2">제2조 (서비스의 성격 및 책임 제한)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>본 서비스가 제공하는 수수료율 및 세금 계산 결과는 각 오픈마켓의 일반적인 수수료율을 바탕으로 한 <strong>&quot;예상치 및 참고용&quot;</strong> 데이터입니다.</li>
            <li>실제 정산 시 프로모션, 추가 할인, 카테고리별 수수료 차등 적용 등에 의해 결과가 다를 수 있습니다.</li>
            <li>본 서비스의 계산 결과를 바탕으로 이루어진 사용자의 사업적 판단(가격 책정, 투자 등)에 대해 서비스 제공자는 어떠한 법적 책임도 지지 않습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base text-gray-900 mb-2">제3조 (서비스 이용 및 변경)</h2>
          <p>서비스는 무료로 제공되며, 필요 시 사전 공지 없이 기능이 업데이트되거나 일부 제약이 생길 수 있습니다.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-gray-900 mb-2">제4조 (데이터의 저장)</h2>
          <p>사용자가 입력한 판매가, 원가 등의 계산 정보는 별도의 서버로 전송되지 않으며, 사용자 기기의 브라우저 로컬 스토리지에만 임시로 저장됩니다.</p>
        </section>
        
        <p className="pt-6 text-xs text-gray-500">부칙: 본 약관은 2026년 8월 12일부터 시행됩니다.</p>
      </div>
    </div>
  );
}
