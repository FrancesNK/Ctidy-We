//index.js
//获取应用实例
const app = getApp()

const Status = {
  Classify: "classify",
  Like: "like",
  Use: "use",
  FeelHappy: "feelhappy",
  LetItGo: "letitgo",
  CostTooMuch: "costtoomuch",
  TooHeavy: "tooheavy",
  FeelHappyWithLovely: "feelhappywithlovely",
  TooLovelyToUse: "toolovelytouse",
  Done: "done"
}

const Classes = [
  "衣服",
  "其他"
]

Page({
  data: {
    textString: "扔还是不扔？",
    description: "整理中，如果遇到一件物品不知道该不该舍弃，就点击\"开始\"，也许能帮到你。",
    showYesOrNo: false,
    showStart: true,
    showRestart: false,
    showClass: false,
    classes: Classes
  },

  onShareAppMessage: function () {
    return {
      title: '扔or不扔？',
      path: '/pages/index/index',
      imageUrl: '/images/share-or.png'
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
    // wx.navigateTo({
    //   url: '../default/default'
    // })
    this.setData({
      textString: '这件物品属于以下哪一类呢？',
      showYesOrNo: false,
      showStart: false,
      showRestart: false,
      showPage: false,
      showClass: true,
      description: "",
      status: Status.Classify
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

  tapClassButton(event) {
    const name = event.currentTarget.dataset.name; // 获取 data-name 的值
    console.log('Clicked!', name);

    switch(name) {
      case "衣服":
        wx.navigateTo({
          url: '../cloth/cloth'
        });
        break;
      case "其他":
      default:
        wx.navigateTo({
          url: '../default/default'
        });
        break;
    }
  }
})