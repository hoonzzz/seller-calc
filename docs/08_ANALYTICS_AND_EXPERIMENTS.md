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
