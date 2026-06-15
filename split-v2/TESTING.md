# 🧪 快速测试指南

## 测试环境准备

### 前置条件
- ✅ 已安装 Wrangler CLI
- ✅ 已登录 Cloudflare 账号（`wrangler login`）
- ✅ 至少有 1 个可用的 Cloudflare Workers 配额

---

## 📝 测试步骤

### Step 1: 部署前端订阅器

```bash
cd split-v2

# 1. 创建 D1 数据库
wrangler d1 create graintcp-subscriber-db

# 记录输出的 database_id，例如：
# database_id = "12345678-1234-1234-1234-123456789abc"

# 2. 编辑 wrangler.frontend.jsonc
# 将 database_id 填入 "database_id" 字段

# 3. 初始化数据库
wrangler d1 execute graintcp-subscriber-db --file=schema.sql

# 4. 部署前端
wrangler deploy --config wrangler.frontend.jsonc

# 5. 记录前端地址，例如：
# https://graintcp-subscriber.your-subdomain.workers.dev
```

### Step 2: 部署后端节点（至少 2 个）

```bash
# 1. 创建第一个后端配置
cp wrangler.backend.example.toml wrangler.backend-test1.toml

# 2. 编辑 wrangler.backend-test1.toml
# 修改以下字段：
#   name = "graintcp-backend-test1"
#   UUID = "your-real-uuid"
#   SUB_PASSWORD = "test123"
#   PANEL_ORIGIN = "https://graintcp-subscriber.your-subdomain.workers.dev"

# 3. 部署第一个后端
wrangler deploy --config wrangler.backend-test1.toml

# 4. 记录后端地址，例如：
# https://graintcp-backend-test1.your-subdomain.workers.dev

# 5. 重复步骤 1-4，创建第二个后端（wrangler.backend-test2.toml）
```

### Step 3: 测试前端控制台

1. **访问前端地址**：
   ```
   https://graintcp-subscriber.your-subdomain.workers.dev
   ```

2. **登录**：
   - 密码：`admin123`（或你在 `wrangler.frontend.jsonc` 中配置的密码）

3. **添加第一个后端**：
   - 点击「+ 添加后端」
   - 填写信息：
     ```
     后端名称: 测试节点1
     后端域名: https://graintcp-backend-test1.your-subdomain.workers.dev
     UUID: your-real-uuid
     订阅密码: test123
     CF Account ID: （可选）
     CF API Token: （可选）
     备注: 用于测试
     ```
   - 保存

4. **测试后端连通性**：
   - 点击「测试连通性」按钮
   - 应该显示「✅ 在线」

5. **添加第二个后端**（重复步骤 3-4）

### Step 4: 测试订阅链接生成

1. **预设后端模式**：
   - 选择「测试节点1」
   - 输入订阅密码：`test123`
   - 点击「生成订阅链接」
   - 复制链接，格式应为：
     ```
     https://graintcp-subscriber.xxx.workers.dev/sub?backend=1&password=test123
     ```

2. **自定义后端模式**：
   - 选择「自定义后端 URL」
   - 输入自定义域名和密码
   - 生成链接，格式应为：
     ```
     https://graintcp-subscriber.xxx.workers.dev/sub?backend=custom&url=...&password=...
     ```

### Step 5: 测试订阅代理功能

使用浏览器或 `curl` 测试订阅链接：

```bash
# 方法 1：浏览器直接访问
# 打开生成的订阅链接，应该返回订阅内容（Base64 或 JSON）

# 方法 2：使用 curl
curl "https://graintcp-subscriber.xxx.workers.dev/sub?backend=1&password=test123"

# 预期结果：返回后端生成的订阅内容
```

### Step 6: 测试 CF 统计查询（可选）

**前提**：需要配置后端的 CF Account ID 和 API Token

1. 在控制台点击「查看统计」
2. 应该显示过去 24 小时的请求数

**获取 CF API Token**：
```
1. 访问：https://dash.cloudflare.com/profile/api-tokens
2. 创建 Token，权限：Account Analytics (Read)
3. 复制 Token
4. 在控制台编辑后端，填入 Account ID 和 API Token
```

---

## ✅ 测试检查清单

### 前端功能
- [ ] 登录成功
- [ ] 添加后端成功
- [ ] 后端列表正确显示
- [ ] 测试连通性成功
- [ ] 生成订阅链接（预设模式）
- [ ] 生成订阅链接（自定义模式）
- [ ] 删除后端成功
- [ ] 查看统计（配置 CF API 后）

### 后端功能
- [ ] `/api/health` 接口返回正常
- [ ] `/sub` 接口返回订阅内容
- [ ] `/<SUB_PASSWORD>` 路径返回订阅内容

### 订阅代理功能
- [ ] 预设后端订阅链接可访问
- [ ] 自定义后端订阅链接可访问
- [ ] 返回的订阅内容正确
- [ ] 密码错误时返回 403

---

## 🐛 常见问题快速修复

### 问题 1：前端无法访问后端 API（CORS 错误）

**现象**：浏览器控制台显示 CORS 错误

**解决**：
```bash
# 检查后端配置中的 PANEL_ORIGIN
# 确保值为前端 Worker 地址
# 例如：PANEL_ORIGIN = "https://graintcp-subscriber.xxx.workers.dev"

# 修改后重新部署后端
wrangler deploy --config wrangler.backend-test1.toml
```

### 问题 2：登录后显示空白

**现象**：登录成功但看不到控制台

**解决**：
```bash
# 检查浏览器控制台的错误信息
# 可能是 D1 数据库未初始化

# 重新执行数据库初始化
wrangler d1 execute graintcp-subscriber-db --file=schema.sql
```

### 问题 3：订阅链接返回 403

**现象**：访问订阅链接返回「订阅密码错误」

**解决**：
- 检查前端填写的订阅密码是否与后端 `SUB_PASSWORD` 一致
- 在控制台编辑后端，修正订阅密码

### 问题 4：测试连通性失败

**现象**：点击「测试连通性」显示「❌ 离线」

**可能原因**：
1. 后端未部署成功
2. 后端域名填写错误
3. 后端未添加 `/api/health` 接口（使用旧版后端）

**解决**：
```bash
# 1. 检查后端是否部署成功
wrangler deployments list --name graintcp-backend-test1

# 2. 手动测试后端健康接口
curl https://graintcp-backend-test1.xxx.workers.dev/api/health

# 预期返回：{"status":"ok","timestamp":...}
```

---

## 📊 测试结果记录

测试完成后，请记录以下信息：

```
=== 测试环境 ===
前端地址: https://graintcp-subscriber.xxx.workers.dev
后端1地址: https://graintcp-backend-test1.xxx.workers.dev
后端2地址: https://graintcp-backend-test2.xxx.workers.dev

=== 测试结果 ===
[ ] 前端登录：成功 / 失败
[ ] 添加后端：成功 / 失败
[ ] 测试连通性：成功 / 失败
[ ] 生成订阅链接：成功 / 失败
[ ] 订阅代理：成功 / 失败
[ ] CF 统计查询：成功 / 失败 / 未测试

=== 遇到的问题 ===
（记录任何问题和解决方法）

=== 改进建议 ===
（记录任何改进建议）
```

---

## 🎯 测试通过标准

核心功能测试通过的标准：

1. ✅ 前端可以正常登录
2. ✅ 可以添加至少 2 个后端
3. ✅ 可以生成订阅链接（预设 + 自定义）
4. ✅ 订阅链接可以正常访问并返回内容
5. ✅ 测试连通性功能正常

如果以上 5 项都通过，说明核心功能已可用！🎉

---

## 📞 需要帮助？

如果测试过程中遇到问题，请提供：
1. 错误截图或控制台日志
2. 测试结果记录
3. wrangler.toml 配置（脱敏后）

祝测试顺利！
