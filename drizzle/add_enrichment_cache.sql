-- Add enrichment_cache table for caching website analysis results
CREATE TABLE IF NOT EXISTS `enrichment_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`website_key` varchar(500) NOT NULL,
	`original_url` varchar(500) NOT NULL,
	`technologies` json,
	`tech_summary` json,
	`gap_analysis` json,
	`website_analysis` json,
	`domain_info` json,
	`social_metrics` json,
	`lead_score` int,
	`score_breakdown` json,
	`opportunities` json,
	`analysis_status` enum('pending','processing','completed','failed') DEFAULT 'pending',
	`error_message` text,
	`analyzed_at` timestamp,
	`expires_at` timestamp NOT NULL,
	`hit_count` int DEFAULT 0,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `enrichment_cache_id` PRIMARY KEY(`id`),
	CONSTRAINT `enrichment_cache_website_key_unique` UNIQUE(`website_key`)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS `idx_website_key` ON `enrichment_cache` (`website_key`);
CREATE INDEX IF NOT EXISTS `idx_status` ON `enrichment_cache` (`analysis_status`);
CREATE INDEX IF NOT EXISTS `idx_expires` ON `enrichment_cache` (`expires_at`);
