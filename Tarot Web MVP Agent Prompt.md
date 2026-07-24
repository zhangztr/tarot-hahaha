#  Tarot Web MVP Agent Prompt

你是一个资深前端工程师 + 产品设计师，负责从零实现一个“塔罗牌抽卡网站 MVP”。

## 🎯 项目目标
构建一个可部署在 GitHub Pages 的纯前端塔罗网站 MVP，提供基础抽牌体验，不依赖后端。

用户可以：
1. 输入或选择一个问题（可选）
2. 选择牌阵（单张 / 三张牌）
3. 点击“开始抽牌”
4. 看到抽牌动画 + 翻牌结果
5. 查看每张牌的含义 + 总结解读

---

## ⚙️ 技术约束（必须遵守）
- 仅使用纯前端方案（HTML + CSS + JavaScript 或 Vite + Vue/React）
- 不使用任何后端服务
- 不使用数据库
- 数据全部本地 JSON 管理
- 可部署到 GitHub Pages
- 支持 SPA（推荐 hash 路由避免刷新 404）

---

## 🧱 核心功能模块

### 1️⃣ 塔罗牌数据系统
实现一个 tarot.json，包含 78 张牌结构：

每张牌结构：
- id
- name（名称）
- arcana（大阿尔卡纳 / 小阿尔卡纳）
- suit（圣杯/权杖/宝剑/钱币，小牌使用）
- upright meaning（正位解释）
- reversed meaning（逆位解释）
- keywords（关键词数组）

---

### 2️⃣ 抽牌系统（核心逻辑）
实现：
- shuffle(cards)
- draw(cards, n)
- 每张牌随机 upright / reversed（50%概率）

要求：
- 不允许重复抽牌
- 必须返回结构化结果

---

### 3️⃣ 牌阵系统（MVP只要两个）

#### 🟢 单张牌
用途：快速指引

#### 🟡 三张牌阵
默认模式：
- 过去 / 现在 / 未来
或
- 问题 / 阻碍 / 建议

要求：
- 结果必须带 position 字段

---

### 4️⃣ 洗牌 + 抽牌动画（简化版即可）
必须包含：
- 卡牌背面展示
- 点击“抽牌”触发 shuffle 动画（CSS 或 JS）
- 延迟翻牌效果（0.3~1s）

不要求复杂3D，但必须有“仪式感”

---

### 5️⃣ 结果展示页面
结构：

- 展示抽到的牌（卡片）
- 每张牌：
  - 名称
  - 正/逆位标识
  - 对应解释
- 最后生成一个 summary（总结文本）

---

### 6️⃣ 解读生成规则（MVP简化版）
不要AI，使用规则拼接：

示例逻辑：
- 如果多张“逆位” → 输出“阻碍较多”
- 如果权杖多 → 行动力强
- 如果圣杯多 → 情绪主导

---

## 🎨 UI要求
风格：
- 神秘 / 星象 / 紫黑色调
- 卡牌发光边框
- hover 有轻微浮动效果

布局：

- 居中卡牌区域
- 下方按钮（抽牌）
- 结果页分区展示

---

## 📦 项目结构建议

src/
 ├── assets/
 ├── data/tarot.json
 ├── utils/
 │    ├── shuffle.js
 │    ├── draw.js
 │    ├── interpret.js
 ├── components/
 │    ├── Card.vue / Card.jsx
 │    ├── Spread.vue
 ├── pages/
 │    ├── Home
 │    ├── Result
 ├── App

---

## 🔧 核心算法要求

### 洗牌
使用 Fisher-Yates shuffle

### 抽牌
必须保证：
- 不重复
- 随机
- 支持 N 张

### 正逆位
```js
Math.random() > 0.5
```



# 前端ui设计模板：

# Master Specification: Recreating the Mindful Hero Banner

Act as an award-winning designer and elite web developer. Your objective is precisely and meticulously recreate the following single-page application section: a stunning, immersive hero banner for a mindfulness web application. The implementation must mirror this specification exactly, translating every design decision, layout structure, animation sequence, and technical requirement into production-ready code.

---

## 1. Complete Visual Design System

### A. Color Palette
The color system creates a calming, natural, yet premium aesthetic that contrasts elegantly over a dark, atmospheric video background.

**Brand Colors:**
- **Brand Gold:** `#e2b05c` (Used for eyebrow text, decorative highlights, and subtle accents)
- **Brand Teal:** `#3ba4ab` (Used for the primary call-to-action button, conveying a sense of serenity and growth)

**Base & Overlay Colors (Tailwind Variables):**
- **Base Background:** `slate-900` (`#0f172a`) - serves as the fallback before the video loads.
- **Overlay 1:** Pure Black (`#000000`) with 30% opacity (`bg-black/30`) for a base darkening layer.
- **Overlay 2:** Gradient fading from left to right: `slate-950/90` (`#020617` at 90% opacity) via `slate-900/50` to transparent.
- **Overlay 3:** Gradient fading from bottom to top: `slate-950/80` via transparent to transparent.

**Text Colors:**
- **Primary Text:** White (`#ffffff`) at 100% opacity for headings.
- **Secondary Text:** White at 80% opacity (`text-white/80`) for subheadings and body.
- **Navigation Text:** White at 90% opacity (`text-white/90`) transitioning to solid white on hover.

### B. Typography
The typography contrasts a highly legible, modern sans-serif for UI elements with a refined, elegant serif for display headings.

- **Primary UI Font (Sans-Serif):** `Inter` (Weights: 300, 400, 500, 600)
- **Display Font (Serif):** `Playfair Display` (Weights: 400, 500, 600, Normal/Italic styles)

**Implementation Details:**
- **Nav Links:** `Inter`, text-sm to text-base, font-medium, tracking-wide.
- **Eyebrow Text:** `Inter`, text-sm to text-base, font-medium, tracking-wide.
- **Headline:** `Playfair Display`, text-3xl, scaling up to text-5xl on desktop. Font-weight: normal, leading: tightly packed (`leading-[1.1]`).
- **Subheadline:** `Inter`, text-lg to text-xl, font-light, leading-relaxed.

---

## 2. Layout Structure & Grid System

- **Global Wrapper:** Minimal height of the screen (`min-h-screen`), full width (`w-full`), relative positioning, hidden overflow.
- **Main Content Container:** `max-w-screen-2xl`, centered (`mx-auto`), relative positioning (z-index: 10), flex-column layout.
- **Padding:**
  - Mobile: `px-6`
  - Tablet: `px-12`
  - Desktop: `px-24`

---

## 3. Section-by-Section Hierarchy & Components

### A. The Immersive Background (Video & Overlays)
- **Asset:** A looping mindfulness video.
  - **URL:** `https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/hero_video_mindfull.mp4`
- **Video Element:** Positioned absolutely, filling the parent (`w-full h-full`), `object-cover`. Scaled up slightly (`scale-105`) to create a smooth, bleeding edge. Must have `autoPlay`, `loop`, `muted`, and `playsInline` attributes.
- **Overlay Stack:**
  1. Base darkening: `absolute inset-0 bg-black/30 z-0`
  2. Horizontal gradient (left anchor): `absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/50 to-transparent z-0`
  3. Vertical gradient (bottom anchor): `absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-0`

### B. Navigation Header
- **Layout:** Full width, padded nicely (`py-8`), flex container centered.
- **Structure:** 
  - Left Links: "Home", "Practices" 
  - Center Box: Circular logo container `w-14 h-14` with a thin white border (`border border-white`), rounded-full, containing a `Flower2` icon (from lucide-react with `strokeWidth={1.2}`).
  - Right Links: "Journal", "Community"
- **Visibility:** Text links are hidden on mobile (`hidden sm:block`) keeping only the logo visible on small devices. 
- **Spacing:** `gap-6` scaling to `gap-16` on medium+ screens. Logo has horizontal margins (`mx-2 md:mx-6`).

### C. Hero Content Section
- **Layout:** Flex column layout taking up the remaining space (`flex-1`), vertically centered (`justify-center`), padded heavily at the bottom (`pb-24`) and minimally at the top (`pt-10`).
- **Content Max-Width:** Confined to `max-w-2xl` on the left side (due to layout flow and left-aligned text).

**Element Cascade:**
1. **Eyebrow:** "Small Steps. Lasting Change." (Brand Gold color, margin-bottom: 24px)
2. **Main Headline:** "Calm Your Mind, [Line Break] Transform Your Life." (White, margin-bottom: 32px)
3. **Decorative Divider:** A horizontal flex container featuring a golden `Leaf` icon (stroke width 1.5) followed by a thin golden line (`h-px w-32 bg-brand-gold/30`).
4. **Subheadline:** "Daily practices to reduce stress, build mindfulness, and create a life of balance and purpose." (White 80% opacity, margin-bottom: 40px, max-width tailored to `max-w-lg`).
5. **Call-To-Action Group:**
   - **Primary Button (Start Your Journey):** `bg-brand-teal` with right arrow icon. `px-8 py-4` rounded-full, font-medium, flex, center-aligned, gap-3.
   - **Secondary Button (Learn More):** Outline style. Border a semi-transparent white (`border-white/40`), transparent background, right arrow icon. `px-8 py-4` rounded-full, font-medium, flex, center-aligned, gap-3.

---

## 4. Animations & Micro-Interactions

### A. Initial Load Animations (Framer Motion / Motion for React)
- **Navigation Drop-in:** 
  - Initial: `opacity: 0, y: -20`
  - Animate: `opacity: 1, y: 0`
  - Transition: Duration 1.0s, ease "easeOut".
- **Content Stagger (Staggered Fade/Slide Up):**
  - **Container:** `staggerChildren: 0.15` delay, `delayChildren: 0.3`.
  - **Children (Eyebrow, Headline, Divider, Subhead, Buttons):**
    - Initial: `opacity: 0, y: 30`
    - Animate: `opacity: 1, y: 0`
    - Transition: Duration 0.8s, custom bezier easing `[0.16, 1, 0.3, 1]` for an elegant, snappy yet smooth arrival.

### B. Hover & Focus States (Tailwind Pseudo-classes)
- **Nav Links:** Base text-white/90. On hover: `hover:text-white transition-colors`.
- **Logo Container:** Base transparent. On hover: softly lit `hover:bg-white/10 transition-colors`.
- **Primary Button:** Base `bg-brand-teal`. On hover: shifts slightly lighter `hover:bg-[#47c4c9]`. The contained Arrow icon transitions right (`group-hover:translate-x-1 transition-transform`).
- **Secondary Button:** Base `border-white/40`, background transparent. On hover: Border becomes solid `hover:border-white`, background gains a slight white tint `hover:bg-white/5`. The contained Arrow (base opacity 70%) becomes 100% opaque and translates right (`group-hover:opacity-100 group-hover:translate-x-1`).

---

## 5. Responsive Behavior

- **Mobile First (`< 640px`):** 
  - Text links in nav are hidden.
  - Headline font size is `text-3xl`.
  - Content padding and gaps are minimized (`px-6`, button `gap-4`).
- **Tablet/Medium (`>= 768px`):** 
  - Text links appear.
  - Headline font size scales to `text-4xl`.
  - Spacing increases (`px-12`).
  - Flex layouts space out more comfortably.
- **Desktop/Large (`>= 1024px`):**
  - Headline font size scales to `text-5xl`.
  - Lateral container padding increases to `px-24`.
  - Background overlay gradients effectively block out the video cleanly on the left hemisphere, preserving legibility.

---

## 6. Technical Implementation Details

### A. Frontend Architecture & Stack
- **Framework:** React 19+
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4+ (Mobile-first, utility classes)
- **Animation Engine:** `motion/react` (Framer Motion API equivalent)
- **Iconography:** `lucide-react` (Usage of `ArrowRight`, `Leaf`, `Flower2`)

### B. Required Project Setup
- **CSS Configuration:** The main CSS (`index.css`) must import the Google fonts (`Inter` and `Playfair Display`) and set up custom Tailwind theme variables under the `@theme` directive mapping `--font-sans` to Inter, `--font-serif` to Playfair Display, `--color-brand-gold` to `#e2b05c`, and `--color-brand-teal` to `#3ba4ab`.
- **File Structure:** Core visuals and layout reside inside `src/App.tsx`. 

### C. Performance & SEO Expectations
- **Performance:** Ensure no layout shift (CLS). The background color fallback (`bg-slate-900`) should match the darkest gradients of the video to provide continuity while the video asset loads. Use `playsInline` on video to prevent full-screen hijacking on iOS devices.
- **Accessibility:** Use proper semantic HTML where appropriate (`nav`, `h1`, `p`, `button`). The gradients over the video are completely intentional to ensure high contrast text legibility (WCAG AAA compliance for the left-aligned hero text). The video avoids rapid flashing to be mindful of vestibular disorders.
- **SEO Elements:** Though a single-page element, ensure the main `h1` encapsulates the core value proposition text exactly as written.

Reconstruct this UI identically, prioritizing fluid animation, perfect whitespace distribution, precise typography handling, and an overarching serene visual mood.