//index.js
//获取应用实例
const app = getApp()

const Status = {
  Like: "like",
  Use: "use",
  FeelHappy: "feelhappy",
  LetItGo: "letitgo",
  CostTooMuch: "costtoomuch",
  TooHeavy: "tooheavy",
  Done: "done"
}

Page({
  data: {
    textString: "扔还是不扔？",
    showYesOrNo: false,
    showStart: true,
    showRestart: false
  },

  onShareAppMessage: function () {
    return {
      title: '扔or不扔？',
      path: '/pages/index/index'
    }
  },

  onShareTimeline: function() {
    wx.updateShareMenu({
      withShareTicket: true,
      success: function () {
        wx.shareTimeline({
          title: '改变从整理开始',
          imageUrl: '/images/logo.jpg',
          success: function () {
            console.log('分享成功');
          },
          fail: function () {
            console.log('分享失败');
          }
        })
      }
    })
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../process/process'
    })
  },

  tapStartButton: function() {
    this.setData({
      textString: '你喜欢这件物品么？',
      showYesOrNo: true,
      showStart: false,
      showRestart: false,
      showPage: false,
      status: Status.Like
    });
    console.log('Button Clicked');
  },

  
  tapShowButton: function() {
    console.log('tapShowButton Clicked');
    wx.switchTab({
      url: '../wechat/wechat',
      success: (res) => {
        console.log()
        console.log('success')
      },
      fail: (err) => {
          console.log('fail', err)
      }
      })
  },

  tapYesButton: function() {
    switch(this.data.status) {
      case Status.Like:
      case Status.FeelHappy:
        console.log(this.data.status);
        this.setData({
          textString: '留下，好好珍惜',
          description: '知识点：\n整理，是为了留下满心欢喜的物品。身边喜欢的物品越多，生活就会多一份开心。',
          showYesOrNo: false,
          showStart: false,
          showRestart: true,
          showPage: false,
          status: Status.Done
        });
        break;
      case Status.LetItGo:
          console.log(this.data.status);
          this.setData({
            textString: '舍弃，好好告别',
            description: '知识点：\n 舍弃不需要不喜欢的物品，才能腾出更多的时间、精力、空间来遇见心动的物品。',
            showYesOrNo: false,
            showStart: false,
            showRestart: true,
            showPage: false,
            status: Status.Done
          });
          break;
      case Status.Use:
        console.log(this.data.status);
        this.setData({
          textString: '如果留下它，你觉得开心么？',
          showYesOrNo: true,
          showStart: false,
          showRestart: false,
          showPage: false,
          status: Status.FeelHappy
        });
        break;
      case Status.CostTooMuch:
        console.log(this.data.status);
        this.setData({
          textString: '可以考虑卖二手，或者有偿回收',
          description: '知识点：\n 舍弃不需要不喜欢的物品，才能腾出更多的时间、精力、空间来遇见心动的物品。',
          showYesOrNo: false,
          showStart: false,
          showRestart: true,
          showPage: false,
          status: Status.Done
        });
        break;
      case Status.TooHeavy:
        console.log(this.data.status);
        this.setData({
          textString: '可以考虑捐赠',
          showYesOrNo: false,
          description: '知识点：\n 亲友的情义，早已超越物品本身，珍惜亲友的情义，放手不喜欢的物品，把这份爱传递下去。',
          showStart: false,
          showRestart: true,
          showPage: false,
          status: Status.Done
        });
        break;
    }
  },

  tapNoButton: function() {
    switch(this.data.status) {
      case Status.Like:
        console.log('Status.Like');
        this.setData({
          textString: '你需要这件物品么？',
          showYesOrNo: true,
          showStart: false,
          showRestart: false,
          showPage: false,
          status: Status.Use
        });
        break;
      case Status.Use:
        this.setData({
          textString: '你愿意舍弃么？',
          showYesOrNo: true,
          showStart: false,
          showRestart: false,
          showPage: false,
          status: Status.LetItGo
        });
        break;
      case Status.FeelHappy:
        this.setData({
          textString: '去挑选一件喜欢的，替代它',
          description: '知识点：\n 把身边不心动、不舒适的物品，替换成喜欢的舒服的物品，生活少一份将就。',
          showYesOrNo: false,
          showStart: false,
          showRestart: true,
          showPage: false,
          status: Status.Done
        });
        break;
      case Status.LetItGo:
        this.setData({
          textString: '(你不愿意舍弃)是因为它很贵么？',
          showYesOrNo: true,
          showStart: false,
          showRestart: false,
          showPage: false,
          status: Status.CostTooMuch
        });
        break;
      case Status.CostTooMuch:
        this.setData({
          textString: '(你不愿意舍弃)是因为它来自于亲友的赠送么？',
          showYesOrNo: true,
          showStart: false,
          showRestart: false,
          showPage: false,
          status: Status.TooHeavy
        });
        break;
      case Status.TooHeavy:
          console.log(this.data.status);
          this.setData({
            textString: '来到这里，想必你一定还在纠结中，可以在“改变从整理开始”整理会员群中与大家分享吗？',
            description: '',
            showYesOrNo: false,
            showStart: false,
            showRestart: true,
            showPage: true,
            status: Status.Done
          });
          break;
    }
  }
})