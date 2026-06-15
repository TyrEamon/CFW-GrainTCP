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
const jsonToken = (name) => `__PANEL_${name}_JSON__`;
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
  jsonToken('PROXY_CHECK_URL'),
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
dashboard = dashboard.replace('window.open("__PANEL_PROXY_CHECK_URL_JSON__", "_blank")', 'window.open(__PANEL_PROXY_CHECK_URL_JSON__, "_blank")');

dashboard = dashboard
  .replace(/(<div class="input-block">\s*<label>[^<]*Worker[^<]*\(SNI\/Host\)[^<]*<\/label>\s*)<input type="text" id="hostDom" value="([^"]*)" oninput="updateLink\(\)">/,
    '$1<select id="hostBackendSelect" onchange="applyHostBackendSelection(this.value)" style="margin-bottom:8px"></select>\n                        <input type="text" id="hostDom" value="$2" oninput="renderHostBackendSelect();updateLink()">\n                    </div>\n                    <div class="input-block">\n                        <label>节点 UUID</label>\n                        <input type="text" id="uuidInput" value="__PANEL_UUID__" oninput="updateLink()" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx">')
  .replace(/id="bgDash" value="[^"]*"/, 'id="bgDash" value="__PANEL_BG_DASH__"')
  .replace(/id="glassSld"([^>]*?)value="[^"]*"/, 'id="glassSld"$1value="__PANEL_GLASS_A__"')
  .replace(/id="glassNum"([^>]*?)value="[^"]*"/, 'id="glassNum"$1value="__PANEL_GLASS_A__"')
  .replace(/id="scrimSld"([^>]*?)value="[^"]*"/, 'id="scrimSld"$1value="__PANEL_SCRIM_A__"')
  .replace(/id="scrimNum"([^>]*?)value="[^"]*"/, 'id="scrimNum"$1value="__PANEL_SCRIM_A__"');

dashboard = dashboard.replace(
  `                    <div class="input-block">
                        <label>Worker 域名 (SNI/Host)</label>
                        <input type="text" id="hostDom" value="\${host}" oninput="updateLink()">
                    </div>`,
  `                    <div class="input-block">
                        <label>Worker 域名 (SNI/Host)</label>
                        <select id="hostBackendSelect" onchange="applyHostBackendSelection(this.value)" style="margin-bottom:8px"></select>
                        <input type="text" id="hostDom" value="\${host}" oninput="renderHostBackendSelect();updateLink()">
                    </div>`
);

dashboard = dashboard.replace(
  /(\s*)<div class="sphere-labels">\s*<div class="sphere-label">[\s\S]*?<\/div>\s*<div class="sphere-subtitle" id="reqSubtitle">[\s\S]*?<\/div>\s*<\/div>/,
  `$1<select id="cfStatsProfileSelect" onchange="selectCfStatsProfile(this.value)" style="max-width:220px;margin:0 0 10px auto;display:block"></select>$&`
);

dashboard = dashboard.replace(
  /(\s*)<div style="margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid var\(--border\)">\s*<label>[^<]*Account ID \+ API Token<\/label>/,
  `$1<div style="margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid var(--border)">
                <label>已保存 CF 配置</label>
                <select id="cfProfileSelect" onchange="loadCfProfile(this.value)" style="margin-bottom:10px"></select>
                <input type="text" id="cfProfileName" placeholder="配置名称，例如：主账号 / 小号" style="margin-bottom:10px">
                <div class="btn-group" style="margin-top:0;margin-bottom:10px">
                    <button class="btn btn-success" onclick="saveCfProfile()">保存配置档</button>
                    <button class="btn btn-secondary" onclick="deleteCfProfile()">删除配置档</button>
                </div>
            </div>$&`
);


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
    'const ECH_ON_INIT = __PANEL_ECH_ON_JSON__;');

dashboard = dashboard
  .replace(
    'const ECH_ON_INIT = __PANEL_ECH_ON_JSON__; const ECH_SNI_INIT = "__PANEL_ECH_SNI__"; const ECH_DNS_INIT = "__PANEL_ECH_DNS__";',
    'var ECH_ON_INIT = __PANEL_ECH_ON_JSON__; var ECH_SNI_INIT = __PANEL_ECH_SNI_JSON__; var ECH_DNS_INIT = __PANEL_ECH_DNS_JSON__;'
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
                        <label>已保存后端地址</label>
                        <select id="panelBackendSelect" onchange="selectPanelBackendAddress(this.value)"></select>
                    </div>
                    <div class="input-block">
                        <label>名称</label>
                        <input type="text" id="panelBackendName" placeholder="例如：美国后端 / 香港后端">
                    </div>
                    <div class="input-block">
                        <label>后端 Worker 地址</label>
                        <input type="text" id="panelBackendUrl" placeholder="https://proxylink.example.com">
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-success" onclick="saveBackendAddress()"><svg viewBox="0 0 24 24"><use href="#i-save"/></svg> 保存地址</button>
                        <button class="btn btn-secondary" onclick="deleteBackendAddress()">删除地址</button>
                        <button class="btn btn-primary" onclick="testBackendAddress()">测试连接</button>
                    </div>
                    <div style="font-size:var(--fs-xs);color:var(--text-dim);margin-top:12px;line-height:1.6">这里保存的是订阅节点用的 Worker 域名池，只会同步到“Worker 域名 (SNI/Host)”下拉；登录、统计、日志和配置仍走当前前端面板地址。</div>
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
        var PANEL_BACKEND = __PANEL_BACKEND_JSON__;
        var PANEL_CF_CONFIGS_INIT = __PANEL_CF_CONFIGS_JSON__;
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
                if (e && e.name === 'AbortError') throw new Error('后端响应超时，请检查当前前端 Worker API。');
                throw e;
            } finally {
                if (timeoutId) clearTimeout(timeoutId);
            }
        }
        function backendProfileId(url) {
            return panelNormalizeBackend(url).toLowerCase();
        }
        function backendHostFromUrl(url) {
            const normalized = panelNormalizeBackend(url);
            if (!normalized) return '';
            try { return new URL(normalized).host; }
            catch (e) { return normalized.replace(/^https?:\\/\\//i, '').split('/')[0]; }
        }
        function getPanelBackendProfiles() {
            let list = [];
            try { list = JSON.parse(localStorage.getItem('grainPanelSubBackends') || '[]') || []; }
            catch (e) { list = []; }
            const legacy = panelNormalizeBackend(localStorage.getItem('grainPanelBackend') || '');
            if (legacy && !list.some(item => backendProfileId(item.url) === backendProfileId(legacy))) {
                list.unshift({ name: backendHostFromUrl(legacy), url: legacy });
                localStorage.removeItem('grainPanelBackend');
                setPanelBackendProfiles(list);
            }
            return list
                .map(item => ({ name: String(item.name || '').trim(), url: panelNormalizeBackend(item.url || item.domain || ''), uuid: String(item.uuid || item.UUID || '').trim() }))
                .filter(item => item.url);
        }
        function setPanelBackendProfiles(list) {
            const seen = new Set();
            const clean = [];
            (list || []).forEach(function(item) {
                const url = panelNormalizeBackend(item && (item.url || item.domain));
                const id = backendProfileId(url);
                if (!id || seen.has(id)) return;
                seen.add(id);
                clean.push({ name: String(item.name || backendHostFromUrl(url) || '后端地址').trim(), url, uuid: String(item.uuid || item.UUID || '').trim() });
            });
            localStorage.setItem('grainPanelSubBackends', JSON.stringify(clean));
            return clean;
        }
        function renderPanelBackendControls() {
            const list = getPanelBackendProfiles();
            const select = document.getElementById('panelBackendSelect');
            if (select) {
                select.innerHTML = '<option value="">新建后端地址</option>' + list.map(function(item) {
                    const label = (item.name || backendHostFromUrl(item.url)) + ' - ' + backendHostFromUrl(item.url);
                    return '<option value="' + esc(item.url) + '">' + esc(label) + '</option>';
                }).join('');
            }
            renderHostBackendSelect();
        }
        function selectPanelBackendAddress(url) {
            const normalized = panelNormalizeBackend(url);
            const item = getPanelBackendProfiles().find(profile => backendProfileId(profile.url) === backendProfileId(normalized));
            const nameInput = document.getElementById('panelBackendName');
            const urlInput = document.getElementById('panelBackendUrl');
            if (nameInput) nameInput.value = item ? item.name : '';
            if (urlInput) urlInput.value = item ? item.url : '';
            const uuidInput = document.getElementById('uuidInput');
            if (uuidInput && item && item.uuid) uuidInput.value = item.uuid;
        }
        function saveBackendAddress() {
            const next = panelNormalizeBackend(document.getElementById('panelBackendUrl')?.value);
            if (!next) { alert('请填写后端 Worker 地址'); return; }
            const name = String(document.getElementById('panelBackendName')?.value || backendHostFromUrl(next) || '后端地址').trim();
            const uuid = String(document.getElementById('uuidInput')?.value || '').trim();
            const list = getPanelBackendProfiles().filter(item => backendProfileId(item.url) !== backendProfileId(next));
            list.unshift({ name, url: next, uuid });
            setPanelBackendProfiles(list);
            renderPanelBackendControls();
            const select = document.getElementById('panelBackendSelect');
            if (select) select.value = next;
            applyHostBackendSelection(backendHostFromUrl(next));
            alert('后端地址已保存，仅用于订阅 Host/SNI 下拉。');
        }
        function deleteBackendAddress() {
            const raw = panelNormalizeBackend(document.getElementById('panelBackendUrl')?.value || document.getElementById('panelBackendSelect')?.value);
            if (!raw) { alert('请选择要删除的后端地址'); return; }
            if (!confirm('请选择要删除的后端地址')) return;
            setPanelBackendProfiles(getPanelBackendProfiles().filter(item => backendProfileId(item.url) !== backendProfileId(raw)));
            const nameInput = document.getElementById('panelBackendName');
            const urlInput = document.getElementById('panelBackendUrl');
            if (nameInput) nameInput.value = '';
            if (urlInput) urlInput.value = '';
            renderPanelBackendControls();
        }
        async function testBackendAddress() {
            const next = panelNormalizeBackend(document.getElementById('panelBackendUrl')?.value || document.getElementById('panelBackendSelect')?.value);
            if (!next) { alert('请填写后端 Worker 地址'); return; }
            try {
                const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
                const timer = controller ? setTimeout(function() { controller.abort(); }, 8000) : null;
                const res = await fetch(next + '/api/health', { cache: 'no-store', signal: controller?.signal, headers: { 'Accept': 'application/json' } })
                    .catch(() => fetch(next + '/api/theme', { cache: 'no-store', signal: controller?.signal, headers: { 'Accept': 'application/json' } }))
                    .catch(() => fetch(next + '/', { cache: 'no-store', signal: controller?.signal }));
                if (timer) clearTimeout(timer);
                alert(res && res.ok ? '后端地址' : '请选择要删除的后端地址' + (res ? res.status : '无响应'));
            } catch (e) {
                alert('连接失败：' + (e.message || e));
            }
        }
        function renderHostBackendSelect() {
            const select = document.getElementById('hostBackendSelect');
            if (!select) return;
            const hostInput = document.getElementById('hostDom');
            const current = String(hostInput?.value || '').trim();
            const list = getPanelBackendProfiles();
            select.innerHTML = '<option value="">手动输入 / 当前值</option>' + list.map(function(item) {
                const host = backendHostFromUrl(item.url);
                const label = (item.name || host) + ' - ' + host;
                return '<option value="' + esc(host) + '">' + esc(label) + '</option>';
            }).join('');
            if (current && Array.from(select.options).some(option => option.value === current)) select.value = current;
        }
        function applyHostBackendSelection(host) {
            const value = String(host || '').trim();
            if (!value) return;
            const hostInput = document.getElementById('hostDom');
            const uuidInput = document.getElementById('uuidInput');
            if (hostInput) hostInput.value = value;
            // 订阅源地址 (subDom) 不再随 Worker 域名联动——订阅源应保持前端订阅器自身域名
            const match = getPanelBackendProfiles().find(item => backendHostFromUrl(item.url) === value);
            if (uuidInput && match && match.uuid) uuidInput.value = match.uuid;
            updateLink();
        }
        function safeParseCfProfiles(raw) {
            try {
                const parsed = typeof raw === 'string' ? JSON.parse(raw || '[]') : raw;
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) { return []; }
        }
        function cfProfileId(profile) {
            return String((profile && (profile.id || profile.name || profile.CF_ID || profile.CF_EMAIL)) || '').trim().toLowerCase();
        }
        function normalizeCfProfile(profile) {
            const item = profile || {};
            return {
                id: String(item.id || item.name || item.CF_ID || item.CF_EMAIL || Date.now()).trim(),
                name: String(item.name || item.id || item.CF_ID || item.CF_EMAIL || 'CF 配置').trim(),
                CF_ID: String(item.CF_ID || item.cfId || item.cf_account_id || '').trim(),
                CF_TOKEN: String(item.CF_TOKEN || item.cfToken || item.cf_api_token || '').trim(),
                CF_EMAIL: String(item.CF_EMAIL || item.cfEmail || '').trim(),
                CF_KEY: String(item.CF_KEY || item.cfKey || '').trim()
            };
        }
        function readCfProfiles() {
            let list = safeParseCfProfiles(localStorage.getItem('grainPanelCfConfigs'));
            if (!list.length) list = safeParseCfProfiles(PANEL_CF_CONFIGS_INIT);
            return list.map(normalizeCfProfile).filter(item => item.name && (item.CF_ID || item.CF_TOKEN || item.CF_EMAIL || item.CF_KEY));
        }
        function writeCfProfiles(list) {
            const seen = new Set();
            const clean = [];
            (list || []).map(normalizeCfProfile).forEach(function(item) {
                const id = cfProfileId(item);
                if (!id || seen.has(id)) return;
                seen.add(id);
                clean.push(item);
            });
            localStorage.setItem('grainPanelCfConfigs', JSON.stringify(clean));
            try { writeLocalPanelConfig({ CF_CONFIGS: JSON.stringify(clean) }); } catch (e) {}
            apiFetch('/config', { method:'POST', body: JSON.stringify({ CF_CONFIGS: JSON.stringify(clean) }) }).catch(() => {});
            renderCfProfileSelects(clean);
            return clean;
        }
        function renderCfProfileSelects(list) {
            const profiles = list || readCfProfiles();
            const active = localStorage.getItem('grainPanelActiveCfProfile') || '';
            const options = '<option value="">默认 CF 配置</option>' + profiles.map(function(item) {
                const id = cfProfileId(item);
                return '<option value="' + esc(id) + '">' + esc(item.name || id) + '</option>';
            }).join('');
            const modalSelect = document.getElementById('cfProfileSelect');
            const statsSelect = document.getElementById('cfStatsProfileSelect');
            if (modalSelect) modalSelect.innerHTML = '<option value="">默认 CF 配置</option>' + profiles.map(function(item) {
                const id = cfProfileId(item);
                return '<option value="' + esc(id) + '">' + esc(item.name || id) + '</option>';
            }).join('');
            if (statsSelect) {
                statsSelect.innerHTML = options;
                if (active && profiles.some(item => cfProfileId(item) === active)) statsSelect.value = active;
            }
        }
        function collectCfProfile() {
            const name = String(document.getElementById('cfProfileName')?.value || '').trim();
            const cfId = val('cfAcc');
            const cfToken = val('cfTok');
            const cfMail = val('cfMail');
            const cfKey = val('cfKey');
            if ([cfId, cfToken, cfMail, cfKey].some(v => v && v.startsWith('****'))) {
                alert('当前 CF 凭证是 **** 掩码，无法新建配置档。请重新输入完整 Account ID + API Token，或 Email + Global API Key。');
                return null;
            }
            const hasTokenAuth = !!(cfId && cfToken);
            const hasGlobalKeyAuth = !!(cfMail && cfKey);
            if (!hasTokenAuth && !hasGlobalKeyAuth) {
                alert('不能只填写配置名。请填写 CF 凭证：方案1 填 Account ID + API Token；方案2 填 Email + Global API Key。');
                return null;
            }
            return normalizeCfProfile({ name: name || cfId || cfMail || 'CF 配置', CF_ID: cfId, CF_TOKEN: cfToken, CF_EMAIL: cfMail, CF_KEY: cfKey });
        }
        function loadCfProfile(id) {
            const profile = readCfProfiles().find(item => cfProfileId(item) === String(id || '').trim().toLowerCase());
            const nameInput = document.getElementById('cfProfileName');
            if (!profile) {
                if (nameInput) nameInput.value = '';
                return;
            }
            if (nameInput) nameInput.value = profile.name || '';
            const map = { cfAcc: profile.CF_ID, cfTok: profile.CF_TOKEN, cfMail: profile.CF_EMAIL, cfKey: profile.CF_KEY };
            Object.entries(map).forEach(function(entry) {
                const el = document.getElementById(entry[0]);
                if (el) el.value = entry[1] || '';
            });
        }
        function saveCfProfile() {
            const profile = collectCfProfile();
            if (!profile) return;
            const id = cfProfileId(profile);
            const list = readCfProfiles().filter(item => cfProfileId(item) !== id);
            list.unshift(profile);
            writeCfProfiles(list);
            localStorage.setItem('grainPanelActiveCfProfile', id);
            renderCfProfileSelects();
            const modalSelect = document.getElementById('cfProfileSelect');
            const statsSelect = document.getElementById('cfStatsProfileSelect');
            if (modalSelect) modalSelect.value = id;
            if (statsSelect) statsSelect.value = id;
            alert('CF 配置档已保存。');
        }
        function deleteCfProfile() {
            const id = String(document.getElementById('cfProfileSelect')?.value || localStorage.getItem('grainPanelActiveCfProfile') || '').trim().toLowerCase();
            if (!id) { alert('请先选择要删除的 CF 配置档'); return; }
            if (!confirm('确定删除这个 CF 配置档？')) return;
            writeCfProfiles(readCfProfiles().filter(item => cfProfileId(item) !== id));
            if (localStorage.getItem('grainPanelActiveCfProfile') === id) localStorage.removeItem('grainPanelActiveCfProfile');
            ['cfProfileName','cfAcc','cfTok','cfMail','cfKey'].forEach(function(inputId) { const el = document.getElementById(inputId); if (el) el.value = ''; });
            renderCfProfileSelects();
        }
        function selectCfStatsProfile(id) {
            const value = String(id || '').trim().toLowerCase();
            if (value) localStorage.setItem('grainPanelActiveCfProfile', value);
            else localStorage.removeItem('grainPanelActiveCfProfile');
            updateStats();
        }
        function getActiveCfStatsPayload() {
            const active = String(localStorage.getItem('grainPanelActiveCfProfile') || '').trim().toLowerCase();
            if (!active) {
                const cfg = readLocalPanelConfig();
                const payload = {};
                ['CF_ID','CF_TOKEN','CF_EMAIL','CF_KEY'].forEach(function(key) { if (cfg[key]) payload[key] = cfg[key]; });
                return Object.keys(payload).length ? payload : null;
            }
            const profile = readCfProfiles().find(item => cfProfileId(item) === active);
            if (!profile) return null;
            const payload = {};
            ['CF_ID','CF_TOKEN','CF_EMAIL','CF_KEY'].forEach(function(key) { if (profile[key]) payload[key] = profile[key]; });
            return Object.keys(payload).length ? payload : null;
        }
        window.addEventListener('DOMContentLoaded', () => {
            renderPanelBackendControls();
            renderCfProfileSelects();
        });
`;

dashboard = dashboard.replace(
  /const UUID = "__PANEL_UUID__"; const CONVERTER = "__PANEL_CONVERTER__"; const CLIENT_IP = "__PANEL_CLIENT_IP__"; const HAS_AUTH = true;/,
  `var UUID = __PANEL_UUID_JSON__; var CONVERTER = __PANEL_CONVERTER_JSON__; var CLIENT_IP = __PANEL_CLIENT_IP_JSON__; var HAS_AUTH = true;${apiAdapter}`
);

dashboard = dashboard.replace(
  'if (cbScope && cbName && cbScope[cbName]) delete cbScope[cbName];',
  'if (cbScope && cbName) { cbScope[cbName] = function() {}; setTimeout(function() { try { delete cbScope[cbName]; } catch(e) { cbScope[cbName] = undefined; } }, 30000); }'
);

dashboard = dashboard
  .replaceAll("const res = await fetch('?flag=stats');", "const cfPayload = getActiveCfStatsPayload();\n                const res = await apiFetch('/stats', cfPayload ? { method:'POST', body: JSON.stringify(cfPayload) } : {});")
  .replaceAll("fetch('?flag=get_logs')", "apiFetch('/logs')")
  .replaceAll("fetch('?flag=get_whitelist')", "apiFetch('/whitelist')")
  .replaceAll("fetch('?flag=add_whitelist', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ip}) })", "apiFetch('/whitelist', { method:'POST', body:JSON.stringify({ip}) })")
  .replaceAll("fetch('?flag=del_whitelist', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ip}) })", "apiFetch('/whitelist', { method:'DELETE', body:JSON.stringify({ip}) })")
  .replaceAll("fetch('?flag=log_proxy_check');", "apiFetch('/log/proxy-check', { method:'POST' });")
  .replaceAll("fetch('?flag=log_sub_test');", "apiFetch('/log/sub-test', { method:'POST' });")
  .replaceAll("fetch('?flag=save_config', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })", "apiFetch('/config', { method: 'POST', body: JSON.stringify(data) })")
  .replaceAll("const endpoint = type === 'tg' ? 'validate_tg' : 'validate_cf';", "const endpoint = type === 'tg' ? 'validate/tg' : 'validate/cf';")
  .replaceAll("fetch('?flag=' + endpoint, { method:'POST', body:JSON.stringify(payload) })", "apiFetch('/' + endpoint, { method:'POST', body:JSON.stringify(payload) })");

const proxyIpPersistence = `
        function loadSavedProxyIp() {
            const el = document.getElementById('pIp');
            if (!el) return;
            const saved = localStorage.getItem('grainPanelProxyIp');
            if (!el.value && saved) { el.value = saved; updateLink(); }
            function persistProxyIp() {
                const value = el.value.trim();
                localStorage.setItem('grainPanelProxyIp', value);
                try { writeLocalPanelConfig({ PROXYIP: value }); } catch (e) {}
                apiFetch('/config', { method:'POST', body: JSON.stringify({ PROXYIP: value }) }).catch(() => {});
            }
            el.addEventListener('input', function() {
                const value = el.value.trim();
                localStorage.setItem('grainPanelProxyIp', value);
                try { writeLocalPanelConfig({ PROXYIP: value }); } catch (e) {}
            });
            el.addEventListener('change', persistProxyIp);
            el.addEventListener('blur', persistProxyIp);
        }
`; 


const currentSubscriptionConfigPersistence = `
        async function saveCurrentSubscriptionConfig() {
            const data = {
                UUID: val('uuidInput'),
                HOST_DOMAIN: val('hostDom'),
                SUB_DOMAIN: val('subDom'),
                PROXYIP: val('pIp'),
                ECH_ENABLED: document.getElementById('echSwitch')?.checked ? 'true' : 'false',
                ECH_SNI: val('echSni'),
                ECH_DNS: val('echDns')
            };
            if (!data.UUID) { alert('请先填写节点 UUID'); return; }
            if (!data.HOST_DOMAIN) { alert('请先填写 Worker 域名 (SNI/Host)'); return; }
            const backendUrl = panelNormalizeBackend(data.HOST_DOMAIN);
            const list = getPanelBackendProfiles().filter(item => backendHostFromUrl(item.url) !== data.HOST_DOMAIN);
            if (backendUrl) list.unshift({ name: data.HOST_DOMAIN, url: backendUrl, uuid: data.UUID });
            setPanelBackendProfiles(list);
            localStorage.setItem('grainPanelProxyIp', data.PROXYIP);
            writeLocalPanelConfig(data);
            try {
                const res = await apiFetch('/config', { method:'POST', body: JSON.stringify(data) });
                const result = await res.json().catch(() => ({}));
                if (!res.ok || result.ok === false || result.status === 'error') throw new Error(result.msg || result.message || ('保存失败：' + res.status));
                renderPanelBackendControls();
                updateLink();
                alert('当前订阅配置已保存到 D1。');
            } catch (e) {
                alert(e.message || e);
            }
        }
`;

dashboard = dashboard.replace(
  `try{ if(localStorage.getItem('sbCollapsed')==='1') document.getElementById('sidebar')?.classList.add('collapsed'); }catch(e){}`,
  `try{ if(localStorage.getItem('sbCollapsed')==='1') document.getElementById('sidebar')?.classList.add('collapsed'); }catch(e){}\n                loadSavedProxyIp();`
);


dashboard = dashboard.replace(
  /<button class="btn btn-success" style="width:100%" onclick="saveNodeConfig\(\)">([\s\S]*?)<\/button>/,
  '<button class="btn btn-success" style="width:100%" onclick="saveNodeConfig()">$1</button>\n                    <button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="saveCurrentSubscriptionConfig()"><svg viewBox="0 0 24 24"><use href="#i-save"/></svg> 保存当前订阅配置</button>'
);

dashboard = dashboard.replace(
  'function updateLink() {',
  proxyIpPersistence + currentSubscriptionConfigPersistence + '\n        function updateLink() {'
);

dashboard = dashboard.replace(
  "const data = { ADD: val('inpAdd'), ADDAPI: val('inpAddApi'), ADDCSV: val('inpAddCsv'), DLS: val('inpDls') };\n            saveConfig(data, null);","const data = { ADD: val('inpAdd'), ADDAPI: val('inpAddApi'), ADDCSV: val('inpAddCsv'), DLS: val('inpDls'), UUID: val('uuidInput'), HOST_DOMAIN: val('hostDom'), PROXYIP: val('pIp'), SUB_DOMAIN: val('subDom') };\n            localStorage.setItem('grainPanelProxyIp', val('pIp'));\n            saveConfig(data, null);"
);

dashboard = dashboard.replace(
  "search.set('uuid', UUID);","search.set('uuid', (document.getElementById('uuidInput')?.value || UUID).trim());"
);



const localPanelConfigPersistence = `
        function readLocalPanelConfig() {
            try { return JSON.parse(localStorage.getItem('grainPanelLocalConfig') || '{}') || {}; }
            catch (e) { return {}; }
        }
        function writeLocalPanelConfig(data) {
            const allowed = new Set(['ADD','ADDAPI','ADDCSV','DLS','UUID','HOST_DOMAIN','PROXYIP','SUB_DOMAIN','SUBAPI','PS','LOGIN_PAGE_TITLE','DASHBOARD_TITLE','TG_GROUP_URL','SITE_URL','GITHUB_URL','PROXY_CHECK_URL','CLASH_CONFIG','SINGBOX_CONFIG_V11','SINGBOX_CONFIG_V12','WL_IP','ECH_ENABLED','ECH_SNI','ECH_DNS','BG_LOGIN','BG_DASH','GLASS_A','SCRIM_A','CF_CONFIGS']);
            ['CF_ID','CF_TOKEN','CF_EMAIL','CF_KEY'].forEach(function(key) { allowed.add(key); });
            const current = readLocalPanelConfig();
            Object.entries(data || {}).forEach(function(entry) {
                const key = entry[0];
                if (!allowed.has(key)) return;
                current[key] = String(entry[1] ?? '');
            });
            localStorage.setItem('grainPanelLocalConfig', JSON.stringify(current));
        }
`;

dashboard = dashboard.replace(
  /async function saveConfig\(data, modalId\) \{\s*try \{/,
  localPanelConfigPersistence + `async function saveConfig(data, modalId) {
            writeLocalPanelConfig(data);
            try {`
);

dashboard = dashboard.replace(
  `        function logout() {
            document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            localStorage.removeItem("grainPanelSessionUntil");
            location.reload();
        }`,
  `        function logout() {
            apiFetch('/logout', { method:'POST' }).catch(() => {}).finally(() => {
                localStorage.removeItem("grainPanelSessionUntil");
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

function htmlValue(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function jsValue(value) {
  return JSON.stringify(String(value ?? '')).replace(/<\/script/gi, '<\\/script');
}

function jsBoolean(value) {
  return value ? 'true' : 'false';
}

function cfConfigsValue(value) {
  const text = String(value || '[]');
  try {
    const parsed = JSON.parse(text);
    return scriptLiteral(JSON.stringify(Array.isArray(parsed) ? parsed : []));
  } catch (e) {
    return scriptLiteral('[]');
  }
}

function cssUrlValue(value) {
  const slash = String.fromCharCode(92);
  const quote = String.fromCharCode(34);
  return String(value ?? '')
    .split(slash).join(slash + slash)
    .split(quote).join(slash + quote)
    .split(String.fromCharCode(13)).join(' ')
    .split(String.fromCharCode(10)).join(' ')
    .split(String.fromCharCode(12)).join(' ')
    .split('<').join(slash + '3C ')
    .split('>').join(slash + '3E ');
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
        let dashboardLoaded = false;
        let dashboardLoading = false;
        window.__grainPanelDashboardLoaded = false;

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
                localStorage.removeItem('grainPanelSessionUntil');
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
                css += 'body{background:#0a0d12 url("' + cssUrlValue(bgUrl) + '") center/cover fixed!important}';
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
                applyLoginBackground(
                    bg.login || DEFAULT_LOGIN_BG,
                    bg.glassA,
                    bg.scrimA
                );
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

        function readLocalPanelConfig() {
            try { return JSON.parse(localStorage.getItem('grainPanelLocalConfig') || '{}') || {}; }
            catch (e) { return {}; }
        }

        function writeLocalPanelConfig(data) {
            const current = readLocalPanelConfig();
            Object.entries(data || {}).forEach(function(entry) {
                current[entry[0]] = String(entry[1] ?? '');
            });
            localStorage.setItem('grainPanelLocalConfig', JSON.stringify(current));
        }

        function localPanelValue(cfg, key, fallback) {
            return Object.prototype.hasOwnProperty.call(cfg, key) ? cfg[key] : fallback;
        }

        function htmlValue(value) {
            return String(value ?? '')
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }

        function jsValue(value) {
            return JSON.stringify(String(value ?? '')).replace(/<\\/script/gi, '<\\\\/script');
        }

        function jsBoolean(value) {
            return value ? 'true' : 'false';
        }

        function cfConfigsValue(value) {
            const text = String(value || '[]');
            try {
                const parsed = JSON.parse(text);
                return jsValue(JSON.stringify(Array.isArray(parsed) ? parsed : []));
            } catch (e) {
                return jsValue('[]');
            }
        }

        function cssUrlValue(value) {
            const slash = String.fromCharCode(92);
            const quote = String.fromCharCode(34);
            return String(value ?? '')
                .split(slash).join(slash + slash)
                .split(quote).join(slash + quote)
                .split(String.fromCharCode(13)).join(' ')
                .split(String.fromCharCode(10)).join(' ')
                .split(String.fromCharCode(12)).join(' ')
                .split('<').join(slash + '3C ')
                .split('>').join(slash + '3E ');
        }

        function fillDashboardTemplate(data, backend) {
            const serverCfg = data.config || {};
            if (Object.keys(serverCfg).length) writeLocalPanelConfig(serverCfg);
            const cfg = Object.assign({}, readLocalPanelConfig(), serverCfg);
            const secrets = data.secrets || {};
            ['CF_ID','CF_TOKEN','CF_EMAIL','CF_KEY'].forEach(function(key) { if (cfg[key]) secrets[key] = cfg[key]; });
            const status = data.status || {};
            const identity = data.identity || {};
            const echOn = String(cfg.ECH_ENABLED || '') === 'true';
            const host = cfg.HOST_DOMAIN || identity.host || new URL(backend).hostname;
            const replacements = {
                '__PANEL_BACKEND_JSON__': jsValue(backend),
                '__PANEL_HOST__': host,
                '__PANEL_UUID_JSON__': jsValue(data.uuid || ''),
                '__PANEL_UUID__': data.uuid || '',
                '__PANEL_PROXYIP__': cfg.PROXYIP || '',
                '__PANEL_SUBPASS__': data.subPassword || '',
                '__PANEL_SUBDOMAIN__': cfg.SUB_DOMAIN || host,
                '__PANEL_CONVERTER_JSON__': jsValue(cfg.SUBAPI || ''),
                '__PANEL_CLIENT_IP_JSON__': jsValue(identity.ip || ''),
                '__PANEL_ADD__': cfg.ADD || '',
                '__PANEL_ADDAPI__': cfg.ADDAPI || '',
                '__PANEL_ADDCSV__': cfg.ADDCSV || '',
                '__PANEL_TG_TOKEN__': secrets.TG_BOT_TOKEN || '',
                '__PANEL_TG_ID__': secrets.TG_CHAT_ID || '',
                '__PANEL_CF_ID__': secrets.CF_ID || '',
                '__PANEL_CF_TOKEN__': secrets.CF_TOKEN || '',
                '__PANEL_CF_MAIL__': secrets.CF_EMAIL || '',
                '__PANEL_CF_KEY__': secrets.CF_KEY || '',
                '__PANEL_CF_CONFIGS_JSON__': cfConfigsValue(cfg.CF_CONFIGS),
                '__PANEL_DASH_TITLE__': cfg.DASHBOARD_TITLE || 'CFW 控制台',
                '__PANEL_PROXY_CHECK_URL_JSON__': jsValue(cfg.PROXY_CHECK_URL || ''),
                '__PANEL_DLS__': cfg.DLS || '',
                '__PANEL_BG_LOGIN__': cfg.BG_LOGIN || '',
                '__PANEL_BG_DASH__': cfg.BG_DASH || '',
                '__PANEL_GLASS_A__': cfg.GLASS_A || '72',
                '__PANEL_SCRIM_A__': cfg.SCRIM_A || '55',
                '__PANEL_ECH_SNI_JSON__': jsValue(cfg.ECH_SNI || ''),
                '__PANEL_ECH_DNS_JSON__': jsValue(cfg.ECH_DNS || ''),
                '__PANEL_ECH_SNI__': cfg.ECH_SNI || '',
                '__PANEL_ECH_DNS__': cfg.ECH_DNS || '',
                '__PANEL_TG_STATE__': status.telegram ? 'on' : 'off',
                '__PANEL_CF_STATE__': status.cloudflare ? 'on' : 'off',
                '__PANEL_ECH_CHECKED__': echOn ? 'checked' : '',
                '__PANEL_ECH_LABEL__': echOn ? '已启用' : '已关闭',
                '__PANEL_ECH_DETAIL_STYLE__': echOn ? '' : 'display:none',
                '__PANEL_ECH_ON_JSON__': jsBoolean(echOn),
                '__PANEL_FP_DISPLAY__': echOn ? 'firefox' : 'randomized'
            };
            let html = DASHBOARD_TEMPLATE;
            for (const [key, value] of Object.entries(replacements)) {
                const replacement = key.endsWith('_JSON__') ? String(value ?? '""') : htmlValue(value);
                html = html.split(key).join(replacement);
            }
            html = html.replace('</head>', buildBgStyle(cfg.BG_DASH || '', cfg.GLASS_A, cfg.SCRIM_A, 'dash') + '</head>');
            return html;
        }

        async function loadDashboard() {
            if (dashboardLoaded || dashboardLoading || window.__grainPanelDashboardLoaded) return;
            dashboardLoading = true;
            try {
            const base = await requireBackend();
            if (!base) { dashboardLoading = false; return; }
            const res = await apiFetch('/bootstrap', {}, base);
            if (!res.ok) throw new Error(res.status === 401 ? '登录已过期，请重新登录' : '后端返回错误：' + res.status);
            const data = await res.json();
            if (dashboardLoaded || window.__grainPanelDashboardLoaded) return;
            const html = fillDashboardTemplate(data, base);
            dashboardLoaded = true;
            window.__grainPanelDashboardLoaded = true;
            try { sessionStorage.setItem("is_active", "1"); } catch (e) {}
            window.onload = null;
            document.open();
            document.write(html);
            document.close();
            } catch (e) {
                dashboardLoading = false;
                throw e;
            }
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
                localStorage.setItem("grainPanelSessionUntil", String(Date.now() + 7200 * 1000));
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
            if (dashboardLoaded || dashboardLoading || window.__grainPanelDashboardLoaded) return;
            const base = getBackend();
            if (!base) return;
            try {
                const res = await apiFetch('/session', { timeoutMs: 8000 }, base);
                const data = await res.json().catch(() => ({}));
                if (res.ok && data.authenticated) {
                    const ttl = Math.max(60, Number(data.ttl || 7200) || 7200);
                    localStorage.setItem('grainPanelSessionUntil', String(Date.now() + ttl * 1000));
                    await loadDashboard();
                    return;
                }
                localStorage.removeItem('grainPanelSessionUntil');
                try { sessionStorage.removeItem('is_active'); } catch (e) {}
            } catch (e) {
                const sessionUntil = Number(localStorage.getItem('grainPanelSessionUntil') || 0);
                if (!sessionUntil || sessionUntil <= Date.now()) localStorage.removeItem('grainPanelSessionUntil');
            }
        }

        window.onload = function() {
            if (dashboardLoaded || dashboardLoading || window.__grainPanelDashboardLoaded) return;
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
