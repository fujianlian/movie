<template>
  <div>
    <div class='hot-wrapper'>
      <img :src='movie.image' class='hot-image' @click='goDetail(movie)' alt="hot"/>
      <span class='hot-title'>{{ movie.title }}</span>
      <div class='hot-rec' @click='goReview'>
        <img :src='movie.avatar' class='hot-avatar' alt="avatar"/>
        <span class='hot-username' v-if="movie.username">{{ movie.username }}给你推荐了一部电影</span>
      </div>
    </div>
    <div class='bottom-wrapper'>
      <div class='bottom-btn' @click='goHot'>
        <i class='iconfont iconzan:before'></i>
        <span class='btn-text'>热门</span>
      </div>
      <div v-if="!userInfo" class="login-btn">
        <div class='login-img-btn'>
          <i class='iconfont iconme-:before'></i>
          <span class='login-img-text'>我的</span>
        </div>
        <button class="login-text" open-type='getUserInfo' bindgetuserinfo='onTapLogin'>我的</button>
      </div>
      <div v-else class='bottom-btn' @click='goPersonal'>
        <i class='iconfont iconme-:before'></i>
        <span class='btn-text '>我的</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        // 影评数据及其对应电影数据
        movie: {},
        // 用户信息
        userInfo: null
      }
    },

    methods: {
      onTapLogin (event) {
        this.userInfo = event.mp.detail.userInfo
      },

      /**
       * 随机获取热门电影
       */
      getRondom () {
        wx.showLoading({
          title: '正在加载中...'
        })
        this.$db.getReviewRondom().then(result => {
          wx.hideLoading()
          this.movie = result.result
        }).catch(err => {
          console.error(err)
          wx.hideLoading()
          wx.showToast({
            title: '加载数据失败'
          })
        })
      },

      goHot () {
        this.$router.push('../hot-movie/main')
      },

      goPersonal () {
        wx.navigateTo({
          url: '/pages/personal/personal'
        })
      },

      goReview () {
        let review = this.movie
        review = JSON.stringify(review)
        wx.navigateTo({
          url: `/pages/film-review-detail/detail?review=${review}`
        })
      }
    },
    onLoad () {
      this.getRondom()
    },
    onShow () {
      this.$util.getUserInfo().then(userInfo => {
        this.userInfo = userInfo
      }).catch(() => {
        console.log('尚未通过身份验证')
      })
    }
  }
</script>

<style scoped>
  .hot-wrapper {
    display: flex;
    flex-flow: column;
    margin-top: 60rpx;
    align-items: center;
  }

  .hot-image {
    width: 500rpx;
    height: 740rpx;
  }

  .hot-title {
    margin-top: 40rpx;
    font-size: 36rpx;
    line-height: 50rpx;
    color: #333;
    font-weight: 600;
  }

  .hot-rec {
    display: flex;
    margin-top: 20rpx;
    align-items: center;
  }

  .bottom-btn {
    width: 50vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .btn-text {
    font-size: 30rpx;
    color: #acbcca;
    margin-left: 10rpx;
  }

  .login-text {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding-left: 86rpx;
    padding-top: 2rpx;
    font-size: 30rpx;
    line-height: 100rpx;
    color: #acbcca;
    background-color: transparent;
    z-index: 99;
  }

  .login-text::after {
    border: none;
  }

  .login-btn {
    width: 50vw;
    height: 100rpx;
    position: relative;
  }

  .login-img-btn {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-img-text {
    font-size: 30rpx;
    margin-left: 10rpx;
    color: transparent;
  }
</style>
