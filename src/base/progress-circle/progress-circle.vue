<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle r="50" cx="50" cy="50" fill="transparent" class="progress-background"></circle>
      <circle r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset" class="progress-bar"></circle>
    </svg>
    <slot></slot>
  </div>
</template>
<!--stroke-dasharray:描边距离-->
<script type="text/ecmascript-6">

  export default {
    props:{
      radius:{
        type:Number,
        default:100
      },
      percent:{

      }
    },
    data(){
      return {
        dashArray:Math.PI*100
      }
    },
  computed:{
    dashOffset:function(){
      return (1-this.percent)*this.dashArray
    }
  }
  }
</script>
<style lang="scss">
  .progress-circle {
    position: relative;
    circle{
      stroke-width: 8px;
      transform-origin: center;
  &.progress-background{
     transform: scale(0.9);
     stroke:rgba(255,205,49,0.5);
   }
      &.progress-bar{
    transform: scale(0.9) rotate(-90deg);
        stroke:#ffcd32;
      }
    }
  }
</style>