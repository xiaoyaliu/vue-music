<template>
  <div class="search-box">
    <div class="box-wrapper">
      <i class="icon-search"></i>
      <input type="text" :placeholder="placeholder" v-model="query" class="box">
      <i class="icon-dismiss" @click="clear" v-show="query"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">


  export default {
    props:{
      placeholder:{
        type:String,
        default:'搜索歌曲、歌手'
      }
    },
    data(){
       return {
         query:''
       }
    },
  methods:{
    setQuery(query) {
      this.query = query
    },
    clear(){
      this.query='';
    }
  },
  created(){
    this.$watch('query',(newQuery)=>{
      this.$emit('query',newQuery)
    })
  }
  }
</script>
<style scoped lang="scss">
  .search-box{
    margin: 20px;
  .box-wrapper{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 6px;
    height: 40px;
    border-radius: 4px;
    background: #333;
  .icon-search{
    font-size: 24px;
    color: #222;
  }
  .box{
    display: block;
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    font-size: 13px;
    color: #ffffff;
    background: #333;
    -webkit-appearance: none;
  }
  .icon-dismiss{
    font-size: 16px;
    color: #222;
  }
  }
  }
</style>