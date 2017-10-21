<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      title() {
         return this.topList.topTitle
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
      },
       ...mapGetters([
            'topList'
       ])
    },
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
          if(!this.topList.id){
            this.$router.push('/rank')
            return
          }
        getMusicList(this.topList.id).then((res)=>{
          if(res.code === ERR_OK){
            this.songs = this.__normalizeSongs(res.songlist)
          }
        })

      },
      __normalizeSongs(list) {
         let ret=[];
        list.forEach((item)=>{
          if(item.data.songid && item.data.albummid){
            ret.push(createSong(item.data))
          }
        })
        return ret;
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="scss">
  .slide-enter-active, .slide-leave-active{
    transition: all 0.3s ease;
  }


  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }

</style>