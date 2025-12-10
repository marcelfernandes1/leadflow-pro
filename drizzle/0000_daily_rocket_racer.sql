CREATE TABLE `enrichment_cache` (
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
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `enrichment_cache_id` PRIMARY KEY(`id`),
	CONSTRAINT `enrichment_cache_website_key_unique` UNIQUE(`website_key`)
);
--> statement-breakpoint
CREATE TABLE `job_postings_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`company_name` varchar(255) NOT NULL,
	`job_postings` json NOT NULL,
	`scraped_at` timestamp NOT NULL DEFAULT (now()),
	`expires_at` timestamp NOT NULL,
	`source` varchar(50) DEFAULT 'indeed+upwork',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `job_postings_cache_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lead_activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lead_id` int NOT NULL,
	`user_id` int NOT NULL,
	`activity_type` enum('contacted','note_added','stage_changed','tag_added','follow_up_scheduled','enriched') NOT NULL,
	`contact_method` enum('email','phone','instagram','facebook','linkedin','twitter','website','in_person'),
	`details` json,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `lead_activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`business_name` varchar(255) NOT NULL,
	`category` varchar(255),
	`address` text,
	`city` varchar(255),
	`state` varchar(100),
	`zip` varchar(20),
	`country` varchar(100),
	`phone` varchar(50),
	`email` varchar(320),
	`website` varchar(500),
	`instagram` varchar(255),
	`facebook` varchar(255),
	`linkedin` varchar(255),
	`twitter` varchar(255),
	`tiktok` varchar(255),
	`youtube` varchar(255),
	`email_verified` int,
	`email_verification_score` int,
	`email_verification_status` varchar(20),
	`social_metrics` json,
	`google_rating` decimal(2,1),
	`google_review_count` int,
	`business_hours` json,
	`photos` json,
	`technology_stack` json,
	`lead_score` int DEFAULT 0,
	`score_breakdown` json,
	`opportunities` json,
	`growth_signals` json,
	`last_enriched_at` timestamp,
	`enrichment_status` enum('pending','processing','completed','failed') DEFAULT 'pending',
	`stage` enum('new','contacted','qualified','proposal','negotiation','won','lost') DEFAULT 'new',
	`tags` json,
	`notes` text,
	`custom_fields` json,
	`last_contacted_at` timestamp,
	`last_contact_method` varchar(50),
	`next_follow_up_at` timestamp,
	`source` varchar(100) DEFAULT 'google_maps',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scraping_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`job_type` enum('google_maps','tech_stack','job_postings') NOT NULL,
	`status` enum('pending','running','completed','failed') DEFAULT 'pending',
	`apify_run_id` varchar(255),
	`input` json,
	`output` json,
	`error` text,
	`credits_used` decimal(10,4),
	`created_at` timestamp DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `scraping_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `search_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`filters` json,
	`scraped_at` timestamp NOT NULL,
	`last_served_at` timestamp,
	`serve_count` int DEFAULT 0,
	`lead_count` int NOT NULL,
	`lead_ids` json NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `search_cache_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` enum('user','admin') DEFAULT 'user',
	`subscription_tier` enum('free','pro','agency','enterprise') DEFAULT 'free',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `idx_website_key` ON `enrichment_cache` (`website_key`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `enrichment_cache` (`analysis_status`);--> statement-breakpoint
CREATE INDEX `idx_expires` ON `enrichment_cache` (`expires_at`);--> statement-breakpoint
CREATE INDEX `idx_company` ON `job_postings_cache` (`company_name`);--> statement-breakpoint
CREATE INDEX `idx_expires` ON `job_postings_cache` (`expires_at`);--> statement-breakpoint
CREATE INDEX `idx_lead` ON `lead_activities` (`lead_id`);--> statement-breakpoint
CREATE INDEX `idx_date` ON `lead_activities` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_user` ON `leads` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_score` ON `leads` (`lead_score`);--> statement-breakpoint
CREATE INDEX `idx_stage` ON `leads` (`stage`);--> statement-breakpoint
CREATE INDEX `idx_follow_up` ON `leads` (`next_follow_up_at`);--> statement-breakpoint
CREATE INDEX `idx_user` ON `scraping_jobs` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `scraping_jobs` (`status`);--> statement-breakpoint
CREATE INDEX `idx_search` ON `search_cache` (`category`,`location`);--> statement-breakpoint
CREATE INDEX `idx_age` ON `search_cache` (`scraped_at`);