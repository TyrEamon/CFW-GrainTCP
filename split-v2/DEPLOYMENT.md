# GrainTCP 订阅器 - 部署文档

## 📦 架构说明

本项目采用「前端订阅器 + 后端代理节点」分离架构：

- **前端 Worker**：订阅器 + 全局控制台（绑定 D1，管理多个后端）
- **后端 Worker**：纯代理服务（环境变量配置，无 D1 依赖）

---

## 🚀 快速部署

### 一、部署前端订阅器

#### 1.1 创建 D1 数据库

```bash
# 创建数据库
wrangler d1 create graintcp-subscriber-db

# 记录输出的 database_id，例如：
# database_id = "12345678-1234-1234-1234-123456789abc"
```

#### 1.2 初始化数据库表结构

```bash
# 执行 schema.sql
wrangler d1 execute graintcp-subscriber-db --file=schema.sql
```

#### 1.3 配置 wrangler.frontend.jsonc

编辑 `wrangler.frontend.jsonc`，填入你的 D1 数据库 ID：

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "graintcp-subscriber-db",
      "database_id": "填入步骤1.1的database_id"
    }
  ],
  "vars": {
    "WEB_PASSWORD": "修改为你的前端控制台密码",
    "FRONTEND_TITLE": "GrainTCP 订阅器"
  }
}
```

#### 1.4 部署前端 Worker

```bash
cd split-v2
wrangler deploy --config wrangler.frontend.jsonc
```

部署成功后，会显示前端访问地址，例如：
```
https://graintcp-subscriber.your-subdomain.workers.dev
```

---

### 二、部署后端代理节点

#### 2.1 准备配置文件

复制示例配置：

```bash
cp wrangler.backend.example.toml wrangler.backend-us1.toml
```

#### 2.2 修改配置

编辑 `wrangler.backend-us1.toml`：

```toml
name = "graintcp-backend-us1"  # 修改为唯一名称
main = "backend-worker-lite.js"

[vars]
UUID = "your-real-uuid"
SUB_PASSWORD = "your-sub-password"
WEB_PASSWORD = "your-web-password"
PROXY_IP = "proxyip.example.com"

# Telegram Bot（可选）
TG_BOT_TOKEN = "your-tg-bot-token"
TG_CHAT_ID = "your-tg-chat-id"

# Cloudflare CORS（允许前端访问）
PANEL_ORIGIN = "https://graintcp-subscriber.your-subdomain.workers.dev"
```

**重要**：`PANEL_ORIGIN` 必须设置为前端 Worker 的域名，否则前端无法访问后端 API。

#### 2.3 部署后端 Worker

```bash
wrangler deploy --config wrangler.backend-us1.toml
```

部署成功后，记录后端访问地址，例如：
```
https://graintcp-backend-us1.your-subdomain.workers.dev
```

#### 2.4 部署多个后端（可选）

重复步骤 2.1-2.3，为每个后端创建独立的配置文件：

```bash
# 美国节点
wrangler deploy --config wrangler.backend-us1.toml

# 日本节点
wrangler deploy --config wrangler.backend-jp1.toml

# 新加坡节点
wrangler deploy --config wrangler.backend-sg1.toml
```

---

### 三、前端添加后端节点

#### 3.1 访问前端控制台

打开前端 Worker 地址：
```
https://graintcp-subscriber.your-subdomain.workers.dev
```

使用 `wrangler.frontend.jsonc` 中配置的 `WEB_PASSWORD` 登录。

#### 3.2 添加后端节点

点击「+ 添加后端」，填写信息：

| 字段 | 示例 | 说明 |
|------|------|------|
| 后端名称 | 美国节点1 | 便于识别 |
| 后端域名 | https://graintcp-backend-us1.xxx.workers.dev | 步骤 2.3 的地址 |
| UUID | 06b65903-... | 与后端配置一致 |
| 订阅密码 | 123456 | 与后端配置一致 |
| CF Account ID | abc123... | 用于查询统计（可选） |
| CF API Token | xxxyyy... | 用于查询统计（可选） |
| 备注 | 美国洛杉矶 | 可选 |

保存后，点击「测试连通性」验证配置是否正确。

---

### 四、生成订阅链接

#### 4.1 在控制台生成

1. 在「📊 订阅链接生成」区域，选择已添加的后端
2. 输入订阅密码
3. 点击「生成订阅链接」
4. 复制生成的链接，格式：
   ```
   https://graintcp-subscriber.xxx.workers.dev/sub?backend=1&password=123456
   ```

#### 4.2 自定义后端模式

如果选择「自定义后端 URL」：
1. 输入任意后端域名（不需要提前在控制台添加）
2. 输入该后端的订阅密码
3. 生成的链接格式：
   ```
   https://graintcp-subscriber.xxx.workers.dev/sub?backend=custom&url=https://xxx.workers.dev&password=123456
   ```

---

## 🔧 获取 Cloudflare API Token

### 方法 1：创建 API Token（推荐）

1. 访问：https://dash.cloudflare.com/profile/api-tokens
2. 点击「Create Token」
3. 选择「Create Custom Token」
4. 权限配置：
   - **Account** → **Account Analytics** → **Read**
5. Account Resources：选择你的账号
6. 创建并复制 Token

### 方法 2：使用 Global API Key（不推荐）

1. 访问：https://dash.cloudflare.com/profile/api-tokens
2. 找到「Global API Key」→ 点击「View」

**注意**：API Token 更安全，推荐使用方法 1。

### 获取 Account ID

1. 登录 Cloudflare Dashboard
2. 进入任意一个站点
3. 在右侧边栏找到「Account ID」

---

## 📊 查询后端请求数

前端控制台支持查询各后端的 Cloudflare 请求统计：

1. 确保已配置后端的 `CF Account ID` 和 `CF API Token`
2. 在后端卡片中点击「查看统计」
3. 显示过去 24 小时的请求数

**API 接口**：
```
GET /api/backends/:id/stats?range=24h
```

支持的 `range` 参数：
- `1h` - 过去1小时
- `24h` - 过去24小时
- `7d` - 过去7天
- `30d` - 过去30天

---

## 🐛 常见问题

### 1. 前端无法访问后端 API（CORS 错误）

**原因**：后端未配置 `PANEL_ORIGIN`

**解决**：在后端 `wrangler.backend.toml` 中添加：
```toml
[vars]
PANEL_ORIGIN = "https://graintcp-subscriber.your-subdomain.workers.dev"
```

重新部署后端：
```bash
wrangler deploy --config wrangler.backend.toml
```

### 2. 订阅链接返回 403「订阅密码错误」

**原因**：前端填写的订阅密码与后端配置不一致

**解决**：
1. 检查后端 `wrangler.backend.toml` 中的 `SUB_PASSWORD`
2. 在前端控制台修改该后端的订阅密码，确保一致

### 3. 查询统计失败「未配置 CF API」

**原因**：未填写 `CF Account ID` 或 `CF API Token`

**解决**：
1. 按照上方「获取 Cloudflare API Token」步骤获取
2. 在前端控制台编辑后端，填入这两个字段

### 4. D1 数据库初始化失败

**检查**：
```bash
# 确认数据库是否存在
wrangler d1 list

# 查看表结构
wrangler d1 execute graintcp-subscriber-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## 🔄 更新与维护

### 更新前端 Worker

```bash
cd split-v2
wrangler deploy --config wrangler.frontend.jsonc --keep-vars
```

`--keep-vars` 保留控制台设置的环境变量。

### 更新后端 Worker

```bash
wrangler deploy --config wrangler.backend-us1.toml --keep-vars
```

### 备份 D1 数据库

```bash
# 导出数据
wrangler d1 export graintcp-subscriber-db --output=backup.sql

# 恢复数据
wrangler d1 execute graintcp-subscriber-db --file=backup.sql
```

---

## 📝 后端 Lite 版本说明

`backend-worker-lite.js` 相比原 `backend-worker.js` 的改动：

1. **移除 D1 依赖**：所有配置从环境变量读取
2. **内存日志**：`/api/logs` 返回内存中的最新日志（重启后清空）
3. **内存统计**：今日请求数存储在内存（重启后重置）
4. **新增接口**：
   - `GET /api/health` - 健康检查
   - `GET /api/logs?limit=100` - 查询日志

**适用场景**：
- ✅ 多后端分布式部署
- ✅ 无需持久化存储
- ✅ 简化配置管理

**不适用场景**：
- ❌ 需要长期保存日志
- ❌ 需要跨重启保留统计数据

---

## 🎯 下一步优化

- [ ] 前端支持批量测试后端连通性
- [ ] 前端支持订阅链接二维码生成
- [ ] 后端支持主动上报日志到前端
- [ ] 前端支持 WebSocket 实时日志
- [ ] 支持自定义订阅转换参数
- [ ] 支持后端负载均衡

---

## 📞 技术支持

遇到问题？参考：
- GitHub 项目: https://github.com/TyrEamon/CFW-GrainTCP
- Telegram 群组: https://t.me/zyssadmin

祝部署顺利！🎉
