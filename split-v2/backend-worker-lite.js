// ============================================================================
// GrainTCP Backend Worker - Lite Version (No D1 Dependency)
// ============================================================================
// 改动：移除 D1 依赖，配置从环境变量读取，新增 /api/health 和 /api/logs 接口
// ============================================================================


// =============================================================================
// 🟣 1. 用户配置区域 (优先级: 环境变量 > D1 > 硬编码)
// =============================================================================

// --- 基础账号与网络配置 ---
let UUID = "06b65903-406d-4a41-8463-6fd5c0ee7798"; //修改可用的uuid
const WEB_PASSWORD = "abc";  //修改你的登录密码
const SUB_PASSWORD = "123456";  //修改你的订阅密码
const SUB_TOKEN = "";  //ST裂变Token，留空不启用，支持环境变量 SUB_TOKEN 覆盖
const DEFAULT_PROXY_IP = 'Pro'+'xy'+'IP.US.CM'+'Liu'+'ssss.net'; //单个proxyip socks5 http
const DEFAULT_SUB_DOMAIN = 'https://owo.o00o.ooo/'; //单个sub优选订阅
const DEFAULT_CONVERTER = 'htt'+'ps://su'+'bap'+'i.cm'+'liu'+'ssss.net'; //转换后端api

// --- 界面与链接配置 ---
const LOGIN_PAGE_TITLE = "Worker Login"; // 修改你的登录页标题
const DASHBOARD_TITLE = "烈火控制台 · Glass LH"; //修改你的管理后台标题
const TG_GROUP_URL = "https://t.me/zyssadmin";       // 登录页“交流群”链接
const SITE_URL = "https://blog.mtcacg.top";          // 登录页“我的博客”链接
const GITHUB_URL = "https://github.com/TyrEamon/CFW-GrainTCP"; // 登录页“Github项目”链接
const PROXY_CHECK_URL = "https://kaic.hidns.co/";    // 后台 ProxyIP 检测跳转地址
const LOGO_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAAkFBMVEUbEyFZZJ+cZmzZracvKVqYp85RIjBoTl2plJrVztHZrHFcN040ZEuYNERvhLmfeoUkVDm5wdiRLz3Qu8K3iHHBZWF0i8w+Q4ZmRzbew71BP4DGdoY9PYCBQTxvf8V5k9Djw75bIDYxEh5ESIk1FCJ4ks7kxcFWZKuslpvnp5hYHTMqEhu0vNdGTJF0isYzKFosB/25AAANxUlEQVR42pVZiWLiuBLUhWRiiJOQzcwe73HY5vKA///vtqol2QaS7K6YZEICXarqU0KtP1vt+uoUV9B6PVuvZ3G1bbv+/PVf/mWtvnjHeh0RiLGe6cClZ+sv7fBP7X8DaCMCvmstP+3ww+xm18OPWpPp7DOILwD4/lmEcE79fHqy9unp6afX6/W1jevj42N4rUtqfsLwS4CJTN7A+JPlP69nk5Wkb9etcgtFqvKufwvANwrC008CCMo7NzosqBL3jJBYvCyA8YjwHQBeOyPCO01HlHeP511yfycYAjFTL0R4AcKdSt8CcG+qNFxPeRlTDgtQSXlQFYQFOfwHgHb9oUxaA0Qgi0ZWGZLy2MiLIDhy+E8MnP9pfuN6GtdP77eyfNP4RiBaeoEYL+p6g/A1QIrGdfbBdJnt+byVL6xGIOgF+IAitVME9aVplgh8zVr19LiaSCEigAkgCBBD6flbACRYXEMwfgbgs+m8wIIAQHj5FgDm19luXj4ZfX8atTK3CGdBWIifvwPg7mG54xqiJ69QliHkhDP3FM5AWIgTvgGQ3asu2zvfr60Ef5A/P2i0PatFcsIXAPilmB8sbx9tCAqpmG0pcTT9YxMBvnIywkbMnx/MPixSYUKf7/zwIvbd9dNM5v6VCTu//SeExA8QWz8VSgDUy539DCD7L733jf9nBikBAOFLn4Tifwpd76HaqXH/O1j3XUqhf4ERWSShzmdfhsLa4r5iJ4AW+sN+Ixwe9vqNMxIL+cnuN9baoD+VCPVxhwWMrrmx6c94yOJW/QMN8cV5G8wJxu3pdLK3FTsxAIEm2r/lwGcqzxf8m390BlnA/onWucJNPVWprYh9WZGDFEvv0fKdvuCb69H8e0ClyDlPUwO5N5g/nQzr6R0ACGT7XePj48y0PbTXqz7g4Wo8XN2DTuP9kGPn5OTyfQCwJkxTTUUCaiCARTm2qtTcCM1juVofLu5ycIQRsRIBb0PyRUYwwRCgTSPHLUCzQy+kLLCurx9rbJ+PQw3bBxAREB1pxGrirQUNuiohWPMONw+50CqJ2gmA63sYf4Zp3V4P+koO2DetawHhU+5BbVksABDorGaXEIx44RqLfmTAJB4kYiuXeU5/XD+SfYqvaZ0A/P/iSvxkrDXnLb6X5xh8Iatk87QJCAX7z5MYym7Q6yssJX3wuMqOsP0LSdROHyoGfnne2k15bhgamQMAODlJi0Yn5ah+6+Mdx9yP67BlV//lDqQS40lIQLOAumA3wQdbpMDrMgfzIu1TGlAEuGPQuWvSG8YuF0h+uLYAOEhE0e8HpzVqA4pPubW2ac4w0EFfIsArqfUIwgODBp6uKbSIQfsuOBHr/7J/er8FhedgBQFO8LJ/2Zp/n9pnAZ8AwL87urjpEfV1XXO/l/oPdGcCZP3BAzECLwSarzZAKLF7bozyNubG/ggA6x3aPYq2V/WFnmVgurp2KASllvipdfLCNQIAgRXaVpC/6WIxaEJgX1ugN6D9vLyMPmiUl2iDrPUF9rld2K8dWrzTkgZwLb4zJ1CfDtcQFUKR3iopMQkBwruFYTpwrSVOQaHzoifeo2tG/kUCqO6xfxUBtIT/QZ4gt6+Jwn6zMU3nDb5FpbGjXLivVxUPKF3TIRpofRMJEIAZDIDTqSr57FArd0k8Dg6BoPGOzQb2N1UP+yEx6BozFO7nmMlC4d1uUXSBDcdSocsFBC7OwIatQn3Br3EQAwLz+tKrcNAV/iYAtqR9lcJw1xQx3xLA0A+6nQW7GPlgAYN1XdrNHiL3BKxVif+jfmgOBKB1YPB9YQh16BXL0gDQtqgWnagHAqwECcD1BRvhxgZ53ptyIfqheNAvGWBz4qw3ZmuzIwJQB4DYk5mH9ncWAtWLQZRMU1QFRdKgULsUYWht6HD1CGArITBWzC6wrtpBohhIDfWeI0b6UFMKAkQGexjGr36UNvwQZizYtbabUSLdNynXRkePAOvoZ75hxf5oNO3BqR3LN3Dn6EA1PVI5SqUI8EPbTVpok4g3xTqZIRDD0hfG0REIEUDraAYMgIAGukNJrtgyf+jClKIV+2adAfbwAeGJ0CQWrHscYNpx+AUCJN3vrdZz2/9gMoPCdisdGn5mZz6srOnrKJ4Cg6QQg4Avr1WjxuHByIFzAnAlwMYWYJCrRb9F+BVKlVao2cqaDkZcCP0NA8Mocz0OzZyhYj538UB7B7CHDS3WoAh2VRZHv222hsmw0isrB330qwZOmAAE6gaF5KKhkWgCwPMnABsCrBBLQVpl3a/mS+WXQGa6IZikYctdAgH2SSGJCS0uUClcP2fAFwuARdSwlqrV3HgCiCWGYyi2cZB0dUi/tiGwtCB9pm0RCNdHHwBgI55QP5BvfXB2bmVszt6kYiAQRoD9BpXKBdauSRTRzY8AZqwtjUPFUKGyc6x9jvfNfoX9e+WPCJGLOTHR9gwhJRT6GwoC0E4PgVriVAB8x3KM6LGhmiLs5+btzXgzL2pdRwAIdEkAdXMr0fPdKVMSIUrN1uy06ld7lvxcEgjAwlnM50iLwF/Tw6yzQECbULvmHkFNr4ZMZGAZikDoy5Lhs5mu3+d2BdkKFF1xATwQU1461M38EwP1BiD2jzj4oXx3kGhzuxCoRmJNc3SUXiM5xtp3oETfAUSF9nIEehYIOjnG5wghxXUjBGIrCFI5ZMDv1dcAEkQitRHfCAQB9ncUsOZzltwMoMkAxlFuWXy/BpgSkPEeEAuW/D1n0Mmaa5kxqugCtvDeIWno4hsCu1uJ6OLogXj+advZVS0OYsZOAOQpakMkEAEwbWiIdCNQrBWTg3giIAq1mdPiIBRuI2kfO0xK45N20qMDTj13I/Qkk+mBYpMVagfRIMWDF1KBlmAiQIkQ7dmBbgTq7otdTjI7nBAFQKLxwc1kkJLeWifX2yVCdFoomnwLrAYCUYeJQleZGDFiiXZDLu9liDBZIQ6gPec8NXXBYD8DjATyAZEAC466CjNALtfyny1QtHNdBICjRDjxqPGAseuGOxE1EIiJOrkGuMIFiA51RUZU1sa923ThlnUTgL7HiSKlcXdrf5hN04bsrUIC8DzTPJWHUE5uCMeZrhcnoLqzEKFI8kJxch+i4gc2Re4D0yBlQtWyF9ZKejIMCMkFqBQE6P+AuwJPMDu2U/083hmpcZ7IaZwvrSU9Ob8CizcI/eSmMxbwCNCzlMIJtUpn45tPQpSIfcydbLzGgAdwjAm8OXkWAqpUE4VyC7WhKEzoCaBVPt23N7ctYwgBoNPpMyt4QJpyKR9E8TIuwNBWrHsfyyKj1AY0n2OlAzRyciHId8ebEHmo9rV177ljGVXMfuHxOlMeNlXUvCgYmEVxLCqcuzFv5yBNAFws13V6981Dvc5mapjCfXzFrFCeWzU8QxbmN6JgBDsW6MZAK4IdGJxCWRBgFhhHxWuy+zp8V7Bvfs/NRF6hFOwXx9X8aNjw7fJticOnKY9HnJIi2jj1Wv8/X6KFFkccqWDsnsGrei0GAgCYzWbQGq0SbykgLncHgDOOz0sG6RLrbTmcC1CTGm98ALsjZloXHhHUVCHDj2Q687TzNCzWCwFYnjELLb0hlbe3ZZyH+A6ew4BQEAFuHjUafTALOe33VBxHIf8EayvYTggEwAIAD+pnYZAqkxz01Lun64/95TON1EylmOaRGu0WA7Q3u+44HxAgzFsEWJ7PUaJMGQBAeO9CEYJBpC4eEF4Rirn3JSKoik++MwyNwgqA+HX5BkdjrAOWz+/gURVHSQR3UVRy4fCokUqzBLaTSr7ZUaMU3gRY8mMu6NNhzCYXAMWJSM7COJGYjjlS4OyD4909AmJybCQplPCOEaCAZ0vey/vmTIQl75FtukY+FfQBGTBJMFxcH3JNqWnP3cfBEV2qSyE0R2RCF5j2jeSD35495MiXpNyLD0euold1Cwrz19nr8DWXo+WwpMkKgGKkror5n8u0fNOIPDgAhBVrB8y/08XBCwEA8OgMCnPse46Eiv8DwI732vJzBAhEgCEvDGBf7RhLdLW4Hq0DRbDpDK+zBQGdwUUvYO+/8hcATrcrARSc0nnv5yUyTdMRQFLiT3FOFT9kQzyg+B0jAG8P1SztP3KANSs3/4PfkpOPjAyU0HlFBJwyGp/EelvGCFA/eQXCVx7FCSWnoxqdbTbsnz4oVOfzKjXiWY66SDa8xeAbVYIsHSQzb8kd51VUT3kcXKFOZWIQ9b305uLXhIOaF7CavtRhrXlZhJ/VDrsS6kVpKtOIaMkJZbAs2sfOo/dQfwMWZc/FQb52Nz6Yo2rHr3ngfSzsh/nMLRwvsRjeRQMT9PpRsgFo6JhsC0fDplGyAVVVyckCDGr3F+aPSRwp4PySr1mQSbFmnPFA0WOIkPiGt+H1HdsNLBXS3yQujyQQ2EFLDwIyotYXqLQYOczVxN9sq2juyT5CIsT4DqUHAWy5SYaLGDZHgxZRGTRscOtdnIExHhz0IhSjD7K/GcR1v0Cuu0W030cGx7DFsGModTIMMhEAVbogRcQY76h6uc678MbJTXyQsBQirHalKrh/eXlfip2qqiSsEO4Z4JiZxF4GBI5NPCb0CWERkt3sA8wR7nCpcYzAuanmq+GxXuyZY9WJRNAjccoL4XOsSMH3vZw0g5OrrJHDrzHvcA6SWyul6/ixFhQVe5ABDCpKVAwUMoA5Sg40Mt/1tdxI1lpUihz+BnFTDzRek8fiAAAAAElFTkSuQmCC"; // 站点 logo（内嵌 base64）

// --- 订阅转换配置文件 (支持环境变量覆盖) ---
const CLASH_CONFIG = 'htt'+'ps://raw.git'+'hub'+'usercontent.com/cm'+'liu/ACL4'+'SSR/main/Cl'+'ash/config/ACL4SSR_Online_Full_MultiMode.ini'; //修改转换订阅配置文件ini
const SINGBOX_CONFIG_V12 = 'htt'+'ps://raw.git'+'hub'+'usercontent.com/sinspired/su'+'b-st'+'ore-template/main/1.12.x/si'+'ng-b'+'ox.json'; //修改singbox的json配置，默认使用1.11，如果无法使用才会切换1.12
const SINGBOX_CONFIG_V11 = 'htt'+'ps://raw.git'+'hub'+'usercontent.com/sinspired/su'+'b-st'+'ore-template/main/1.11.x/si'+'ng-b'+'ox.json'; //修改singbox的json配置，默认使用这个，如果无法使用才会切换1.12

// --- 通知与高级参数 ---
const TG_BOT_TOKEN = ""; //在此telegram bot的token令牌
const TG_CHAT_ID = ""; //在此修改添加你的telegram 用户id
const ADMIN_IP = ""; //在此修改添加你的白名单IP
const DLS = "7"; // ADDCSV 专用：速度下限筛选阈值 (单位 MB/s)

// =============================================================================
// 🟢 超神奇
const P_V = 'vl'+'ess';
const P_S = 'so'+'cks';
const P_S5 = 'so'+'cks5';

// ECH + 指纹伪装配置
let ECH = true;  // ECH 开关 (支持环境变量覆盖)
let ECH_DNS = 'https://odvr.nic.cz/doh';
let ECH_SNI = 'cloudflare-ech.com';
let FP = ECH ? 'firefox' : 'randomized';

// ECH Config 动态获取 (二进制 DoH wire format)
async function _getECH() {
  if (!ECH) return null;
  try {
    const parts = ECH_SNI.split('.');
    const qname = [];
    for (const p of parts) { qname.push(p.length, ...new TextEncoder().encode(p)); }
    qname.push(0);
    const hdr = new Uint8Array([0x00,0x01,0x01,0x00,0x00,0x01,0x00,0x00,0x00,0x00,0x00,0x00]);
    const qtype = new Uint8Array([0x00,0x41]);
    const qclass = new Uint8Array([0x00,0x01]);
    const query = new Uint8Array([...hdr, ...qname, ...qtype, ...qclass]);
    const res = await fetch(ECH_DNS, {
      method: 'POST',
      headers: { 'content-type': 'appli'+'cation/'+'dns-m'+'essage', 'accept': 'appli'+'cation/'+'dns-m'+'essage' },
      body: query
    });
    if (!res.ok) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    let offset = 12;
    const ancount = (buf[6] << 8) | buf[7];
    while (buf[offset] !== 0) { if ((buf[offset] & 0xc0) === 0xc0) { offset += 2; break; } offset += buf[offset] + 1; }
    if (buf[offset] === 0) offset++;
    offset += 4;
    for (let i = 0; i < ancount; i++) {
      if ((buf[offset] & 0xc0) === 0xc0) offset += 2;
      else { while (buf[offset] !== 0) offset += buf[offset] + 1; offset++; }
      const rtype = (buf[offset] << 8) | buf[offset + 1]; offset += 2;
      offset += 2; offset += 4;
      const rdlen = (buf[offset] << 8) | buf[offset + 1]; offset += 2;
      if (rtype === 65) {
        const rdataEnd = offset + rdlen;
        offset += 2;
        if (buf[offset] === 0) offset++;
        else if ((buf[offset] & 0xc0) === 0xc0) offset += 2;
        else { while (buf[offset] !== 0) offset += buf[offset] + 1; offset++; }
        while (offset < rdataEnd) {
          const key = (buf[offset] << 8) | buf[offset + 1]; offset += 2;
          const vlen = (buf[offset] << 8) | buf[offset + 1]; offset += 2;
          if (key === 5) {
            const echRaw = buf.slice(offset, offset + vlen);
            const b64 = btoa(String.fromCharCode(...echRaw));
            return '-----BEGIN ECH CONFIGS-----\n' + b64 + '\n-----END ECH CONFIGS-----';
          }
          offset += vlen;
        }
      } else { offset += rdlen; }
    }
    return null;
  } catch (e) { return null; }
}

// SB ECH 注入
async function pSB(text, uuid) {
  if (!ECH) return text;
  try {
    const cfg = JSON.parse(text);
    const echPem = await _getECH();
    if (!echPem) return text;
    const OB = 'out'+'bou'+'nds';
    if (cfg[OB]) {
      for (const node of cfg[OB]) {
        if (!node.tls) continue;
        // UUID 过滤：只对自己的节点注入 ECH
        if (uuid && node.uuid && node.uuid !== uuid && !(node['pass'+'word'] && node['pass'+'word'] === uuid)) continue;
        node.tls.ech = { enabled: true, config: echPem };
        const UT = 'ut'+'ls';
        if (!node.tls[UT]) node.tls[UT] = {};
        node.tls[UT].enabled = true;
        node.tls[UT]['fing'+'erp'+'rint'] = FP;
      }
    }
    return JSON.stringify(cfg);
  } catch (e) { return text; }
}

// CL双格式 ECH 注入
async function pCL(text, uuid, h) {
  if (!ECH) return text;
  try {
    const _eo='ech'+'-opts',_qsn='query'+'-server'+'-name',_nsp='name'+'server'+'-po'+'licy';
    // 获取 ECH Config base64 用于直接注入
    let _echB64 = '';
    try {
      const _pem = await _getECH();
      if (_pem) {
        const m = _pem.match(/-----BEGIN ECH CONFIGS-----\n(.*)\n-----END ECH CONFIGS-----/);
        if (m) _echB64 = m[1];
      }
    } catch(e) {}
    let y = text;

    // --- 1. DNS 基础配置块（模板字符串，格式与参考 YAML 一致）---
    const baseDnsBlock = 'dns:\n  enable: true\n  default-nameserver:\n    - 223.5.5.5\n    - 119.29.29.29\n    - 114.114.114.114\n  use-hosts: true\n  nameserver:\n    - https://sm2.doh.pub/dns-query\n    - https://dns.alidns.com/dns-query\n  fallback:\n    - 8.8.4.4\n    - 208.67.220.220\n  fallback-filter:\n    geoip: true\n    geoip-code: CN\n    ipcidr:\n      - 240.0.0.0/4\n      - 127.0.0.1/32\n      - 0.0.0.0/32\n    domain:\n      - \'+.google.com\'\n      - \'+.facebook.com\'\n      - \'+.youtube.com\'\n';
    const hasDns = /^dns:\s*(?:\n|$)/m.test(y);
    if (!hasDns) y = baseDnsBlock + y;

    // --- 2. nameserver-policy 注入（双域名+双DoH）---
    const _bkDoH='https://do'+'h.cm.edu.kg/'+'C'+'ML'+'iu'+'ssss';
    const ne='    "'+h+'":\n      - '+ECH_DNS+'\n      - '+_bkDoH+'\n    "'+ECH_SNI+'":\n      - '+ECH_DNS+'\n      - '+_bkDoH;
    const hasNsp = /^\s{2}nameserver-policy:\s*(?:\n|$)/m.test(y);
    if (hasNsp) {
      y = y.replace(/^(\s{2}nameserver-policy:\s*\n)/m, '$1' + ne + '\n');
    } else {
      const ls = y.split('\n');
      let di = -1, iD = false;
      for (let i = 0; i < ls.length; i++) {
        if (/^dns:\s*$/.test(ls[i])) { iD = true; continue; }
        if (iD && /^[a-zA-Z]/.test(ls[i])) { di = i; break; }
      }
      const nspBlock = '  ' + _nsp + ':\n' + ne;
      if (di > 0) { ls.splice(di, 0, nspBlock); y = ls.join('\n'); }
      else { y += '\n' + nspBlock + '\n'; }
    }

    // --- 3. 节点 ech-opts 注入（Flow + Block 双格式）---
    const L=y.split('\n'),R=[];let i=0;
    while(i<L.length){const l=L[i],tl=l.trim();
      if(tl.startsWith('- {')&&tl.includes('uuid:')){
        let fn=l,bc=(l.match(/\{/g)||[]).length-(l.match(/\}/g)||[]).length;
        while(bc>0&&i+1<L.length){i++;fn+='\n'+L[i];bc+=(L[i].match(/\{/g)||[]).length-(L[i].match(/\}/g)||[]).length;}
        const um=fn.match(/uuid:\s*([^,}\n]+)/);
        if(um&&um[1].trim()===uuid.trim()){
          fn=fn.replace(/client-fingerprint:\s*[^,}\s]+/,'client-fingerprint: firefox');
          fn=fn.replace(/\}(\s*)$/,`, ${_eo}: {enable: true, ${_qsn}: ${ECH_SNI}${_echB64 ? ', config: ' + _echB64 : ''}}}$1`);
        }
        R.push(fn);i++;
      }else if(tl.startsWith('- name:')){
        let nl=[l];const bi=l.search(/\S/);i++;
        while(i<L.length){const nx=L[i],nt=nx.trim();
          if(!nt){nl.push(nx);i++;break;}
          if(nx.search(/\S/)<=bi&&nt.startsWith('- '))break;
          if(nx.search(/\S/)<bi&&nt)break;
          nl.push(nx);i++;}
        const um=nl.join('\n').match(/uuid:\s*([^\n]+)/);
        if(um&&um[1].trim()===uuid.trim()){
          for(let j=0;j<nl.length;j++){if(/client-fingerprint:/.test(nl[j])){nl[j]=nl[j].replace(/client-fingerprint:\s*\S+/,'client-fingerprint: firefox');break;}}
          let ii=-1;for(let j=nl.length-1;j>=0;j--)if(nl[j].trim()){ii=j;break;}
          if(ii>=0){const ind=' '.repeat(bi+2);const echLines=[ind+_eo+':',ind+'  enable: true',ind+'  '+_qsn+': '+ECH_SNI];if(_echB64){echLines.push(ind+'  config: '+_echB64);}nl.splice(ii+1,0,...echLines);}}
        R.push(...nl);
      }else{R.push(l);i++;}}
    return R.join('\n');
  } catch (e) { return text; }
}

// =============================================================================
// 🧠 GrainTCP 代理内核
// =============================================================================
const CFG = { id: '2523c510-9ff0-415b-9582-93949bfae7e3', chunk: 64 * 1024, dnPack: 32 * 1024, dnTail: 512, dnMs: 0, upPack: 16 * 1024, upQMax: 256 * 1024, maxED: 8 * 1024, concur: 4, autoConcur: true };

/* ---------- 部署环境自动识别 ----------
 * Snippets:   fetch(request)         → env === undefined → concur 强制 1
 * Workers:    fetch(request, env, ctx) → env 是对象 → 默认 4，可由 env.CONCUR 覆盖
 * Pages:      同 Workers
 *
 * 配置方式：
 *   - 默认值 concur=4（Workers/Pages 推荐）
 *   - Snippets 环境自动降到 1（CPU 预算和连接配额限制）
 *   - Workers 环境想改 concur，在 dashboard 加环境变量 CONCUR=2 或 CONCUR=8
 *   - 把 CFG.autoConcur 设为 false 可完全关闭自动识别，手动控制
 */
const detectRuntime = (() => {
  let done = false;
  return env => {
    if (done || !CFG.autoConcur) return;
    done = true;
    if (typeof env === 'undefined') {
      CFG.concur = 1;
      return;
    }
    const v = env && env.CONCUR;
    if (v !== undefined && v !== null && v !== '') {
      const n = parseInt(v, 10);
      if (Number.isFinite(n) && n >= 1 && n <= 16) CFG.concur = n;
    }
  };
})();

const hex = c => (c > 64 ? c + 9 : c) & 0xF;
const dec = new TextDecoder();
let idB = new Uint8Array(16);
let I0,I1,I2,I3,I4,I5,I6,I7,I8,I9,I10,I11,I12,I13,I14,I15;

function setUUID(uuid) {
  CFG.id = uuid;
  for (let i = 0, p = 0, c, h; i < 16; i++) {
    c = uuid.charCodeAt(p++); c === 45 && (c = uuid.charCodeAt(p++)); h = hex(c);
    c = uuid.charCodeAt(p++); c === 45 && (c = uuid.charCodeAt(p++));
    idB[i] = h << 4 | hex(c);
  }
  [I0,I1,I2,I3,I4,I5,I6,I7,I8,I9,I10,I11,I12,I13,I14,I15] = idB;
}
setUUID(CFG.id);

const matchID = c => c[1] === I0 && c[2] === I1 && c[3] === I2 && c[4] === I3 && c[5] === I4 && c[6] === I5 && c[7] === I6 && c[8] === I7 && c[9] === I8 && c[10] === I9 && c[11] === I10 && c[12] === I11 && c[13] === I12 && c[14] === I13 && c[15] === I14 && c[16] === I15;

const addr = (t, b) => t === 1
  ? `${b[0]}.${b[1]}.${b[2]}.${b[3]}`
  : t === 3
    ? dec.decode(b)
    : `[${Array.from({ length: 8 }, (_, i) => ((b[i * 2] << 8) | b[i * 2 + 1]).toString(16)).join(':')}]`;

const parseAddr = (b, o, t) => {
  const l = t === 3 ? b[o++] : t === 1 ? 4 : t === 4 ? 16 : null;
  if (l === null) return null;
  const n = o + l;
  return n > b.length ? null : { targetAddrBytes: b.subarray(o, n), dataOffset: n };
};

const parseVP = c => {
  if (c.length < 24 || !matchID(c)) return null;
  let o = 19 + c[17];
  const p = (c[o] << 8) | c[o + 1];
  let t = c[o + 2];
  if (t !== 1) t += 1;
  const a = parseAddr(c, o + 3, t);
  return a ? { addrType: t, ...a, port: p } : null;
};

/* ---------- IPv6 格式化工具 ---------- */
const stripIPv6Brackets = host => host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host;
const isIPv6Host = host => stripIPv6Brackets(host).includes(':');
const formatHostForUrl = host => isIPv6Host(host) ? `[${stripIPv6Brackets(host)}]` : stripIPv6Brackets(host);

/* ---------- 地址/端口解析（IPv6 兼容） ---------- */
const parseAddressPort = (seg) => {
  const raw = (seg || '').trim();
  if (!raw) return ['', 443];
  if (raw.startsWith('[')) {
    const m = raw.match(/^\[([^\]]+)\](?::(\d+))?$/);
    if (m) return [m[1], Number(m[2] || 443)];
    return [stripIPv6Brackets(raw), 443];
  }
  const colonCount = (raw.match(/:/g) || []).length;
  if (colonCount > 1) return [raw, 443];
  const idx = raw.lastIndexOf(':');
  if (idx > -1) {
    const addr = raw.slice(0, idx);
    const portText = raw.slice(idx + 1);
    if (/^\d+$/.test(portText)) return [addr, Number(portText)];
  }
  return [raw, 443];
};

/* ---------- SOCKS5 / HTTP 凭证解析 ---------- */
const addrParser = (raw) => {
  let username, password, hostname, port;

  if (raw.includes('://') && !raw.match(/^(socks5?|https?):\/\//i)) {
    const u = new URL(raw);
    hostname = u.hostname;
    port = u.port || (u.protocol === 'http:' ? 80 : 1080);
    const auth = u.username || u.password ? `${u.username}:${u.password}` : u.username;
    if (auth && auth.includes(':')) [username, password] = auth.split(':');
    else if (auth) {
      try {
        const decd = atob(auth.replace(/%3D/g, '=').padEnd(auth.length + (4 - auth.length % 4) % 4, '='));
        const p = decd.split(':');
        if (p.length === 2) [username, password] = p;
      } catch {}
    }
  } else {
    let authPart = '', hostPart = raw;
    const at = raw.lastIndexOf('@');
    if (at !== -1) { authPart = raw.substring(0, at); hostPart = raw.substring(at + 1); }

    if (authPart && !authPart.includes(':')) {
      try {
        const decd = atob(authPart.replace(/%3D/g, '=').padEnd(authPart.length + (4 - authPart.length % 4) % 4, '='));
        const p = decd.split(':');
        if (p.length === 2) [username, password] = p;
      } catch {}
    }
    if (!username && authPart && authPart.includes(':')) [username, password] = authPart.split(':');

    const [h, p] = parseAddressPort(hostPart);
    hostname = h;
    port = p || (raw.includes('http=') ? 80 : 1080);
  }

  if (!hostname || isNaN(port)) throw new Error('Invalid config');
  return { username, password, hostname, port };
};

/* ---------- SOCKS5 握手（通过 fetcher.connect） ---------- */
async function s5Conn(fetcher, addressType, addressRemote, portRemote, cfg) {
  const { username, password, hostname, port } = cfg;
  const socket = fetcher.connect({ hostname, port });
  if (socket.opened) await socket.opened;
  const writer = socket.writable.getWriter();
  await writer.write(new Uint8Array([5, username ? 2 : 1, 0, username ? 2 : 0]));
  const reader = socket.readable.getReader();
  const enc = new TextEncoder();
  let resp = (await reader.read()).value;
  if (resp[1] === 2) {
    const auth = new Uint8Array([1, username.length, ...enc.encode(username), password.length, ...enc.encode(password)]);
    await writer.write(auth);
    resp = (await reader.read()).value;
    if (resp[1] !== 0) throw new Error('S5 auth failed');
  }
  let DST;
  if (addressType === 1) DST = new Uint8Array([1, ...addressRemote.split('.').map(Number)]);
  else if (addressType === 2) DST = new Uint8Array([3, addressRemote.length, ...enc.encode(addressRemote)]);
  else if (addressType === 3) {
    const raw = addressRemote.startsWith('[') ? addressRemote.slice(1, -1) : addressRemote;
    const bytes = raw.split(':').flatMap(h => {
      const hh = h.padStart(4, '0');
      return [parseInt(hh.slice(0, 2), 16), parseInt(hh.slice(2, 4), 16)];
    });
    DST = new Uint8Array([4, ...bytes]);
  }
  else if (addressType === 4) {
    const raw = addressRemote.startsWith('[') ? addressRemote.slice(1, -1) : addressRemote;
    const bytes = raw.split(':').flatMap(h => {
      const hh = h.padStart(4, '0');
      return [parseInt(hh.slice(0, 2), 16), parseInt(hh.slice(2, 4), 16)];
    });
    DST = new Uint8Array([4, ...bytes]);
  }
  await writer.write(new Uint8Array([5, 1, 0, ...DST, (portRemote >> 8) & 0xff, portRemote & 0xff]));
  resp = (await reader.read()).value;
  if (resp[1] !== 0) throw new Error('S5 conn failed');
  writer.releaseLock();
  reader.releaseLock();
  return socket;
}

/* ---------- HTTP CONNECT 握手（通过 fetcher.connect） ---------- */
async function htConn(fetcher, addressType, addressRemote, portRemote, cfg) {
  const { username, password, hostname, port } = cfg;
  const sock = fetcher.connect({ hostname, port });
  if (sock.opened) await sock.opened;

  let req = `CONNECT ${addressRemote}:${portRemote} HTTP/1.1\r\n` +
            `Host: ${addressRemote}:${portRemote}\r\n`;

  if (username && password) {
    req += `Proxy-Authorization: Basic ${btoa(`${username}:${password}`)}\r\n`;
  }

  req += `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36\r\n` +
         `Connection: keep-alive\r\n\r\n`;

  const writer = sock.writable.getWriter();
  await writer.write(new TextEncoder().encode(req));
  writer.releaseLock();

  const reader = sock.readable.getReader();
  let buf = new Uint8Array(0);

  while (true) {
    const { value, done } = await reader.read();
    if (done) throw new Error('Proxy closed unexpectedly');

    const tmp = new Uint8Array(buf.length + value.length);
    tmp.set(buf);
    tmp.set(value, buf.length);
    buf = tmp;
    if (buf.length > 65536) throw new Error('Proxy response too large');
    const txt = new TextDecoder().decode(buf);
    if (txt.includes('\r\n\r\n')) {
      if (/^HTTP\/1\.[01] 2/i.test(txt.split('\r\n')[0])) {
        reader.releaseLock();
        return sock;
      }
      throw new Error(`Proxy refused: ${txt.split('\r\n')[0]}`);
    }
  }
}

/* ---------- URL 路由解析：路径快捷方式 + 查询参数 ---------- */
function pCfg(url, path) {
  let pIP = null, s5 = null, enS = null, gP = null, order = null;

  // 1a. 全局代理 socks5://... 或 http://... 或 turn://... 或 turns://...
  const turnMatch = path.match(/turns?:\/\/([^/#?]+)/i);
  if (turnMatch) {
    const turnCfg = getTurn('/' + path);
    if (turnCfg) {
      gP = { type: 'turn', cfg: turnCfg };
      order = ['gP'];
      return { pIP, s5, enS, gP, order };
    }
  }
  const globalMatch = path.match(/(socks5?|https?):\/\/([^/#?]+)/i);
  if (globalMatch) {
    const cfg = addrParser(globalMatch[2]);
    gP = {
      type: globalMatch[1].toLowerCase().includes('5') || globalMatch[1].toLowerCase() === 'socks' ? 'socks5' : 'http',
      cfg
    };
    order = ['gP'];
    return { pIP, s5, enS, gP, order };
  }

  // 1b. /proxyip= → 强制 direct, proxy
  const pxRe = /^proxyip=(.+)/i;
  if (pxRe.test(path)) {
    const seg = path.match(pxRe)[1];
    const [a, p = 443] = parseAddressPort(seg);
    pIP = { address: a.includes('[') ? a.slice(1, -1) : a, port: +p };
    order = ['direct', 'proxy'];
    return { pIP, s5, enS, gP, order };
  }

  // 1c. /s5= 或 /socks5= 或 /socks= → 强制 direct, s5
  const s5PathRe = /^(socks5?|s5)=(.+)/i;
  if (s5PathRe.test(path)) {
    const m = path.match(s5PathRe);
    s5 = addrParser(m[2]);
    enS = 'socks5';
    order = ['direct', 's5'];
    return { pIP, s5, enS, gP, order };
  }

  // 1d. /http= → 强制 direct, http
  if (path.match(/^http=(.+)/i)) {
    const seg = path.match(/^http=(.+)/i)[1];
    s5 = addrParser(seg);
    enS = 'http';
    order = ['direct', 's5'];
    return { pIP, s5, enS, gP, order };
  }

  // 路径任意位置的 /ip= /proxyip=
  const ipMatch = path.match(/(?:^|\/)(?:proxy)?ip[=\/]([^?#]+)/i);
  if (ipMatch) {
    const seg = ipMatch[1];
    const [a, p = 443] = parseAddressPort(seg);
    pIP = { address: a.includes('[') ? a.slice(1, -1) : a, port: +p };
  }

  // 路径任意位置的 /s5= /socks5= /http=
  const localMatch = path.match(/(?:^|\/)(socks5?|s5|http)[=\/]([^/#?]+)/i);
  if (localMatch) {
    s5 = addrParser(localMatch[2]);
    enS = localMatch[1].toLowerCase().includes('http') ? 'http' : 'socks5';
  }

  // 2. 查询参数
  const s5Param = url.searchParams.get('s5');
  const pxParam = url.searchParams.get('proxyip');

  if (s5Param && !s5) {
    s5 = addrParser(s5Param);
    enS = 'socks5';
  }
  if (pxParam && !pIP) {
    const [a, p = 443] = parseAddressPort(pxParam);
    pIP = { address: a.includes('[') ? a.slice(1, -1) : a, port: +p };
  }

  // 3. 连接顺序
  if (!order) {
    const mode = url.searchParams.get('mode') || 'auto';
    if (mode === 'proxy') { order = ['direct', 'proxy']; }
    else if (mode !== 'auto') { order = [mode]; }
    else {
      order = [];
      const searchStr = url.search.slice(1);
      for (const pair of searchStr.split('&')) {
        const key = pair.split('=')[0];
        if (key === 'direct') order.push('direct');
        else if (key === 's5') order.push('s5');
        else if (key === 'proxyip') order.push('proxy');
      }
      if (order.includes('s5') && !order.includes('direct')) order.unshift('direct');
      if (order.includes('proxy') && !order.includes('direct')) order.unshift('direct');
      if (!order.length) order = ['direct', 's5', 'proxy'];
    }
  }

  return { pIP, s5, enS, gP, order };
}

/* ---------- TURN 协议支持（TCP 中继） ---------- */
const _enc = s => new TextEncoder().encode(s);
const _u16 = (b, o = 0) => (b[o] << 8) | b[o + 1];
const _pad4 = n => -n & 3;
const _MAGIC = new Uint8Array([0x21, 0x12, 0xA4, 0x42]);
const _MT = { AQ: 0x003, AO: 0x103, AE: 0x113, PQ: 0x008, PO: 0x108, CQ: 0x00A, CO: 0x10A, BQ: 0x00B, BO: 0x10B };
const _AT = { USER: 0x006, MI: 0x008, ERR: 0x009, PEER: 0x012, REALM: 0x014, NONCE: 0x015, TRANSPORT: 0x019, CONNID: 0x02A };
const _cat = (...a) => { const r = new Uint8Array(a.reduce((s, x) => s + x.length, 0)); a.reduce((o, x) => (r.set(x, o), o + x.length), 0); return r; };
const _tid = () => crypto.getRandomValues(new Uint8Array(12));
const _stunAttr = (t, v) => { const b = new Uint8Array(4 + v.length + _pad4(v.length)), d = new DataView(b.buffer); d.setUint16(0, t); d.setUint16(2, v.length); b.set(v, 4); return b; };
const _stunMsg = (t, id, a) => { const bd = _cat(...a), h = new Uint8Array(20), d = new DataView(h.buffer); d.setUint16(0, t); d.setUint16(2, bd.length); h.set(_MAGIC, 4); h.set(id, 8); return _cat(h, bd); };
const _xorPeer = (ip, port) => { const b = new Uint8Array(8); b[1] = 1; new DataView(b.buffer).setUint16(2, port ^ 0x2112); ip.split('.').forEach((v, i) => b[4 + i] = +v ^ _MAGIC[i]); return b; };
const _parseStun = d => {
  if (d.length < 20 || _MAGIC.some((v, i) => d[4 + i] !== v)) return null;
  const dv = new DataView(d.buffer, d.byteOffset, d.byteLength), ml = dv.getUint16(2), attrs = {};
  for (let o = 20; o + 4 <= 20 + ml; ) { const t = dv.getUint16(o), l = dv.getUint16(o + 2); if (o + 4 + l > d.length) break; attrs[t] = d.slice(o + 4, o + 4 + l); o += 4 + l + _pad4(l); }
  return { type: dv.getUint16(0), attrs };
};
const _parseErr = d => d?.length >= 4 ? (d[2] & 7) * 100 + d[3] : 0;
const _addIntegrity = async (m, key) => { const c = new Uint8Array(m), d = new DataView(c.buffer); d.setUint16(2, d.getUint16(2) + 24); const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']); return _cat(c, _stunAttr(_AT.MI, new Uint8Array(await crypto.subtle.sign('HMAC', k, c)))); };
const _readStun = async (rd, buf) => {
  let b = buf ?? new Uint8Array(0); const pull = async () => { const { done, value } = await rd.read(); if (done) throw 0; b = _cat(b, new Uint8Array(value)); };
  try { while (b.length < 20) await pull(); const n = 20 + _u16(b, 2); while (b.length < n) await pull();
    return [_parseStun(b.subarray(0, n)), b.length > n ? b.subarray(n) : null]; } catch { return [null, null]; }
};
const _resolveIP = async h => /^\d+\.\d+\.\d+\.\d+$/.test(h) ? h : (await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(h)}&type=A`, { headers: { Accept: 'application/dns-json' } }).then(r => r.json()).catch(() => ({}))).Answer?.find(a => a.type === 1)?.data ?? null;
const _md5 = async s => new Uint8Array(await crypto.subtle.digest('MD5', _enc(s)));
const getTurn = url => { const m = decodeURIComponent(url).match(/\/turns?:\/\/([^?&#\s]*)/i); if (!m) return null; const t = m[1], at = t.lastIndexOf('@'), cred = at >= 0 ? t.slice(0, at) : '', hp = t.slice(at + 1), [host, p] = hp.split(':'), ci = cred.indexOf(':'); return p ? { host, port: +p, user: ci >= 0 ? cred.slice(0, ci) : '', pass: ci >= 0 ? cred.slice(ci + 1) : '' } : null; };

async function turnConn(fetcher, { host, port, user, pass }, targetIp, targetPort) {
  let ctrl = null, data = null;
  const close = () => { try { ctrl?.close(); } catch {} try { data?.close(); } catch {} };
  try {
    ctrl = fetcher.connect({ hostname: host, port }); if (ctrl.opened) await ctrl.opened;
    const cw = ctrl.writable.getWriter(), cr = ctrl.readable.getReader();
    const tp = new Uint8Array([6, 0, 0, 0]);
    await cw.write(_stunMsg(_MT.AQ, _tid(), [_stunAttr(_AT.TRANSPORT, tp)]));
    let [r, ex] = await _readStun(cr); if (!r) { close(); return null; }
    let key = null, aa = [];
    const sign = m => key ? _addIntegrity(m, key) : Promise.resolve(m);
    const peer = _stunAttr(_AT.PEER, _xorPeer(targetIp, targetPort));
    if (r.type === _MT.AE && user && _parseErr(r.attrs[_AT.ERR]) === 401) {
      const realm = dec.decode(r.attrs[_AT.REALM] ?? new Uint8Array(0)), nonce = r.attrs[_AT.NONCE] ?? new Uint8Array(0);
      key = await _md5(`${user}:${realm}:${pass}`);
      aa = [_stunAttr(_AT.USER, _enc(user)), _stunAttr(_AT.REALM, _enc(realm)), _stunAttr(_AT.NONCE, nonce)];
      const [am, pm, cm] = await Promise.all([sign(_stunMsg(_MT.AQ, _tid(), [_stunAttr(_AT.TRANSPORT, tp), ...aa])), sign(_stunMsg(_MT.PQ, _tid(), [peer, ...aa])), sign(_stunMsg(_MT.CQ, _tid(), [peer, ...aa]))]);
      await cw.write(_cat(am, pm, cm)); data = fetcher.connect({ hostname: host, port });
      [r, ex] = await _readStun(cr, ex); if (r?.type !== _MT.AO) { close(); return null; }
    } else if (r.type === _MT.AO) {
      const [pm, cm] = await Promise.all([sign(_stunMsg(_MT.PQ, _tid(), [peer, ...aa])), sign(_stunMsg(_MT.CQ, _tid(), [peer, ...aa]))]);
      await cw.write(_cat(pm, cm)); data = fetcher.connect({ hostname: host, port });
    } else { close(); return null; }
    [r, ex] = await _readStun(cr, ex); if (r?.type !== _MT.PO) { close(); return null; }
    [r, ex] = await _readStun(cr, ex); if (r?.type !== _MT.CO || !r.attrs[_AT.CONNID]) { close(); return null; }
    if (data.opened) await data.opened;
    const dw = data.writable.getWriter(), dr = data.readable.getReader();
    await dw.write(await sign(_stunMsg(_MT.BQ, _tid(), [_stunAttr(_AT.CONNID, r.attrs[_AT.CONNID]), ...aa])));
    let extra; [r, extra] = await _readStun(dr); if (r?.type !== _MT.BO) { close(); return null; }
    cr.releaseLock(); cw.releaseLock(); dw.releaseLock();
    const readable = new ReadableStream({ start: c => extra?.length && c.enqueue(extra), pull: c => dr.read().then(({ done, value }) => done ? c.close() : c.enqueue(new Uint8Array(value))), cancel: () => dr.cancel() });
    return { readable, writable: data.writable, close };
  } catch { close(); return null; }
}

/* ---------- GrainTCP 原生建连：单路 + 4 路竞速 ---------- */
const sprout = (f, h, p, s = f.connect({ hostname: h, port: p })) => s.opened.then(() => s);

const raceSprout = (f, h, p) => {
  if (!f?.connect) return Promise.reject(new Error('connect unavailable'));
  if (CFG.concur <= 1) return sprout(f, h, p);
  const ts = Array(CFG.concur).fill().map(() => sprout(f, h, p));
  return Promise.any(ts).then(w => {
    ts.forEach(t => t.then(s => s !== w && s.close(), () => {}));
    return w;
  });
};

/* ---------- 按 order 回落建连 ---------- */
const tryCon = async (fetcher, addrType, host, port, routeCfg) => {
  const { pIP, s5, enS, gP, order } = routeCfg;

  // 全局代理优先（不 fallback）
  if (gP) {
    if (gP.type === 'socks5') return s5Conn(fetcher, addrType, host, port, gP.cfg);
    if (gP.type === 'http')   return htConn(fetcher, addrType, host, port, gP.cfg);
    if (gP.type === 'turn') {
      const ip = addrType === 1 ? host : await _resolveIP(host);
      if (!ip) throw new Error('TURN: DNS resolve failed');
      const tc = await turnConn(fetcher, gP.cfg, ip, port);
      if (!tc) throw new Error('TURN: connection failed');
      return tc;
    }
  }

  let lastErr = null;
  for (const method of order) {
    try {
      if (method === 'direct') {
        // direct 走 raceSprout 4 路并发竞速
        return await raceSprout(fetcher, host, port);
      } else if (method === 's5' && s5) {
        return enS === 'http'
          ? await htConn(fetcher, addrType, host, port, s5)
          : await s5Conn(fetcher, addrType, host, port, s5);
      } else if (method === 'proxy' && pIP) {
        return await sprout(fetcher, pIP.address, pIP.port);
      }
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('All methods failed');
};

/* ---------- 上行队列（GrainTCP 原生） ---------- */
const mkQ = (cap, qCap = cap, itemsMax = Math.max(1, qCap >> 8)) => {
  let q = [], h = 0, qB = 0, buf = null;
  const trim = () => { h > 32 && h * 2 >= q.length && (q = q.slice(h), h = 0); };
  const take = () => { if (h >= q.length) return null; const d = q[h]; q[h++] = undefined; qB -= d.byteLength; trim(); return d; };
  return {
    get bytes() { return qB; },
    get size() { return q.length - h; },
    get empty() { return h >= q.length; },
    clear() { q = []; h = 0; qB = 0; },
    sow(d) {
      const n = d?.byteLength || 0;
      if (!n) return 1;
      if (qB + n > qCap || q.length - h >= itemsMax) return 0;
      q.push(d); qB += n; return 1;
    },
    bundle(d) {
      d ||= take();
      if (!d || h >= q.length || d.byteLength >= cap) return [d, 0];
      let n = d.byteLength, e = h;
      while (e < q.length) { const x = q[e], nn = n + x.byteLength; if (nn > cap) break; n = nn; e++; }
      if (e === h) return [d, 0];
      const out = buf ||= new Uint8Array(cap);
      out.set(d);
      for (let o = d.byteLength; h < e;) { const x = q[h]; q[h++] = undefined; qB -= x.byteLength; out.set(x, o); o += x.byteLength; }
      trim();
      return [out.subarray(0, n), 1];
    }
  };
};

/* ---------- 下行 microtask 打包器（GrainTCP 原生） ---------- */
const mkDn = w => {
  const cap = CFG.dnPack, tail = CFG.dnTail, low = Math.max(4096, tail << 3);
  let pb = new Uint8Array(cap), p = 0, tp = 0, mq = 0, gen = 0, qk = 0, qr = 0;
  const reap = () => { tp && clearTimeout(tp); tp = 0; mq = 0; if (!p) return; w.send(pb.subarray(0, p).slice()); pb = new Uint8Array(cap); p = 0; qr = 0; };
  const ripen = () => {
    if (tp || mq) return;
    mq = 1; qk = gen;
    queueMicrotask(() => {
      mq = 0;
      if (!p || tp) return;
      if (cap - p < tail) return reap();
      tp = setTimeout(() => {
        tp = 0;
        if (!p) return;
        if (cap - p < tail) return reap();
        if (qr < 2 && (gen !== qk || p < low)) { qr++; qk = gen; return ripen(); }
        reap();
      }, Math.max(CFG.dnMs, 1));
    });
  };
  return {
    send(u) {
      let o = 0, n = u?.byteLength || 0;
      if (!n) return;
      while (o < n) {
        if (!p && n - o >= cap) {
          const m = Math.min(cap, n - o);
          w.send(o || m !== n ? u.subarray(o, o + m) : u);
          o += m;
          continue;
        }
        const m = Math.min(cap - p, n - o);
        pb.set(u.subarray(o, o + m), p);
        p += m; o += m; gen++;
        if (p === cap || cap - p < tail) reap();
        else ripen();
      }
    },
    reap
  };
};

/* ---------- 下行 BYOB 读取（GrainTCP 原生） ---------- */
const mill = async (rd, w) => {
  let r, byob = true;
  try { r = rd.getReader({ mode: 'byob' }); } catch { r = rd.getReader(); byob = false; }
  const tx = mkDn(w);
  let buf = byob ? new ArrayBuffer(CFG.chunk) : null;
  try {
    for (;;) {
      const { done, value: v } = byob ? await r.read(new Uint8Array(buf, 0, CFG.chunk)) : await r.read();
      if (done) break;
      if (!v?.byteLength) continue;
      const u = v instanceof Uint8Array ? v : new Uint8Array(v);
      if (u.byteLength >= (CFG.chunk >> 1)) { tx.reap(); w.send(u); if (byob) buf = new ArrayBuffer(CFG.chunk); }
      else { tx.send(u.slice()); if (byob) buf = v.buffer; }
    }
    tx.reap();
  } catch {}
  finally {
    try { tx.reap(); } catch {}
    try { r.releaseLock(); } catch {}
  }
};

/* ---------- WebSocket 入口 ---------- */
const ws = async req => {
  // URL 编码修复（%3F 被转义进 path 的场景）
  const url = new URL(req.url);
  if (url.pathname.includes('%3F')) {
    const decoded = decodeURIComponent(url.pathname);
    const queryIndex = decoded.indexOf('?');
    if (queryIndex !== -1) {
      url.search = decoded.substring(queryIndex);
      url.pathname = decoded.substring(0, queryIndex);
    }
  }
  const path = url.pathname.slice(1);

  let routeCfg;
  try { routeCfg = pCfg(url, path); }
  catch { return new Response('Invalid proxy config', { status: 400 }); }

  const [client, server] = Object.values(new WebSocketPair());
  server.accept({ allowHalfOpen: true });
  server.binaryType = 'arraybuffer';
  const fetcher = req.fetcher;

  const edStr = req.headers.get('sec-websocket-protocol');
  const ed = edStr && edStr.length <= CFG.maxED * 4 / 3 + 4
    ? /** @type {*} */ (Uint8Array).fromBase64(edStr, { alphabet: 'base64url' })
    : null;

  let curW = null, sock = null, closed = false, busy = false;
  const uq = mkQ(CFG.upPack, CFG.upQMax, CFG.upQMax >> 8);

  const wither = () => {
    if (closed) return;
    closed = true;
    uq.clear();
    try { curW?.releaseLock(); } catch {}
    try { sock?.close(); } catch {}
    try { server.close(); } catch {}
  };

  const toU8 = d => d instanceof Uint8Array ? d : ArrayBuffer.isView(d) ? new Uint8Array(d.buffer, d.byteOffset, d.byteLength) : new Uint8Array(d);
  const sow = d => {
    const u = toU8(d), n = u.byteLength;
    if (!n) return 1;
    if (uq.sow(u)) return 1;
    wither();
    return 0;
  };

  const thresh = async () => {
    if (busy || closed) return;
    busy = true;
    try {
      for (;;) {
        if (closed) break;
        if (!sock) {
          const [d] = uq.bundle();
          if (!d) break;
          const r = parseVP(d);
          if (!r) throw wither();
          server.send(new Uint8Array([d[0], 0]));
          const host = addr(r.addrType, r.targetAddrBytes), port = r.port;
          const payload = d.subarray(r.dataOffset);
          sock = await tryCon(fetcher, r.addrType, host, port, routeCfg);
          if (!sock) throw wither();
          curW = sock.writable.getWriter();
          const [first] = uq.bundle(payload);
          first?.byteLength && await curW.write(first);
          mill(sock.readable, server).finally(() => wither());
          continue;
        }
        const [d] = uq.bundle();
        if (!d) break;
        await curW.write(d);
      }
    } catch { wither(); }
    finally {
      busy = false;
      !uq.empty && !closed && queueMicrotask(thresh);
    }
  };

  if (ed && sow(ed)) thresh();
  server.addEventListener('message', e => { closed || (sow(e.data) && thresh()); });
  server.addEventListener('close', () => wither());
  server.addEventListener('error', () => wither());

  return new Response(null, { status: 101, webSocket: client, headers: { 'Sec-WebSocket-Extensions': '' } });
};

// =============================================================================
// 🗄️ 存储与配置
// =============================================================================
async function getSafeEnv(env, key, fallback) {
    if (env[key] && env[key].trim() !== "") return env[key];
    if (env.DB) { try { const { results } = await env.DB.prepare("SELECT value FROM config WHERE key = ?").bind(key).all(); if (results && results.length > 0 && results[0].value) return results[0].value; } catch(e) {} }
    return fallback;
}
// 背景图 URL 清洗：仅允许 http(s)，去掉可能破坏 CSS 的字符（防注入）
const safeBgUrl = u => { u = (u || '').trim(); if (!/^https?:\/\//i.test(u)) return ''; return u.replace(/["'()<>\\\s;]/g, ''); };
const splitCSV = (value) => (value || '').split(',').map(s => s.trim()).filter(Boolean);
const _throttleMap = new Map();
let _tCnt = 0;
function isThrottled(ip, action, ttlMs = 30000) {
    const key = `${ip}|${action}`;
    const now = Date.now();
    if (_throttleMap.get(key) > now) return true;
    _throttleMap.set(key, now + ttlMs);
    if (++_tCnt >= 100) { _tCnt = 0; for (const [k, v] of _throttleMap) { if (v <= now) _throttleMap.delete(k); } }
    return false;
}
const parseLogTimeMs = (value) => {
    const m = (value || '').match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
    if (!m) return 0;
    return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]) - 8, Number(m[5]), Number(m[6]));
};
const normalizeLogEntry = (log) => {
    if (!log) return null;
    const normalized = {
        id: Number(log.id || 0),
        time: log.time || '',
        ip: log.ip || '',
        region: log.region || '',
        action: log.action || ''
    };
    normalized.sortTime = parseLogTimeMs(normalized.time);
    return normalized;
};
async function getStoredDailyStats(env, dateStr) {
    if (env.DB) {
        try {
            const { results } = await env.DB.prepare("SELECT count FROM stats WHERE date = ?").bind(dateStr).all();
            const val = results[0]?.count;
            if (val !== undefined && val !== null) return val.toString();
        } catch(e) {}
    }
    return "0";
}
async function checkWhitelist(env, ip) {
    if (!ip) return false;
    const envWL = await getSafeEnv(env, 'WL_IP', ADMIN_IP);
    if (splitCSV(envWL).includes(ip) || splitCSV(ADMIN_IP).includes(ip)) return true;
    if (env.DB) { try { const { results } = await env.DB.prepare("SELECT 1 FROM whitelist WHERE ip = ?").bind(ip).all(); if (results && results.length > 0) return true; } catch(e) {} }
    return false;
}
async function parseJSONBody(r) {
    try { return await r.json(); }
    catch (e) {
        try { return JSON.parse(await r.text()); }
        catch (_) { return null; }
    }
}
async function addWhitelist(env, ip) {
    const time = Date.now();
    let wroteDB = false, errors = [];
    if (env.DB) {
        try {
            await env.DB.prepare("INSERT OR IGNORE INTO whitelist (ip, created_at) VALUES (?, ?)").bind(ip, time).run();
            wroteDB = true;
        } catch(e) { errors.push(`D1:${e.message || e}`); }
    }
    return { ok: wroteDB, errors };
}
async function delWhitelist(env, ip) {
    let wroteDB = false, errors = [];
    if (env.DB) {
        try {
            await env.DB.prepare("DELETE FROM whitelist WHERE ip = ?").bind(ip).run();
            wroteDB = true;
        } catch(e) { errors.push(`D1:${e.message || e}`); }
    }
    return { ok: wroteDB, errors };
}
async function getAllWhitelist(env) {
    let systemSet = new Set(), manualSet = new Set();
    if(typeof ADMIN_IP !== 'undefined' && ADMIN_IP) splitCSV(ADMIN_IP).forEach(i => systemSet.add(i));
    const envWL = await getSafeEnv(env, 'WL_IP', ""); if(envWL) splitCSV(envWL).forEach(i => systemSet.add(i));
    if (env.DB) { try { const { results } = await env.DB.prepare("SELECT ip FROM whitelist ORDER BY created_at DESC").all(); results.forEach(row => manualSet.add(row.ip)); } catch(e) {} }
    let result = []; systemSet.forEach(ip => result.push({ ip: ip, type: 'system' }));
    manualSet.forEach(ip => { if (!systemSet.has(ip)) result.push({ ip: ip, type: 'manual' }); });
    return result;
}
async function logAccess(env, ip, region, action) {
    const time = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    const safeIP = ip || 'Unknown';
    const safeRegion = region || 'Unknown';
    const safeAction = action || '';
    if (env.DB) {
        try {
            await env.DB.prepare("INSERT INTO logs (time, ip, region, action) VALUES (?, ?, ?, ?)").bind(time, safeIP, safeRegion, safeAction).run();
            await env.DB.prepare("DELETE FROM logs WHERE id NOT IN (SELECT id FROM logs ORDER BY id DESC LIMIT 2000)").run();
        } catch (e) {}
    }
}
async function logAccessThrottled(env, ip, region, action, ttlSeconds = 30) {
    if (ttlSeconds > 0 && isThrottled(ip, action, ttlSeconds * 1000)) return;
    await logAccess(env, ip, region, action);
}
async function incrementDailyStats(env) {
    const dateStr = new Date().toISOString().split('T')[0];
    const cutoff = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    let result = "0";
    if (env.DB) {
        try {
            await env.DB.prepare(`INSERT INTO stats (date, count) VALUES (?, 1) ON CONFLICT(date) DO UPDATE SET count = count + 1`).bind(dateStr).run();
            await env.DB.prepare("DELETE FROM stats WHERE date < ?").bind(cutoff).run();
            const { results } = await env.DB.prepare("SELECT count FROM stats WHERE date = ?").bind(dateStr).all();
            result = results[0]?.count?.toString() || "1";
        } catch(e) {}
    }
    return result;
}

// =============================================================================
// Split panel API helpers. These routes are additive; the legacy dashboard and
// proxy/subscription routes below still work unchanged.
// =============================================================================
const PANEL_CONFIG_KEYS = [
  'ADD','ADDAPI','ADDCSV','DLS','TG_BOT_TOKEN','TG_CHAT_ID','CF_ID','CF_TOKEN',
  'CF_EMAIL','CF_KEY','CF_CONFIGS','PROXYIP','SUB_DOMAIN','SUBAPI','PS','LOGIN_PAGE_TITLE',
  'DASHBOARD_TITLE','TG_GROUP_URL','SITE_URL','GITHUB_URL','PROXY_CHECK_URL',
  'CLASH_CONFIG','SINGBOX_CONFIG_V11','SINGBOX_CONFIG_V12','WL_IP',
  'ECH_ENABLED','ECH_SNI','ECH_DNS','BG_LOGIN','BG_DASH','GLASS_A','SCRIM_A'
];
const PANEL_CONFIG_KEY_SET = new Set(PANEL_CONFIG_KEYS);

function getAllowedPanelOrigin(request, env) {
  const origin = request.headers.get('Origin');
  if (!origin) return null;
  const sameOrigin = new URL(request.url).origin;
  const configured = String(env.PANEL_ORIGIN || env.PANEL_ORIGINS || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);
  if (!configured.length) return origin === sameOrigin ? origin : null;
  if (configured.includes('*') || configured.includes(origin)) return origin;
  return null;
}

function withPanelCors(request, env, headers = {}) {
  const out = new Headers(headers);
  const origin = getAllowedPanelOrigin(request, env);
  out.set('Vary', 'Origin');
  if (origin) {
    out.set('Access-Control-Allow-Origin', origin);
    out.set('Access-Control-Allow-Credentials', 'true');
  }
  return out;
}

function panelOptions(request, env) {
  const headers = withPanelCors(request, env, {
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  });
  return new Response(null, { status: 204, headers });
}

function panelJson(request, env, data, init = {}) {
  const headers = withPanelCors(request, env, init.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(data), { ...init, headers });
}

function panelSetCookie(request, env, password) {
  const isHttps = new URL(request.url).protocol === 'https:';
  const sameSite = String(env.PANEL_COOKIE_SAMESITE || (isHttps ? 'None' : 'Lax'));
  const secure = isHttps ? '; Secure' : '';
  const clean = String(password || '').replace(/[\r\n;]/g, '');
  return `auth=${clean}; Path=/; Max-Age=7200; HttpOnly${secure}; SameSite=${sameSite}`;
}

function panelClearCookie(request, env) {
  const isHttps = new URL(request.url).protocol === 'https:';
  const sameSite = String(env.PANEL_COOKIE_SAMESITE || (isHttps ? 'None' : 'Lax'));
  const secure = isHttps ? '; Secure' : '';
  return `auth=; Path=/; Max-Age=0; HttpOnly${secure}; SameSite=${sameSite}`;
}

function panelMask(value) {
  const s = String(value || '');
  return s ? `****${s.slice(-4)}` : '';
}

function buildPanelLinks(host, uuid, subpass, subdomain, converter, proxyip) {
  const path = proxyip ? `/proxyip=${proxyip}` : '/';
  const echPart = ECH ? `&ech=${encodeURIComponent((ECH_SNI ? ECH_SNI + '+' : '') + ECH_DNS)}` : '';
  const raw = `https://${subdomain}/sub?uuid=${uuid}&${'enc'+'ryption'}=none&${'secu'+'rity'}=tls&sni=${host}&alpn=h3&fp=${FP}&allowInsecure=0&type=ws&host=${host}&path=${encodeURIComponent(path)}${echPart}`;
  return {
    short: subpass ? `https://${host}/${subpass}` : '',
    raw,
    clash: `${converter}/sub?target=clash&url=${encodeURIComponent(raw)}&emoji=true&list=false&sort=false&fdn=false&scv=false`,
    singbox: `${converter}/sub?target=singbox&url=${encodeURIComponent(raw)}&emoji=true&list=false&sort=false&fdn=false&scv=false`,
    proxyPath: path
  };
}

async function panelBootstrap(args) {
  const {
    r, env, host, clientIP, city, country, _UUID, _SUB_PW, _PROXY_IP, _PS,
    _LOGIN_TITLE, _DASH_TITLE, _TG_GROUP_URL, _PROXY_CHECK_URL, _SITE_URL,
    _GITHUB_URL, _SUB_DOMAIN, _CONVERTER, _DLS, _CLASH_CONFIG,
    _SINGBOX_CONFIG_V11, _SINGBOX_CONFIG_V12, _BG_LOGIN, _BG_DASH,
    _GLASS_A, _SCRIM_A
  } = args;

  const add = await getSafeEnv(env, 'ADD', '');
  const addApi = await getSafeEnv(env, 'ADDAPI', '');
  const addCsv = await getSafeEnv(env, 'ADDCSV', '');
  const wlIp = await getSafeEnv(env, 'WL_IP', ADMIN_IP);
  const tgToken = await getSafeEnv(env, 'TG_BOT_TOKEN', TG_BOT_TOKEN);
  const tgId = await getSafeEnv(env, 'TG_CHAT_ID', TG_CHAT_ID);
  const cfId = await getSafeEnv(env, 'CF_ID', '');
  const cfToken = await getSafeEnv(env, 'CF_TOKEN', '');
  const cfMail = await getSafeEnv(env, 'CF_EMAIL', '');
  const cfKey = await getSafeEnv(env, 'CF_KEY', '');

  return panelJson(r, env, {
    ok: true,
    uuid: _UUID,
    subPassword: _SUB_PW,
    identity: {
      host,
      ip: clientIP || 'Unknown',
      location: `${city}, ${country}`
    },
    status: {
      storage: env.DB ? 'D1 OK' : 'Missing',
      telegram: !!(tgToken && tgId),
      cloudflare: !!((cfId && cfToken) || (cfMail && cfKey))
    },
    links: buildPanelLinks(host, _UUID, _SUB_PW, _SUB_DOMAIN, _CONVERTER, _PROXY_IP),
    config: {
      ADD: add,
      ADDAPI: addApi,
      ADDCSV: addCsv,
      DLS: _DLS,
      PROXYIP: _PROXY_IP,
      SUB_DOMAIN: _SUB_DOMAIN,
      SUBAPI: _CONVERTER,
      PS: _PS,
      LOGIN_PAGE_TITLE: _LOGIN_TITLE,
      DASHBOARD_TITLE: _DASH_TITLE,
      TG_GROUP_URL: _TG_GROUP_URL,
      SITE_URL: _SITE_URL,
      GITHUB_URL: _GITHUB_URL,
      PROXY_CHECK_URL: _PROXY_CHECK_URL,
      CLASH_CONFIG: _CLASH_CONFIG,
      SINGBOX_CONFIG_V11: _SINGBOX_CONFIG_V11,
      SINGBOX_CONFIG_V12: _SINGBOX_CONFIG_V12,
      WL_IP: wlIp,
      ECH_ENABLED: ECH ? 'true' : 'false',
      ECH_SNI: ECH_SNI,
      ECH_DNS: ECH_DNS,
      BG_LOGIN: _BG_LOGIN,
      BG_DASH: _BG_DASH,
      GLASS_A: _GLASS_A,
      SCRIM_A: _SCRIM_A,
      CF_CONFIGS: await getSafeEnv(env, 'CF_CONFIGS', '[]')
    },
    secrets: {
      TG_BOT_TOKEN: panelMask(tgToken),
      TG_CHAT_ID: panelMask(tgId),
      CF_ID: panelMask(cfId),
      CF_TOKEN: panelMask(cfToken),
      CF_EMAIL: panelMask(cfMail),
      CF_KEY: panelMask(cfKey)
    }
  });
}

async function handlePanelApi(args) {
  const { r, env, ctx, url, clientIP, city, country, isGlobalAdmin, hasAuthCookie, _WEB_PW } = args;
  const method = r.method.toUpperCase();
  const path = url.pathname.replace(/^\/api\/?/, '').replace(/\/+$/, '') || 'session';
  const adminOK = !_WEB_PW || hasAuthCookie || isGlobalAdmin;

  if (path === 'theme' && method === 'GET') {
    return panelJson(r, env, {
      ok: true,
      title: args._LOGIN_TITLE,
      logo: LOGO_URI,
      links: {
        tgGroup: args._TG_GROUP_URL,
        site: args._SITE_URL,
        github: args._GITHUB_URL
      },
      background: {
        login: args._BG_LOGIN,
        dash: args._BG_DASH,
        glassA: args._GLASS_A,
        scrimA: args._SCRIM_A
      }
    });
  }

  if (path === 'login' && method === 'POST') {
    const body = await parseJSONBody(r);
    const password = String(body?.password || '');
    if (!_WEB_PW || password === _WEB_PW) {
      const headers = withPanelCors(r, env, { 'Set-Cookie': panelSetCookie(r, env, _WEB_PW || password) });
      headers.set('Content-Type', 'application/json; charset=utf-8');
      headers.set('Cache-Control', 'no-store');
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }
    ctx.waitUntil(logAccessThrottled(env, clientIP, `${city},${country}`, '分离面板登录失败', 30));
    return panelJson(r, env, { ok: false, msg: '密码错误' }, { status: 401 });
  }

  if (path === 'logout' && method === 'POST') {
    const headers = withPanelCors(r, env, { 'Set-Cookie': panelClearCookie(r, env) });
    headers.set('Content-Type', 'application/json; charset=utf-8');
    headers.set('Cache-Control', 'no-store');
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (path === 'session' && method === 'GET') {
    return panelJson(r, env, { ok: true, authenticated: adminOK });
  }

  if (!adminOK) return panelJson(r, env, { ok: false, msg: 'Unauthorized' }, { status: 401 });

  if (path === 'bootstrap' && method === 'GET') return panelBootstrap(args);

  if (path === 'stats' && (method === 'GET' || method === 'POST')) {
    const body = method === 'POST' ? await parseJSONBody(r) : {}; 
    const dateStr = new Date().toISOString().split('T')[0];
    const reqCount = await getStoredDailyStats(env, dateStr);
    const cfEnv = body && (body.CF_ID || body.CF_TOKEN || body.CF_EMAIL || body.CF_KEY) ? { CF_ID: body.CF_ID, CF_TOKEN: body.CF_TOKEN, CF_EMAIL: body.CF_EMAIL, CF_KEY: body.CF_KEY } : env;
    const cfStats = await getCloudflareUsage(cfEnv);
    const storageStatus = env.DB ? 'D1 OK' : 'Missing';
    const reqLabel = storageStatus === 'Missing' ? 'Internal' : 'API';
    const finalReq = storageStatus === 'Missing' ? '不统计' : (cfStats.success ? `${cfStats.total} (${reqLabel})` : `${reqCount} (${reqLabel})`);
    return panelJson(r, env, {
      ok: true,
      req: finalReq,
      ip: clientIP || 'Unknown',
      loc: `${city}, ${country}`,
      storageStatus,
      cfConfigured: cfStats.success || (!!await getSafeEnv(env, 'CF_EMAIL', '') && !!await getSafeEnv(env, 'CF_KEY', ''))
    });
  }

  if (path === 'logs' && method === 'GET') {
    let logs = [];
    if (env.DB) {
      try {
        const { results } = await env.DB.prepare('SELECT * FROM logs ORDER BY id DESC LIMIT 50').all();
        logs = (results || []).map(normalizeLogEntry).filter(Boolean);
      } catch(e) {}
    }
    return panelJson(r, env, { ok: true, type: env.DB ? 'd1' : 'none', logs });
  }

  if (path === 'whitelist' && method === 'GET') {
    const list = await getAllWhitelist(env);
    return panelJson(r, env, { ok: true, list });
  }

  if (path === 'whitelist' && method === 'POST') {
    const body = await parseJSONBody(r);
    const ipStr = String(body?.ip || '').trim();
    if (!ipStr) return panelJson(r, env, { ok: false, msg: 'Missing IP' }, { status: 400 });
    if (!/^[\d.:a-fA-F]+$/.test(ipStr) || ipStr.length > 45) {
      return panelJson(r, env, { ok: false, msg: 'Invalid IP format' }, { status: 400 });
    }
    const result = await addWhitelist(env, ipStr);
    return panelJson(r, env, { ok: result.ok, status: result.ok ? 'ok' : 'error', msg: result.errors?.join(' | ') || '', ...result });
  }

  if (path === 'whitelist' && method === 'DELETE') {
    const body = await parseJSONBody(r);
    const ipStr = String(body?.ip || url.searchParams.get('ip') || '').trim();
    if (!ipStr) return panelJson(r, env, { ok: false, msg: 'Missing IP' }, { status: 400 });
    const result = await delWhitelist(env, ipStr);
    return panelJson(r, env, { ok: result.ok, status: result.ok ? 'ok' : 'error', msg: result.errors?.join(' | ') || '', ...result });
  }

  if (path === 'config' && method === 'POST') {
    const body = await parseJSONBody(r);
    if (!body || typeof body !== 'object') return panelJson(r, env, { ok: false, msg: 'Bad JSON' }, { status: 400 });
    const saved = [];
    for (const [key, value] of Object.entries(body)) {
      if (!PANEL_CONFIG_KEY_SET.has(key)) continue;
      saved.push(key);
      if (env.DB) {
        await env.DB.prepare('INSERT INTO config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?')
          .bind(key, String(value ?? ''), String(value ?? ''))
          .run();
      }
    }
    return panelJson(r, env, { ok: true, status: 'ok', saved, storage: env.DB ? 'D1 OK' : 'Missing' });
  }

  if (path === 'validate/tg' && method === 'POST') {
    const body = await parseJSONBody(r);
    await sendTgMsg(ctx, { TG_BOT_TOKEN: body?.TG_BOT_TOKEN, TG_CHAT_ID: body?.TG_CHAT_ID }, 'TG 推送可用性验证', r, '配置有效', true);
    return panelJson(r, env, { ok: true, success: true, msg: '验证消息已发送' });
  }

  if (path === 'validate/cf' && method === 'POST') {
    const body = await parseJSONBody(r);
    const res = await getCloudflareUsage(body || {});
    return panelJson(r, env, { ok: res.success, success: res.success, msg: res.success ? `验证通过: 总请求 ${res.total}` : `验证失败: ${res.msg}` });
  }

  if (path === 'log/proxy-check' && method === 'POST') {
    ctx.waitUntil(logAccessThrottled(env, clientIP, `${city},${country}`, '检测ProxyIP', 30));
    return panelJson(r, env, { ok: true });
  }

  if (path === 'log/sub-test' && method === 'POST') {
    ctx.waitUntil(logAccessThrottled(env, clientIP, `${city},${country}`, '订阅测试点击', 30));
    return panelJson(r, env, { ok: true });
  }

  return panelJson(r, env, { ok: false, msg: 'Not Found' }, { status: 404 });
}

async function getDynamicUUID(key, refresh = 86400) {
    const time = Math.floor(Date.now() / 1000 / refresh);
    const msg = new TextEncoder().encode(`${key}-${time}`);
    const hash = await crypto.subtle.digest('SHA-256', msg); const b = new Uint8Array(hash);
    return [...b.slice(0, 16)].map(n => n.toString(16).padStart(2, '0')).join('').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
}
async function getCloudflareUsage(env) {
    const Email = await getSafeEnv(env, 'CF_EMAIL', ""); const GlobalAPIKey = await getSafeEnv(env, 'CF_KEY', "");
    const AccountID = await getSafeEnv(env, 'CF_ID', ""); const APIToken = await getSafeEnv(env, 'CF_TOKEN', "");
    if (!AccountID && (!Email || !GlobalAPIKey)) return { success: false, msg: "未配置 CF 凭证" };
    const API = "https://api.cloudflare.com/client/v4"; const cfg = { "Content-Type": "application/json" };
    try {
        let finalAccountID = AccountID;
        if (!finalAccountID) { const r = await fetch(`${API}/accounts`, { method: "GET", headers: { ...cfg, "X-AUTH-EMAIL": Email, "X-AUTH-KEY": GlobalAPIKey } });
            if (!r.ok) throw new Error(`账户获取失败: ${r.status}`); const d = await r.json();
            const idx = d.result?.findIndex(a => a.name?.toLowerCase().startsWith(Email.toLowerCase())); finalAccountID = d.result?.[idx >= 0 ? idx : 0]?.id; }
        if(!finalAccountID) throw new Error("无法获取 Account ID");
        const now = new Date(); now.setUTCHours(0, 0, 0, 0);
        const hdr = APIToken ? { ...cfg, "Authorization": `Bearer ${APIToken}` } : { ...cfg, "X-AUTH-EMAIL": Email, "X-AUTH-KEY": GlobalAPIKey };
        const res = await fetch(`${API}/graphql`, { method: "POST", headers: hdr, body: JSON.stringify({ query: `query getBillingMetrics($AccountID: String!, $filter: AccountWorkersInvocationsAdaptiveFilter_InputObject) { viewer { accounts(filter: {accountTag: $AccountID}) { pagesFunctionsInvocationsAdaptiveGroups(limit: 1000, filter: $filter) { sum { requests } } workersInvocationsAdaptive(limit: 10000, filter: $filter) { sum { requests } } } } }`, variables: { AccountID: finalAccountID, filter: { datetime_geq: now.toISOString(), datetime_leq: new Date().toISOString() } } }) });
        if (!res.ok) throw new Error(`查询失败: ${res.status}`); const result = await res.json();
        const acc = result?.data?.viewer?.accounts?.[0]; const pages = acc?.pagesFunctionsInvocationsAdaptiveGroups?.reduce((t, i) => t + (i?.sum?.requests || 0), 0) || 0;
        const workers = acc?.workersInvocationsAdaptive?.reduce((t, i) => t + (i?.sum?.requests || 0), 0) || 0;
        return { success: true, total: pages + workers, pages, workers };
    } catch (e) { return { success: false, msg: e.message }; }
}
async function sendTgMsg(ctx, env, title, r, detail = "", isAdmin = false) {
  const token = await getSafeEnv(env, 'TG_BOT_TOKEN', TG_BOT_TOKEN); const chat_id = await getSafeEnv(env, 'TG_CHAT_ID', TG_CHAT_ID);
  if (!token || !chat_id) return;
  let icon = "📡"; if (title.includes("登录")) icon = "🔐"; else if (title.includes("订阅")) icon = "🔄"; else if (title.includes("检测")) icon = "🔍"; else if (title.includes("点击")) icon = "🌟";
  const roleTag = isAdmin ? "🛡️ <b>管理员操作</b>" : "👤 <b>用户访问</b>";
  try {
    const url = new URL(r.url); const ip = r.headers.get('cf-connecting-ip') || 'Unknown'; const ua = r.headers.get('User-Agent') || 'Unknown'; const city = r.cf?.city || 'Unknown'; const time = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    const safe = (str) => (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const text = `<b>${icon} ${safe(title)}</b>\n${roleTag}\n\n` + `<b>🕒 时间:</b> <code>${time}</code>\n` + `<b>🌍 IP:</b> <code>${safe(ip)}</code>\n` + `<b>🔗 域名:</b> <code>${safe(url.hostname)}</code>\n` + `<b>🛣️ 路径:</b> <code>${safe(url.pathname)}</code>\n` + `<b>📱 客户端:</b> <code>${safe(ua)}</code>\n` + (detail ? `<b>ℹ️ 详情:</b> ${safe(detail)}` : "");
    const params = { chat_id: chat_id, text: text, parse_mode: 'HTML', disable_web_page_preview: true };
    const p = fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) }).catch(() => {});
    if(ctx && ctx.waitUntil) ctx.waitUntil(p);
  } catch(e) {}
}

// =============================================================================
// 🟢 主入口 (防1101保护)
// =============================================================================
export default {
  async fetch(r, env, ctx) {
    detectRuntime(env);
    try {
      const url = new URL(r.url);
      if (r.method === 'OPTIONS' && url.pathname.startsWith('/api/')) return panelOptions(r, env);
      const host = url.hostname; 
      const UA = (r.headers.get('User-Agent') || "").toLowerCase();
      const UA_L = UA;
      const clientIP = r.headers.get('cf-connecting-ip');
      const country = r.cf?.country || 'UNK';
      const city = r.cf?.city || 'Unknown';

      const _UUID = env.KEY ? await getDynamicUUID(env.KEY, env.UUID_REFRESH || 86400) : (await getSafeEnv(env, 'UUID', UUID));
      setUUID(_UUID);
      const _WEB_PW = await getSafeEnv(env, 'WEB_PASSWORD', WEB_PASSWORD);
      const _SUB_PW = await getSafeEnv(env, 'SUB_PASSWORD', SUB_PASSWORD);
      
      let _PROXY_IP = await getSafeEnv(env, 'PROXYIP', DEFAULT_PROXY_IP);

      const _PS = await getSafeEnv(env, 'PS', "");
      const _LOGIN_TITLE = await getSafeEnv(env, 'LOGIN_PAGE_TITLE', LOGIN_PAGE_TITLE);
      const _DASH_TITLE = await getSafeEnv(env, 'DASHBOARD_TITLE', DASHBOARD_TITLE); 
      
      let _SUB_DOMAIN_STR = await getSafeEnv(env, 'SUB_DOMAIN', DEFAULT_SUB_DOMAIN);
      let _CONVERTER_STR = await getSafeEnv(env, 'SUBAPI', DEFAULT_CONVERTER);
      // 清洗单值：去协议头和尾部斜杠
      let _SUB_DOMAIN = _SUB_DOMAIN_STR.trim(); if(_SUB_DOMAIN.includes("://")) _SUB_DOMAIN=_SUB_DOMAIN.split("://")[1]; if(_SUB_DOMAIN.includes("/")) _SUB_DOMAIN=_SUB_DOMAIN.split("/")[0]; _SUB_DOMAIN = _SUB_DOMAIN || host;
      let _CONVERTER = _CONVERTER_STR.trim(); if(_CONVERTER.endsWith("/")) _CONVERTER=_CONVERTER.slice(0,-1); if(!_CONVERTER.includes("://")) _CONVERTER="https://"+_CONVERTER; _CONVERTER = _CONVERTER || DEFAULT_CONVERTER;

      // ⭐ 功能4: DLS速度下限筛选
      const _DLS = await getSafeEnv(env, 'DLS', DLS);

      // 🔐 ECH 环境变量覆盖 (优先级: 环境变量 > D1 > 硬编码)
      const _echFlag = await getSafeEnv(env, 'ECH_ENABLED', ECH ? 'true' : 'false');
      ECH = _echFlag === 'true';
      ECH_SNI = await getSafeEnv(env, 'ECH_SNI', ECH_SNI);
      ECH_DNS = await getSafeEnv(env, 'ECH_DNS', ECH_DNS);
      FP = ECH ? 'firefox' : 'randomized';

      // 👇 变量去重与统一调用逻辑：优先 getSafeEnv(环境变量, 默认常量)
      const _TG_GROUP_URL = await getSafeEnv(env, 'TG_GROUP_URL', TG_GROUP_URL);
      const _PROXY_CHECK_URL = await getSafeEnv(env, 'PROXY_CHECK_URL', PROXY_CHECK_URL);
      const _SITE_URL = await getSafeEnv(env, 'SITE_URL', SITE_URL);
      const _GITHUB_URL = await getSafeEnv(env, 'GITHUB_URL', GITHUB_URL);
      const _BG_LOGIN = safeBgUrl(await getSafeEnv(env, 'BG_LOGIN', ''));
      const _BG_DASH  = safeBgUrl(await getSafeEnv(env, 'BG_DASH',  ''));
      const _GLASS_A = String(Math.min(100, Math.max(20, parseInt(await getSafeEnv(env, 'GLASS_A', '72')) || 72)));
      const _SCRIM_A = String(Math.min(95, Math.max(0, parseInt(await getSafeEnv(env, 'SCRIM_A', '55')) || 55)));
      const _CLASH_CONFIG = await getSafeEnv(env, 'CLASH_CONFIG', CLASH_CONFIG);
      const _SINGBOX_CONFIG_V11 = await getSafeEnv(env, 'SINGBOX_CONFIG_V11', SINGBOX_CONFIG_V11);
      const _SINGBOX_CONFIG_V12 = await getSafeEnv(env, 'SINGBOX_CONFIG_V12', SINGBOX_CONFIG_V12);
      
      if (UA_L.includes('spider') || UA_L.includes('bot') || UA_L.includes('python') || UA_L.includes('scrapy') || UA_L.includes('curl') || UA_L.includes('wget')) {
          return new Response('Not Found', { status: 404 });
      }

      let isGlobalAdmin = await checkWhitelist(env, clientIP);
      let isValidUser = false; 
      let hasAuthCookie = false; 

      const paramUUID = url.searchParams.get('uuid');
      if (paramUUID && paramUUID.toLowerCase() === _UUID.toLowerCase()) isValidUser = true;
      if (_SUB_PW && url.pathname === `/${_SUB_PW}`) isValidUser = true;

      if (_WEB_PW) {
        const cookie = r.headers.get('Cookie') || "";
        const regex = new RegExp(`(^|;\\s*)auth=${_WEB_PW.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(;|$)`);
        if (regex.test(cookie)) {
            isValidUser = true; hasAuthCookie = true;
        }
      }
      if (isGlobalAdmin) isValidUser = true;

      if (url.pathname.startsWith('/api/')) {
        return await handlePanelApi({
          r, env, ctx, url, host, UA, UA_L, clientIP, country, city,
          isGlobalAdmin, isValidUser, hasAuthCookie,
          _UUID, _WEB_PW, _SUB_PW, _PROXY_IP, _PS, _LOGIN_TITLE, _DASH_TITLE,
          _TG_GROUP_URL, _PROXY_CHECK_URL, _SITE_URL, _GITHUB_URL, _SUB_DOMAIN,
          _CONVERTER, _DLS, _CLASH_CONFIG, _SINGBOX_CONFIG_V11,
          _SINGBOX_CONFIG_V12, _BG_LOGIN, _BG_DASH, _GLASS_A, _SCRIM_A
        });
      }

      if (url.pathname === '/favicon.ico') return new Response(null, { status: 404 });
      
      const flag = url.searchParams.get('flag');
      if (!flag && env.DB) ctx.waitUntil(incrementDailyStats(env));
      if (flag) {
          if (flag === 'github') { await sendTgMsg(ctx, env, "🌟 用户点击了烈火项目", r, "来源: 登录页面直达链接", isGlobalAdmin); return new Response(null, { status: 204 }); }
          if (flag === 'log_proxy_check') { ctx.waitUntil(logAccessThrottled(env, clientIP, `${city},${country}`, "检测ProxyIP", 30)); await sendTgMsg(ctx, env, "🔍 用户点击了 ProxyIP 检测", r, "来源: 后台管理面板", isGlobalAdmin); return new Response(null, { status: 204 }); }
          if (flag === 'log_sub_test') { ctx.waitUntil(logAccessThrottled(env, clientIP, `${city},${country}`, "订阅测试点击", 30)); await sendTgMsg(ctx, env, "🌟 用户点击了订阅测试", r, "来源: 后台管理面板", isGlobalAdmin); return new Response(null, { status: 204 }); }
          if (flag === 'stats') { if (!hasAuthCookie && !isGlobalAdmin) return new Response('403 Forbidden', { status: 403 }); const dateStr = new Date().toISOString().split('T')[0]; const reqCount = await getStoredDailyStats(env, dateStr); const cfStats = await getCloudflareUsage(env); const storageStatus = env.DB ? 'D1 OK' : 'Missing'; const reqLabel = storageStatus === 'Missing' ? 'Internal' : 'API'; const finalReq = storageStatus === 'Missing' ? '不统计' : (cfStats.success ? `${cfStats.total} (${reqLabel})` : `${reqCount} (${reqLabel})`); const cfConfigured = cfStats.success || (!!await getSafeEnv(env, 'CF_EMAIL', "") && !!await getSafeEnv(env, 'CF_KEY', "")); return new Response(JSON.stringify({ req: finalReq, ip: clientIP, loc: `${city}, ${country}`, storageStatus: storageStatus, cfConfigured: cfConfigured }), { headers: { 'Content-Type': 'application/json' } }); }
          if (flag === 'get_logs') { if (!hasAuthCookie && !isGlobalAdmin) return new Response('403 Forbidden', { status: 403 }); let logs = []; if (env.DB) { try { const { results } = await env.DB.prepare("SELECT * FROM logs ORDER BY id DESC LIMIT 50").all(); logs = (results || []).map(normalizeLogEntry).filter(Boolean); } catch(e) {} } if (logs.length > 0) { return new Response(JSON.stringify({ type: 'd1', logs: logs }), { headers: { 'Content-Type': 'application/json' } }); } return new Response(JSON.stringify({ logs: "No Storage" }), { headers: { 'Content-Type': 'application/json' } }); }
          if (flag === 'get_whitelist') { if (!hasAuthCookie && !isGlobalAdmin) return new Response('403 Forbidden', { status: 403 }); const list = await getAllWhitelist(env); return new Response(JSON.stringify({ list }), { headers: { 'Content-Type': 'application/json' } }); }
          if (flag === 'add_whitelist' && r.method === 'POST') { if (!hasAuthCookie && !isGlobalAdmin) return new Response('403 Forbidden', { status: 403 }); const body = await parseJSONBody(r); if(!body?.ip) return new Response(JSON.stringify({status:'error',msg:'Missing IP'}), {headers:{'Content-Type':'application/json'}}); const ipStr = body.ip.trim(); if (!/^[\d.:a-fA-F]+$/.test(ipStr) || ipStr.length > 45) return new Response(JSON.stringify({status:'error',msg:'Invalid IP format'}), {headers:{'Content-Type':'application/json'}}); const result = await addWhitelist(env, ipStr); return new Response(JSON.stringify(result.ok ? {status:'ok', ...result} : {status:'error', msg: result.errors.join(' | ') || 'No writable storage', ...result}), {headers:{'Content-Type':'application/json'}}); }
          if (flag === 'del_whitelist' && r.method === 'POST') { if (!hasAuthCookie && !isGlobalAdmin) return new Response('403 Forbidden', { status: 403 }); const body = await parseJSONBody(r); if(!body?.ip) return new Response(JSON.stringify({status:'error',msg:'Missing IP'}), {headers:{'Content-Type':'application/json'}}); const result = await delWhitelist(env, body.ip.trim()); return new Response(JSON.stringify(result.ok ? {status:'ok', ...result} : {status:'error', msg: result.errors.join(' | ') || 'No writable storage', ...result}), {headers:{'Content-Type':'application/json'}}); }
          if (flag === 'validate_tg' && r.method === 'POST') { if (!hasAuthCookie && !isGlobalAdmin) return new Response('403 Forbidden', { status: 403 }); const body = await r.json(); await sendTgMsg(ctx, { TG_BOT_TOKEN: body.TG_BOT_TOKEN, TG_CHAT_ID: body.TG_CHAT_ID }, "🤖 TG 推送可用性验证", r, "配置有效", true); return new Response(JSON.stringify({success:true, msg:"验证消息已发送"}), {headers:{'Content-Type':'application/json'}}); }
          if (flag === 'validate_cf' && r.method === 'POST') { if (!hasAuthCookie && !isGlobalAdmin) return new Response('403 Forbidden', { status: 403 }); const body = await r.json(); const res = await getCloudflareUsage(body); return new Response(JSON.stringify({success:res.success, msg: res.success ? `验证通过: 总请求 ${res.total}` : `验证失败: ${res.msg}`}), {headers:{'Content-Type':'application/json'}}); }
          if (flag === 'save_config' && r.method === 'POST') { if (!hasAuthCookie && !isGlobalAdmin) return new Response('403 Forbidden', { status: 403 }); try { const body = await r.json(); const ALLOWED_KEYS = new Set(['ADD','ADDAPI','ADDCSV','DLS','TG_BOT_TOKEN','TG_CHAT_ID','CF_ID','CF_TOKEN','CF_EMAIL','CF_KEY','CF_CONFIGS','PROXYIP','SUB_DOMAIN','SUBAPI','PS','LOGIN_PAGE_TITLE','DASHBOARD_TITLE','TG_GROUP_URL','SITE_URL','GITHUB_URL','PROXY_CHECK_URL','CLASH_CONFIG','SINGBOX_CONFIG_V11','SINGBOX_CONFIG_V12','WL_IP','ECH_ENABLED','ECH_SNI','ECH_DNS','BG_LOGIN','BG_DASH','GLASS_A','SCRIM_A']); for (const [k, v] of Object.entries(body)) { if (!ALLOWED_KEYS.has(k)) continue; if (env.DB) await env.DB.prepare("INSERT INTO config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?").bind(k, v, v).run(); } return new Response(JSON.stringify({status: 'ok'}), { headers: { 'Content-Type': 'application/json' } }); } catch(e) { return new Response(JSON.stringify({status: 'error', msg: e.toString()}), { headers: { 'Content-Type': 'application/json' } }); } }
      }

      if (_SUB_PW && url.pathname === `/${_SUB_PW}`) {
          ctx.waitUntil(logAccess(env, clientIP, `${city},${country}`, "订阅更新"));
          const isFlagged = url.searchParams.has('flag');
          if (!isFlagged) {
              try {
                  const _d = (s) => atob(s);
                  const rules = [['TWlob21v', 'bWlob21v'], ['RmxDbGFzaA==', 'ZmxjbGFzaA=='], ['Q2xhc2g=', 'Y2xhc2g='], ['Q2xhc2g=', 'bWV0YQ=='], ['Q2xhc2g=', 'c3Rhc2g='], ['SGlkZGlmeQ==', 'aGlkZGlmeQ=='], ['U2luZy1ib3g=', 'c2luZy1ib3g='], ['U2luZy1ib3g=', 'c2luZ2JveA=='], ['U2luZy1ib3g=', 'c2Zp'], ['U2luZy1ib3g=', 'Ym94'], ['djJyYXlOL0NvcmU=', 'djJyYXk='], ['U3VyZ2U=', 'c3VyZ2U='], ['UXVhbnR1bXVsdCBY', 'cXVhbnR1bXVsdA=='], ['U2hhZG93cm9ja2V0', 'c2hhZG93cm9ja2V0'], ['TG9vbg==', 'bG9vbg=='], ['SGFB', 'aGFwcA==']];
                  let cName = "VW5rbm93bg=="; let isProxy = false;
                  for (const [n, k] of rules) { if (UA_L.includes(_d(k))) { cName = n; isProxy = true; break; } }
                  if (!isProxy && (UA_L.includes(_d('bW96aWxsYQ==')) || UA_L.includes(_d('Y2hyb21l')))) cName = "QnJvd3Nlcg==";
                  const title = isProxy ? "🔄 快速订阅更新" : "🌐 访问快速订阅页";
                  const p = sendTgMsg(ctx, env, title, r, `类型: ${_d(cName)}`, isGlobalAdmin);
                  if(ctx && ctx.waitUntil) ctx.waitUntil(p);
              } catch (e) {}
          }
          const requestProxyIp = url.searchParams.get('proxyip') || _PROXY_IP;
          const pathParam = requestProxyIp ? "/proxyip=" + requestProxyIp : "/";
          
          // ===== 自适应订阅：完整客户端适配（参考 EDT 2.1）=====
          const _manualTarget = url.searchParams.get('target');
          const 订阅类型 = _manualTarget
            ? _manualTarget
            : (UA_L.includes('cl'+'ash') || UA_L.includes('me'+'ta') || UA_L.includes('mi'+'ho'+'mo') || UA_L.includes('fl'+'cl'+'ash') || UA_L.includes('st'+'ash') || UA_L.includes('nek'+'obo'+'x'))
              ? 'clash'
              : (UA_L.includes('si'+'ng-'+'box') || UA_L.includes('si'+'ng'+'box') || UA_L.includes('sfi') || UA_L.includes('hid'+'dify') || UA_L.includes('kar'+'ing'))
                ? 'singbox'
                : UA_L.includes('su'+'rge')
                  ? 'surge'
                  : UA_L.includes('qua'+'ntu'+'mult')
                    ? 'quanx'
                    : UA_L.includes('lo'+'on')
                      ? 'loon'
                      : null;

          // 构造上游 subUrl（ST裂变/原始SUB，逻辑不变）
          let _subUrl;
          {
              const _SUB_TOKEN = await getSafeEnv(env, 'SUB_TOKEN', SUB_TOKEN);
              if (_SUB_TOKEN) {
                  const _desireIPs = await getCustomIPs(env, _DLS);
                  const _desireIP = (_desireIPs[0] || _PROXY_IP || host);
                  const _desireNode = genNodes(host, _UUID, _PROXY_IP, _desireIP ? [_desireIP] : [], _PS);
                  const _desireBase = (typeof _desireNode === 'string' ? _desireNode : _desireNode.split('\n')[0]).split('\n')[0];
                  _subUrl = `https://${_SUB_DOMAIN}/sub?base=${encodeURIComponent(_desireBase)}&token=${encodeURIComponent(_SUB_TOKEN)}` + (ECH ? `&ech=${encodeURIComponent((ECH_SNI ? ECH_SNI + '+' : '') + ECH_DNS)}` : '');
              } else {
                  _subUrl = `https://${_SUB_DOMAIN}/sub?uuid=${_UUID}&${'enc'+'ryption'}=none&${'secu'+'rity'}=tls&sni=${host}&alpn=h3&fp=${FP}&allowInsecure=0&type=ws&host=${host}&path=${encodeURIComponent(pathParam)}` + (ECH ? `&ech=${encodeURIComponent((ECH_SNI ? ECH_SNI + '+' : '') + ECH_DNS)}` : '');
              }
          }

          // 通用响应头
          const _subHeaders = {
              'Profile-Update-Interval': '3',
              'Subscription-Userinfo': `upload=0; download=0; total=${24 * 1099511627776}; expire=4102329600`,
              'Cache-Control': 'no-store'
          };
          if (!UA_L.includes('mozilla')) _subHeaders['Content-Disposition'] = `attachment; filename*=utf-8''${encodeURIComponent(_PS || 'AK1.32V2')}`;

          // ===== 路径A：需要订阅转换的客户端（clash/singbox/surge/quanx/loon）=====
          if (订阅类型) {
              const subApiTarget = 订阅类型 === 'surge' ? 'surge&ver=4' : 订阅类型;
              const configList = (订阅类型 === 'singbox')
                  ? Array.from(new Set([_SINGBOX_CONFIG_V11, _SINGBOX_CONFIG_V12].filter(Boolean)))
                  : [_CLASH_CONFIG];

              let lastRes = null;
              for (const config of configList) {
                  const subApi = `${_CONVERTER}/sub?target=${subApiTarget}&url=${encodeURIComponent(_subUrl)}&config=${encodeURIComponent(config)}&emoji=true&list=false&sort=false&fdn=false&scv=false`;
                  try {
                      const res = await fetch(subApi, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } });
                      if (res.ok) { lastRes = res; break; }
                  } catch(e) {}
              }

              if (lastRes) {
                  let _body = await lastRes.text();
                  // ECH 精准注入：只对支持 ECH 的客户端
                  if (ECH) {
                      if (订阅类型 === 'singbox') _body = await pSB(_body, _UUID);
                      else if (订阅类型 === 'clash') _body = await pCL(_body, _UUID, url.hostname);
                      // surge/quanx/loon 不支持 ECH，不注入
                  }
                  if (订阅类型 === 'clash') _subHeaders['Content-Type'] = 'application/x-yaml; charset=utf-8';
                  else if (订阅类型 === 'singbox') _subHeaders['Content-Type'] = 'application/json; charset=utf-8';
                  else _subHeaders['Content-Type'] = 'text/plain; charset=utf-8';
                  return new Response(_body, { status: 200, headers: _subHeaders });
              }
          }

          // ===== 路径B：原生订阅（v2rayN/Shadowrocket/Happ/浏览器等）=====
          try {
            let success = false;
            let body = "";

            if (host.toLowerCase() !== _SUB_DOMAIN.toLowerCase()) {
                try {
                    const res = await fetch(_subUrl, { headers: { 'User-Agent': UA } });
                    if (res.ok) {
                        body = await res.text();
                        success = true;
                    }
                } catch(e) {}
            }

            if (success) {
                try {
                  let decoded = atob(body);
                  let lines = decoded.split('\n').map(line => {
                    line = line.trim();
                    if (!line || !line.includes('://')) return line;
                    // ECH URI 注入（v2rayN/Shadowrocket 支持）
                    const _echURI = UA_L.includes('v2'+'ray') || UA_L.includes('sha'+'dow'+'roc'+'ket') || UA_L.includes('ha'+'pp');
                    if (ECH && _echURI && !line.includes('&ech=')) {
                      const echVal = encodeURIComponent((ECH_SNI ? ECH_SNI + '+' : '') + ECH_DNS);
                      const hashIdx = line.indexOf('#');
                      if (hashIdx > 0) {
                        line = line.slice(0, hashIdx) + '&ech=' + echVal + line.slice(hashIdx);
                      } else {
                        line = line + '&ech=' + echVal;
                      }
                    }
                    // FP 修正
                    if (ECH && _echURI && line.includes('fp=')) {
                      line = line.replace(/fp=[^&#]+/, 'fp=' + FP);
                    }
                    // PS 后缀
                    if (_PS) {
                      if (line.includes('#')) line = line + encodeURIComponent(` ${_PS}`);
                      else line = line + '#' + encodeURIComponent(_PS);
                    }
                    return line;
                  });
                  // 浏览器不 base64（方便调试），代理客户端 base64
                  const isBrowser = UA_L.includes('mozilla') && !UA_L.includes('v2'+'ray') && !UA_L.includes('sha'+'dow'+'roc'+'ket') && !UA_L.includes('ha'+'pp');
                  body = isBrowser ? lines.join('\n') : btoa(lines.join('\n'));
                } catch(e) {}
                _subHeaders['Content-Type'] = 'text/plain; charset=utf-8';
                return new Response(body, { status: 200, headers: _subHeaders });
            }
          } catch(e) {}

          // ===== 兜底：本地生成 =====
          const allIPs = await getCustomIPs(env, _DLS);
          const listText = genNodes(host, _UUID, requestProxyIp, allIPs, _PS);
          const isBrowserFallback = UA_L.includes('mozilla') && !UA_L.includes('v2'+'ray') && !UA_L.includes('sha'+'dow'+'roc'+'ket') && !UA_L.includes('ha'+'pp');
          const fallbackBody = isBrowserFallback ? listText : btoa(unescape(encodeURIComponent(listText)));
          _subHeaders['Content-Type'] = 'text/plain; charset=utf-8';
          return new Response(fallbackBody, { status: 200, headers: _subHeaders });
      }

      if (url.pathname === '/sub') {
          const baseLink = url.searchParams.get('base');

          // ===== Desire 兼容模式：有 base= 参数时走节点裂变逻辑 =====
          if (baseLink) {
              const reqToken = url.searchParams.get('token');
              const expectedToken = await getSafeEnv(env, 'SUB_TOKEN', SUB_TOKEN);
              if (expectedToken && reqToken !== expectedToken) {
                  ctx.waitUntil(logAccessThrottled(env, clientIP, `${city},${country}`, "裂变订阅失败(Token错误)", 30));
                  const errNode = `${'vl'+'ess'}://00000000-0000-0000-0000-000000000000@127.0.0.1:80?${'enc'+'ryption'}=none&${'secu'+'rity'}=none&type=tcp#${encodeURIComponent('❌ Token验证失败')}`;
                  return new Response(btoa(errNode), { headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
              }
              const source = url.searchParams.get('source');
              const extUrl = url.searchParams.get('ext_url');
              let allIPs;
              if (source === 'ext' && extUrl) {
                  try {
                      const extRes = await fetch(extUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
                      const extText = await extRes.text();
                      allIPs = extText.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
                  } catch { allIPs = []; }
              } else {
                  allIPs = await getCustomIPs(env, _DLS);
              }
              const links = allIPs.map(ipInfo => {
                  let [addrPart, ...nameParts] = ipInfo.split('#');
                  const nodeName = nameParts.join('#').trim();
                  addrPart = addrPart.trim();
                  let [ip, port] = parseAddressPort(addrPart);
                  port = String(port || 443);
                  try {
                      if (baseLink.startsWith('vl'+'ess://')) {
                          const u = new URL(baseLink);
                          const origHost = u.hostname;
                          u.hostname = ip; u.port = port;
                          u.hash = nodeName || ip;
                          if (!u.searchParams.has('host')) u.searchParams.set('host', origHost);
                          if (!u.searchParams.has('sni')) u.searchParams.set('sni', origHost);
                          return u.toString();
                      } else if (baseLink.startsWith('vm'+'ess://')) {
                          const b64 = baseLink.slice(8).replace(/-/g, '+').replace(/_/g, '/');
                          const cfg = JSON.parse(decodeURIComponent(escape(atob(b64))));
                          if (!cfg.sni) cfg.sni = cfg.add;
                          if (!cfg.host) cfg.host = cfg.add;
                          cfg.add = ip; cfg.port = port;
                          cfg.ps = nodeName || ip;
                          return ('vm'+'ess://') + btoa(unescape(encodeURIComponent(JSON.stringify(cfg))));
                      }
                  } catch { return null; }
                  return null;
              }).filter(Boolean);
              const output = links.length
                  ? links.join('\n')
                  : `${'vl'+'ess'}://00000000-0000-0000-0000-000000000000@127.0.0.1:80?${'enc'+'ryption'}=none&${'secu'+'rity'}=none&type=tcp#${encodeURIComponent('❌ 无可用优选IP')}`;
              return new Response(btoa(unescape(encodeURIComponent(output))), {
                  headers: { 'Content-Type': 'text/plain;charset=utf-8' }
              });
          }
          // ===== 原有逻辑保持不变 =====

          const requestUUID = url.searchParams.get('uuid');
          if (!requestUUID || requestUUID.toLowerCase() !== _UUID.toLowerCase()) {
              ctx.waitUntil(logAccessThrottled(env, clientIP, `${city},${country}`, "常规订阅失败(UUID错误)", 30));
              return new Response('Invalid UUID', { status: 403 });
          }
          ctx.waitUntil(logAccess(env, clientIP, `${city},${country}`, "常规订阅"));
          let proxyIp = url.searchParams.get('proxyip') || _PROXY_IP;
          const pathParam = url.searchParams.get('path');
          if (pathParam && pathParam.includes('/proxyip=')) proxyIp = pathParam.split('/proxyip=')[1];
          const allIPs = await getCustomIPs(env, _DLS); // 传入 DLS
          const listText = genNodes(host, _UUID, proxyIp, allIPs, _PS);
          return new Response(btoa(unescape(encodeURIComponent(listText))), { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }

      if (r.headers.get('Upgrade') !== 'websocket') {
        const noCacheHeaders = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Frame-Options': 'DENY', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin' };
        if (!hasAuthCookie) return new Response(loginPage(_TG_GROUP_URL, _SITE_URL, _GITHUB_URL, _LOGIN_TITLE, _BG_LOGIN, _GLASS_A, _SCRIM_A), { status: 200, headers: noCacheHeaders });
        await sendTgMsg(ctx, env, "✅ 后台登录成功", r, "进入管理面板", true);
        ctx.waitUntil(logAccess(env, clientIP, `${city},${country}`, "登录后台"));

        const _maskVal = (v) => v ? ('****' + v.slice(-4)) : '';
        const sysParams = { tgToken: _maskVal(env.TG_BOT_TOKEN || TG_BOT_TOKEN), tgId: _maskVal(env.TG_CHAT_ID || TG_CHAT_ID), cfId: _maskVal(env.CF_ID || ""), cfToken: _maskVal(env.CF_TOKEN || ""), cfMail: _maskVal(env.CF_EMAIL || ""), cfKey: _maskVal(env.CF_KEY || "") };
        const tgToken = _maskVal(await getSafeEnv(env, 'TG_BOT_TOKEN', TG_BOT_TOKEN));
        const tgId = _maskVal(await getSafeEnv(env, 'TG_CHAT_ID', TG_CHAT_ID));
        const cfId = _maskVal(await getSafeEnv(env, 'CF_ID', '')); const cfToken = _maskVal(await getSafeEnv(env, 'CF_TOKEN', ''));
        const cfMail = _maskVal(await getSafeEnv(env, 'CF_EMAIL', '')); const cfKey = _maskVal(await getSafeEnv(env, 'CF_KEY', ''));
        const _tgTokenRaw = await getSafeEnv(env, 'TG_BOT_TOKEN', TG_BOT_TOKEN); const _tgIdRaw = await getSafeEnv(env, 'TG_CHAT_ID', TG_CHAT_ID);
        const _cfIdRaw = await getSafeEnv(env, 'CF_ID', ''); const _cfTokenRaw = await getSafeEnv(env, 'CF_TOKEN', '');
        const _cfMailRaw = await getSafeEnv(env, 'CF_EMAIL', ''); const _cfKeyRaw = await getSafeEnv(env, 'CF_KEY', '');
        const tgState = !!(_tgTokenRaw && _tgIdRaw); const cfState = (!!(_cfIdRaw && _cfTokenRaw)) || (!!(_cfMailRaw && _cfKeyRaw));
        const _ADD = await getSafeEnv(env, 'ADD', ""); const _ADDAPI = await getSafeEnv(env, 'ADDAPI', ""); const _ADDCSV = await getSafeEnv(env, 'ADDCSV', "");

        // 传入 _DLS 参数到 dashPage
        const _ECH_ENABLED = await getSafeEnv(env, 'ECH_ENABLED', ECH ? 'true' : 'false');
        const _ECH_SNI_VAL = await getSafeEnv(env, 'ECH_SNI', ECH_SNI);
        const _ECH_DNS_VAL = await getSafeEnv(env, 'ECH_DNS', ECH_DNS);
        return new Response(dashPage(url.hostname, _UUID, _PROXY_IP, _SUB_PW, _SUB_DOMAIN, _CONVERTER, env, clientIP, hasAuthCookie, tgState, cfState, _ADD, _ADDAPI, _ADDCSV, tgToken, tgId, cfId, cfToken, cfMail, cfKey, sysParams, _DASH_TITLE, _PROXY_CHECK_URL, _DLS, _ECH_ENABLED, _ECH_SNI_VAL, _ECH_DNS_VAL, _BG_DASH, _BG_LOGIN, _GLASS_A, _SCRIM_A), { status: 200, headers: noCacheHeaders });
      }
      

      // 🟢 GrainTCP 代理入口
      return ws(r);

  } catch (err) {
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};

// =============================================================================
// 📋 UI & 节点生成
// =============================================================================

function genNodes(host, uuid, proxyIP, customIPs, psName) {
  let echParam = '';
  if (ECH) {
    echParam = `&ech=${encodeURIComponent((ECH_SNI ? ECH_SNI + '+' : '') + ECH_DNS)}`;
  }
  const commonUrlPart = `?enc`+`ryption=none&secu`+`rity=tls&sni=${host}&fp=${FP}&alpn=h3&type=ws&host=${host}` + echParam;
  const separator = psName ? ` ${psName}` : '';
  const result = [];
  if (!customIPs || customIPs.length === 0) {
      const path = proxyIP ? `/proxyip=${proxyIP}` : "/";
      const nodeName = `${psName || 'Worker'} - Default`;
      const defaultHost = formatHostForUrl(proxyIP || host);
      const vLink = `${P_V}://${uuid}@${defaultHost}:443${commonUrlPart}&path=${encodeURIComponent(path)}#${encodeURIComponent(nodeName)}`;
      return vLink;
  }
  for (const ipInfo of customIPs) {
      let [addressPart, ...nameParts] = ipInfo.split('#');
      let uniqueName = nameParts.join('#').trim();
      addressPart = addressPart.trim();
      let [ip, port] = parseAddressPort(addressPart);
      const path = proxyIP ? `/proxyip=${proxyIP}` : "/";
      let nodeName = uniqueName || ip; if (psName) nodeName = `${nodeName}${separator}`;
      const vLink = `${P_V}://${uuid}@${formatHostForUrl(ip)}:${port}${commonUrlPart}&path=${encodeURIComponent(path)}#${encodeURIComponent(nodeName)}`;
      result.push(vLink);
  }
  return result.join('\n');
}

// ⭐ 功能4: 修改 getCustomIPs 支持 DLS 筛选
async function getCustomIPs(env, dlsThreshold) {
    let allIPs = [];
    const threshold = Number(dlsThreshold) || 7; // 默认7 MB/s
    const addText = await getSafeEnv(env, 'ADD', "");
    if (addText) { addText.split('\n').forEach(line => { const trimmed = line.trim(); if (trimmed && !trimmed.startsWith('#')) allIPs.push(trimmed); }); }
    const addApi = await getSafeEnv(env, 'ADDAPI', "");
    if (addApi) { const urls = addApi.split('\n').filter(u => u.trim().startsWith('http')); for (const url of urls) { try { const res = await fetch(url.trim(), { headers: { 'User-Agent': 'Mozilla/5.0' } }); if (res.ok) { const text = await res.text(); text.split('\n').forEach(line => { const trimmed = line.trim(); if (trimmed && !trimmed.startsWith('#')) allIPs.push(trimmed); }); } } catch (e) {} } }
    const addCsv = await getSafeEnv(env, 'ADDCSV', "");
    if (addCsv) { 
        const urls = addCsv.split('\n').filter(u => u.trim().startsWith('http')); 
        for (const url of urls) { 
            try { 
                const res = await fetch(url.trim(), { headers: { 'User-Agent': 'Mozilla/5.0' } }); 
                if (res.ok) { 
                    const text = await res.text(); 
                    text.split('\n').forEach(line => {
                        const trimmed = line.trim();
                        if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('IP') || trimmed.includes('端口') || trimmed.includes('速度')) return;
                        const cols = trimmed.split(',');
                        const c1 = (cols.length >= 2) ? cols[1].trim() : '';
                        const isNewFmt = c1 && (c1.includes(':') || c1.includes('.') || !/^[0-9]+$/.test(c1));
                        const csvIp = cols[0].trim();
                        const csvPort = isNewFmt ? ((cols.length >= 3) ? cols[2].trim() : '') : c1;
                        const lastCol = cols[cols.length - 1].trim().toLowerCase();
                        const speedRaw = parseFloat(lastCol);
                        if (!isNaN(speedRaw)) {
                            const speedMB = lastCol.includes('kb') ? speedRaw / 1024 : speedRaw;
                            if (speedMB < threshold) return;
                        }
                        if (csvIp) allIPs.push(csvPort && csvPort !== '443' ? csvIp + ':' + csvPort : csvIp);
                    }); 
                } 
            } catch (e) {} 
        } 
    }
    return allIPs;
}

function loginPage(tgGroup, siteUrl, githubUrl, pageTitle, bgUrl, glassA, scrimA) {
    const bgStyle = `<style>:root{--glass-a:${glassA/100};--scrim-a:${scrimA/100}}${bgUrl ? `body{background:#0a0d12 url("${bgUrl}") center/cover fixed!important}body::before{content:'';position:fixed;inset:0;background:rgba(8,10,15,var(--scrim-a));z-index:0;pointer-events:none}.glass-box{position:relative;z-index:10}` : ''}</style>`;
    const _s = (s) => (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    const _j = (s) => JSON.stringify(s || '').slice(1, -1);
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=0.5, user-scalable=yes">
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>${_s(pageTitle)}</title>
    <link rel="icon" href="${LOGO_URI}">
    <style>
                /* [01] TOKENS —— 登录页独立文档，需各自带 token（与 dashPage 同套） */
        :root{
          --brand:#6366f1;--brand-hover:#7c80f6;--brand-soft:rgba(99,102,241,.14);--on-brand:#fff;
          --bg-dark:#0e1117;--bg-darker:#0a0d12;--card-bg:rgba(22,27,34,var(--glass-a));--surface-2:rgba(34,42,56,var(--glass-a));--glass-a:.72;--scrim-a:.55;--page-bg:radial-gradient(1100px 600px at 85% -10%,rgba(99,102,241,.14),transparent 60%),linear-gradient(180deg,#0e1117,#0a0d12);
          --text:#e6edf3;--text-dim:#9aa4b2;--text-subtle:#6b7689;--border:rgba(255,255,255,.08);--border-strong:rgba(255,255,255,.16);
          --radius:10px;--radius-lg:14px;--radius-xl:18px;--s-3:12px;--s-4:16px;--s-6:24px;
          --font-sans:ui-sans-serif,system-ui,-apple-system,'Segoe UI','Microsoft YaHei',sans-serif;
          --fs-xs:12px;--fs-sm:13px;--fs-md:14px;--fw-medium:500;--fw-semibold:600;--fw-bold:700;
          --shadow-lg:0 16px 40px rgba(0,0,0,.5);--dur:.16s;--ease:cubic-bezier(.4,0,.2,1);
        }
        body.light{
          --brand:#4f46e5;--brand-hover:#4338ca;--brand-soft:rgba(79,70,229,.10);
          --bg-dark:#f5f7fa;--bg-darker:#eceff4;--card-bg:rgba(255,255,255,var(--glass-a));--surface-2:rgba(241,244,249,var(--glass-a));--page-bg:radial-gradient(1100px 600px at 85% -10%,rgba(79,70,229,.10),transparent 60%),linear-gradient(180deg,#f5f7fa,#eceff4);
          --text:#0f172a;--text-dim:#566173;--text-subtle:#8693a8;--border:rgba(15,23,42,.10);--border-strong:rgba(15,23,42,.18);
          --shadow-lg:0 16px 40px rgba(16,24,40,.12);
        }
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:var(--page-bg) fixed;color:var(--text);font-family:var(--font-sans);display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px}
        .stars,.star,.meteor,.glass-shards,.shard{display:none!important}
        .glass-box{position:relative;z-index:10;background:var(--card-bg);border:1px solid var(--border);box-shadow:var(--shadow-lg);padding:36px 32px;border-radius:var(--radius-xl);text-align:center;width:100%;max-width:380px}
        .login-logo{width:64px;height:64px;border-radius:16px;display:block;margin:0 auto 18px;box-shadow:var(--shadow-lg);object-fit:cover}
        h2{margin-bottom:var(--s-6);font-weight:var(--fw-bold);font-size:1.4rem;color:var(--text);display:flex;align-items:center;justify-content:center;gap:8px}
        input{width:100%;padding:11px 14px;margin-bottom:var(--s-4);border-radius:var(--radius);border:1px solid var(--border);background:var(--bg-darker);color:var(--text);text-align:center;font-size:var(--fs-md);outline:none;transition:border-color var(--dur),box-shadow var(--dur)}
        input::placeholder{color:var(--text-subtle)}
        input:focus{border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-soft)}
        .btn-group{display:flex;flex-direction:column;gap:10px}
        button{width:100%;padding:11px;border-radius:var(--radius);border:1px solid transparent;cursor:pointer;font-size:var(--fs-md);font-weight:var(--fw-semibold);transition:all var(--dur) var(--ease)}
        .btn-unlock{background:var(--brand);color:var(--on-brand);border-color:var(--brand)}
        .btn-unlock:hover{background:var(--brand-hover)}
        .btn-primary{background:var(--surface-2);color:var(--text);border-color:var(--border)}
        .btn-primary:hover{border-color:var(--border-strong)}
        .social-links{margin-top:var(--s-3);display:flex;gap:10px}
        .pill{flex:1;background:var(--surface-2);color:var(--text);border:1px solid var(--border);padding:10px;border-radius:var(--radius);text-decoration:none;font-size:var(--fs-sm);font-weight:var(--fw-medium);display:flex;align-items:center;justify-content:center;gap:4px;white-space:nowrap;transition:all var(--dur)}
        .pill:hover{border-color:var(--brand);color:var(--brand)}
        .pill svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
        @media(max-width:480px){.glass-box{padding:28px 20px}h2{font-size:1.2rem}}
    
    </style>
</head>
<body>
    ${bgStyle}
    <div class="stars" id="starsContainer"></div>
    <div class="stars">
        <div class="meteor"></div><div class="meteor"></div><div class="meteor"></div><div class="meteor"></div>
        <div class="meteor"></div><div class="meteor"></div><div class="meteor"></div><div class="meteor"></div>
    </div>
    <div class="glass-shards">
        <div class="shard"></div><div class="shard"></div><div class="shard"></div>
        <div class="shard"></div><div class="shard"></div><div class="shard"></div>
    </div>

    <div class="glass-box">
        <img class="login-logo" src="${LOGO_URI}" alt="logo">
        <h2>管理员登陆</h2>
        <input type="password" id="pwd" placeholder="请输入密码" autofocus autocomplete="new-password" onkeypress="if(event.keyCode===13)verify()">
        <div class="btn-group">
            <button class="btn-unlock" onclick="verify()">立即登陆</button>
            <button class="btn-primary" onclick="window.open('${_j(siteUrl)}', '_blank')">我的博客</button>
        </div>
        <div class="social-links">
            <a href="javascript:void(0)" onclick="gh()" class="pill"><svg viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.57.1.78-.25.78-.55v-1.93c-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.79.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg> Github项目</a>
        </div>
    </div>

    <script>
        function generateStars() {
            const starsContainer = document.getElementById('starsContainer');
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
        generateStars();
        function gh(){fetch("?flag=github&t="+Date.now(),{keepalive:!0});window.open("${_j(githubUrl)}","_blank")}
        function verify(){
            const p = document.getElementById("pwd").value;
            if(!p) return;
            document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie = "auth=" + p + "; path=/; SameSite=Lax; Secure";
            sessionStorage.setItem("is_active", "1");
            location.reload();
        }
        window.onload = function() {
            if(!sessionStorage.getItem("is_active")) {
                document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        }
    </script>
</body>
</html>`;
}

// 👇 修改：增加 proxyCheckUrl 参数
function dashPage(host, uuid, proxyip, subpass, subdomain, converter, env, clientIP, hasAuth, tgState, cfState, add, addApi, addCsv, tgToken, tgId, cfId, cfToken, cfMail, cfKey, sysParams, dashTitle, proxyCheckUrl, dls, echEnabled, echSni, echDns, bgUrl, bgLogin, glassA, scrimA) {
    const bgStyle = `<style>:root{--glass-a:${glassA/100};--scrim-a:${scrimA/100}}${bgUrl ? `body{background:#0a0d12 url("${bgUrl}") center/cover fixed!important}body::before{content:'';position:fixed;inset:0;background:rgba(8,10,15,var(--scrim-a));z-index:0;pointer-events:none}body.light::before{background:rgba(255,255,255,var(--scrim-a))}.container{position:relative;z-index:2}` : ''}</style>`;
    const defaultSubLink = `https://${host}/${subpass}`;
    const pathParam = proxyip ? "/proxyip=" + proxyip : "/";
    const longLink = `https://${subdomain}/sub?uuid=${uuid}&${'enc'+'ryption'}=none&${'secu'+'rity'}=tls&sni=${host}&alpn=h3&fp=${FP}&allowInsecure=0&type=ws&host=${host}&path=${encodeURIComponent(pathParam)}` + (ECH ? `&ech=${encodeURIComponent((ECH_SNI ? ECH_SNI + '+' : '') + ECH_DNS)}` : '');
    const safeVal = (str) => (str || '').replace(/"/g, '&quot;');
    const jsStr = (s) => JSON.stringify(s || '').slice(1, -1);
    const getStatusLabel = (val, sysVal) => { if (!val) return ""; if (val === sysVal) return `<span class="source-tag sys">🔒 系统预设 (不可删除)</span>`; return `<span class="source-tag man">💾 后台配置 (可清除)</span>`; };
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=0.5, user-scalable=yes">
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>${safeVal(dashTitle)}</title>
    <link rel="icon" href="${LOGO_URI}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { display: none; opacity: 0; transition: opacity 0.3s; overflow-x: hidden; position: relative; }
        body.loaded { display: block; opacity: 1; }

        /* 玻璃态配色 - 柔和不刺眼 */
        /* ============================================================
           [01] TOKENS —— 唯一主题感知层（深色=:root 默认，浅色=body.light 覆盖）
           规则：颜色/阴影/圆角/间距/字号一律用 var(--token)，禁止再写裸值；
                主题差异只允许出现在这一层，禁止再写 body.light .x{} 逐组件覆盖。
           兼容：沿用旧变量名（--glass-* / --text-dim / --border 等），因为 JS 与
                内联样式直接引用它们，仅重定义取值为现代 SaaS 极简风。
           ============================================================ */
        :root {
            /* 品牌 / 强调 */
            --glass-blue: #6366f1;
            --glass-purple: #8b5cf6;
            --glass-cyan: #38bdf8;
            --glass-pink: #ec4899;
            --glass-green: #22c55e;
            --brand: #6366f1;
            --brand-hover: #7c80f6;
            --brand-soft: rgba(99, 102, 241, .14);
            --on-brand: #ffffff;
            /* 表面 / 文本 / 边框 */
            --bg-dark: #0e1117;
            --bg-darker: #0a0d12;
            --page-bg: radial-gradient(1100px 600px at 85% -10%, rgba(99,102,241,.14), transparent 60%), linear-gradient(180deg, #0e1117, #0a0d12);
            --card-bg: rgba(22, 27, 34, var(--glass-a));
            --surface-2: rgba(34, 42, 56, var(--glass-a));
            --glass-a: .72; --scrim-a: .55;
            --text: #e6edf3;
            --text-dim: #9aa4b2;
            --text-subtle: #6b7689;
            --border: rgba(255, 255, 255, .08);
            --border-strong: rgba(255, 255, 255, .16);
            --glow: rgba(99, 102, 241, .22);
            /* 语义色 + 柔和底色 */
            --success: #22c55e;
            --warning: #f59e0b;
            --danger: #ef4444;
            --info: #38bdf8;
            --success-soft: rgba(34, 197, 94, .14);
            --warning-soft: rgba(245, 158, 11, .14);
            --danger-soft: rgba(239, 68, 68, .14);
            --info-soft: rgba(56, 189, 248, .14);
            /* 阴影（深色档） */
            --shadow-sm: 0 1px 2px rgba(0, 0, 0, .4);
            --shadow-md: 0 4px 14px rgba(0, 0, 0, .45);
            --shadow-lg: 0 16px 40px rgba(0, 0, 0, .5);
            /* 结构 token（主题无关） */
            --radius-sm: 6px; --radius: 10px; --radius-lg: 14px; --radius-xl: 18px; --radius-pill: 999px;
            --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px; --s-6: 24px; --s-8: 32px;
            --font-sans: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', 'Microsoft YaHei', sans-serif;
            --font-mono: ui-monospace, 'SFMono-Regular', 'Fira Code', 'Courier New', monospace;
            --fs-xs: 12px; --fs-sm: 13px; --fs-md: 14px; --fs-lg: 16px; --fs-xl: 20px; --fs-2xl: 28px;
            --fw-medium: 500; --fw-semibold: 600; --fw-bold: 700;
            --z-modal: 1300; --z-toast: 2000;
            --dur: .16s; --ease: cubic-bezier(.4, 0, .2, 1);
        }
        body.light {
            /* 浅色主题 —— 仅在此覆盖语义 token */
            --glass-blue: #4f46e5;
            --glass-purple: #7c3aed;
            --glass-cyan: #0891b2;
            --glass-pink: #db2777;
            --glass-green: #16a34a;
            --brand: #4f46e5;
            --brand-hover: #4338ca;
            --brand-soft: rgba(79, 70, 229, .10);
            --on-brand: #ffffff;
            --bg-dark: #f5f7fa;
            --bg-darker: #eceff4;
            --page-bg: radial-gradient(1100px 600px at 85% -10%, rgba(79,70,229,.10), transparent 60%), linear-gradient(180deg, #f5f7fa, #eceff4);
            --card-bg: rgba(255, 255, 255, var(--glass-a));
            --surface-2: rgba(241, 244, 249, var(--glass-a));
            --text: #0f172a;
            --text-dim: #566173;
            --text-subtle: #8693a8;
            --border: rgba(15, 23, 42, .10);
            --border-strong: rgba(15, 23, 42, .18);
            --glow: rgba(79, 70, 229, .16);
            --success: #16a34a;
            --warning: #d97706;
            --danger: #dc2626;
            --info: #0284c7;
            --success-soft: rgba(22, 163, 74, .12);
            --warning-soft: rgba(217, 119, 6, .12);
            --danger-soft: rgba(220, 38, 38, .12);
            --info-soft: rgba(2, 132, 199, .12);
            --shadow-sm: 0 1px 2px rgba(16, 24, 40, .06);
            --shadow-md: 0 4px 14px rgba(16, 24, 40, .08);
            --shadow-lg: 0 16px 40px rgba(16, 24, 40, .12);
        }
/* [02] BASE */
        *{margin:0;padding:0;box-sizing:border-box}
        body{display:none;opacity:0;transition:opacity .3s;background:var(--page-bg) fixed;color:var(--text);font-family:var(--font-sans);font-size:var(--fs-md);line-height:1.55;min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased}
        body.loaded{display:block;opacity:1}
        a{color:var(--brand);text-decoration:none}a:hover{text-decoration:underline}
        ::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:var(--border-strong);border-radius:999px}::-webkit-scrollbar-track{background:transparent}
        .stars,.star,.meteor,.glass-shards,.glass-shards-bg,.shard{display:none!important}

        /* [03] LAYOUT */
        .container{position:relative;z-index:2;min-height:100vh;display:flex;gap:var(--s-5);padding:88px 20px 24px;max-width:1440px;margin:0 auto}
        .sidebar{width:248px;flex-shrink:0;background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:var(--s-5);box-shadow:var(--shadow-sm);height:fit-content;position:sticky;top:88px}
        .logo{display:flex;align-items:center;gap:var(--s-3);margin-bottom:var(--s-5);padding-bottom:var(--s-4);border-bottom:1px solid var(--border)}
        .logo-icon{font-size:1.8rem;line-height:1}
        .logo-text{font-size:var(--fs-lg);font-weight:var(--fw-bold);color:var(--text);letter-spacing:.2px}
        .logo-sub{font-size:var(--fs-xs);color:var(--text-subtle);letter-spacing:1px}
        .nav-menu{display:flex;flex-direction:column;gap:var(--s-1)}
        .nav-item{display:flex;align-items:center;gap:var(--s-3);padding:10px 12px;border-radius:var(--radius);color:var(--text-dim);font-size:var(--fs-md);font-weight:var(--fw-medium);cursor:pointer;transition:background var(--dur) var(--ease),color var(--dur) var(--ease);border:1px solid transparent}
        .nav-item .icon{font-size:1.1rem;width:22px;text-align:center}
        .nav-item:hover{background:var(--surface-2);color:var(--text)}
        .nav-item.active{background:var(--brand-soft);color:var(--brand);box-shadow:inset 2px 0 0 var(--brand)}
        .nav-item.active .icon{color:var(--brand)}
        /* 侧栏：标题文字块 / 分组标题 / 收起按钮 / 折叠态 */
        .logo-text-wrap{min-width:0}
        .nav-group-label{padding:14px 12px 6px;font-size:var(--fs-xs);font-weight:var(--fw-semibold);color:var(--text-subtle);text-transform:uppercase;letter-spacing:.08em}
        .sb-toggle{margin-top:var(--s-3);width:100%;display:flex;align-items:center;gap:var(--s-3);padding:10px 12px;border:0;border-top:1px solid var(--border);background:transparent;color:var(--text-dim);cursor:pointer;font-family:var(--font-sans);font-size:var(--fs-md);font-weight:var(--fw-medium);transition:background var(--dur) var(--ease),color var(--dur) var(--ease)}
        .sb-toggle:hover{background:var(--surface-2);color:var(--text)}
        .sb-toggle .icon svg{transition:transform .3s var(--ease)}
        .sidebar:not(.collapsed) .sb-toggle .icon svg{transform:rotate(180deg)}
        @media(max-width:1024px){.sb-toggle{display:none}}
        @media(min-width:1025px){
          .sidebar{transition:width .25s var(--ease)}
          .sidebar.collapsed{width:64px}
          .sidebar.collapsed .logo-text-wrap,.sidebar.collapsed .nav-group-label,.sidebar.collapsed .sb-hide-label{display:none}
          .sidebar.collapsed .logo{justify-content:center}
          .sidebar.collapsed .nav-item{font-size:0;justify-content:center;gap:0;padding-left:0;padding-right:0}
          .sidebar.collapsed .nav-item .icon{font-size:initial}
          .sidebar.collapsed .sb-toggle{justify-content:center;gap:0}
        }
        .main-content{flex:1;min-width:0}
        .top-nav{position:fixed;top:20px;right:20px;z-index:100;display:flex;gap:var(--s-2);background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius);padding:6px;box-shadow:var(--shadow-sm)}
        .top-tools{display:flex;gap:var(--s-2);align-items:center}
        .tool-btn{width:38px;height:38px;background:transparent;border:1px solid transparent;border-radius:var(--radius-sm);color:var(--text-dim);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.05rem;position:relative;transition:all var(--dur) var(--ease)}
        .tool-btn:hover{background:var(--surface-2);color:var(--text)}
        .tool-btn.logout{color:var(--danger)}
        .tool-btn.logout:hover{background:var(--danger-soft)}
        .tool-btn::before{content:attr(data-tooltip);position:absolute;bottom:-32px;left:50%;transform:translateX(-50%);padding:4px 8px;background:var(--text);color:var(--bg-dark);font-size:11px;border-radius:var(--radius-sm);white-space:nowrap;opacity:0;visibility:hidden;transition:opacity var(--dur);pointer-events:none;z-index:10}
        .tool-btn:hover::before{opacity:1;visibility:visible}
        .status-dot{width:7px;height:7px;border-radius:50%;position:absolute;top:7px;right:7px}
        .status-dot.on{background:var(--success)}
        .status-dot.off{background:var(--danger)}

        /* [04] CONTENT SECTIONS */
        .content-section{display:none}
        .content-section.active{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:var(--s-5);animation:fadeIn .25s var(--ease)}
        #section-subscription.active,#section-whitelist.active,#section-nodes.active,#section-logs.active,#section-background.active{display:block}
        #section-subscription .card,#section-whitelist .card,#section-nodes .card,#section-logs .card,#section-background .card{margin-bottom:var(--s-5)}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

        /* [04] CARD */
        .card{background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:var(--s-6);box-shadow:var(--shadow-sm);transition:border-color var(--dur) var(--ease)}
        .card:hover{border-color:var(--border-strong)}
        .card-title{font-size:var(--fs-lg);font-weight:var(--fw-semibold);color:var(--text);margin-bottom:var(--s-5);display:flex;align-items:center;gap:var(--s-2)}
        .card-title .icon{font-size:1.15rem}

        /* sphere stat */
        .sphere-card{background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:var(--s-6);box-shadow:var(--shadow-sm);text-align:center}
        .stats-sphere{width:180px;height:180px;margin:var(--s-4) auto;position:relative;display:flex;align-items:center;justify-content:center}
        .sphere-ring{position:absolute;border-radius:50%;border:2px solid var(--border)}
        .sphere-ring:nth-child(1){width:180px;height:180px;border-top-color:var(--brand);border-right-color:var(--brand)}
        .sphere-ring:nth-child(2){width:148px;height:148px;border-bottom-color:var(--glass-purple);border-left-color:var(--glass-purple)}
        .sphere-ring:nth-child(3){width:116px;height:116px}
        .sphere-center{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:18%}
        .sphere-value{font-size:2.4rem;font-weight:var(--fw-bold);color:var(--brand);font-family:var(--font-mono);line-height:1.1;word-break:break-word;text-align:center}
        .sphere-value[data-length="short"]{font-size:2.6rem}
        .sphere-value[data-length="medium"]{font-size:2rem}
        .sphere-value[data-length="long"]{font-size:1.5rem}
        .sphere-value[data-length="verylong"]{font-size:1.1rem}
        .sphere-labels{margin-top:var(--s-3)}
        .sphere-label{font-size:var(--fs-sm);color:var(--text-dim);font-weight:var(--fw-semibold);letter-spacing:.5px;display:block;margin-bottom:2px}
        .sphere-subtitle{font-size:var(--fs-xs);color:var(--text-subtle);display:block}

        /* stats panel */
        .stats-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:var(--s-3);margin-bottom:var(--s-4)}
        .stat-box{background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:var(--s-4);text-align:center}
        .stat-label{font-size:var(--fs-xs);color:var(--text-dim);margin-bottom:var(--s-1)}
        .stat-value{font-size:1.3rem;font-weight:var(--fw-bold);color:var(--text);font-family:var(--font-mono);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;display:block}
        .stat-value.ip-value{font-size:clamp(.8rem,2vw,1rem);white-space:normal;word-break:break-all;line-height:1.3}

        /* forms */
        .input-block{margin-bottom:var(--s-4)}
        label{display:block;font-size:var(--fs-xs);color:var(--text-dim);margin-bottom:6px;font-weight:var(--fw-medium)}
        input[type="text"],input[type="password"],textarea,select{width:100%;background:var(--bg-darker);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);padding:10px 12px;font-family:var(--font-sans);font-size:var(--fs-md);outline:none;transition:border-color var(--dur),box-shadow var(--dur)}
        input::placeholder,textarea::placeholder{color:var(--text-subtle)}
        input[type="text"]:focus,input[type="password"]:focus,textarea:focus,select:focus{border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-soft)}
        textarea{min-height:100px;resize:vertical;font-family:var(--font-mono);font-size:var(--fs-sm);line-height:1.5}
        .input-group-row{display:flex;gap:var(--s-2);align-items:flex-end}
        .input-group-row input{flex:1}

        /* buttons */
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:var(--s-2);padding:9px 16px;border:1px solid transparent;border-radius:var(--radius);cursor:pointer;font-family:var(--font-sans);font-weight:var(--fw-semibold);font-size:var(--fs-md);line-height:1;transition:all var(--dur) var(--ease);white-space:nowrap}
        .btn:active{transform:translateY(1px)}
        .btn-primary{background:var(--brand);color:var(--on-brand);border-color:var(--brand)}
        .btn-primary:hover{background:var(--brand-hover);border-color:var(--brand-hover)}
        .btn-secondary{background:var(--surface-2);color:var(--text);border-color:var(--border)}
        .btn-secondary:hover{border-color:var(--border-strong)}
        .btn-success{background:var(--success);color:#fff;border-color:var(--success)}
        .btn-success:hover{filter:brightness(1.06)}
        .btn-danger{background:var(--danger);color:#fff;border-color:var(--danger)}
        .btn-danger:hover{filter:brightness(1.06)}
        .btn-group{display:flex;gap:var(--s-3);margin-top:var(--s-4);flex-wrap:wrap}
        .btn-group .btn{flex:1;min-width:120px}
        .btn-del{background:var(--danger-soft);color:var(--danger);border:1px solid transparent;border-radius:var(--radius-sm);padding:5px 10px;cursor:pointer;font-size:var(--fs-xs);font-weight:var(--fw-semibold)}
        .btn-del:hover{background:var(--danger);color:#fff}

        /* log + table */
        .log-box{font-family:var(--font-mono);font-size:var(--fs-sm);max-height:300px;overflow-y:auto;background:var(--bg-darker);padding:var(--s-3);border:1px solid var(--border);border-radius:var(--radius)}
        .log-entry{border-bottom:1px solid var(--border);padding:8px 0;display:flex;align-items:center;gap:var(--s-3)}
        .log-entry:hover{background:var(--surface-2)}
        .log-time{color:var(--text-dim);width:150px;font-size:var(--fs-xs)}
        .log-ip{color:var(--text);width:200px;font-family:var(--font-mono)}
        .log-loc{color:var(--text-dim);flex:1;font-size:var(--fs-xs)}
        .log-tag{padding:2px 8px;background:var(--warning-soft);color:var(--warning);font-size:var(--fs-xs);font-weight:var(--fw-semibold);border-radius:var(--radius-pill)}
        .log-tag.green{background:var(--success-soft);color:var(--success)}
        .wl-table{width:100%;border-collapse:collapse;font-size:var(--fs-sm);margin-top:var(--s-2)}
        .wl-table th,.wl-table td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--border)}
        .wl-table th{color:var(--text-dim);font-weight:var(--fw-semibold);font-size:var(--fs-xs)}
        .wl-table tr:hover{background:var(--surface-2)}
        .sys-tag{background:var(--surface-2);color:var(--text-dim);padding:3px 8px;font-size:var(--fs-xs);border-radius:var(--radius-pill)}
        .source-tag{font-size:var(--fs-xs);margin-top:4px;display:block}
        .source-tag.sys{color:var(--warning)}
        .source-tag.man{color:var(--success)}

        /* modal */
        .modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:var(--z-modal);justify-content:center;align-items:center;padding:var(--s-4)}
        .modal.show{display:flex}
        .modal-content{background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);padding:var(--s-6);width:100%;max-width:500px;position:relative}
        .modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--s-5);font-weight:var(--fw-bold);font-size:var(--fs-lg);color:var(--text)}
        .modal-head span{display:flex;align-items:center;gap:var(--s-2)}
        .close-btn{cursor:pointer;color:var(--text-dim);font-size:var(--fs-xl);width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border);border-radius:var(--radius-sm);transition:all var(--dur)}
        .close-btn:hover{color:var(--danger);border-color:var(--danger)}
        .modal-btns{display:flex;gap:var(--s-3);margin-top:var(--s-5);flex-wrap:wrap}
        .modal-btns button{flex:1;min-width:100px}

        /* toast（#toast 由 JS 用 style.opacity 控制显隐，保持 opacity:0 基线） */
        #toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:var(--text);color:var(--bg-dark);padding:10px 20px;border-radius:var(--radius);opacity:0;transition:opacity var(--dur);pointer-events:none;font-weight:var(--fw-semibold);font-size:var(--fs-sm);box-shadow:var(--shadow-md);z-index:var(--z-toast)}

        /* network module */
        .network-cards-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--s-3);margin-bottom:var(--s-3)}
        .network-card{background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:var(--s-4);transition:border-color var(--dur);position:relative;overflow:hidden;--flag-badge-url:none}
        .network-card:hover{border-color:var(--border-strong)}
        .network-card.has-flag-badge::after{content:'';position:absolute;bottom:-12px;right:-3px;width:90px;height:60px;background-image:var(--flag-badge-url);background-repeat:no-repeat;background-position:left center;background-size:cover;opacity:.15;transform:rotate(10deg);border-radius:var(--radius);pointer-events:none;z-index:1}
        .network-card-title{font-size:var(--fs-sm);font-weight:var(--fw-semibold);color:var(--text);margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;position:relative;z-index:2}
        .title-text{display:flex;flex-direction:column}
        .title-main{font-size:var(--fs-sm);font-weight:var(--fw-semibold)}
        .title-subtitle{font-size:var(--fs-xs);font-weight:400;color:var(--text-dim);margin-top:1px}
        .cf-subtitle-rich{display:inline-flex;align-items:center;gap:4px}
        .cf-subtitle-v4{color:var(--success);font-weight:var(--fw-semibold)}
        .cf-subtitle-v6{color:var(--info);font-weight:var(--fw-semibold)}
        .cf-subtitle-sep{color:var(--text-subtle);font-size:.65rem}
        .cf-subtitle-switch{cursor:pointer;opacity:.6;text-decoration:underline;text-underline-offset:2px}
        .cf-subtitle-switch:hover{opacity:1}
        .network-info-content{display:flex;flex-direction:column;position:relative;z-index:2}
        .ip-text{color:var(--brand);font-weight:var(--fw-bold);font-family:var(--font-mono);font-size:var(--fs-md);word-break:break-all}
        .ip-text .error{color:var(--danger)}
        .ip-text.clickable{cursor:pointer;position:relative;padding-right:20px}
        .ip-text.clickable::after{content:'';position:absolute;right:0;top:50%;width:13px;height:13px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2388a4bf' stroke-width='2.5' stroke-linecap='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cline x1='16.5' y1='16.5' x2='21' y2='21'/%3E%3C/svg%3E");background-size:contain;background-repeat:no-repeat;transform:translateY(-50%);opacity:.5}
        .ip-text.clickable:hover::after{opacity:1}
        .ip-text.clickable.is-loading::after{background-image:none;border:2px solid var(--brand-soft);border-top-color:var(--brand);border-radius:50%;width:12px;height:12px;animation:ipIconSpin .9s linear infinite}
        @keyframes ipIconSpin{to{transform:translateY(-50%) rotate(360deg)}}
        .location-text{font-size:var(--fs-xs);color:var(--text-dim);margin-top:4px}
        .country-text{transition:filter .3s}
        .network-tip{margin-top:8px;font-size:.7rem;color:var(--text-subtle)}
        .status-indicator{width:9px;height:9px;border-radius:50%;display:inline-block;flex-shrink:0}
        .status-loading{background:var(--warning);animation:pulse-loading 1.5s ease-in-out infinite}
        .status-success{background:var(--success)}
        .status-error{background:var(--danger)}
        @keyframes pulse-loading{0%,100%{opacity:1}50%{opacity:.4}}
        .network-info-tip{font-size:var(--fs-xs);color:var(--text-dim);margin-top:var(--s-3)}
        .network-info-tip a{color:var(--brand)}

        /* ip detail popup */
        .ip-detail-popup{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center}
        .ip-detail-content{background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);padding:var(--s-6);max-width:500px;width:90%;max-height:80vh;overflow-y:auto;color:var(--text)}
        .ip-detail-content h3{margin:0 0 var(--s-4);font-size:var(--fs-lg)}
        .ip-detail-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:var(--fs-sm)}
        .ip-detail-row .label{color:var(--text-dim)}
        .ip-detail-row .value{font-weight:var(--fw-semibold)}
        .ip-detail-close{margin-top:var(--s-4);width:100%;padding:9px;border:none;border-radius:var(--radius);background:var(--brand);color:#fff;cursor:pointer;font-size:var(--fs-md)}
        .ip-detail-close:hover{background:var(--brand-hover)}
        .ip-type-residential{color:var(--success);font-weight:var(--fw-semibold)}
        .ip-type-hosting{color:var(--danger);font-weight:var(--fw-semibold)}
        .ip-type-business{color:var(--warning);font-weight:var(--fw-semibold)}
        .badge-success{color:var(--success)}.badge-warning{color:var(--warning)}.badge-danger{color:var(--danger)}

        /* latency module */
        .latency-cards-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--s-3)}
        .latency-card{background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:12px 14px;position:relative;overflow:hidden;transition:border-color var(--dur)}
        .latency-card:hover{border-color:var(--border-strong)}
        .latency-card-header{display:flex;justify-content:space-between;align-items:center;width:100%;position:relative;z-index:2}
        .latency-card-info{display:flex;align-items:center;gap:10px}
        .latency-card-icon-wrapper{width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-sm)}
        .latency-card-icon-wrapper svg{width:17px;height:17px}
        .latency-card-text{display:flex;flex-direction:column}
        .latency-card-name{font-size:var(--fs-sm);font-weight:var(--fw-bold);color:var(--text)}
        .latency-card-region{font-size:.65rem;font-weight:var(--fw-semibold);letter-spacing:.5px;display:inline-block;padding:1px 6px;border-radius:var(--radius-sm)}
        .latency-card-region[data-region="国内"]{color:var(--success);background:var(--success-soft)}
        .latency-card-region[data-region="国际"]{color:var(--brand);background:var(--brand-soft)}
        .latency-status{font-family:var(--font-mono);font-size:1.2rem;font-weight:var(--fw-bold);color:var(--brand);min-width:60px;text-align:right;position:relative;z-index:2}
        .latency-status .unit{font-family:var(--font-sans);font-size:.7rem;font-weight:var(--fw-semibold);opacity:.7;margin-left:2px}
        .latency-graph-container{position:absolute;inset:0;z-index:1;pointer-events:none;opacity:.12}
        .graph-grid{position:absolute;inset:0;background:repeating-linear-gradient(90deg,var(--border) 0,var(--border) 1px,transparent 1px,transparent 25%),repeating-linear-gradient(0deg,var(--border) 0,var(--border) 1px,transparent 1px,transparent 33%);opacity:.4}
        .latency-ecg{width:100%;height:100%}
        .ecg-path{fill:none;stroke:var(--brand);stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round;transition:d .4s var(--ease)}
        .ecg-path-bg{fill:none;stroke:var(--border);stroke-width:1}
        .ecg-cursor{fill:var(--brand);transition:cx .3s ease,cy .3s ease}
        .latency-card-icon-wrapper[data-site="github"] svg path,.latency-card-icon-wrapper[data-site="x.com"] svg path{fill:var(--text)!important}

        /* [04b] ICONS —— 统一描边图标（sprite + <use>，currentColor 自动跟随主题/激活态） */
        svg{stroke-linecap:round;stroke-linejoin:round}
        .icon{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;flex-shrink:0;line-height:0;font-size:0}
        .icon svg{width:100%;height:100%;stroke:currentColor;fill:none;stroke-width:2}
        .nav-item .icon,.card-title .icon{width:18px;height:18px;font-size:0;text-align:initial}
        .logo-icon{width:30px;height:30px;color:var(--brand);font-size:0;line-height:0;display:inline-flex}
        .logo-icon svg{width:30px;height:30px;stroke:var(--brand);fill:none;stroke-width:1.8}
        .logo-icon img{width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm);display:block}
        .tool-btn svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2}
        .btn svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2.2;flex-shrink:0}
        .ico-inline{width:14px;height:14px;vertical-align:-2px;stroke:currentColor;fill:none;stroke-width:2;display:inline-block}
        .modal-head svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2}
        .slider-row{display:flex;align-items:center;gap:var(--s-3)}
        .slider-row input[type=range]{flex:1;-webkit-appearance:none;appearance:none;height:6px;border-radius:var(--radius-pill);background:var(--surface-2);border:1px solid var(--border);outline:none}
        .slider-row input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;border-radius:50%;background:var(--brand);cursor:pointer;border:2px solid var(--card-bg)}
        .slider-row input[type=range]::-moz-range-thumb{width:16px;height:16px;border:none;border-radius:50%;background:var(--brand);cursor:pointer}
        .slider-row input[type=number]{width:74px;flex:none;text-align:center}
        .slider-unit{color:var(--text-dim);font-size:var(--fs-sm)}

        /* [05] RESPONSIVE */
        @media(max-width:1200px){.network-cards-grid{grid-template-columns:repeat(2,1fr)}.latency-cards-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:1024px){
          .container{flex-direction:column;padding:72px 12px 16px}
          .sidebar{width:100%;position:relative;top:0}
          .logo{justify-content:flex-start}
          .nav-menu{flex-direction:row;flex-wrap:wrap}
          .nav-item{flex:1;min-width:110px;justify-content:center}
        }
        @media(max-width:768px){
          .container{padding:60px 10px 12px;gap:var(--s-3)}
          .sidebar{padding:var(--s-3)}
          .logo{margin-bottom:var(--s-3);padding-bottom:var(--s-3)}
          .logo-icon,.logo-icon svg{width:24px;height:24px}
          .nav-menu{flex-direction:row;flex-wrap:wrap;gap:6px}
          .nav-item{flex:1 1 auto;min-width:96px;height:40px;font-size:var(--fs-sm)}
          .nav-group-label{flex:1 0 100%;padding:6px 10px 2px}
          .top-nav{top:8px;right:8px;gap:4px;padding:5px}
          .tool-btn{width:36px;height:36px}
          .tool-btn::before{display:none}
          .card,.sphere-card{padding:var(--s-4)}
          .network-cards-grid,.latency-cards-grid{grid-template-columns:1fr}
          .input-group-row{flex-direction:column;align-items:stretch}
          .btn-group{flex-direction:column}
          .btn-group .btn{min-width:0}
          .log-entry{flex-direction:column;align-items:flex-start;gap:4px}
          .log-time,.log-ip,.log-loc{width:100%}
          .modal-content{padding:var(--s-5);max-height:90vh;overflow-y:auto}
          .modal-btns{flex-direction:column}
          .wl-table th,.wl-table td{padding:8px;word-break:break-all}
          .slider-row input[type=number]{width:60px}
        }
        @media(max-width:480px){
          .container{padding:56px 8px 10px}
          .nav-item{min-width:84px;height:38px}
          .card,.sphere-card{padding:14px}
          .card-title{font-size:var(--fs-md);margin-bottom:var(--s-4)}
          .logo-text{font-size:var(--fs-md)}
          .modal{padding:var(--s-2)}
          .modal-content{padding:var(--s-4)}
        }
    
    </style>
</head>
<body id="mainBody">
    ${bgStyle}
    <svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false">
        <symbol id="i-gem" viewBox="0 0 24 24"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></symbol>
        <symbol id="i-dash" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></symbol>
        <symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></symbol>
        <symbol id="i-sub" viewBox="0 0 24 24"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></symbol>
        <symbol id="i-shield" viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></symbol>
        <symbol id="i-nodes" viewBox="0 0 24 24"><rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></symbol>
        <symbol id="i-logs" viewBox="0 0 24 24"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></symbol>
        <symbol id="i-theme" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></symbol>
        <symbol id="i-tg" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></symbol>
        <symbol id="i-cloud" viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></symbol>
        <symbol id="i-logout" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></symbol>
        <symbol id="i-zap" viewBox="0 0 24 24"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></symbol>
        <symbol id="i-refresh" viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></symbol>
        <symbol id="i-save" viewBox="0 0 24 24"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></symbol>
        <symbol id="i-help" viewBox="0 0 24 24"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></symbol>
        <symbol id="i-lock" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></symbol>
        <symbol id="i-image" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></symbol>
        <symbol id="i-collapse" viewBox="0 0 24 24"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></symbol>
    </svg>
    <!-- 玻璃碎裂背景 -->
    <div class="glass-shards-bg">
        <div class="shard"></div>
        <div class="shard"></div>
        <div class="shard"></div>
        <div class="shard"></div>
        <div class="shard"></div>
        <div class="shard"></div>
        <div class="shard"></div>
    </div>

    <!-- 星空背景 -->
    <div class="stars" id="starsContainer"></div>

    <!-- 流星雨 -->
    <div class="stars">
        <div class="meteor"></div>
        <div class="meteor"></div>
        <div class="meteor"></div>
        <div class="meteor"></div>
        <div class="meteor"></div>
        <div class="meteor"></div>
        <div class="meteor"></div>
        <div class="meteor"></div>
        <div class="meteor"></div>
        <div class="meteor"></div>
    </div>

    <div class="container">
        <!-- 左侧边栏 -->
        <div class="sidebar" id="sidebar">
            <div class="logo">
                <div class="logo-icon"><img src="${LOGO_URI}" alt="logo"></div>
                <div class="logo-text-wrap">
                    <div class="logo-text">CFW 控制台</div>
                    <div class="logo-sub">CFW DASHBOARD</div>
                </div>
            </div>
            <div class="nav-menu">
                <div class="nav-item active" onclick="showSection('dashboard')">
                    <span class="icon"><svg viewBox="0 0 24 24"><use href="#i-dash"/></svg></span> 控制台
                </div>
                <div class="nav-item" onclick="showSection('network')">
                    <span class="icon"><svg viewBox="0 0 24 24"><use href="#i-globe"/></svg></span> 网络信息
                </div>
                <div class="nav-item" onclick="showSection('subscription')">
                    <span class="icon"><svg viewBox="0 0 24 24"><use href="#i-sub"/></svg></span> 订阅
                </div>
                <div class="nav-item" onclick="showSection('whitelist')">
                    <span class="icon"><svg viewBox="0 0 24 24"><use href="#i-shield"/></svg></span> 白名单
                </div>
                <div class="nav-item" onclick="showSection('nodes')">
                    <span class="icon"><svg viewBox="0 0 24 24"><use href="#i-nodes"/></svg></span> 自定义节点
                </div>
                <div class="nav-item" onclick="showSection('logs')">
                    <span class="icon"><svg viewBox="0 0 24 24"><use href="#i-logs"/></svg></span> 日志
                </div>
                <div class="nav-group-label">设置</div>
                <div class="nav-item" onclick="showSection('background')">
                    <span class="icon"><svg viewBox="0 0 24 24"><use href="#i-image"/></svg></span> 背景设置
                </div>
            </div>
            <button class="sb-toggle" onclick="toggleSidebar()">
                <span class="icon"><svg viewBox="0 0 24 24"><use href="#i-collapse"/></svg></span>
                <span class="sb-hide-label">收起</span>
            </button>
        </div>

        <!-- 右上角工具栏 -->
        <div class="top-nav">
            <button class="tool-btn" onclick="toggleTheme()" data-tooltip="切换主题"><svg viewBox="0 0 24 24"><use href="#i-theme"/></svg></button>
            <button class="tool-btn" onclick="showModal('tgModal')" data-tooltip="TG通知"><svg viewBox="0 0 24 24"><use href="#i-tg"/></svg> <span class="status-dot ${tgState ? 'on' : 'off'}"></span></button>
            <button class="tool-btn" onclick="showModal('cfModal')" data-tooltip="CF统计"><svg viewBox="0 0 24 24"><use href="#i-cloud"/></svg> <span class="status-dot ${cfState ? 'on' : 'off'}"></span></button>
            <button class="tool-btn logout" onclick="logout()" data-tooltip="退出"><svg viewBox="0 0 24 24"><use href="#i-logout"/></svg></button>
        </div>

        <!-- 主内容区 -->
        <div class="main-content">
            <!-- 控制台面板 -->
            <div id="section-dashboard" class="content-section active">
                <!-- 3D 球体统计卡片 -->
                <div class="sphere-card">
                    <div class="stats-sphere">
                        <div class="sphere-ring"></div>
                        <div class="sphere-ring"></div>
                        <div class="sphere-ring"></div>
                        <div class="sphere-center">
                            <div class="sphere-value" id="reqCount" data-length="short">0</div>
                        </div>
                    </div>
                    <div class="sphere-labels">
                        <div class="sphere-label">今日请求</div>
                        <div class="sphere-subtitle" id="reqSubtitle">Cloudflare 统计</div>
                    </div>
                    <button class="btn btn-primary" style="width:100%;margin-top:20px" onclick="updateStats()"><svg viewBox="0 0 24 24"><use href="#i-refresh"/></svg> 刷新统计</button>

                    <!-- 系统状态 - 移到按钮下方 -->
                    <div style="margin-top:25px;padding-top:20px;border-top:1px solid var(--border)">
                        <div class="card-title" style="margin-bottom:15px"><span class="icon"><svg viewBox="0 0 24 24"><use href="#i-dash"/></svg></span> 系统状态</div>
                        <div class="stats-panel">
                            <div class="stat-box">
                                <div class="stat-label">当前IP</div>
                                <div class="stat-value ip-value" id="currentIp">...</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">Google延迟</div>
                                <div class="stat-value" id="googleStatus">...</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">存储状态</div>
                                <div class="stat-value" id="kvStatus">...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 网络信息面板 -->
            <div id="section-network" class="content-section">
                <div class="card">
                    <div class="card-title"><span class="icon"><svg viewBox="0 0 24 24"><use href="#i-globe"/></svg></span> IP 信息检测</div>
                    <div class="network-cards-grid">
                        <div class="network-card">
                            <div class="network-card-title"><span class="status-indicator status-loading" id="status-ipip"></span><div class="title-text"><div class="title-main">国内测试</div><div class="title-subtitle" id="ipip-subtitle"></div></div></div>
                            <div class="network-info-content">
                                <span id="ipip-ip" class="ip-text" data-raw-value="" data-mask-type="ip" data-display-state="loading">加载中...</span>
                                <div class="location-text"><span id="ipip-country" class="country-text" data-raw-value="" data-mask-type="location" data-display-state="loading"></span></div>
                                <div class="network-tip">· 您访问国内站点所使用的IP</div>
                            </div>
                        </div>
                        <div class="network-card">
                            <div class="network-card-title"><span class="status-indicator status-loading" id="status-overseas"></span><div class="title-text"><div class="title-main">国外测试</div><div class="title-subtitle">漏网之鱼</div></div></div>
                            <div class="network-info-content">
                                <span id="overseas-ip" class="ip-text" data-raw-value="" data-mask-type="ip" data-display-state="loading">加载中...</span>
                                <div class="location-text"><span id="overseas-country" class="country-text" data-raw-value="" data-mask-type="location" data-display-state="loading"></span></div>
                                <div class="network-tip">· 您访问没有被封的国外站点所使用的IP</div>
                            </div>
                        </div>
                        <div class="network-card">
                            <div class="network-card-title"><span class="status-indicator status-loading" id="status-cf"></span><div class="title-text"><div class="title-main">CloudFlare</div><div class="title-subtitle cf-subtitle-rich" id="cf-subtitle">ProxyIP</div></div></div>
                            <div class="network-info-content">
                                <span id="cf-ip" class="ip-text" data-raw-value="" data-mask-type="ip" data-display-state="loading">加载中...</span>
                                <div class="location-text"><span id="cf-country" class="country-text" data-raw-value="" data-mask-type="location" data-display-state="loading"></span></div>
                                <div class="network-tip">· 您访问CFCDN站点所使用的落地IP</div>
                            </div>
                        </div>
                        <div class="network-card">
                            <div class="network-card-title"><span class="status-indicator status-loading" id="status-twitter"></span><div class="title-text"><div class="title-main">墙外测试</div><div class="title-subtitle" id="twitter-subtitle"></div></div></div>
                            <div class="network-info-content">
                                <span id="twitter-ip" class="ip-text" data-raw-value="" data-mask-type="ip" data-display-state="loading">加载中...</span>
                                <div class="location-text"><span id="twitter-country" class="country-text" data-raw-value="" data-mask-type="location" data-display-state="loading"></span></div>
                                <div id="twitter-tip" class="network-tip">· 您访问墙外站点所使用的IP</div>
                            </div>
                        </div>
                    </div>
                    <div class="network-info-tip">💡 <b>国内测试</b> 由分流规则决定，<b>国外测试</b> 由优选IP决定，<b>CF、墙外入口、ChatGPT</b> 由 PROXYIP 决定</div>
                    <div class="card-title" style="margin-top:25px;padding-top:20px;border-top:1px solid var(--border)"><span class="icon"><svg viewBox="0 0 24 24"><use href="#i-zap"/></svg></span> 延迟测试</div>
                    <div class="latency-cards-grid" id="latency-cards"></div>
                    <div class="network-info-tip">💡 更多测试项目，可前往 <a href="https://ip.skk.moe/" target="_blank" rel="noopener">ip.skk.moe</a> 自行测试</div>
                </div>
            </div>

            <div id="section-subscription" class="content-section">
                <div class="card">
                    <div class="card-title"><span class="icon"><svg viewBox="0 0 24 24"><use href="#i-sub"/></svg></span> 快速订阅</div>
                    <div class="input-group-row" style="margin-bottom:15px">
                        <input type="text" id="autoSub" value="${defaultSubLink}" readonly style="flex:1">
                        <button class="btn btn-secondary" onclick="copyId('autoSub')">复制</button>
                    </div>
                    <div class="input-block">
                        <label>订阅源地址 (Sub Domain)</label>
                        <input type="text" id="subDom" value="${subdomain}" oninput="updateLink()">
                    </div>
                    <div class="input-block">
                        <label>Worker 域名 (SNI/Host)</label>
                        <input type="text" id="hostDom" value="${host}" oninput="updateLink()">
                    </div>
                    <div class="input-block">
                        <label>中转cdn地址 (cdn访问path路径)</label>
                        <div class="input-group-row">
                            <input type="text" id="pIp" value="${proxyip}" oninput="updateLink()">
                            <!-- 👇 修改：传入 proxyCheckUrl -->
                            <button class="btn btn-primary" onclick="checkProxy()">检测</button>
                        </div>
                    </div>
                    <div style="margin:15px 0;padding:15px;border:1px solid var(--border);border-radius:12px;background:var(--surface-2)">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
                            <span style="font-size:0.9rem;font-weight:600;color:var(--glass-cyan)"><svg viewBox="0 0 24 24" class="ico-inline"><use href="#i-lock"/></svg> ECH + 指纹伪装</span>
                            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;margin:0">
                                <input type="checkbox" id="echSwitch" ${echEnabled === 'true' ? 'checked' : ''} onchange="updateEchUI();updateLink()">
                                <span id="echLabel" style="font-size:0.8rem">${echEnabled === 'true' ? '已启用' : '已关闭'}</span>
                            </label>
                        </div>
                        <div id="echDetail" style="${echEnabled === 'true' ? '' : 'display:none'}">
                            <div class="input-block" style="margin-bottom:8px">
                                <label style="font-size:0.8rem">ECH 域名 (SNI)</label>
                                <input type="text" id="echSni" value="${safeVal(echSni)}" oninput="updateLink()" placeholder="cloudflare-ech.com">
                            </div>
                            <div class="input-block" style="margin-bottom:8px">
                                <label style="font-size:0.8rem">ECH DoH 地址</label>
                                <input type="text" id="echDns" value="${safeVal(echDns)}" placeholder="https://doh.example.com/dns-query">
                            </div>
                            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                                <span style="font-size:0.8rem;color:var(--text-dim)">指纹 (FP):</span>
                                <span id="fpDisplay" style="font-size:0.8rem;color:var(--glass-green);font-weight:600">${echEnabled === 'true' ? 'firefox' : 'randomized'}</span>
                                <span style="font-size:0.75rem;color:var(--text-dim)">(ECH开→firefox, 关→randomized)</span>
                            </div>
                            <div style="display:flex;gap:8px">
                                <button class="btn btn-success" style="flex:1;padding:8px;font-size:0.85rem" onclick="saveEchConfig()"><svg viewBox="0 0 24 24"><use href="#i-save"/></svg> 保存 ECH 配置</button>
                                <button class="btn btn-primary" style="padding:8px 12px;font-size:0.85rem;white-space:nowrap" onclick="showECHHelp()"><svg viewBox="0 0 24 24"><use href="#i-help"/></svg> ECH 是什么？</button>
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-bottom:10px;font-size:0.85rem">
                        <input type="checkbox" id="cMode" onchange="tgCM()">
                        <label for="cMode" style="margin:0;text-transform:none">启用转换模式</label>
                    </div>
                    <div class="input-block">
                        <label>手动订阅链接</label>
                        <textarea id="finalLink">${longLink}</textarea>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-success" onclick="copyId('finalLink')">复制链接</button>
                        <button class="btn btn-primary" onclick="testSub()">测试访问</button>
                    </div>
                </div>
            </div>

            <!-- 白名单面板 -->
            <div id="section-whitelist" class="content-section">
                <div class="card">
                    <div class="card-title"><span class="icon"><svg viewBox="0 0 24 24"><use href="#i-shield"/></svg></span> 白名单管理</div>
                    <div class="input-group-row" style="margin-bottom:15px">
                        <input type="text" id="newWhitelistIp" placeholder="输入 IP 地址 (IPv4/IPv6)">
                        <button class="btn btn-success" onclick="addWhitelist()">添加</button>
                        <button class="btn btn-secondary" onclick="loadWhitelist()">刷新</button>
                    </div>
                    <div style="max-height:300px;overflow-y:auto;border:1px solid var(--border)">
                        <table class="wl-table">
                            <thead><tr><th>IP 地址</th><th style="width:100px">操作</th></tr></thead>
                            <tbody id="whitelistBody"><tr><td colspan="2" style="text-align:center">加载中...</td></tr></tbody>
                        </table>
                    </div>
                    <div style="font-size:0.75rem;color:var(--text-dim);margin-top:10px">💡 提示：系统内置 IP 需要修改代码或环境变量才能删除</div>
                </div>
            </div>

            <!-- 节点配置面板 -->
            <div id="section-nodes" class="content-section">
                <div class="card">
                    <div class="card-title"><span class="icon"><svg viewBox="0 0 24 24"><use href="#i-nodes"/></svg></span> 优选IP与远程配置</div>
                    <div style="font-size:0.8rem;color:var(--danger);margin-bottom:15px;padding:10px;background:var(--danger-soft);border-left:3px solid var(--danger)">
                        ⚠️ 注意：若要在此生效，请确保 Cloudflare 后台未设置对应环境变量 (ADD/ADDAPI/ADDCSV)
                    </div>
                    <div style="font-size:0.8rem;color:var(--danger);margin-bottom:15px;padding:10px;background:var(--danger-soft);border-left:3px solid var(--danger)">
                        ⚠️ 注意：若要在此生效，请确保 Cloudflare 后台或者硬编码未设置SUB订阅器 (详情顶部配置DEFAULT_SUB_DOMAIN)
                    </div>
                    <div class="input-block">
                        <label>ADD - 本地优选 IP (格式: IP:Port#Name，一行一个)</label>
                        <textarea id="inpAdd" placeholder="1.1.1.1:443#US">${safeVal(add)}</textarea>
                    </div>
                    <div class="input-block">
                        <label>ADDAPI - 远程优选 TXT 链接 (支持多行)</label>
                        <textarea id="inpAddApi" placeholder="https://example.com/ips.txt">${safeVal(addApi)}</textarea>
                    </div>
                    <div class="input-block">
                        <label>ADDCSV - 远程优选 CSV 链接 (支持多行)</label>
                        <textarea id="inpAddCsv" placeholder="https://example.com/ips.csv">${safeVal(addCsv)}</textarea>
                    </div>
                    <!-- ⭐ 功能4: DLS 设置输入框 -->
                    <div class="input-block">
                        <label>DLS (ADDCSV专用) - 速度下限筛选 (单位: MB/s)</label>
                        <input type="text" id="inpDls" placeholder="5000" value="${safeVal(dls)}">
                    </div>
                    <button class="btn btn-success" style="width:100%" onclick="saveNodeConfig()"><svg viewBox="0 0 24 24"><use href="#i-save"/></svg> 保存配置</button>
                </div>
            </div>

            <!-- 日志面板 -->
            <div id="section-logs" class="content-section">
                <div class="card">
                    <div class="card-title">
                        <span><span class="icon"><svg viewBox="0 0 24 24"><use href="#i-logs"/></svg></span> 操作日志</span>
                    </div>
                    <div class="log-box" id="logBox">加载中...</div>
                    <button class="btn btn-secondary" style="width:100%;margin-top:15px" onclick="loadLogs()"><svg viewBox="0 0 24 24"><use href="#i-refresh"/></svg> 刷新日志</button>
                </div>
            </div>

            <!-- 背景设置面板 -->
            <div id="section-background" class="content-section">
                <div class="card">
                    <div class="card-title"><span class="icon"><svg viewBox="0 0 24 24"><use href="#i-image"/></svg></span> 背景设置</div>
                    <div class="input-block">
                        <label>登录页背景图 URL</label>
                        <input type="text" id="bgLogin" value="${safeVal(bgLogin)}" placeholder="https://example.com/login-bg.jpg">
                    </div>
                    <div class="input-block">
                        <label>控制台背景图 URL</label>
                        <input type="text" id="bgDash" value="${safeVal(bgUrl)}" placeholder="https://example.com/dash-bg.jpg">
                    </div>
                    <div class="input-block">
                        <label>面板不透明度 <span style="color:var(--text-subtle);font-weight:400">越大越实，越小越通透</span></label>
                        <div class="slider-row">
                            <input type="range" id="glassSld" min="20" max="100" value="${glassA}" oninput="setGlass(this.value)">
                            <input type="number" id="glassNum" min="20" max="100" value="${glassA}" oninput="setGlass(this.value)">
                            <span class="slider-unit">%</span>
                        </div>
                    </div>
                    <div class="input-block">
                        <label>背景遮罩浓度 <span style="color:var(--text-subtle);font-weight:400">仅设了背景图时可见，越大越暗、文字越清晰</span></label>
                        <div class="slider-row">
                            <input type="range" id="scrimSld" min="0" max="95" value="${scrimA}" oninput="setScrim(this.value)">
                            <input type="number" id="scrimNum" min="0" max="95" value="${scrimA}" oninput="setScrim(this.value)">
                            <span class="slider-unit">%</span>
                        </div>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-success" onclick="saveConfig({BG_LOGIN:val('bgLogin'),BG_DASH:val('bgDash'),GLASS_A:val('glassNum'),SCRIM_A:val('scrimNum')},null)"><svg viewBox="0 0 24 24"><use href="#i-save"/></svg> 保存背景</button>
                        <button class="btn btn-secondary" onclick="if(confirm('清除两处背景图？')){document.getElementById('bgLogin').value='';document.getElementById('bgDash').value='';saveConfig({BG_LOGIN:'',BG_DASH:''},null);}">清除</button>
                    </div>
                    <div style="font-size:var(--fs-xs);color:var(--text-dim);margin-top:12px;line-height:1.6">仅支持 http(s) 链接；建议用横向、不太花的图。保存后自动刷新生效；留空则回退默认渐变背景。需已绑定 D1 才能持久化。</div>
                </div>
            </div>
        </div>
    </div>

    <!-- TG配置模态框 -->
    <div id="tgModal" class="modal">
        <div class="modal-content">
            <div class="modal-head"><span><svg viewBox="0 0 24 24"><use href="#i-tg"/></svg>Telegram 通知配置</span><span class="close-btn" onclick="closeModal('tgModal')">×</span></div>
            <div class="input-block">
                <label>Bot Token</label>
                <input type="text" id="tgToken" placeholder="123456:ABC-DEF..." value="${safeVal(tgToken)}">
                ${getStatusLabel(tgToken, sysParams.tgToken)}
            </div>
            <div class="input-block">
                <label>Chat ID</label>
                <input type="text" id="tgId" placeholder="123456789" value="${safeVal(tgId)}">
                ${getStatusLabel(tgId, sysParams.tgId)}
            </div>
            <div class="modal-btns">
                <button class="btn btn-secondary" onclick="validateApi('tg')">验证</button>
                <button class="btn btn-success" onclick="(function(){ const d={}; const t=val('tgToken'); const i=val('tgId'); if(t&&!t.startsWith('****'))d.TG_BOT_TOKEN=t; if(i&&!i.startsWith('****'))d.TG_CHAT_ID=i; if(Object.keys(d).length)saveConfig(d,'tgModal'); else{alert('请输入新的配置值');} })()">保存</button>
                <button class="btn btn-danger" onclick="clearConfig('tg')">清除</button>
            </div>
        </div>
    </div>

    <!-- CF配置模态框 -->
    <div id="cfModal" class="modal">
        <div class="modal-content">
            <div class="modal-head"><span><svg viewBox="0 0 24 24"><use href="#i-cloud"/></svg>Cloudflare 统计配置</span><span class="close-btn" onclick="closeModal('cfModal')">×</span></div>
            <div style="margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid var(--border)">
                <label>方案1: Account ID + API Token</label>
                <input type="text" id="cfAcc" placeholder="Account ID" style="margin-bottom:10px" value="${safeVal(cfId)}">
                ${getStatusLabel(cfId, sysParams.cfId)}
                <input type="text" id="cfTok" placeholder="API Token" value="${safeVal(cfToken)}">
                ${getStatusLabel(cfToken, sysParams.cfToken)}
            </div>
            <div class="input-block">
                <label>方案2: Email + Global Key</label>
                <input type="text" id="cfMail" placeholder="Email" style="margin-bottom:10px" value="${safeVal(cfMail)}">
                ${getStatusLabel(cfMail, sysParams.cfMail)}
                <input type="text" id="cfKey" placeholder="Global API Key" value="${safeVal(cfKey)}">
                ${getStatusLabel(cfKey, sysParams.cfKey)}
            </div>
            <div class="modal-btns">
                <button class="btn btn-secondary" onclick="validateApi('cf')">验证</button>
                <button class="btn btn-success" onclick="(function(){ const d={}; const a=val('cfAcc'),t=val('cfTok'),m=val('cfMail'),k=val('cfKey'); if(a&&!a.startsWith('****'))d.CF_ID=a; if(t&&!t.startsWith('****'))d.CF_TOKEN=t; if(m&&!m.startsWith('****'))d.CF_EMAIL=m; if(k&&!k.startsWith('****'))d.CF_KEY=k; if(Object.keys(d).length)saveConfig(d,'cfModal'); else{alert('请输入新的配置值');} })()">保存</button>
                <button class="btn btn-danger" onclick="clearConfig('cf')">清除</button>
            </div>
        </div>
    </div>

    <div id="toast">已复制</div>

    <script>
        const UUID = "${jsStr(uuid)}"; const CONVERTER = "${jsStr(converter)}"; const CLIENT_IP = "${jsStr(clientIP)}"; const HAS_AUTH = ${hasAuth};
        const ECH_ON_INIT = ${echEnabled === 'true'}; const ECH_SNI_INIT = "${jsStr(echSni)}"; const ECH_DNS_INIT = "${jsStr(echDns)}";
        function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

        // 页面加载
        window.addEventListener('DOMContentLoaded', () => {
            if (HAS_AUTH && !sessionStorage.getItem("is_active")) {
                document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                window.location.reload();
            } else {
                document.body.classList.add('loaded');
                try{ if(localStorage.getItem('sbCollapsed')==='1') document.getElementById('sidebar')?.classList.add('collapsed'); }catch(e){}
                if(!document.getElementById('subDom').value) updateLink();
                generateStars();
            }
        });

        // 生成星星背景
        function generateStars() {
            const starsContainer = document.getElementById('starsContainer');
            const starCount = 300; // 增加到300颗星星，满屏效果
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                star.style.animationDuration = (Math.random() * 2 + 2) + 's';
                // 随机大小
                const size = Math.random() * 2 + 1;
                star.style.width = size + 'px';
                star.style.height = size + 'px';
                starsContainer.appendChild(star);
            }
        }

        // 工具函数
        function val(id) { return document.getElementById(id).value; }
        function showModal(id) { document.getElementById(id).classList.add('show'); }
        function closeModal(id) { document.getElementById(id).classList.remove('show'); }

        // 动态调整球体数字大小，防止溢出
        function adjustSphereValue(element, text) {
            element.innerText = text;
            const len = text.length;
            if (len <= 5) {
                element.setAttribute('data-length', 'short');
            } else if (len <= 10) {
                element.setAttribute('data-length', 'medium');
            } else if (len <= 20) {
                element.setAttribute('data-length', 'long');
            } else {
                element.setAttribute('data-length', 'verylong');
            }
        }

        // 切换面板 - 修复为网格布局
        let _latencyTimer = null, _logTimer = null, _networkLoaded = false;
        function showSection(section, e) {
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            document.getElementById('section-' + section).classList.add('active');
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            (e || window.event || {target:document}).target.closest('.nav-item')?.classList.add('active');
            // 按需启停轮询
            if (section === 'network') { if (!_networkLoaded) { loadNetworkInfo(); _networkLoaded = true; } startLatencyTest(); }
            else { stopLatencyTest(); }
            if (section === 'logs') { loadLogs(); if (!_logTimer) _logTimer = setInterval(loadLogs, 5000); }
            else { if (_logTimer) { clearInterval(_logTimer); _logTimer = null; } }
        }

        // 更新统计
        async function updateStats() {
            try {
                const start = Date.now();
                await fetch('https://www.google.com/generate_204', {mode: 'no-cors'});
                document.getElementById('googleStatus').innerText = (Date.now() - start) + 'ms';
            } catch (e) { document.getElementById('googleStatus').innerText = 'Timeout'; }
            try {
                const res = await fetch('?flag=stats');
                const data = await res.json();
                const reqCountEl = document.getElementById('reqCount');
                adjustSphereValue(reqCountEl, data.req);
                document.getElementById('currentIp').innerText = data.ip;
                document.getElementById('kvStatus').innerText = data.storageStatus || 'Missing';
                document.getElementById('reqSubtitle').innerText = (data.storageStatus && data.storageStatus !== 'Missing')
                    ? 'Cloudflare 统计'
                    : '网页刷新统计';
            } catch (e) {
                const reqCountEl = document.getElementById('reqCount');
                adjustSphereValue(reqCountEl, 'N/A');
            }
        }

        // 加载日志
        async function loadLogs() {
            try {
                const res = await fetch('?flag=get_logs');
                const data = await res.json();
                let html = '';
                const logBox = document.getElementById('logBox');
                if (Array.isArray(data.logs)) {
                    html = data.logs
                        .slice()
                        .sort((a, b) => Number(b.sortTime || 0) - Number(a.sortTime || 0) || Number(b.id || 0) - Number(a.id || 0))
                        .map(log => "<div class='log-entry'><span class='log-time'>" + esc(log.time) + "</span><span class='log-ip'>" + esc(log.ip) + "</span><span class='log-loc'>" + esc(log.region) + "</span><span class='log-tag " + (log.action.includes('订阅')||log.action.includes('检测')?'green':'') + "'>" + esc(log.action) + "</span></div>")
                        .join('');
                } else if (data.logs && typeof data.logs === 'string') {
                    html = data.logs.split('\\n').filter(x=>x).slice(-50).reverse().map(line => {
                        const p = line.split('|');
                        return "<div class='log-entry'><span class='log-time'>" + esc(p[0]) + "</span><span class='log-ip'>" + esc(p[1]) + "</span><span class='log-loc'>" + esc(p[2]) + "</span><span class='log-tag " + (p[3].includes('订阅')||p[3].includes('检测')?'green':'') + "'>" + esc(p[3]) + "</span></div>";
                    }).join('');
                }
                logBox.innerHTML = html || '暂无日志';
                logBox.scrollTop = 0;
            } catch(e) { document.getElementById('logBox').innerText = '加载失败或未绑定 DB'; }
        }

        // 加载白名单
        async function loadWhitelist() {
            try {
                const res = await fetch('?flag=get_whitelist');
                const data = await res.json();
                const list = data.list || [];
                const html = list.length ? list.map(item => {
                    const safeIp = esc(item.ip);
                    const actionHtml = item.type === 'system' ? '<span class="sys-tag">🔒 系统</span>' : "<button class='btn-del' onclick='delWhitelist(\\"" + safeIp + "\\")'>删除</button>";
                    return "<tr><td>" + safeIp + "</td><td>" + actionHtml + "</td></tr>";
                }).join('') : '<tr><td colspan="2" style="text-align:center">暂无白名单 IP</td></tr>';
                document.getElementById('whitelistBody').innerHTML = html;
            } catch(e) { document.getElementById('whitelistBody').innerHTML = '<tr><td colspan="2">加载失败</td></tr>'; }
        }

        async function addWhitelist() {
            const ip = document.getElementById('newWhitelistIp').value.trim();
            if(!ip) return;
            try {
                const res = await fetch('?flag=add_whitelist', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ip}) });
                const data = await res.json();
                if (data.status !== 'ok') throw new Error(data.msg || '添加失败');
                document.getElementById('newWhitelistIp').value = '';
                await loadWhitelist();
            } catch(e) { alert('添加失败: ' + e.message); }
        }

        async function delWhitelist(ip) {
            if(!confirm('确定移除 '+ip+'?')) return;
            try {
                const res = await fetch('?flag=del_whitelist', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ip}) });
                const data = await res.json();
                if (data.status !== 'ok') throw new Error(data.msg || '删除失败');
                await loadWhitelist();
            } catch(e) { alert('删除失败: ' + e.message); }
        }

        // ProxyIP检测
        async function checkProxy() {
            const val = document.getElementById('pIp').value;
            if(val) {
                try { await navigator.clipboard.writeText(val); alert("✅ 中转地址已复制\\n\\n点击确定跳转检测网站..."); }
                catch(e) { alert("跳转检测网站..."); }
                fetch('?flag=log_proxy_check');
                window.open("${jsStr(proxyCheckUrl)}", "_blank");
            }
        }

        function testSub() {
            const url = document.getElementById('finalLink').value;
            if(url) { fetch('?flag=log_sub_test'); window.open(url); }
        }

        // 保存配置
        async function saveConfig(data, modalId) {
            try {
                const res = await fetch('?flag=save_config', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
                const result = await res.json();
                if (result.status !== 'ok') throw new Error(result.msg || '保存失败');
                alert('保存成功');
                if(modalId) closeModal(modalId);
                setTimeout(() => location.reload(), 500);
            } catch(e) { alert('保存失败: ' + (e.message || e)); }
        }

        // ⭐ 功能4: 保存 DLS 配置
        function saveNodeConfig() {
            const data = { ADD: val('inpAdd'), ADDAPI: val('inpAddApi'), ADDCSV: val('inpAddCsv'), DLS: val('inpDls') };
            saveConfig(data, null);
        }

        async function clearConfig(type) {
            if(!confirm('确定清除后台配置？')) return;
            let data = {};
            if(type === 'tg') data = { TG_BOT_TOKEN: "", TG_CHAT_ID: "" };
            if(type === 'cf') data = { CF_ID: "", CF_TOKEN: "", CF_EMAIL: "", CF_KEY: "" };
            saveConfig(data, type + 'Modal');
        }

        async function validateApi(type) {
            const endpoint = type === 'tg' ? 'validate_tg' : 'validate_cf';
            let payload = {};
            if(type === 'tg') {
                const t = val('tgToken'), i = val('tgId');
                if (t.startsWith('****') || i.startsWith('****')) { alert('请先输入完整的新配置值再验证'); return; }
                payload = { TG_BOT_TOKEN: t, TG_CHAT_ID: i };
            } else {
                const a=val('cfAcc'),t=val('cfTok'),m=val('cfMail'),k=val('cfKey');
                if ([a,t,m,k].some(v=>v&&v.startsWith('****'))) { alert('请先输入完整的新配置值再验证'); return; }
                payload = { CF_ID:a, CF_TOKEN:t, CF_EMAIL:m, CF_KEY:k };
            }
            try {
                const res = await fetch('?flag=' + endpoint, { method:'POST', body:JSON.stringify(payload) });
                const d = await res.json();
                alert(d.msg || (d.success ? '验证通过' : '验证失败'));
            } catch(e) { alert('请求错误'); }
        }

        function toggleTheme() { document.body.classList.toggle('light'); }
        function toggleSidebar(){ try{ const sb=document.getElementById('sidebar'); sb.classList.toggle('collapsed'); localStorage.setItem('sbCollapsed', sb.classList.contains('collapsed')?'1':'0'); }catch(e){} }
        function setGlass(v){ v=Math.max(20,Math.min(100,parseInt(v)||72)); document.documentElement.style.setProperty('--glass-a', v/100); var s=document.getElementById('glassSld'),n=document.getElementById('glassNum'); if(s)s.value=v; if(n)n.value=v; }
        function setScrim(v){ v=Math.max(0,Math.min(95,parseInt(v)||0)); document.documentElement.style.setProperty('--scrim-a', v/100); var s=document.getElementById('scrimSld'),n=document.getElementById('scrimNum'); if(s)s.value=v; if(n)n.value=v; }

        // ECH UI 控制
        function updateEchUI() {
            const on = document.getElementById('echSwitch').checked;
            document.getElementById('echDetail').style.display = on ? '' : 'none';
            document.getElementById('echLabel').textContent = on ? '已启用' : '已关闭';
            const fpEl = document.getElementById('fpDisplay');
            if (fpEl) fpEl.textContent = on ? 'firefox' : 'randomized';
        }
        function saveEchConfig() {
            const data = {
                ECH_ENABLED: document.getElementById('echSwitch').checked ? 'true' : 'false',
                ECH_SNI: val('echSni'),
                ECH_DNS: val('echDns')
            };
            saveConfig(data, null);
        }

        // 更新订阅链接
        function updateLink() {
            let base = document.getElementById('subDom').value.trim() || document.getElementById('hostDom').value.trim();
            let host = document.getElementById('hostDom').value.trim();
            let p = document.getElementById('pIp').value.trim();
            let isCM = document.getElementById('cMode').checked;
            let path = p ? "/proxyip=" + p : "/";
            const search = new URLSearchParams();
            search.set('uuid', UUID);
            search.set('enc'+'ryption', 'none');
            search.set('secu'+'rity', 'tls');
            search.set('sni', host);
            search.set('alpn', 'h3');
            const _echOn = document.getElementById('echSwitch')?.checked;
            search.set('fp', _echOn ? 'firefox' : 'randomized');
            search.set('allowInsecure', '0');
            search.set('type', 'ws');
            search.set('host', host);
            search.set('path', path);
            if (_echOn) { const _es = document.getElementById('echSni')?.value || 'cloudflare-ech.com'; const _ed = document.getElementById('echDns')?.value || ECH_DNS_INIT; search.set('ech', (_es ? _es + '+' : '') + _ed); }
            let finalUrl = \`https://\${base}/sub?\${search.toString()}\`;
            if (isCM) {
                let subUrl = CONVERTER + "/sub?target=" + ('cl'+'ash') + "&url=" + encodeURIComponent(finalUrl) + "&emoji=true&list=false&sort=false";
                document.getElementById('finalLink').value = subUrl;
            } else {
                document.getElementById('finalLink').value = finalUrl;
            }
        }

        function tgCM() { updateLink(); }

        function copyId(id) {
            const el = document.getElementById(id);
            el.select();
            navigator.clipboard.writeText(el.value).then(() => {
                const t = document.getElementById('toast');
                t.style.opacity=1;
                setTimeout(() => t.style.opacity=0, 2000);
            });
        }

        function logout() {
            document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            sessionStorage.removeItem("is_active");
            location.reload();
        }

        // ==================== 网络信息检测功能 ====================
        var networkPrivacyVisible = false;
        var networkInfoLoaded = false;
        var NETWORK_API_TIMEOUT_MS = 6180;
        var NETWORK_FIELD_CONFIGS = [
            { id: 'ipip-ip', type: 'ip' }, { id: 'overseas-ip', type: 'ip' },
            { id: 'cf-ip', type: 'ip' }, { id: 'twitter-ip', type: 'ip' },
            { id: 'ipip-country', type: 'location' }, { id: 'overseas-country', type: 'location' },
            { id: 'cf-country', type: 'location' }, { id: 'twitter-country', type: 'location' }
        ];
        var cloudFlareEntries = [];
        var cloudFlareActiveIndex = 0;
        var latencyTestConfig = { count: 16 };
        var latencyUIState = {};
        var latencyTestStarted = false;
        var siteLatencies = {};

        var latencySites = [
            { name: '字节抖音', region: 'domestic', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#000000" d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>', url: 'https://lf3-zlink-tos.ugurl.cn/obj/zebra-public/resource_lmmizj_1632398893.png' },
            { name: 'Bilibili', region: 'domestic', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FB7299" d="M17.813 4.653h.854q2.266.08 3.773 1.574Q23.946 7.72 24 9.987v7.36q-.054 2.266-1.56 3.773c-1.506 1.507-2.262 1.524-3.773 1.56H5.333q-2.266-.054-3.773-1.56C.053 19.614.036 18.858 0 17.347v-7.36q.054-2.267 1.56-3.76t3.773-1.574h.774l-1.174-1.12a1.23 1.23 0 0 1-.373-.906q0-.534.373-.907l.027-.027q.4-.373.92-.373t.92.373L9.653 4.44q.107.106.187.213h4.267a.8.8 0 0 1 .16-.213l2.853-2.747q.4-.373.92-.373c.347 0 .662.151.929.4s.391.551.391.907q0 .532-.373.906zM5.333 7.24q-1.12.027-1.88.773q-.76.748-.786 1.894v7.52q.026 1.146.786 1.893t1.88.773h13.334q1.12-.026 1.88-.773t.786-1.893v-7.52q-.026-1.147-.786-1.894t-1.88-.773zM8 11.107q.56 0 .933.373q.375.374.4.96v1.173q-.025.586-.4.96q-.373.375-.933.374c-.56-.001-.684-.125-.933-.374q-.375-.373-.4-.96V12.44q0-.56.386-.947q.387-.386.947-.386m8 0q.56 0 .933.373q.375.374.4.96v1.173q-.025.586-.4.96q-.373.375-.933.374c-.56-.001-.684-.125-.933-.374q-.375-.373-.4-.96V12.44q.025-.586.4-.96q.373-.373.933-.373"/></svg>', url: 'https://i0.hdslb.com/bfs/face/member/noface.jpg@24w_24h_1c' },
            { name: '腾讯微信', region: 'domestic', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#09B83E" d="M8.7 2.19C3.9 2.19 0 5.48 0 9.53c0 2.21 1.17 4.2 3 5.55a.6.6 0 0 1 .21.66l-.39 1.48q-.03.11-.04.22c0 .16.13.3.29.3a.3.3 0 0 0 .16-.06l1.9-1.11a.9.9 0 0 1 .72-.1 10 10 0 0 0 2.84.4q.41-.01.81-.05a5.85 5.85 0 0 1 1.93-6.45 8.3 8.3 0 0 1 5.86-1.83c-.58-3.59-4.2-6.35-8.6-6.35m-2.9 3.8c.64 0 1.16.53 1.16 1.18a1.17 1.17 0 0 1-1.16 1.18 1.17 1.17 0 0 1-1.17-1.18c0-.65.52-1.18 1.17-1.18m5.8 0c.65 0 1.17.53 1.17 1.18a1.17 1.17 0 0 1-1.16 1.18 1.17 1.17 0 0 1-1.16-1.18c0-.65.52-1.18 1.16-1.18m5.34 2.87a8 8 0 0 0-5.28 1.78 5.5 5.5 0 0 0-1.78 6.22c.94 2.46 3.66 4.23 6.88 4.23q1.25 0 2.36-.33a.7.7 0 0 1 .6.08l1.59.93.14.04c.13 0 .24-.1.24-.24q-.01-.09-.04-.18l-.33-1.23-.02-.16a.5.5 0 0 1 .2-.4 5.8 5.8 0 0 0 2.5-4.62c0-3.21-2.93-5.84-6.66-6.09zm-2.53 3.27c.53 0 .97.44.97.98a1 1 0 0 1-.97.99 1 1 0 0 1-.97-.99c0-.54.43-.98.97-.98zm4.84 0c.54 0 .97.44.97.98a1 1 0 0 1-.97.99 1 1 0 0 1-.97-.99c0-.54.44-.98.97-.98"/></svg>', url: 'https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico' },
            { name: '阿里淘宝', region: 'domestic', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FF6A00" d="M5.2 2.74c.7-.46 1.63-.26 2.1.44l2.14 3.2h5.12l2.14-3.2c.47-.7 1.4-.9 2.1-.44.7.47.9 1.4.44 2.1L17.6 7.38h2.9c.83 0 1.5.67 1.5 1.5v11.62c0 .83-.67 1.5-1.5 1.5H3.5c-.83 0-1.5-.67-1.5-1.5V8.88c0-.83.67-1.5 1.5-1.5h2.9L4.76 4.84c-.46-.7-.26-1.63.44-2.1zM4 9.88v9.62h16V9.88H4zm4.75 2.37c.41 0 .75.34.75.75v3.5c0 .41-.34.75-.75.75s-.75-.34-.75-.75V13c0-.41.34-.75.75-.75zm6.5 0c.41 0 .75.34.75.75v3.5c0 .41-.34.75-.75.75s-.75-.34-.75-.75V13c0-.41.34-.75.75-.75z"/></svg>', url: 'https://img.alicdn.com/imgextra/i2/O1CN01qnQCrN1VkzAWiU4Hs_!!6000000002692-2-tps-33-33.png' },
            { name: 'GitHub', region: 'international', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#181717" d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.7 4.7 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3"/></svg>', url: 'https://github.github.io/janky/images/bg_hr.png' },
            { name: 'Telegram', region: 'international', icon: '<svg width="24" height="24" viewBox="0 0 16 16"><defs><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="tg"><stop stop-color="#38AEEB" offset="0%"/><stop stop-color="#279AD1" offset="100%"/></linearGradient></defs><circle fill="url(#tg)" cx="8" cy="8" r="8"/><path d="M3.17 7.84c2.62-1.1 4.36-1.82 5.24-2.17 2.49-.99 2.84-1.14 3.18-1.14.07 0 .25.03.39.15.12.12.16.2.17.27.01.07.01.28 0 .4-.14 1.36-.65 4.5-.95 6.03-.12.64-.37.86-.61.88-.52.05-.92-.32-1.42-.64-.79-.5-1.05-.68-1.83-1.17-.89-.56-.52-.76-.02-1.26.13-.13 2.32-2.13 2.35-2.31.03-.16.02-.18-.08-.25-.08-.07-.17-.06-.22-.05-.1.02-1.3.77-3.64 2.28-.34.23-.66.34-.94.34-.32-.01-.93-.17-1.39-.31-.56-.18-1-.27-.96-.57.02-.16.26-.32.72-.49z" fill="#FFF"/></svg>', url: 'https://web.telegram.org/k/' },
            { name: 'X.com', region: 'international', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#000000" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>', url: 'https://abs.twimg.com/favicons/twitter.3.ico' },
            { name: 'YouTube', region: 'international', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FF0000" d="M23.5 6.19a3 3 0 0 0-2.12-2.14c-1.87-.5-9.38-.5-9.38-.5s-7.5 0-9.38.5A3 3 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3 3 0 0 0 2.12 2.14c1.87.5 9.38.5 9.38.5s7.5 0 9.38-.5a3 3 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81M9.55 15.57V8.43L15.82 12z"/></svg>', url: 'https://www.youtube.com/favicon.ico' }
        ];

        function setNetworkStatus(id, status) {
            var el = document.getElementById(id);
            if (el) el.className = 'status-indicator status-' + status;
        }

        function fetchWithTimeout(url, options, timeoutMs) {
            timeoutMs = timeoutMs || NETWORK_API_TIMEOUT_MS;
            options = options || {};
            var controller = new AbortController();
            var timeoutReached = false;
            var tid = setTimeout(function() { timeoutReached = true; controller.abort(); }, timeoutMs);
            return fetch(url, Object.assign({}, options, { signal: controller.signal }))
                .then(function(r) { clearTimeout(tid); return r; })
                .catch(function(e) { clearTimeout(tid); if (timeoutReached) throw new Error('timeout: ' + url); throw e; });
        }

        function createJsonpRequest(url, callbackParam, timeoutMs) {
            timeoutMs = timeoutMs || NETWORK_API_TIMEOUT_MS;
            var settled = false, tid = null, script = null, cbScope = null, cbKey = null, rejectFn = null;
            var cleanup = function() {
                if (tid) { clearTimeout(tid); tid = null; }
                if (script && script.parentNode) script.parentNode.removeChild(script);
                if (cbScope && cbKey) { try { delete cbScope[cbKey]; } catch(e) { cbScope[cbKey] = undefined; } }
            };
            var promise = new Promise(function(resolve, reject) {
                rejectFn = reject;
                var finalize = function(handler, value) { if (settled) return; settled = true; cleanup(); handler(value); };
                var cbName = '_edt_' + Date.now() + '_' + Math.floor(Math.random() * 1e16);
                if (!window.__EDT2_IP_TEST__) window.__EDT2_IP_TEST__ = {};
                cbScope = window.__EDT2_IP_TEST__;
                cbKey = cbName;
                cbScope[cbKey] = function(payload) { finalize(resolve, payload); };
                var cbPath = 'window.__EDT2_IP_TEST__.' + cbName;
                var reqUrl = new URL(url);
                reqUrl.searchParams.set(callbackParam, cbPath);
                reqUrl.searchParams.set('_t', Date.now().toString());
                script = document.createElement('script');
                script.src = reqUrl.toString();
                script.async = true;
                script.referrerPolicy = 'no-referrer';
                script.onerror = function() { finalize(reject, new Error('JSONP failed: ' + url)); };
                tid = setTimeout(function() { finalize(reject, new Error('JSONP timeout: ' + url)); }, timeoutMs);
                document.head.appendChild(script);
            });
            return { promise: promise, cancel: function() { if (!settled && rejectFn) { settled = true; cleanup(); rejectFn(new Error('cancelled')); } else { cleanup(); } } };
        }

        function maskNetworkIpValue(ip) {
            var v = String(ip || '').trim();
            if (!v || v === '未知') return v;
            if (v.includes('.') && !v.includes(':')) {
                var parts = v.split('.');
                if (parts.length === 4) return parts[0] + '.' + '*'.repeat(parts[1].length) + '.' + '*'.repeat(parts[2].length) + '.' + '*'.repeat(parts[3].length);
            }
            if (v.includes(':')) {
                var ci = v.indexOf(':');
                if (ci === -1) return v;
                var first = v.slice(0, ci);
                var rest = v.slice(ci + 1);
                return first + ':' + rest.replace(/[^:]/g, '*');
            }
            return v.length <= 2 ? '*'.repeat(Math.max(2, v.length)) : v.slice(0, 2) + '*'.repeat(v.length - 2);
        }

        function maskNetworkLocationValue(loc) {
            var v = String(loc || '').trim();
            if (!v || v === '未知') return v;
            var tokens = v.split(' ').filter(Boolean);
            if (!tokens.length) return v;
            return tokens.map(function(token, index) {
                if (index === 0 && /^[a-zA-Z]{2}$/.test(token)) return token.toUpperCase();
                return '*'.repeat(Math.max(2, token.length));
            }).join(' ');
        }

        function stopNetworkFieldAnimation(el) {
            if (!el) return;
            if (el._privacyAnimFrame) { cancelAnimationFrame(el._privacyAnimFrame); el._privacyAnimFrame = null; }
        }

        function animateNetworkFieldDisplay(el, targetText, durationMs) {
            if (!el) return;
            durationMs = durationMs || 160;
            stopNetworkFieldAnimation(el);
            var fromText = String(el.textContent || '');
            var toText = String(targetText || '');
            if (fromText === toText) { el.textContent = toText; return; }
            var maxLen = Math.max(fromText.length, toText.length);
            var fromChars = fromText.padEnd(maxLen, ' ').split('');
            var toChars = toText.padEnd(maxLen, ' ').split('');
            var diffIndexes = [];
            for (var i = 0; i < maxLen; i++) { if (fromChars[i] !== toChars[i]) diffIndexes.push(i); }
            if (!diffIndexes.length) { el.textContent = toText; return; }
            var startTime = performance.now();
            var frame = function(now) {
                var progress = Math.min((now - startTime) / durationMs, 1);
                var changedCount = Math.floor(progress * diffIndexes.length);
                var currentChars = fromChars.slice();
                for (var j = 0; j < changedCount; j++) { currentChars[diffIndexes[j]] = toChars[diffIndexes[j]]; }
                el.textContent = currentChars.join('').trimEnd();
                if (progress < 1) { el._privacyAnimFrame = requestAnimationFrame(frame); }
                else { el._privacyAnimFrame = null; el.textContent = toText; }
            };
            el._privacyAnimFrame = requestAnimationFrame(frame);
        }

        function renderNetworkFieldDisplay(el, options) {
            if (!el) return;
            if (el.dataset.displayState !== 'ready') return;
            var animate = options && options.animate;
            var rawValue = String(el.dataset.rawValue || '').trim();
            var maskType = el.dataset.maskType || 'location';
            if (!rawValue) { stopNetworkFieldAnimation(el); el.textContent = ''; return; }
            var displayValue = rawValue;
            if (!networkPrivacyVisible) {
                displayValue = maskType === 'ip' ? maskNetworkIpValue(rawValue) : maskNetworkLocationValue(rawValue);
            }
            if (animate) { animateNetworkFieldDisplay(el, displayValue); }
            else { stopNetworkFieldAnimation(el); el.textContent = displayValue; }
        }

        function setNetworkFieldValue(id, rawValue, maskType) {
            var el = document.getElementById(id);
            if (!el) return;
            el.dataset.rawValue = String(rawValue || '').trim();
            el.dataset.maskType = maskType;
            el.dataset.displayState = 'ready';
            renderNetworkFieldDisplay(el);
            if (maskType === 'ip') makeIpClickable();
        }

        function setNetworkFieldError(id, errorText) {
            var el = document.getElementById(id);
            if (!el) return;
            stopNetworkFieldAnimation(el);
            el.dataset.rawValue = '';
            el.dataset.displayState = 'error';
            el.classList.remove('clickable', 'is-loading');
            el.removeAttribute('title');
            el.innerHTML = '<span class="error">' + errorText + '</span>';
        }

        function clearNetworkFieldValue(id) {
            var el = document.getElementById(id);
            if (!el) return;
            stopNetworkFieldAnimation(el);
            el.dataset.rawValue = '';
            el.dataset.displayState = 'empty';
            el.classList.remove('clickable', 'is-loading');
            el.removeAttribute('title');
            el.textContent = '';
        }

        function refreshAllNetworkFieldDisplays(animate) {
            NETWORK_FIELD_CONFIGS.forEach(function(cfg) {
                var el = document.getElementById(cfg.id);
                renderNetworkFieldDisplay(el, { animate: !!animate });
            });
            applyNetworkCardFlag('ipip-country');
            applyNetworkCardFlag('overseas-country');
            applyNetworkCardFlag('cf-country');
            applyNetworkCardFlag('twitter-country');
        }

        function toggleNetworkPrivacy(event) {
            if (event) event.stopPropagation();
            networkPrivacyVisible = !networkPrivacyVisible;
            refreshAllNetworkFieldDisplays(true);
        }

        function bindNetworkCardPrivacyToggle() {
            document.querySelectorAll('.network-card').forEach(function(card) {
                if (card.dataset.privacyToggleBound === '1') return;
                card.dataset.privacyToggleBound = '1';
                card.title = '点击卡片可显示/隐藏真实IP和地址';
                card.addEventListener('click', toggleNetworkPrivacy);
            });
        }

        function applyNetworkCardFlag(countryElementId) {
            var el = document.getElementById(countryElementId);
            if (!el) return;
            var card = el.closest('.network-card');
            if (!card) return;
            var text = String(el.dataset.rawValue || el.textContent || '').trim();
            var m = text.match(/(?:^|[^a-zA-Z])([a-zA-Z]{2})(?:[^a-zA-Z]|$)/);
            var code = m ? m[1].toLowerCase() : '';
            if (!code) { card.classList.remove('has-flag-badge'); card.style.removeProperty('--flag-badge-url'); return; }
            card.style.setProperty('--flag-badge-url', 'url("https://ipdata.co/flags/' + code + '.png")');
            card.classList.add('has-flag-badge');
        }

        function detectIpVersion(ip) { var v = String(ip || '').trim(); if (!v) return ''; return v.includes(':') ? 'v6' : 'v4'; }
        function getCloudFlareProxyLabel(ver, full) { if (ver === 'v4') return full ? 'ProxyIPv4' : 'v4'; if (ver === 'v6') return full ? 'ProxyIPv6' : 'v6'; return full ? 'ProxyIP' : 'IP'; }

        function renderCloudFlareSubtitle() {
            var el = document.getElementById('cf-subtitle');
            if (!el || cloudFlareEntries.length === 0) return;
            var html = '';
            cloudFlareEntries.forEach(function(entry, i) {
                var ver = detectIpVersion(entry.ip);
                var cls = ver === 'v6' ? 'cf-subtitle-v6' : 'cf-subtitle-v4';
                if (i === cloudFlareActiveIndex) {
                    html += '<span class="' + cls + '">' + getCloudFlareProxyLabel(ver, true) + '</span>';
                } else {
                    if (html) html += '<span class="cf-subtitle-sep"> / </span>';
                    html += '<span class="' + cls + ' cf-subtitle-switch" data-cf-idx="' + i + '" role="button" tabindex="0" title="点击切换出口IP">' + getCloudFlareProxyLabel(ver, false) + '</span>';
                }
                if (i === cloudFlareActiveIndex && i < cloudFlareEntries.length - 1) html += '<span class="cf-subtitle-sep"> / </span>';
            });
            el.innerHTML = html;
            el.querySelectorAll('.cf-subtitle-switch').forEach(function(sw) {
                sw.addEventListener('click', function(e) {
                    e.stopPropagation();
                    cloudFlareActiveIndex = parseInt(sw.dataset.cfIdx);
                    renderCloudFlareActiveEntry();
                });
            });
        }

        function renderCloudFlareActiveEntry() {
            if (cloudFlareEntries.length === 0) return;
            var entry = cloudFlareEntries[cloudFlareActiveIndex];
            setNetworkFieldValue('cf-ip', entry.ip, 'ip');
            setNetworkFieldValue('cf-country', entry.loc || '未知', 'location');
            applyNetworkCardFlag('cf-country');
            renderCloudFlareSubtitle();
        }

        function fetchIpInfoByIp(ip) {
            var requestIp = String(ip || '').trim();
            if (!requestIp) return Promise.reject(new Error('missing ip'));
            var apis = [
                { name: 'cm-eo', url: 'https://api.cmliussss.net/api/ipinfo?ip=' + encodeURIComponent(requestIp) },
                { name: 'cm-cf', url: 'https://cf.090227.xyz/api/ipsb?ip=' + encodeURIComponent(requestIp) }
            ];
            var tasks = apis.map(function(api) {
                return fetchWithTimeout(api.url, { cache: 'no-store' }).then(function(res) {
                    if (!res.ok) throw new Error(api.name + ' HTTP ' + res.status);
                    return res.json();
                }).then(function(data) {
                    if (!data || typeof data !== 'object') throw new Error(api.name + ' invalid');
                    return data;
                });
            });
            return Promise.any(tasks);
        }

        function formatIpInfoLocation(info) {
            var cc = String((info && info.country_code) || '未知').trim() || '未知';
            var rawAsn = info && info.asn;
            var asnText = (rawAsn === undefined || rawAsn === null) ? '' : (/^[0-9]+$/.test(String(rawAsn).trim()) ? 'AS' + String(rawAsn).trim() : String(rawAsn).trim());
            var asnName = String((info && (info.as_name || info.asn_organization || info.organization || info.isp)) || '').trim();
            return (cc + ' ' + asnText + ' ' + asnName).trim() || '未知';
        }

        async function fetchIpipData() {
            setNetworkStatus('status-ipip', 'loading');
            var statusEl = document.querySelector('#status-ipip');
            var titleEl = statusEl ? statusEl.parentElement : null;
            var testSources = [
                { type: 'head', name: '字节跳动', url: 'https://perfops2.byte-test.com/500b-bench.jpg', ipHeader: 'X-Request-Ip' },
                { type: 'head', name: '字节跳动', url: 'https://perfops.byte-test.com', ipHeader: 'X-Request-Ip' },
                { type: 'head', name: '网易科技', url: 'https://necaptcha.nosdn.127.net/ab7f4275c1744aa28e0a8f3a1c58c532.png', ipHeader: 'cdn-user-ip' },
                { type: 'jsonp', name: '腾讯新闻', url: 'https://r.inews.qq.com/api/ip2city?otype=jsonp', cbParam: 'callback', extractIp: function(p) { return p && p.ip; } },
                { type: 'jsonp', name: '太平洋科技', url: 'https://whois.pconline.com.cn/ipJson.jsp', cbParam: 'callback', extractIp: function(p) { return p && p.ip; } },
                { type: 'jsonp', name: '阿里巴巴', url: 'https://' + Date.now() + '.dns-detect.alicdn.com/api/detect/DescribeDNSLookup', cbParam: 'cb', extractIp: function(p) { return p && p.content && p.content.localIp; } }
            ];
            var tasks = testSources.map(function(src) {
                if (src.type === 'jsonp') {
                    var j = createJsonpRequest(src.url, src.cbParam);
                    return { cancel: j.cancel, promise: j.promise.then(function(payload) {
                        var ip = String((src.extractIp(payload)) || '').trim();
                        if (!ip) throw new Error(src.url + ' missing jsonp ip');
                        return { source: src.url, requestIp: ip, providerName: src.name };
                    })};
                }
                var ctrl = new AbortController();
                return { cancel: function() { ctrl.abort(); }, promise: (async function() {
                    var url = src.url + (src.url.includes('?') ? '&' : '?') + '_t=' + Date.now();
                    var res = await fetchWithTimeout(url, { method: 'HEAD', cache: 'no-store', signal: ctrl.signal });
                    if (!res.ok) throw new Error(src.url + ' HTTP ' + res.status);
                    var ip = String(res.headers.get(src.ipHeader) || '').trim();
                    if (!ip) throw new Error(src.url + ' missing ' + src.ipHeader);
                    return { source: src.url, requestIp: ip, providerName: src.name };
                })()};
            });
            var fastest;
            try { fastest = await Promise.any(tasks.map(function(t) { return t.promise; })); }
            catch(e) { tasks.forEach(function(t) { if (t.cancel) t.cancel(); }); setNetworkFieldError('ipip-ip', '加载失败'); clearNetworkFieldValue('ipip-country'); applyNetworkCardFlag('ipip-country'); setNetworkStatus('status-ipip', 'error'); return; }
            tasks.forEach(function(t) { if (t.cancel) t.cancel(); });
            setNetworkFieldValue('ipip-ip', fastest.requestIp, 'ip');
            clearNetworkFieldValue('ipip-country');
            if (titleEl) { titleEl.innerHTML = '<span class="status-indicator" id="status-ipip"></span><div class="title-text"><div class="title-main">国内测试</div><div class="title-subtitle">' + fastest.providerName + '</div></div>'; setNetworkStatus('status-ipip', 'loading'); }
            try {
                var info = await fetchIpInfoByIp(fastest.requestIp);
                var ip = String((info && info.ip) || fastest.requestIp || '未知').trim();
                var location = formatIpInfoLocation(info);
                setNetworkFieldValue('ipip-ip', ip, 'ip');
                setNetworkFieldValue('ipip-country', location || '未知', 'location');
                applyNetworkCardFlag('ipip-country');
                setNetworkStatus('status-ipip', 'success');
            } catch(e) { setNetworkFieldValue('ipip-country', '未知', 'location'); applyNetworkCardFlag('ipip-country'); setNetworkStatus('status-ipip', 'success'); }
        }

        async function fetchOverseasTestData() {
            setNetworkStatus('status-overseas', 'loading');
            var apis = [
                { url: 'https://api.cmliussss.net/api/ipinfo?_t=' + Date.now(), parse: function(d) { return { ip: d.ip || '', loc: ((d.country_code || '未知') + ' ' + (d.asn || '') + ' ' + (d.as_name || '')).trim() }; } },
                { url: 'https://api.ipapi.is', parse: function(d) { return { ip: d.ip || '', loc: (((d.location && d.location.country_code) || '未知') + ' AS' + ((d.asn && d.asn.asn) || '') + ' ' + ((d.asn && d.asn.org) || '')).trim() }; } }
            ];
            for (var i = 0; i < apis.length; i++) {
                try {
                    var res = await fetchWithTimeout(apis[i].url);
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    var parsed = apis[i].parse(await res.json());
                    if (!parsed.ip) throw new Error('Missing IP');
                    setNetworkFieldValue('overseas-ip', parsed.ip, 'ip');
                    setNetworkFieldValue('overseas-country', parsed.loc || '未知', 'location');
                    applyNetworkCardFlag('overseas-country');
                    setNetworkStatus('status-overseas', 'success');
                    return;
                } catch(e) {}
            }
            setNetworkFieldError('overseas-ip', '加载失败');
            clearNetworkFieldValue('overseas-country');
            setNetworkStatus('status-overseas', 'error');
        }

        async function fetchCloudFlareData() {
            setNetworkStatus('status-cf', 'loading');
            var urls = ['https://ipv4.090227.xyz', 'https://ipv6.090227.xyz', 'https://api.090227.xyz'];
            try {
                var results = await Promise.allSettled(urls.map(function(u) {
                    return fetch(u + '?_t=' + Date.now()).then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
                }));
                var seen = {};
                cloudFlareEntries = [];
                results.forEach(function(r) {
                    if (r.status === 'fulfilled' && r.value && r.value.ip) {
                        var d = r.value;
                        if (!seen[d.ip]) {
                            seen[d.ip] = true;
                            cloudFlareEntries.push({ ip: d.ip, version: detectIpVersion(d.ip), loc: ((d.country || '') + ' ' + (d.org || '')).trim() || '未知' });
                        }
                    }
                });
                cloudFlareEntries.sort(function(a, b) { return (a.version === 'v4' ? 0 : 1) - (b.version === 'v4' ? 0 : 1); });
                if (cloudFlareEntries.length === 0) throw new Error('No CF IP');
                cloudFlareActiveIndex = 0;
                renderCloudFlareActiveEntry();
                setNetworkStatus('status-cf', 'success');
            } catch(e) {
                setNetworkFieldError('cf-ip', '加载失败');
                clearNetworkFieldValue('cf-country');
                setNetworkStatus('status-cf', 'error');
            }
        }

        async function fetchTwitterData() {
            setNetworkStatus('status-twitter', 'loading');
            var subtitleEl = document.getElementById('twitter-subtitle');
            try {
                var res = await fetch('https://jsonp-ip.appspot.com/?callback=cb&_t=' + Date.now());
                if (res.ok) {
                    var text = await res.text();
                    var m = text.match(/cb\((.+)\)/);
                    if (m) {
                        var d = JSON.parse(m[1]);
                        if (d.ip) {
                            if (subtitleEl) subtitleEl.textContent = '谷歌(Google)';
                            setNetworkFieldValue('twitter-ip', d.ip, 'ip');
                            setNetworkFieldValue('twitter-country', (d.country || d.loc || '未知'), 'location');
                            applyNetworkCardFlag('twitter-country');
                            setNetworkStatus('status-twitter', 'success');
                            return;
                        }
                    }
                }
            } catch(e) {}
            try {
                var res2 = await fetch('https://help.x.com/cdn-cgi/trace?_t=' + Date.now());
                if (!res2.ok) throw new Error('HTTP ' + res2.status);
                var text2 = await res2.text();
                var data = {};
                text2.split('\\n').forEach(function(line) { var kv = line.split('='); if (kv[0] && kv[1]) data[kv[0].trim()] = kv[1].trim(); });
                if (!data.ip) throw new Error('Missing IP');
                if (subtitleEl) subtitleEl.textContent = '推特(X.com)';
                setNetworkFieldValue('twitter-ip', data.ip, 'ip');
                setNetworkFieldValue('twitter-country', ((data.loc || '') + ' ' + (data.colo || '')).trim() || '未知', 'location');
                applyNetworkCardFlag('twitter-country');
                setNetworkStatus('status-twitter', 'success');
            } catch(e) {
                setNetworkFieldError('twitter-ip', '加载失败');
                clearNetworkFieldValue('twitter-country');
                setNetworkStatus('status-twitter', 'error');
            }
        }

        function makeIpClickable() {
            document.querySelectorAll('.ip-text').forEach(function(el) {
                if (el.dataset.clickBound) return;
                if (el.dataset.displayState !== 'ready') return;
                el.dataset.clickBound = 'true';
                el.classList.add('clickable');
                el.title = '点击查询IP详细信息';
                el.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var ip = (el.dataset.rawValue || el.textContent || '').trim();
                    if (!ip || ip === '加载中...' || ip.includes('加载失败')) return;
                    showIpDetail(ip, el);
                });
            });
        }

        async function showIpDetail(ip, triggerEl) {
            if (triggerEl) { triggerEl.classList.add('is-loading'); }
            var popup = document.createElement('div');
            popup.className = 'ip-detail-popup';
            popup.innerHTML = '<div class="ip-detail-content"><h3>IP 详情查询中...</h3><div style="color:var(--text-dim);margin:10px 0">正在查询 ' + ip + '</div><button class="ip-detail-close">关闭</button></div>';
            document.body.appendChild(popup);
            popup.addEventListener('click', function(e) { if (e.target === popup || e.target.classList.contains('ip-detail-close')) popup.remove(); });
            try {
                var res = await fetch('https://api.ipapi.is/?q=' + encodeURIComponent(ip));
                if (!res.ok) throw new Error('HTTP ' + res.status);
                var d = await res.json();
                var ipType = d.is_datacenter ? 'hosting' : ((d.company && d.company.type === 'business') ? 'business' : 'residential');
                var typeLabel = ipType === 'hosting' ? '数据中心' : (ipType === 'business' ? '商业' : '住宅');
                var ts = d.threat_score || d.fraud_score || 0;
                var tc = ts > 70 ? 'badge-danger' : (ts > 40 ? 'badge-warning' : 'badge-success');
                var rows = '';
                rows += '<div class="ip-detail-row"><span class="label">IP 地址</span><span class="value">' + (d.ip || ip) + '</span></div>';
                rows += '<div class="ip-detail-row"><span class="label">国家/地区</span><span class="value">' + (d.location ? ((d.location.country || '') + ' ' + (d.location.city || '')).trim() : '未知') + '</span></div>';
                if (d.location && d.location.timezone) rows += '<div class="ip-detail-row"><span class="label">时区</span><span class="value">' + d.location.timezone + '</span></div>';
                rows += '<div class="ip-detail-row"><span class="label">ASN</span><span class="value">AS' + (d.asn ? d.asn.asn : '?') + ' ' + (d.asn ? d.asn.org : '') + '</span></div>';
                rows += '<div class="ip-detail-row"><span class="label">IP 类型</span><span class="value ip-type-' + ipType + '">' + typeLabel + '</span></div>';
                if (d.company) rows += '<div class="ip-detail-row"><span class="label">运营商</span><span class="value">' + (d.company.name || '未知') + '</span></div>';
                rows += '<div class="ip-detail-row"><span class="label">威胁评分</span><span class="value ' + tc + '">' + ts + '/100</span></div>';
                var checks = [['数据中心', d.is_datacenter], ['代理', d.is_proxy], ['VPN', d.is_vpn], ['Tor', d.is_tor], ['爬虫', d.is_crawler], ['移动网络', d.is_mobile], ['已知滥用', d.is_abuser]];
                var flagged = checks.filter(function(c) { return c[1]; });
                if (flagged.length > 0) { rows += '<div class="ip-detail-row"><span class="label">安全标记</span><span class="value badge-warning">' + flagged.map(function(c) { return c[0]; }).join(' / ') + '</span></div>'; }
                else { rows += '<div class="ip-detail-row"><span class="label">安全标记</span><span class="value badge-success">无风险标记</span></div>'; }
                popup.querySelector('.ip-detail-content').innerHTML = '<h3>IP 详情</h3>' + rows + '<button class="ip-detail-close">关闭</button>';
                popup.querySelector('.ip-detail-close').addEventListener('click', function() { popup.remove(); });
            } catch(err) {
                popup.querySelector('.ip-detail-content').innerHTML = '<h3>查询失败</h3><div style="color:var(--danger);margin:10px 0">' + err.message + '</div><button class="ip-detail-close">关闭</button>';
                popup.querySelector('.ip-detail-close').addEventListener('click', function() { popup.remove(); });
            } finally {
                if (triggerEl) { triggerEl.classList.remove('is-loading'); }
            }
        }

        function getLatencyColor(latency) { if (latency === -1) return 'var(--latency-999)'; if (latency <= 49) return 'var(--latency-49)'; if (latency <= 149) return 'var(--latency-149)'; if (latency <= 299) return 'var(--latency-299)'; if (latency <= 999) return 'var(--latency-999)'; return 'var(--latency-1000)'; }

        async function testLatency(url) {
            var start = Date.now();
            try { await fetch(url + '?t=' + Date.now(), { method: 'HEAD', cache: 'no-cache', mode: 'no-cors' }); return Date.now() - start; }
            catch(e) { return -1; }
        }

        function generateLatencyCards() {
            var container = document.getElementById('latency-cards');
            if (!container) return;
            container.innerHTML = '';
            latencySites.forEach(function(site) {
                var siteName = site.name.toLowerCase().split(' ').join('-');
                var regionText = site.region === 'domestic' ? '国内' : '国际';
                var card = document.createElement('div');
                card.className = 'latency-card';
                card.dataset.region = site.region;
                card.innerHTML = '<div class="latency-card-header"><div class="latency-card-info"><div class="latency-card-icon-wrapper" data-site="' + siteName + '">' + site.icon + '</div><div class="latency-card-text"><span class="latency-card-name">' + site.name + '</span><span class="latency-card-region" data-region="' + regionText + '">' + regionText + '</span></div></div><div class="latency-status" id="latency-' + siteName + '">...<span class="unit">ms</span></div></div><div class="latency-graph-container"><div class="graph-grid"></div><svg class="latency-ecg" viewBox="0 0 400 60" preserveAspectRatio="none"><path class="ecg-path-bg" d="M0,30 L400,30"></path><path class="ecg-path" id="path-' + siteName + '" d="M0,30 L400,30"></path><circle class="ecg-cursor" id="cursor-' + siteName + '" r="3" cx="0" cy="30" style="display:none"></circle></svg></div>';
                container.appendChild(card);
            });
        }

        function updateLatencyDisplay(siteName, latencies) {
            var valueEl = document.getElementById('latency-' + siteName);
            var pathEl = document.getElementById('path-' + siteName);
            var cursorEl = document.getElementById('cursor-' + siteName);
            if (!valueEl || !pathEl) return;
            var lastLatency = latencies[latencies.length - 1];
            var validLatencies = latencies.filter(function(l) { return l !== -1; });
            var avgLatency = -1;
            if (validLatencies.length > 0) {
                if (validLatencies.length > 5) {
                    var sorted = validLatencies.slice().sort(function(a, b) { return a - b; });
                    var trimmed = sorted.slice(1, -1);
                    avgLatency = trimmed.reduce(function(a, b) { return a + b; }, 0) / trimmed.length;
                } else { avgLatency = validLatencies.reduce(function(a, b) { return a + b; }, 0) / validLatencies.length; }
            }
            var targetValue = Math.round(avgLatency);
            if (validLatencies.length === 0) {
                if (lastLatency === -1) { valueEl.innerHTML = 'TIMEOUT'; valueEl.style.color = 'var(--latency-999)'; }
                else { valueEl.innerHTML = '...<span class="unit">ms</span>'; valueEl.style.color = 'var(--glass-cyan)'; }
            } else {
                var siteState = latencyUIState[siteName] || { current: targetValue, timer: null };
                latencyUIState[siteName] = siteState;
                var avgColor = getLatencyColor(targetValue);
                valueEl.style.color = avgColor;
                if (Math.abs(siteState.current - targetValue) < 2) { siteState.current = targetValue; valueEl.innerHTML = targetValue + '<span class="unit">ms</span>'; }
                else {
                    if (siteState.timer) clearInterval(siteState.timer);
                    var step = function() {
                        if (siteState.current < targetValue) siteState.current += Math.ceil((targetValue - siteState.current) / 5);
                        else if (siteState.current > targetValue) siteState.current -= Math.ceil((siteState.current - targetValue) / 5);
                        valueEl.innerHTML = siteState.current + '<span class="unit">ms</span>';
                        if (siteState.current === targetValue) { clearInterval(siteState.timer); siteState.timer = null; }
                    };
                    siteState.timer = setInterval(step, 30);
                }
            }
            var width = 400, height = 60, padding = 10;
            var stepX = width / (latencyTestConfig.count - 1);
            var points = [];
            latencies.forEach(function(l, i) {
                var x = i * stepX;
                var y = l === -1 ? height - 5 : height - padding - (Math.min(l, 500) / 500 * (height - 2 * padding));
                points.push({ x: x, y: y });
            });
            if (points.length > 0) {
                var d = 'M' + points[0].x + ',' + points[0].y;
                for (var i = 0; i < points.length - 1; i++) {
                    var xm = (points[i].x + points[i+1].x) / 2;
                    var ym = (points[i].y + points[i+1].y) / 2;
                    d += ' Q' + points[i].x + ',' + points[i].y + ' ' + xm + ',' + ym;
                }
                var lp = points[points.length - 1];
                d += ' L' + lp.x + ',' + lp.y;
                pathEl.setAttribute('d', d);
                var avgColor2 = getLatencyColor(targetValue);
                pathEl.style.stroke = avgColor2;
                if (cursorEl) { cursorEl.style.display = 'block'; cursorEl.setAttribute('cx', lp.x); cursorEl.setAttribute('cy', lp.y); cursorEl.style.fill = avgColor2; }
            }
        }

        function startLatencyTest() {
            if (latencyTestStarted) return;
            latencyTestStarted = true;
            latencySites.forEach(function(site) { var sn = site.name.toLowerCase().split(' ').join('-'); siteLatencies[sn] = []; });
            (async function() {
                var initialPromises = latencySites.map(async function(site) {
                    var sn = site.name.toLowerCase().split(' ').join('-');
                    for (var i = 0; i < latencyTestConfig.count; i++) {
                        var latency = await testLatency(site.url);
                        siteLatencies[sn].push(latency);
                        updateLatencyDisplay(sn, siteLatencies[sn]);
                        if (i < latencyTestConfig.count - 1) await new Promise(function(r) { setTimeout(r, 0); });
                    }
                });
                await Promise.all(initialPromises);
                _latencyTimer = setInterval(async function() {
                    var ups = latencySites.map(async function(site) {
                        var sn = site.name.toLowerCase().split(' ').join('-');
                        var latency = await testLatency(site.url);
                        siteLatencies[sn].push(latency);
                        if (siteLatencies[sn].length > latencyTestConfig.count) siteLatencies[sn].shift();
                        updateLatencyDisplay(sn, siteLatencies[sn]);
                    });
                    await Promise.all(ups);
                }, 1800);
            })();
        }

        function stopLatencyTest() {
            if (_latencyTimer) { clearInterval(_latencyTimer); _latencyTimer = null; }
            latencyTestStarted = false;
        }

        function loadNetworkInfo() {
            generateLatencyCards();
            bindNetworkCardPrivacyToggle();
            fetchIpipData();
            fetchOverseasTestData();
            fetchCloudFlareData();
            fetchTwitterData();
            setTimeout(makeIpClickable, 500);
        }



        function showECHHelp() {
            var modal = document.getElementById('echHelpModal');
            modal.style.display = 'flex';
            switchEchTab(0);
        }
        function switchEchTab(idx) {
            var btns = document.querySelectorAll('.ech-tab-btn');
            for (var i = 0; i < btns.length; i++) {
                btns[i].style.background = i === idx ? 'var(--glass-blue,#2563eb)' : 'transparent';
                btns[i].style.color = i === idx ? '#fff' : 'var(--text-dim,#888)';
            }
            for (var j = 0; j < 3; j++) {
                var pane = document.getElementById('echPane' + j);
                if (pane) pane.style.display = j === idx ? 'block' : 'none';
            }
        }

        // 初始化（控制台面板默认显示）
        updateStats();
        loadWhitelist();
        updateLink();
    </script>

    <!-- ECH 帮助弹窗 -->
    <div id="echHelpModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;align-items:center;justify-content:center" onclick="if(event.target===this)this.style.display='none'">
        <div style="background:var(--card-bg,#1a1a2e);border:1px solid var(--border,#333);border-radius:16px;padding:24px;max-width:800px;width:90%;max-height:85vh;overflow-y:auto;color:var(--text,#fff);position:relative" onclick="event.stopPropagation()">
            <button onclick="document.getElementById('echHelpModal').style.display='none'" style="position:absolute;top:12px;right:16px;background:none;border:none;color:var(--text-dim,#888);font-size:1.5rem;cursor:pointer;line-height:1">&times;</button>
            <div style="display:flex;gap:8px;margin-bottom:20px;overflow-x:auto;padding-bottom:4px" id="echTabs">
                <button class="ech-tab-btn active" onclick="switchEchTab(0)" style="padding:8px 16px;border-radius:8px;border:1px solid var(--border,#333);background:var(--glass-blue,#2563eb);color:#fff;cursor:pointer;white-space:nowrap;font-size:0.85rem">什么是ECH？</button>
                <button class="ech-tab-btn" onclick="switchEchTab(1)" style="padding:8px 16px;border-radius:8px;border:1px solid var(--border,#333);background:transparent;color:var(--text-dim,#888);cursor:pointer;white-space:nowrap;font-size:0.85rem">如何使用？</button>
                <button class="ech-tab-btn" onclick="switchEchTab(2)" style="padding:8px 16px;border-radius:8px;border:1px solid var(--border,#333);background:transparent;color:var(--text-dim,#888);cursor:pointer;white-space:nowrap;font-size:0.85rem">如何验证？</button>
            </div>
            <div id="echPane0">
                <h2 style="font-size:1.2rem;margin-bottom:16px">🔐 什么是 ECH？</h2>
                <p style="margin-bottom:14px;line-height:1.8;color:var(--text-dim,#aaa)"><b>ECH（Encrypted Client Hello，加密客户端问候）</b>是 TLS 的一项新特性，用来<b>将原本会明文暴露的域名信息一起加密</b>。</p>
                <p style="margin-bottom:14px;line-height:1.8;color:var(--text-dim,#aaa)">技术细节可参考 Cloudflare 官方博客：<br><a href="https://blog.cloudflare.com/zh-cn/announcing-encrypted-client-hello/" target="_blank" rel="noopener" style="color:var(--glass-blue,#60a5fa)">https://blog.cloudflare.com/zh-cn/announcing-encrypted-client-hello/</a></p>
                <h3 style="margin:20px 0 12px">📖 背景说明</h3>
                <p style="margin-bottom:14px;line-height:1.8;color:var(--text-dim,#aaa)">当我们使用 <b>WS + TLS</b> 的节点进行代理时：</p>
                <ul style="margin:10px 0 14px;padding-left:20px;line-height:1.8;color:var(--text-dim,#aaa)">
                    <li style="margin-bottom:6px">✅ 实际通信内容已经被 TLS 加密，GFW <b>无法看到你访问的具体内容</b></li>
                    <li>❌ 但在 TLS 握手阶段，仍然会暴露一个关键信息：<b>SNI</b></li>
                </ul>
                <p style="margin-bottom:14px;line-height:1.8;color:var(--text-dim,#aaa)"><b>SNI 就是节点的伪装域名（HOST）</b></p>
                <div style="background:rgba(255,243,205,0.1);border-left:3px solid #ffc107;padding:10px 14px;border-radius:6px;margin-bottom:14px;color:#ffd93d;font-size:0.9rem">GFW 虽然不知道你在访问什么，但知道你在"扶墙"，并且知道你连接的是哪个域名。</div>
                <h3 style="margin:20px 0 12px">⚠️ 会带来什么问题？</h3>
                <p style="margin-bottom:10px;line-height:1.8;color:var(--text-dim,#aaa)">这就是为什么经常出现：</p>
                <ul style="margin:10px 0 14px;padding-left:20px;line-height:1.8;color:var(--text-dim,#aaa)">
                    <li style="margin-bottom:6px">❌ v2r&#97;yN 批量测试真链接延迟</li>
                    <li>❌ Cl&#97;sh 策略组自动选择节点</li>
                </ul>
                <div style="background:rgba(248,215,218,0.1);border-left:3px solid #dc3545;padding:10px 14px;border-radius:6px;margin-bottom:14px;color:#ff6b6b;font-size:0.9rem">所有节点瞬间 -1，全部无法使用</div>
                <p style="margin-bottom:14px;line-height:1.8;color:var(--text-dim,#aaa)">原因并不是节点真的失效，而是<b>运营商/GFW 通过阻断节点域名的访问来干扰代理连接</b>。由于这种阻断大多是自动化策略，容易误判，因此<b>过一段时间节点又可能恢复正常</b>，反复循环。</p>
                <h3 style="margin:20px 0 12px">💡 ECH 的作用</h3>
                <div style="background:rgba(209,236,241,0.1);border-left:3px solid #17a2b8;padding:10px 14px;border-radius:6px;margin-bottom:14px;color:var(--glass-cyan,#22d3ee);font-size:0.9rem">将 SNI（也就是节点域名）加密</div>
                <p style="margin-bottom:10px;line-height:1.8;color:var(--text-dim,#aaa)">启用 ECH 后：</p>
                <ul style="margin:10px 0 14px;padding-left:20px;line-height:1.8;color:var(--text-dim,#aaa)">
                    <li style="margin-bottom:6px">✅ GFW <b>无法获取真实的节点域名</b></li>
                    <li>✅ 外部观察到的域名将统一显示为：<code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:3px">cloudflare-ech.com</code></li>
                </ul>
                <p style="margin-bottom:14px;line-height:1.8;color:var(--text-dim,#aaa)">这从源头上<b>阻断了通过域名精准封锁节点的手段</b>。</p>
                <h3 style="margin:20px 0 12px">🤔 ECH 会不会被封？</h3>
                <p style="margin-bottom:10px;line-height:1.8;color:var(--text-dim,#aaa)">理论上，GFW 只需<b>直接阻断 cloudflare-ech.com</b> 即可。但这样会：</p>
                <ul style="margin:10px 0 14px;padding-left:20px;line-height:1.8;color:var(--text-dim,#aaa)">
                    <li style="margin-bottom:6px">❌ 误伤大量正常使用 ECH 的网站和服务</li>
                    <li>❌ 带来较高的封锁成本和副作用</li>
                </ul>
                <p style="line-height:1.8;color:var(--text-dim,#aaa)"><b>ECH 能持续多久，取决于 GFW 的取舍与策略</b>，至少在目前阶段仍然非常有效。</p>
            </div>
            <div id="echPane1" style="display:none">
                <h2 style="font-size:1.2rem;margin-bottom:16px">🚀 如何使用 ECH？</h2>
                <p style="margin-bottom:14px;line-height:1.8;color:var(--text-dim,#aaa)">使用 ECH 非常简单，只需要将 <b>ECH 开关</b> 设为 <b>开启</b> 后更新订阅即可。</p>
                <h3 style="margin:20px 0 12px">📱 支持 ECH 的客户端</h3>
                <h4 style="margin:16px 0 10px;color:var(--text,#fff)">Windows：</h4>
                <ul style="margin:10px 0 14px;padding-left:20px;line-height:1.8;color:var(--text-dim,#aaa)">
                    <li><b>v2r&#97;yN &ge; v7.17.0</b><br><a href="https://github.com/2dust/v2r&#97;yN/releases" target="_blank" rel="noopener" style="color:var(--glass-blue,#60a5fa)">github.com/2dust/v2r&#97;yN</a></li>
                </ul>
                <h4 style="margin:16px 0 10px;color:var(--text,#fff)">Android：</h4>
                <ul style="margin:10px 0 14px;padding-left:20px;line-height:1.8;color:var(--text-dim,#aaa)">
                    <li><b>v2r&#97;yNG &ge; v2.0.0</b><br><a href="https://github.com/2dust/v2r&#97;yNG/releases" target="_blank" rel="noopener" style="color:var(--glass-blue,#60a5fa)">github.com/2dust/v2r&#97;yNG</a></li>
                </ul>
                <h4 style="margin:16px 0 10px;color:var(--text,#fff)">Si&#110;g-box 内核客户端：</h4>
                <ul style="margin:10px 0 14px;padding-left:20px;line-height:1.8;color:var(--text-dim,#aaa)">
                    <li style="margin-bottom:6px"><b>Nek&#111;Box</b>（Android）— 基于 si&#110;g-box 内核，支持 ECH</li>
                    <li><b>Ka&#114;ing</b>（全平台）— 基于 si&#110;g-box 内核，完整支持 ECH</li>
                </ul>
                <h4 style="margin:16px 0 10px;color:var(--text,#fff)">Cl&#97;sh.Met&#97;（mi&#104;omo 内核）：</h4>
                <ul style="margin:10px 0 14px;padding-left:20px;line-height:1.8;color:var(--text-dim,#aaa)">
                    <li style="margin-bottom:6px">所有使用 <b>cl&#97;sh.met&#97; / mi&#104;omo 内核</b> 的客户端均支持 ECH</li>
                    <li style="margin-bottom:6px"><b>FlCl&#97;sh</b>（全平台）— 基于 mi&#104;omo 内核</li>
                    <li>⚠️ <b>需要 DNS 配合使用</b></li>
                </ul>
                <h3 style="margin:20px 0 12px">⚠️ Cl&#97;sh 用户注意事项</h3>
                <p style="margin-bottom:10px;line-height:1.8;color:var(--text-dim,#aaa)">当前订阅配置中已<b>内置 ECH 所需的 DNS 设置</b>。</p>
                <p style="margin-bottom:10px;line-height:1.8;color:var(--text-dim,#aaa)">如果出现以下情况：</p>
                <ul style="margin:10px 0 14px;padding-left:20px;line-height:1.8;color:var(--text-dim,#aaa)">
                    <li style="margin-bottom:4px">✅ 已开启 ECH</li>
                    <li style="margin-bottom:4px">✅ 已更新订阅</li>
                    <li>❌ ECH 节点仍然无法使用</li>
                </ul>
                <p style="margin-bottom:10px;line-height:1.8;color:var(--text-dim,#aaa)">请检查：</p>
                <div style="background:rgba(255,243,205,0.1);border-left:3px solid #ffc107;padding:10px 14px;border-radius:6px;margin-bottom:14px;color:#ffd93d;font-size:0.9rem">是否在更新订阅时覆盖了原有的 DNS 配置</div>
                <p style="line-height:1.8;color:var(--text-dim,#aaa)">建议：<b>不要覆盖订阅中自带的 DNS 设置</b></p>
            </div>
            <div id="echPane2" style="display:none">
                <h2 style="font-size:1.2rem;margin-bottom:16px">🔍 如何确认 ECH 是否已经生效？</h2>
                <p style="margin-bottom:14px;line-height:1.8;color:var(--text-dim,#aaa)">可以通过一个<b>简单且直观的方法</b>来验证 ECH 是否正常工作。</p>
                <h3 style="margin:20px 0 12px">📋 验证步骤</h3>
                <ol style="margin:10px 0 14px;padding-left:20px;line-height:1.8;color:var(--text-dim,#aaa)">
                    <li style="margin-bottom:10px">打开节点的<b>「详细配置信息」</b></li>
                    <li style="margin-bottom:10px">在 <b>HOST</b> 中手动填写一个<b>你当前项目的已被墙的域名</b>，例如：<code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:3px">*.workers.dev</code></li>
                    <li style="margin-bottom:10px">保存配置后<b>重新更新订阅</b></li>
                    <li>在节点列表中查找 HOST 为该域名的节点，并尝试连接</li>
                </ol>
                <h3 style="margin:20px 0 12px">✅ 如何判断结果？</h3>
                <ul style="margin:10px 0 14px;padding-left:20px;line-height:1.8;color:var(--text-dim,#aaa)">
                    <li style="margin-bottom:10px"><b style="color:#10b981">✅ 如果节点可以正常连接使用</b><br>说明 <b>ECH 已成功生效</b>，真实被墙的域名已被隐藏，对外仅显示为 <code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:3px">cloudflare-ech.com</code></li>
                    <li><b style="color:#ef4444">❌ 如果节点无法连接</b><br>说明 ECH 未生效，或客户端版本、DNS 配置存在问题</li>
                </ul>
            </div>
            <button onclick="document.getElementById('echHelpModal').style.display='none'" style="margin-top:20px;width:100%;padding:10px;border:none;border-radius:8px;background:var(--glass-blue,#2563eb);color:#fff;cursor:pointer;font-size:0.9rem">关闭</button>
        </div>
    </div>

    </body>
</html>`;
}
