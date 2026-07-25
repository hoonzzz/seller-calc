# Prism Master Specification
> Working title: Prism. Public brand clearance is still required.
This document is a consolidated reading copy. The individual files under `docs/` remain the editable source documents.


---

# 00. Executive Summary

## 한 문장 정의

Prism은 사람들이 선택하고 댓글을 읽고 특정 의견에 설득되어 생각을 바꾸는 순간을 재미있게 기록하는 모바일 중심 참여형 콘텐츠 서비스다.

## 사용자 약속

**생각은 바뀔 수 있다.**

Prism은 입장을 바꾸는 행동을 패배로 표현하지 않는다. 좋은 의견을 만나 더 나은 판단을 한 경험으로 표현한다.

## 사업적 관점

Prism의 돈은 기능에서 바로 나오지 않는다. 아래 순서를 지킨다.

```text
재미
→ 반복 방문
→ 건강한 댓글 문화
→ 신뢰 가능한 선택과 설득 데이터
→ 광고와 스폰서드 콘텐츠와 인사이트 사업
```

초기에는 데이터 플랫폼을 사용자에게 내세우지 않는다. 사용자는 재미있는 질문과 댓글 때문에 온다. 데이터는 그 행동의 결과로 축적된다.

## 핵심 차별점

A/B 투표 자체는 차별점이 아니다. 댓글 추천도 차별점이 아니다.

Prism의 핵심 wedge는 다음 두 가지다.

1. 특정 댓글 때문에 실제로 입장이 바뀌었다고 명시할 수 있다.
2. 해당 댓글에 `이 의견으로 N명의 생각이 바뀌었습니다`라는 실제 설득 마커가 붙는다.

## MVP에서 검증할 것

- 사용자가 질문을 보고 즉시 투표하는가
- 투표 뒤 댓글을 읽는가
- 반대 진영 댓글도 읽는가
- 특정 댓글로 생각을 바꾸는가
- 다시 방문하는가

## MVP에서 검증하지 않을 것

- 기업이 데이터를 구매하는가
- AI 요약이 유용한가
- 광고 수익이 발생하는가
- 자동 주제 생성이 가능한가
- 실시간 통신이 체류시간을 높이는가

## 제품의 내부 나침반

> 모든 기능은 댓글을 더 재미있게 만들기 위해 존재한다.

투표는 댓글로 들어가는 문이다. 설득 마커는 좋은 댓글을 발견하게 하는 장치다. 공유는 좋은 질문과 댓글을 밖으로 퍼뜨리는 장치다.

## 북극성 지표와 선행 지표

초기 사업 검증의 우선순위는 다음과 같다.

1. D1과 D7 재방문율
2. 세션당 참여 질문 수
3. 투표 후 댓글 탭 진입률
4. 댓글 작성률과 추천률
5. 공유율
6. 고유 방문자 기준 입장 변경률

입장 변경 수는 브랜드의 대표 지표가 될 수 있다. 다만 재방문이 없으면 사업은 성립하지 않는다.

## 브랜드 주의

`Prism`은 현재 작업명이다. 의미는 프로젝트 철학과 잘 맞지만 일반명사이고 유사 서비스명이 많다. 공개 출시 전 다음을 완료해야 한다.

- 국내외 상표 검색
- 주요 도메인과 앱스토어 이름 확인
- 유사 분야 혼동 가능성 검토
- 대체 이름 후보 3개 확보

## 기술 방향

- 서버 렌더링 PHP
- MariaDB
- Vanilla JS
- 최소 의존성
- 모바일 우선
- 실제 숫자만 사용
- 트랜잭션과 unique constraint로 데이터 무결성 보장
- 로컬 Docker 개발
- 무료 인프라 우선 검증

## 가장 중요한 비기능 요구사항

- 데이터 무결성
- 익명 사용자 개인정보 최소화
- UGC 안전성
- 모바일 사용성
- 복구 가능한 운영
- 에이전트가 임의로 기능을 늘리지 못하도록 하는 범위 통제


---

# 01. Product Brief

## 문제

기존 커뮤니티의 토론은 추천 수와 진영 대결에 집중한다. 사용자는 자신의 입장을 방어하고 상대를 이기는 데 익숙하다. 생각을 바꾸는 행동은 약함이나 패배로 취급되기 쉽다.

또한 일반 투표 서비스는 선택 비율은 보여주지만 왜 사람들이 선택했는지와 어떤 의견이 판단을 바꿨는지는 기록하지 못한다.

## 기회

사람들은 다음 세 가지를 궁금해한다.

- 나는 다수인가 소수인가
- 반대편은 왜 그렇게 생각하는가
- 어떤 말이 사람의 고집을 실제로 움직였는가

Prism은 이 세 가지를 하나의 짧은 모바일 루프로 연결한다.

## 목표 사용자

초기 핵심 사용자는 20대 후반부터 40대 초반까지의 모바일 커뮤니티 사용자다. 직장과 소비와 주거와 연애와 생활 선택에 관심이 있고 긴 토론을 직접 쓰지 않더라도 남의 의견을 읽는 것을 즐기는 사람을 우선한다.

초기에는 정치와 젠더와 종교와 지역 정체성 중심의 주제를 피한다. 이런 주제는 트래픽보다 운영 리스크와 고착된 정체성 반응을 키울 가능성이 높다.

## 핵심 Job To Be Done

### 기능적 Job

- 두 선택 중 내 입장을 빠르게 고른다.
- 다른 사람들의 이유를 비교한다.
- 나를 설득한 의견을 표시한다.

### 감정적 Job

- 내 생각이 주류인지 확인한다.
- 반대편의 의외로 말 되는 논리를 발견한다.
- 생각을 바꾸는 자신을 유연하고 지적인 사람으로 느낀다.

### 사회적 Job

- 재미있는 질문이나 설득력 있는 댓글을 친구에게 공유한다.
- 논쟁에서 이긴 사람이 아니라 사람을 움직인 의견을 발견한다.

## 핵심 가치 제안

### 사용자에게

- 한 번 탭하면 내 위치를 알 수 있다.
- 양쪽의 진짜 이유를 빠르게 비교할 수 있다.
- 가장 많은 사람의 생각을 바꾼 댓글을 볼 수 있다.

### 댓글 작성자에게

- 같은 편의 추천 수가 아니라 반대편을 설득한 영향력을 확인할 수 있다.

### 장기 사업에

- 어떤 질문과 어떤 의견이 판단 변화와 연결되는지 집계할 수 있다.
- 단 개인을 식별하거나 민감한 프로파일을 판매하지 않는다.

## 핵심 루프

```text
질문 카드 클릭
→ A/B 선택
→ 결과 공개
→ 댓글 탭 탐색
→ 추천 또는 작성
→ 반대편 댓글의 입장 변경 CTA
→ 설득 피드백
→ 다음 질문 또는 공유
```

## 콘텐츠 전략

초기 질문은 너무 가볍지도 너무 피곤하지도 않아야 한다.

좋은 초기 질문의 조건은 다음과 같다.

- 누구나 3초 안에 이해한다.
- 양쪽 모두 현실적인 장점이 있다.
- 개인 경험을 댓글로 쓰기 쉽다.
- 정답보다 조건과 우선순위가 중요하다.
- 혐오 대상을 만들지 않는다.

## 경쟁에서 피해야 할 함정

- 일반 밸런스 게임처럼 보이는 것
- 토론 승패와 티어에 매몰되는 것
- 가짜 실시간과 가짜 참여 수
- AI 기능을 앞세워 댓글을 부차적으로 만드는 것
- 브랜드 안전성을 해치는 갈등 주제 의존
- 데이터 사업을 이유로 개인정보를 과도하게 수집하는 것

## 제품 문장

### 사용자용

**생각은 바뀔 수 있다.**

### 내부용

**Prism은 사람들이 가장 재미있게 생각을 바꾸는 곳이다.**

### 장기 사업용

**선택과 설득의 맥락을 신뢰 가능한 집계 데이터로 전환한다.**


---

# 02. MVP Scope

## 목적

첫 MVP는 완성형 커뮤니티가 아니다. 핵심 루프의 재미와 재방문 가능성을 검증하는 제품이다.

## P0 필수 기능

### 홈

- 브랜드 작업명과 슬로건
- 게시 중인 질문 5~10개
- 질문 제목과 A/B 선택지 미리보기
- 실제 참여 수의 점진적 노출
- 실제 입장 변경이 있을 때만 변심 수 노출

### 질문 상세

- 질문과 짧은 맥락
- A/B 투표 버튼
- 투표 전 결과 숨김
- 투표 후 실제 비율과 현재 진영 표시
- 내 입장 댓글 탭
- 반대 입장 댓글 탭
- 사람을 설득한 댓글 탭 또는 정렬

### 댓글

- 투표 후 작성 가능
- 댓글 작성 당시 진영 고정
- 10자 이상 1000자 이하 plain text
- 추천 1회
- 신고 1회
- 설득 수 표시
- HTML과 스크립트 실행 차단

### 입장 변경

- 반대 진영 댓글에만 CTA 노출
- 특정 댓글을 attribution 대상으로 선택
- 주제별 방문자당 1회
- 변경 전 확인
- 변경 뒤 결과와 댓글 상태 갱신
- 해당 댓글의 실제 설득 수 증가

### 운영

- 관리자 로그인
- 질문 생성과 수정과 공개 상태 변경
- 댓글 숨김과 복구
- 신고 목록 조회

### 분석 연결점

- topic_view
- vote_cast
- comments_open
- comment_submit
- comment_recommend
- stance_change
- share_click
- report_submit

## P1 다음 버전 후보

- 최신 수치 30초 폴링
- 한 단계 답글
- 댓글 북마크
- 설득 댓글 공유 카드
- 사용자 닉네임
- 운영자 큐레이션
- 기본 검색

## 명시적 제외 범위

- 회원가입
- 사용자 프로필
- 사용자 질문 등록
- 소셜 그래프
- DM
- AI 요약
- AI 팩트체크
- 자동 트렌드 수집
- 자동 발행
- 광고
- 구독
- 결제
- 배지와 티어
- 투표 가중치
- WebSocket
- SSE
- PWA 설치 유도
- 푸시 알림
- 성별과 연령과 지역 수집
- 기업용 리포트

## 범위 판단 기준

새 기능은 아래 세 질문 중 두 개 이상에 `예`일 때만 MVP 후보가 된다.

1. 댓글을 더 읽게 만드는가
2. 생각을 바꾸는 경험을 강화하는가
3. 핵심 가설 검증에 직접 필요한가

운영 편의를 위한 기능은 치명적 위험을 줄이는 경우에만 예외로 한다.

## 완료의 정의

- 처음 온 사용자가 설명 없이 투표할 수 있다.
- 투표 뒤 A와 B 댓글을 모두 탐색할 수 있다.
- 반대 댓글에서 입장 변경을 완료할 수 있다.
- 설득 마커가 실제 데이터와 일치한다.
- 모바일에서 모든 핵심 행동이 한 손으로 가능하다.
- 중복 요청과 새로고침으로 수치가 오염되지 않는다.


---

# 03. UX and Content Specification

## UX 목표

Prism의 첫 화면은 사용자가 3초 안에 이해하고 한 번 탭하게 만들어야 한다. 질문 상세는 투표 뒤 자연스럽게 댓글 탐색으로 이어져야 한다. 입장 변경은 과장된 게임 연출보다 솔직한 고백과 지적 유연함으로 느껴져야 한다.

## 정보 구조

```text
홈
└─ 질문 상세
   ├─ 투표 영역
   ├─ 결과 영역
   ├─ 댓글 탭
   │  ├─ 내 입장
   │  ├─ 반대 입장
   │  └─ 생각을 바꾼 의견
   ├─ 댓글 작성
   └─ 공유

관리자
├─ 질문 관리
├─ 댓글 관리
└─ 신고 관리
```

## 홈 화면

### 상단

- 작업명 로고 텍스트 `Prism`
- 슬로건 `생각은 바뀔 수 있다.`
- 짧은 보조 문구 `당신과 다른 관점을 만나보세요.`

### 질문 카드

필수 요소:

- 카테고리
- 질문 제목
- A 선택지
- B 선택지
- 실제 참여 지표
- 실제 변심이 발생했을 때만 변심 지표

권장 예시:

```text
직장
연봉 30% 인상 vs 주 4일제

A 연봉 30% 인상
B 주 4일제

124명 참여 · 3명의 생각이 바뀌었습니다
```

초기 상태:

- 참여 10명 미만이면 참여 수를 숨기거나 `첫 의견을 기다리고 있어요`로 표시한다.
- 실제 입장 변경이 0이면 변심 수를 표시하지 않는다.
- 댓글이 0이면 `첫 번째 이유를 남겨보세요`를 표시한다.

## 질문 상세 흐름

### 1단계. 투표 전

- 질문
- 짧은 맥락 1~3문장
- A와 B 선택 버튼
- 결과 비율은 숨김
- 댓글 미리보기는 최대 1개까지 허용할 수 있으나 MVP 기본값은 숨김

### 2단계. 투표 직후

- 선택한 진영 확인
- 실제 결과 비율
- 다수 또는 소수 여부를 과도한 승패 표현 없이 안내
- 댓글로 내려가는 CTA

카피 예시:

- `현재는 A가 조금 앞서고 있어요.`
- `당신은 현재 38%의 의견에 서 있어요.`
- `반대편은 왜 다르게 생각할까요?`

금지 카피:

- `적진을 무너뜨리세요`
- `상대를 박살내세요`
- `패배했습니다`
- 혐오와 모욕을 전제로 한 표현

### 3단계. 댓글 탐색

기본 탭 순서:

1. 내 입장
2. 반대 입장
3. 생각을 바꾼 의견

댓글 카드 정보:

- A 또는 B 진영 라벨
- 본문
- 작성 시각
- 추천 수
- 설득 수
- 추천 버튼
- 신고 메뉴
- 반대 진영 댓글일 때만 입장 변경 CTA

설득 마커 예시:

- `이 의견으로 1명의 생각이 바뀌었습니다.`
- `이 의견으로 7명의 생각이 바뀌었습니다.`

0명일 때는 마커를 숨긴다.

### 4단계. 입장 변경

반대 진영 댓글의 CTA:

`이 의견을 읽고 생각이 바뀌었어요`

확인 시트:

```text
생각을 바꾸시겠어요?
좋은 의견을 만나 판단을 바꾸는 건 멋진 일입니다.

취소
B로 바꾸기
```

완료 피드백:

```text
생각이 움직였습니다.
이 의견은 지금까지 4명의 생각을 바꿨어요.
```

과도한 불꽃과 승리 연출은 사용하지 않는다. 180~260ms 수준의 짧은 상태 전환만 사용한다.

## 댓글 작성 UX

- 투표 전에는 입력창 대신 `먼저 내 입장을 선택해주세요`를 표시한다.
- placeholder: `왜 그렇게 생각하시나요? 경험이나 이유를 들려주세요.`
- 최소 10자
- 최대 1000자
- 실시간 글자 수는 800자부터 표시
- 강제로 3줄을 요구하지 않는다.
- 익명성 안내를 짧게 표시한다.

## 추천 정렬

MVP 기본 정렬은 다음 순서를 권장한다.

1. 설득 수 내림차순
2. 추천 수 내림차순
3. 최신순

사용자가 최신순을 선택할 수 있게 하되 첫 버전에서는 정렬 옵션을 최소화한다.

## 색상 원칙

- A와 B는 구분되지만 공격적인 진영 대립 색을 피한다.
- A 예시: 청록 계열
- B 예시: 보라 계열
- 설득 상태: 프리즘을 연상시키는 제한적 그라데이션
- 본문 배경은 밝고 중립적으로 유지
- 색상만으로 진영을 구분하지 않고 A와 B 텍스트 라벨을 함께 사용

구체 색상은 구현 중 접근성 대비를 검증한 뒤 확정한다.

## 모바일 기준

- 기본 검증 폭: 390px
- 최소 터치 영역: 44×44px
- 본문 기본 글자: 16px 이상
- 긴 댓글 line-height: 1.55 이상
- 하단 입력 영역이 모바일 키보드에 가리지 않아야 함
- 탭 전환 시 스크롤 위치 규칙이 일관되어야 함

## 접근성

- 모든 버튼에 명확한 accessible name
- 포커스 표시 제거 금지
- `aria-live`는 투표 결과와 입장 변경 완료에 제한적으로 사용
- 애니메이션 축소 설정 존중
- 숫자와 색만으로 상태를 전달하지 않음

## Open Graph 문구

제목:

`연봉 30% 인상 vs 주 4일제 | Prism`

설명:

`당신은 어느 쪽인가요? 양쪽의 이유를 읽고 생각이 바뀔 수 있습니다.`

실제 참여 수를 이미지에 넣는 기능은 MVP 이후로 미룬다.


---

# 04. Technical Architecture

## 원칙

- 작은 팀이 빠르게 이해할 수 있어야 한다.
- 프레임워크 없이도 구조는 분리한다.
- 서버 렌더링으로 초기 복잡도를 낮춘다.
- 핵심 데이터 변경은 트랜잭션과 DB 제약조건으로 보호한다.
- 외부 서비스 없이도 핵심 기능이 동작해야 한다.

## 권장 스택

### 애플리케이션

- PHP 8.4
- MariaDB 11.8 LTS 계열 또는 호환 버전
- Nginx
- PHP-FPM
- PDO
- Composer PSR-4
- Vanilla JavaScript
- CSS Custom Properties

### 품질

- PHPUnit
- Playwright
- PHP_CodeSniffer 또는 PHP-CS-Fixer는 첫 스캐폴드 이후 선택
- PHPStan은 핵심 구조가 잡힌 뒤 Level 5부터 적용

### 운영

- Ubuntu LTS
- Oracle Cloud Always Free 우선 검토
- Cloudflare Free는 도메인 확보 후 적용
- GitHub private repository
- GitHub Actions 또는 초기 수동 배포

## 0원 운영에 대한 현실적 정의

목표는 월 고정 인프라 비용을 0원에 가깝게 유지하는 것이다. 다음은 보장 대상이 아니다.

- 도메인 구입 비용
- 무료 클라우드 자원 확보 가능성
- 무료 정책의 장기 유지
- 트래픽 급증 시의 확장 비용
- 이메일과 SMS와 영상 광고 등 외부 서비스 비용

Oracle Cloud Always Free는 초기 검증에 적합한 후보지만 무료 Ampere 자원은 현재 계정당 합계 2 OCPU와 12GB 메모리 범위다. 리전 용량 부족과 유휴 인스턴스 회수 가능성을 고려해 백업과 이전 절차를 유지한다.

## 권장 디렉터리

```text
public/
  index.php
  assets/
    css/app.css
    js/app.js

src/
  Bootstrap.php
  Config.php
  Database.php
  Http/
    Router.php
    Request.php
    Response.php
    Controllers/
  Domain/
    Topics/
    Voting/
    Comments/
    Moderation/
  Support/
    Csrf.php
    VisitorIdentity.php
    RateLimiter.php
    View.php

views/
  layouts/
  home.php
  topic.php
  admin/

routes/
  web.php
  api.php

database/
  migrations/
  schema.sql
  seed.sql

tests/
  Unit/
  Integration/
  E2E/

docs/
.agents/
```

## 요청 흐름

```text
Nginx
→ public/index.php
→ Bootstrap
→ Router
→ Controller
→ Domain Service
→ Repository 또는 명시적 PDO Query Object
→ MariaDB
→ View 또는 JSON Response
```

Repository 계층은 모든 테이블에 기계적으로 만들지 않는다. 복잡한 트랜잭션과 재사용되는 조회만 명시적 클래스로 분리한다.

## 서버 렌더링과 JavaScript

기본 페이지는 JavaScript 없이도 읽을 수 있어야 한다. 투표와 추천과 입장 변경은 JavaScript fetch로 처리하되 실패 시 명확한 오류와 재시도 경로를 제공한다.

권장 전략:

- 홈과 상세은 SSR
- 폼은 서버 검증 우선
- 성공 시 필요한 카드와 카운터만 갱신
- History API는 사용하지 않아도 됨
- 전체 SPA 전환 금지

## 트랜잭션 경계

다음 작업은 반드시 하나의 트랜잭션으로 처리한다.

### 최초 투표

1. visitor 확인 또는 생성
2. topic vote insert
3. vote event insert
4. topic option counter 증가
5. commit

### 입장 변경

1. 현재 vote row `FOR UPDATE`
2. 변경 가능 여부 검증
3. 반대 진영 comment 검증
4. topic vote update
5. stance change event insert
6. 기존 option counter 감소
7. 새 option counter 증가
8. topic changed visitor counter 증가
9. comment persuasion counter 증가
10. commit

중복 요청은 unique constraint 충돌을 정상적인 idempotent 결과로 변환한다.

## 캐싱

MVP에서는 Redis를 사용하지 않는다.

- 질문 카드 수치는 topics의 denormalized counter 사용
- 댓글 목록은 DB 인덱스로 처리
- 정적 파일은 Nginx cache header 사용
- Cloudflare 연결 후 정적 자원 캐싱
- 동적 HTML cache는 데이터 규모를 확인한 뒤 검토

## 실시간

MVP에는 WebSocket과 SSE를 넣지 않는다.

다음 버전에서 필요한 경우:

- 페이지가 보이는 동안 30초 폴링
- `/api/topics/{id}/stats`
- ETag 또는 `updated_at` 기반 변경 감지

실시간처럼 보이는 가짜 이벤트는 금지한다.

## 로컬 개발

Docker Compose 서비스:

- `web`: Nginx
- `php`: PHP-FPM 8.4
- `db`: MariaDB

로컬 URL 기본값:

- 웹: `http://localhost:8080`
- DB 외부 포트: `3307`

## 운영 배포

초기 운영은 단일 VM을 전제로 한다.

```text
Cloudflare 또는 임시 DNS
→ Nginx
→ PHP-FPM
→ MariaDB localhost
```

보안 그룹은 22와 80과 443만 필요할 때 연다. MariaDB 포트는 외부에 공개하지 않는다.

## 백업

- 매일 `mariadb-dump`
- 최근 7일 보관
- 주 1회 별도 위치 복사
- 배포 전 수동 백업
- 월 1회 복원 테스트

백업 파일은 앱 VM 한 곳에만 두지 않는다.

## 성능 목표

초기 목표값:

- 홈 TTFB 500ms 이내
- 질문 상세 TTFB 700ms 이내
- 투표 응답 500ms 이내
- 핵심 페이지 JS 80KB gzip 이하를 지향
- LCP 2.5초 이내를 지향

이는 절대 SLA가 아니라 초기 품질 기준이다.


---

# 05. Database and Event Model

## 데이터 철학

데이터는 나중에 팔기 위해 무조건 많이 수집하는 것이 아니다. 제품의 진실을 증명하는 최소 데이터만 수집한다.

DB에는 제품 상태의 근거가 되는 사건을 저장한다.

- 최초 투표
- 현재 입장
- 입장 변경
- 입장 변경을 만든 댓글
- 댓글
- 추천
- 신고

일반 페이지뷰와 세션 탐색은 GA4 같은 분석 도구로 처리한다. DB에 모든 마우스 움직임과 스크롤을 저장하지 않는다.

## 익명 방문자

### 쿠키

- 이름: `prism_visitor`
- 값: 암호학적으로 안전한 32바이트 랜덤 토큰
- 속성: Secure와 HttpOnly와 SameSite=Lax
- 유효기간: 1년

### DB 저장

원본 토큰을 저장하지 않는다.

```text
visitor_key_hash = HMAC-SHA256(raw_cookie_token, APP_KEY)
```

IP 주소는 기본 식별자로 사용하지 않는다. 필요하면 단기 rate limit 용도의 일별 HMAC만 사용하고 장기 보관하지 않는다.

## 핵심 엔티티

### topics

질문과 선택지와 공개 상태와 캐시 카운터를 보관한다.

### visitors

익명 방문자 해시와 최초 및 마지막 방문 시점을 보관한다.

### topic_votes

방문자의 주제별 현재 상태를 보관한다.

- initial_option
- current_option
- voted_at
- changed_at

### vote_events

최초 투표와 입장 변경의 append-only 기록이다.

- `INITIAL_VOTE`
- `STANCE_CHANGE`

입장 변경 이벤트에는 attributed_comment_id를 저장한다.

### comments

댓글 본문과 작성 당시 side와 상태와 캐시 카운터를 보관한다.

### comment_recommendations

방문자당 댓글별 추천 1회를 보장한다.

### comment_reports

방문자당 댓글별 신고 1회를 보장한다.

## 설득 수 정의

`comment.persuasion_count`는 해당 댓글을 attribution 대상으로 선택한 유효한 `STANCE_CHANGE` 이벤트 수다.

유효 조건:

- 변경 전 현재 입장과 댓글 side가 다름
- 변경 후 입장과 댓글 side가 같음
- 같은 방문자는 해당 주제에서 이전에 변경한 적이 없음
- 댓글이 해당 주제에 속함
- 댓글이 삭제 상태가 아님

## 주제별 변심 수 정의

`topics.changed_visitor_count`는 해당 주제에서 입장 변경을 완료한 고유 방문자 수다. MVP에서 한 방문자의 변경은 주제별 1회이므로 유효 stance change 이벤트 수와 동일하다.

## 카운터 무결성

카운터는 표시 성능을 위해 denormalize한다. 원본 이벤트를 진실 원천으로 유지한다.

필요 카운터:

- topics.vote_a_count
- topics.vote_b_count
- topics.comment_count
- topics.changed_visitor_count
- comments.recommend_count
- comments.persuasion_count
- comments.report_count

운영 도구에 카운터 재계산 명령을 둔다.

## 삭제 정책

- 댓글 삭제는 hard delete보다 status 변경을 기본으로 한다.
- 운영자가 숨긴 댓글은 사용자 화면에서 본문을 노출하지 않는다.
- 이벤트는 집계 무결성을 위해 보존한다.
- 개인정보 삭제 요청이 생길 수 있으므로 익명 식별자와 콘텐츠의 분리 삭제 전략을 문서화한다.

## 이벤트 이름

GA4 또는 향후 분석 계층에서는 다음 이름을 사용한다.

```text
topic_view
vote_cast
vote_result_view
comments_open
comment_submit
comment_recommend
comment_report
stance_change
share_click
next_topic_click
```

## 데이터 품질 점검 쿼리

정기적으로 확인할 항목:

- topic counter와 topic_votes 집계의 차이
- comment recommend counter와 recommendation row 수의 차이
- comment persuasion counter와 attributed stance event 수의 차이
- 같은 방문자의 중복 initial vote
- 같은 방문자의 중복 stance change
- 같은 side comment에 attribution 된 stance change

## 인덱스 원칙

- 공개 질문: status와 published_at
- topic_votes: unique(topic_id, visitor_id)
- vote_events: topic_id와 event_type와 created_at
- comments: topic_id와 side와 status와 persuasion_count와 recommend_count
- recommendations: unique(comment_id, visitor_id)
- reports: unique(comment_id, visitor_id)

## 보존과 확장

인구통계와 민감한 성향 정보는 MVP에서 수집하지 않는다. 향후 수집이 필요해도 명시적 동의와 목적 제한과 보존 기간을 먼저 설계한다.


---

# 06. API Specification

## 공통 원칙

- JSON 요청과 응답
- 세션 기반 CSRF 토큰
- 익명 방문자 쿠키
- 성공과 실패 응답 형식 통일
- 중복 요청은 가능한 한 idempotent하게 처리
- 사용자가 볼 오류와 내부 로그 오류 분리

## 응답 형식

성공:

```json
{
  "ok": true,
  "data": {}
}
```

실패:

```json
{
  "ok": false,
  "error": {
    "code": "ALREADY_CHANGED",
    "message": "이 질문에서는 이미 한 번 생각을 바꾸셨어요."
  }
}
```

## GET /

홈 피드를 서버 렌더링한다.

## GET /t/{slug}

질문 상세를 서버 렌더링한다.

응답 상태:

- 200 published
- 404 draft 또는 archived 또는 존재하지 않음
- 410 closed를 별도 표현할지는 MVP 이후 결정

## POST /api/topics/{topicId}/vote

### 요청

```json
{
  "option": "A",
  "csrf_token": "..."
}
```

### 검증

- topic published
- option A 또는 B
- 주제별 최초 투표 없음
- rate limit 통과

### 성공 응답

```json
{
  "ok": true,
  "data": {
    "current_option": "A",
    "vote_a_count": 42,
    "vote_b_count": 38,
    "total_votes": 80,
    "percent_a": 52.5,
    "percent_b": 47.5
  }
}
```

### 오류 코드

- TOPIC_NOT_AVAILABLE
- INVALID_OPTION
- ALREADY_VOTED
- RATE_LIMITED
- CSRF_FAILED

`ALREADY_VOTED`는 현재 상태를 함께 돌려줘 UI가 복구할 수 있게 한다.

## POST /api/topics/{topicId}/comments

### 요청

```json
{
  "content": "주 4일제는 시간의 가치가 더 크다고 생각합니다.",
  "csrf_token": "..."
}
```

### 검증

- 해당 주제에 투표함
- 10~1000자
- plain text
- rate limit 통과
- topic status permits comments

댓글 side는 요청에서 받지 않고 서버의 current vote로 결정한다.

### 성공 응답

새 댓글의 안전하게 렌더링된 JSON 데이터 또는 HTML partial을 반환한다.

## POST /api/comments/{commentId}/recommend

### 요청

```json
{
  "csrf_token": "..."
}
```

### 검증

- comment status is VISIBLE
- 방문자당 1회
- 자기 댓글 추천 허용 여부는 MVP에서 허용하지 않는 것을 기본값으로 한다.

### 성공 응답

```json
{
  "ok": true,
  "data": {
    "recommended": true,
    "recommend_count": 12
  }
}
```

## POST /api/topics/{topicId}/stance-change

### 요청

```json
{
  "comment_id": 981,
  "csrf_token": "..."
}
```

`to_option`은 요청에서 신뢰하지 않는다. 서버가 comment.side로 결정한다.

### 검증

- 현재 topic vote 존재
- changed_at is NULL and no STANCE_CHANGE event exists
- comment가 같은 topic
- comment status is VISIBLE
- comment.side가 현재 option과 다름
- unique stance change event 없음

### 성공 응답

```json
{
  "ok": true,
  "data": {
    "from_option": "A",
    "to_option": "B",
    "vote_a_count": 40,
    "vote_b_count": 41,
    "changed_visitor_count": 4,
    "comment_id": 981,
    "comment_persuasion_count": 3
  }
}
```

### 오류 코드

- NO_INITIAL_VOTE
- ALREADY_CHANGED
- COMMENT_NOT_AVAILABLE
- SAME_SIDE_COMMENT
- RATE_LIMITED
- CSRF_FAILED

## POST /api/comments/{commentId}/report

### 요청

```json
{
  "reason": "ABUSE",
  "details": "선택 사항",
  "csrf_token": "..."
}
```

허용 reason:

- ABUSE
- HATE
- SPAM
- PERSONAL_INFO
- OFF_TOPIC
- OTHER

### 처리

- unique report insert
- report_count 증가
- 임계치 도달 시 `COLLAPSED`로 전환 가능
- 영구 삭제는 관리자 검토

## GET /api/topics/{topicId}/stats

MVP P1 후보다.

```json
{
  "ok": true,
  "data": {
    "vote_a_count": 42,
    "vote_b_count": 38,
    "comment_count": 19,
    "changed_visitor_count": 3,
    "updated_at": "2026-07-25T12:30:00+09:00"
  }
}
```

## 관리자 API

초기에는 서버 렌더링 form POST를 우선한다.

- POST /admin/login
- POST /admin/topics
- POST /admin/topics/{id}/update
- POST /admin/comments/{id}/hide
- POST /admin/comments/{id}/restore

관리자 변경은 감사 로그를 남기는 것을 권장한다.


---

# 07. Security, Moderation and Privacy

## 위협 모델

Prism은 익명 UGC와 투표를 다루므로 다음 위험을 기본으로 가정한다.

- 중복 투표와 추천
- 자동화 봇
- XSS와 SQL injection
- CSRF
- 욕설과 혐오와 개인정보 노출
- 집단 신고
- 관리자 계정 공격
- 카운터 레이스 컨디션
- 에이전트가 비밀값이나 운영 DB에 접근하는 문제

## 익명 식별

- IP를 사용자 ID로 쓰지 않는다.
- 랜덤 쿠키 토큰을 발급한다.
- DB에는 HMAC 해시만 저장한다.
- 쿠키는 Secure와 HttpOnly와 SameSite=Lax를 적용한다.
- 로컬 HTTP 환경에서만 Secure 예외를 허용한다.

쿠키 삭제와 브라우저 변경은 완전히 막을 수 없다. MVP에서는 데이터 조작 비용을 높이는 수준으로 접근한다.

## 입력 처리

- 댓글은 plain text만 허용한다.
- 저장 전 길이와 인코딩을 검증한다.
- 출력 시 항상 HTML escape한다.
- Markdown과 링크 자동 변환은 MVP에서 하지 않는다.
- 관리자 입력도 동일하게 검증한다.

## SQL

- 모든 사용자 입력은 prepared statement
- 동적 ORDER BY와 column은 allowlist
- DB 계정은 앱 전용 최소 권한
- 운영 DB root 접속 금지
- 외부 MariaDB 포트 차단

## CSRF

- 세션당 token
- 모든 상태 변경 POST에 필수
- JSON API도 custom header 또는 body token 검증
- Origin과 Referer 보조 검증

## rate limit 기본값

초기 제안값이며 실제 반응을 보고 조정한다.

- 최초 투표: 방문자당 주제별 1회
- 댓글 작성: 10분당 5개
- 추천: 분당 30회
- 신고: 10분당 10회
- 관리자 로그인: 15분당 5회

visitor hash와 일별 IP HMAC를 함께 사용하되 IP 원문은 저장하지 않는다.

## 신고와 숨김

신고 수만으로 영구 삭제하지 않는다.

권장 상태:

- VISIBLE: normally displayed
- COLLAPSED: automatically folded pending review
- HIDDEN: hidden by an administrator
- DELETED: administrator deletion tombstone

임시 숨김 조건은 고정 숫자 하나보다 다음을 함께 본다.

- 고유 신고자 수
- 짧은 시간 집중 여부
- 신고 이유
- 작성자의 반복 제재 여부
- 추천 대비 신고 비율

MVP 구현은 단순 임계치로 시작할 수 있으나 관리자 복구 기능을 반드시 둔다.

## 금칙어

욕설 사전은 완전한 판정기가 아니다.

- 입력 차단보다 작성 전 경고를 우선한다.
- 명백한 개인정보 패턴과 스팸 링크는 차단할 수 있다.
- 우회 표현을 이유로 과도한 정규식을 만들지 않는다.
- 자동 숨김 결과는 관리자가 복구 가능해야 한다.

## 관리자 보안

- `password_hash`와 `password_verify`
- 세션 ID 재발급
- Secure와 HttpOnly 세션 쿠키
- 로그인 rate limit
- CSRF
- 관리자 경로 noindex
- 기본 계정명 admin 금지
- 초기 비밀번호를 환경변수나 명령으로 생성 후 즉시 변경

## 비밀값

다음은 Git에 넣지 않는다.

- APP_KEY
- DB_PASSWORD
- 관리자 초기 비밀번호
- GA 측정 ID를 비밀로 취급할 필요는 없지만 환경별 분리
- GitHub token
- MCP API key
- 운영 SSH key

`.env.example`에는 placeholder만 둔다.

## Antigravity 권한

- Terminal Command Auto Execution은 Request Review
- Non-Workspace File Access는 비활성화
- Strict Mode 활성화 권장
- 운영 SSH와 운영 DB 접근은 에이전트에 직접 주지 않음
- GitHub MCP는 필요한 toolset만 사용
- MariaDB MCP는 로컬 read-only 계정만 사용
- 무작위 제3자 MCP 설치 금지

## 개인정보 최소화

MVP에서 수집하지 않는 것:

- 이름
- 이메일
- 전화번호
- 생년월일
- 성별
- 지역
- 직업
- 정당과 종교
- 광고 식별자

향후 계정 기능을 추가하기 전 개인정보처리방침과 삭제 요청 흐름과 보존 기간을 먼저 설계한다.

## 데이터 판매 원칙

장기 B2B 사업이 생겨도 다음을 지킨다.

- 개인별 원본 로그 판매 금지
- 소규모 셀 공개 금지
- 집계와 익명화
- 민감한 성향 추론 제한
- 스폰서드 질문 명확한 표시
- 분석 목적과 사용자 고지 일치

구체 법률 적합성은 공개 출시와 B2B 판매 전에 별도 전문 검토를 받는다.


---

# 08. Analytics and Experiments

## 분석 목적

MVP의 목적은 통계 논문을 만드는 것이 아니다. 사람들이 재미를 느끼고 다시 오는지와 핵심 루프가 실제로 작동하는지를 판단한다.

## 북극성 지표

장기 브랜드 지표:

**Weekly Persuaded Visitors**  
한 주 동안 유효한 입장 변경을 완료한 고유 방문자 수

초기 사업 판단의 1순위는 여전히 D1과 D7 재방문이다.

## 핵심 퍼널

```text
home_view
→ topic_view
→ vote_cast
→ comments_open
→ opposing_comments_open
→ comment_recommend 또는 comment_submit
→ stance_change
→ share_click 또는 next_topic_click
```

## 필수 KPI

### 유지

- D1 retention
- D7 retention
- 주간 활성 방문자
- 방문자당 주간 방문일 수

### 사용 깊이

- 세션당 topic_view
- 세션당 vote_cast
- 투표 후 comments_open 비율
- 반대 진영 탭 진입률
- 댓글 작성률
- 댓글 추천률
- 공유율

### 차별화

- 고유 방문자 기준 stance change rate
- attribution이 있는 stance change 비율
- 설득이 발생한 댓글 비율
- 설득 댓글의 평균 길이와 추천 수

### 가드레일

- 신고율
- 숨김 댓글 비율
- vote API 오류율
- 중복 요청 감지율
- 카운터 불일치 수
- 페이지 오류율

## 초기 목표값

다음은 성공 판정의 절대 기준이 아니라 초대형 테스트에서 볼 탐색적 목표다.

- 초대 링크 방문자의 60% 이상이 한 질문에 투표
- 투표자의 50% 이상이 댓글 탭 진입
- 세션당 2개 이상 질문 참여
- 댓글 작성률 5% 이상
- 공유율 3% 이상
- D1 25% 이상
- D7 10% 이상

입장 변경률은 주제와 초기 댓글 품질의 영향을 크게 받으므로 고정 합격선보다 실제 발생 여부와 반복성을 먼저 본다.

## 이벤트 속성

공통:

- topic_id
- category
- visitor_state: new 또는 returning
- session_topic_index
- timestamp

vote_cast:

- option
- total_votes_before

comments_open:

- tab: same 또는 opposite 또는 persuaded

stance_change:

- from_option
- to_option
- attributed_comment_id
- comment_recommend_count
- comment_persuasion_count_before

개인정보와 댓글 원문은 GA4 이벤트 속성으로 보내지 않는다.

## 실제 숫자 노출 규칙

### 홈 카드

- total votes 0~9: 숫자 숨김 가능
- total votes 10 이상: 실제 참여 수 노출
- changed visitor count 1 이상: 실제 변심 수 노출

### 댓글

- persuasion count 0: 마커 숨김
- persuasion count 1 이상: 실제 수치 노출

임계치는 UX 표시 정책일 뿐 데이터 자체를 바꾸지 않는다.

## A/B 테스트 시점

100명 수준에서는 통계적 확정 결론보다 신호를 찾는다. 첫 테스트에서는 동시에 많은 변형을 돌리지 않는다.

권장 순서:

1. 핵심 루프가 작동하는지 확인
2. 댓글 탭 기본 순서 실험
3. 입장 변경 CTA 문구 실험
4. 홈 카드 지표 문구 실험
5. 질문 구조 실험

## 분석 금지 패턴

- 전체 참여 수가 작을 때 퍼센트를 과도하게 해석
- 한 주제의 결과를 전체 사용자 성향으로 일반화
- 입장 변경을 곧바로 설득력의 인과로 단정
- 체류시간을 무조건 좋은 것으로 해석
- 스폰서가 원하는 방향으로 표본이나 결과를 편집

## 리포트 주기

첫 100명 테스트:

- 일별 오류와 퍼널 확인
- 7일 종료 후 cohort 정리
- 댓글 20개 이상은 정성 분석
- 다음 스프린트에서 바꿀 가설 1~2개만 선택


---

# 09. Business Model and Growth

## 사업 원칙

Prism은 광고를 붙이기 위해 사용자를 모으는 것이 아니다. 반복 방문을 만드는 재미를 먼저 증명하고 그 위에 수익을 얹는다.

## 성장 단계

### Stage 0. 핵심 재미 검증

목표:

- 초대 사용자 100명
- 핵심 퍼널 동작
- D1과 D7 확인
- 실제 stance change 발생

수익화:

- 없음

금지:

- 광고
- 리워드 락
- 결제
- 브랜드 의뢰

### Stage 1. 반복 방문과 콘텐츠 공급

조건 예시:

- 유입이 계속 생김
- 질문 공급이 운영 부담 없이 유지됨
- D7이 개선 추세
- 신고와 중복 조작이 통제됨

추가 후보:

- 사용자 질문 제안
- 운영자 큐레이션
- 공유 카드
- 폴링 기반 활동 신호
- 닉네임과 최소 프로필

수익화:

- 피드 사이의 비침해형 광고 실험 가능
- 댓글 읽기 자체를 광고로 잠그지 않음

### Stage 2. 스폰서드 질문

제품:

- 명확히 표시된 브랜드 질문
- 일반 질문과 동일한 투표 무결성
- 집계 리포트
- 스폰서가 댓글을 삭제하거나 결과를 편집할 수 없음

판매 가치:

- 선택 비율
- 양쪽 핵심 이유
- 실제 입장 변경의 방향
- 설득 댓글의 공통 패턴

필수 조건:

- 최소 표본 기준
- 개인정보와 민감 정보 제외
- 광고 표시
- 데이터 방법론 공개

### Stage 3. 프리미엄 사용자

가능 혜택:

- 광고 제거
- 질문 북마크
- 내 가치관 변화 기록
- 고급 검색
- 기간별 내 선택 회고

금지 혜택:

- 투표 가중치
- 추천 가중치
- 신고 우선권
- 결과 조작 가능성

### Stage 4. Prism Insights

가능 제품:

- 공개 트렌드 리포트
- 기업용 집계 대시보드
- 맞춤형 스폰서드 연구

단 개인별 프로파일과 원본 댓글 데이터 판매는 하지 않는다.

## 유입 전략

### 초기

- 지인과 직장인 커뮤니티를 통한 100명 초대
- 질문 링크 직접 공유
- 질문별 Open Graph 최적화
- 첫 사용자에게 초기 멤버 서사 제공

### 이후

- 검색 의도가 있는 현실 선택 주제
- 결과와 설득 댓글을 활용한 짧은 공유 콘텐츠
- 주간 `가장 생각을 많이 바꾼 질문`
- 주간 `가장 많은 사람을 설득한 의견`

## SEO 원칙

- 한 질문당 하나의 canonical URL
- 의미 있는 slug
- 질문과 실제 댓글이 있는 고유 페이지
- 얇은 자동 생성 페이지 대량 발행 금지
- 구조화 데이터는 실제 지원 유형만 사용
- 검색 결과에 투표율이 바로 노출된다고 가정하지 않음

## 광고 원칙

- 광고는 댓글 핵심 흐름을 가로막지 않는다.
- 미성숙한 트래픽에서 광고를 먼저 붙이지 않는다.
- 리워드 광고는 사용자가 명확한 추가 가치를 선택할 때만 검토한다.
- 광고주에게 결과 편집 권한을 주지 않는다.

## 돈이 되는 핵심 자산

코드나 질문 수가 아니다.

- 재방문하는 사용자 집단
- 신뢰 가능한 투표 무결성
- 사람들이 실제로 읽는 댓글 문화
- 특정 댓글과 입장 변경의 연결 데이터
- 스폰서가 개입할 수 없는 방법론

## 사업 중단 신호

- 질문은 클릭되지만 댓글을 읽지 않음
- 입장 변경 CTA가 거부감만 유발
- 댓글 대부분이 짧은 조롱
- 신고와 혐오 운영 비용이 감당 불가
- D7이 반복 실험에도 개선되지 않음
- 초기 사용자가 다른 커뮤니티 대비 차이를 설명하지 못함


---

# 10. Release Plan

## 릴리스 방식

큰 기능 묶음보다 수직 슬라이스를 작은 커밋으로 만든다. 각 슬라이스는 사용자에게 보이는 가치와 테스트를 함께 포함해야 한다.

## Sprint 0. 기반

- Git 초기화
- Docker Compose
- PHP 부트스트랩
- DB 연결
- 라우터
- 마이그레이션
- 테스트 기본 구조

출구 조건:

- 로컬 실행
- health check
- CI 또는 로컬 quality command

## Sprint 1. 질문과 투표

- 홈
- 질문 상세
- 익명 visitor
- 투표
- 결과 공개

출구 조건:

- 중복 투표 방지
- 모바일 투표 흐름 완주

## Sprint 2. 댓글

- A/B 댓글 탭
- 작성
- 추천
- XSS 방어

출구 조건:

- 투표 후 댓글 작성
- 반대 진영 탐색

## Sprint 3. 입장 변경

- 반대 댓글 CTA
- 트랜잭션
- 설득 마커
- 중복 방지

출구 조건:

- 특정 댓글로 한 번만 변경
- 실제 수치 일치

## Sprint 4. 운영 안전

- 신고
- 관리자 로그인
- 질문 관리
- 댓글 숨김과 복구
- rate limit

출구 조건:

- 운영자가 악성 댓글을 처리할 수 있음

## Sprint 5. 공유와 분석

- GA4 연결점
- Open Graph
- 공유
- 빈 상태와 점진적 숫자 노출

출구 조건:

- 공유 미리보기 확인
- 이벤트에 개인정보 없음

## Sprint 6. 배포와 초대 테스트

- 운영 VM
- HTTPS
- 백업
- 오류 로그
- 100명 초대

출구 조건:

- 배포 후 핵심 E2E 통과
- 복원 테스트 완료
- 개인정보 고지와 이용 규칙 최소본 게시

## Git 전략

초기:

- `main`: 배포 가능 상태
- 기능별 짧은 branch
- 한 작업에 하나의 목적
- 에이전트가 직접 push하지 않고 사용자 승인

Antigravity New Worktree Mode는 기반 스캐폴드가 안정된 뒤 사용한다. 같은 파일을 여러 에이전트가 동시에 수정하지 않는다.

## 코드 리뷰 체크

- MVP 범위를 넘어섰는가
- 실제 숫자만 사용하는가
- unique constraint와 서버 검증이 함께 있는가
- 트랜잭션 경계가 올바른가
- 모바일 상태를 검증했는가
- 오류 상태가 사용자에게 설명되는가
- 테스트가 행동을 검증하는가
- 문서가 업데이트됐는가

## 첫 사용자 테스트 운영

테스트 전:

- 시드 질문 5개 공개
- 각 질문의 맥락 검토
- 가짜 댓글 없이 시작
- 관리자 모니터링 가능

테스트 중:

- 오류와 신고 즉시 확인
- 사용자에게 기능 설명을 과도하게 하지 않음
- 실제 행동을 관찰

테스트 후:

- 퍼널
- D1과 D7
- 정성 피드백
- 설득이 발생한 댓글
- 이탈 지점
- 다음 스프린트 가설 1~2개


---

# 11. Seed Topics

## 사용 원칙

- 첫 공개는 5개로 시작한다.
- 나머지 5개는 교체용으로 보관한다.
- 질문 제목은 양쪽 선택지가 같은 수준으로 구체적이어야 한다.
- 특정 집단을 열등하게 보이게 만드는 표현을 피한다.
- 실제 조건이 중요한 질문에는 1~2문장의 맥락을 붙인다.

## Launch 5

### 1. 직장

**연봉 30% 인상 vs 주 4일제**

- A: 연봉 30% 인상
- B: 연봉 동결 주 4일제
- 맥락: 현재 업무와 책임은 동일하다고 가정합니다.
- 이유: 직장인에게 즉시 이해되고 양쪽 경험 댓글이 나오기 쉽다.

### 2. 주거

**회사 도보 10분 월세 vs 왕복 2시간 저렴한 집**

- A: 월세 30만원 더 내고 도보 10분
- B: 월세를 아끼고 왕복 2시간 통근
- 맥락: 집의 크기와 상태는 비슷하다고 가정합니다.
- 이유: 시간과 돈의 가치가 선명하게 충돌한다.

### 3. 소비

**신차 4천만원 vs 3년 된 중고차 2천만원**

- A: 신차 4천만원
- B: 3년 된 중고차 2천만원
- 맥락: 같은 차급이고 중고차는 사고 이력이 없다고 가정합니다.
- 이유: 정보와 경험이 입장 변화로 이어질 수 있다.

### 4. 관계

**결혼 전 1년 동거 vs 동거 없이 결혼**

- A: 결혼 전 1년 동거
- B: 동거 없이 결혼
- 맥락: 양가와 경제 조건은 동일하다고 가정합니다.
- 이유: 가치관과 현실 경험이 모두 드러난다.

### 5. 인간관계

**친구 3명과 깊게 vs 인맥 100명과 넓게**

- A: 친구 3명과 깊은 관계
- B: 인맥 100명과 넓은 관계
- 맥락: 일과 사생활을 모두 포함한 인간관계입니다.
- 이유: 가볍게 시작하지만 자기 경험을 쓰기 좋다.

## Reserve 5

### 6. 직장

**대기업 밤 9시 퇴근 vs 중소기업 오후 5시 퇴근**

- A: 높은 연봉의 대기업
- B: 낮은 연봉의 칼퇴 중소기업
- 주의: 회사 규모를 가치 서열로 표현하지 않는다.

### 7. 생활

**평생 커피 포기 vs 평생 술 포기**

- A: 커피 포기
- B: 술 포기
- 이유: 짧은 참여와 가벼운 공유에 적합하다.

### 8. 여행

**연 1회 2주 장기여행 vs 매달 1회 주말여행**

- A: 연 1회 2주
- B: 매달 1회 주말
- 이유: 생활 리듬과 경험 방식이 드러난다.

### 9. 기술

**AI가 내 업무 절반을 대신함 vs 내 업무 방식 유지**

- A: 업무 절반을 AI에 맡김
- B: 현재 방식과 통제 유지
- 맥락: 연봉과 고용 안정성은 동일하다고 가정합니다.
- 주의: 현재 기술 이슈와 연결되므로 댓글 사실 단정에 유의한다.

### 10. 자산

**서울 15평 자가 vs 지방 40평 자가**

- A: 서울 15평 자가
- B: 지방 40평 자가
- 맥락: 직장 선택과 가족 상황에 따라 판단이 크게 달라질 수 있음을 안내한다.
- 주의: 조건이 너무 많아 초기 anchor보다 후순위다.

## 질문 작성 템플릿

```text
카테고리:
제목:
A:
B:
맥락:
왜 양쪽이 모두 합리적인가:
운영 위험:
검색 또는 공유 가능성:
```

## 금지 주제

초기에는 다음을 공개하지 않는다.

- 특정 정당과 정치인
- 젠더 집단 일반화
- 종교 우열
- 지역 비하
- 범죄 혐의가 확정되지 않은 실존 인물
- 의료와 법률의 고위험 판단
- 자해와 폭력 미화
- 미성년자 성적 주제


---

# 12. Decision Log

## D-001. 제품을 데이터 플랫폼으로 소개하지 않는다

- 결정: 사용자에게는 재미있는 선택과 댓글 서비스로 소개한다.
- 이유: 데이터는 사용자의 방문 이유가 아니라 결과다.

## D-002. 작업명은 Prism으로 유지한다

- 결정: 개발 중에는 Prism을 사용한다.
- 조건: 공개 출시 전 상표와 도메인 검증을 통과해야 한다.

## D-003. 핵심 차별점은 설득 마커다

- 결정: 특정 댓글을 attribution 대상으로 입장 변경한다.
- 이유: 일반 추천과 다른 고유한 사용자 경험을 만든다.

## D-004. 결과는 투표 후 공개한다

- 이유: 사회적 동조를 줄이고 투표 행동을 만든다.

## D-005. 입장 변경은 주제별 1회다

- 이유: MVP 데이터 무결성과 UX 단순화를 우선한다.
- 재검토: 계정 기능과 히스토리가 생긴 이후.

## D-006. 가짜 사회적 증거를 사용하지 않는다

- 결정: 참여 수와 변심 수와 댓글은 실제 데이터만 사용한다.
- 이유: 신뢰와 장기 데이터 사업을 보호한다.

## D-007. 댓글 읽기 강제 광고를 넣지 않는다

- 이유: 핵심 경험을 잠그면 초기 리텐션 검증이 왜곡된다.

## D-008. PHP 서버 렌더링을 사용한다

- 이유: 솔로 개발과 무료 운영에서 단순성과 속도를 우선한다.

## D-009. WebSocket과 SSE를 제외한다

- 이유: MVP 핵심 루프에 필수 아님.
- 다음 단계: 필요하면 30초 폴링부터 시작.

## D-010. 프레임워크는 사용하지 않되 구조는 분리한다

- 이유: Laravel 전체 복잡도는 피하되 거대한 PHP 파일과 전역 상태도 피한다.

## D-011. 익명 방문자는 쿠키와 HMAC 해시로 식별한다

- 이유: IP 기반 식별의 부정확성과 개인정보 부담을 줄인다.

## D-012. 광고는 리텐션 검증 이후다

- 이유: 사용자 0명 단계의 광고는 수익보다 UX 손상이 크다.

## D-013. AI와 자동 주제 생성은 후순위다

- 이유: 초기 핵심은 댓글 문화와 재미다.

## D-014. 통계 실험보다 제품 신호를 먼저 본다

- 이유: 100명 수준은 일반화보다 다음 제품 결정을 위한 신호 탐색에 적합하다.

## 새 결정 기록 형식

```text
## D-XXX. 제목

- 날짜:
- 상태: 제안 / 확정 / 폐기
- 결정:
- 이유:
- 대안:
- 영향 파일:
- 재검토 조건:
```


---

# 13. Market and Brand Risks

## 결론

A/B 의견 서비스는 이미 존재한다. `토론 사이트`와 `투표 커뮤니티`라는 설명만으로는 차별화되지 않는다.

Prism의 시장 가설은 다음처럼 좁혀야 한다.

> 사람들이 이긴 댓글보다 실제로 사람의 생각을 바꾼 댓글을 더 궁금해할 것이다.

## 확인된 인접 서비스 유형

- hot take와 찬반 투표와 랭킹 중심 서비스
- AI 판정 토론 서비스
- 실시간 영상과 음성 토론 서비스
- 친구 대상 빠른 A/B 설문 서비스
- 증거 기반 구조화 토론 서비스

따라서 다음 표현은 검증 없이 사용하지 않는다.

- 세계 최초
- 인터넷 커뮤니티 역사상 처음
- 경쟁자가 전혀 없음
- 완전히 새로운 카테고리

## 차별화 wedge

### 제품

- 특정 댓글에 입장 변경 attribution
- 댓글별 실제 설득 수
- 입장 변경을 긍정적인 문화로 표현

### 데이터

- 최초 선택
- 현재 선택
- 변화 방향
- 변화와 연결된 댓글

### 브랜드

- 싸움을 부추기는 경기장이 아님
- 유연함과 호기심을 힙하게 만드는 공간

## 가장 큰 시장 위험

### 1. 빈 댓글 문제

투표는 혼자 가능하지만 댓글 재미는 사람이 필요하다. 초기에는 질문 수보다 질문당 의미 있는 댓글 밀도가 중요하다.

대응:

- 공개 질문 5개만 시작
- 운영진은 질문 맥락만 작성
- 가짜 사용자 댓글 금지
- 초대 사용자에게 첫 댓글 역할을 요청하되 운영 참여임을 속이지 않음

### 2. 기존 커뮤니티 대비 전환 이유 부족

대응:

- 설득 마커를 첫 화면과 상세에서 명확히 보여줌
- `가장 많이 추천받은 댓글`보다 `가장 많은 생각을 바꾼 댓글`을 전면화

### 3. 혐오 트래픽 유혹

대응:

- 초기 금지 카테고리
- 신고와 관리자 복구
- 브랜드 협업이 가능한 안전한 주제 비중 유지

### 4. 숫자 신뢰

대응:

- 실제 숫자만 노출
- 중복 방지
- 집계 재계산 도구
- 스폰서의 결과 편집 금지

## Prism 이름 위험

Prism은 의미가 좋지만 다음 문제가 있다.

- 일반명사
- 다양한 소프트웨어와 리서치 회사가 이미 사용
- `Prism Insights` 같은 인접 표현도 사용 중
- 검색 경쟁이 높음
- 상표 범위 충돌 가능성

## 브랜드 게이트

공개 런칭 전 반드시 수행:

1. KIPRIS와 주요 해외 상표 DB 검색
2. `.com`과 `.kr`과 주요 대체 도메인 확인
3. 앱스토어 이름 확인
4. 소셜 핸들 확인
5. 동종 서비스 혼동 검토
6. 법률 자문 필요성 판단
7. 대체 후보 3개 확보

브랜드 검증 전에는 로고와 유료 디자인 자산 투자를 최소화한다.


---

# 14. Antigravity Operating Guide

## 권장 실행 표면

첫 스캐폴드와 UI 작업은 Antigravity IDE 또는 Antigravity 2.0 Project를 사용한다. 서버 SSH 작업은 나중에 CLI를 검토한다.

## Project 설정

- 이 저장소 폴더만 Project에 추가
- Agent Non-Workspace File Access 비활성화
- Terminal Command Auto Execution: Request Review
- Artifact Review: Request Review
- Strict Mode 활성화 권장
- 첫 작업: Local Mode
- Git 기반이 잡힌 뒤 기능 분리: New Worktree Mode

에이전트가 완전 자율로 명령을 실행하는 설정은 사용하지 않는다.

## 첫 실행

1. `START_PROMPT.md` 전체를 붙여넣는다.
2. Planning Mode로 시작한다.
3. 에이전트가 만든 implementation plan을 검토한다.
4. 범위가 넓어졌으면 `.agents/skills/prism-product-guardian` 기준으로 줄인다.
5. 첫 수직 슬라이스만 승인한다.

## 브라우저 검증

Antigravity의 Browser Subagent는 명시적으로 `/browser`를 사용한다.

검증 프롬프트 예시:

```text
/browser
로컬 Prism을 390×844 모바일 뷰포트에서 열고 신규 방문자의 전체 핵심 흐름을 실행해라.
투표 전 결과가 숨겨지는지 확인하고 투표와 반대 댓글 탐색과 입장 변경을 완료해라.
스크린샷과 실패 지점과 접근성 문제를 walkthrough artifact로 남겨라.
```

Built-in browser는 시각 검증과 수동 흐름 확인에 우선 사용한다. Playwright MCP는 반복 가능한 E2E 생성과 accessibility snapshot이 필요할 때 추가한다.

## MCP 권장 순서

### Tier 1. 바로 유용

#### Context7

용도:

- PHP와 MariaDB와 Playwright와 Cloudflare의 최신 문서 확인
- 오래된 API 패턴 방지

사용 원칙:

- 외부 라이브러리나 설정이 불확실할 때만 사용
- 프로젝트 내부 결정은 docs를 우선

#### GitHub MCP

용도:

- 저장소 탐색
- 이슈와 PR
- Actions 실패 확인

설치:

- Antigravity MCP Store의 GitHub 항목 우선

권한:

- 초기에는 읽기 중심
- commit과 push와 PR 생성은 사용자 승인
- 필요한 toolset만 활성화

### Tier 2. QA 단계

#### Playwright MCP

용도:

- 브라우저 접근성 스냅샷
- 반복 UI 동작
- 테스트 코드 생성

주의:

- built-in browser와 역할이 겹침
- 처음부터 두 도구를 모두 상시 활성화하지 않음
- isolated profile 사용

### Tier 3. 스키마 안정 후

#### MariaDB MCP

용도:

- 로컬 스키마 읽기
- 읽기 전용 진단 쿼리
- 카운터 불일치 점검

금지:

- 운영 DB 자격증명
- root 계정
- write 권한
- DROP과 ALTER 자동 실행

## 설치하지 않을 MCP

초기에는 다음을 넣지 않는다.

- 범용 Filesystem MCP
- 운영 SSH MCP
- 무명 개발자의 DB write MCP
- 기능이 중복되는 여러 browser MCP
- 단순 추론을 위한 MCP 다수
- 이메일과 결제 MCP

MCP가 많을수록 도구 선택 오류와 권한 표면과 컨텍스트가 늘어난다.

## `.agents/mcp_config.json`

프로젝트에는 안전한 기본값으로 모든 서버가 disabled 처리된 실제 workspace 설정 파일과 동일한 example 파일이 들어 있다. 필요한 항목만 활성화한다. GitHub는 Store 설치를 우선한다.

## Workspace Skills

### prism-product-guardian

기능 추가와 범위 변경 전에 사용한다.

### prism-vertical-slice-builder

한 기능을 DB부터 브라우저 검증까지 완성할 때 사용한다.

### prism-mobile-ux-reviewer

모바일 화면과 카피와 접근성을 검토한다.

### prism-security-reviewer

UGC와 쿠키와 관리자와 SQL 변경을 검토한다.

### prism-data-integrity-reviewer

투표와 카운터와 설득 마커의 무결성을 검토한다.

### prism-topic-editor

초기 질문과 선택지와 맥락과 공유 문구의 균형과 안전성을 검토한다.

## Workspace Rules 활성화

Antigravity Customizations의 Rules에서 다음처럼 설정한다.

- `00-product-north-star.md`: Always On
- `10-php-backend.md`: Glob `**/*.php`
- `20-frontend-mobile.md`: Glob `public/**/*.{css,js}`와 `views/**/*.php`
- `30-database-events.md`: Glob `database/**/*.sql`와 `src/Domain/Voting/**/*.php`
- `40-security-privacy.md`: Model Decision 또는 Always On

## Workflows

워크플로가 자동 검색되지 않으면 Customizations의 Workflows에서 파일 내용을 가져와 생성한다.

- `/bootstrap-mvp`
- `/implement-slice`
- `/verify-release`
- `/scope-check`

## 권장 권한 정책

자동 허용 후보:

- git status
- git diff
- php -l
- composer test
- npm test
- docker compose ps

항상 확인:

- git commit
- git push
- docker compose down -v
- DB migration 운영 실행
- 외부 네트워크 쓰기
- MCP write action

항상 차단:

- 작업공간 밖 삭제
- 전체 드라이브 대상 명령
- 운영 DB DROP
- 비밀 파일 출력
- 무제한 `rm -rf`

## 멀티 에이전트 사용

첫 기반은 한 에이전트가 만든다. 이후 역할을 분리할 수 있다.

권장 subagent:

- QA reviewer: 쓰기 권한 없이 테스트와 위험 탐색
- Security reviewer: 쓰기 권한 없이 보안 검토
- UX reviewer: 브라우저와 스크린샷 중심

Backend와 frontend 에이전트가 같은 파일을 동시에 수정하는 구조는 피한다.

## 완료 선언 조건

에이전트는 다음이 없으면 완료라고 말하면 안 된다.

- 변경 파일 요약
- 실행한 테스트와 결과
- 브라우저 검증 결과
- 남은 위험
- 문서 변경
- 다음 수직 슬라이스 제안


---

# 15. Acceptance Criteria

## 홈

- [ ] published 질문만 노출된다.
- [ ] 카드에서 A와 B 선택지가 명확하다.
- [ ] 참여 10명 미만의 표시 정책이 적용된다.
- [ ] 실제 변심이 0이면 변심 문구가 없다.
- [ ] 390px에서 가로 스크롤이 없다.

## 투표

- [ ] 투표 전 결과가 숨겨진다.
- [ ] A 또는 B 한 번 탭으로 투표된다.
- [ ] visitor당 topic별 최초 투표가 1회다.
- [ ] 중복 요청이 카운트를 늘리지 않는다.
- [ ] 투표 뒤 정확한 실제 결과가 표시된다.
- [ ] 오류 뒤 사용자가 재시도할 수 있다.

## 댓글

- [ ] 투표 전 댓글 작성이 불가능하다.
- [ ] 댓글 side는 서버의 현재 투표에서 결정된다.
- [ ] A와 B 댓글을 분리해서 볼 수 있다.
- [ ] 10자 미만과 1000자 초과가 거부된다.
- [ ] HTML과 script가 실행되지 않는다.
- [ ] visitor당 comment별 추천은 1회다.
- [ ] 추천 재요청이 중복 카운트를 만들지 않는다.

## 입장 변경

- [ ] 반대 side 댓글에만 CTA가 보인다.
- [ ] 같은 side 댓글로 변경 API를 호출하면 거부된다.
- [ ] visitor당 topic별 1회만 가능하다.
- [ ] 변경은 comment_id와 연결된다.
- [ ] vote counter 두 개가 원자적으로 갱신된다.
- [ ] topic changed count가 한 번만 증가한다.
- [ ] comment persuasion count가 한 번만 증가한다.
- [ ] 재요청이 중복 이벤트를 만들지 않는다.
- [ ] 0명일 때 설득 마커가 보이지 않는다.

## 신고와 운영

- [ ] visitor당 comment별 신고는 1회다.
- [ ] 신고가 영구 삭제로 바로 이어지지 않는다.
- [ ] 관리자가 숨김과 복구를 할 수 있다.
- [ ] 관리자 로그인에 rate limit이 있다.
- [ ] 관리자 상태 변경에 CSRF가 있다.

## 보안

- [ ] 모든 SQL 사용자 입력이 prepared statement다.
- [ ] 모든 상태 변경 요청에 CSRF 검증이 있다.
- [ ] visitor 원본 token이 DB에 저장되지 않는다.
- [ ] 운영 DB 포트가 외부에 노출되지 않는다.
- [ ] `.env`와 키 파일이 Git에 없다.
- [ ] 오류 응답에 stack trace와 비밀값이 없다.

## 모바일과 접근성

- [ ] 390×844에서 전체 루프를 완료한다.
- [ ] 주요 터치 영역이 44px 이상이다.
- [ ] 키보드만으로 투표와 댓글 탐색이 가능하다.
- [ ] 포커스 표시가 보인다.
- [ ] 색상 외 진영 라벨이 있다.
- [ ] reduced motion이 존중된다.

## 성능

- [ ] 홈과 상세에 불필요한 N+1 쿼리가 없다.
- [ ] 댓글 목록 쿼리가 인덱스를 사용한다.
- [ ] 정적 파일에 적절한 cache header가 있다.
- [ ] 이미지 없이도 핵심 레이아웃이 완성된다.

## 배포

- [ ] health endpoint가 있다.
- [ ] DB migration 절차가 문서화됐다.
- [ ] 백업이 생성된다.
- [ ] 백업 복원이 검증됐다.
- [ ] HTTPS가 적용됐다.
- [ ] 배포 후 E2E smoke test가 통과한다.


---

# 16. MCP and Skill Matrix

## Principle

Use the smallest tool surface that removes a real information or execution gap. More MCP servers do not mean a better agent. They add permissions, context, failure modes, and tool-selection ambiguity.

## Recommended setup

| Need | First choice | Add only when | Access policy |
|---|---|---|---|
| Product scope | `prism-product-guardian` skill | Any feature or priority changes | Workspace only |
| End-to-end feature build | `prism-vertical-slice-builder` skill | An approved slice is ready | Workspace only |
| Mobile visual QA | Antigravity `/browser` | Every user-facing slice | Ask for browser access |
| Repeatable browser automation | Playwright Test in repository | Core flow becomes stable | Local test environment |
| Exploratory agent browser control | Playwright MCP | Built-in browser cannot express the loop | Disabled by default, isolated profile |
| Current library docs | Context7 MCP | API or configuration details may be stale | Read only |
| Repository, issues, PRs | GitHub MCP | A remote repository exists | Read-only first, writes require review |
| Database diagnosis | MariaDB MCP | Schema is stable and manual SQL becomes costly | Local or replica, read-only account |
| Security review | `prism-security-reviewer` skill | Every write path and release | No production secrets |
| Counter reconciliation | `prism-data-integrity-reviewer` skill | Any social proof or state counter changes | Local or read-only replica |
| Launch topic quality | `prism-topic-editor` skill | Seed or editorial topics are created | No live web data required |

## Do not install for the MVP

- A general filesystem MCP. Antigravity already has workspace file access.
- A production SSH MCP.
- A database MCP with write privileges.
- Multiple overlapping browser MCP servers.
- Stripe, email, notification, or ad-network MCP servers.
- Trend scraping and AI publishing tools.
- A vector database or RAG stack.

## Activation order

1. Start with workspace rules and skills only.
2. Use the built-in browser for visual QA.
3. Enable Context7 when an external API or version is uncertain.
4. Connect GitHub after the local foundation is committed.
5. Enable Playwright MCP only for exploratory agent loops. Keep Playwright Test as the release gate.
6. Add MariaDB read-only access only after the schema exists and integrity queries are useful.

## GitHub policy

Prefer the Antigravity MCP Store for OAuth installation. Start with the read-only remote endpoint. Allow issue or PR writes only after the repository workflow is stable. Commit, push, merge, branch deletion, and release publication always require explicit review.

## Database policy

A database MCP is diagnostic. It is not the migration engine. Schema changes remain versioned SQL files reviewed in Git. Production data access is outside the MVP agent workflow.


---

# 17. Windows and Antigravity Quick Start

## Prepare the folder

1. Extract the starter pack to a short local path such as `C:\dev\prism`.
2. Open PowerShell in that folder.
3. Initialize Git.
4. Copy `.env.example` to `.env`.
5. Replace `APP_KEY` with at least 32 random bytes. A local PHP command can generate a hexadecimal value:

```powershell
php scripts/generate_app_key.php
```

Do not commit `.env`.

## Create the Antigravity Project

1. Create a new Project and add only this folder.
2. Start in Local Mode.
3. Use Planning Mode.
4. Set terminal execution to Request Review.
5. Set artifact review to Request Review.
6. Set outside-folder access to Always Deny.
7. Enable Strict Mode for the initial bootstrap when available.

Strict Mode may block network package installation. Temporarily approve only the exact Composer or npm action after reviewing it rather than switching the whole Project to Always Proceed.

## Activate customizations

### Skills

Antigravity should discover folders under `.agents/skills/`. Confirm the six Prism skills appear in Customizations.

### Rules

Configure activation in the Rules panel:

- `00-product-north-star.md`: Always On
- `10-php-backend.md`: Glob `**/*.php`
- `20-frontend-mobile.md`: Glob `public/**/*.{css,js}` and `views/**/*.php`
- `30-database-events.md`: Glob `database/**/*.sql` and `src/Domain/Voting/**/*.php`
- `40-security-privacy.md`: Always On or Model Decision

### Workflows

Confirm these slash commands are available:

- `/bootstrap-mvp`
- `/implement-slice`
- `/verify-release`
- `/scope-check`

## MCP setup

The workspace file `.agents/mcp_config.json` and its example copy ship with every server disabled.

Recommended sequence:

1. Install GitHub from the Antigravity MCP Store after creating the repository.
2. Enable only the needed Context7 or Playwright entry in `.agents/mcp_config.json`.
3. Keep every new server disabled until its purpose and permissions are reviewed.
4. Do not connect MariaDB MCP to production. A local read-only user is the maximum recommended access.

## First conversation

Paste all of `START_PROMPT.md` into a new Planning Mode conversation. Review the generated implementation plan. Approve only Work Group 0 or the first vertical slice.

## Local runtime

After the bootstrap slice creates the application entry point:

```powershell
Copy-Item .env.example .env

docker compose up -d --build

docker compose ps
```

Open the local site at `http://localhost:8080` and the database only through `127.0.0.1:3307` when a local client is needed.

Never run `docker compose down -v` unless intentionally deleting the local database volume.


---

# 18. Cold Start Launch Playbook

## Goal

The first launch is not a public growth campaign. It is a controlled test of whether the comment loop is enjoyable enough to create another visit.

## No fake activity

- No fabricated votes, comments, accounts, recommendations, or persuasion counts.
- No staff comments presented as ordinary users.
- No prefilled participant numbers.
- Empty states are part of the launch story.

## Cohorts

### Rehearsal: 5 to 10 people

Purpose:

- Find broken paths and confusing copy.
- Verify mobile keyboards, cookie behavior, duplicate requests, reports, and administration.
- Do not interpret retention.

### Founding cohort: 30 to 50 people

Purpose:

- Create real comments across the five launch topics.
- Observe whether people open the opposing side without being instructed.
- Ask for usability feedback after the session, not during it.

### First signal cohort: about 100 people

Purpose:

- Measure the funnel, D1, D7, topic depth, and real stance changes.
- Compare qualitative comments with analytics.
- Select only one or two next experiments.

## Invitation message principle

Promise curiosity, not research participation.

Good framing:

- Pick a side and see why the other side disagrees.
- Some comments may genuinely change your mind.

Avoid:

- Help us collect valuable data.
- Join a behavioral science experiment.
- Defeat the other side.

## Content concentration

Launch with five published topics. Do not expose all ten. A question with ten meaningful comments is more valuable than ten empty questions.

Rotate a draft topic only when:

- One live topic is clearly exhausted.
- The new topic covers a missing interest area.
- The team can moderate it.

## Daily checks during the first week

- Application errors and failed writes.
- Vote and persuasion counter reconciliation.
- Reports and personal information exposure.
- Topic view to vote conversion.
- Vote to comment-open conversion.
- Opposing-tab open rate.
- Comments written and their quality.
- Shares and next-topic clicks.

## Decision after seven days

### Continue and polish

Use when people understand the product, comments are read, and at least some users return.

### Change the content strategy

Use when voting is strong but comments are not read. Improve topic framing and initial comment density before adding features.

### Change the comment experience

Use when users open comments but do not continue across sides or do not understand attribution.

### Pause the concept

Use when repeated tests show no differentiated value from ordinary polls or communities.

Do not use a weak first week as evidence for B2B data demand or advertising potential.


---

# Near-Zero-Cost Infrastructure Plan

## Objective

Launch the Prism MVP with an infrastructure cost floor close to zero while preserving a clean migration path. This is not a promise of unlimited free hosting. Free-tier capacity, regional availability, provider policy, domain fees, backups, and growth can create costs.

## Reference topology

```text
Browser
  -> Cloudflare Free
  -> Oracle Cloud Always Free VM
  -> Nginx
  -> PHP-FPM
  -> MariaDB on the same VM
```

Use one VM for the MVP. Do not add Redis, a managed database, object storage, a queue service, Kubernetes, or a separate analytics pipeline before measured load requires it.

## Current free-tier planning assumption

Plan for an Oracle Ampere A1 allocation of up to 2 OCPUs and 12 GB RAM in total for Always Free use. Treat capacity as subject to region availability and provider policy. Do not base the business model on a previously advertised 4 OCPU and 24 GB figure.

Use Cloudflare Free for DNS, Universal SSL, CDN caching of public static assets, and baseline DDoS protection. Dynamic vote, comment, moderation, and admin traffic will still reach the origin.

## Cost boundaries

The following may not remain free:

- Public domain registration and renewal
- Off-site backups
- Email delivery
- SMS or identity verification
- AI APIs
- Large media storage
- Monitoring retention
- Additional bandwidth or compute after growth

For an invite-only validation run, a temporary hostname can be used. A public launch should use an owned domain and HTTPS.

## Local development

Use Docker Compose for repeatable local development:

- Nginx
- PHP-FPM
- MariaDB 11.8

Do not use the production VM as the primary development environment.

## Production baseline

- Ubuntu LTS or another currently supported Linux distribution
- Nginx and PHP-FPM
- MariaDB bound to localhost only
- SSH key authentication only
- Root login disabled
- Host firewall allowing only required ports
- Cloudflare proxy enabled for the public web hostname
- Daily logical database backup
- Weekly restore test during MVP validation
- Application logs with rotation and no raw visitor tokens
- Secrets outside Git

## ARM compatibility gate

Oracle Ampere instances use ARM. Before deployment verify that:

- The selected PHP packages are architecture independent or ARM compatible
- Container images support `linux/arm64`
- Any native extensions build successfully on ARM
- Playwright E2E runs in CI or on a compatible test environment if production does not need browser binaries

## Cache policy

Cache only public and non-personalized assets at first:

- CSS
- JavaScript
- Images
- Public Open Graph images

Do not edge-cache vote results, personalized states, admin pages, CSRF tokens, or comment submission responses without an explicit cache design.

## Backup policy

A free server without a tested backup is not a business platform.

Minimum MVP policy:

1. Create a daily encrypted database dump.
2. Keep at least seven daily copies.
3. Store at least one copy outside the production VM.
4. Document a restore command.
5. Run a restore drill before public launch.

If off-site backup cannot be provided at zero cost, treat it as the first justified operating expense.

## Observability without a paid stack

Start with:

- Nginx access and error logs
- PHP application logs
- MariaDB slow query log with a conservative threshold
- A simple health endpoint that does not expose secrets
- GA4 for user behavior where consent requirements are satisfied
- Scheduled database integrity queries from `database/integrity_audit.sql`

Do not collect more personal data merely to improve observability.

## Scaling triggers

Do not scale because of imagined traffic. Revisit the architecture when one or more measured conditions persist:

- Origin CPU saturation
- Memory pressure or swap use
- Database lock waits
- Slow query growth
- P95 page latency above the agreed target
- Disk usage above 70 percent
- Backup duration or restore time outside the recovery objective
- A single popular topic creating write contention
- Moderation volume exceeding the operator's capacity

Potential next steps are query optimization, cached public counters, a read replica or managed database, object storage for media, or a queue for non-critical jobs. WebSocket infrastructure is not an automatic next step.

## Failure policy

If the free VM is reclaimed or unavailable, the project must be recoverable from Git, environment templates, database backups, and the deployment runbook. Provider-specific convenience must not become an undocumented dependency.

## Decision

The MVP optimizes for low fixed cost and reversibility rather than unlimited scale. Revenue validation comes before infrastructure expansion. Reliability and recoverability still take priority over preserving a literal zero-dollar bill.
