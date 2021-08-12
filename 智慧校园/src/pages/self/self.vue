<template>
  <view>  
      <uni-icons
          type="pulldown"
          color="red"
      />
    <uni-list>
        <uni-list-item title="开启点击反馈" clickable  @click="onClick" ></uni-list-item>
        <uni-list-item title="开启点击反馈" show-badge="true" badge-text="22"></uni-list-item>
        <uni-list-item title="默认 navigateTo 方式跳转页面" link to="/pages/index/index" @click="onClick($event,1)" ></uni-list-item>
        <uni-list-item title="reLaunch 方式跳转页面" link="reLaunch" to="/pages/index/index" @click="onClick($event,1)" ></uni-list-item>
    </uni-list>
  </view>
</template>

<script>
    export default {
        methods:{
            onClick(a,b){
                console.log(a,b);
            }
        }
    }
</script>

<style>

</style>