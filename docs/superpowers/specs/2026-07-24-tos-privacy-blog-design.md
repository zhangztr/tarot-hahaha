# ToS / Privacy Policy / Blog 页面设计

## 背景

项目需要一个塔罗牌在线抽牌网站（React 19 + Vite 6 + TypeScript + Tailwind CSS 4 + HashRouter），目前只有首页和结果页。需要新增：
- **Terms of Service** 和 **Privacy Policy** 页面：用于通过 Google AdSense 审核，也让网站更正规
- **Blog** 页面：SEO 引流（塔罗科普/教程），以及将来发布原创牌义文章

## 设计决策

- **ToS/Privacy**: 内容放 i18n key，使用 `react-markdown` 渲染，用模板 + 定制的方式生成文本
- **Blog**: Markdown 文件驱动，manifest.json 做索引，`react-markdown` 渲染
- **Footer**: 放在 Layout 组件里全站统一显示
- **i18n**: 所有页面中英双语，架构兼容未来更多语言

## 路由

在现有 HashRouter 中新增 4 个路由：

| 路由 | 页面组件 | 说明 |
|------|---------|------|
| `/tos` | `TosPage` | 服务条款 |
| `/privacy` | `PrivacyPage` | 隐私政策 |
| `/blog` | `BlogListPage` | 文章列表 |
| `/blog/:slug` | `BlogPostPage` | 文章详情 |

## 目录结构

```
src/
  pages/
    TosPage.tsx
    PrivacyPage.tsx
    BlogListPage.tsx
    BlogPostPage.tsx
  components/
    Footer.tsx
  data/blog/
    manifest.json              # 文章索引
    getting-started-zh.md      # 新手入门（中）
    getting-started-en.md      # 新手入门（英）
```

修改文件：
- `src/App.tsx` — 加路由
- `src/components/Layout.tsx` — 加 Footer
- `src/i18n/zh.ts` — 新增翻译 key
- `src/i18n/en.ts` — 新增翻译 key

## 组件设计

### TosPage / PrivacyPage

- 从 i18n 获取 `tosTitle` / `tosContent`（或 `privacyTitle` / `privacyContent`）
- `tosContent` 和 `privacyContent` 是 markdown 字符串
- 用 `react-markdown` 渲染为 HTML
- 布局：居中卡片式，白色背景，带标题

### BlogListPage

- 读取 `src/data/blog/manifest.json`
- 按日期倒序排列
- 每篇文章渲染一张卡片：标题、日期、摘要
- 点击卡片跳转 `/blog/:slug`

### BlogPostPage

- 从 URL 参数获取 slug
- 在 manifest 中查找对应文章元信息
- 根据当前语言加载对应的 `.md` 文件（`{slug}-{lang}.md`）
- Vite 的 `import.meta.glob` 或动态 import 加载 raw 内容
- `react-markdown` 渲染

### Footer

- 放在 Layout 组件中，所有页面自动出现
- 链接：ToS | Privacy | Blog
- 版权信息
- 低调样式，一行排列

## i18n 扩展

在 `zh.ts` 和 `en.ts` 中新增以下 key：

| key | 用途 |
|-----|------|
| `tosTitle` | ToS 页面标题 |
| `tosContent` | ToS 正文（markdown） |
| `privacyTitle` | Privacy 页面标题 |
| `privacyContent` | Privacy 正文（markdown） |
| `blogTitle` | Blog 列表标题 |
| `blogBackToList` | 返回文章列表链接文字 |
| `blogNoPosts` | 无文章时提示 |
| `blogPublishedOn` | 发布日期前缀 |
| `footerTos` | Footer 中 ToS 链接文字 |
| `footerPrivacy` | Footer 中 Privacy 链接文字 |
| `footerBlog` | Footer 中 Blog 链接文字 |
| `footerCopyright` | Footer 版权信息 |

## 外部依赖

新增：`react-markdown` (~20KB)

## 内容来源

### ToS
英文版基于标准模板翻译 + 本站定制：服务性质（在线占卜、仅供娱乐）、免责声明、知识产权、用户行为规范。

### Privacy
英文版基于标准模板翻译 + 本站定制：数据收集（AdSense、分析工具）、Cookie、第三方服务、用户权利（无账号系统、不收集个人信息）。

### Blog 首篇文章
英文版 "Tarot Beginner's Guide"：介绍塔罗牌基础、本站使用方法、牌阵选择建议。

## 更新文章流程

1. 在 `src/data/blog/` 写 `.md` 文件（中英各一篇）
2. 在 `manifest.json` 添加条目
3. `git commit` + `git push` → Cloudflare Pages 自动部署
