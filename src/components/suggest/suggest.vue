<template>
    <scroll ref="suggest"
            class="suggest"
              :data="result">
      <ul class="suggest-list">
        <li class="suggest-item" v-for="item in result">
          <div class="icon" >
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name">
            <p class="text" v-html="getDisplayName(item)"></p>
          </div>
        </li>
      </ul>
    </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  const TYPE_SINGER = 'singer'

  export default {
    components:{Scroll},
    props:{
      query:{
        type:String,
        default:''
      },
      showSinger:{
        type:Boolean,
        default:true
      }
    },
    data(){
       return{
         page:1,
         result:[]
       }
    },
    methods:{
      search(){
          search(this.query,this.page,this.showSinger).then((res)=>{
            this.result = this._genResult(res.data)
            console.log(this.result)
          })
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      _genResult(data){
        console.log(data)
        let ret=[];
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    watch:{
      query(){
        this.search()
     }
    }
  }
</script>
<style scoped lang="scss">
  .suggest{
    height: 100%;
    overflow: hidden;
    .suggest-list{
      padding: 0 30px;
      .suggest-item{
        display: flex;
        align-items: center;
        padding-bottom: 20px;
      .icon{
         flex: 0 0 30px;
         width: 30px;
        i{
          font-size: 14px;
          color: rgba(255,255,255,0.3);
        }
         }
      .name{
        flex: 1;
        font-size: 14px;
        color: rgba(255,255,255,0.3);
        overflow: hidden;
        .text{
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      }
    }
  }
</style>