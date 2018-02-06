<template>
  <div class="box">
    <h4 class="title">{{title}}</h4>
    <div id="player">
    </div>
    <div class="type">
      <span>类型: <em>{{type.toString()}}</em></span>
    </div>
    <div class="type">
      <span>国家: <em>{{countries.toString()}}</em></span>
    </div>
    <div class="actor">
      <h4>导演</h4>
      <p>{{directors.toString()}}</p>
    </div>

    <div class="casts">
      <h4>演员</h4>
      <p>{{casts.toString()}}</p>
    </div>
    <div class="desc">
      <h4>简介</h4>
      <p>{{summary}}</p>
    </div>
  </div>
</template>

<script>
  import '../../../node_modules/dplayer/dist/DPlayer.min.css'
  import DPlayer from '../../../node_modules/dplayer/dist/DPlayer.min.js'
  import http from '../../service/ApiServer'

  export default {
    name: 'detail',
    data() {
      return {
        isPlay: false,
        dp: '',
        title: '',
        summary: '',
        directors: [],
        casts: [],
        type: [],
        countries: []
      }
    },
    async created() {
      let id = this.$route.query.id
      await this.init(id)
    },
    methods: {
      async init(id) {
        let res = await http.get('/video/getVideoDetail', {id})
        if (res.code === 0) {
          this.title = res.data.title
          this.summary = res.data.summary
          this.directors = res.data.directors
          this.casts = res.data.casts
          this.type = res.data.type
          this.countries = res.data.countries
          let dp = new DPlayer({
            element: document.getElementById('player'),
            video: {
              url: res.data.video,
              pic: res.data.src
            },
            autoplay: false,
            lang: 'zh-cn'
          })
          this.dp = dp
          dp.on('pause', function () {
            this.isPlay = false
            document.getElementsByClassName('dplayer-mask')[0].style.zIndex = 1000
          })

          dp.on('play', function () {
            this.isPlay = true
            document.getElementsByClassName('dplayer-mask')[0].style.zIndex = -1
          })

          dp.on('fullscreen', function () {
            document.getElementsByClassName('dplayer')[0].style.height = '100%'
          })
          dp.on('fullscreen_cancel', function () {
            document.getElementsByClassName('dplayer')[0].style.height = '400px'
          })
        } else {
          this.$message.error('休息一下吧，服务器出错了');
        }
      }
    }
}
</script>

<style scoped lang="scss">
  .box {
    text-align: center;
    padding: 0 30px ;
    .title {
      color: #37a;
      font-size: 26px;
      text-align: left;
    }
    #player {
      height: 400px;
      width: 100%;
      margin: 30px auto;
      position: relative;
    }
    .type {
      text-align: left;
      > span {
        font-size: 14px;
        color: #666;
        > em {
          color: #111;
          font-style: normal
        }
      }
    }
    .actor {
      text-align: left;
      color: #666;
      > h4 {
        font-size: 14px;
      }
      > p {
        font-size: 14px;
        color: #37a;
      }
    }
    .casts {
      font-size: 13px;
      text-align: left;
      color: #666;
      > p {
        color: #37a;
      }
    }
    .desc {
      text-align: left;
      color: #333;
      > h4 {
        font-size: 18px;
      }
      > p {
        font-size: 14px;
      }
    }
  }
</style>

<style>
  .dplayer-mask {
    background: url('../../assets/images/play_btn.png') center center no-repeat;
    position: absolute;
    display: block;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
    z-index: 1000;
  }
</style>
