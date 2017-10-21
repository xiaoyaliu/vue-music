<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
       <div class="normal-player" v-show="fullScreen">
         <div class="background">
           <img width="100%" height="100%" class="play" :src="currentSong.image">
         </div>
         <div class="top">
           <div class="back" @click="back">
             <i class="icon-back">
             </i>
           </div>
           <h1 class="title" v-html="currentSong.name"></h1>
           <h2 class="name" v-html="currentSong.singer"></h2>
         </div>
         <div class="middle" @touchstart.prevent="middleTouchStart"
              @touchmove.prevent="middleTouchMove"
              @touchend="middleTouchEnd">
           <div class="middle-l" ref="middleL">
             <div class="cd-wrapper" ref="cdWrapper">
               <div class="cd" :class="cdclass">
                 <img class="image" :src="currentSong.image">
               </div>
             </div>
             <div class="playing-lyric-wrapper">
               <div class="playing-lyric">{{playingLyric}}</div>
             </div>
           </div>
           <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
             <div class="lyric-wrapper">
               <div v-if="currentLyric">
                 <p ref="lyricLine"
                    class="text"
                    :class="{'current': currentLineNum ===index}"
                    v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
               </div>
             </div>
           </scroll>
         </div>
         <div class="bottom">
           <div class="dot-wrapper">
             <span class="dot" :class="{'active':currentShow==='cd'}"></span>
             <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
           </div>
           <div class="progress-wrapper">
             <span class="time time-l">{{format(currentTime)}}</span>
             <div class="progress-bar-wrapper">
               <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
             </div>
             <span class="time time-r">{{format(currentSong.duration)}}</span>
           </div>
           <div class="operators">
             <div class="icon i-left" @click="changeMode">
               <i :class="iconMode"></i>
             </div>
             <div class="icon i-left" :class="disableCls" @click="prev">
               <i class="icon-prev"></i>
             </div>
             <div class="icon i-center"  :class="disableCls" @click="togglePlay">
               <i  :class="playIcon"></i>
             </div>
             <div class="icon i-right"  :class="disableCls"  @click="next">
               <i  class="icon-next"></i>
             </div>
             <div class="icon i-right">
               <i class="icon icon-not-favorite"></i>
             </div>
           </div>
         </div>
       </div>
    </transition>
    <transition name="mini">
    <div class="mini-player"  @click="open" v-show="!fullScreen">
      <div class="icon" >
        <img :class="cdclass" width="40" height="40" :src="currentSong.image">
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc"  v-html="currentSong.singer"></p>
      </div>
      <div class="control">
        <progress-circle :radius="32" :percent="percent">
          <i @click.stop="togglePlay" class="icon-mini" :class="miniIcon"></i>
        </progress-circle>
    </div>
      <div class="control">
         <i class="icon-playlist"></i>
      </div>
    </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @canplay="readyPlay" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters,mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
const transform=prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  components:{ProgressBar,ProgressCircle,Scroll},
  data(){
    return {
      songReady:false,
      currentTime:0,
      currentLyric:null,
      currentLineNum: 0,
      playingLyric:"",
      currentShow:"cd"
    }
  },
  computed:{
    cdclass(){
  return this.playing ? 'play' : 'play pause'
   },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
   },
    playIcon(){
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    iconMode(){
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    percent() {
      return this.currentTime /this.currentSong.duration
    },
     ...mapGetters([
       'currentSong',
       'fullScreen',
        'playlist',
        'playing',
        'sequenceList',
        'currentIndex',
        'mode'
     ])
  },
created(){
    this.touch={}
  },
  methods:{
    middleTouchStart(e){
      this.touch.moved = false
      this.touch.initiated=true;
      this.touch.startX= e.touches[0].pageX;
      this.touch.startY = e.touches[0].pageY;
    },
    middleTouchMove(e){
     if(!this.touch.initiated){
       return;
     }
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      const touch= e.touches[0];
      const deltaX=touch.pageX-this.touch.startX;
      const deltaY=touch.pageY-this.touch.startY;

      if(Math.abs(deltaX)<Math.abs(deltaY)-10){
        return;
      }
      const left=this.currentShow==='cd'?0:-window.innerWidth;
      const offsetWidth=Math.min(0,Math.max(-window.innerWidth,left+deltaX));
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd(){
      let offsetWidth;
      let opacity
      if (!this.touch.moved) {
        return
      }
      if(this.currentShow === 'cd'){
        if(this.touch.percent>0.1){
          offsetWidth=-window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        }else{
          offsetWidth=0;
          opacity = 1
        }
      }else{
        if(this.touch.percent<0.9){
          offsetWidth=0;
          this.currentShow='cd'
          opacity = 1
        }else{
          offsetWidth=-window.innerWidth;
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
      this.touch.initiated = false
    },
    changeMode(){
      const mode = (this.mode + 1) % 3;
       this.setPlayMode(mode);
      let list=null;
      if(mode === playMode.random){
        list=shuffle(this.sequenceList)
      }else{
        list=this.sequenceList
      }

      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list){

      let index=list.findIndex((item)=>{
        return item.id === this.currentSong.id;
      })
      this.setCurrentIndex(index)
    },
    readyPlay(){
      this.songReady=true;
    },
    error(){
      this.songReady=true;
    },
    back(){
      this.setFullScreen(false)
    },
    open(){
      this.setFullScreen(true)
    },
    end(){
      if(this.mode === playMode.loop){
        this.loop()
      }else{
        this.next()
      }

    },
    loop(){
      this.$refs.audio.currentTime=0;
      this.$refs.audio.play();
      this.setPlayingState(true)
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    prev(){
      if(!this.songReady){
        return
      }
      if(this.playlist.length===1){
        this.loop()
        return
      }else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playlist.length - 1;
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlay()
        }
      }
      this.songReady=false
    },
    next(){
      if(!this.songReady){
        return
      }
      if(this.playlist.length===1){
       this.loop()
        return
      }else{
     let index=this.currentIndex+1;
      if(index===this.playlist.length){
        index=0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlay()
      }
      }
      this.songReady=false

    },
    togglePlay(){
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing);
    },
    updateTime(e){
         this.currentTime= e.target.currentTime;

    },
    format(interval){
      interval=interval | 0;
      const minute =interval /60 | 0;
      const second =this._zero(interval%60);
      return `${minute}:${second}`
    },
    _zero(num){
      let len=num.toString().length;
      if(len<2){
        num='0'+num;
      }
      return num
    },
    onProgressBarChange(percent){
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlay()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    enter(el,done){
       const {x,y,scale} = this._getPosAndScale();
      let animation={
        0:{
          transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60:{
          transform:`translate3d(0,0,0) scale(1.1)`
        },
        100:{
          transform:`translate3d(0,0,0) scale(1)`
        }
      }
      animations.registerAnimation({
        name:'move',
        animation,
        presets:{
          duration:400,
          easing:'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper,'move',done);
    },
    afterEnter(){
        animations.unregisterAnimation('move');
      this.$refs.cdWrapper.style.animation = '';
    },
    leave(el,done){

      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },

    afterLeave(){
      this.$refs.cdWrapper.style[transform] = ''
      this.$refs.cdWrapper.style.tranaition=""
    },
    _getPosAndScale() {
      const targetWidth=40;
      const paddingLeft=40;
      const paddingBottom=30;
      const top=80;
      const width=window.innerWidth*0.8;
      const scale=targetWidth/width;
      const x=-(window.innerWidth/2-paddingLeft);
      const y=window.innerHeight-top-width/2-paddingBottom;
      return { x,
                y,
                scale
              }
    },
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        if (this.currentSong.lyric !== lyric) {
          return
        }
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    handleLyric({lineNum,txt}){
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
  ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState:'SET_PLAYING_STATE',
      setCurrentIndex:'SET_CURRENT_INDEX',
      setPlayMode:'SET_PLAY_MODE',
      setPlayList:'SET_PLAYLIST'
    }),
  },
watch:{
  currentSong(newSong,oldSong){
   if(newSong.id === oldSong.id){
      return
    }
    if (this.currentLyric) {
      this.currentLyric.stop()
      this.currentTime = 0
      this.playingLyric = ''
      this.currentLineNum = 0
    }
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.$refs.audio.play()
      this.getLyric()
    }, 1000)
  },
  playing(newPlaying){
    const audio=this.$refs.audio;
    this.$nextTick(() => {
      if (newPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    })
  }
}
}
</script>
<style lang="scss">
  .player{
    .normal-player{
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: #222;
  .background{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    -webkit-filter: blur(20px);
    filter: blur(20px);
  }
      .top{
        position: relative;
        .back{
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 60;
          .icon-back{
            display: block;
            padding: 9px;
            font-size: 22px;
            color: #ffcd32;
            transform: rotate(-90deg);
          }
        }
        .title{
          line-height: 40px;
          text-align: center;
          margin: 0 40px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-size: 18px;
          color: #fff;
        }
        .name{
          line-height: 20px;
          text-align: center;
          font-size: 14px;
          color: #fff;
        }
      }
    .middle{
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l{
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper{
          position: absolute;
          width: 80%;
          left: 10%;
          top: 0;
          height: 100%;
          .cd{
            border: 10px solid rgba(255,255,255,0.1);
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          &.play{
            animation: rotate 20s linear infinite;
           }
           &.pause{
            animation-play-state: paused;
            }
            .image{
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
      .playing-lyric-wrapper{
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric{
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            color: rgba(255,255,255,0.5);
          }
      }
      }
    .middle-r{
       display: inline-block;
       vertical-align: top;
       width: 100%;
       height: 100%;
       overflow: hidden;
    .lyric-wrapper{
    width: 80%;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
    .text{
        line-height: 32px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
        &.current{
          color: #fff;
         }
        }
      }
     }
    }
    .bottom{
      position: absolute;
      bottom: 20px;
      width: 100%;
      .dot-wrapper{
        text-align: center;
        font-size: 0;
        .dot{
          display: inline-block;
          vertical-align: top;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          &.active{
            width: 20px;
            border-radius: 5px;
             background: rgba(255, 255, 255, 0.8);
           }
        }
      }
      .operators{
        display: flex;
        align-items: center;
        .icon{
          flex:1;
          color: #ffcd32;
        &.disable{
        color: rgba(255, 205, 49, 0.5)
         }
          i{
            font-size: 30px;
          }
          &.i-left{
              text-align: right;
           }
          &.i-center{
             text-align: center;
              padding: 0 20px;
              i{
                font-size: 40px;;
              }
           }
          &.i-right{
             text-align: left;
           }
        }
      }
  .progress-wrapper{
    display: flex;
    align-items: center;
    width: 80%;
    margin: 0 auto;
    padding: 8px 0;
  .progress-bar-wrapper{
    flex: 1;
  }
    .time{
      color: #fff;
      font-size: 12px;
      flex: 0 0 30px;
      line-height: 30px;
      width: 30px;
      &.time-l{
        text-align: left;
       }
      &.time-r{
         text-align: right;
       }
      }
     }
    }
     &.normal-enter-active, &.normal-leave-active{
       transition: all 0.4s;
    .top,.bottom{
      transition: all 0.4s cubic-bezier(0.86,0.18,0.82,1.32);
    }
      }
      &.normal-leave-to, &.normal-enter{
         opacity:0;
         .top{
            transform: translate3d(0,-100px,0);
         }
          .bottom{
            transform: translate3d(0,100px,0);
          }
       }
    }
    .mini-player{
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: #333;
      display: flex;
      align-items: center;
        .icon{
          margin: 0 10px 0 20px;
          width: 40px;
          height: 40px;
          img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
  &.play{
     animation: rotate 20s linear infinite;
   }
  &.pause{
     animation-play-state: paused;
   }
          }
        }
      .text{
        display: flex;
        flex: 1;
        height: 40px;
        flex-direction: column;
        justify-content: space-between;
        .name{
          margin-bottom: 2px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 14px;
          color: #fff;
        }
        .desc{
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
        }
      }
      .control{
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;

          .icon-mini {
            font-size: 32px;
            position: absolute;
            left: 0;
            top: 0;
            color: rgba(255,205,49,0.5);
        }
        .icon-playlist{
          font-size: 30px;
          color: rgba(255,205,49,0.5);
        }
      }
    }
  }
  @keyframes rotate {
    0%{
      transform: rotate(0deg);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>