// pages/film-review/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: "",
    title: "",
    id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let title = options.title
    let image = options.image
    let id = options.id
    this.setData({
      image: image,
      title: title,
      id: id
    })
  }
})