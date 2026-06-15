# GrainTCP Split V2 - 订阅器架构

## 📂 目录结构

```
split-v2/
├── schema.sql                          # D1 数据库表结构
├── backend-worker-lite.js              # 后端 Worker（Lite 版本）
├── frontend-worker-subscriber.js       # 前端订阅器 Worker
├── wrangler.backend.example.toml       # 后端配置示例
├── wrangler.frontend.jsonc             # 前端配置
├── DEPLOYMENT.md                       # 部署文档
├── IMPLEMENTATION_PLAN.md              # 实施计划
└── README.md                           # 本文件
```

## 🎯 项目概述

将 GrainTCP 改造为「前端订阅器 + 后端代理节点」架构：

### 前端（订阅器）
- ✅ 绑定 D1 数据库，存储后端节点列表
- ✅ 提供全局控制台，管理多个后端
- ✅ 订阅代理功能（支持预设 + 自定义后端）
- ✅ Cloudflare Analytics API 集成（查询各后端请求数）
- ✅ 简洁的 Web UI（登录 + 后端管理 + 订阅生成）

### 后端（代理节点）
- ✅ 纯环境变量配置，无 D1 依赖
- ✅ 保留核心代理功能和订阅生成
- ✅ 支持健康检查接口 `/api/health`
- ✅ 支持日志查询接口 `/api/logs`
- ✅ 可部署多个实例，由前端统一管理

## 🚀 快速开始

### 1. 部署前端

> **入口文件说明**：直接部署或复制到 Cloudflare Dashboard 时，请使用 `frontend-worker-subscriber.js`。`frontend-worker-subscriber.src.js` 是开发源码，包含 `import ../split/frontend-worker.js`，不能作为单文件直接复制部署。修改源码后运行 `node build-standalone.mjs` 重新生成可部署文件。

```bash
# 创建 D1 数据库
wrangler d1 create graintcp-subscriber-db

# 初始化表结构
wrangler d1 execute graintcp-subscriber-db --file=schema.sql

# 修改 wrangler.frontend.jsonc，填入 database_id

# 部署前端
wrangler deploy --config wrangler.frontend.jsonc
```

### 2. 部署后端

```bash
# 复制配置示例
cp wrangler.backend.example.toml wrangler.backend-us1.toml

# 编辑配置，填入 UUID、SUB_PASSWORD 等

# 部署后端
wrangler deploy --config wrangler.backend-us1.toml
```

### 3. 添加后端到前端

1. 访问前端 Worker 地址
2. 使用密码登录
3. 点击「+ 添加后端」
4. 填写后端信息（域名、UUID、订阅密码等）

### 4. 生成订阅链接

1. 在控制台选择后端
2. 输入订阅密码
3. 点击「生成订阅链接」
4. 复制链接到订阅客户端

详细部署步骤请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📊 功能特性

### 前端订阅器

| 功能 | 状态 | 说明 |
|------|------|------|
| 后端管理 | ✅ | 添加、编辑、删除、测试后端 |
| 订阅代理 | ✅ | 代理订阅请求到指定后端 |
| 自定义后端 | ✅ | 支持临时输入任意后端域名 |
| CF 统计查询 | ✅ | 查询各后端的 CF 请求数 |
| 健康检查 | ✅ | 测试后端连通性 |
| 简洁 UI | ✅ | 现代化渐变玻璃态风格 |

### 后端代理节点

| 功能 | 状态 | 说明 |
|------|------|------|
| 核心代理 | ✅ | GrainTCP 代理核心 |
| 订阅生成 | ✅ | `/sub` 和 `/<SUB_PASSWORD>` 路径 |
| 环境变量配置 | ✅ | 无 D1 依赖，配置简化 |
| 健康检查 | ✅ | `/api/health` 接口 |
| 日志查询 | ✅ | `/api/logs` 接口（内存存储） |
| TG Bot 通知 | ✅ | 保留原有功能 |

## 🔄 与原版对比

| 维度 | 原版 (split/) | V2 版 (split-v2/) |
|------|---------------|-------------------|
| 架构 | 前后端分离，但耦合度高 | 完全解耦，订阅器模式 |
| 前端功能 | 单一后端控制台 | 多后端管理 + 订阅聚合 |
| 后端依赖 | D1 数据库 | 纯环境变量 |
| 部署复杂度 | 中等 | 低（后端无需 D1） |
| 扩展性 | 单后端 | 支持无限后端 |
| 订阅方式 | 直接访问后端 | 通过前端代理 |

## 📖 API 文档

### 前端 API

```
POST   /api/login                    # 登录
GET    /api/backends                 # 获取后端列表
POST   /api/backends                 # 添加后端
PUT    /api/backends/:id             # 更新后端
DELETE /api/backends/:id             # 删除后端
GET    /api/backends/:id/test        # 测试后端连通性
GET    /api/backends/:id/stats       # 查询后端统计
GET    /api/bootstrap                # 获取控制台初始化数据
```

### 订阅代理

```
# 预设后端模式
GET /sub?backend=<后端ID>&password=<订阅密码>

# 自定义后端模式
GET /sub?backend=custom&url=<后端域名>&password=<订阅密码>
```

### 后端 API

```
GET /api/health                      # 健康检查
GET /api/logs?limit=100              # 日志查询
GET /sub                             # 订阅生成
GET /<SUB_PASSWORD>                  # 订阅生成（密码路径）
```

## 🛠️ 开发计划

- [x] Phase 1: 数据库设计 + 后端简化
- [x] Phase 2: 前端订阅器核心功能
- [x] Phase 3: 简洁 Web UI
- [x] Phase 4: 部署文档
- [ ] Phase 5: 高级功能（日志聚合、WebSocket 实时日志）
- [ ] Phase 6: 前端美化（复用原 worker.js 玻璃态样式）

## 💡 使用场景

### 场景 1：多地域节点管理
- 部署 3 个后端：美国、日本、新加坡
- 前端统一管理，一键生成各地域订阅链接
- 用户根据需求选择不同地域订阅

### 场景 2：临时测试节点
- 无需提前在控制台添加后端
- 使用「自定义后端 URL」功能
- 输入临时节点域名和密码，立即生成订阅链接

### 场景 3：流量分析
- 配置各后端的 CF API Token
- 在前端控制台查看各节点的请求统计
- 识别热门节点，优化资源分配

## 🔒 安全建议

1. **修改默认密码**：务必修改 `wrangler.frontend.jsonc` 中的 `WEB_PASSWORD`
2. **限制访问**：在 Cloudflare Workers 控制台配置 IP 白名单
3. **加密 API Token**：CF API Token 存储在 D1，建议加密（待实现）
4. **定期备份**：定期备份 D1 数据库

## 📄 许可证

本项目基于原 GrainTCP 项目，遵循相同的开源许可。

## 🙏 致谢

- 原项目：[CFW-GrainTCP](https://github.com/TyrEamon/CFW-GrainTCP)
- 开发者：TyrEamon / 二叉树树 (AcoFork)

---

**🎉 部署完成！享受你的订阅器吧！**
