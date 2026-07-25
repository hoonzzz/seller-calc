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
