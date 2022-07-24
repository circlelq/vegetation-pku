const app = getApp();

Page({
  data: {
    vegetation: [
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.pageId) {
      wx.navigateTo({
        url: '/pages/vegetation/' + options.pageId + '/' + options.pageId,
      })
    }
    this.loadMoreVegetation();
  },

  loadMoreVegetation() {
    
    const vegetation = this.data.vegetation;
    app.mpServerless.db.collection('vegetation').find(
      {},
      { sort: { pinyin: 1 },
      skip:vegetation.length,
      limit: 20,
    }
    ).then(res => {
      const { result: data } = res;
      this.setData({ vegetation: vegetation.concat(data) });
    }).catch(console.error);


  },

  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    this.loadMoreVegetation();
  },

  // 点击组织
  clickVegetation(e, isVegetationId = false) {
    const vegetation_id = isVegetationId ? e : e.currentTarget.dataset.vegetation_id;
    const detail_url = '/pages/vegetation/vegetation';

    wx.navigateTo({
      url: detail_url + '?vegetation_id=' + vegetation_id,
    });
  },

  //转发此页面的设置
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      path: 'pages/index/index',  // 路径，传递参数到指定页面。
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  // 转发到朋友圈
  onShareTimeline: function (res) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      path: 'pages/index/index',  // 路径，传递参数到指定页面。
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  // 搜索栏输入名字后页面跳转
  bindconfirmT: function (e) {
    console.log("e.detail.value");
    if (e.detail.value) {
      wx.navigateTo({
        url: '/pages/vegetation/' + e.detail.value + '/' + e.detail.value,
      })
    }
  },

})

