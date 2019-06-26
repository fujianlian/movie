<template>
  <div class='detail-wrapper'>
    <img :src='movie.image' class='movie-image' alt="movie"/>
    <div class='movie-card-wrapper'>
      <span class='movie-title'>{{ movie.title }}</span>
      <span class='movie-desc'>{{ movie.description }}</span>
      <div class='button-wrapper'>
        <div class='button' @click='lookReview'>
          <text class='iconfont iconchakan:before'></text>
          <span class='button-text'>查看影评</span>
        </div>
        <div class='button' @click="showEditActions">
          <text class='iconfont iconedit:before'></text>
          <span class='button-text'>添加影评</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        movie: {}
      }
    },
    methods: {
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

      // 写影评
      editReview (type) {
        this.$router.push({
          path: '../film-review-edit/main',
          query: {
            title: this.movie.title,
            id: this.movie._id,
            image: this.movie.image,
            type: type
          }
        })
      },

      lookReview () {
        this.$router.push({
          path: '../film-review-list/main',
          query: {
            id: this.movie._id,
            image: this.movie.image
          }
        })
      }
    },

    onLoad (options) {
      this.movie = JSON.parse(options.movie)
    }
  }
</script>

<style scoped>
  .movie-card-wrapper {
    position: absolute;
    top: 60rpx;
    left: 50rpx;
    right: 50rpx;
    margin-bottom: 50rpx;
    display: flex;
    flex-flow: column;
    align-items: center;
    background: white;
    border: solid 1rpx #eaeef1;
    border-radius: 10rpx
  }

  .movie-desc {
    font-size: 26rpx;
    line-height: 40rpx;
    color: #666;
    margin: 20rpx 60rpx
  }
</style>
