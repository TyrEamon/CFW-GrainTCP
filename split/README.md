# GrainTCP split deployment

This folder keeps the original `worker.js` safe and adds a separated deployment path:

- `backend-worker.js`: Worker backend with the original proxy, subscription, and legacy dashboard routes still present.
- `frontend-worker.js`: Worker frontend that serves the generated panel and injects the backend URL from Cloudflare environment variables.
- `panel/index.html`: static dashboard for Cloudflare Pages or any static host. It is generated from the original `worker.js` frontend templates and only adds a sidebar "后端地址" section.
- `wrangler.frontend.jsonc`: Wrangler config for Git-connected frontend Worker builds.
- `wrangler.backend.example.toml`: optional Wrangler example for the backend Worker.

## Backend

Deploy `split/backend-worker.js` as a Worker.

Keep the same bindings and variables you already use on the original Worker, especially the D1 binding named `DB` if you use persistent config/logs.

If the static panel is on another origin, set:

```text
PANEL_ORIGIN=https://your-panel.pages.dev
```

Multiple panel origins can be comma separated:

```text
PANEL_ORIGINS=https://a.pages.dev,https://panel.example.com
```

The new API routes are additive:

```text
GET    /api/theme
POST   /api/login
POST   /api/logout
GET    /api/session
GET    /api/bootstrap
GET    /api/stats
GET    /api/logs
GET    /api/whitelist
POST   /api/whitelist
DELETE /api/whitelist
POST   /api/config
POST   /api/validate/tg
POST   /api/validate/cf
POST   /api/log/github
```

Legacy routes still work:

```text
/
/sub
/<SUB_PASSWORD>
/proxyip=...
```

## Frontend Worker with CF variables

Deploy `split/frontend-worker.js` as the frontend Worker.

For Cloudflare Workers Builds, use:

```bash
npx wrangler deploy --config split/wrangler.frontend.jsonc --keep-vars
```

Keep the build command empty. The config preserves the frontend route and Worker name; `--keep-vars` keeps dashboard-set variables such as `PANEL_BACKEND`.

Set this variable on the frontend Worker:

```text
PANEL_BACKEND=https://your-backend-worker.example.com
```

`BACKEND_URL` and `DEFAULT_BACKEND` are also accepted as aliases. Open the frontend URL and log in with the backend Worker's `WEB_PASSWORD`.

Optional frontend-only login background:

```text
PANEL_LOGIN_BG=https://rapi.mtcacg.top/ri/h/1326.webp
```

`PANEL_BG_LOGIN` and `BG_LOGIN` are also accepted as aliases. This image is applied immediately by the frontend Worker before the backend theme API finishes loading.

If you deploy only `panel/index.html` as a static Pages upload, Cloudflare runtime variables are not available to the HTML. Use `frontend-worker.js` when you want the backend address to come from the Cloudflare dashboard.

## Static frontend fallback

Deploy the `split/panel` folder to Cloudflare Pages only if you are fine with using `?backend=...`, localStorage, or the first-run setup screen.

Open the Pages URL, enter the backend Worker URL, then log in with the existing `WEB_PASSWORD`. The panel stores only the backend URL in browser localStorage. The login cookie is set by the backend as `HttpOnly`.

Local preview also works:

1. Deploy `split/backend-worker.js` as the backend Worker.
2. For local `file://` preview, set the backend Worker variable `PANEL_ORIGIN=*` temporarily, or set `PANEL_ORIGINS=null`.
3. Open `D:\Desktop\代理-项目\GrainTCPV1\split\panel\index.html`.
4. Seed the backend URL before the first login with one of these methods:
   - Open `index.html?backend=https://graintcp-backend.your-subdomain.workers.dev`
   - Or run `localStorage.setItem('grainPanelBackend', 'https://graintcp-backend.your-subdomain.workers.dev')` in the browser console and reload.
   - Or deploy `frontend-worker.js` and set `PANEL_BACKEND` in the frontend Worker's variables.
5. Click "立即登陆" and enter the same password as `WEB_PASSWORD` in `worker.js` or the backend Worker's environment variable.
6. After login, open the sidebar item "后端地址" if you need to change the backend URL later.

If login does nothing or shows a CORS/network error, the usual causes are:

- The backend is still the old root `worker.js`; deploy `split/backend-worker.js` because the split panel needs `/api/*`.
- `PANEL_ORIGIN` / `PANEL_ORIGINS` does not allow the panel origin.
- The backend URL was saved incorrectly; run this in the browser console and reload:

```js
localStorage.setItem('grainPanelBackend', 'https://graintcp-backend.your-subdomain.workers.dev');
location.reload();
```

## Rollback

Nothing in the project root was replaced. Your existing `worker.js` is still the original single-file deployment path.
