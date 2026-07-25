SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- The first five topics are published for the invitation-only MVP.
-- The remaining topics are kept as drafts for controlled rotation.

INSERT INTO topics (
    slug, category, title, option_a_label, option_b_label,
    context_text, status, published_at
) VALUES (
    'salary-raise-vs-four-day-week', 'CAREER', '연봉 30% 인상 vs 주 4일제', '연봉 30% 인상', '연봉 동결 주 4일제',
    '현재 업무와 책임은 동일하다고 가정합니다.', 'PUBLISHED', CURRENT_TIMESTAMP
) ON DUPLICATE KEY UPDATE
    category = VALUES(category),
    title = VALUES(title),
    option_a_label = VALUES(option_a_label),
    option_b_label = VALUES(option_b_label),
    context_text = VALUES(context_text);

INSERT INTO topics (
    slug, category, title, option_a_label, option_b_label,
    context_text, status, published_at
) VALUES (
    'walk-to-work-vs-cheaper-long-commute', 'HOUSING', '회사 도보 10분 월세 vs 왕복 2시간 저렴한 집', '월세 30만원 더 내고 도보 10분', '월세를 아끼고 왕복 2시간 통근',
    '집의 크기와 상태는 비슷하다고 가정합니다.', 'PUBLISHED', CURRENT_TIMESTAMP
) ON DUPLICATE KEY UPDATE
    category = VALUES(category),
    title = VALUES(title),
    option_a_label = VALUES(option_a_label),
    option_b_label = VALUES(option_b_label),
    context_text = VALUES(context_text);

INSERT INTO topics (
    slug, category, title, option_a_label, option_b_label,
    context_text, status, published_at
) VALUES (
    'new-car-vs-three-year-used-car', 'CONSUMPTION', '신차 4천만원 vs 3년 된 중고차 2천만원', '신차 4천만원', '3년 된 중고차 2천만원',
    '같은 차급이고 중고차는 사고 이력이 없다고 가정합니다.', 'PUBLISHED', CURRENT_TIMESTAMP
) ON DUPLICATE KEY UPDATE
    category = VALUES(category),
    title = VALUES(title),
    option_a_label = VALUES(option_a_label),
    option_b_label = VALUES(option_b_label),
    context_text = VALUES(context_text);

INSERT INTO topics (
    slug, category, title, option_a_label, option_b_label,
    context_text, status, published_at
) VALUES (
    'cohabit-before-marriage-vs-no-cohabitation', 'RELATIONSHIP', '결혼 전 1년 동거 vs 동거 없이 결혼', '결혼 전 1년 동거', '동거 없이 결혼',
    '양가와 경제 조건은 동일하다고 가정합니다.', 'PUBLISHED', CURRENT_TIMESTAMP
) ON DUPLICATE KEY UPDATE
    category = VALUES(category),
    title = VALUES(title),
    option_a_label = VALUES(option_a_label),
    option_b_label = VALUES(option_b_label),
    context_text = VALUES(context_text);

INSERT INTO topics (
    slug, category, title, option_a_label, option_b_label,
    context_text, status, published_at
) VALUES (
    'three-deep-friends-vs-wide-network', 'SOCIAL', '친구 3명과 깊게 vs 인맥 100명과 넓게', '친구 3명과 깊은 관계', '인맥 100명과 넓은 관계',
    '일과 사생활을 모두 포함한 인간관계입니다.', 'PUBLISHED', CURRENT_TIMESTAMP
) ON DUPLICATE KEY UPDATE
    category = VALUES(category),
    title = VALUES(title),
    option_a_label = VALUES(option_a_label),
    option_b_label = VALUES(option_b_label),
    context_text = VALUES(context_text);

INSERT INTO topics (
    slug, category, title, option_a_label, option_b_label,
    context_text, status, published_at
) VALUES (
    'late-large-company-vs-early-small-company', 'CAREER', '대기업 밤 9시 퇴근 vs 중소기업 오후 5시 퇴근', '높은 연봉의 대기업', '낮은 연봉의 칼퇴 중소기업',
    NULL, 'DRAFT', NULL
) ON DUPLICATE KEY UPDATE
    category = VALUES(category),
    title = VALUES(title),
    option_a_label = VALUES(option_a_label),
    option_b_label = VALUES(option_b_label),
    context_text = VALUES(context_text);

INSERT INTO topics (
    slug, category, title, option_a_label, option_b_label,
    context_text, status, published_at
) VALUES (
    'give-up-coffee-vs-give-up-alcohol', 'LIFESTYLE', '평생 커피 포기 vs 평생 술 포기', '커피 포기', '술 포기',
    NULL, 'DRAFT', NULL
) ON DUPLICATE KEY UPDATE
    category = VALUES(category),
    title = VALUES(title),
    option_a_label = VALUES(option_a_label),
    option_b_label = VALUES(option_b_label),
    context_text = VALUES(context_text);

INSERT INTO topics (
    slug, category, title, option_a_label, option_b_label,
    context_text, status, published_at
) VALUES (
    'one-long-trip-vs-monthly-weekend-trip', 'TRAVEL', '연 1회 2주 장기여행 vs 매달 1회 주말여행', '연 1회 2주', '매달 1회 주말',
    NULL, 'DRAFT', NULL
) ON DUPLICATE KEY UPDATE
    category = VALUES(category),
    title = VALUES(title),
    option_a_label = VALUES(option_a_label),
    option_b_label = VALUES(option_b_label),
    context_text = VALUES(context_text);

INSERT INTO topics (
    slug, category, title, option_a_label, option_b_label,
    context_text, status, published_at
) VALUES (
    'delegate-half-work-to-ai-vs-keep-control', 'TECHNOLOGY', 'AI가 내 업무 절반을 대신함 vs 내 업무 방식 유지', '업무 절반을 AI에 맡김', '현재 방식과 통제 유지',
    '연봉과 고용 안정성은 동일하다고 가정합니다.', 'DRAFT', NULL
) ON DUPLICATE KEY UPDATE
    category = VALUES(category),
    title = VALUES(title),
    option_a_label = VALUES(option_a_label),
    option_b_label = VALUES(option_b_label),
    context_text = VALUES(context_text);

INSERT INTO topics (
    slug, category, title, option_a_label, option_b_label,
    context_text, status, published_at
) VALUES (
    'small-seoul-home-vs-large-regional-home', 'ASSET', '서울 15평 자가 vs 지방 40평 자가', '서울 15평 자가', '지방 40평 자가',
    '직장 선택과 가족 상황에 따라 판단이 크게 달라질 수 있음을 안내한다.', 'DRAFT', NULL
) ON DUPLICATE KEY UPDATE
    category = VALUES(category),
    title = VALUES(title),
    option_a_label = VALUES(option_a_label),
    option_b_label = VALUES(option_b_label),
    context_text = VALUES(context_text);
