// pages/goal/goal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goalSubmitted:true,
    plhGoal: '这周的整理目标是.......',
    plhResult: '这周的整理成果是.......',
    smbGoal: '提交目标',
    smbResult: '提交成果',
    des:''
  },

  bindSubmitTap: function () {
    wx.navigateTo({
      url: '../goal-submitted/goal-submitted'
    })
  },

  uploadPhoto: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log("going to upload------0");
        var tempFilePaths = res.tempFilePaths;
        console.log("going to upload------1");
        uploadtoServer(that, tempFilePaths);
      }
    })
  },

  /**
   * 获取填写的文本
   */
  bindTextDes: function (e){
    this.setData({
      des: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goalSubmitted: options.goalSubmitted == "true" ? true:false
    })
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          withCredentials: true,
          success: function (res0) {
            console.log(res0);
            var userInfo = res0.userInfo
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'http://127.0.0.1:8089/v1/miniapp/login',
                method: "POST",
                data: {
                  code: res.code,
                  rawData: res0.rawData,
                  signature: res0.signature,
                  userInfo: userInfo
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})

function uploadtoServer (page, path) {
  console.log("going to upload----2");
  /*wx.uploadFile({
     url: 'http://127.0.0.1:8089/v1/user/uploadimg',
     filePath: path[0],
     name: 'file',
     header: {},
     formData: {},
     success: function(res) {
       console.log(res)
     },
     fail: function(res) {},
     complete: function(res) {},
   })*/
}