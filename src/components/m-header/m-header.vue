<template>
  <div class="wrapper">
     <div class="logo"></div>
     <h1 class="text">Chicken Music</h1>
    <div class="mine">
      <i class="icon-mine"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    name: 'app',
    components: {}
  }
</script>
<style scoped lang="scss">

  @import "~common/sass/mixin.scss";
  .wrapper {
    position: relative;
    text-align: center;
    height:44px;
    font-size:0px;
      .logo {
        @include bg-image('logo');
        display:inline-block;
        margin-top:6px;
        width:30px;
        height:32px;
        background-size:30px 32px;
        margin-right:8px;
        vertical-align:top;
      }
       .text {
         line-height: 44px;;
        display:inline-block;
        vertical-align:top;
        font-size:18px;
        color:#ffcd32;
       }
       .mine{
         position: absolute;
         top: 0px;
         right: 0px;
         .icon-mine{
           font-size: 20px;
           color: #ffcd32;
           padding: 12px;
           display: block;
         }
       }
  }
</style>
