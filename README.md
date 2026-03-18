# Image Background Remover

基于 Remove.bg API 的图片背景去除工具，支持拖拽上传、一键抠图、下载透明 PNG。

**技术栈：** Next.js 14 + TypeScript + Tailwind CSS

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 [Remove.bg API Key](https://www.remove.bg/api)：

```
REMOVE_BG_API_KEY=your_api_key_here
```

### 3. 本地开发

```bash
npm run dev
```

访问 http://localhost:3000

---

## 生产部署（PM2）

### 1. 构建

```bash
npm run build
```

### 2. 配置 PM2

创建 `ecosystem.config.js`：

```js
module.exports = {
  apps: [{
    name: "image-bg-remover",
    script: "node_modules/.bin/next",
    args: "start -p 3000",
    env: {
      NODE_ENV: "production",
      REMOVE_BG_API_KEY: "your_api_key_here"
    }
  }]
};
```

### 3. 启动

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

访问 `http://your-server-ip:3000`

---

## 功能

- 点击或拖拽上传图片（JPG / PNG / WebP，≤ 12MB）
- 自动调用 Remove.bg API 去除背景
- 原图 vs 结果图并排对比
- 一键下载透明背景 PNG
- 响应式布局，移动端适配
