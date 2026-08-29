# 🛒 쇼핑몰 순수익 마진 계산기 & 트렌드 분석기 (Seller Calc)

온라인 쇼핑몰 셀러들을 위한 **순수익 계산기**와 **네이버 데이터랩 기반 실시간 소싱 트렌드 분석기**가 통합된 스마트 웹 어플리케이션입니다. 
추가로, 쿠팡 파트너스를 통한 제휴 수익 모델과 GitHub Actions를 활용한 100% 무인 SNS 자동화 봇이 탑재되어 있습니다.

## 🚀 주요 기능 (Features)

### 1. 실시간 검색어 트렌드 분석기 (Trend Analyzer)
- **네이버 데이터랩(NAVER API HUB) 연동**: 특정 키워드(예: '탁상용 선풍기') 검색 시 최근 30일간의 실시간 검색어 수요 트렌드를 스파크라인 차트로 제공합니다.
- **AI 수요 판독기**: 전반부(15일) 대비 후반부(15일)의 평균 검색량을 비교하여 상승세(빨간색), 하락세(파란색), 유지 상태를 자동으로 판독해 줍니다.
- **Vercel CDN 24시간 캐싱**: API 호출 횟수(비용)를 최소화하기 위해, 한 번 검색된 키워드는 Vercel Edge 서버에 24시간 동안 박제(Cache-Control)되어 무료 한도 내에서 수십만 명의 트래픽을 감당할 수 있습니다.

### 2. 쇼핑몰 순수익 마진 계산기 (Margin Calculator)
- 마켓별(스마트스토어, 쿠팡, 11번가, 지마켓 등) 수수료 자동 적용
- 매입가, 판매가, 배송비, 포장비, 세금(부가세/소득세) 등을 종합하여 **최종 순수익**과 **마진율**을 즉각적으로 계산합니다.

### 3. 무인 자동화 수익 파이프라인 (Automated Monetization Pipeline)
- **쿠팡 파트너스 연동**: 계산기 하단에 쿠팡 상품 검색 위젯을 삽입하여, 방문자가 소싱 아이템을 검색하고 구매할 시 3%의 제휴 수익을 창출합니다.
- **구글 애드센스**: 지속적인 트래픽을 통한 광고 수익 모델이 탑재되어 있습니다.
- **SNS 자동 포스팅 봇 (GitHub Actions)**: 
  - `.github/workflows/sns-cron.yml` 파일에 설정된 크론(Cron) 스케줄에 따라 하루 5번 봇이 자동으로 실행됩니다.
  - 마진율이 높은 어그로성 텍스트와 함께 계산기 단축 URL을 메타 **쓰레드(Threads)** 계정으로 자동 포스팅하여 트래픽을 쓸어 담습니다.

## 🛠️ 기술 스택 (Tech Stack)

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Automation**: GitHub Actions (Cron Jobs)
- **External API**: 
  - NAVER API HUB (Search Trend API)
  - Meta Threads Graph API

## ⚙️ 환경 변수 세팅 (Environment Variables)

이 프로젝트를 제대로 실행하려면 **Vercel**과 **GitHub Secrets**에 각각 다음 키들을 등록해야 합니다.

**[Vercel Environment Variables]** (네이버 트렌드 API 용)
- `NAVER_CLIENT_ID`: 네이버 API HUB Client ID
- `NAVER_CLIENT_SECRET`: 네이버 API HUB Client Secret

**[GitHub Actions Secrets]** (쓰레드 자동화 봇 용)
- `THREADS_USER_ID`: 쓰레드 App-Scoped User ID
- `THREADS_ACCESS_TOKEN`: 쓰레드 60일 장기 액세스 토큰

## 💻 로컬 실행 방법 (Local Development)

```bash
# 1. 패키지 설치
npm install

# 2. 로컬 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 에 접속하여 확인할 수 있습니다.
