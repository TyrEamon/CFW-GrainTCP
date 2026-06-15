import originalPanelWorker from "../split/frontend-worker.js";

const DEFAULT_WEB_PASSWORD = "abc";
const SESSION_COOKIE_NAME = "auth";
const SESSION_TTL_SECONDS = 7200;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400"
  };
}

function json(data, status = 200, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(request?.headers.get("Origin"))
    }
  });
}

function normalizeUrl(value) {
  let text = String(value || "").trim();
  if (!text) return "";
  if (!/^https?:\/\//i.test(text)) text = "https://" + text;
  return text.replace(/\/+$/, "");
}

function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp("(?:^|;\\s*)" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]+)"));
  return match ? decodeURIComponent(match[1]) : "";
}

async function isAuthenticated(request, env) {
  const auth = getCookie(request, SESSION_COOKIE_NAME);
  const correctPassword = await getConfig(env, "WEB_PASSWORD", DEFAULT_WEB_PASSWORD);
  return !!auth && auth === correctPassword;
}

function createSessionCookie(request, password) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(String(password || ""))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

function clearSessionCookie() {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

async function readJson(request) {
  try { return await request.json(); } catch (_) { return {}; }
}

async function getConfig(env, key, fallback = "") {
  if (env?.[key] !== undefined && String(env[key]).trim() !== "") return String(env[key]);
  if (!env.DB) return fallback;
  try {
    const row = await env.DB.prepare("SELECT value FROM config WHERE key = ?").bind(key).first();
    if (row && row.value !== undefined && row.value !== null) return String(row.value);
  } catch (_) {}
  return fallback;
}

async function ensureConfigTable(env) {
  if (!env.DB) return false;
  try {
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)").run();
    return true;
  } catch (_) {
    return false;
  }
}

async function setConfig(env, key, value) {
  if (!env.DB) return false;
  if (!await ensureConfigTable(env)) return false;
  await env.DB.prepare("INSERT INTO config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
    .bind(key, String(value ?? ""))
    .run();
  return true;
}

async function ensureBackendsTable(env) {
  if (!env.DB) return false;
  try {
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS backends (
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
    )`).run();
    await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_backends_status ON backends(status)").run();
    await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_backends_created_at ON backends(created_at DESC)").run();
    return true;
  } catch (_) {
    return false;
  }
}

async function ensureWhitelistTable(env) {
  if (!env.DB) return false;
  try {
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS whitelist (ip TEXT PRIMARY KEY, created_at INTEGER)").run();
    return true;
  } catch (_) {
    return false;
  }
}

async function ensureLogsTable(env) {
  if (!env.DB) return false;
  try {
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, time TEXT, ip TEXT, region TEXT, action TEXT)").run();
    await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_logs_time ON logs(time DESC)").run();
    return true;
  } catch (_) {
    return false;
  }
}

async function getBackends(env, status = null) {
  if (!env.DB) return [];
  if (!await ensureBackendsTable(env)) return [];
  let sql = "SELECT * FROM backends";
  const params = [];
  if (status) {
    sql += " WHERE status = ?";
    params.push(status);
  }
  sql += " ORDER BY created_at DESC, id DESC";
  try {
    const { results } = await env.DB.prepare(sql).bind(...params).all();
    return results || [];
  } catch (_) {
    return [];
  }
}

async function getBackend(env, id) {
  if (!env.DB) return null;
  if (!await ensureBackendsTable(env)) return null;
  try {
    return await env.DB.prepare("SELECT * FROM backends WHERE id = ?").bind(id).first();
  } catch (_) {
    return null;
  }
}

async function getDefaultBackend(env) {
  const backends = await getBackends(env, "active");
  return backends[0] || null;
}

async function addBackend(env, data) {
  if (!env.DB) throw new Error("Missing D1");
  if (!await ensureBackendsTable(env)) throw new Error("后端表初始化失败");
  const name = String(data.name || "").trim();
  const domain = normalizeUrl(data.domain);
  const uuid = String(data.uuid || "").trim();
  const subPassword = String(data.sub_password || data.subPassword || "").trim();
  if (!name || !domain || !uuid || !subPassword) throw new Error("缺少必填字段：name, domain, uuid, sub_password");
  const now = Math.floor(Date.now() / 1000);
  const result = await env.DB.prepare(
    "INSERT INTO backends (name, domain, uuid, sub_password, cf_account_id, cf_api_token, status, remark, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(
    name,
    domain,
    uuid,
    subPassword,
    String(data.cf_account_id || "").trim(),
    String(data.cf_api_token || "").trim(),
    String(data.status || "active"),
    String(data.remark || ""),
    now,
    now
  ).run();
  return { id: result.meta.last_row_id, name, domain, uuid, sub_password: subPassword, status: String(data.status || "active") };
}

async function updateBackend(env, id, data) {
  const current = await getBackend(env, id);
  if (!current) throw new Error("后端不存在");
  const next = {
    name: String(data.name ?? current.name).trim(),
    domain: normalizeUrl(data.domain ?? current.domain),
    uuid: String(data.uuid ?? current.uuid).trim(),
    sub_password: String(data.sub_password ?? current.sub_password).trim(),
    cf_account_id: String(data.cf_account_id ?? current.cf_account_id ?? "").trim(),
    cf_api_token: String(data.cf_api_token && data.cf_api_token !== "***" ? data.cf_api_token : current.cf_api_token || "").trim(),
    status: String(data.status ?? current.status ?? "active"),
    remark: String(data.remark ?? current.remark ?? "")
  };
  await env.DB.prepare(
    "UPDATE backends SET name = ?, domain = ?, uuid = ?, sub_password = ?, cf_account_id = ?, cf_api_token = ?, status = ?, remark = ?, updated_at = ? WHERE id = ?"
  ).bind(next.name, next.domain, next.uuid, next.sub_password, next.cf_account_id, next.cf_api_token, next.status, next.remark, Math.floor(Date.now() / 1000), id).run();
  return { id, ...next };
}

async function deleteBackend(env, id) {
  if (!env.DB) throw new Error("Missing D1");
  if (!await ensureBackendsTable(env)) throw new Error("后端表初始化失败");
  await env.DB.prepare("DELETE FROM backends WHERE id = ?").bind(id).run();
  return { ok: true };
}

async function testBackendHealth(domain) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(normalizeUrl(domain) + "/api/health", { signal: controller.signal, headers: { "Accept": "application/json" } });
    const data = await res.json().catch(() => ({}));
    return { status: res.ok ? "online" : "error", code: res.status, data };
  } catch (error) {
    return { status: "offline", message: error.message || String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

async function getBackendStats(backend, range = "24h") {
  const cfAccountId = String(backend?.cf_account_id || backend?.CF_ID || "").trim();
  const cfApiToken = String(backend?.cf_api_token || backend?.CF_TOKEN || "").trim();
  const cfEmail = String(backend?.cf_email || backend?.CF_EMAIL || "").trim();
  const cfKey = String(backend?.cf_key || backend?.CF_KEY || "").trim();
  if (!cfAccountId && !(cfEmail && cfKey)) return { success: false, error: "未配置 CF API" };

  const hours = range === "1h" ? 1 : range === "7d" ? 168 : range === "30d" ? 720 : 24;
  const end = new Date();
  const start = new Date(end.getTime() - hours * 60 * 60 * 1000);
  const api = "https://api.cloudflare.com/client/v4";
  const baseHeaders = { "Content-Type": "application/json" };
  const authHeaders = cfApiToken
    ? { ...baseHeaders, "Authorization": `Bearer ${cfApiToken}` }
    : { ...baseHeaders, "X-AUTH-EMAIL": cfEmail, "X-AUTH-KEY": cfKey };

  try {
    let accountId = cfAccountId;
    if (!accountId) {
      const accountRes = await fetch(`${api}/accounts`, { method: "GET", headers: authHeaders });
      const accountPayload = await accountRes.json().catch(() => ({}));
      if (!accountRes.ok) return { success: false, error: `??????: ${accountRes.status}` };
      accountId = accountPayload?.result?.[0]?.id || "";
    }
    if (!accountId) return { success: false, error: "无法获取 Account ID" };

    const query = `query getBillingMetrics($AccountID: String!, $filter: AccountWorkersInvocationsAdaptiveFilter_InputObject) { viewer { accounts(filter: {accountTag: $AccountID}) { pagesFunctionsInvocationsAdaptiveGroups(limit: 1000, filter: $filter) { sum { requests } } workersInvocationsAdaptive(limit: 10000, filter: $filter) { sum { requests } } } } }`;
    const res = await fetch(`${api}/graphql`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        query,
        variables: {
          AccountID: accountId,
          filter: { datetime_geq: start.toISOString(), datetime_leq: end.toISOString() }
        }
      })
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok || payload.errors) return { success: false, error: JSON.stringify(payload.errors || payload) };
    const account = payload?.data?.viewer?.accounts?.[0] || {};
    const workers = (account.workersInvocationsAdaptive || []).reduce((sum, item) => sum + Number(item?.sum?.requests || 0), 0);
    const pages = (account.pagesFunctionsInvocationsAdaptiveGroups || []).reduce((sum, item) => sum + Number(item?.sum?.requests || 0), 0);
    return { success: true, requests: workers + pages, total: workers + pages, workers, pages };
  } catch (error) {
    return { success: false, error: error.message || String(error) };
  }
}


async function proxySubscription(request, env, forcedPassword = "") {
  const url = new URL(request.url);
  const backendParam = url.searchParams.get("backend");
  const password = forcedPassword || url.searchParams.get("password") || "";
  const customUrl = url.searchParams.get("url");
  let backendDomain = "";
  let backendSubPassword = "";

  if (backendParam && backendParam !== "custom") {
    const backend = await getBackend(env, parseInt(backendParam, 10));
    if (!backend) return new Response("后端不存在", { status: 404 });
    if (backend.status !== "active") return new Response("后端已禁用", { status: 403 });
    backendDomain = backend.domain;
    backendSubPassword = backend.sub_password || "";
  } else if (backendParam === "custom") {
    backendDomain = customUrl;
    backendSubPassword = password;
  } else {
    const backend = await getDefaultBackend(env);
    if (!backend) return new Response("暂无默认后端", { status: 404 });
    backendDomain = backend.domain;
    backendSubPassword = backend.sub_password || "";
  }

  if (!backendDomain) return new Response("后端地址为空", { status: 400 });
  if (password && backendSubPassword && password !== backendSubPassword) return new Response("订阅密码错误", { status: 403 });

  let backendSubUrl = normalizeUrl(backendDomain) + (password ? `/${encodeURIComponent(password)}` : "/sub");
  const forwardParams = new URLSearchParams(url.searchParams);
  forwardParams.delete("backend");
  forwardParams.delete("password");
  forwardParams.delete("url");
  if (forwardParams.toString()) backendSubUrl += "?" + forwardParams.toString();

  try {
    const headers = new Headers(request.headers);
    headers.delete("Host");
    const res = await fetch(backendSubUrl, { method: request.method, headers, body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body });
    return new Response(res.body, { status: res.status, headers: res.headers });
  } catch (error) {
    return new Response("代理失败: " + (error.message || error), { status: 500 });
  }
}

async function listWhitelist(env) {
  if (!env.DB) return [];
  if (!await ensureWhitelistTable(env)) return [];
  try {
    const { results } = await env.DB.prepare("SELECT ip FROM whitelist ORDER BY created_at DESC").all();
    return (results || []).map((row) => ({ ip: row.ip, type: "manual" }));
  } catch (_) {
    return [];
  }
}

async function addWhitelist(env, ip) {
  if (!env.DB) return { ok: false, errors: ["Missing D1"] };
  if (!await ensureWhitelistTable(env)) return { ok: false, errors: ["Whitelist table unavailable"] };
  await env.DB.prepare("INSERT OR IGNORE INTO whitelist (ip, created_at) VALUES (?, ?)").bind(ip, Date.now()).run();
  return { ok: true };
}

async function deleteWhitelist(env, ip) {
  if (!env.DB) return { ok: false, errors: ["Missing D1"] };
  if (!await ensureWhitelistTable(env)) return { ok: false, errors: ["Whitelist table unavailable"] };
  await env.DB.prepare("DELETE FROM whitelist WHERE ip = ?").bind(ip).run();
  return { ok: true };
}

async function addLog(env, request, action) {
  if (!env.DB) return;
  try {
    if (!await ensureLogsTable(env)) return;
    const ip = request.headers.get("CF-Connecting-IP") || "Unknown";
    const cf = request.cf || {};
    const region = [cf.city, cf.country].filter(Boolean).join(",") || "Unknown";
    await env.DB.prepare("INSERT INTO logs (time, ip, region, action) VALUES (?, ?, ?, ?)")
      .bind(new Date().toISOString(), ip, region, action)
      .run();
  } catch (_) {}
}

async function panelBootstrap(request, env) {
  const url = new URL(request.url);
  const host = url.host;
  const backend = await getDefaultBackend(env);
  const uuid = backend?.uuid || await getConfig(env, "UUID", "");
  const subPassword = backend?.sub_password || await getConfig(env, "SUB_PASSWORD", "");
  const proxyIp = await getConfig(env, "PROXYIP", await getConfig(env, "PROXY_IP", ""));
  const converter = await getConfig(env, "SUBAPI", await getConfig(env, "CONVERTER", "https://subapi.cmliussss.net"));
  const subDomain = await getConfig(env, "SUB_DOMAIN", host);
  const tgToken = await getConfig(env, "TG_BOT_TOKEN", "");
  const tgId = await getConfig(env, "TG_CHAT_ID", "");
  const cfId = backend?.cf_account_id || await getConfig(env, "CF_ID", "");
  const cfToken = backend?.cf_api_token || await getConfig(env, "CF_TOKEN", "");
  const cfMail = await getConfig(env, "CF_EMAIL", "");
  const cfKey = await getConfig(env, "CF_KEY", "");
  const bgLogin = await getConfig(env, "BG_LOGIN", env.PANEL_LOGIN_BG || env.PANEL_BG_LOGIN || env.BG_LOGIN || "");
  const bgDash = await getConfig(env, "BG_DASH", "");
  const glassA = await getConfig(env, "GLASS_A", "72");
  const scrimA = await getConfig(env, "SCRIM_A", "55");

  return json({
    ok: true,
    uuid,
    subPassword,
    identity: {
      host,
      ip: request.headers.get("CF-Connecting-IP") || "Unknown",
      location: [request.cf?.city, request.cf?.country].filter(Boolean).join(", ") || "Unknown"
    },
    status: {
      storage: env.DB ? "D1 OK" : "Missing",
      telegram: !!(tgToken && tgId),
      cloudflare: !!((cfId && cfToken) || (cfMail && cfKey))
    },
    links: {
      short: subPassword ? `${url.origin}/${encodeURIComponent(subPassword)}` : "",
      raw: `${url.origin}/sub?uuid=${encodeURIComponent(uuid)}`,
      clash: `${converter}/sub?target=clash&url=${encodeURIComponent(`${url.origin}/sub?uuid=${uuid}`)}&emoji=true&list=false&sort=false&fdn=false&scv=false`,
      singbox: `${converter}/sub?target=singbox&url=${encodeURIComponent(`${url.origin}/sub?uuid=${uuid}`)}&emoji=true&list=false&sort=false&fdn=false&scv=false`,
      proxyPath: proxyIp ? `/proxyip=${proxyIp}` : "/"
    },
    config: {
      ADD: await getConfig(env, "ADD", ""),
      ADDAPI: await getConfig(env, "ADDAPI", ""),
      ADDCSV: await getConfig(env, "ADDCSV", ""),
      DLS: await getConfig(env, "DLS", "7"),
      PROXYIP: proxyIp,
      SUB_DOMAIN: subDomain,
      SUBAPI: converter,
      PS: await getConfig(env, "PS", ""),
      LOGIN_PAGE_TITLE: await getConfig(env, "LOGIN_PAGE_TITLE", "Worker Login"),
      DASHBOARD_TITLE: await getConfig(env, "DASHBOARD_TITLE", "CFW 控制台"),
      TG_GROUP_URL: await getConfig(env, "TG_GROUP_URL", "https://t.me/zyssadmin"),
      SITE_URL: await getConfig(env, "SITE_URL", "https://blog.mtcacg.top"),
      GITHUB_URL: await getConfig(env, "GITHUB_URL", "https://github.com/TyrEamon/CFW-GrainTCP"),
      PROXY_CHECK_URL: await getConfig(env, "PROXY_CHECK_URL", "https://kaic.hidns.co/"),
      CLASH_CONFIG: await getConfig(env, "CLASH_CONFIG", ""),
      SINGBOX_CONFIG_V11: await getConfig(env, "SINGBOX_CONFIG_V11", ""),
      SINGBOX_CONFIG_V12: await getConfig(env, "SINGBOX_CONFIG_V12", ""),
      WL_IP: await getConfig(env, "WL_IP", ""),
      ECH_ENABLED: await getConfig(env, "ECH_ENABLED", "true"),
      ECH_SNI: await getConfig(env, "ECH_SNI", "cloudflare-ech.com"),
      ECH_DNS: await getConfig(env, "ECH_DNS", "https://odvr.nic.cz/doh"),
      BG_LOGIN: bgLogin,
      BG_DASH: bgDash,
      GLASS_A: glassA,
      SCRIM_A: scrimA,
      CF_CONFIGS: await getConfig(env, "CF_CONFIGS", "[]")
    },
    secrets: {
      TG_BOT_TOKEN: tgToken ? "****" + tgToken.slice(-4) : "",
      TG_CHAT_ID: tgId ? "****" + tgId.slice(-4) : "",
      CF_ID: cfId ? "****" + cfId.slice(-4) : "",
      CF_TOKEN: cfToken ? "****" + cfToken.slice(-4) : "",
      CF_EMAIL: cfMail ? "****" + cfMail.slice(-4) : "",
      CF_KEY: cfKey ? "****" + cfKey.slice(-4) : ""
    }
  }, 200, request);
}

const CONFIG_KEYS = new Set(["ADD", "ADDAPI", "ADDCSV", "DLS", "TG_BOT_TOKEN", "TG_CHAT_ID", "CF_ID", "CF_TOKEN", "CF_EMAIL", "CF_KEY", "CF_CONFIGS", "PROXYIP", "SUB_DOMAIN", "SUBAPI", "PS", "LOGIN_PAGE_TITLE", "DASHBOARD_TITLE", "TG_GROUP_URL", "SITE_URL", "GITHUB_URL", "PROXY_CHECK_URL", "CLASH_CONFIG", "SINGBOX_CONFIG_V11", "SINGBOX_CONFIG_V12", "WL_IP", "ECH_ENABLED", "ECH_SNI", "ECH_DNS", "BG_LOGIN", "BG_DASH", "GLASS_A", "SCRIM_A"]);

async function handleApiRequest(request, env, path, method, ctx) {
  if (method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request.headers.get("Origin")) });

  if (path === "theme" && method === "GET") {
    return json({
      ok: true,
      title: await getConfig(env, "LOGIN_PAGE_TITLE", "Worker Login"),
      logo: await getConfig(env, "LOGO_URI", ""),
      links: {
        tgGroup: await getConfig(env, "TG_GROUP_URL", "https://t.me/zyssadmin"),
        site: await getConfig(env, "SITE_URL", "https://blog.mtcacg.top"),
        github: await getConfig(env, "GITHUB_URL", "https://github.com/TyrEamon/CFW-GrainTCP")
      },
      background: {
        login: await getConfig(env, "BG_LOGIN", env.PANEL_LOGIN_BG || env.PANEL_BG_LOGIN || env.BG_LOGIN || ""),
        dash: await getConfig(env, "BG_DASH", ""),
        glassA: await getConfig(env, "GLASS_A", "72"),
        scrimA: await getConfig(env, "SCRIM_A", "55")
      }
    }, 200, request);
  }

  if (path === "login" && method === "POST") {
    const body = await readJson(request);
    const correctPassword = await getConfig(env, "WEB_PASSWORD", DEFAULT_WEB_PASSWORD);
    if (String(body.password || "") !== correctPassword) return json({ ok: false, success: false, msg: "密码错误" }, 401, request);
    ctx?.waitUntil?.(addLog(env, request, "登录后台"));
    const response = json({ ok: true, success: true }, 200, request);
    response.headers.append("Set-Cookie", createSessionCookie(request, correctPassword));
    return response;
  }

  if (path === "logout" && method === "POST") {
    const response = json({ ok: true }, 200, request);
    response.headers.append("Set-Cookie", clearSessionCookie());
    return response;
  }

  if (path === "session" && method === "GET") {
    const authenticated = await isAuthenticated(request, env);
    const response = json({ ok: true, authenticated, ttl: SESSION_TTL_SECONDS }, 200, request);
    if (authenticated) response.headers.append("Set-Cookie", createSessionCookie(request, await getConfig(env, "WEB_PASSWORD", DEFAULT_WEB_PASSWORD)));
    return response;
  }

  if (!await isAuthenticated(request, env)) return json({ ok: false, msg: "Unauthorized" }, 401, request);

  if (path === "bootstrap" && method === "GET") return panelBootstrap(request, env);

  if (path === "stats" && (method === "GET" || method === "POST")) {
    const body = method === "POST" ? await readJson(request) : {};
    const backendId = new URL(request.url).searchParams.get("backend");
    const backend = backendId ? await getBackend(env, parseInt(backendId, 10)) : await getDefaultBackend(env);
    const cfConfig = body && (body.CF_ID || body.CF_TOKEN || body.CF_EMAIL || body.CF_KEY)
      ? { cf_account_id: body.CF_ID, cf_api_token: body.CF_TOKEN, cf_email: body.CF_EMAIL, cf_key: body.CF_KEY }
      : backend;
    const stats = cfConfig ? await getBackendStats(cfConfig, new URL(request.url).searchParams.get("range") || "24h") : { success: false };
    return json({
      ok: true,
      req: stats.success ? `${stats.requests} (API)` : "N/A",
      ip: request.headers.get("CF-Connecting-IP") || "Unknown",
      loc: [request.cf?.city, request.cf?.country].filter(Boolean).join(", ") || "Unknown",
      storageStatus: env.DB ? "D1 OK" : "Missing",
      cfConfigured: !!((cfConfig?.cf_account_id && cfConfig?.cf_api_token) || (cfConfig?.cf_email && cfConfig?.cf_key))
    }, 200, request);
  }

  if (path === "logs" && method === "GET") {
    let logs = [];
    if (env.DB) {
      try {
        await ensureLogsTable(env);
        const { results } = await env.DB.prepare("SELECT * FROM logs ORDER BY id DESC LIMIT 50").all();
        logs = (results || []).map((row) => ({ id: row.id, time: row.time, ip: row.ip, region: row.region, action: row.action, sortTime: Date.parse(row.time) || 0 }));
      } catch (_) {}
    }
    return json({ ok: true, type: env.DB ? "d1" : "none", logs }, 200, request);
  }

  if (path === "whitelist" && method === "GET") return json({ ok: true, list: await listWhitelist(env) }, 200, request);

  if (path === "whitelist" && method === "POST") {
    const body = await readJson(request);
    const ip = String(body.ip || "").trim();
    if (!ip) return json({ ok: false, status: "error", msg: "Missing IP" }, 400, request);
    const result = await addWhitelist(env, ip);
    return json({ status: result.ok ? "ok" : "error", msg: result.errors?.join(" | ") || "", ...result }, result.ok ? 200 : 400, request);
  }

  if (path === "whitelist" && method === "DELETE") {
    const body = await readJson(request);
    const ip = String(body.ip || new URL(request.url).searchParams.get("ip") || "").trim();
    if (!ip) return json({ ok: false, status: "error", msg: "Missing IP" }, 400, request);
    const result = await deleteWhitelist(env, ip);
    return json({ status: result.ok ? "ok" : "error", msg: result.errors?.join(" | ") || "", ...result }, result.ok ? 200 : 400, request);
  }

  if (path === "config" && method === "POST") {
    const body = await readJson(request);
    const saved = [];
    for (const [key, value] of Object.entries(body || {})) {
      if (!CONFIG_KEYS.has(key)) continue;
      if (await setConfig(env, key, value)) saved.push(key);
    }
    return json({ ok: true, status: "ok", saved, storage: env.DB ? "D1 OK" : "Missing" }, 200, request);
  }

  if (path === "validate/tg" && method === "POST") return json({ ok: true, success: true, msg: "前端订阅器已接收配置，实际推送由后端节点负责" }, 200, request);
  if (path === "validate/cf" && method === "POST") {
    const body = await readJson(request);
    const stats = await getBackendStats({ cf_account_id: body.CF_ID, cf_api_token: body.CF_TOKEN, cf_email: body.CF_EMAIL, cf_key: body.CF_KEY }, "24h");
    return json({ ok: stats.success, success: stats.success, msg: stats.success ? `验证通过: 总请求 ${stats.requests}` : `验证失败: ${stats.error || "未知错误"}` }, 200, request);
  }

  if (path === "log/github" && method === "POST") {
    ctx?.waitUntil?.(addLog(env, request, "Github项目点击"));
    return json({ ok: true }, 200, request);
  }

  if (path === "backends" && method === "GET") {
    const backends = await getBackends(env);
    return json({ success: true, ok: true, data: backends.map((b) => ({ ...b, cf_api_token: b.cf_api_token ? "***" : "" })) }, 200, request);
  }

  if (path === "backends" && method === "POST") {
    try { return json({ success: true, ok: true, data: await addBackend(env, await readJson(request)) }, 200, request); }
    catch (error) { return json({ success: false, ok: false, message: error.message }, 400, request); }
  }

  if (path.startsWith("backends/") && method === "PUT") {
    try { return json({ success: true, ok: true, data: await updateBackend(env, parseInt(path.split("/")[1], 10), await readJson(request)) }, 200, request); }
    catch (error) { return json({ success: false, ok: false, message: error.message }, 400, request); }
  }

  if (path.startsWith("backends/") && method === "DELETE") {
    try { return json({ success: true, ok: true, data: await deleteBackend(env, parseInt(path.split("/")[1], 10)) }, 200, request); }
    catch (error) { return json({ success: false, ok: false, message: error.message }, 400, request); }
  }

  if (path.startsWith("backends/") && path.endsWith("/test") && method === "GET") {
    const backend = await getBackend(env, parseInt(path.split("/")[1], 10));
    if (!backend) return json({ success: false, ok: false, message: "后端不存在" }, 404, request);
    return json({ success: true, ok: true, data: await testBackendHealth(backend.domain) }, 200, request);
  }

  if (path.startsWith("backends/") && path.endsWith("/stats") && method === "GET") {
    const backend = await getBackend(env, parseInt(path.split("/")[1], 10));
    if (!backend) return json({ success: false, ok: false, message: "后端不存在" }, 404, request);
    return json(await getBackendStats(backend, new URL(request.url).searchParams.get("range") || "24h"), 200, request);
  }

  return json({ ok: false, success: false, message: "API 不存在" }, 404, request);
}

async function handleLegacyFlagRequest(request, env, ctx) {
  const url = new URL(request.url);
  const flag = url.searchParams.get("flag");
  if (!flag) return null;

  if (flag === "github") {
    ctx?.waitUntil?.(addLog(env, request, "Github项目点击"));
    return new Response(null, { status: 204, headers: corsHeaders(request.headers.get("Origin")) });
  }

  if (flag === "log_proxy_check") {
    ctx?.waitUntil?.(addLog(env, request, "检测ProxyIP"));
    return new Response(null, { status: 204, headers: corsHeaders(request.headers.get("Origin")) });
  }

  if (flag === "log_sub_test") {
    ctx?.waitUntil?.(addLog(env, request, "订阅测试点击"));
    return new Response(null, { status: 204, headers: corsHeaders(request.headers.get("Origin")) });
  }

  if (flag === "stats") return handleApiRequest(request, env, "stats", "GET", ctx);
  if (flag === "get_logs") return handleApiRequest(request, env, "logs", "GET", ctx);
  if (flag === "get_whitelist") return handleApiRequest(request, env, "whitelist", "GET", ctx);
  if (flag === "add_whitelist") return handleApiRequest(request, env, "whitelist", request.method.toUpperCase(), ctx);
  if (flag === "validate_tg") return handleApiRequest(request, env, "validate/tg", request.method.toUpperCase(), ctx);
  if (flag === "validate_cf") return handleApiRequest(request, env, "validate/cf", request.method.toUpperCase(), ctx);
  if (flag === "save_config") return handleApiRequest(request, env, "config", request.method.toUpperCase(), ctx);

  if (flag === "del_whitelist") {
    if (!await isAuthenticated(request, env)) return json({ ok: false, msg: "Unauthorized" }, 401, request);
    const body = await readJson(request);
    const ip = String(body.ip || url.searchParams.get("ip") || "").trim();
    if (!ip) return json({ ok: false, status: "error", msg: "Missing IP" }, 400, request);
    const result = await deleteWhitelist(env, ip);
    return json({ status: result.ok ? "ok" : "error", msg: result.errors?.join(" | ") || "", ...result }, result.ok ? 200 : 400, request);
  }

  return null;
}

function serveOriginalPanel(request, env) {
  const origin = new URL(request.url).origin;
  const panelBackend = origin;
  return originalPanelWorker.fetch(request, {
    ...env,
    PANEL_BACKEND: panelBackend,
    BACKEND_URL: panelBackend,
    DEFAULT_BACKEND: panelBackend
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+/, "");
    const method = request.method.toUpperCase();

    const legacyFlagResponse = await handleLegacyFlagRequest(request, env, ctx);
    if (legacyFlagResponse) return legacyFlagResponse;

    if (path === "sub") return proxySubscription(request, env);
    if (path.startsWith("api/")) return handleApiRequest(request, env, path.slice(4).replace(/\/+$/, "") || "session", method, ctx);
    if (path === "" || path === "index.html") return serveOriginalPanel(request, env);

    const defaultBackend = await getDefaultBackend(env).catch(() => null);
    if (defaultBackend && decodeURIComponent(path) === defaultBackend.sub_password) return proxySubscription(request, env, defaultBackend.sub_password);

    return new Response("Not Found", { status: 404 });
  }
};
