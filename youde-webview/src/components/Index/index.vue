<template>
  <div class="container">
     <scroll @scroll="scroll" class="scrollView" ref="scroll">
       <div>
         <div v-if="data.indexRollPic.length" class="slider-wrapper" ref="sliderWrapper">
           <slider>
             <div v-for="item in data.indexRollPic">
               <a>
                 <img class="needsclick" @load="loadImage" :src="item.img">
               </a>
             </div>
           </slider>
         </div>
         <nav class="nav">
           <div>
             <image src="h"/>
             <span>药师咨询</span>
           </div>
           <div>
             <image src=""/>
             <span>全球购</span>
           </div>
           <div>
             <image src=""/>
             <span>物流查询</span>
           </div>
           <div>
             <image src=""/>
             <span>更多</span>
           </div>
         </nav>

       </div>

     </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from '@/base/scroll/scroll'
  import Slider from '@/base/slider/slider'
  import {getData} from '@/api/index'
  import data from '@/json/index'
  export default {
    data:function(){
      return {
        data:data
      }
    },
    components:{Scroll,Slider},
    created:function(){
      this._initData()
    },
    methods:{
      scroll(){

     },
    loadImage() {
      if (!this.checkloaded) {
        this.checkloaded = true
        this.$refs.scroll.refresh()
      }
    },
    _initData:function(){
      getData().then((res)=>{
        console.log(222222)
        console.log(res)
      })
    }
  }
  }
</script>
<style scoped>
</style>