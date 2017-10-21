<template>
  <scroll class="singers-content"
          :data="data"
          :listenScroll="true"
          :probe-type="3"
          @scroll="scroll"
          ref="listview">
    <div>
      <div class="wrapper" v-for="item in data" ref="listGroup">
        <h2>{{item.title}}</h2>

        <div>
          <div @click="selectItem(it)" class="list" v-for="it in item.item" >
            <img v-lazy="it.avatar"/>
            <span>{{it.name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="shortcutList" @touchstart.stop.prevent="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li :class="{'current':currentIndex===index}" v-for="(item,index) in shortcutList" :data-index="index"
            class="item">{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'
  const ANCHOR_HEIGHT = 18
  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  computed: {
    shortcutList:function () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle:function(){
      if(this.scrollY>0){
        return ''
      }
      return this.data[this.currentIndex]?this.data[this.currentIndex].title:"";
    }
  },
  created(){
    this.touch = {};
    this.listHeight = []
  },
  components: {
    Scroll,Loading
  },
  methods:{
    refresh(){
      this.$refs.listview.refresh();
    },
    selectItem:function(item){
      this.$emit("select",item);
    },
    onShortcutTouchStart:function (e) {
      let touchIndex = parseInt(getData(e.target, 'index'));

      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
       this.touch.touchIndex=touchIndex;
      this._scrollTo(touchIndex);
    },
    onShortcutTouchMove:function(e){
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta=Math.floor((this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT);
      let touchIndex=this.touch.touchIndex+delta;
      this._scrollTo(touchIndex);
    },
    scroll:function(pos){

      this.scrollY=pos.y;
    },
    _scrollTo:function(index){
      if(!index&&index!==0){
        return;
      }
      if(index<0){
        index=0;
      }else if(index>this.listHeight.length-2){
        index=this.listHeight.length-2
      }
      this.scrollY=-this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0);
    },
    _calculateHeight:function(){
      this.listHeight = [];
      const list=this.$refs.listGroup;
      let height=0;
      this.listHeight.push(height);
      for(let i=0;i<list.length;i++){
        height+=list[i].clientHeight;

        this.listHeight.push(height);
      }
    }
  },
  watch:{
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY){
      const listHeight = this.listHeight

      if(newY>0){
           this.currentIndex=0;
           return;
         }
        for(let i=0;i<listHeight.length-1;i++){
          let height1=listHeight[i];
          let height2=listHeight[i+1];
          if(-newY>=height1&&-newY<height2){
            this.currentIndex=i;
            this.diff=height2+newY;
            return
          }
        }
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal){
      let fixedTop=(newVal>0&&newVal<30)?(newVal-30):0;
      if(this.fixedTop===fixedTop){
        return;
      }
      this.fixedTop=fixedTop;
      this.$refs.fixed.style.transform=`translate3d(0,${fixedTop}px,0)`;
    }
  }
  }
</script>
<style scoped lang="scss">
  .singers-content {
    height: 100%;
    overflow: hidden;
    position: relative;

  .wrapper {
    padding-bottom: 30px;

  h2 {
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    background: #333;
  }

  .list {
    display: flex;
    padding-top: 30px;

  img {
    margin-left: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 20px;
  }

  span {
    line-height: 50px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
  }

  }
  }
  .shortcutList {
    z-index: 2;
    position: absolute;
    width: 20px;
    padding: 20px 0;
    right: 0px;
    text-align: center;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.3);
    top: 50%;
    transform: translateY(-50%);

  .item {
    padding: 3px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    line-height: 1;
  &.current {
    color: #ffcd32;
  }

  }
  }
  .list-fixed{
    width: 100%;
    height: 30px;
    position: absolute;
    top: 0px;
    left: 0px;
    .fixed-title{
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: 12px;
      color: rgba(255,255,255,0.5);
      background: #333;
    }
  }
  }
</style>