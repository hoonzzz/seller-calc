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
