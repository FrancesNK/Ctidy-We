const STORAGE_KEY = 'guide_progress'

const TASKS = [
  { id: 1, icon: '/images/logo.jpg', iconType: 'image', title: '关注我们', desc: '关注公众号「改变从整理开始」获取更多整理知识' },
  { id: 2, icon: '🎬', title: '看整理电影', desc: '看电影《怦然心动的人生整理魔法》，建立整理基础认知' },
  { id: 3, icon: '🥫', title: '过期食品', desc: '清理冰箱和储藏柜里过期的食品、调料、干货' },
  { id: 4, icon: '💊', title: '过期药品', desc: '检查家里的药箱，丢弃过期的药品' },
  { id: 5, icon: '📄', title: '无用文件', desc: '舍弃无用的「广告传单、票据、发票」' },
  { id: 6, icon: '🧦', title: '破损衣物', desc: '检查贴身衣物，舍弃破洞、变形的内衣、袜子' },
  { id: 7, icon: '👠', title: '磨脚鞋子', desc: '整理鞋柜，舍弃磨脚、鞋底磨损严重、穿着不舒服的鞋子' },
  { id: 8, icon: '🔌', title: '坏电子配件', desc: '舍弃有「安全隐患」的数据线、充电器' },
  { id: 9, icon: '🍽️', title: '整理餐具', desc: '检查日常使用的餐具，舍弃「有缺口」的碗、杯碟' },
  { id: 10, icon: '🥢', title: '发霉用品', desc: '舍弃「发霉」的筷子、砧板、地垫、抹布' },
  { id: 11, icon: '📅', title: '旧日历', desc: '丢弃「旧年」的日历、日程本和旧的计划表' },
  { id: 12, icon: '🚿', title: '漏水配件', desc: '检查卫浴设施，及时更换「漏水」的花洒、水龙头、软管' },
  { id: 13, icon: '👕', title: '变形衣架', desc: '舍弃「变形」的衣架、收纳盒' },
  { id: 14, icon: '🛍️', title: '多余袋子', desc: '清理外卖袋、奶茶袋、收纳袋，只保留真正需要的' },
  { id: 15, icon: '💍', title: '磨损配饰', desc: '舍弃「磨损严重」的戒指、项链、手链、围巾等配饰' },
  { id: 16, icon: '🛒', title: '清理购物车', desc: '清理电商平台和购物App里的购物车、收藏夹' },
  { id: 17, icon: '📸', title: '清理照片', desc: '删除手机相册中模糊、重复、无意义的照片' },
  { id: 18, icon: '💬', title: '清理聊天记录', desc: '删除「不需要保留」的短信、微信聊天' },
  { id: 19, icon: '📦', title: '盘点囤货', desc: '记录护肤品、化妆品、洗护用品、纸巾等囤货的品种和数量，避免重复购买' },
  { id: 20, icon: '📝', title: '购物清单', desc: '建立购物清单，避免重复购买已有的物品' }
]

const STATUS_MAP = {
  not_started: { label: '未开始', emoji: '⭕' },
  in_progress: { label: '进行中', emoji: '⏳' },
  completed: { label: '已完成', emoji: '✅' }
}

Page({
  data: {
    tasks: [],
    completedCount: 0,
    totalCount: TASKS.length,
    percent: 0,

    // 弹窗相关
    showModal: false,
    currentTask: null,
    currentStatus: 'not_started',
    statusOptions: [
      { value: 'not_started', label: '未开始', emoji: '⭕' },
      { value: 'in_progress', label: '进行中', emoji: '⏳' },
      { value: 'completed', label: '已完成', emoji: '✅' }
    ],

  },

  onShareAppMessage() {
    return {
      title: '初学者的家居整理入门计划',
      imageUrl: '/images/share-guide.png'
    }
  },

  onLoad() {
    this.loadProgress()
  },

  onShow() {
    this.loadProgress()
  },

  // 读取本地存储的进度，合并到 tasks
  loadProgress() {
    const progress = wx.getStorageSync(STORAGE_KEY) || {}
    let completedCount = 0

    const tasks = TASKS.map(task => {
      const status = progress[task.id] || 'not_started'
      if (status === 'completed') completedCount++
      return { ...task, status, statusLabel: STATUS_MAP[status].label }
    })

    this.setData({
      tasks,
      completedCount,
      totalCount: TASKS.length,
      percent: Math.round((completedCount / TASKS.length) * 100)
    })
  },

  // 点击方块 → 打开弹窗
  tapTask(e) {
    const id = e.currentTarget.dataset.id
    const task = this.data.tasks.find(t => t.id === id)
    if (!task) return

    this.setData({
      showModal: true,
      currentTask: task,
      currentStatus: task.status
    })
  },

  // 关闭弹窗
  closeModal() {
    this.setData({ showModal: false, currentTask: null })
  },

  // 阻止弹窗内容点击冒泡
  preventBubble() {},

  // 选择状态
  selectStatus(e) {
    const status = e.currentTarget.dataset.status
    this.setData({ currentStatus: status })
  },

  // 保存进度
  saveStatus() {
    const { currentTask, currentStatus } = this.data
    if (!currentTask) return

    const progress = wx.getStorageSync(STORAGE_KEY) || {}
    progress[currentTask.id] = currentStatus
    wx.setStorageSync(STORAGE_KEY, progress)

    this.setData({ showModal: false, currentTask: null })
    this.loadProgress()

    if (currentStatus === 'completed') {
      wx.showToast({ title: '太棒了！🎉', icon: 'none', duration: 1500 })
    }
  },
})
