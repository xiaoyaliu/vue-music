<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h2 class="title" v-html="title"></h2>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter"></div>
      <div class="play" ref="btnPlay" v-show="songs.length>0" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll  class="list" ref="list" :data="songs" @scroll="scroll" :listen-scroll="true" :probe-type="3">
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
      </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import SongList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/scroll'
  import {prefixStyle} from 'common/js/dom'
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')
  import {playlistMixin} from 'common/js/mixin'
  import {mapActions} from 'vuex'
  export default {
    mixins:[playlistMixin],
    components:{SongList,Scroll},
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data:function() {
      return {
        scrollY: 0
      }
   },

    computed:{
      bgStyle:function(){
        console.log(this.songs)
        return `background-image:url(${this.bgImage})`
     }
    },
    mounted:function(){
      this.imageHeight=this.$refs.bgImage.clientHeight;
      this.$refs.list.$el.style.top=this.imageHeight+'px';
      this.minTransalteY = -this.imageHeight + 40
    },
    methods:{
      handlePlaylist(playlist) {
    const bottom = playlist.length > 0 ? '60px' : ''
    this.$refs.list.$el.style.bottom = bottom
    this.$refs.list.refresh()
  },
      random(){
       this.randomPlay({
         list:this.songs
       })
     },
      back:function(){
        this.$router.back()
      },
      selectItem:function(item,index){
         this.selectPlay({
           list:this.songs,
           index:index
         })
      },
      scroll:function(pos){
        this.scrollY=pos.y
      },
       ...mapActions([
         'selectPlay',
            'randomPlay'
  ])
    },
    watch:{
      scrollY:function(newVal){
        let translateY=Math.max(newVal,this.minTransalteY);
        this.$refs.layer.style[transform]=`translate3d(0,${translateY}px,0)`;
        let zIndex = 0;
        let scale=1;
        let percent=Math.abs(newVal/this.imageHeight);
        if(newVal>0){
          scale = 1 + percent;
          zIndex=71
        }
        if(newVal<translateY){
          zIndex=80;
          this.$refs.bgImage.style.paddingTop=0;
          this.$refs.bgImage.style.height='40px';
          this.$refs.btnPlay.style.display="none"
        }else{
          this.$refs.bgImage.style.paddingTop='70%';
          this.$refs.bgImage.style.height=0;
          this.$refs.btnPlay.style.display=""
        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style[transform] = `scale(${scale})`
      }
    }
  }
</script>
<style scoped lang="scss">
  .music-list{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #222;
    .back{
      position: absolute;
      top: 0px;
      left: 6px;
      z-index: 92;
      .icon-back{
        display: block;
        padding: 10px;
        font-size: 22px;
        color: #ffcd32;
      }
    }
    .title{
      text-align: center;
      line-height: 40px;
      font-size: 18px;
      color: #fff;
      position: absolute;
      top: 0px;
      width: 100%;
      box-sizing: border-box;
      padding:0 40px;
      z-index: 90;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .bg-image{
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      background-size: cover;
      transform-origin: top;
      .filter{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
      .play{
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 136px;
        left:50%;
        margin-left: -68px;
        border: 1px solid #ffcd32;
        color: #ffcd32;
        border-radius: 100px;
        padding: 7px 0;
        text-align: center;
        font-size:0;
        .icon-play{
          display: inline-block;
          vertical-align: middle;
          font-size: 16px;
        }
        .text{
          margin-left: 6px;
          font-size: 12px;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  .bg-layer{
    position: relative;
    height: 100%;
    background: #222;
    z-index:60;
  }
  .list{
    position: fixed;
    width: 100%;
    top: 0;
    bottom:0;
    background-color: #222;
    z-index: 70;
    .song-list-wrapper{
      padding: 20px 30px;
    }
  }
  }

</style>