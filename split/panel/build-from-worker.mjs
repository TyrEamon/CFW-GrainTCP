import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const workerPath = path.join(root, 'worker.js');
const outPath = path.join(here, 'index.html');
const frontendWorkerPath = path.join(root, 'split', 'frontend-worker.js');
const source = fs.readFileSync(workerPath, 'utf8');

function initializer(name, globals = {}) {
  const match = source.match(new RegExp(`(?:const|let)\\s+${name}\\s*=`));
  if (!match) throw new Error(`Missing initializer: ${name}`);
  let i = match.index + match[0].length;
  const start = i;
  let quote = '';
  let escaped = false;
  while (i < source.length) {
    const ch = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = '';
    } else if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
    } else if (ch === ';') {
      break;
    }
    i += 1;
  }
  return vm.runInNewContext(source.slice(start, i), globals);
}

const constants = {};
for (const name of ['LOGO_URI', 'SITE_URL', 'GITHUB_URL', 'TG_GROUP_URL', 'LOGIN_PAGE_TITLE', 'DASHBOARD_TITLE', 'WEB_PASSWORD']) {
  constants[name] = initializer(name, constants);
}
constants.ECH = initializer('ECH', constants);
constants.ECH_DNS = initializer('ECH_DNS', constants);
constants.ECH_SNI = initializer('ECH_SNI', constants);
constants.FP = constants.ECH ? 'firefox' : 'randomized';

const loginStart = source.indexOf('function loginPage');
const dashStart = source.indexOf('function dashPage');
if (loginStart < 0 || dashStart < 0) throw new Error('Cannot find loginPage/dashPage in worker.js');

const context = vm.createContext({
  LOGO_URI: constants.LOGO_URI,
  ECH: constants.ECH,
  ECH_DNS: constants.ECH_DNS,
  ECH_SNI: constants.ECH_SNI,
  FP: constants.FP
});
vm.runInContext(source.slice(loginStart, dashStart), context);
vm.runInContext(source.slice(dashStart), context);

const token = (name) => `__PANEL_${name}__`;
const sysParams = { tgToken: '', tgId: '', cfId: '', cfToken: '', cfMail: '', cfKey: '' };

function addMobileWebAppMeta(html) {
  if (html.includes('name="mobile-web-app-capable"')) return html;
  return html.replace(
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-capable" content="yes">\n    <meta name="mobile-web-app-capable" content="yes">'
  );
}

let dashboard = context.dashPage(
  token('HOST'),
  token('UUID'),
  token('PROXYIP'),
  token('SUBPASS'),
  token('SUBDOMAIN'),
  token('CONVERTER'),
  {},
  token('CLIENT_IP'),
  true,
  false,
  false,
  token('ADD'),
  token('ADDAPI'),
  token('ADDCSV'),
  token('TG_TOKEN'),
  token('TG_ID'),
  token('CF_ID'),
  token('CF_TOKEN'),
  token('CF_MAIL'),
  token('CF_KEY'),
  sysParams,
  token('DASH_TITLE'),
  token('PROXY_CHECK_URL'),
  token('DLS'),
  'false',
  token('ECH_SNI'),
  token('ECH_DNS'),
  '',
  token('BG_LOGIN'),
  72,
  55
);
dashboard = addMobileWebAppMeta(dashboard);

dashboard = dashboard
  .replace('status-dot off', `status-dot ${token('TG_STATE')}`)
  .replace('status-dot off', `status-dot ${token('CF_STATE')}`)
  .replace(/<input type="checkbox" id="echSwitch"[^>]*onchange="updateEchUI\(\);updateLink\(\)">/,
    '<input type="checkbox" id="echSwitch" __PANEL_ECH_CHECKED__ onchange="updateEchUI();updateLink()">')
  .replace(/<span id="echLabel" style="font-size:0\.8rem">[\s\S]*?<\/span>/,
    '<span id="echLabel" style="font-size:0.8rem">__PANEL_ECH_LABEL__</span>')
  .replace(/<div id="echDetail" style="display:none">/,
    '<div id="echDetail" style="__PANEL_ECH_DETAIL_STYLE__">')
  .replace(/<span id="fpDisplay" style="font-size:0\.8rem;color:var\(--glass-green\);font-weight:600">[\s\S]*?<\/span>/,
    '<span id="fpDisplay" style="font-size:0.8rem;color:var(--glass-green);font-weight:600">__PANEL_FP_DISPLAY__</span>')
  .replace(/const ECH_ON_INIT = false;/,
    'const ECH_ON_INIT = __PANEL_ECH_ON__;');

dashboard = dashboard
  .replace(
    'const ECH_ON_INIT = __PANEL_ECH_ON__; const ECH_SNI_INIT = "__PANEL_ECH_SNI__"; const ECH_DNS_INIT = "__PANEL_ECH_DNS__";',
    'var ECH_ON_INIT = __PANEL_ECH_ON__; var ECH_SNI_INIT = "__PANEL_ECH_SNI__"; var ECH_DNS_INIT = "__PANEL_ECH_DNS__";'
  )
  .replace(
    'let _latencyTimer = null, _logTimer = null, _networkLoaded = false;',
    'var _latencyTimer = null, _logTimer = null, _networkLoaded = false;'
  )
  .replace(
    /                await Promise\.all\(initialPromises\);\r?\n                _latencyTimer = setInterval\(async function\(\) \{[\s\S]*?\r?\n                \}, 1800\);/,
    '                await Promise.all(initialPromises);\n                _latencyTimer = null;'
  );

dashboard = dashboard.replace(
  "#section-subscription.active,#section-whitelist.active,#section-nodes.active,#section-logs.active,#section-background.active{display:block}",
  "#section-subscription.active,#section-whitelist.active,#section-nodes.active,#section-logs.active,#section-background.active,#section-backend.active{display:block}"
);
dashboard = dashboard.replace(
  "#section-subscription .card,#section-whitelist .card,#section-nodes .card,#section-logs .card,#section-background .card{margin-bottom:var(--s-5)}",
  "#section-subscription .card,#section-whitelist .card,#section-nodes .card,#section-logs .card,#section-background .card,#section-backend .card{margin-bottom:var(--s-5)}"
);

dashboard = dashboard.replace(
  `                <div class="nav-item" onclick="showSection('background')">
                    <span class="icon"><svg viewBox="0 0 24 24"><use href="#i-image"/></svg></span> 背景设置
                </div>`,
  `                <div class="nav-item" onclick="showSection('background')">
                    <span class="icon"><svg viewBox="0 0 24 24"><use href="#i-image"/></svg></span> 背景设置
                </div>
                <div class="nav-item" onclick="showSection('backend')">
                    <span class="icon"><svg viewBox="0 0 24 24"><use href="#i-cloud"/></svg></span> 后端地址
                </div>`
);

const backendSection = `

            <!-- 后端地址面板 -->
            <div id="section-backend" class="content-section">
                <div class="card">
                    <div class="card-title"><span class="icon"><svg viewBox="0 0 24 24"><use href="#i-cloud"/></svg></span> 后端地址</div>
                    <div class="input-block">
                        <label>后端 Worker 地址</label>
                        <input type="text" id="panelBackendUrl" placeholder="https://proxylink.example.com">
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-success" onclick="saveBackendAddress()"><svg viewBox="0 0 24 24"><use href="#i-save"/></svg> 保存后端地址</button>
                        <button class="btn btn-secondary" onclick="testBackendAddress()">测试连接</button>
                    </div>
                    <div style="font-size:var(--fs-xs);color:var(--text-dim);margin-top:12px;line-height:1.6">静态面板会把登录、统计、日志和配置保存请求发送到这里。保存后会重新读取后端配置。</div>
                </div>
            </div>`;

dashboard = dashboard.replace(
  /\r?\n        <\/div>\r?\n    <\/div>\r?\n\r?\n    <!-- TG配置模态框 -->/,
  `${backendSection}
        </div>
    </div>

    <!-- TG配置模态框 -->`
);

const apiAdapter = `
        var PANEL_BACKEND = "__PANEL_BACKEND__";
        function panelNormalizeBackend(v) {
            let s = String(v || '').trim();
            if (!s) return '';
            if (!/^https?:\\/\\//i.test(s)) s = 'https://' + s;
            return s.replace(/\\/+$/, '');
        }
        function panelApiUrl(path) {
            const base = panelNormalizeBackend(PANEL_BACKEND);
            if (!base) throw new Error('Missing backend address');
            return base + '/api' + (path.startsWith('/') ? path : '/' + path);
        }
        async function apiFetch(path, options) {
            const init = Object.assign({ credentials: 'include' }, options || {});
            const timeoutMs = Math.max(1000, parseInt(init.timeoutMs || 15000, 10) || 15000);
            delete init.timeoutMs;
            const headers = new Headers(init.headers || {});
            headers.set('Accept', 'application/json');
            if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
            init.headers = headers;
            let timeoutId = null;
            if (!init.signal && typeof AbortController !== 'undefined') {
                const controller = new AbortController();
                init.signal = controller.signal;
                timeoutId = setTimeout(function() { controller.abort(); }, timeoutMs);
            }
            try {
                return await fetch(panelApiUrl(path), init);
            } catch (e) {
                if (e && e.name === 'AbortError') throw new Error('后端响应超时，请检查后端 Worker 是否正常。');
                throw e;
            } finally {
                if (timeoutId) clearTimeout(timeoutId);
            }
        }
        function saveBackendAddress() {
            const next = panelNormalizeBackend(document.getElementById('panelBackendUrl')?.value);
            if (!next) { alert('请填写后端 Worker 地址'); return; }
            localStorage.setItem('grainPanelBackend', next);
            alert('后端地址已保存');
            location.reload();
        }
        async function testBackendAddress() {
            const next = panelNormalizeBackend(document.getElementById('panelBackendUrl')?.value || PANEL_BACKEND);
            if (!next) { alert('请填写后端 Worker 地址'); return; }
            try {
                const res = await fetch(next + '/api/session', { credentials: 'include' });
                alert(res.ok ? '连接正常' : '后端可访问，但当前未登录或未授权：' + res.status);
            } catch (e) {
                alert('连接失败：' + (e.message || e));
            }
        }
        window.addEventListener('DOMContentLoaded', () => {
            const input = document.getElementById('panelBackendUrl');
            if (input) input.value = PANEL_BACKEND;
        });
`;

dashboard = dashboard.replace(
  /const UUID = "__PANEL_UUID__"; const CONVERTER = "__PANEL_CONVERTER__"; const CLIENT_IP = "__PANEL_CLIENT_IP__"; const HAS_AUTH = true;/,
  `var UUID = "__PANEL_UUID__"; var CONVERTER = "__PANEL_CONVERTER__"; var CLIENT_IP = "__PANEL_CLIENT_IP__"; var HAS_AUTH = true;${apiAdapter}`
);

dashboard = dashboard.replace(
  'if (cbScope && cbName && cbScope[cbName]) delete cbScope[cbName];',
  'if (cbScope && cbName) { cbScope[cbName] = function() {}; setTimeout(function() { try { delete cbScope[cbName]; } catch(e) { cbScope[cbName] = undefined; } }, 30000); }'
);

dashboard = dashboard
  .replaceAll("fetch('?flag=stats')", "apiFetch('/stats')")
  .replaceAll("fetch('?flag=get_logs')", "apiFetch('/logs')")
  .replaceAll("fetch('?flag=get_whitelist')", "apiFetch('/whitelist')")
  .replaceAll("fetch('?flag=add_whitelist', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ip}) })", "apiFetch('/whitelist', { method:'POST', body:JSON.stringify({ip}) })")
  .replaceAll("fetch('?flag=del_whitelist', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ip}) })", "apiFetch('/whitelist', { method:'DELETE', body:JSON.stringify({ip}) })")
  .replaceAll("fetch('?flag=log_proxy_check');", "apiFetch('/log/proxy-check', { method:'POST' });")
  .replaceAll("fetch('?flag=log_sub_test');", "apiFetch('/log/sub-test', { method:'POST' });")
  .replaceAll("fetch('?flag=save_config', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })", "apiFetch('/config', { method: 'POST', body: JSON.stringify(data) })")
  .replaceAll("const endpoint = type === 'tg' ? 'validate_tg' : 'validate_cf';", "const endpoint = type === 'tg' ? 'validate/tg' : 'validate/cf';")
  .replaceAll("fetch('?flag=' + endpoint, { method:'POST', body:JSON.stringify(payload) })", "apiFetch('/' + endpoint, { method:'POST', body:JSON.stringify(payload) })");

dashboard = dashboard.replace(
  `        function logout() {
            document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            sessionStorage.removeItem("is_active");
            location.reload();
        }`,
  `        function logout() {
            apiFetch('/logout', { method:'POST' }).catch(() => {}).finally(() => {
                sessionStorage.removeItem("is_active");
                location.reload();
            });
        }`
);

let login = context.loginPage(
  constants.TG_GROUP_URL,
  constants.SITE_URL,
  constants.GITHUB_URL,
  constants.LOGIN_PAGE_TITLE,
  '',
  72,
  55
);
login = addMobileWebAppMeta(login);
login = login.replace(/onclick="window\.open\('[^']*', '_blank'\)"/, 'onclick="openSite()"');
login = login.replace(
  /<button class="btn-unlock" onclick="verify\(\)">([\s\S]*?)<\/button>/,
  '<button class="btn-unlock" id="loginButton" onclick="verify()"><span class="login-btn-text">$1</span><span class="login-spinner" aria-hidden="true"></span></button>'
);
login = login.replace(
  '</style>',
  `        .btn-unlock{display:flex;align-items:center;justify-content:center;gap:8px}
        .btn-unlock[disabled]{cursor:not-allowed;opacity:.78}
        .login-spinner{display:none;width:14px;height:14px;flex:none;border:2px solid rgba(255,255,255,.45);border-top-color:currentColor;border-radius:50%;animation:loginSpin .75s linear infinite}
        .btn-unlock.loading .login-spinner{display:inline-block}
        @keyframes loginSpin{to{transform:rotate(360deg)}}
        @media (prefers-reduced-motion:reduce){.login-spinner{animation:none}}
    </style>`
);

function scriptLiteral(text) {
  return JSON.stringify(text).replace(/<\/script/gi, '<\\/script');
}

const dashboardLiteral = scriptLiteral(dashboard);
const fallbackLinks = {
  site: constants.SITE_URL,
  github: constants.GITHUB_URL,
  tgGroup: constants.TG_GROUP_URL
};

const loginScript = `<script>
        const DASHBOARD_TEMPLATE = ${dashboardLiteral};
        const FALLBACK_LINKS = ${JSON.stringify(fallbackLinks)};
        const FALLBACK_TITLE = ${JSON.stringify(constants.LOGIN_PAGE_TITLE)};
        const DEFAULT_BACKEND = window.__PANEL_DEFAULT_BACKEND__ || "";
        const DEFAULT_LOGIN_BG = window.__PANEL_DEFAULT_LOGIN_BG__ || "";
        const FIRST_RUN_PASSWORD = ${JSON.stringify(constants.WEB_PASSWORD)};
        let panelLinks = Object.assign({}, FALLBACK_LINKS);
        let loginBusy = false;

        function setLoginLoading(loading) {
            loginBusy = !!loading;
            const btn = document.getElementById('loginButton');
            const input = document.getElementById('pwd');
            if (btn) {
                btn.disabled = loginBusy;
                btn.classList.toggle('loading', loginBusy);
                btn.setAttribute('aria-busy', loginBusy ? 'true' : 'false');
            }
            if (input) input.disabled = loginBusy;
        }

        function generateStars() {
            const starsContainer = document.getElementById('starsContainer');
            if (!starsContainer || starsContainer.childElementCount) return;
            for (let i = 0; i < 200; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                star.style.animationDuration = (Math.random() * 2 + 2) + 's';
                const size = Math.random() * 2 + 1;
                star.style.width = size + 'px';
                star.style.height = size + 'px';
                starsContainer.appendChild(star);
            }
        }

        function normalizeBackend(v) {
            let s = String(v || '').trim();
            if (!s) return '';
            if (!/^https?:\\/\\//i.test(s)) s = 'https://' + s;
            return s.replace(/\\/+$/, '');
        }

        function getBackend() {
            const fromQuery = normalizeBackend(new URLSearchParams(location.search).get('backend'));
            if (fromQuery) return saveBackend(fromQuery);
            const configured = normalizeBackend(DEFAULT_BACKEND);
            if (configured) return configured;
            const keys = ['grainPanelBackend', 'grainBackendBase', 'backendBase'];
            for (const key of keys) {
                const saved = normalizeBackend(localStorage.getItem(key));
                if (saved) return saved;
            }
            return '';
        }

        function saveBackend(base) {
            const normalized = normalizeBackend(base);
            if (!normalized) return '';
            localStorage.setItem('grainPanelBackend', normalized);
            return normalized;
        }

        function resetBackend() {
            localStorage.removeItem('grainPanelBackend');
            localStorage.removeItem('grainBackendBase');
            localStorage.removeItem('backendBase');
        }

        async function apiFetch(path, options, explicitBase) {
            const base = normalizeBackend(explicitBase || getBackend());
            if (!base) throw new Error('后端 API 不可用');
            const init = Object.assign({ credentials: 'include' }, options || {});
            const timeoutMs = Math.max(1000, parseInt(init.timeoutMs || 15000, 10) || 15000);
            delete init.timeoutMs;
            const headers = new Headers(init.headers || {});
            headers.set('Accept', 'application/json');
            if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
            init.headers = headers;
            let timeoutId = null;
            if (!init.signal && typeof AbortController !== 'undefined') {
                const controller = new AbortController();
                init.signal = controller.signal;
                timeoutId = setTimeout(function() { controller.abort(); }, timeoutMs);
            }
            try {
                return await fetch(base + '/api' + (path.startsWith('/') ? path : '/' + path), init);
            } catch (e) {
                if (e && e.name === 'AbortError') throw new Error('后端响应超时，请检查后端 Worker 或 PANEL_BACKEND。');
                throw e;
            } finally {
                if (timeoutId) clearTimeout(timeoutId);
            }
        }

        async function checkBackendAddress(base) {
            const next = normalizeBackend(base);
            if (!next) throw new Error('请填写后端地址');
            let res;
            try {
                res = await fetch(next + '/api/theme', {
                    credentials: 'include',
                    cache: 'no-store',
                    headers: { 'Accept': 'application/json' }
                });
            } catch (e) {
                throw new Error('连接后端失败：请确认域名可访问，并且后端变量 PANEL_ORIGIN 已设置为当前前端域名。');
            }
            if (res.status === 404) {
                throw new Error('这个地址不是新版分离后端：/api/theme 返回 404。请把 split/backend-worker.js 部署到这个后端。');
            }
            if (!res.ok) throw new Error('后端接口返回错误：' + res.status);
            const text = await res.text();
            try { JSON.parse(text); }
            catch (e) { throw new Error('后端 /api/theme 没有返回 JSON，请检查后端部署是否正确。'); }
            return next;
        }

        function showFirstRunSetup() {
            const box = document.querySelector('.glass-box');
            if (!box) return;
            const logo = document.querySelector('.login-logo')?.getAttribute('src') || '';
            box.innerHTML =
                (logo ? '<img class="login-logo" src="' + logo.replace(/"/g, '&quot;') + '" alt="logo">' : '') +
                '<h2>后端地址初始化</h2>' +
                '<input type="text" id="firstBackendUrl" placeholder="https://api.example.com" autocomplete="url">' +
                '<div class="btn-group">' +
                    '<button class="btn-unlock" onclick="saveFirstRunBackendAddress()">保存并检查</button>' +
                    '<button class="btn-primary" onclick="testFirstRunBackendAddress()">测试连接</button>' +
                    '<button class="btn-primary" onclick="location.reload()">返回登录</button>' +
                '</div>';
            const input = document.getElementById('firstBackendUrl');
            if (input) input.focus();
        }

        async function saveFirstRunBackendAddress() {
            const input = document.getElementById('firstBackendUrl');
            try {
                const next = await checkBackendAddress(input?.value);
                saveBackend(next);
                sessionStorage.removeItem('is_active');
                alert('后端地址已保存，请使用后端 WEB_PASSWORD 登录。');
                location.reload();
            } catch (e) {
                alert(e.message || e);
            }
        }

        async function testFirstRunBackendAddress() {
            const input = document.getElementById('firstBackendUrl');
            try {
                await checkBackendAddress(input?.value);
                alert('连接正常，这是新版分离后端。');
            } catch (e) {
                alert(e.message || e);
            }
        }

        function buildBgStyle(bgUrl, glassA, scrimA, mode) {
            const glass = Math.min(100, Math.max(20, parseInt(glassA || 72, 10) || 72));
            const scrim = Math.min(95, Math.max(0, parseInt(scrimA || 55, 10) || 55));
            let css = ':root{--glass-a:' + (glass / 100) + ';--scrim-a:' + (scrim / 100) + '}';
            if (bgUrl) {
                css += 'body{background:#0a0d12 url("' + String(bgUrl).replace(/"/g, '\\\\"') + '") center/cover fixed!important}';
                css += 'body::before{content:"";position:fixed;inset:0;background:rgba(8,10,15,var(--scrim-a));z-index:0;pointer-events:none}';
                if (mode === 'dash') css += 'body.light::before{background:rgba(255,255,255,var(--scrim-a))}.container{position:relative;z-index:2}';
                else css += '.glass-box{position:relative;z-index:10}';
            }
            return '<style id="panel-theme-style">' + css + '</style>';
        }

        function applyLoginBackground(bgUrl, glassA, scrimA) {
            const url = String(bgUrl || '').trim();
            if (!url) return;
            document.getElementById('panel-theme-style')?.remove();
            document.body.insertAdjacentHTML('afterbegin', buildBgStyle(url, glassA, scrimA, 'login'));
        }

        async function loadTheme() {
            const base = getBackend();
            if (!base) return;
            try {
                const res = await apiFetch('/theme', {}, base);
                if (!res.ok) return;
                const theme = await res.json();
                panelLinks = Object.assign({}, FALLBACK_LINKS, theme.links || {});
                const title = theme.title || FALLBACK_TITLE;
                document.title = title;
                const logo = theme.logo || '';
                if (logo) {
                    document.querySelector('link[rel="icon"]')?.setAttribute('href', logo);
                    document.querySelector('.login-logo')?.setAttribute('src', logo);
                }
                const bg = theme.background || {};
                applyLoginBackground(bg.login || DEFAULT_LOGIN_BG, bg.glassA, bg.scrimA);
            } catch (e) {}
        }

        async function requireBackend() {
            const base = getBackend();
            if (!base) {
                alert('登录服务暂不可用：当前静态页面无法连接登录 API。');
                return '';
            }
            return base;
        }

        function openSite() {
            window.open(panelLinks.site || FALLBACK_LINKS.site, '_blank');
        }

        function gh() {
            apiFetch('/log/github', { method: 'POST' }).catch(() => {});
            window.open(panelLinks.github || FALLBACK_LINKS.github, '_blank');
        }

        function fillDashboardTemplate(data, backend) {
            const cfg = data.config || {};
            const secrets = data.secrets || {};
            const status = data.status || {};
            const identity = data.identity || {};
            const echOn = String(cfg.ECH_ENABLED || '') === 'true';
            const host = identity.host || new URL(backend).hostname;
            const replacements = {
                '__PANEL_BACKEND__': backend,
                '__PANEL_HOST__': host,
                '__PANEL_UUID__': data.uuid || '',
                '__PANEL_PROXYIP__': cfg.PROXYIP || '',
                '__PANEL_SUBPASS__': data.subPassword || '',
                '__PANEL_SUBDOMAIN__': cfg.SUB_DOMAIN || host,
                '__PANEL_CONVERTER__': cfg.SUBAPI || '',
                '__PANEL_CLIENT_IP__': identity.ip || '',
                '__PANEL_ADD__': cfg.ADD || '',
                '__PANEL_ADDAPI__': cfg.ADDAPI || '',
                '__PANEL_ADDCSV__': cfg.ADDCSV || '',
                '__PANEL_TG_TOKEN__': secrets.TG_BOT_TOKEN || '',
                '__PANEL_TG_ID__': secrets.TG_CHAT_ID || '',
                '__PANEL_CF_ID__': secrets.CF_ID || '',
                '__PANEL_CF_TOKEN__': secrets.CF_TOKEN || '',
                '__PANEL_CF_MAIL__': secrets.CF_EMAIL || '',
                '__PANEL_CF_KEY__': secrets.CF_KEY || '',
                '__PANEL_DASH_TITLE__': cfg.DASHBOARD_TITLE || 'CFW 控制台',
                '__PANEL_PROXY_CHECK_URL__': cfg.PROXY_CHECK_URL || '',
                '__PANEL_DLS__': cfg.DLS || '',
                '__PANEL_BG_LOGIN__': cfg.BG_LOGIN || '',
                '__PANEL_ECH_SNI__': cfg.ECH_SNI || '',
                '__PANEL_ECH_DNS__': cfg.ECH_DNS || '',
                '__PANEL_TG_STATE__': status.telegram ? 'on' : 'off',
                '__PANEL_CF_STATE__': status.cloudflare ? 'on' : 'off',
                '__PANEL_ECH_CHECKED__': echOn ? 'checked' : '',
                '__PANEL_ECH_LABEL__': echOn ? '已启用' : '已关闭',
                '__PANEL_ECH_DETAIL_STYLE__': echOn ? '' : 'display:none',
                '__PANEL_ECH_ON__': echOn ? 'true' : 'false',
                '__PANEL_FP_DISPLAY__': echOn ? 'firefox' : 'randomized'
            };
            let html = DASHBOARD_TEMPLATE;
            for (const [key, value] of Object.entries(replacements)) {
                html = html.split(key).join(String(value ?? '').replace(/<\\/script/gi, '<\\\\/script'));
            }
            html = html.replace('</head>', buildBgStyle(cfg.BG_DASH || '', cfg.GLASS_A, cfg.SCRIM_A, 'dash') + '</head>');
            return html;
        }

        async function loadDashboard() {
            const base = await requireBackend();
            if (!base) return;
            const res = await apiFetch('/bootstrap', {}, base);
            if (!res.ok) throw new Error(res.status === 401 ? '登录已过期，请重新登录' : '后端返回错误：' + res.status);
            const data = await res.json();
            const html = fillDashboardTemplate(data, base);
            document.open();
            document.write(html);
            document.close();
        }

        async function verify() {
            if (loginBusy) return;
            const p = document.getElementById("pwd").value;
            if(!p) return;
            const base = getBackend();
            if (!base) {
                if (p === FIRST_RUN_PASSWORD) {
                    showFirstRunSetup();
                    return;
                }
                alert('首次初始化密码错误。没有后端地址时，只能用模板密码进入后端地址初始化。');
                return;
            }
            let loadedDashboard = false;
            setLoginLoading(true);
            try {
                const res = await apiFetch('/login', { method: 'POST', body: JSON.stringify({ password: p }) }, base);
                if (!res.ok) throw new Error('密码错误或 CORS 未放行');
                sessionStorage.setItem("is_active", "1");
                await loadDashboard();
                loadedDashboard = true;
            } catch (e) {
                if (p === FIRST_RUN_PASSWORD) {
                    resetBackend();
                    showFirstRunSetup();
                    return;
                }
                alert(e.message || e);
            } finally {
                if (!loadedDashboard) setLoginLoading(false);
            }
        }

        async function checkSession() {
            if (!sessionStorage.getItem("is_active")) return;
            const base = getBackend();
            if (!base) return;
            try {
                const res = await apiFetch('/session', {}, base);
                const data = await res.json().catch(() => ({}));
                if (res.ok && data.authenticated) await loadDashboard();
            } catch (e) {}
        }

        window.onload = function() {
            generateStars();
            applyLoginBackground(DEFAULT_LOGIN_BG);
            loadTheme();
            checkSession();
        };
    </script>`;

login = login.replace(/<script>[\s\S]*?<\/script>\s*<\/body>/, `${loginScript}
</body>`);

fs.writeFileSync(outPath, login, 'utf8');
const frontendWorker = `const PANEL_HTML = ${scriptLiteral(login)};

function injectPanelRuntime(html, backend, loginBg) {
  const safeBackend = String(backend || '').trim();
  const safeLoginBg = String(loginBg || '').trim();
  const injection = '<script>window.__PANEL_DEFAULT_BACKEND__=' + JSON.stringify(safeBackend) + ';window.__PANEL_DEFAULT_LOGIN_BG__=' + JSON.stringify(safeLoginBg) + ';</script>';
  return html.replace(/<script>\\s*const DASHBOARD_TEMPLATE/, injection + '\\n    <script>\\n        const DASHBOARD_TEMPLATE');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/' && url.pathname !== '/index.html') {
      return new Response('Not Found', { status: 404 });
    }
    const backend = env.PANEL_BACKEND || env.BACKEND_URL || env.DEFAULT_BACKEND || '';
    const loginBg = env.PANEL_LOGIN_BG || env.PANEL_BG_LOGIN || env.BG_LOGIN || '';
    return new Response(injectPanelRuntime(PANEL_HTML, backend, loginBg), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'same-origin'
      }
    });
  }
};
`;
fs.writeFileSync(frontendWorkerPath, frontendWorker, 'utf8');
console.log(`Generated ${path.relative(root, outPath)} from worker.js frontend templates`);
console.log(`Generated ${path.relative(root, frontendWorkerPath)} with CF variable backend injection`);
