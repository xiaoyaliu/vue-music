<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
  export default {
    components: {MusicList},
    data:function(){
      return{
        songs:[]
      }
    },
    computed:{
      title() {
         return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created(){
      this._getSingerDetail()
    },
    methods:{
      _getSingerDetail:function(){
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res)=>{
          if(res.code === ERR_OK){
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      _normalizeSongs:function(list){
        let ret=[];
       list.forEach((item)=>{
         let {musicData}=item;
         if(musicData.songid&&musicData.albummid){
           ret.push(createSong(musicData))
         }
       })
        return ret;
      }
    }
  }
</script>
<style scoped lang="scss">
  .slide-enter-active,.slide-leave-active{
    transition: all 0.3s;
  },
  .slide-enter,.slide-leave-to{
    transform: translate3d(100%,0,0);
  }
</style>