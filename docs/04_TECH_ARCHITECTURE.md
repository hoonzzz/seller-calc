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
