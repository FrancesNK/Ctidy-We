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
  FeelHappyWithLovely: "feelhappywithlovely",
  TooLovelyToUse: "toolovelytouse",
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
    console.log(this.data.status);
    switch(this.data.status) {
      case Status.Like:
        this.setData({
          textString: '如果留下, 你觉得开心么？',
          showYesOrNo: true,
          showStart: false,
          showRestart: false,
          showPage: false,
          status: Status.FeelHappyWithLovely
        });
        break;
      case Status.FeelHappyWithLovely:
      case Status.FeelHappy:
        this.setData({
          textString: '留下，好好珍惜',
          description: '请想象一下只被心动的东西所围绕的场景吧，这才是你想拥有的理想人生，不是吗？（近藤麻理惠《怦然心动的人生整理魔法》）',
          showYesOrNo: false,
          showStart: false,
          showRestart: true,
          showPage: false,
          status: Status.Done
        });
        break;
      case Status.LetItGo:
          this.setData({
            textString: '舍弃，好好告别',
            description: '为了珍惜真正富有价值的物品，必须首先丢弃已经完成了使命的物品。（近藤麻理惠《怦然心动的人生整理魔法》）',
            showYesOrNo: false,
            showStart: false,
            showRestart: true,
            showPage: false,
            status: Status.Done
          });
          break;
      case Status.Use:
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
        this.setData({
          textString: '可以考虑卖二手，或者有偿回收',
          description: '“我想要这个东西”“我不需要这个东西”，无论是获得还是放手，都要做到坦诚地面对自己的内心。（山下英子《断舍离》）',
          showYesOrNo: false,
          showStart: false,
          showRestart: true,
          showPage: false,
          status: Status.Done
        });
        break;
      case Status.TooHeavy:
        this.setData({
          textString: '可以考虑捐赠',
          showYesOrNo: false,
          description: '人有“获得的自由”，也有“放手的自由”。（山下英子《断舍离》）',
          showStart: false,
          showRestart: true,
          showPage: false,
          status: Status.Done
        });
        break;
      case Status.TooLovelyToUse:
          this.setData({
            textString: '用起来吧！',
            showYesOrNo: false,
            description: '允许自己使用高级的东西，这种机制一旦运转起来，看待自己的方式就从过去的减分法变成了加分法。（山下英子《断舍离》）',
            showStart: false,
            showRestart: true,
            showPage: false,
            status: Status.Done
          });
          break;
    }
  },

  tapNoButton: function() {
    console.log(this.data.status);
    switch(this.data.status) {
      case Status.FeelHappyWithLovely:
        this.setData({
          textString: '是因为太贵重，舍不得用么？',
          showYesOrNo: true,
          showStart: false,
          showRestart: false,
          showPage: false,
          status: Status.TooLovelyToUse
        });
        break;
      case Status.Like:
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
          description: '明明不太喜欢，也就是说，把和自己不相配的东西硬塞给自己用。（山下英子《断舍离》）',
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
      case Status.TooLovelyToUse:
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