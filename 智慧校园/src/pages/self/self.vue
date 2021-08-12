<template>
    <view class="self-view">  
        <view class="self-view_info">
            <view class="self_view_info_top">
                <view><img class="user_avatar" src="/static/user_info/default_tx.png"/></view>
                <view class="nickName word-overflow">凌寒天111111111111111111111111111111111</view>
                <view class="mySaying word-overflow">这个人很懒，什么也没留下</view>
            </view>
        </view>
        <view class="self-view_common">
            <view class="self-view_common_bottom">
                <uni-list>
                    <uni-list-item title="标签1"></uni-list-item>
                    <uni-list-item title="列表右侧显示 switch"  :show-switch="true"  @switchChange="switchChange" ></uni-list-item>
                    <uni-list-item  title="列表右侧显示角标" :show-badge="true" badge-text="12" ></uni-list-item>
                    <uni-list-item title="默认 navigateTo 方式跳转页面" link to="/pages/test/test" @click="onClick($event,1)" ></uni-list-item>
                </uni-list>
                 
            </view>
            <view class="self-view_common_top">
                <view class="self-view_common_top_top">
                    <view class="self-view_common_item">
                        <view class="common_name">功能1</view>
                        <view class="common_img_box">
                            <img class="common_img" src="/static/image/gs_default.png"/>
                        </view>             
                    </view>
                     <view class="self-view_common_item">
                        <view class="common_name">功能1</view>
                        <view class="common_img_box">
                            <img class="common_img" src="/static/image/gs_default.png"/>
                        </view>             
                    </view>
                     <view class="self-view_common_item">
                        <view class="common_name">功能1</view>
                        <view class="common_img_box">
                            <img class="common_img" src="/static/image/gs_default.png"/>
                        </view>             
                    </view>
                     <view class="self-view_common_item">
                        <view class="common_name">功能1</view>
                        <view class="common_img_box">
                            <img class="common_img" src="/static/image/gs_default.png"/>
                        </view>             
                    </view>
                     <view class="self-view_common_item">
                        <view class="common_name">功能1</view>
                        <view class="common_img_box">
                            <img class="common_img" src="/static/image/gs_default.png"/>
                        </view>             
                    </view>
                     <view class="self-view_common_item">
                        <view class="common_name">功能1</view>
                        <view class="common_img_box">
                            <img class="common_img" src="/static/image/gs_default.png"/>
                        </view>             
                    </view>
                </view>
                
                <view class="self-view_common_top_bottom">
                    <view class="common_tip">这是一个TIP</view>
                    <uni-icons
                        type="circle-filled"
                        color="orange"
                    />
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        methods: {
            switchChange(){

            },
            onClick(a,b){

            }
        }
    }
</script>

<style>
    .self-view_info{
        width: 100vw;
        height: 40vh;
        position: relative;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
    }
    .self-view_info::before{
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: -1;
        background: url(/static/bg_image/self_bg_img.png) no-repeat;
        background-size: cover;
        filter: blur(10rpx);
        -webkit-filter: blur(10rpx);
    }
    .self_view_info_top{
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        color: white;
    }
    .user_avatar{
        width: 150rpx;
        border-radius: 50%;
    }
    .nickName{
        width: 300rpx;
    }
    .mySaying{
        width: 350rpx;
        font-size: 28rpx;
    }

    .self-view_common{
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .self-view_common_top{
        width: 91%;
        background-color:#fff;
        position: absolute;
        left: calc(9% / 2);
        top: -60rpx;
        border-radius: 20rpx;
        box-shadow: 5rpx 10rpx 25rpx 2rpx #b0b1b3;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        z-index: -1;
    }
    .self-view_common_top_top{
        width: 95%;
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 20rpx;
    }
    .self-view_common_item{
        width: 22%;
        margin-top: 30rpx;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
    }
    .self-view_common_item:hover{
        cursor: pointer;
    }
    .self-view_common_item:not(:nth-child(4n + 1)){ 
        margin-left: calc(12% / 3);
    }
    .common_img_box{
        width: 40%;
    }
    .common_name{
        font-weight:600;
        margin-bottom: 20rpx;
        font-size: 28rpx;
    }
    .common_img{
        width: 100%;
    }
    .self-view_common_top_bottom{
        width: 100%;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
        font-size: 30rpx;
        padding: 20rpx;
        position: relative;
        border-top: 1px solid #c3c3c3;
    }
    .common_tip{
        color: #c3c3c3;
        margin-right: 10rpx;
    }

    .self-view_common_bottom{
        margin-top: 450rpx;
        width: 100%;
    }

    .word-overflow{
        white-space: nowrap;
        overflow: hidden;
        word-break: keep-all;
        text-overflow: ellipsis;
        -webkit-text-overflow: ellipsis;
    }

    uni-list-item{
        
    }

</style>