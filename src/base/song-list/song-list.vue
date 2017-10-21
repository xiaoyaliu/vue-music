<template>
  <div class="song-list">
     <ul>
       <li @click="selectItem(song,index)" class="item" v-for="(song,index) in songs" >
          <div class="left" v-if="rank">
            <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
          </div>
          <div class="content">
            <h3 class="name">{{song.name}}</h3>
            <p class="desc">{{getDesc(song)}}</p>
          </div>
       </li>
     </ul>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    props: {
      songs: {
        type: Array,
        default: []
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      selectItem(item,index){
       this.$emit('select',item,index)
      },
      getDesc(song) {
       return `${song.singer}·${song.album}`
      },
      getRankCls(index) {
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return 'text'
        }
      },
      getRankText(index) {
        if (index > 2) {
          return index + 1
        }
      }
  }
  }
</script>
<style lang="scss" scoped>
  @import "~common/sass/mixin.scss";
  .item{
    display: flex;
    box-sizing: border-box;
    align-items: center;
    height: 64px;
    font-size: 14px;
    .content{
      line-height: 20px;
      flex: 1;
      overflow: hidden;
      .name,.desc{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .name{
        color: #fff;
      }
      .desc{
        margin-top: 4px;
        color: rgba(255,255,255,0.3);
      }
    }
    .left{
      width: 25px;
      margin-right: 30px;
      text-align: center;
      .icon{
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0{
         @include bg-image('first');
         }
        &.icon1{
         @include bg-image('second');
         }
        &.icon2{
         @include bg-image('third');
         }
      }
    .text{
      color: #ffcd32;
      font-size: 18px;
    }
    }
  }
</style>