# Prism Antigravity Starter Pack

> 작업명: **Prism**  
> 사용자 문장: **생각은 바뀔 수 있다.**  
> 내부 원칙: **기능은 문화를 만든다. 문화는 데이터를 만든다. 데이터는 비즈니스를 만든다.**

이 패키지는 Google Antigravity에서 Prism MVP를 바로 기획하고 구현할 수 있도록 만든 프로젝트 컨텍스트입니다. 단순 아이디어 메모가 아니라 제품 원칙과 MVP 범위와 데이터 무결성 기준과 Antigravity 작업 규칙을 한 묶음으로 구성했습니다.

## 가장 먼저 읽을 파일

1. `START_PROMPT.md` — Antigravity 첫 대화에 붙여넣을 시작 프롬프트
2. `implementation_plan.md` — 권장 구현 순서와 완료 기준
3. `docs/00_EXECUTIVE_SUMMARY.md` — 전체 의사결정 요약
4. `docs/02_MVP_SCOPE.md` — 이번 버전에 넣을 것과 뺄 것
5. `docs/14_ANTIGRAVITY_OPERATING_GUIDE.md` — Antigravity 설정과 MCP 운영법
6. `docs/16_MCP_SKILL_MATRIX.md` — MCP와 workspace skill 선택 기준
7. `docs/18_COLD_START_LAUNCH_PLAYBOOK.md` — 첫 100명 검증과 콜드스타트 운영
8. `docs/19_ZERO_COST_INFRASTRUCTURE_PLAN.md` — 0원에 가까운 초기 인프라와 확장 기준
9. `PRISM_MASTER_SPEC.md` — 전체 기획 통합본
10. `ANTIGRAVITY_PROMPT_LIBRARY.md` — 단계별 후속 프롬프트

## 프로젝트 핵심

Prism은 토론에서 이기는 서비스를 만들지 않습니다. 다른 사람의 의견을 읽다가 자신의 생각이 바뀌는 순간을 재미있게 만드는 서비스를 만듭니다.

핵심 루프는 다음과 같습니다.

```text
질문 발견
→ A/B 투표
→ 결과 확인
→ 내 진영과 반대 진영 댓글 탐색
→ 댓글 추천 또는 의견 작성
→ 특정 댓글로 생각이 바뀜
→ 실제 설득 수치가 댓글에 표시됨
→ 공유 또는 다음 질문으로 이동
```

## MVP 기술 기준

- PHP 8.4 중심의 서버 렌더링
- MariaDB
- Nginx + PHP-FPM
- Vanilla JavaScript와 CSS
- Composer PSR-4 자동 로딩
- PHPUnit
- Playwright E2E
- Docker Compose 로컬 환경
- 운영 환경은 Oracle Cloud Always Free 우선 검토
- Cloudflare는 도메인 확보 후 DNS와 SSL과 CDN에 사용

## 중요한 현실 조건

- `Prism`은 **작업명**입니다. 유사 서비스와 기업명이 많으므로 공개 출시 전 상표와 도메인 검증이 필요합니다.
- 완전한 0원 운영을 보장하지 않습니다. 목표는 **초기 월 고정비를 0원에 가깝게 유지하는 것**입니다. 도메인 비용과 무료 인프라 정책 변경과 용량 부족은 별도 변수입니다.
- 첫 버전에는 AI 요약과 자동 주제 생성과 광고를 넣지 않습니다.
- 숫자는 실제 데이터만 표시합니다. 초기 사회적 증거를 만들기 위한 가짜 참여 수와 가짜 댓글은 금지합니다.

## Antigravity에서 시작하는 순서

1. 이 폴더를 Git 저장소로 초기화합니다.
2. Antigravity에서 새 Project로 추가합니다.
3. Planning Mode와 Request Review를 선택합니다.
4. 비작업공간 파일 접근은 끕니다.
5. `START_PROMPT.md` 전체를 첫 대화에 붙여넣습니다.
6. 에이전트가 만든 `implementation_plan.md` 변경안을 검토합니다.
7. 첫 승인 대상은 기반 작업 또는 하나의 수직 슬라이스로 제한합니다.
8. 구현 후 `/browser`로 모바일과 데스크톱 흐름을 검증합니다.

## 폴더 안내

```text
.agents/
  rules/       프로젝트 고정 규칙
  skills/      Prism 전용 재사용 스킬
  workflows/   반복 개발 절차
  mcp_config.json          모두 비활성화된 안전한 workspace MCP 설정
  mcp_config.example.json  원본 예시

database/      초기 스키마와 시드 주제

docs/          제품과 기술과 사업 명세

infra/         로컬 Docker 개발 환경 예시
```

## 첫 번째 성공 조건

출시 여부가 아니라 다음 질문에 답할 수 있어야 합니다.

- 초대받은 사용자가 질문을 하나 이상 투표하는가
- 투표 후 댓글을 실제로 읽는가
- 반대 진영 댓글까지 탐색하는가
- 특정 댓글 때문에 생각을 바꾸는 행동이 발생하는가
- 다음 날이나 다음 주에 다시 오는가

최초 테스트에서는 수익보다 **재미와 재방문**을 먼저 확인합니다.
