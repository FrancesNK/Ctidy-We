const CHECKIN_KEY = "handbook_checkin_202609"

Page({
  data: {
    tasks: require("./plan-data.js").map(t => ({
      ...t, status:"not_started", locked: t.id === 4, revealed: false
    })),
    totalCount: 4,
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
    pendingUnlock: null
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
        if (res && res.isEnded && this.data.pendingUnlock) {
          this.unlockTask(this.data.pendingUnlock)
          this.setData({ pendingUnlock: null })
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

    // 广告锁
    if (task.locked) {
      this.setData({ pendingUnlock: task })
      if (this.videoAd) {
        this.videoAd.show().catch(() => {
          this.videoAd.load().then(() => this.videoAd.show()).catch(() => {
            this.setData({ pendingUnlock: null })
            wx.showToast({ title: '广告暂不可用，请稍后重试', icon: 'none' })
          })
        })
      } else {
        this.unlockTask(task)
        this.setData({ pendingUnlock: null })
      }
      return
    }

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

  unlockTask(task) {
    const tasks = this.data.tasks.map(t => {
      if (t.id === task.id) return { ...t, locked: false, revealed: true, status:"not_started" }
      return t
    })
    const updated = tasks.find(t => t.id === task.id)
    this.setData({ tasks })
    this.saveCheckin()
    this.setData({
      showModal: true,
      currentTask: updated,
      currentStatus: updated.status
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

  onShareAppMessage() {
    return {
      title: "9月整理计划 · 整理纪念品",
      path: "/pages/handbook/handbook",
      imageUrl: "/images/share-handbook.png"
    }
  },

  onShareTimeline() {
    return {
      title: "9月整理计划 · 整理纪念品",
      imageUrl: "/images/share-handbook.png"
    }
  }
})
