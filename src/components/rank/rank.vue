<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="scroll">
      <ul>
        <li v-for="item in topList" class="item" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <ul class="song-list">
            <li  class="song" v-for="(song,index) in item.songList">
              <span>{{index+1}} {{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getTopList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'
  export default {
    mixins:[playlistMixin],
    components:{
      Loading,Scroll
    },
    created() {
    this._getTopList()
    },
  data() {
    return {
      topList: []
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })

      this.setTopList(item)
    },
    ...mapMutations({
      setTopList:'SET_TOP_LIST'
    })
  },
  }
</script>
<style scoped lang="scss">
  .rank{
    position: fixed;
    width: 100%;
    top: 88px;

    bottom: 0;
    .toplist{
      height: 100%;
      overflow: hidden;

      .item{
        margin: 0 20px;
        padding-bottom:20px;
        display: flex;
        height: 100px;
        .song-list{
          display: flex;
          flex: 1;
          padding: 0 20px;
          font-size: 12px;
          height: 100px;
          overflow: hidden;
          background: #333;
          color: rgba(255,255,255,0.3);
          flex-direction: column;
          justify-content: center;
          .song{
            line-height: 26px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
  }

</style>