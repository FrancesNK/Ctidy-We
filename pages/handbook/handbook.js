Page({
  onLoad() {
    this.initRewardedAd()
  },

  initRewardedAd() {
    if (wx.createRewardedVideoAd) {
      this.videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-fb6166b777c8839f'
      })
      this.videoAd.onClose(res => {
        if (res && res.isEnded) {
          this.openHandbook()
        } else {
          wx.showToast({ title: '看完广告才能下载哦', icon: 'none' })
        }
      })
      this.videoAd.onError(() => {
        wx.showToast({ title: '广告加载失败', icon: 'none' })
      })
    }
  },

  tapDownload() {
    if (this.videoAd) {
      this.videoAd.show().catch(() => {
        this.videoAd.load().then(() => this.videoAd.show()).catch(() => {
          wx.showToast({ title: '广告暂不可用，请稍后重试', icon: 'none' })
        })
      })
    }
  },

  openHandbook() {
    wx.showLoading({ title: '下载中...' })
    wx.downloadFile({
      url: 'https://cdn.jsdelivr.net/gh/FrancesNK/Ctidy-We@Ctidy-We/handbook.pdf?t=' + Date.now(),
      success: (res) => {
        wx.hideLoading()
        const dest = `${wx.env.USER_DATA_PATH}/2026年7月手账本@改变从整理开始.pdf`
        wx.getFileSystemManager().copyFile({
          srcPath: res.tempFilePath,
          destPath: dest,
          success: () => {
            wx.openDocument({ filePath: dest, fileType: 'pdf', showMenu: true })
          },
          fail: () => {
            wx.openDocument({ filePath: res.tempFilePath, fileType: 'pdf', showMenu: true })
          }
        })
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '下载失败，稍后重试', icon: 'none' })
      }
    })
  },

  openArticle() {
    wx.navigateTo({ url: '/pages/wechat/wechat' })
  },

  onShareAppMessage() {
    return {
      title: '整理手账本 · 用整理治愈生活',
      path: '/pages/handbook/handbook',
      imageUrl: '/images/share-handbook.png'
    }
  },

  onShareTimeline() {
    return {
      title: '整理手账本 · 用整理治愈生活',
      imageUrl: '/images/share-handbook.png'
    }
  },
})
