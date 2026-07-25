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
