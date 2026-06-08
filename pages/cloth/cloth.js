// pages/cloth/cloth.js
const app = getApp()

const Status = {
  Confident: "confident",
  Use: "use",
  FeelHappy: "feelhappy",
  LetItGo: "letitgo",
  CostTooMuch: "costtoomuch",
  TooHeavy: "tooheavy",
  WorryToFindNext: "worryToFindNext",
  RealNice: "realNice",
  NotProper: "notProper",
  TooFat: "tooFat",
  FeelHappyWithLovely: "feelhappywithlovely",
  TooLovelyToUse: "toolovelytouse",
  Done: "done"
}

Page({
  data: {
    textString: '穿上它你觉得自信么？',
    description: '可参考以下几点：\n\n 1. 很喜欢穿这件衣服的自己；\n 2. 在某些场合，这件衣服可以帮助自己更自洽；\n 3. 穿上它走出家门的时候，对生活有更多期待;\n 4. 虽然这件衣服只能在家穿，但每次穿都觉得自己的生活多了一份美好和安稳。',
    showYesOrNo: true,
    showStart: false,
    showRestart: false,
    showPage: false,
    status: Status.Confident
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
    wx.navigateBack({
      url: '../index/index'
    })
    console.log('Restart Button Clicked');
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
      case Status.Confident:
        this.setData({
          textString: '如果留下, 你觉得开心么？',
          showYesOrNo: true,
          showStart: false,
          showRestart: false,
          showPage: false,
          description: '',
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
          textString: '留下，好好珍惜',
          description: '既然是必须留下的工作服，工作日和它朝夕相对，那就用心对待它一次。\n\n清洗干净，熨烫好，如果允许，想一想能不能增加一些配饰让自己穿着它的时候，更自信一点呢?',
          showYesOrNo: false,
          showStart: false,
          showRestart: true,
          showPage: false,
          status: Status.Done
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
            textString: '穿起来吧！',
            showYesOrNo: false,
            description: '允许自己使用高级的东西，这种机制一旦运转起来，看待自己的方式就从过去的减分法变成了加分法。（山下英子《断舍离》）',
            showStart: false,
            showRestart: true,
            showPage: false,
            status: Status.Done
          });
          break;
      case Status.WorryToFindNext:
          this.setData({
            textString: '多尝试，找到更合适的衣服',
            showYesOrNo: false,
            description: '大胆尝试不同风格或品牌的衣服，也可以考虑向专业的服装搭配师咨询。\n\n不要放弃寻找既适合自己又很喜欢的衣服。',
            showStart: false,
            showRestart: true,
            showPage: false,
            status: Status.Done
          });
          break;
      case Status.RealNice:
          this.setData({
            textString: '舍弃，好好告别',
            showYesOrNo: false,
            description: '虽然是一件很舒服的衣服，但你并没有觉得它带给你了自信，哪怕作为家居服，也并没有给你的生活带来美好和期待，那就请勇敢告别吧。',
            showStart: false,
            showRestart: true,
            showPage: false,
            status: Status.Done
          });
          break;
      case Status.NotProper:
        this.setData({
          textString: '送去裁缝店改成合适的尺寸或重新入手一件同款',
          showYesOrNo: false,
          description: '千万别让自己在可以不凑合的小事上将就，别拖延，赶紧行动起来，生活多一点舒心。',
          showStart: false,
          showRestart: true,
          showPage: false,
          status: Status.Done
        });
        break;
      case Status.TooFat:
        this.setData({
          textString: '下定决心健身减肥变美',
          showYesOrNo: false,
          description: '如果衣柜里的大部分衣服都不能让你自信，请复盘是否是因为对自己的身材不满意，如果是，就下定决心给自己一个蜕变的机会，挑战一下自己。\n\n 但请不要有身材焦虑，不要用非科学的减肥方式，健康、开心地享受生活的每一分钟。',
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
          description: '',
          showStart: false,
          showRestart: false,
          showPage: false,
          status: Status.TooLovelyToUse
        });
        break;
      case Status.Confident:
        this.setData({
          textString: '它是你的工作服（必须要穿的）么？',
          showYesOrNo: true,
          description: '',
          showStart: false,
          showRestart: false,
          showPage: false,
          status: Status.Use
        });
        break;
      case Status.Use:
        this.setData({
          textString: '你愿意舍弃么？',
          description: '',
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
          description: '',
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
          description: '',
          showPage: false,
          status: Status.TooHeavy
        });
        break;
      case Status.TooHeavy:
        this.setData({
          textString: '(你不愿意舍弃)是因为怕找不到比这件更合适的衣服了？',
          showYesOrNo: true,
          showStart: false,
          showRestart: false,
          description: '',
          showPage: false,
          status: Status.WorryToFindNext
        });
        break;
      case Status.WorryToFindNext:
        this.setData({
          textString: '(你不愿意舍弃)是因为这件衣服真的很舒服（虽然不适合出门见人）？',
          showYesOrNo: true,
          showStart: false,
          showRestart: false,
          description: '',
          showPage: false,
          status: Status.RealNice
        });
        break;
      case Status.RealNice:
        this.setData({
          textString: '(你不愿意舍弃)是因为它除了XXX（裤脚长了，腰围小了，褪色，磨损...），都很合适？',
          showYesOrNo: true,
          showStart: false,
          showRestart: false,
          description: '',
          showPage: false,
          status: Status.NotProper
        });
        break;
      case Status.NotProper:
        this.setData({
          textString: '(你不愿意舍弃)是因为对自己的身材不满意么？',
          showYesOrNo: true,
          showStart: false,
          showRestart: false,
          description: '',
          showPage: false,
          status: Status.TooFat
        });
        break;
      case Status.TooFat:
      case Status.TooLovelyToUse:
      default:
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
