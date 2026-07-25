-- Prism counter reconciliation. Run against a local or read-only replica first.

SELECT
    t.id AS topic_id,
    t.slug,
    t.vote_a_count AS cached_a,
    SUM(tv.current_option = 'A') AS actual_a,
    t.vote_b_count AS cached_b,
    SUM(tv.current_option = 'B') AS actual_b
FROM topics t
LEFT JOIN topic_votes tv ON tv.topic_id = t.id
GROUP BY t.id, t.slug, t.vote_a_count, t.vote_b_count
HAVING cached_a <> actual_a OR cached_b <> actual_b;

SELECT
    t.id AS topic_id,
    t.slug,
    t.changed_visitor_count AS cached_changes,
    COUNT(ve.id) AS actual_changes
FROM topics t
LEFT JOIN vote_events ve
    ON ve.topic_id = t.id
   AND ve.event_type = 'STANCE_CHANGE'
GROUP BY t.id, t.slug, t.changed_visitor_count
HAVING cached_changes <> actual_changes;

SELECT
    c.id AS comment_id,
    c.persuasion_count AS cached_persuasion,
    COUNT(ve.id) AS actual_persuasion
FROM comments c
LEFT JOIN vote_events ve
    ON ve.attributed_comment_id = c.id
   AND ve.event_type = 'STANCE_CHANGE'
GROUP BY c.id, c.persuasion_count
HAVING cached_persuasion <> actual_persuasion;

SELECT
    c.id AS comment_id,
    c.recommend_count AS cached_recommendations,
    COUNT(cr.id) AS actual_recommendations
FROM comments c
LEFT JOIN comment_recommendations cr ON cr.comment_id = c.id
GROUP BY c.id, c.recommend_count
HAVING cached_recommendations <> actual_recommendations;

SELECT
    c.id AS comment_id,
    c.report_count AS cached_reports,
    COUNT(cr.id) AS actual_reports
FROM comments c
LEFT JOIN comment_reports cr ON cr.comment_id = c.id
GROUP BY c.id, c.report_count
HAVING cached_reports <> actual_reports;

SELECT
    ve.id,
    ve.topic_id,
    ve.visitor_id,
    ve.from_option,
    ve.to_option,
    c.side AS attributed_comment_side,
    c.topic_id AS attributed_comment_topic
FROM vote_events ve
JOIN comments c ON c.id = ve.attributed_comment_id
WHERE ve.event_type = 'STANCE_CHANGE'
  AND (
      c.topic_id <> ve.topic_id
      OR c.side <> ve.to_option
      OR c.side = ve.from_option
  );
