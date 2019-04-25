// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let movie = this.data.movie
    movie = JSON.parse(options.movie)
    this.setData({
      movie
    })
  },

  popWindow: function(event) {
    let currentStatu = event.currentTarget.dataset.statu;
    let type = event.currentTarget.dataset.type;
    if (type !== undefined)
      this.pop(currentStatu, type)
    else
      this.pop(currentStatu)
  },

  pop: function(currentStatu, type) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
    animation.translateY(240).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    });

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function() {
      // 执行第二组动画：Y轴不偏移，停
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭抽屉
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }

    if (type) {
      let id = this.data.movie.id
      let title = this.data.movie.title
      let image = this.data.movie.image
      wx.navigateTo({
        url: `/pages/film-review-edit/edit?id=${id}&title=${title}&image=${image}`,
      })
    }
  },

  lookReview() {
    let id = this.data.movie.id
    wx.navigateTo({
      url: `/pages/film-review-list/list?id=${id}`,
    })
  }
})