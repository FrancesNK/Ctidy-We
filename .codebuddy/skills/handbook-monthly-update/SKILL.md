---
name: handbook-monthly-update
description: 更新「改变从整理开始」小程序每月整理计划（handbook 页面）时使用。涵盖更新月度主题、打卡任务、转发文案、全年主题时间线，以及同步更新带二维码的月度海报 HTML。当用户提到"更新每月整理计划""切换到X月""更新月度主题/海报"等需求时触发。
---

# 手账本月度更新

用于把小程序「本月计划」（`pages/handbook/`）切换到新的月份。

## 需要更新的文件

| 文件 | 更新内容 |
|------|---------|
| `pages/handbook/plan-data.js` | 月度打卡任务（图标、标题、描述） |
| `pages/handbook/handbook.js` | `CHECKIN_KEY` 月份、`totalCount`、锁定任务 id、转发文案 |
| `pages/handbook/handbook.wxml` | 卡片标题「X月整理计划 · 主题」、全年主题时间线（旧月→done✓，新月→current+最新） |
| `_preview_handbook_poster_*.html` | 带二维码的月度海报（标题 + 副标题） |

## 更新流程

1. **确认目标月份与主题**（例如：9月 · 整理纪念品）。

2. **更新打卡任务** `plan-data.js`：
   - 通常 4~8 个任务，其中最后 1 个（id 最大）作为广告解锁项。
   - 每个任务结构：`{ id, icon, label, desc }`。
   - 图标用 emoji，锁定任务在解锁后显示真实图标（锁定态由 wxml 的 `item.locked` 分支单独渲染 🔒）。
   - 注意：desc 里若含中文引号「"」「"」，需用单引号 `'...'` 包裹字符串，避免与 JS 双引号冲突。

3. **更新 `handbook.js`**：
   - `CHECKIN_KEY` 改为新月份，如 `handbook_checkin_202609`（避免串档）。
   - `totalCount` 改为任务总数。
   - `tasks` 初始化里 `locked: t.id === <最大id>`。
   - 转发文案 `onShareAppMessage` / `onShareTimeline` 的 `title` 改为「X月整理计划 · 主题」。
   - 转发图片 `imageUrl` 保持 `/images/share-handbook.png`（通用卡片，无需每月换）。

4. **更新 `handbook.wxml`**：
   - 卡片标题 `.hero-label` 改为「X月整理计划 · 主题」。
   - 全年主题预告时间线：把上一月从 `current` 改成 `done`（加 ✓），新月份改成 `current`（加「最新」标签）。
   - `.checkin-hint-text` 若含月份文案，同步更新。

5. **更新月度海报 HTML**：
   - 使用模板 `assets/poster-template.html`，替换其中 `{{MONTH}}`（如「9月」）和 `{{THEME}}`（如「整理纪念品」）。
   - 生成文件保存到项目根目录，文件名带月份（如 `_preview_handbook_poster_oct.html`）。
   - 二维码 `handbookQR.png` 不变（路径固定为 handbook 页面）。
   - 提醒用户用 F12 → Capture node screenshot 导出 PNG。

6. **提醒用户**：
   - 上传新 PDF 到托管源 → 清缓存（若有下载功能）。
   - 用记事本重存 `plan-data.js` 为 UTF-8（若手工改过）。
