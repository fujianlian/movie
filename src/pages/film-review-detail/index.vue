<template>
  <div class='detail-wrapper'>
    <img class='movie-image' :src='review.image' alt="movie"/>
    <div class='movie-wrapper'>
      <div class='movie-title'>{{ review.title }}</div>
      <div class='movie-rec'>
        <img :src='review.avatar' class='rec-avator' alt="avatar"/>
        <div class='rec-text' v-if='review.username'>{{ review.username }}的影评</div>
      </div>
      <div v-if='review.content' class='review-content content'>{{ review.content }}</div>
      <div v-if='review.audio' class='audio' @click='playAndStop'>
        <i v-if='isPlay' class='iconfont iconzanting:before'></i>
        <i v-else class='iconfont iconbofang:before'></i>
        <span class='audio-time'>{{text}}</span>
      </div>
      <div class='button-wrapper-two' v-if='!onlyShow&&!onlyCollect'>
        <div class='button' @click='collectreview'>
          <i class='iconfont iconstar:before'></i>
          <span class='button-text'>收藏影评</span>
        </div>
        <div class='button' @click='showEditActions'>
          <i class='iconfont iconedit:before'></i>
          <span class='button-text'>写影评</span>
        </div>
      </div>
      <div v-if='onlyCollect' class='button-wrapper-three'>
        <div class='button' @click='collectReview'>
          <i class='iconfont iconstar:before'></i>
          <span class='button-text'>收藏影评</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        review: {},
        // 是否只显示影评内容
        onlyShow: false,
        // 是否只显示收藏按钮
        onlyCollect: false,
        text: '',
        isPlay: false
      }
    },
    methods: {
      // 收藏影评
      collectReview () {
        wx.showLoading({
          title: '正在收藏影评...'
        })
        let reviewId = this.review.reviewId
        this.$db.favoriteReview(reviewId).then(result => {
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
            title: '收藏失败'
          })
        })
      },

      // 写影评
      editReview (type) {
        console.log(this.review)

        this.$router.push({
          path: '../film-review-edit/main',
          query: {
            title: this.review.title,
            id: this.review.movieId,
            image: this.review.image,
            type: type
          }
        })
      },

      showEditActions: function () {
        wx.showActionSheet({
          itemList: ['文字', '音频'],
          success: res => {
            if (res.tapIndex === 0) {
              this.editReview('text')
            } else if (res.tapIndex === 1) {
              this.editReview('audio')
            }
          }
        })
      },

      // 播放声音/停止播放
      playAndStop () {
        this.innerAudioContext.onError((res) => {
          console.log(res.errMsg)
          console.log(res.errCode)
        })
        this.innerAudioContext.onEnded(() => {
          this.text = `${this.review.seconds}s`
          this.isPlay = false
        })
        if (!this.innerAudioContext.paused) {
          this.innerAudioContext.pause()
          this.innerAudioContext.onPause(() => {
            this.text = `${this.review.seconds}s`
            this.isPlay = false
          })
        } else {
          this.innerAudioContext.autoplay = true
          this.innerAudioContext.play()

          this.innerAudioContext.onPlay(() => {
            this.text = '正在播放'
            this.isPlay = true
          })
        }
      }
    },

    onLoad (options) {
      this.review = JSON.parse(options.review)
      this.onlyShow = options.onlyShow === undefined ? false : options.onlyShow
      this.onlyCollect = options.onlyCollect === undefined ? false : options.onlyCollect
      this.text = this.review.seconds + 's'
      this.innerAudioContext.src = this.review.audio
    }
  }
</script>

<style scoped>
  .content {
    margin: 30rpx 40rpx 0 151rpx
  }

  .audio {
    display: flex;
    align-items: center;
    margin-top: 30rpx;
    padding-left: 40rpx;
    width: 300rpx;
    height: 70rpx;
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
