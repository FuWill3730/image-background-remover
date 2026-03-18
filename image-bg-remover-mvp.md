# Image Background Remover — MVP 需求文档

## 1. 产品概述

一个图片背景去除工具，用户上传图片后，调用 Remove.bg API 自动去除背景，支持下载透明背景的 PNG 文件。

**目标用户：** 需要快速抠图的普通用户（电商、设计师、社交媒体运营）
**部署方式：** 自有服务器（VPS/云服务器）
**技术栈：** Next.js 14 + TypeScript + Tailwind CSS

---

## 2. 核心功能（MVP 范围）

### 2.1 图片上传
- 支持点击上传和拖拽上传
- 支持格式：JPG、PNG、WebP
- 文件大小限制：≤ 12MB（Remove.bg 免费版限制）
- 上传后立即预览原图

### 2.2 背景去除
- 调用 Remove.bg API 处理图片
- 处理中显示 loading 状态
- 处理完成后并排展示：原图 vs 结果图
- 错误处理：API 失败、额度不足、网络超时

### 2.3 结果下载
- 一键下载透明背景 PNG
- 文件名格式：`removed-bg-{原文件名}.png`

---

## 3. 技术方案

### 架构流程
```
前端上传图片 → API Route(/api/remove-bg) → Remove.bg API → 返回处理后图片 → 前端下载
```

### 技术栈

| 项目 | 方案 |
|------|------|
| 前端框架 | Next.js 14 + TypeScript |
| 样式 | Tailwind CSS |
| API | Remove.bg REST API |
| Runtime | Node.js Runtime |
| 图片处理 | 纯内存，无服务端存储 |
| 部署 | 自有服务器（PM2，IP+端口直接访问） |

### API 设计
```
POST /api/remove-bg
Request:  multipart/form-data，字段 image: File
Response: { processedImage: base64, status: "success" | "error" }
```

### 环境变量
```
REMOVE_BG_API_KEY=your_api_key_here
```
- 本地开发：存在 `.env.local`（不提交 git）
- 生产环境：服务器上的 `.env.production` 或通过 PM2 ecosystem 配置注入

---

## 4. 页面结构

```
┌─────────────────────────────────┐
│  Logo + 标题                    │
├─────────────────────────────────┤
│  上传区域（拖拽 / 点击）         │
├─────────────────────────────────┤
│  原图 | 结果图（处理后显示）      │
├─────────────────────────────────┤
│  下载按钮                       │
└─────────────────────────────────┘
```

---

## 5. 非功能需求

- 移动端适配（响应式布局）

---

## 6. MVP 不包含

- 用户账号系统
- 历史记录
- 批量处理
- 自定义背景替换
- 付费/订阅功能

---

## 7. 成功指标

- 用户能在 30 秒内完成"上传 → 抠图 → 下载"全流程
- API 调用成功率 > 95%

---

## 8. 交付物

- Next.js 项目，部署到自有服务器
- `.env.local.example` 示例文件
- README：部署说明（PM2 启动，IP+端口访问）
