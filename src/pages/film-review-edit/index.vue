<template>
  <div>
    <img class='movie-image' :src='image' alt='movie'/>
    <view class='movie-wrapper wrapper'>
      <span class='movie-title'>{{ title }}</span>
      <textarea v-if='type!==audio' textarea class='edit-ipt' placeholder-class='edit-placeholder' placeholder='输入您的影评内容...' auto-focus maxlength='255' @input='onInput'>
    </textarea>
      <div class='button-wrapper audio-margin' v-if="type===audio">
        <div class='button' bindlongtap="longTap" @touchstart="voiceStartRecord" @touchmove='touchMove' @touchend="voiceEndRecord">
          <i class='iconfont iconrecord_after:before'></i>
          <span class='button-text'>{{text}}</span>
        </div>
      </div>
    </view>
    <button class='bottom' type='primary' @click='addReview'>完成</button>
  </div>
</template>

<script>
  const recorderManager = wx.getRecorderManager()
  let tempFilePath
  let time

  export default {
    data () {
      return {
        image: '',
        title: '',
        id: 0,
        type: '',
        content: '',
        text: '长按录音',
        // 记录长按录音开始点信息,用于后面计算滑动距离。
        startPoint: {},
        audio: 'audio'
      }
    },
    methods: {
      onInput (event) {
        this.content = event.mp.detail.value.trim()
      },

      // 发布影评
      addReview () {
        if (this.type === 'text') {
          if (this.content) {
            this.$router.push({
              path: '../film-review-preview/main',
              query: {
                type: this.type,
                id: this.id,
                image: this.image,
                title: this.title,
                content: this.content
              }
            })
          }
        } else {
          if (tempFilePath) {
            tempFilePath = tempFilePath.replace('=', 'x-y')
            this.$router.push({
              path: '../film-review-preview/main',
              query: {
                type: this.type,
                id: this.id,
                image: this.image,
                title: this.title,
                audio: tempFilePath,
                time: time
              }
            })
          }
        }
      },

      voiceStartRecord () {
        console.log('start record')
        recorderManager.start({
          // 最大长度设置为 2 分钟
          duration: 2 * 60 * 1000,
          // 格式
          format: 'mp3',
          sampleRate: 16000,
          encodeBitRate: 25600,
          frameSize: 9,
          numberOfChannels: 1
        })
      },

      voiceEndRecord () {
        console.log('stop record')
        recorderManager.stop()
      },

      onVoiceStop (voiceInfo) {
        tempFilePath = voiceInfo.tempFilePath
        let duration = voiceInfo.duration
        this.text = '长按录音'
        // 结束录音、隐藏Toast提示框
        wx.hideToast()
        // 不允许小于 1 秒
        if (duration < 1000) {
          wx.showToast({
            title: '录音过短',
            icon: 'none'
          })
          return
        }
        time = duration / 1000
        this.addReview()
      },

      touchMove (e) {
        // touchmove时触发
        var moveLenght = e.touches[e.touches.length - 1].clientY - this.startPoint.clientY // 移动距离
        if (Math.abs(moveLenght) > 50) {
          wx.showToast({
            title: '松开手指，取消保存',
            icon: 'none',
            duration: 60000
          })
        } else {
          wx.showToast({
            title: '正在录音，上划取消保存',
            icon: 'none',
            duration: 60000
          })
        }
      }
    },

    onLoad (options) {
      this.title = options.title
      this.image = options.image
      this.id = options.id
      this.type = options.type
      recorderManager.onStop(this.onVoiceStop)
    },

    onUnload () {
      recorderManager.stop()
    }
  }
</script>

<style scoped>
  .wrapper {
    bottom: 140rpx;
  }

  .edit-ipt {
    width: 100%;
    height: 500rpx;
    padding: 0 46rpx;
    box-sizing: border-box;
    font-size: 32rpx;
    line-height: 44rpx;
    margin-top: 50rpx;
    text-align: center;
  }

  .edit-placeholder {
    color: rgba(29, 29, 38, 0.4);
  }

  .bottom {
    height: 100rpx;
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0rpx;
    text-align: center;
    font-size: 40rpx;
    line-height: 100rpx;
    border-radius: 0rpx;
  }

  .audio-img {
    font-size: 36rpx;
    color: #acbcca;
  }

  .audio-margin {
    position: fixed;
    bottom: 250rpx;
  }
</style>
