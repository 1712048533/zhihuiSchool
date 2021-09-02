<template>
    <view class="work_list-view">

    </view>
</template>

<script>
    export default {
        data(){
            return{
                workList:[],
                // 其他页面跳转到该页面所携带的参数
                pageParams:{
                    roomId:'',
                    start:0,
                    pageSize:20
                }
            }
        },
        
        onLoad(options) {
            console.log(options);
        }
    }   
</script>

<style>

</style>