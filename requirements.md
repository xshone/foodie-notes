# 📋 Foodie Notes — 需求文档

## 项目概述

**Foodie Notes** 是一款面向个人用户的菜谱记录 Web 应用，主打移动端体验，风格简洁有个性。用户可以随时随地记录自己的拿手菜、试验性食谱，并在需要时快速查阅。

---

## 技术栈

| 层级    | 技术                       |
| ------- | -------------------------- |
| 框架    | Next.js 16 (App Router)    |
| 数据库  | Vercel Postgres            |
| ORM     | Prisma 7                   |
| 样式    | Tailwind CSS v4            |
| UI 组件 | shadcn/ui (new-york style) |
| 语言    | TypeScript                 |

---

## 核心功能需求

### 1. 菜谱列表页 (`/recipes`)

- [x] 展示所有菜谱，按创建时间倒序排列
- [x] 每张卡片显示：菜名、简介、分类标签、难度、总用时、封面图（可选）、收藏状态
- [x] 顶部导航栏含菜谱总数统计与「记录菜谱」入口按钮
- [x] 空状态引导页（含图标和创建按钮）
- [ ] **[待实现]** 搜索 / 筛选（按分类、难度、关键词）
- [ ] **[待实现]** 排序切换（最新、最老、按分类）
- [ ] **[待实现]** 收藏专栏（仅显示收藏菜谱）

### 2. 新建菜谱页 (`/recipes/new`)

- [x] 表单字段：菜名（必填）、简介、分类、难度、份量、备料时间、烹饪时间
- [x] 食材清单：动态增删，每行含：食材名、用量、单位
- [x] 步骤列表：动态增删，支持有序步骤文本
- [x] 标签：输入后回车添加，支持删除
- [x] 备注 / 小贴士文本框
- [ ] **[待实现]** 封面图片上传（本地文件或URL）
- [ ] **[待实现]** 表单草稿自动保存（localStorage）
- [ ] **[待实现]** 表单校验与错误提示

### 3. 菜谱详情页 (`/recipes/[id]`)

- [x] 展示完整菜谱信息：标题、描述、时间统计卡、分类、难度、份量
- [x] 食材清单：对齐展示名称与用量
- [x] 有序步骤列表（带序号圆圈）
- [x] 标签列表、备注区块
- [x] 收藏 / 取消收藏（即时UI反馈）
- [x] 删除菜谱（带确认对话框）
- [ ] **[待实现]** 编辑菜谱（跳转编辑页或行内编辑）
- [ ] **[待实现]** 分享菜谱（复制链接 / 生成图片）
- [ ] **[待实现]** 打印友好样式

### 4. 编辑菜谱页（待实现）

- [ ] 路由：`/recipes/[id]/edit`
- [ ] 表单与新建页复用，数据预填充
- [ ] 保存后跳回详情页

---

## 用户体验要求

### 移动端优先

- 所有页面宽度 ≤ 640px (max-w-2xl centered)
- 触摸友好的点击目标（≥ 44×44px）
- 底部导航或固定按钮，避免频繁滚动到顶部
- 防止移动端缩放 (`maximum-scale: 1`)

### 设计风格

- 极简、克制、有个性（非千篇一律的管理后台风格）
- 中文优先，UI文案全中文
- 暗色模式支持（`.dark` class）
- 圆角、细腻的 shadcn 风格组件

---

## 数据模型

### `Recipe`

| 字段          | 类型          | 说明                           |
| ------------- | ------------- | ------------------------------ |
| `id`          | String (cuid) | 主键                           |
| `title`       | String        | 菜名（必填）                   |
| `description` | String?       | 简介                           |
| `category`    | String?       | 分类（家常菜/早餐/汤粥等）     |
| `servings`    | Int?          | 份量（人数）                   |
| `prepTime`    | Int?          | 备料时间（分钟）               |
| `cookTime`    | Int?          | 烹饪时间（分钟）               |
| `difficulty`  | String?       | `"easy" \| "medium" \| "hard"` |
| `ingredients` | Json          | `[{ name, amount, unit }][]`   |
| `steps`       | Json          | `[{ order, text }][]`          |
| `tags`        | String[]      | 自由标签数组                   |
| `imageUrl`    | String?       | 封面图片 URL                   |
| `notes`       | String?       | 备注 / 小贴士                  |
| `isFavorite`  | Boolean       | 是否收藏（默认 false）         |
| `createdAt`   | DateTime      | 创建时间                       |
| `updatedAt`   | DateTime      | 最后更新时间                   |

---

## 目录结构

```
src/
├── actions/
│   └── recipe.ts          # Server Actions（增删改查、收藏）
├── app/
│   ├── layout.tsx          # 根布局（metadata + 全局字体）
│   ├── page.tsx            # 重定向到 /recipes
│   ├── globals.css         # Tailwind + shadcn CSS 变量
│   └── recipes/
│       ├── page.tsx        # 菜谱列表页（Server Component）
│       ├── new/
│       │   └── page.tsx    # 新建菜谱页
│       └── [id]/
│           └── page.tsx    # 菜谱详情页
├── components/
│   ├── recipe-card.tsx     # 菜谱卡片（列表用）
│   ├── recipe-detail.tsx   # 菜谱详情展示（Client Component）
│   ├── recipe-form.tsx     # 新建 / 编辑表单（Client Component）
│   ├── empty-state.tsx     # 空状态组件
│   └── ui/                 # shadcn/ui 自动生成组件
└── lib/
    ├── prisma.ts           # Prisma Client 单例
    └── utils.ts            # cn() 工具函数
```

---

## 部署指南（Vercel）

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 导入该 GitHub 项目
3. 在 Vercel Storage 面板创建 Postgres 数据库并关联项目
4. Vercel 会自动注入 `POSTGRES_PRISMA_URL` 和 `POSTGRES_URL_NON_POOLING` 环境变量
5. 触发部署（build 命令 `prisma generate && prisma db push && next build` 会自动同步数据库结构）

### 本地开发

1. 复制 `.env.example` 为 `.env`（如需）
2. 配置 `POSTGRES_PRISMA_URL` 和 `POSTGRES_URL_NON_POOLING`
3. 运行 `npm run dev`

---

## 后续优化方向

- **图片上传**：接入 Vercel Blob 存储，支持本地拍照上传封面
- **搜索功能**：实时全文搜索菜名、食材、标签
- **分类筛选**：底部 tab 或顶部胶囊过滤器
- **编辑功能**：复用 `RecipeForm` 组件，路由 `/recipes/[id]/edit`
- **数据导出**：将菜谱导出为 JSON 或 PDF
- **多用户支持**：接入 NextAuth.js 实现账号系统（可选）
