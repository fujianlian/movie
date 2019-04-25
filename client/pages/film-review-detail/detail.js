// pages/film-review-detail/detail.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    review: {},
    // 是否只显示影评内容
    onlyShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let review = this.data.review
    review = JSON.parse(options.review)
    let onlyShow = this.data.onlyShow
    onlyShow = options.onlyShow === undefined ? false : options.onlyShow

    review.username = review.username + '的影评'
    this.setData({
      review,
      onlyShow
    })
  },

  // 收藏影评
  collectReview() {
    wx.showLoading({
      title: '正在收藏影评...',
    })

    let review_id = this.data.review.review_id
    qcloud.request({
      url: config.service.collect,
      method: 'POST',
      login: true,
      data: {
        id: review_id
      },
      success: result => {
        wx.hideLoading();
        let data = result.data;
        if (!data.code) {
          if (data.data.isCollect) {
            wx.showToast({
              icon: 'none',
              title: '您已收藏过该影评'
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '收藏成功'
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '收藏失败'
          })
        }
      },
      fail: (err) => {
        console.log(err)
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '收藏失败'
        })
      }
    })
  },

  // 写影评
  editReview() {
    let image = this.data.review.image
    let id = this.data.review.movie_id
    let title = this.data.review.title
    wx.navigateTo({
      url: `/pages/film-review-edit/edit?title=${title}&id=${id}&image=${image}`,
    })
  },


  popWindow: function (event) {
    let currentStatu = event.currentTarget.dataset.statu;
    let type = event.currentTarget.dataset.type;
    if (type !== undefined)
      this.pop(currentStatu, type)
    else
      this.pop(currentStatu)
  },

  pop: function (currentStatu, type) {
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
    setTimeout(function () {
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
      this.editReview()
    }
  },
})