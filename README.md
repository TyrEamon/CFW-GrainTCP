# GrainTCPV1

基于 Cloudflare 的高性能代理节点订阅管理系统，采用 GrainTCP 内核引擎。

---

## 🛠 开源代码引用

本项目代码由 Claude Opus AI 辅助生成

**天诚修复与新增功能：**
*   ❇️ 修复了 Cloudflare 网站不能访问的问题。
*   ❇️ 新增加了机场三字码的适配。
*   ❇️ 新增优选IP支持。
*   ❇️ 新增解锁 Emby 播放器。
*   ❇️ 新增了韩国节点适配。
*   ❇️ Vless 订阅器内置 CSV 文件优化识别功能。

**引用的开源项目与服务：**
*   **源代码作者**：[Alexandre_Kojeve](https://t.me/Alexandre_Kojeve) (致敬原版 stallTCP1.32)
*   **源代码作者GitHub主页**：[Alexandre_Kojeve](https://github.com/orgs/ToiCF/repositories)
*   **GrainTCP 内核**：[nickerwen/graincf](https://github.com/nickerwen/graincf) — 高性能代理内核
*   **TURN 协议支持**：[ToiCF/CF-Workers-TURN](https://github.com/ToiCF/CF-Workers-TURN)
*   **ProxyIP 服务支持**：
    *   [cmliu/CMLiussss](https://github.com/cmliu)
    *   [RealNeoMan/威廉大佬](https://t.me/RealNeoMan)
    *   [Moist_R/欢乐时光群组大佬](https://t.me/o00oxooo)
*   **SUB优选订阅生成创作支持**：
    *   [cmliu/WorkerVless2sub项目](https://github.com/cmliu/WorkerVless2sub)（sub支持）
*   **SUB服务支持**：
    *   [M佬/欢乐时光订阅器支持](https://owo.o00o.ooo/)
    *   【天诚订阅器支持】— 由于是福利群隐藏链接故而不公开
    *   [Desire/Desire-Sub-Worker订阅器支持](https://github.com/DesireOr2/Desire-Sub-Worker)
*   **ProxyIP 创作支持**（源代码不支持反代）：
    *   [mingyu/mingyu大佬](https://github.com/ymyuuu?tab=repositories)
    *   [COMLiang/天诚大佬](https://t.me/COMLiang)
    *   [ursyre/syre大佬](https://t.me/ursyre)（感谢整合了https/socks5/proxyip的全部反代支持）
*   **ECH 参考支持**：
    *   [cmliu/edgetunnel项目](https://github.com/cmliu/edgetunnel)（借鉴参考ECH）
    *   [byjoey/cfnew项目 少年你相信光吗](https://github.com/byJoey/cfnew)（借鉴参考ECH）
*   **Telegram 交流群**：[zyssadmin](https://t.me/zyssadmin)（始于天诚技术交流群创立这个项目）
*   **Cloudflare Docs**：[Support](https://developers.cloudflare.com/)

---

## 目录

- [开源代码引用](#-开源代码引用)
- [项目简介](#项目简介)
- [功能一览](#功能一览)
- [界面预览](#界面预览)
- [文件说明](#文件说明)
- [部署教程](#部署教程)
- [配置说明](#配置说明)
- [代理使用教程](#代理使用教程)
- [订阅使用教程](#订阅使用教程)
- [ECH 加密使用教程](#ech-加密使用教程)
- [后台管理面板](#后台管理面板)
- [GrainTCP 内核参数](#graintcp-内核参数)
- [常见问题](#常见问题)
- [免责声明](#免责声明)

---

## 项目简介

GrainTCPV1 是一个部署在 Cloudflare 上的代理节点管理系统，提供：

- 代理隧道（WebSocket → TCP）
- 自适应订阅分发（自动识别客户端返回对应格式）
- ECH 加密注入（提升连接隐蔽性）
- 可视化后台管理面板
- 多种代理出口方式（Direct / SOCKS5 / HTTP / ProxyIP / TURN）

支持两种部署方式：**Workers**（完整版）和 **Snippets**（精简版）。

---

## 功能一览

| 功能 | Workers | Snippets | 说明 |
|------|:---:|:---:|------|
| GrainTCP 代理内核 | ✅ | ✅ | 4 路并发竞速建连 + BYOB 零拷贝 + Early Data |
| TURN/TURNS 中继 | ✅ | ✅ | TCP 中继连接，支持认证和匿名 |
| SOCKS5 代理 | ✅ | ✅ | 全局/局部模式，支持用户名密码认证 |
| HTTP CONNECT 代理 | ✅ | ✅ | 全局/局部模式，支持 Basic Auth |
| ProxyIP 中转 | ✅ | ✅ | 指定优选 IP 作为出口中转 |
| 自适应订阅 | ✅ | ✅ | 根据客户端 UA 自动返回对应格式 |
| ECH 加密 | ✅ | ✅ | DoH 查询自动注入 ECH Config |
| 后台管理面板 | ✅ | ✅ | 可视化管理界面 |
| D1 数据库 | ✅ | ❌ | 持久化存储配置和日志 |
| Telegram 通知 | ✅ | ❌ | 登录/订阅操作实时推送 |
| Desire 裂变 | ✅ | ❌ | SUB_TOKEN 优选 IP 批量裂变 |
| 白名单/访问日志 | ✅ | ❌ | IP 白名单免登录 + 日志记录 |
| 环境变量配置 | ✅ | ❌ | Dashboard 在线修改配置 |

---

## 文件说明

| 文件 | 大小 | 用途 |
|------|------|------|
| `worker.js` | ~247 KB | Workers/Pages 完整版（可读源码，支持环境变量 + D1） |
| `snippets.js` | ~32 KB | Snippets 精简版（压缩代码，配置写在顶部） |

两份文件核心功能完全一致（TURN + SOCKS5 + HTTP + ProxyIP + ECH + 订阅 + 后台），仅部署方式和扩展功能不同。

---

## 界面预览

**Snippets 版：**

<img width="1920" alt="Snippets登录页" src="./issue/snippets展示/snippets登录页.png" />
<img width="1920" alt="Snippets管理页面" src="./issue/snippets展示/snippets管理页面.png" />

**Worker 版：**

<img width="1920" alt="Worker登录页" src="./issue/worker展示/登录页.png" />
<img width="1920" alt="Worker控制台" src="./issue/worker展示/控制台展示.png" />
<img width="1920" alt="Worker订阅页面" src="./issue/worker展示/订阅页面.png" />
<img width="1920" alt="Worker白名单" src="./issue/worker展示/白名单页面.png" />
<img width="1920" alt="Worker日志" src="./issue/worker展示/日志详情页面.png" />
<img width="1920" alt="Worker网络信息" src="./issue/worker展示/网络信息.png" />

---

## 部署教程

### 方式一：Cloudflare Workers 部署（推荐）

**适合**：需要完整功能（D1 数据库、TG 通知、白名单、优选 IP 列表等）。

**步骤**：

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左侧菜单进入 **Workers & Pages** → 点击右上角 **创建**
3. 选择 **Hello World** 模板 → 点击 **部署**

<img width="800" alt="创建Worker" src="./issue/worker部署教程/创建worker.png" />

4. 部署完成后，在 Workers 列表找到刚部署的项目，点击 **编辑代码**

<img width="800" alt="部署Worker" src="./issue/worker部署教程/部署worker.png" />

5. 按 `Ctrl+A` 全选 → 删除 → 粘贴 `worker.js` 全部代码

<img width="800" alt="修改Worker代码" src="./issue/worker部署教程/修改worker代码.png" />

6. 点击右上角 **保存并部署**
7. 回到 Worker 概览页 → 进入 **设置 → 变量和机密**
8. 添加环境变量（最少填：`UUID`、`WEB_PASSWORD`、`SUB_PASSWORD`）
9. 可选：绑定自定义域名（设置 → 触发器 → 自定义域）

**D1 数据库配置（必须，完整步骤）**：

D1 是 Cloudflare 提供的免费 SQLite 数据库，用于存储配置、白名单、日志和统计数据。Worker 版必须绑定 D1 才能使用后台管理功能。

**第一步：创建 D1 数据库**

1. 登录 Cloudflare Dashboard
2. 左侧菜单找到 **Workers & Pages** → 点击 **D1 SQL 数据库**
3. 点击右上角 **创建** 按钮
4. 数据库名称随意填写（如 `graintcp_db`）→ 点击 **创建**

**第二步：初始化表结构**

进入刚创建的数据库 → 点击 **控制台** 标签 → 粘贴以下 SQL 并点击 **执行**：

```sql
CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS whitelist (ip TEXT PRIMARY KEY, created_at INTEGER);
CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, time TEXT, ip TEXT, region TEXT, action TEXT);
CREATE TABLE IF NOT EXISTS stats (date TEXT PRIMARY KEY, count INTEGER DEFAULT 0);
```

执行成功后会看到 4 张表被创建。

**第三步：绑定到 Worker**

1. 回到你的 Worker 项目 → **设置** → **变量和机密**
2. 向下滚动找到 **D1 数据库绑定** 区域
3. 点击 **添加绑定**
4. **变量名称**填：`DB`（必须大写，不可改名）
5. **D1 数据库**下拉选择刚创建的数据库
6. 点击 **保存** → 重新部署 Worker

**验证是否成功**：

部署后访问你的 Worker 域名，登录后台 → 如果白名单、日志、统计等功能正常显示，说明 D1 绑定成功。

**D1 数据表说明**：

| 表名 | 用途 | 说明 |
|------|------|------|
| `config` | 配置存储 | 后台保存的所有配置（ProxyIP、TG Token 等） |
| `whitelist` | IP 白名单 | 免登录 IP 地址列表 |
| `logs` | 访问日志 | 最近 2000 条操作记录（自动清理） |
| `stats` | 每日统计 | 按日期累计访问次数 |

**D1 免费额度**：

- 每日读取：5,000,000 行
- 每日写入：100,000 行
- 存储空间：5 GB

正常使用远低于这些限制，无需担心。

### 方式二：Cloudflare Snippets 部署

**适合**：已有域名接入 Cloudflare、想要极简部署、无需 D1/TG 通知等扩展功能。

**步骤**：

1. 登录 Cloudflare Dashboard
2. 选择你已接入的域名

<img width="800" alt="找到有Snippets的域名" src="./issue/snippets教程/找到有snippets的域名.png" />

3. 左侧菜单进入 **规则 → Snippets** → 点击 **创建片段**

<img width="800" alt="在Snippets页面创建片段" src="./issue/snippets教程/在snippets页面创建片段.png" />

4. 输入片段名称（随意，如 `graintcp`）

<img width="800" alt="输入创建片段的名字" src="./issue/snippets教程/输入创建片段的名字.png" />

5. 粘贴 `snippets.js` 全部代码
6. **修改顶部配置区**（UUID、密码、ProxyIP 等改成你自己的值）

<img width="800" alt="编辑Snippets代码" src="./issue/snippets教程/编辑snippets代码.png" />

7. 在下方 **触发规则** 中设置匹配条件：
   - 字段：`主机名 (Hostname)`
   - 运算符：`等于 (equals)`
   - 值：你的子域名（如 `sub.yourdomain.com`）

<img width="800" alt="设置自定义筛选表达式" src="./issue/snippets教程/设置自定义筛选表达式.png" />

8. 点击 **启用片段规则** 保存

<img width="800" alt="启用片段规则" src="./issue/snippets教程/启用片段规则.png" />

9. **配置 DNS（重要）**：前往 DNS 设置页 → 添加 A 记录 → 名称填子域名 → IPv4 填 `192.0.2.1` → 代理状态开启橙色云朵

<img width="800" alt="创建新代理DNS记录指向" src="./issue/snippets教程/创建新代理DNS记录指向.png" />

**注意事项**：
- Snippets 没有环境变量功能，所有配置直接改代码顶部
- Snippets 有 32KB 大小限制
- Snippets 的 CPU 执行时间有限，并发竞速数自动降为 1

### 方式三：Cloudflare Pages 部署

**步骤**：

1. 将 `worker.js` 重命名为 `_worker.js`
2. 将该文件放入一个空文件夹（如 `graintcp/`）
3. 进入 **Workers & Pages** → **创建** → 选择 **Pages**

<img width="800" alt="Cloudflare主页" src="./issue/pages部署教程/cloudflare主页-计算workers和pages.png" />
<img width="800" alt="Pages创建应用程序" src="./issue/pages部署教程/pages创建应用程序.png" />

**方法 A：GitHub 自动同步（推荐）**

4. 选择 **导入现有 Git 存储库**

<img width="800" alt="选择导入现有git存储库" src="./issue/pages部署教程/选择导入现有git存储库.png" />
<img width="800" alt="创建Pages导入现有git存储库" src="./issue/pages部署教程/创建pages，导入现有git存储库.png" />

5. 选择 GitHub 账户 → 选择你 Fork 的项目

<img width="800" alt="选择存储库" src="./issue/pages部署教程/选择存储库，选择github账户，选择fork的项目。.png" />

6. 写入项目名称并部署

<img width="800" alt="创建Pages项目名字并部署" src="./issue/pages部署教程/创建pages项目名字。部署.png" />
<img width="800" alt="部署Pages页面" src="./issue/pages部署教程/部署pages页面.png" />

**方法 B：直接上传**

4. 选择 **上传部署**

<img width="800" alt="选择上传部署" src="./issue/pages部署教程/github上传部署/选择上传部署.png" />

5. 写入项目名称并创建项目

<img width="800" alt="写入项目名称并创建项目" src="./issue/pages部署教程/github上传部署/写入项目名称并创建项目.png" />

6. 上传包含 `_worker.js` 的 ZIP 压缩包或文件夹 → 点击 **部署站点**

<img width="800" alt="选择项目zip包并部署" src="./issue/pages部署教程/github上传部署/选择下载好的项目zip包或者是文件夹，并部署站点。.png" />

7. 部署后进入 Pages 项目 **设置** → 添加环境变量和 D1 绑定
8. 重新部署使配置生效

---

## 配置说明

### Workers 版（环境变量）

Workers 版通过 Cloudflare Dashboard 在线配置环境变量。

**配置优先级：环境变量 > D1 数据库 > 代码硬编码**

#### 必填配置

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `UUID` | 节点连接凭证（标准 UUID 格式） | `a1b2c3d4-1234-5678-abcd-123456789abc` |
| `WEB_PASSWORD` | 后台登录密码 | `mypassword123` |
| `SUB_PASSWORD` | 订阅路径密码 | `mysub` |
| `PROXYIP` | 默认 ProxyIP 中转地址 | `cdn.example.com` 或 `1.2.3.4:443` |
| `SUB_DOMAIN` | 上游订阅源地址 | `https://owo.o00o.ooo/` |

#### 可选配置

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `SUBAPI` | 订阅转换后端 API | `subapi.cmliussss.net` |
| `PS` | 节点备注后缀（追加到节点名后） | 空 |
| `DLS` | ADDCSV 速度下限筛选（KB/s） | `5000` |
| `CONCUR` | GrainTCP 并发竞速数（1-16） | `4` |
| `SUB_TOKEN` | Desire 裂变 Token（留空不启用） | 空 |
| `KEY` | 动态 UUID 密钥（启用后自动生成时效性 UUID） | 空 |
| `UUID_REFRESH` | UUID 刷新周期（秒） | `86400` |

#### ECH 配置

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `ECH_ENABLED` | ECH 开关（`true` 或 `false`） | `true` |
| `ECH_SNI` | ECH 解析域名 | `cloudflare-ech.com` |
| `ECH_DNS` | DoH 查询地址 | `https://odvr.nic.cz/doh` |

#### Telegram 通知

| 变量名 | 说明 | 获取方式 |
|--------|------|---------|
| `TG_BOT_TOKEN` | Bot Token | 找 @BotFather 创建机器人获取 |
| `TG_CHAT_ID` | 你的用户 ID | 找 @userinfobot 获取 |

#### 优选节点来源

| 变量名 | 说明 | 格式 |
|--------|------|------|
| `ADD` | 本地优选 IP 列表 | 每行一个：`IP:端口#备注名` |
| `ADDAPI` | 远程 TXT 优选列表 URL | 每行一个 URL |
| `ADDCSV` | 远程 CSV 优选列表 URL | 配合 `DLS` 过滤低速 |

#### 界面链接

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `LOGIN_PAGE_TITLE` | 登录页浏览器标题 | `Worker Login` |
| `DASHBOARD_TITLE` | 后台管理页标题 | `烈火控制台` |
| `TG_GROUP_URL` | 交流群链接（登录页按钮） | `https://t.me/zyssadmin` |
| `GITHUB_URL` | 项目地址（登录页按钮） | GitHub 项目链接 |
| `PROXY_CHECK_URL` | ProxyIP 检测站链接 | `https://kaic.hidns.co/` |

#### D1 数据库绑定

| 变量名 | 类型 | 说明 |
|--------|------|------|
| `DB` | D1 数据库 | 必须绑定，变量名必须是 `DB` |

---

### Snippets 版（代码顶部配置）

Snippets 版没有环境变量，直接修改代码顶部的值：

```javascript
const UUID="你的UUID",WP="登录密码",SUB_PWD="订阅密码";
let PIP="你的ProxyIP地址",SUB="https://订阅源地址/";
const PC="https://检测站地址/";
let SUBAPI="https://订阅转换API",SUBINI="订阅转换配置URL";
```

| 变量 | 对应 Workers 版 | 说明 |
|------|----------------|------|
| `UUID` | `UUID` | 节点连接凭证 |
| `WP` | `WEB_PASSWORD` | 后台登录密码 |
| `SUB_PWD` | `SUB_PASSWORD` | 订阅密码（访问 `https://域名/密码` 获取订阅） |
| `PIP` | `PROXYIP` | 默认 ProxyIP 中转地址 |
| `SUB` | `SUB_DOMAIN` | 上游订阅源地址 |
| `PC` | `PROXY_CHECK_URL` | ProxyIP 检测站链接 |
| `SUBAPI` | `SUBAPI` | 订阅转换后端 API |
| `SUBINI` | Clash 配置 URL | 订阅转换配置文件 |

#### Snippets 版 ECH 配置修改

在代码中搜索替换以下值：

| 搜索 | 替换为 | 说明 |
|------|--------|------|
| `ECH=!0` | `ECH=!1` | 关闭 ECH（`!0`=开，`!1`=关） |
| `odvr.nic.cz/doh` | 你的 DoH 地址 | 更换 DoH 查询服务器 |
| `cloudflare-ech.com` | 你的 ECH SNI | 更换 ECH 解析域名 |

---

## 代理使用教程

部署完成后，你的 Worker/Snippet 就是一个代理服务器。客户端通过 WebSocket 连接到你的域名，流量被转发到目标地址。

### 基本使用（直连模式）

客户端直接连接你的域名即可，流量直接从 Cloudflare 出去到目标服务器：

```
协议: VLESS
地址: 你的域名
端口: 443
UUID: 你配置的UUID
传输: WebSocket
TLS: 开启
路径: /
```

### 使用 ProxyIP 中转

当直连某些网站不通时，通过 ProxyIP 作为出口中转。有三种配置方式：

**方式一：在配置中设置默认 ProxyIP**
- Workers 版：环境变量 `PROXYIP` 填入地址
- Snippets 版：修改顶部 `PIP` 的值

**方式二：在客户端路径中指定**
```
路径: /proxyip=1.2.3.4:443
```

**方式三：查询参数方式**
```
路径: /?proxyip=1.2.3.4:443
```

> ProxyIP 地址格式为 `IP:端口` 或 `域名:端口`，端口默认 443 可省略。

### 使用 SOCKS5 代理

通过外部 SOCKS5 代理服务器转发流量。

**全局 SOCKS5（整个连接走 SOCKS5）**：

在客户端 WebSocket 路径中填写：
```
/socks5://用户名:密码@代理服务器地址:端口
```

示例：
```
/socks5://admin:pass123@proxy.example.com:1080
```

如果 SOCKS5 不需要认证：
```
/socks5://proxy.example.com:1080
```

**局部 SOCKS5（作为回落选项）**：

```
/s5=用户名:密码@代理服务器地址:端口
```

或通过查询参数：
```
/?s5=admin:pass123@proxy.example.com:1080
```

> 局部模式下，系统先尝试直连，直连失败后再走 SOCKS5。

### 使用 HTTP CONNECT 代理

通过外部 HTTP 代理服务器转发流量。

**全局 HTTP 代理（整个连接走 HTTP CONNECT）**：

```
/http://用户名:密码@代理服务器地址:端口
```

示例：
```
/http://admin:pass123@proxy.example.com:8080
```

不需要认证时：
```
/http://proxy.example.com:8080
```

**局部 HTTP 代理（作为回落选项）**：

```
/http=用户名:密码@代理服务器地址:端口
```

### 使用 TURN/TURNS 中继

TURN 是一种 TCP 中继协议，适用于直连和 ProxyIP 都不通的特殊网络环境。

**TURN（未加密）**：
```
/turn://用户名:密码@TURN服务器地址:3478
```

**TURNS（TLS 加密）**：
```
/turns://用户名:密码@TURN服务器地址:5349
```

不需要认证时：
```
/turn://TURN服务器地址:3478
```

支持域名：
```
/turn://admin:password@relay.example.com:3478
```

> TURN 模式下不走回落，直接全部流量通过 TURN 服务器中继。

### 连接回落顺序

当使用局部代理模式时，系统按顺序尝试连接，前一种失败后自动尝试下一种：

**默认顺序**：`direct → s5 → proxy`

| 方式 | 说明 |
|------|------|
| `direct` | GrainTCP 竞速直连（默认 4 路并发） |
| `s5` | 通过 SOCKS5 或 HTTP CONNECT 代理连接 |
| `proxy` | 通过 ProxyIP 中转连接 |

**自定义回落顺序**：

通过查询参数指定：
```
/?mode=proxy           → 只走 direct + proxy
/?mode=s5              → 只走 s5
/?direct&s5&proxyip    → 按参数顺序回落
```

### 代理凭证 Base64 编码

SOCKS5 和 HTTP 代理的用户名密码支持 Base64 编码传递：

```
/s5=base64编码的凭证@代理地址:端口
```

例如用户名 `admin`、密码 `pass123`，Base64 编码 `admin:pass123` 得到 `YWRtaW46cGFzczEyMw==`：
```
/s5=YWRtaW46cGFzczEyMw==@proxy.example.com:1080
```

---

## 订阅使用教程

### 什么是订阅

订阅是一个 URL 链接，客户端软件通过访问这个链接获取节点配置信息。你只需将订阅链接添加到客户端，客户端会自动解析并生成可用节点。

### 获取订阅链接

部署完成后，有两种方式获取订阅：

**方式一：通过订阅密码路径**
```
https://你的域名/你的订阅密码
```
例如订阅密码是 `mysub123`：
```
https://example.com/mysub123
```

**方式二：通过 /sub 路径 + UUID 验证**
```
https://你的域名/sub?uuid=你的UUID
```

**方式三：通过后台管理面板**

登录后台 → 找到"快速订阅"卡片 → 点击复制按钮。

### 自适应订阅（自动识别客户端）

系统会根据客户端发送的 User-Agent 自动判断返回什么格式，**你不需要手动指定格式**，直接把同一个订阅链接添加到不同客户端即可：

| 客户端软件 | 自动返回格式 |
|-----------|-------------|
| Clash / Clash Meta / Mihomo | Clash YAML 配置 |
| FlClash / Stash | Clash YAML 配置 |
| NekoBox（ClashMeta 格式） | Clash YAML 配置 |
| Sing-box / SFI | Sing-box JSON 配置 |
| Hiddify / Karing | Sing-box JSON 配置 |
| Surge | Surge 配置 |
| Quantumult X | QuanX 配置 |
| Loon | Loon 配置 |
| V2rayN / V2rayNG | Base64 编码节点列表 |
| Shadowrocket | Base64 编码节点列表 |
| 浏览器直接打开 | 明文节点列表 |

### 手动指定输出格式

如果自动识别不准确，可以在订阅 URL 后追加 `?target=格式名` 强制指定：

```
https://你的域名/订阅密码?target=clash
https://你的域名/订阅密码?target=singbox
https://你的域名/订阅密码?target=surge
https://你的域名/订阅密码?target=quanx
https://你的域名/订阅密码?target=loon
```

### 在各客户端中添加订阅

**Clash / Mihomo / FlClash**：
1. 打开客户端 → 配置/Profiles
2. 点击添加 → 输入订阅 URL → 保存
3. 选中该配置 → 启动代理

**V2rayN**：
1. 订阅分组 → 添加订阅
2. 地址填入订阅 URL
3. 更新订阅 → 节点列表出现节点

**Shadowrocket**：
1. 首页右上角 + → 类型选 Subscribe
2. URL 填入订阅地址 → 保存
3. 下拉刷新更新节点

**Sing-box / Hiddify / Karing**：
1. 添加订阅/配置文件
2. URL 填入订阅地址
3. 保存并更新

### 配合 WorkerVless2sub 优选订阅生成器

[WorkerVless2sub](https://github.com/cmliu/WorkerVless2sub) 是一个独立部署的订阅生成器，功能是把你的单节点批量替换成多个优选 IP 节点。

**使用流程**：

1. 部署 WorkerVless2sub 到另一个 Worker（如 `sub.example.com`）
2. 在 WorkerVless2sub 配置中添加优选 IP 列表
3. 将你的 GrainTCPV1 节点信息粘贴到 WorkerVless2sub 前端页面
4. 生成的订阅链接格式为：
```
https://sub.example.com/sub?uuid=UUID&sni=域名&host=域名&fp=firefox&alpn=h3&ech=...&type=ws&path=/proxyip%3D中转IP
```
5. 将该链接添加到客户端

> 注意：WorkerVless2sub 可能不传递 `fp` 和 `ech` 参数（取决于其版本），如果 ECH 未生效请直接使用 GrainTCPV1 自身的订阅链接。

---

## ECH 加密使用教程

### 什么是 ECH

ECH（Encrypted Client Hello）是一种 TLS 扩展，对 TLS 握手中的 SNI（服务器名称）进行加密。开启后，中间人无法通过 SNI 嗅探你连接的目标域名。

### ECH 默认状态

部署后 ECH 默认**开启**，无需额外操作。

### 开启/关闭 ECH

**Workers 版**：
- 环境变量 `ECH_ENABLED` 设为 `true`（开启）或 `false`（关闭）

**Snippets 版**：
- 搜索 `ECH=!0` 替换为 `ECH=!1` 即可关闭
- 搜索 `ECH=!1` 替换为 `ECH=!0` 即可开启

### ECH 对各客户端的影响

ECH 开启后，系统自动对订阅内容做以下处理：

| 客户端 | ECH 处理方式 | 用户是否需要操作 |
|--------|-------------|:---:|
| Clash / Mihomo / FlClash / Stash | 自动注入 `ech-opts` + DNS 配置 | 否，自动 |
| NekoBox | 自动注入 `ech-opts`，内核自动 DNS 查询 | 否，自动 |
| Sing-box / Hiddify / Karing | 自动注入 `tls.ech` PEM 配置 | 否，自动 |
| V2rayN / V2rayNG | 节点 URI 追加 `&ech=SNI+DNS` 参数 | 否，自动 |
| Shadowrocket | 节点 URI 追加 `&ech=SNI+DNS` 参数 | 否，自动 |
| Surge / Loon / Quantumult X | 不注入（这些客户端不支持 ECH） | — |

### ECH 开启后的自动变化

1. **指纹（Fingerprint）**：自动切换为 `firefox`（关闭时为 `randomized`）
2. **Clash 订阅**：自动添加 DNS nameserver-policy 段 + 节点 ech-opts 配置
3. **Sing-box 订阅**：自动添加 `tls.ech` 字段和 `utls` 指纹配置
4. **Base64 订阅**：每个节点 URI 自动追加 `&ech=` 和 `&fp=firefox` 参数

### 更换 ECH 的 DoH 服务器

默认使用 `https://odvr.nic.cz/doh`。如需更换：

**Workers 版**：环境变量 `ECH_DNS` 填入新地址

**Snippets 版**：在代码中搜索 `odvr.nic.cz/doh` 替换为你的 DoH 地址

可选的公共 DoH 服务器：
- `https://odvr.nic.cz/doh`
- `https://223.5.5.5/dns-query`
- `https://dns.google/dns-query`
- `https://cloudflare-dns.com/dns-query`

### 验证 ECH 是否生效

1. 订阅后打开客户端节点详情
2. 检查是否有以下字段：
   - Clash：节点下方有 `ech-opts: enable: true`
   - Sing-box：`tls` 下有 `ech: { enabled: true, config: "..." }`
   - V2rayN：节点参数中有 `ech=cloudflare-ech.com%2B...`
3. 如果没有，检查 ECH 开关是否开启，或尝试重新订阅

---

## 后台管理面板

### 进入后台

1. 浏览器访问 `https://你的域名`
2. 输入登录密码（Workers 版为 `WEB_PASSWORD`，Snippets 版为 `WP`）
3. 点击登录按钮进入管理面板

### 功能模块详解

#### 快速自适应订阅

- 显示你的自适应订阅链接（`https://域名/订阅密码`）
- 点击 **复制** → 链接复制到剪贴板
- 点击 **测试** → 验证订阅链接是否正常返回数据

#### 手动订阅链接

- 显示带完整参数的订阅链接（含 UUID、SNI、path 等）
- 可直接复制给客户端使用
- 点击 **更新链接** → 根据当前配置重新生成

#### ProxyIP 检测

- 点击 **检测** 按钮 → 打开 ProxyIP 检测站
- 验证当前 ProxyIP 地址是否可用、延迟如何

#### 订阅源测试

- 输入上游订阅源 URL
- 点击 **测试** → 系统 fetch 验证是否可连通

#### ECH 加密配置

- 显示当前 ECH 状态（开启/关闭）
- 显示 ECH DNS 地址和 ECH SNI 域名
- Workers 版可在此修改配置

#### 白名单管理（Workers 版）

- 添加 IP 到白名单 → 该 IP 访问无需登录密码
- 支持 IPv4 和 IPv6 地址
- 点击删除可移除白名单条目

#### 自定义节点（Workers 版）

- `ADD`：手动添加优选 IP（格式 `IP:端口#备注`，每行一个）
- `ADDAPI`：填入远程 TXT 文件 URL（每行一个 URL）
- `ADDCSV`：填入远程 CSV 文件 URL
- `DLS`：速度下限筛选（用于 ADDCSV）

#### 访问日志（Workers 版）

- 显示最近 50 条访问记录
- 包含时间、IP、路径、User-Agent 信息

#### 右上角工具栏

- **主题切换**：深色星空 / 浅色天空两种主题
- **TG 通知**：配置 Bot Token 和 Chat ID（Workers 版）
- **退出登录**：清除 Cookie 退出会话

---

## GrainTCP 内核参数

### 参数说明

| 参数 | Workers 默认 | Snippets 默认 | 说明 |
|------|:---:|:---:|------|
| `concur` | 4 | 1（自动降级） | 并发竞速建连数 |
| `chunk` | 64 KB | 64 KB | BYOB 读取块大小 |
| `dnPack` | 32 KB | 32 KB | 下行打包阈值 |
| `upPack` | 16 KB | 16 KB | 上行合并阈值 |
| `upQMax` | 256 KB | 256 KB | 上行队列上限 |
| `maxED` | 8 KB | 8 KB | Early Data 最大长度 |

### 修改 concur（并发竞速数）

- Workers 版：环境变量 `CONCUR` 设为 1-16 之间的数字
- Snippets 版：自动为 1，无法修改（CPU 预算限制）

### 内核技术特性

| 特性 | 说明 |
|------|------|
| raceSprout 竞速 | 同时建立 N 个 TCP 连接（N=concur），取最快的一个，关闭其余 |
| concur 自适应 | 自动检测运行环境：Snippets 强制 1，Workers 默认 4 |
| mkDn 下行打包 | 把多个小包合并后再发送，减少 WebSocket 帧数量 |
| mill BYOB 读取 | 零拷贝方式读取 TCP 数据，大块直发，小块复用 buffer |
| mkQ 上行队列 | 多个上行小 chunk 合并为一次 TCP write，减少系统调用 |
| Early Data | 首个数据包通过 sec-websocket-protocol 头传递，省 1 个 RTT |
| 半开连接 | allowHalfOpen: true，一方关闭写入后另一方仍可读 |
| 无 import 语句 | 避免 Cloudflare Snippets 环境的代码检测问题 |
| TURN TCP 中继 | 完整 STUN/TURN 协议实现，支持 Allocate/CreatePermission/Connect/Bind |

---

## 常见问题

### 部署相关

**Q: Workers 和 Snippets 怎么选？**

| | Workers | Snippets |
|--|---------|----------|
| 大小限制 | 1MB（免费版） | 32KB |
| 环境变量 | 支持 | 不支持 |
| D1 数据库 | 支持 | 不支持 |
| TG 通知 | 支持 | 不支持 |
| 白名单/日志 | 支持 | 不支持 |
| 需要自定义域名 | 是（或用 workers.dev） | 否（用已有域名） |
| 部署复杂度 | 中等 | 简单 |

总结：想要完整功能用 Workers；只要代理+订阅+后台基本功能用 Snippets。

**Q: 部署后打开域名是空白/报错？**

1. 确认代码已完整粘贴（不能截断）
2. 确认已点击"保存并部署"
3. Workers 版：确认域名已绑定（设置 → 触发器 → 自定义域）
4. Snippets 版：确认触发规则匹配正确

**Q: 出现 Cloudflare 1101 错误？**

1101 是 Cloudflare 检测到代码中的敏感特征。本项目已做反检测处理：
- 敏感词使用字符串拆分（如 `'so'+'cks5'`）
- Snippets 版无 `import` 语句
- 无高密度 `atob` 调用

如果触发：
- 检查你是否在修改时引入了明文敏感词
- 检查 Snippets 是否超过 32KB

### 连接相关

**Q: 节点连不上？**

1. UUID 是否正确（客户端必须与服务端完全一致）
2. 域名是否已接入 Cloudflare CDN（DNS 记录橙色云朵开启）
3. 传输方式是否为 WebSocket + TLS
4. 端口是否为 443（Cloudflare 支持的 HTTPS 端口）
5. 路径是否正确（默认 `/`）

**Q: 能连但某些网站打不开？**

1. 尝试添加 ProxyIP：路径改为 `/proxyip=你的ProxyIP地址:443`
2. 或在后台/配置中设置 ProxyIP
3. 后台有 ProxyIP 检测按钮，可验证 ProxyIP 是否可用

**Q: 速度慢？**

1. Workers 版尝试增加 `CONCUR` 值（如 4→8）
2. 使用优选 IP：配置 `ADD`/`ADDAPI`/`ADDCSV` 添加更快的 CDN IP
3. 更换 ProxyIP 为延迟更低的地址
4. 确认客户端选择了延迟最低的节点

### 订阅相关

**Q: 订阅后没有节点？**

1. 确认订阅 URL 正确（域名 + 订阅密码）
2. 浏览器直接打开订阅 URL 看是否有内容返回
3. 确认 UUID 已正确配置
4. Workers 版确认环境变量已保存并重新部署

**Q: 节点格式不对/客户端报错？**

1. 尝试手动指定格式：`?target=clash` 或 `?target=singbox`
2. 确认客户端版本支持当前节点格式
3. 如果用的是 Sing-box，v1.11 和 v1.12 配置模板不同，系统会自动切换

**Q: ECH 没有生效？**

1. 确认 ECH 开关已开启
2. 确认客户端支持 ECH（Surge/Loon/QuanX 不支持）
3. 重新订阅获取最新节点配置
4. 检查节点详情中是否有 `ech` 相关字段
5. 使用 WorkerVless2sub 时：该生成器可能不传递 ECH 参数，建议直接用本项目的订阅链接

### 后台相关

**Q: 忘记登录密码？**

- Workers 版：在 Cloudflare Dashboard 修改 `WEB_PASSWORD` 环境变量
- Snippets 版：修改代码顶部 `WP` 的值

**Q: 复制按钮没反应？**

浏览器剪贴板 API 要求 HTTPS 环境。确认通过 `https://` 访问后台。

**Q: 后台打不开？**

1. 确认域名解析正常
2. 清除浏览器缓存后重试
3. 尝试无痕/隐私模式打开
4. 检查浏览器控制台是否有 JS 错误

### TURN 相关

**Q: TURN 怎么用？**

在客户端 WebSocket 路径中填写：
```
/turn://用户名:密码@TURN服务器IP:端口
```

**Q: 什么时候用 TURN？**

- 直连不通 + ProxyIP 不通时
- 某些企业网络/校园网环境
- TURN 本质是通过第三方服务器做 TCP 中继

**Q: TURN 和 TURNS 区别？**

- TURN：明文连接（端口一般 3478）
- TURNS：TLS 加密连接（端口一般 5349）
- 建议在安全性要求高的场景用 TURNS

**Q: 哪里获取 TURN 服务器？**

- 自建：使用 coturn 等开源 TURN 服务器
- 第三方：部分云服务商提供 TURN 服务

### 优选 IP 相关

**Q: 怎么配合优选 IP？**

Workers 版支持三种来源：

1. **ADD**（手动列表）：
```
1.2.3.4:443#美国节点1
5.6.7.8:443#日本节点1
cdn.example.com:443#CDN节点
```

2. **ADDAPI**（远程 TXT）：
```
https://example.com/ips.txt
```
TXT 文件内容格式同 ADD。

3. **ADDCSV**（远程 CSV）：
```
https://example.com/speed.csv
```
CSV 需包含 IP、端口、TLS 列，配合 `DLS` 环境变量过滤低速节点。

Snippets 版只支持单个 ProxyIP（`PIP` 配置项）。

---

## 免责声明

本项目仅供技术交流与学习使用，请遵守当地法律法规。使用本程序产生的任何后果由使用者自行承担。
