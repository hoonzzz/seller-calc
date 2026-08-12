import React from 'react';

export const metadata = {
  title: '개인정보처리방침 - 셀러마진',
  description: '셀러마진 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-border mt-4">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">개인정보처리방침</h1>
      
      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <p>셀러마진(이하 &quot;서비스&quot;)는 이용자의 개인정보를 매우 중요하게 생각하며, 서비스를 안전하게 이용할 수 있도록 최선을 다하고 있습니다.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-gray-900 mb-2">1. 수집하는 개인정보 항목 및 수집 방법</h2>
          <p>본 서비스는 회원가입을 요구하지 않으며, 성명, 이메일, 전화번호 등 어떠한 <strong>개인 식별 정보도 수집하거나 저장하지 않습니다.</strong></p>
          <p className="mt-2">사용자가 입력하는 판매가, 원가 등의 계산 데이터는 전적으로 사용자 브라우저의 <strong>로컬 스토리지(Local Storage)</strong>에만 보관되며, 당사의 서버로 전송되거나 수집되지 않습니다.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-gray-900 mb-2">2. 제3자 제공 및 위탁</h2>
          <p>당사는 어떠한 개인정보도 수집하지 않으므로, 이를 제3자에게 제공하거나 취급을 위탁하지 않습니다.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-gray-900 mb-2">3. 자동 수집되는 정보 (쿠키 등)</h2>
          <p>광고 게재(구글 애드센스 등) 및 서비스 접속 통계(구글 애널리틱스 등)를 목적으로 쿠키(Cookie) 및 익명화된 접속 IP, 브라우저 정보가 자동 수집될 수 있습니다. 이는 개인을 식별할 수 없는 데이터로만 활용됩니다.</p>
          <p className="mt-2 text-xs">※ 이용자는 웹 브라우저의 옵션을 설정함으로써 쿠키 저장을 거부할 수 있습니다.</p>
        </section>

        <section>
          <h2 className="font-semibold text-base text-gray-900 mb-2">4. 개인정보 보호 문의</h2>
          <p>서비스 이용 중 개인정보 관련 문의가 있으신 경우 아래 연락처로 문의해 주시기 바랍니다.</p>
          <p className="mt-1 font-medium text-gray-900">이메일: hello@seller-margin.vercel.app</p>
        </section>
        
        <p className="pt-6 text-xs text-gray-500">부칙: 본 방침은 2026년 8월 12일부터 시행됩니다.</p>
      </div>
    </div>
  );
}
