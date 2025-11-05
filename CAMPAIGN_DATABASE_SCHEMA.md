# MySQL Database Structure for Campaigns

This document outlines the database schema required to support the campaign functionality in the Bema Hub application, including both the campaign listing page and individual campaign detail pages.

## Overview

The campaign system requires several tables to store campaign information, user participation data, updates, leaderboard information, and other related data.

## Database Tables

### 1. campaigns

Stores the main campaign information.

```sql
CREATE TABLE campaigns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(500),
    status ENUM('active', 'inactive', 'pro_only', 'application_open') DEFAULT 'active',
    category VARCHAR(100),
    level_required ENUM('all', 'pro', 'ambassador', 'pro_ambassador') DEFAULT 'all',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    organizer_id INT,
    max_participants INT DEFAULT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(255),
    meta_description TEXT
);
```

### 2. campaign_rewards

Stores the rewards associated with each campaign.

```sql
CREATE TABLE campaign_rewards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    reward_name VARCHAR(255) NOT NULL,
    reward_description TEXT,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id)
);
```

### 3. campaign_participants

Tracks user participation in campaigns.

```sql
CREATE TABLE campaign_participants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    points_earned INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    referral_code VARCHAR(50),
    UNIQUE KEY unique_participation (campaign_id, user_id),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_user_id (user_id),
    INDEX idx_points (points_earned)
);
```

### 4. campaign_updates

Stores updates/announcements for campaigns.

```sql
CREATE TABLE campaign_updates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_published (published_at)
);
```

### 5. campaign_milestones

Stores milestone information for campaigns.

```sql
CREATE TABLE campaign_milestones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    target_participants INT NOT NULL,
    label VARCHAR(255) NOT NULL,
    reward_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id)
);
```

### 6. campaign_milestone_unlocks

Tracks when milestones are unlocked/completed.

```sql
CREATE TABLE campaign_milestone_unlocks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    milestone_id INT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    participant_count INT NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (milestone_id) REFERENCES campaign_milestones(id) ON DELETE CASCADE,
    UNIQUE KEY unique_milestone_unlock (campaign_id, milestone_id)
);
```

### 7. campaign_activities

Stores activities users can complete in campaigns.

```sql
CREATE TABLE campaign_activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id)
);
```

### 8. campaign_activity_completions

Tracks user completion of campaign activities.

```sql
CREATE TABLE campaign_activity_completions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_id INT NOT NULL,
    participant_id INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    proof_data JSON,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP NULL,
    verified_by INT NULL,
    FOREIGN KEY (activity_id) REFERENCES campaign_activities(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES campaign_participants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_completion (activity_id, participant_id),
    INDEX idx_participant (participant_id),
    INDEX idx_completed (completed_at)
);
```

### 9. campaign_faq

Stores frequently asked questions for campaigns.

```sql
CREATE TABLE campaign_faq (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id)
);
```

### 10. campaign_shares

Tracks campaign sharing activity.

```sql
CREATE TABLE campaign_shares (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    user_id INT,
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    share_platform VARCHAR(50),
    share_url VARCHAR(500),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_user_id (user_id)
);
```

### 11. campaign_tags

Stores tags for categorizing campaigns.

```sql
CREATE TABLE campaign_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);
```

### 12. campaign_tag_relationships

Many-to-many relationship between campaigns and tags.

```sql
CREATE TABLE campaign_tag_relationships (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    tag_id INT NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES campaign_tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_campaign_tag (campaign_id, tag_id)
);
```

## Additional Considerations

### Indexes
- All foreign key columns should have indexes for performance
- Consider adding full-text indexes on title and description fields for search functionality
- Add indexes on date fields for filtering campaigns by date ranges

### Views
Consider creating database views for common queries such as:
- Active campaigns with participant counts
- User leaderboard for specific campaigns
- Campaign completion statistics

### Stored Procedures
Consider stored procedures for:
- Calculating leaderboard positions
- Unlocking milestones when participant thresholds are met
- Awarding points for activity completions

## Sample Queries

### Get campaign with basic info
```sql
SELECT 
    c.id,
    c.slug,
    c.title,
    c.description,
    c.cover_image_url,
    c.status,
    c.category,
    c.level_required,
    c.start_date,
    c.end_date,
    COUNT(cp.id) as participant_count
FROM campaigns c
LEFT JOIN campaign_participants cp ON c.id = cp.campaign_id AND cp.is_active = TRUE
WHERE c.slug = ?
GROUP BY c.id;
```

### Get campaign leaderboard
```sql
SELECT 
    u.id as user_id,
    u.first_name,
    u.last_name,
    u.avatar_url,
    cp.points_earned
FROM campaign_participants cp
JOIN users u ON cp.user_id = u.id
WHERE cp.campaign_id = ? AND cp.is_active = TRUE
ORDER BY cp.points_earned DESC
LIMIT 10;
```

This database structure provides a solid foundation for the campaign functionality while allowing for future enhancements and scalability.