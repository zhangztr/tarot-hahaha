# GSC + AdSense 接入指南

## 当前状态

- 域名：`ztrcloud.com`（已购买，所有权归你）
- 部署平台：Cloudflare Pages（已关联域名，打开即塔罗项目）
- AdSense 占位代码已嵌入 `index.html`，publisher ID 待替换

---

## 一、Google Search Console（GSC）

### 步骤 1：添加资源

1. 打开 https://search.google.com/search-console
2. 点击左上角「+ 添加资源」
3. 选择 **网域**（不是网址前缀）
4. 输入 `ztrcloud.com`，点继续

### 步骤 2：验证所有权（DNS TXT 记录）

因为你域名在 Cloudflare 上，直接加 TXT 记录即可：

1. GSC 会给你一条 TXT 记录（类似 `google-site-verification=xxxxx`）
2. 复制那条记录的值
3. 打开 https://dash.cloudflare.com → 选 `ztrcloud.com`
4. 左侧菜单 → DNS → 记录 → 添加记录
5. 类型选 **TXT**，名称填 `@`，内容粘贴 GSC 给的记录值
6. 保存，等 1-2 分钟生效
7. 回到 GSC 点「验证」，应该秒过

### 步骤 3：提交站点地图（可选）

React SPA 一般不需要。如果后续想提交，在项目 `public/` 目录放一个 `sitemap.xml`，Cloudflare Pages 部署后 GSC 就能抓到。

---

## 二、Google AdSense

### 当前状况

`index.html` 里已经有广告占位代码，用的是占位 ID `ca-pub-xxxxxxxxxxxxxx`。需要拿到真实 publisher ID 后替换。

### 申请步骤

1. 打开 https://www.google.com/adsense
2. 点「开始使用」，用你的 Google 账号登录
3. 网站 URL 填 `ztrcloud.com`
4. 提交审核，等邮件通知（通常 1-2 周）

### 通过后要做的事

AdSense 审核通过后会给你一段这样的代码：

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-你的真实ID"
     crossorigin="anonymous"></script>
```

把 `index.html` 第 9 行的 `ca-pub-xxxxxxxxxxxxxx` 替换成你的真实 ID。同时把 `ResultPage.tsx` 第 101 行的 `data-ad-client` 和 `data-ad-slot` 也改成真实值。然后 push 部署。

### 如果被拒

常见原因和应对：

| 拒绝原因 | 应对 |
|---------|------|
| 内容不足 | 塔罗网站目前只有首页+结果页。考虑增加关于页面、每日一牌、塔罗教学等静态内容页 |
| 流量太低 | 正常，新站都这样。先上线运营一段时间再重新提交 |
| 政策违规 | 检查是否有外部链接、用户生成内容、不适当内容。塔罗类一般没问题 |

---

## 三、当前 AdSense 代码位置

| 文件 | 位置 | 占位内容 |
|------|------|----------|
| `index.html:9` | `<head>` 全局脚本 | `ca-pub-xxxxxxxxxxxxxx` |
| `src/pages/ResultPage.tsx:99-104` | 结果页底部广告位 | `data-ad-client="ca-pub-xxxxxxxxxxxxxx"` `data-ad-slot="1234567890"` |

通过后两个文件都要改。

---

## 执行顺序

```
现在 → GSC 加网域 ztrcloud.com → Cloudflare DNS 加 TXT 记录 → GSC 验证
     → AdSense 提交 ztrcloud.com 申请
     → 等审核（1-2 周）
       ├── 通过 → 替换 publisher ID → push → 挂广告
       └── 被拒 → 看原因 → 补内容/运营 → 重新提交
```
