SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(100) NOT NULL,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE visitors (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    visitor_key_hash BINARY(32) NOT NULL,
    first_seen_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_visitors_key_hash (visitor_key_hash),
    KEY idx_visitors_last_seen (last_seen_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE topics (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug VARCHAR(160) NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    option_a_label VARCHAR(160) NOT NULL,
    option_b_label VARCHAR(160) NOT NULL,
    context_text TEXT NULL,
    status ENUM('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    vote_a_count INT UNSIGNED NOT NULL DEFAULT 0,
    vote_b_count INT UNSIGNED NOT NULL DEFAULT 0,
    comment_count INT UNSIGNED NOT NULL DEFAULT 0,
    changed_visitor_count INT UNSIGNED NOT NULL DEFAULT 0,
    published_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_topics_slug (slug),
    KEY idx_topics_status_published (status, published_at),
    KEY idx_topics_category_status (category, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE topic_votes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    topic_id BIGINT UNSIGNED NOT NULL,
    visitor_id BIGINT UNSIGNED NOT NULL,
    initial_option ENUM('A', 'B') NOT NULL,
    current_option ENUM('A', 'B') NOT NULL,
    changed_at TIMESTAMP NULL DEFAULT NULL,
    voted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_topic_votes_topic_visitor (topic_id, visitor_id),
    KEY idx_topic_votes_topic_current (topic_id, current_option),
    KEY idx_topic_votes_visitor (visitor_id),
    CONSTRAINT fk_topic_votes_topic
        FOREIGN KEY (topic_id) REFERENCES topics (id),
    CONSTRAINT fk_topic_votes_visitor
        FOREIGN KEY (visitor_id) REFERENCES visitors (id),
    CONSTRAINT chk_topic_votes_changed
        CHECK (
            (changed_at IS NULL AND initial_option = current_option)
            OR
            (changed_at IS NOT NULL AND initial_option <> current_option)
        )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE comments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    topic_id BIGINT UNSIGNED NOT NULL,
    visitor_id BIGINT UNSIGNED NOT NULL,
    side ENUM('A', 'B') NOT NULL,
    content VARCHAR(1000) NOT NULL,
    status ENUM('VISIBLE', 'COLLAPSED', 'HIDDEN', 'DELETED') NOT NULL DEFAULT 'VISIBLE',
    recommend_count INT UNSIGNED NOT NULL DEFAULT 0,
    persuasion_count INT UNSIGNED NOT NULL DEFAULT 0,
    report_count INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_comments_topic_side_feed (
        topic_id,
        side,
        status,
        persuasion_count,
        recommend_count,
        created_at
    ),
    KEY idx_comments_visitor_created (visitor_id, created_at),
    CONSTRAINT fk_comments_topic
        FOREIGN KEY (topic_id) REFERENCES topics (id),
    CONSTRAINT fk_comments_visitor
        FOREIGN KEY (visitor_id) REFERENCES visitors (id),
    CONSTRAINT chk_comments_content_length
        CHECK (CHAR_LENGTH(content) BETWEEN 10 AND 1000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vote_events (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    topic_id BIGINT UNSIGNED NOT NULL,
    visitor_id BIGINT UNSIGNED NOT NULL,
    event_type ENUM('INITIAL_VOTE', 'STANCE_CHANGE') NOT NULL,
    from_option ENUM('A', 'B') NULL,
    to_option ENUM('A', 'B') NOT NULL,
    attributed_comment_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_vote_events_once_per_type (topic_id, visitor_id, event_type),
    KEY idx_vote_events_topic_type_created (topic_id, event_type, created_at),
    KEY idx_vote_events_comment_type (attributed_comment_id, event_type),
    CONSTRAINT fk_vote_events_topic
        FOREIGN KEY (topic_id) REFERENCES topics (id),
    CONSTRAINT fk_vote_events_visitor
        FOREIGN KEY (visitor_id) REFERENCES visitors (id),
    CONSTRAINT fk_vote_events_comment
        FOREIGN KEY (attributed_comment_id) REFERENCES comments (id),
    CONSTRAINT chk_vote_events_shape CHECK (
        (
            event_type = 'INITIAL_VOTE'
            AND from_option IS NULL
            AND attributed_comment_id IS NULL
        )
        OR
        (
            event_type = 'STANCE_CHANGE'
            AND from_option IS NOT NULL
            AND from_option <> to_option
            AND attributed_comment_id IS NOT NULL
        )
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE comment_recommendations (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    comment_id BIGINT UNSIGNED NOT NULL,
    visitor_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_comment_recommendations_comment_visitor (comment_id, visitor_id),
    KEY idx_comment_recommendations_visitor_created (visitor_id, created_at),
    CONSTRAINT fk_comment_recommendations_comment
        FOREIGN KEY (comment_id) REFERENCES comments (id),
    CONSTRAINT fk_comment_recommendations_visitor
        FOREIGN KEY (visitor_id) REFERENCES visitors (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE comment_reports (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    comment_id BIGINT UNSIGNED NOT NULL,
    visitor_id BIGINT UNSIGNED NOT NULL,
    reason ENUM('SPAM', 'ABUSE', 'HATE', 'PERSONAL_INFO', 'OFF_TOPIC', 'OTHER') NOT NULL,
    detail VARCHAR(500) NULL,
    status ENUM('OPEN', 'DISMISSED', 'ACTIONED') NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_comment_reports_comment_visitor (comment_id, visitor_id),
    KEY idx_comment_reports_status_created (status, created_at),
    KEY idx_comment_reports_visitor_created (visitor_id, created_at),
    CONSTRAINT fk_comment_reports_comment
        FOREIGN KEY (comment_id) REFERENCES comments (id),
    CONSTRAINT fk_comment_reports_visitor
        FOREIGN KEY (visitor_id) REFERENCES visitors (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE admin_users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE',
    failed_login_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    locked_until TIMESTAMP NULL DEFAULT NULL,
    last_login_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_admin_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE admin_audit_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    admin_user_id BIGINT UNSIGNED NOT NULL,
    action_name VARCHAR(80) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id BIGINT UNSIGNED NULL,
    before_json JSON NULL,
    after_json JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_admin_audit_admin_created (admin_user_id, created_at),
    KEY idx_admin_audit_target (target_type, target_id, created_at),
    CONSTRAINT fk_admin_audit_admin
        FOREIGN KEY (admin_user_id) REFERENCES admin_users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rate_limit_buckets (
    bucket_key BINARY(32) NOT NULL,
    action_name VARCHAR(60) NOT NULL,
    window_started_at TIMESTAMP NOT NULL,
    hit_count INT UNSIGNED NOT NULL DEFAULT 1,
    expires_at TIMESTAMP NOT NULL,
    PRIMARY KEY (bucket_key, action_name, window_started_at),
    KEY idx_rate_limit_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
