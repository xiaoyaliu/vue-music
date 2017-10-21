<template>
  <div class="search">
    <div class="search-box-wrapper" >
      <search-box @query="onQueryChange" ref="searchBox"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQuery(item.k)" class="hot-item" v-for="item in hotKey">
               {{item.k}}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="suggest-wrapper" v-show="query">
      <suggest :query="query"></suggest>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import Suggest from 'components/suggest/suggest'
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  export default {
    components: {SearchBox,Suggest},
    data() {
    return {
      hotKey: [],
      query:''
    }
  },
  computed:{

  },
    created(){
       this._getHotKey();
    },
    methods:{
      _getHotKey(){
        getHotKey().then((res)=>{
          if(res.code === ERR_OK){
            this.hotKey=res.data.hotkey.slice(0,10)
          }
        })
      },
      addQuery(query){
        this.$refs.searchBox.setQuery(query)
      },
      onQueryChange(query){
        this.query=query
      }
    }
  }
</script>
<style lang="scss">
  .search{
  .shortcut-wrapper{
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
  .shortcut{
    height: 100%;
    overflow: hidden;
  .hot-key{
    margin: 0 20px 20px 20px;
  .title{
    margin-bottom: 20px;
    font-size: 14px;
    color: rgba(255,255,255,0.5);
  }
  .hot-item {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 6px;
    background: #333;
    font-size: 14px;
    color: rgba(255,255,255,0.3);
  }
  }
  }
  }
  .suggest-wrapper{
    position: fixed;
    top: 172px ;
    bottom:0;
    width: 100%;
  }
  }

</style>
