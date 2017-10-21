<template>
  <div class="recommend"  ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
       <slider :banners="recommends" @loadImg="loadImage"></slider>
        <div class="recommend-title">
          <h2>热门歌单推荐</h2>
        </div>
        <div v-for="item in discList" class="list-item" @click="callSyn()">
          <img class="img" v-lazy="item.picUrl" />
          <div class="right">
            <span>{{item.songListAuthor}}</span>
            <p>{{item.songListDesc}}</p>
          </div>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script  type="text/ecmascript-6">
import {getRecommend,getDiscList} from 'api/recommend'
import {playlistMixin} from 'common/js/mixin'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll.vue'
import {mapMutations} from 'vuex'


  export default {
    mixins: [playlistMixin],
    components: {Slider,Scroll},
    data() {
    return {
      recommends:[],
      discList:[],
      swiperOption: {
        autoplay: 5000,
        initialSlide: 1,
        loop: true,
        pagination: '.swiper-pagination',
        onSlideChangeEnd: swiper => {

        }
      }
     }
    },
    created(){
    this._getRecommend()
 /* this._getDiscList()*/
  },
  methods:{
    loadImage() {
        this.$refs.scroll.refresh()
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.list)
          this.discList = res.data.list
        }
      })
    },
    _getRecommend(){
      getRecommend().then((res)=>{
        if(res.code===ERR_OK){
          this.recommends=res.data.slider;
          this.discList = res.data.songList
        }
      })
    },
    selectItem(item){
      this.$router.push(`/recommend/${item.id}`);
      this.setDisc(item)
    },
callSyn(){
      alert(dsBridge.call("testSyn",{"msg":"6666666"}))
    },
  ...mapMutations({
      setDisc:'SET_DISC'
    })
  }

  }
</script>
<style scoped lang="scss">
  .recommend{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
   .recommend-content{
      height: 100%;
      overflow: hidden;
     .recommend-title{
       h2{
         height: 65px;
         line-height: 65px;
         text-align: center;
         font-size: 14px;
         color: #ffcd32;
       }
     }
  .list-item{
    display: flex;
    box-sizing: border-box;
    padding:0 20px 20px 20px;
    align-item:center;
  .img{
    width: 60px;
    height: 60px;
  }
  .right{
    flex: 1;
    margin-left: 20px;
    display: flex;
     flex-direction: column;
    justify-content: space-between;
    font-size:13px;
    p{
      color: rgba(255,255,255,0.3);
      line-height: 18px;
    }
  }
  }
   }
  }
</style>