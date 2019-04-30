// pages/film-review-preview/preview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    audio: "",
    image: "",
    title: "",
    id: 0,
    type: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let title = options.title
    let image = options.image
    let id = options.id
    let type = options.type
    let content = type === 'text' ? options.content : ""
    let audio = type === 'audio' ? options.audio : ""
    this.setData({
      image: image,
      title: title,
      id: id,
      type: type,
      content: content,
      audio: audio
    })
  },

  // 发布影评
  addReview() {
    let content = this.data.content;
    if (!content) return

    wx.showLoading({
      title: '正在发布影评...',
    })

    let id = this.data.id

    qcloud.request({
      url: config.service.addrReview,
      method: 'POST',
      login: true,
      data: {
        id: id,
        content: content
      },
      success: result => {
        wx.hideLoading();
        let data = result.data;
        if (!data.code) {
          wx.showToast({
            icon: 'none',
            title: '发布成功'
          })
          wx.navigateTo({
            url: `/pages/film-review-list/list?id=${id}`,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '发布失败'
          })
        }
      },
      fail: (err) => {
        console.log(err)
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '发布失败'
        })
      }
    })
  },

  back(){
    wx.navigateBack()
  }
})