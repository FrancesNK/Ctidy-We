const CHECKIN_KEY = "handbook_checkin_202611"

// A4 打印版配置（每月更新）
const POSTER = {
  year: "2026年",
  monthCn: "拾壹月",
  theme: "家的保养",
  quote: "斯是陋室，惟吾德馨。",
  author: "── 刘禹锡《陋室铭》",
  curMonth: 11,
  doneMonths: [1,2,3,4,5,6,7,8,9,10],
  yearThemes: [
    "建立整理秩序","数字极简","衣柜换季","探寻滋养",
    "工作整理","优化饮食环境","规划家庭空间","梳理人际关系",
    "整理纪念品","囤货盘点","家的保养","全年复盘"
  ]
}

// 圆角矩形路径
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x+r, y)
  ctx.lineTo(x+w-r, y)
  ctx.quadraticCurveTo(x+w, y, x+w, y+r)
  ctx.lineTo(x+w, y+h-r)
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h)
  ctx.lineTo(x+r, y+h)
  ctx.quadraticCurveTo(x, y+h, x, y+h-r)
  ctx.lineTo(x, y+r)
  ctx.quadraticCurveTo(x, y, x+r, y)
  ctx.closePath()
}

Page({
  data: {
    tasks: require("./plan-data.js").map(t => ({
      ...t, status:"not_started", locked: false, revealed: false
    })),
    totalCount: 8,
    doneCount: 0,
    percent: 0,
    showModal: false,
    currentTask: null,
    statusOptions: [
      { value:"not_started", emoji:"⭕", label:"未开始" },
      { value:"in_progress", emoji:"⏳", label:"进行中" },
      { value:"completed", emoji:"✅", label:"已完成" }
    ],
    currentStatus: "",
    pendingDownload: null
  },

  onLoad() {
    this.loadCheckin()
    this.initRewardedAd()
  },

  initRewardedAd() {
    if (wx.createRewardedVideoAd) {
      this.videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-fb6166b777c8839f'
      })
      this.videoAd.onClose(res => {
        if (res && res.isEnded && this.data.pendingDownload) {
          this.setData({ pendingDownload: null })
          this.generatePlan()
        } else if (this.data.pendingDownload) {
          this.setData({ pendingDownload: null })
          wx.showToast({ title: '看完广告才能下载哦', icon: 'none' })
        }
      })
      this.videoAd.onError(() => {
        wx.showToast({ title: '广告加载失败，稍后再试', icon: 'none' })
      })
    }
  },

  loadCheckin() {
    try {
      const saved = wx.getStorageSync(CHECKIN_KEY)
      if (saved && Array.isArray(saved)) {
        const tasks = this.data.tasks.map(t => {
          const found = saved.find(s => s.id === t.id)
          const merged = found
            ? { ...t, status: found.status, locked: found.locked !== false && t.locked, revealed: found.revealed || found.status !== "not_started" }
            : t
          return merged
        })
        this.setData({ tasks })
        this.updateProgress(tasks)
      }
    } catch (e) {}
  },

  saveCheckin() {
    const snap = this.data.tasks.map(t => ({
      id: t.id, status: t.status, locked: t.locked, revealed: t.revealed
    }))
    wx.setStorageSync(CHECKIN_KEY, snap)
  },

  tapCheckin(e) {
    const id = e.currentTarget.dataset.id
    const task = this.data.tasks.find(t => t.id === id)

    // 未揭示的 → 揭示并打开弹窗
    if (!task.revealed) {
      const tasks = this.data.tasks.map(t => {
        if (t.id === task.id) return { ...t, revealed: true }
        return t
      })
      const updated = tasks.find(t => t.id === task.id)
      this.setData({
        tasks,
        showModal: true,
        currentTask: updated,
        currentStatus: updated.status
      })
      this.saveCheckin()
      return
    }

    // 已揭示的 → 正常弹窗
    this.setData({
      showModal: true,
      currentTask: task,
      currentStatus: task.status
    })
  },

  selectStatus(e) {
    this.setData({ currentStatus: e.currentTarget.dataset.status })
  },

  saveStatus() {
    const tasks = this.data.tasks.map(t => {
      if (t.id === this.data.currentTask.id) {
        return { ...t, status: this.data.currentStatus }
      }
      return t
    })
    this.setData({ tasks, showModal: false })
    this.saveCheckin()
    this.updateProgress(tasks)
  },

  closeModal() {
    this.setData({ showModal: false })
  },

  preventBubble() {},

  updateProgress(tasks) {
    const doneCount = tasks.filter(t => t.status === "completed").length
    this.setData({
      doneCount,
      percent: Math.round((doneCount / this.data.totalCount) * 100)
    })
  },

  openArticle() {
    wx.navigateTo({ url: "/pages/wechat/wechat" })
  },

  // 下载 A4 打印版（先看激励视频广告）
  downloadPlan() {
    if (this.videoAd) {
      this.setData({ pendingDownload: true })
      this.videoAd.show().catch(() => {
        this.videoAd.load().then(() => this.videoAd.show()).catch(() => {
          this.setData({ pendingDownload: null })
          wx.showToast({ title: '广告暂不可用，请稍后重试', icon: 'none' })
        })
      })
    } else {
      this.generatePlan()
    }
  },

  // 生成并保存 A4 海报
  generatePlan() {
    wx.showLoading({ title: '生成中...', mask: true })
    wx.createSelectorQuery().select('#planCanvas').fields({ node: true }).exec((res) => {
      const canvas = res[0].node
      const W = 1240, H = Math.round(W * 297 / 210)
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d')
      const X = v => v * (W / 794)

      const loadImage = src => new Promise((resolve, reject) => {
        const img = canvas.createImage()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error(src))
        img.src = src
      })

      Promise.all([loadImage('/images/logo.jpg'), loadImage('/images/wechat_qr.png')])
        .then(([logo, qr]) => {
          this.drawPoster(ctx, { X, logo, qr, tasks: this.data.tasks })
          wx.canvasToTempFilePath({
            canvas, x: 0, y: 0, width: W, height: H, destWidth: W, destHeight: H,
            success: r => {
              wx.hideLoading()
              wx.previewImage({ urls: [r.tempFilePath] })
            },
            fail: () => { wx.hideLoading(); wx.showToast({ title: '生成失败', icon: 'none' }) }
          })
        })
        .catch(() => { wx.hideLoading(); wx.showToast({ title: '图片加载失败', icon: 'none' }) })
    })
  },

  // 绘制 A4 海报（布局与 _preview_plan_a4.html 一致，794px 基准）
  drawPoster(ctx, o) {
    const { X, logo, qr, tasks } = o
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, X(794), X(1123))
    ctx.textBaseline = 'middle'
    const CX = X(397)

    // 字距文本（canvas 不支持 letter-spacing，手动逐字绘制）
    const drawSpaced = (text, x, cy, sp, align = 'center') => {
      const chars = [...text]
      const ws = chars.map(c => ctx.measureText(c).width)
      const total = ws.reduce((a, b) => a + b, 0) + sp * (chars.length - 1)
      let sx = align === 'center' ? x - total / 2 : x
      ctx.textAlign = 'left'
      chars.forEach((c, i) => { ctx.fillText(c, sx, cy); sx += ws[i] + sp })
    }

    // logo（圆形）
    const lsize = X(37.8)
    ctx.save()
    ctx.beginPath()
    ctx.arc(CX, X(86.9), lsize / 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(logo, CX - lsize / 2, X(86.9) - lsize / 2, lsize, lsize)
    ctx.restore()

    // 标题
    ctx.fillStyle = '#111'
    ctx.font = `bold ${X(36)}px sans-serif`
    drawSpaced('改变从整理开始', CX, X(142.7), X(5))

    // 年月
    ctx.fillStyle = '#333'
    ctx.font = `bold ${X(18)}px sans-serif`
    drawSpaced(`${POSTER.year} · ${POSTER.monthCn}`, CX, X(181), X(4))

    // 名言
    ctx.fillStyle = '#111'
    ctx.font = `bold ${X(17)}px sans-serif`
    drawSpaced(POSTER.quote, CX, X(260), X(2))
    ctx.fillStyle = '#666'
    ctx.font = `${X(12)}px sans-serif`
    drawSpaced(POSTER.author, CX, X(298), X(2))

    // 清单
    const left = X(90.7), right = X(703.3)
    const planTop = 340, planBottom = 880
    const rowH = Math.min(90.7, (planBottom - planTop) / tasks.length)
    tasks.forEach((t, i) => {
      const top = planTop + i * rowH
      ctx.strokeStyle = '#666'
      ctx.lineWidth = X(1.5)
      roundRect(ctx, left, X(top + rowH * 0.292), X(24.6), X(24.6), X(4.5))
      ctx.stroke()
      ctx.fillStyle = '#111'
      ctx.font = `bold ${X(17)}px sans-serif`
      drawSpaced(t.label, left + X(36), X(top + rowH * 0.363), X(1), 'left')
      ctx.fillStyle = '#666'
      ctx.font = `${X(12)}px sans-serif`
      ctx.textAlign = 'left'
      ctx.fillText(t.desc, left + X(36), X(top + rowH * 0.644))
      if (i < tasks.length - 1) {
        ctx.strokeStyle = '#f0f0f0'
        ctx.lineWidth = X(1)
        ctx.beginPath()
        ctx.moveTo(left, X(top + rowH))
        ctx.lineTo(right, X(top + rowH))
        ctx.stroke()
      }
    })

    // 全年主题（只占左侧宽度，给二维码留出右侧空间）
    const yearRight = X(574.8)
    ctx.fillStyle = '#333'
    ctx.font = `bold ${X(11)}px sans-serif`
    drawSpaced('2026 · 全年主题', left, X(923.8), X(3), 'left')
    ctx.strokeStyle = '#e5e5e5'
    ctx.lineWidth = X(1)
    ctx.beginPath()
    ctx.moveTo(left, X(938.7))
    ctx.lineTo(yearRight, X(938.7))
    ctx.stroke()

    const colW = 484.1 / 4
    POSTER.yearThemes.forEach((name, i) => {
      const month = String(i + 1).padStart(2, '0')
      const x = X(90.7 + (i % 4) * colW)
      const cy = X(950 + Math.floor(i / 4) * 25.2 + 12.6)
      const isCur = i + 1 === POSTER.curMonth
      const isDone = POSTER.doneMonths.includes(i + 1)
      ctx.textAlign = 'left'
      ctx.font = `${isCur ? 'bold ' : ''}${X(10)}px sans-serif`
      ctx.fillStyle = isCur ? '#111' : '#999'
      ctx.fillText(month + ' ', x, cy)
      const mw = ctx.measureText(month + ' ').width
      ctx.fillStyle = isCur ? '#111' : '#666'
      ctx.fillText(name, x + mw, cy)
      if (isCur || isDone) {
        const nw = ctx.measureText(name).width
        ctx.fillStyle = isCur ? '#111' : '#888'
        ctx.fillText(' ✓', x + mw + nw, cy)
      }
    })

    // 二维码
    const qrSize = X(90.7)
    ctx.drawImage(qr, X(612.6), X(918.9), qrSize, qrSize)
    ctx.strokeStyle = '#eee'
    ctx.lineWidth = X(1)
    roundRect(ctx, X(612.6), X(918.9), qrSize, qrSize, X(7.6))
    ctx.stroke()
    ctx.fillStyle = '#888'
    ctx.font = `${X(9.5)}px sans-serif`
    drawSpaced('扫码关注，每月不错过', X(612.6) + qrSize / 2, X(1022), X(2))

    // 版权
    ctx.fillStyle = '#888'
    ctx.font = `${X(10)}px sans-serif`
    drawSpaced('©2026 改变从整理开始', CX, X(1057.5), X(3))
    ctx.textAlign = 'left'
  },

  onShareAppMessage() {
    return {
      title: "2026年 · 拾壹月 · 家的保养",
      path: "/pages/handbook/handbook",
      imageUrl: "/images/share-handbook.png"
    }
  },

  onShareTimeline() {
    return {
      title: "2026年 · 拾壹月 · 家的保养",
      imageUrl: "/images/share-handbook.png"
    }
  }
})
