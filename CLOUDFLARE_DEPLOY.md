# Cloudflare Pages 部署指南

## 前置准备

### 1. 修改 base 路径

当前 `vite.config.ts` 的 `base: "/tarot-hahaha/"` 是为 GitHub Pages 项目站配置的。Cloudflare Pages 从根路径 `/` 提供服务，需要改掉：

```ts
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",   // 从 /tarot-hahaha/ 改为 /
});
```

> 如果你需要同时保留 GitHub Pages 和 Cloudflare 两套部署，可以改为 `base: process.env.CF_PAGES ? "/" : "/tarot-hahaha/"`，然后在 Cloudflare 构建时设置环境变量 `CF_PAGES=1`。

---

## 方案 A：Git 集成（推荐，自动部署）

每次 push 到 GitHub 自动构建部署。

### 步骤

1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **创建** → **Pages** → **连接到 Git**

2. 授权并选择 `zhangztr/tarot-hahaha` 仓库

3. 配置构建：
   - **构建命令**：`npm run build`
   - **输出目录**：`dist`
   - **框架预设**：留空（或选 None）

4. 点击 **保存并部署**

之后每次 `git push` 到 main 分支，Cloudflare 会自动拉取、构建、部署。

---

## 方案 B：Wrangler CLI（手动上传）

适合不想授权 Git，或需要手动控制部署时机。

### 步骤

1. 安装 Wrangler CLI：

```bash
npm install -g wrangler
```

2. 登录 Cloudflare：

```bash
wrangler login
```

3. 构建项目：

```bash
npm run build
```

4. 部署 dist 目录：

```bash
wrangler pages deploy dist --project-name=tarot-hahaha
```

首次运行会提示创建项目，输入项目名 `tarot-hahaha` 即可。

5. 后续更新只需重复步骤 3、4：

```bash
npm run build && wrangler pages deploy dist
```

---

## 部署后

部署成功后，你的网站地址格式为：

```
https://tarot-hahaha.pages.dev
```

（项目名即子域名，也可在 Cloudflare 后台绑定自定义域名）

GitHub Pages 的那套 `HashRouter` + `base` 路由方式和 Cloudflare Pages 完全兼容，不需要改动路由代码。
