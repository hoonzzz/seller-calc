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
