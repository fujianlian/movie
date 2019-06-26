<template>
  <div>
    <div v-for='item in movieList' :key='movie' class='hot-card' @click='goDetail(item)'>
      <img :src='item.image' class='hot-image' alt="movie"/>
      <view class='hot-text-wrapper'>
        <view class='hot-title'>{{ item.title }}</view>
        <view class='hot-category'>类型：{{ item.category }}</view>
      </view>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        movieList: []
      }
    },
    methods: {
      /**
       * 获取热门电影列表
       */
      getList (isFirst, callback) {
        if (isFirst) {
          wx.showLoading({
            title: '正在加载中...'
          })
        }
        this.$db.getMovieList().then(result => {
          wx.hideLoading()
          this.movieList = result.data
          callback && callback()
        }).catch(err => {
          console.error(err)
          wx.hideLoading()
          callback && callback()
          wx.showToast({
            title: '加载数据失败'
          })
        })
      }
    },

    onLoad () {
      this.getList(true)
    },

    onPullDownRefresh () {
      this.getList(false, () => {
        wx.stopPullDownRefresh()
      })
    }
  }
</script>

<style scoped>
  .hot-card {
    display: flex;
    align-items: center;
    height: 300rpx;
    background: white;
    margin: 30rpx 40rpx 0;
    border: solid 1rpx #eaeef1;
  }

  .hot-card:last-child {
    margin-bottom: 30rpx;
  }

  .hot-image {
    width: 203rpx;
    height: 300rpx;
  }

  .hot-text-wrapper {
    margin-left: 40rpx;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
  }

  .hot-title {
    font-size: 36rpx;
    line-height: 50rpx;
    color: #333;
    font-weight: 600;
  }

  .hot-category {
    font-size: 26rpx;
    line-height: 36rpx;
    color: #666;
    margin-top: 40rpx;
  }
</style>
