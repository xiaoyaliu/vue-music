<template>
  <swiper :options="swiperOption" v-if="banners">
    <swiper-slide v-for="(banner,index) in banners" :key="index">
      <a :href="banner.linkUrl"> <img class="needsclick" :src="banner.picUrl" @load="loadImage"></a>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    name: 'swiperTop',
    components: {
      swiper,
      swiperSlide
    },
    data: function () {
      return {
        swiperOption: {
          autoplay: 5000,
          initialSlide: 0,
          loop: true,
          pagination: '.swiper-pagination',
          onSlideChangeEnd: function (swiper) {
          }
        }
      }
    },
    props: {
      banners:{
      }
    },
  methods:{
    loadImage(){
      this.$emit('loadImg');
    }
  }
  }

</script>
<style scoped>
  img{width: 100%;
    height: auto;
  }
</style>