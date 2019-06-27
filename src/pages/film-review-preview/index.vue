<template>
  <div>
    <img :src='image' class='movie-image' alt="movie"/>
    <div class='movie-wrapper'>
      <span class='movie-title'>{{ title }}</span>
      <div class='movie-rec' @click='goReview'>
        <img :src='userInfo.avatarUrl' class='rec-avator' alt="avatar"/>
        <span class='rec-text' v-if='userInfo.nickName'>{{userInfo.nickName}}的影评</span>
      </div>
      <div class='movie-rec mark'>
        <i class='iconfont iconyinhao:before mark-img'></i>
        <span v-if='type!==typeText' class='content'>{{content}}</span>
        <div v-else class='audio' @click='playAndStop'>
          <i v-if='isPlay' class='iconfont iconzanting:before'></i>
          <i v-else class='iconfont iconbofang:before'></i>
          <span class='audio-time'>{{text}}</span>
        </div>
      </div>
      <view class='button-wrapper-two' v-if='!onlyShow'>
        <div class='button' @click='back'>
          <i class='iconfont iconfanhuishangcengji:before'></i>
          <span class='button-text'>重新编辑</span>
        </div>
        <div class='button' @click='addReview'>
          <i class='iconfont iconfabu:before'></i>
          <span class='button-text'>发布影评</span>
        </div>
      </view>
    </div>
  </div>
</template>

<script>
  const innerAudioContext = wx.createInnerAudioContext()

  export default {
    data () {
      return {
        userInfo: null,
        content: '',
        audio: '',
        username: '',
        avatar: '',
        seconds: 0,
        movieId: '',
        image: '',
        title: '',
        type: '',
        text: '',
        isPlay: false,
        isUpload: false,
        typeText: 'audio'
      }
    },
    methods: {
      // 发布影评
      addReview () {
        if (this.type === 'audio') {
          this.uploadAudio()
        } else {
          let data = {
            content: this.content,
            audio: '',
            seconds: 0,
            movieId: this.movieId,
            username: this.userInfo.nickName,
            avatar: this.userInfo.avatarUrl
          }
          wx.showLoading({
            title: '正在发布影评...'
          })
          this.uploadPreview(data)
        }
      },

      // 上传影评
      uploadPreview (data) {
        this.$db.addReview(data).then(() => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '发布成功'
          })
          this.$router.push({
            path: '../film-review-list/main',
            query: {
              id: data.movieId,
              image: this.image
            }
          })
          this.isUpload = false
        }).catch(err => {
          console.error(err)
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '发布失败'
          })
          this.isUpload = false
        })
      },

      // 上传录音接口
      uploadAudio () {
        if (this.isUpload) {
          return
        }
        wx.showLoading({
          title: '正在发布影评...'
        })
        this.isUpload = true

        this.$db.uploadAudio(this.audio).then(result => {
          let data = {
            content: '',
            audio: result.fileID,
            seconds: this.seconds,
            movieId: this.movieId,
            username: this.userInfo.nickName,
            avatar: this.userInfo.avatarUrl
          }
          this.uploadPreview(data)
        }).catch(err => {
          console.log('err', err)
          wx.showToast({
            icon: 'none',
            title: '上传录音失败'
          })
          this.isUpload = false
        })
      },

      // 播放声音/停止播放
      playAndStop () {
        innerAudioContext.onError((res) => {
          console.log(res.errMsg)
          console.log(res.errCode)
        })
        innerAudioContext.onEnded(() => {
          this.text = `${this.seconds}s`
          this.isPlay = false
        })
        if (!innerAudioContext.paused) {
          innerAudioContext.pause()
          innerAudioContext.onPause(() => {
            this.text = `${this.seconds}s`
            this.isPlay = false
          })
        } else {
          innerAudioContext.autoplay = true
          innerAudioContext.play()
          innerAudioContext.onPlay(() => {
            this.text = '正在播放'
            this.isPlay = true
          })
        }
      },
      back () {
        this.$router.back()
      }
    },

    onLoad (options) {
      this.$util.getUserInfo().then(userInfo => {
        this.userInfo = userInfo
      }).catch(() => {
        console.log('尚未通过身份验证')
      })

      this.title = options.title
      this.image = options.image
      this.movieId = options.id
      this.type = options.type
      this.content = this.type !== this.typeText ? options.content : ''
      this.audio = this.type === this.typeText ? options.audio.replace('x-y', '=') : ''
      this.seconds = this.type === this.typeText ? Math.round(options.time) : 0
      this.text = this.seconds + 's'

      if (this.type === this.typeText) {
        innerAudioContext.src = this.audio
      }
    }
  }
</script>

<style scoped>
  .movie-image {
    position: absolute;
    width: 204rpx;
    height: 300rpx;
    top: 30rpx;
    left: 273rpx;
    z-index: 99;
  }

  .movie-wrapper {
    position: fixed;
    top: 60rpx;
    left: 50rpx;
    right: 50rpx;
    bottom: 50rpx;
    display: flex;
    flex-flow: column;
    align-items: center;
    background: white;
    border: solid 1rpx #eaeef1;
    border-radius: 10rpx;
  }

  .movie-title {
    padding-top: 295rpx;
    font-size: 40rpx;
    line-height: 56rpx;
    color: #333;
    font-weight: 400;
  }

  .movie-rec {
    display: flex;
    margin-top: 30rpx;
    align-items: center;
    width: 100%;
  }

  .rec-avator {
    width: 80rpx;
    height: 80rpx;
    border-radius: 40rpx;
    margin-left: 55rpx;
  }

  .rec-text {
    margin-left: 20rpx;
    font-size: 30rpx;
    color: #666;
  }

  .mark {
    align-items: flex-start;
  }

  .mark-img {
    font-size: 26rpx;
    margin-left: 82rpx;
    margin-top: 10rpx;
    color: rgba(0, 0, 0, 0.8);
  }

  .content {
    margin-left: 47rpx;
    font-size: 26rpx;
    line-height: 40rpx;
    margin-right: 55rpx;
    opacity: 0.8;
  }

  .audio {
    display: flex;
    align-items: center;
    margin-left: 47rpx;
    margin-top: 10rpx;
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
