var vegetation_id = "1";
const app = getApp();

Page({
  data: {
    vegetation: {},
    markers: [],
    url: app.globalData.url,
  },


  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    vegetation_id = options.vegetation_id;
    app.mpServerless.db.collection('vegetation').find(
      {
        _id: vegetation_id,
      }, {}).then(res => {
        console.log(res)
        this.setData({
          vegetation: res.result[0],
        });
      }).then(res => {
        if (this.data.vegetation.photos > 0) {
          var photoArray = []
          for (var photoNum = 1; photoNum <= this.data.vegetation.photos; ++photoNum) {
            photoArray = photoArray.concat(photoNum)
            this.setData({
              photoArray: photoArray,
            });
          }
        }
        console.log(this.data.vegetation.markers)
        var number = 0
        if (this.data.vegetation.markers !== {}) {
          for (var i in this.data.vegetation.markers) {
            console.log(this.data.vegetation.markers[i])
            var marker = [
              {
                iconPath: this.data.url + encodeURIComponent(this.data.vegetation.name) + ".png",
                latitude: this.data.vegetation.markers[i].coordinates[1],
                longitude: this.data.vegetation.markers[i].coordinates[0],
                width: 50,
                height: 50,
                id: number,
              }
            ]
            this.setData({
              markers: this.data.markers.concat(marker),
            });
            number++
          }
        }
      });
  },

  includePointsOne() {
    const mapCtx = wx.createMapContext('map', this);
    mapCtx.includePoints({
      padding: [60, 36, 0, 36],
      points: this.data.markers,
      success: res => {
        console.log('includePoints success');
      },
      fail: err => {
        console.log('includePoints fail', err);
      }
    });
  },

  previewImage: function (e) {
    let that = this;
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },

  markertap(event) {
    console.log(event.detail.markerId)
    const markers = this.data.markers;
    for (let i = 0; i < markers.length; i++) {
      if (event.markerId === markers[i].id) {
        wx.openLocation({
          latitude: parseFloat(markers[i].latitude),
          longitude: parseFloat(markers[i].longitude),
          name: markers[i].name,
          address: markers[i].name
        })

      }
    }
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.name,
      path: '/pages/index/index?pageId=' + this.data.name,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  onShareTimeline: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.name,
      path: '/pages/index/index?pageId=' + this.data.name,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})