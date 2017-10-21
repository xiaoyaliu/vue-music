<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
      <div class="bar-inner">
        <div class="progress" ref="progress"></div>
      </div>
    <div class="progress-btn" ref="progressBtn"
         @touchstart.prevent="progressTouchStart"
         @touchmove.prevent="progressTouchMove"
         @touchend="progressTouchEnd">
      <div class="inner"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'
  const progressBtnWidth = 16
  const transform = prefixStyle('transform')
  export default {
    props:{
      percent:{
        type:Number,
        default:0
      }
    },
    created(){
      this.touch={}
    },
    methods:{
      progressTouchStart(e){
        this.touch.initiated=true;
       this.touch.startX= e.touches[0].pageX;
        this.touch.left=this.$refs.progress.clientWidth;
      },
      progressTouchMove(e){
       if (! this.touch.initiated){
          return;
        }
        const deltax= e.touches[0].pageX-this.touch.startX;
        const offsetWidth=Math.min(Math.max(0,this.touch.left+deltax),this.$refs.progressBar.clientWidth-progressBtnWidth);
        this._offset(offsetWidth);
      },
      progressTouchEnd(e){
        this.touch.initiated = false
        this._triggerPercent()
      },
      _offset(offsetWidth) {
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
         this.$refs.progress.style.width = `${offsetWidth}px`

      },
      _triggerPercent(){
        const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth;
        const percent=this.$refs.progress.clientWidth / barWidth;
        this.$emit('percentChange',percent)
      },
      progressClick(e){
        console.log(e)
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        this._triggerPercent()
      }
    },
    watch:{
      percent(newPercent) {
        if(newPercent>=0 && !this.touch.initiated){
          const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth;
          const offsetWidth = newPercent * barWidth;
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .progress-bar{
    height: 30px;
    position: relative;
    .bar-inner{
      position: relative;
      height: 4px;
      top: 13px;
      background: rgba(0,0,0,0.3);
      .progress{
        background: #ffcd32;
        height: 100%;
        position: absolute;
      }

    }
  .progress-btn{
    width: 30px;
    height: 30px;
    position: absolute;
    display:flex;
    align-items:center;
    justify-content:center;
    top:0px;
    left:-8px;
  .inner{
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border: 3px solid #fff;
    background: #ffcd32;
    border-radius: 50%;

  }
  }
  }
</style>