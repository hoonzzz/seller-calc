import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "셀러마진 - 쇼핑몰 순수익 마진 계산기",
  description: "스마트스토어, 쿠팡 등 오픈마켓 판매자를 위한 정확한 순수익 및 마진율 계산기. 복잡한 수수료와 세금을 한 번에 계산하세요.",
  keywords: "스마트스토어 마진 계산기, 쿠팡 마진 계산기, 쇼핑몰 마진, 마진율 계산기, 셀러 도구, 순수익 계산기",
  openGraph: {
    title: "셀러마진 - 쇼핑몰 순수익 마진 계산기",
    description: "스마트스토어, 쿠팡 등 오픈마켓 판매자를 위한 정확한 순수익 및 마진율 계산기",
    type: "website",
    locale: "ko_KR",
  },
  verification: {
    google: "YIgzzgdbDVTgVugxff41w4EWm3rwrIZYLEVRMomxGaY",
  },
  other: {
    "google-adsense-account": "ca-pub-1497636547853445",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1497636547853445" crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-background flex flex-col">
          <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
            <div className="max-w-4xl mx-auto px-3.5 sm:px-6 h-14 flex items-center justify-between gap-2">
              <Link href="/" className="font-extrabold text-lg sm:text-xl text-slate-900 flex items-center gap-2 shrink-0">
                <div className="bg-primary text-white rounded-lg w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-black shadow-xs">SM</div>
                <span className="tracking-tight">셀러마진</span>
              </Link>
              <nav className="text-xs sm:text-sm text-slate-600 flex items-center gap-1 sm:gap-2 font-semibold overflow-x-auto no-scrollbar">
                <Link href="/" className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap">계산기</Link>
                <Link href="/supplies" className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap">부자재·규격</Link>
                <Link href="/tips" className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap">셀러꿀팁</Link>
                <Link href="/about" className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap">소개</Link>
              </nav>
            </div>
          </header>
          <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6 pb-28 md:pb-20">
            {children}
          </main>
          <footer className="bg-slate-100/80 py-8 pb-28 md:pb-10 mt-auto border-t border-slate-200/80 text-center text-sm text-muted-foreground">
            <p className="font-medium text-foreground/80">© {new Date().getFullYear()} 셀러마진(SellerMargin)</p>
            <div className="mt-3 flex justify-center gap-4 text-xs">
              <Link href="/about" className="hover:text-foreground transition-colors">서비스 소개</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">문의하기</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">이용약관</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors font-semibold">개인정보처리방침</Link>
            </div>
            <p className="mt-4 text-xs opacity-75">본 서비스의 계산 결과는 참고용이며, 실제 정산 금액 및 세금과 다를 수 있습니다.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
