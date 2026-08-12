import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

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
          <header className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
            <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
              <Link href="/" className="font-bold text-xl text-primary flex items-center gap-2">
                <div className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center text-sm font-black shadow-sm">SM</div>
                <span className="tracking-tight">셀러마진</span>
              </Link>
              <nav className="text-sm text-muted-foreground flex gap-5 font-medium">
                <Link href="/" className="hover:text-primary transition-colors">계산기</Link>
                <Link href="/#guide" className="hover:text-primary transition-colors">이용안내</Link>
              </nav>
            </div>
          </header>
          <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 pb-24">
            {children}
          </main>
          <footer className="bg-muted py-8 mt-auto border-t border-border text-center text-sm text-muted-foreground">
            <p className="font-medium text-foreground/80">© {new Date().getFullYear()} 셀러마진(SellerMargin)</p>
            <div className="mt-3 flex justify-center gap-4 text-xs">
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
