<template>
  <div>
    <div class='top-wrapper'>
      <div v-if='collectList.length' class='collect-text'>收藏的影评</div>
      <div v-for='(item,index) in collectList' :key='index' class='collect-card' @click='goReview(item)'>
        <img :src='item.image' class='collect-image' alt="movie"/>
        <div class='collect-text-wrapper'>
          <div class='collect-title'>{{ item.title }}</div>
          <text v-if='item.content' class='review-content content'>{{ item.content }}</text>
          <div v-if='item.audio' class='audio'>
            <i class='iconfont iconbofang:before'></i>
            <span class='audio-time'>{{item.seconds}}s</span>
          </div>
        </div>
        <div class='collect-rec'>
          <img :src='item.avatar' class='hot-avatar' alt="avatar"/>
          <div class='hot-username'>{{ item.username }}</div>
        </div>
      </div>
    </div>
    <div class='bottom-wrapper'>
      <div class='bottom-text' @click='goHome'>回到首页</div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        collectList: []
      }
    },
    methods: {
      /**
       * 获取收藏影评列表
       */
      getList (isFirst, callback) {
        if (isFirst) {
          wx.showLoading({
            title: '正在加载中...'
          })
        }

        this.$db.getMyFavorite().then(result => {
          wx.hideLoading()
          let favoriteList = result.result.data
          let list = []
          favoriteList.forEach(favorite => {
            this.$db.getReview(favorite.reviewId).then(result => {
              let review = result.data
              this.$db.getMovie(review.movieId).then(result => {
                let movie = result.data
                list.push(Object.assign(favorite, review, movie))
                if (list.length === favoriteList.length) {
                  this.collectList = list
                }
              })
            })
          })
          wx.hideLoading()
          callback && callback()
        }).catch(err => {
          console.error(err)
          wx.hideLoading()
          callback && callback()
          wx.showToast({
            title: '加载数据失败'
          })
        })
      },

      goHome () {
        this.$router.back()
      },

      goReview (review) {
        this.$router.push({
          path: '../film-review-detail/main',
          query: {
            review: JSON.stringify(review),
            onlyShow: true
          }
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
  .top-wrapper {
    flex: 1;
    margin-bottom: 100rpx;
    display: flex;
    flex-flow: column;
  }

  .collect-text {
    font-size: 28rpx;
    line-height: 36rpx;
    color: #ffa500;
    text-align: center;
    margin: 70rpx 0 40rpx;
  }

  .collect-card {
    position: relative;
    height: 300rpx;
    background: white;
    margin: 30rpx 40rpx 0;
    border: solid 1rpx #eaeef1;
  }

  .collect-title{
    font-size: 38rpx;
    line-height: 50rpx;
    color: #333;
    font-weight: 600;
  }

  .collect-card:last-child {
    margin-bottom: 30rpx;
  }

  .collect-image {
    width: 203rpx;
    height: 300rpx;
  }

  .collect-text-wrapper {
    position: absolute;
    top: 30rpx;
    left: 243rpx;
    right: 30rpx;
    display: flex;
    flex-flow: column;
  }

  /*
  设置文本最大行数：
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  */

  .collect-rec {
    position: absolute;
    display: flex;
    left: 253rpx;
    bottom: 30rpx;
    align-items: center;
  }

  .content {
    margin-top: 20rpx;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .audio {
    display: flex;
    align-items: center;
    margin-top: 25rpx;
    padding-left: 36rpx;
    width: 226rpx;
    height: 60rpx;
    background-color: #d6dee5;
    border: solid 0.5rpx #bdcad6;
    border-radius: 8rpx;
    opacity: 0.9;
  }

  .audio-time {
    margin-left: 10rpx;
    font-size: 30rpx;
  }

</style>
