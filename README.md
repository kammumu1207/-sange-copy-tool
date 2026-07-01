# 三哥文案生成器

小三美日三哥 IG 輪播文案 AI 生成工具。

## 部署步驟

### 1. 上傳到 GitHub

1. 到 [github.com](https://github.com) 建立新 repository（名稱例：`sange-copy-tool`）
2. 把這個資料夾裡的所有檔案上傳進去（可以直接拖曳上傳）

### 2. 部署到 Vercel

1. 到 [vercel.com](https://vercel.com) 登入（可用 GitHub 帳號）
2. 點「Add New Project」→ 選剛才的 GitHub repo
3. 直接點「Deploy」（不用改任何設定）

### 3. 設定 API Key

1. 部署完成後，進入 Vercel 專案頁面
2. 點上方「Settings」→ 左側「Environment Variables」
3. 新增一個變數：
   - **Name**：`ANTHROPIC_API_KEY`
   - **Value**：你的 Anthropic API Key（到 [console.anthropic.com](https://console.anthropic.com) 取得）
4. 點「Save」
5. 回到「Deployments」→ 點最新一筆右側「···」→「Redeploy」

### 4. 完成！

Vercel 會給你一個網址（例：`sange-copy-tool.vercel.app`），直接用瀏覽器開啟就能使用。

## 檔案結構

```
sange-copy-tool/
├── public/
│   └── index.html      # 前端介面
├── api/
│   └── generate.js     # 後端 API（呼叫 Anthropic）
├── vercel.json         # Vercel 設定
└── README.md
```

## 使用方式

1. 上傳輪播圖片（最多4張）
2. 選擇發文模式（純分享 / 導購）
3. 點「AI 讀圖生成文案」
4. 切換分頁查看各格文案，點「複製」帶走
