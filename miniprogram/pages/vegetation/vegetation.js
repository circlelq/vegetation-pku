var vegetation_id = "1";
const app = getApp();

Page({
  data: {
    vegetation: {},
    markers: [],
    // relationship:[{ rela:"紫藤"},], 
    photoNums: [],
  },


  /**
 * 生命周期函数--监听页面加载
 */
onLoad: function (options) {
  vegetation_id = options.vegetation_id;
  app.mpServerless.db.collection('vegetation').find(
    {
      _id: vegetation_id,
    },
    {}
  ).then(res => {
    console.log(res)
      this.setData({
        vegetation: res.result[0],
        photoscr: "https://vegetation-pku-1257850266.cos.ap-nanjing.myqcloud.com/" + res.result[0].name + ".png"
      });
    }).then(res => {
    var number = 0
    var photoNum = 0
    for(var j in this.data.vegetation.photos){
      var photoNum = {
        num: photoNum
      }
      this.setData({
        photoNums: this.data.photoNums.concat(photoNum),
      });
      number++
    }
    
    for (var i in this.data.vegetation.markers) {
      var marker = [
        {
          iconPath: "https://vegetation-pku-1257850266.cos.ap-nanjing.myqcloud.com/" + encodeURIComponent(this.data.vegetation.name) + ".png",
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

  //音频播放  
  audioPlay(e) {
    var that = this,
      id = e.currentTarget.dataset.id,
      key = e.currentTarget.dataset.key,
      audioArr = that.data.audioArr;

    //设置状态
    audioArr.forEach((v, i, array) => {
      v.bl = false;
      if (i == key) {
        v.bl = true;
      }
    })
    that.setData({
      audioArr: audioArr,
      audKey: key,
    })

    myaudio.autoplay = true;
    var audKey = that.data.audKey,
      vidSrc = audioArr[audKey].src;
    myaudio.src = vidSrc;

    myaudio.play();

    //开始监听
    myaudio.onPlay(() => {
      console.log('开始播放');
    })

    //结束监听
    myaudio.onEnded(() => {
      console.log('自动播放完毕');
      audioArr[key].bl = false;
      that.setData({
        audioArr: audioArr,
      })
    })

    //错误回调
    myaudio.onError((err) => {
      console.log(err);
      audioArr[key].bl = false;
      that.setData({
        audioArr: audioArr,
      })
      return
    })

  },

  // 音频停止
  audioStop(e) {
    var that = this,
      key = e.currentTarget.dataset.key,
      audioArr = that.data.audioArr;
    //设置状态
    audioArr.forEach((v, i, array) => {
      v.bl = false;
    })
    that.setData({
      audioArr: audioArr
    })

    myaudio.stop();

    //停止监听
    myaudio.onStop(() => {
      console.log('停止播放');
    })
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


