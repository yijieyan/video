<template>
  <div class="index">
    <!--<Loading v-if="loading === true"/>-->
    <el-row>
      <el-col :span="2" v-for="(item, index) in items" :key="index" @click.native="clickItem(item, index)">
        <a href="javascript:;" :class="index === activeIndex? 'active': '' ">
          {{item.text}}
        </a>
      </el-col>
    </el-row>

    <ul class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <li v-for="(item, index) in videoList" :key="index">
        <router-link :to="{path: '/detail', query: {id: item._id}}">
          <img :src="item.poster"/>
          <div>
          <span>
            <a href="javascript:;">
              {{item.title}}
            </a>
          </span>
            <label>{{item.rate}}</label>
          </div>
        </router-link>
      </li>
    </ul>
    <p v-if="noData === true" class="tip">已经没有更多数据了</p>
  </div>
</template>

<script>
import http from '../../service/ApiServer'
import infiniteScroll from 'vue-infinite-scroll'
//import Loading from '../Loading/loading.vue'

export default {
  name: 'index',
  data () {
    return {
      items: [
        {
          text: '全部'
        },
        {
          text: '爱情'
        },
        {
          text: '家庭'
        },
        {
          text: '喜剧'
        },
        {
          text: '传记'
        },
        {
          text: '儿童'
        },
        {
          text: '恐怖'
        },
        {
          text: '悬疑'
        },
        {
          text: '惊悚'
        },
        {
          text: '恐怖'
        },
        {
          text: '犯罪'
        },
        {
          text: '战争'
        }
      ],
      videoList: [],
      busy: false,
      page: 1,
      count: 8,
      noData: false,
      activeIndex: 0,
      type: 'all',
      loading: false
    }
  },
  components: {
//    Loading
  },
  directives: {infiniteScroll},
  methods: {
    async init () {
      this.loading = true
      this.busy = true

      let res = await http.get('/video/getVideoList', {page: this.page, count: this.count, type: this.type})
      this.loading = false
      this.busy = false
      if (res.code === 0) {
        if (this.page > 1) {
          if (res.data.length === 0) {
            this.busy = true
            this.noData = true
          }
          this.videoList = this.videoList.concat(res.data)
        } else {
          this.videoList = res.data
          if (res.data.length < this.count) {
            this.noData = true
          }
        }
      } else {
        this.$message.error('休息一下吧，服务器出错了')
      }
    },
    loadMore: function () {
      if (!this.busy) {
        this.busy = true
        setTimeout(() => {
          this.page++
          this.init()
        }, 500)
      }
    },
    clickItem (obj, i) {
      this.activeIndex = i
      if (obj.text === '全部') {
        this.type = 'all'
      } else {
        this.type = obj.text
      }
      this.page = 1
      this.init()
    }
  }
}
</script>

<style scoped lang="scss">
  .index {
    position: relative;
    a {
      display: block;
      color: #666;
      font-size: 16px;
      text-decoration: none;
    }
    .active {
      color: #fff;
      background: #4b8ccb;
    }
    .list {
      padding-left: 0;
      list-style: none;
      display: inline-flex;
      flex-direction: row;
      flex-wrap: wrap;
      li {
        width: 25%;
        height: 300px;
        padding: 0 50px;
        box-sizing: border-box;
        img {
          width: 100%;
          height: 260px;
        }
        div {
          > span {
            > a {
              font-size: 13px;
              color: #37a;
              display: inline-block;
            }
          }
          > label {
            color: #e09015;
            font-size: 13px;
          }
        }
      }
    }
    .tip {
      color: #37a;
      background: rgb(247, 247, 247);
      font-size: 14px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      margin-top: 30px;
    }
  }
</style>
