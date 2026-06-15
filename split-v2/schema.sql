-- ============================================================================
-- GrainTCP Split V2 Frontend D1 Schema
-- ============================================================================
-- 目标：前端 Worker 绑定 D1，复用原 worker.js / split/backend-worker.js 的面板表结构，
--      只额外增加 backends 表保存多个后端域名与各自 Cloudflare API 凭据。
-- ============================================================================

-- 新增：后端节点管理表
CREATE TABLE IF NOT EXISTS backends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    domain TEXT NOT NULL UNIQUE,
    uuid TEXT NOT NULL,
    sub_password TEXT NOT NULL,
    cf_account_id TEXT,
    cf_api_token TEXT,
    status TEXT DEFAULT 'active',
    remark TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- 复用原 worker.js：控制台配置表
CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- 复用原 worker.js：白名单表
CREATE TABLE IF NOT EXISTS whitelist (
    ip TEXT PRIMARY KEY,
    created_at INTEGER
);

-- 复用原 worker.js：操作日志表
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time TEXT,
    ip TEXT,
    region TEXT,
    action TEXT
);

-- 复用原 worker.js：本地每日统计兜底表
CREATE TABLE IF NOT EXISTS stats (
    date TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_backends_status ON backends(status);
CREATE INDEX IF NOT EXISTS idx_backends_created_at ON backends(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_time ON logs(time DESC);

-- 默认配置：保持原 worker.js 控制台命名和行为，不写入任何新 UI 样式。
INSERT OR IGNORE INTO config (key, value) VALUES
    ('LOGIN_PAGE_TITLE', 'Worker Login'),
    ('DASHBOARD_TITLE', '烈火控制台 · Glass LH'),
    ('TG_GROUP_URL', 'https://t.me/zyssadmin'),
    ('SITE_URL', 'https://blog.mtcacg.top'),
    ('GITHUB_URL', 'https://github.com/TyrEamon/CFW-GrainTCP'),
    ('PROXY_CHECK_URL', 'https://kaic.hidns.co/'),
    ('SUBAPI', 'https://subapi.cmliussss.net'),
    ('DLS', '7'),
    ('ECH_ENABLED', 'true'),
    ('ECH_SNI', 'cloudflare-ech.com'),
    ('ECH_DNS', 'https://odvr.nic.cz/doh'),
    ('GLASS_A', '72'),
    ('SCRIM_A', '55');

-- 如果你之前执行过旧版 split-v2/schema.sql，请新建 D1 或手动迁移旧表；
-- 旧版 whitelist/logs 字段名与原 worker.js 不一致，会导致原控制台接口读取失败。
