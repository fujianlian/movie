<template>
  <div>
    <div class='top-wrapper'>
      <div v-for='(item , index) in reviewList' :key='index' class='review-card' @click='go(item)'>
        <div class='person-rec'>
          <img :src='item.avatar' class='hot-avatar' alt="avatar"/>
          <span class='hot-username'>{{ item.username }}</span>
        </div>
        <span v-if='item.content' class='review-content content'>{{ item.content }}</span>
        <div v-if='item.audio' class='audio'>
          <i class='iconfont iconbofang:before'></i>
          <span class='audio-time'>{{item.seconds}}s</span>
        </div>
      </div>
    </div>
    <div class='bottom-wrapper'>
      <span class='bottom-text' @click='goHome'>回到首页</span>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        id: 0,
        reviewList: [],
        time: 0,
        text: '',
        image: '',
        isPlay: false
      }
    },
    methods: {
      goHome () {
        this.$router.go(20)
      },

      /**
       * 获取影评列表
       */
      getList (isFirst, callback) {
        if (isFirst) {
          wx.showLoading({
            title: '正在加载中...'
          })
        }
        this.$db.getMovieReview(this.id).then(result => {
          wx.hideLoading()
          this.reviewList = result.data
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

      go (review) {
        review = Object.assign(review, {
          image: this.image
        })
        this.$router.push({
          path: '../film-review-detail/main',
          query: {
            review: JSON.stringify(review)
          }
        })
      }
    },

    onLoad (options) {
      console.log(options)
      this.id = options.id
      this.image = options.image
      this.getList()
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
    margin-top: 30rpx;
    margin-bottom: 100rpx;
    display: flex;
    flex-flow: column;
  }

  .review-card {
    display: flex;
    flex-flow: column;
    background: white;
    border-bottom: solid 1rpx #eaeef1;
    padding: 30rpx 40rpx 30rpx 50rpx;
  }

  .person-rec {
    display: flex;
    align-items: center;
  }

  .content {
    font-size: 26rpx;
    line-height: 36rpx;
    color: #666;
    margin-top: 20rpx;
    margin-left: 20rpx;
  }

  .audio {
    display: flex;
    align-items: center;
    margin-top: 30rpx;
    margin-left: 20rpx;
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
