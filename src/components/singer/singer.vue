<template>
  <div class="singers" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import ListView from './list-view'
import {mapMutations} from 'vuex';
import {playlistMixin} from 'common/js/mixin'
const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'

  export default {
    mixins:[playlistMixin],
    components:{ListView},
    data:function(){
      return {
        singers:[]
      }
    },
    created:function(){
      this._getSingerList();
    },
    methods:{
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
     },
      selectSinger:function(singer){

        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _getSingerList:function(){
        getSingerList().then((res)=>{
          if(res.code===ERR_OK){
            this.singers=this._normalizeSinger(res.data.list);
          }
        })
      },
      _normalizeSinger:function(list){
        let map={
          hot:{
            title:HOT_NAME,
            item:[]
          }
        }
         list.forEach((item,index)=>{
           if(index<HOT_SINGER_LEN){
             map.hot.item.push(new Singer({
               name: item.Fsinger_name,
               id: item.Fsinger_mid
             }))
           }
           const key=item.Findex;
           if(!map[key]){
             map[key]={
               title:key,
               item:[]
             }
           }
           map[key].item.push(
                     new Singer({
                       name: item.Fsinger_name,
                       id: item.Fsinger_mid
                     }))
         })
        //排序
        let ret = []
        let hot=[];
        hot.push(map.hot)
        for(let key in map){
          let val = map[key]
          if(val.title.match(/[a-zA-z]/)) {
            ret.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)

      },
        ...mapMutations({
                  setSinger:'SET_SINGER'
         })
    }
  }
</script>
<style scoped lang="scss">
  .singers{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom:0;
  }
</style>
