<template>
  <transition name="slide">
   <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'
import {createSong} from 'common/js/song'
  export default {
    components: {MusicList},
    computed:{
      title(){
        return this.disc.songListDesc
      },
      bgImage(){
         return this.disc.picUrl
       },
      ...mapGetters([
          'disc'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    methods:{
      _getSongList() {
        if (!this.disc.id) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.$route.params.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.id && musicData.album.id) {
            let songData={
              songid:musicData.id,
              songmid: musicData.mid,
              singer: musicData.singer,
              songname: musicData.name,
              albumname: musicData.album.name,
              interval: musicData.interval,
              albummid:musicData.album.mid
            }
            ret.push(createSong(songData))
          }
        })
        return ret
      }
    }
  }
</script>
<style lang="scss">
  .slide-enter-active,.slide-leave-active{
   transition: all 0.3s;
  }
  .slide-enter,.slide-leave-to{
    transform: translate3d(-100%,0,0);
  }
</style>