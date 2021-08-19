<template>
    <view class="custom-card">
        <view class="custom-card_top">
            <view class="time_tag">{{date}}</view>
        </view>
        <view class="custom-card_bottom">
            <view class="img_tag">
                <image
                    :src="img_url"
                    mode="center"
                    :fade-show="true"
                    :lazy-load="true"
                    :draggable="false"
                />
            </view>
            <view class="name_tag">{{title}}</view>
        </view>
    </view>
</template>

<script>
export default {
    name:'uniCustomCard',
    props:['title','date','content','img_url'],
    data(){
        return{
            
        }
    }
}
</script>

<style>
    .custom-card{
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-bottom: 20rpx;
        margin-bottom: 30rpx;
        border-bottom: 1rpx solid #e4e1e1;
    }
    .time_tag{
        font-size: 30rpx;
        color: #696666;
        margin-bottom: 30rpx;
    }
    .img_tag>image{
        border-radius: 25rpx;
        height: 350rpx;
    }
    .custom-card_bottom{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .name_tag{
        font-size: 30rpx;
        color: #0498ee;
    }
</style>