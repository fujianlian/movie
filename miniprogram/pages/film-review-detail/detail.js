// pages/film-review-detail/detail.js

const db = require('../../utils/db.js')
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    review: {},
    // 是否只显示影评内容
    onlyShow: false,
    // 是否只显示收藏按钮
    onlyCollect: false,

    text: "",
    isPlay: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let review = this.data.review
    review = JSON.parse(options.review)
    let onlyShow = this.data.onlyShow
    onlyShow = options.onlyShow === undefined ? false : options.onlyShow
    let onlyCollect = this.data.onlyCollect
    onlyCollect = options.onlyCollect === undefined ? false : options.onlyCollect
    let text = this.data.text
    text = review.seconds + 's'
    review.username = review.username
    innerAudioContext.src = review.audio
    this.setData({
      review,
      onlyShow,
      onlyCollect,
      text
    })
  },

  // 收藏影评
  collectReview() {
    wx.showLoading({
      title: '正在收藏影评...',
    })
    let reviewId = this.data.review.reviewId
    db.favoriteReview(reviewId).then(result => {
      wx.hideLoading()
      if (result.result) {
        wx.showToast({
          icon: 'none',
          title: '收藏成功'
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '您已收藏过该影评'
        })
      }
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
      wx.showToast({
        title: '收藏失败',
      })
    })
  },

  // 写影评
  editReview(type) {
    let image = this.data.review.image
    let id = this.data.review.movie_id
    let title = this.data.review.title
    wx.navigateTo({
      url: `/pages/film-review-edit/edit?title=${title}&id=${id}&image=${image}&type=${type}`,
    })
  },

  showEditActions: function (event) {
    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success: res => {
        if (res.tapIndex === 0) {
          this.editReview("text")
        } else if (res.tapIndex === 1) {
          this.editReview("audio")
        }
      }
    });
  },

  // 播放声音/停止播放
  playAndStop() {

    let that = this
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.onEnded((res) => {
      that.setData({
        text: `${this.data.review.seconds}s`,
        isPlay: false
      })
    })
s
    if (!innerAudioContext.paused) {
      innerAudioContext.pause()
      innerAudioContext.onPause(() => {
        that.setData({
          text: `${this.data.review.seconds}s`,
          isPlay: false
        })
      })
    } else {
      innerAudioContext.autoplay = true;
      innerAudioContext.play()

      innerAudioContext.onPlay(() => {
        that.setData({
          text: '正在播放',
          isPlay: true
        })
      })
    }
  },
})