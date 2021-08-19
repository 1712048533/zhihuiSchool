<template>
    <view class="self-view">  
        <view class="self-view_info">
            <view class="self_view_info_top">
                <view>
                    <image class="user_avatar" :class="{user_avatar_radius:$store.getters.getAvatarRaduis}" @click="$refs.popup.open()" 
                        src="/static/user_info/default_tx.png" mode="widthFix"/>
                </view>
                <view class="nickName word-overflow">凌寒天</view>
                <view class="mySaying word-overflow">这个人很懒，什么也没留下</view>
            </view>
        </view>
        <view class="self-view_common">
            <view class="self-view_common_top">
                <view class="self-view_common_top_top">
                    <view class="self-view_common_item">
                        <view class="common_name">待办事项</view>
                        <view class="common_img_box">
                            <image class="common_img" src="/static/image/db_img.png" mode="widthFix"/>
                            <view class="common_badge">
                                <uni-badge
                                    :text="25"
                                    type="success"
                                />
                            </view>
                        </view>             
                    </view>
                     <view class="self-view_common_item">
                        <view class="common_name">信息箱</view>
                        <view class="common_img_box">
                            <image class="common_img" src="/static/image/xx_img.png" mode="widthFix"/>
                        </view>             
                    </view>
                     <view class="self-view_common_item">
                        <view class="common_name">考勤记录</view>
                        <view class="common_img_box">
                            <image class="common_img" src="/static/image/kq_img.png" mode="widthFix"/>
                        </view>             
                    </view>
                     <view class="self-view_common_item">
                        <view class="common_name">历史事项</view>
                        <view class="common_img_box">
                            <image class="common_img" src="/static/image/ls_img.png" mode="widthFix"/>
                        </view>             
                    </view>
                </view>
                
                <view class="self-view_common_top_bottom">
                    <uni-notice-bar
                        text="各位校友你们好，防范疫情，从你我做起，尽量少外出，不到人员聚集的地方，不传谣，不信谣！"
                        :speed="80"
                        color="#df5a9b"
                        background-color="#fff"
                        single
                        scrollable
                        showIcon
                    />
                </view>
            </view>
            <view class="self-view_common_bottom">
                <uni-list>
                    <uni-list-item
                        title="帮助"
                        :showArrow="true"
                        :showExtraIcon="true"
                        :extraIcon="{color:'#6fb2ee',size:'22',type:'help'}"
                    >	
                    </uni-list-item>

                    <uni-list-item
                        title="反馈"
                        :showArrow="true"
                        :showExtraIcon="true"
                        :extraIcon="{color:'#6fb2ee',size:'22',type:'paperplane'}"
                    >	
                    </uni-list-item>

                    <uni-list-item
                        title="设置"
                        :showExtraIcon="true"
                        :extraIcon="{color:'#6fb2ee',size:'22',type:'gear'}"
                        link to = '/pages/setting/setting'
                    >	
                    </uni-list-item>

                    <uni-list-item
                        title="关于"
                        :showArrow="true"
                        :showExtraIcon="true"
                        :extraIcon="{color:'#6fb2ee',size:'22',type:'info'}"
                    >	
                    </uni-list-item>

                    <uni-list-item
                        title="账号安全"
                        :showArrow="true"
                        :showExtraIcon="true"
                        :extraIcon="{color:'#6fb2ee',size:'22',type:'locked'}"
                    >	
                    </uni-list-item>
			    </uni-list>
                 
            </view>
            <uni-popup
                ref="popup"
                type="top"
                background-color="#fff"
            >
                <view class="popup_content">
                    <view class="popup_item" @click="popupEventHandler('selfInfo')">查看我的信息</view>
                    <view class="popup_item" @click="popupEventHandler('selfAvatar')">更换头像</view>
                </view>
            </uni-popup>
        </view>
    </view>
</template>

<script>
    export default {
        data(){
            return{
                a:1
            }
        },
        methods: {
            switchChange(){

            },
            onClick(a,b){

            },
            login(){
                uni.showModal({
                    title: '提示',
                    content: '确认要登陆吗',
                    showCancel: true,
                    success: ({ confirm, cancel }) => {
                        if(confirm === true){
                            uni.navigateTo({ url: '/pages/login/login' })
                        }else{
                            uni.showToast({
                                title: '你取消了登陆',
                                icon: 'none',
                                mask: true
                            })
                        }
                    }
                })
            },

            /**该页面应该按照要求传输照片的url给self_img页面 */
            popupEventHandler(id){
                switch (id) {
                    case 'selfInfo':
                        uni.navigateTo({ url: '/pages/self_info/self_info?a=1' })
                        break;
                    case 'selfAvatar':
                        uni.navigateTo({ url: '/pages/self_img/self_img?imgUrl='+'/static/user_info/default_tx.png' })
                        break;
                    default:
                        break;
                }
                this.$refs.popup.close();
            },
        }
    }
</script>

<style>
    .testBtn{
        background:url(/static/image/gs_default.png) no-repeat 0 0;
        width: 6em;
        height: 2em;
        background-color: transparent;
        border-style: none;
    }
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
        background: url(https://gitee.com/charon-cc/picture/raw/master/res/self_bg_img.png) no-repeat 0 0;
        background-size: cover;
        filter: blur(8rpx);
        -webkit-filter: blur(8rpx);
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
    }
    .user_avatar_radius{
        border-radius: 50%;
    }
    .user_avatar:hover{
        cursor: pointer;
    }
    .nickName{
        width: 300rpx;
        text-align: center;
    }
    .mySaying{
        width: 350rpx;
        font-size: 28rpx;
        text-align: center;
    }

    .self-view_common{
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .self-view_common_top{
        width: 93%;
        background-color:#fff;
        position: absolute;
        left: calc(7% / 2);
        top: -90rpx;
        border-radius: 20rpx;
        box-shadow: 5rpx 10rpx 25rpx 2rpx #b0b1b3;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
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
        position: relative;
    }
    .common_badge{
        position: absolute;
        right: -25rpx;
        top: -35rpx;
    }
    .common_name{
        font-weight:600;
        margin-bottom: 20rpx;
        font-size: 27rpx;
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
        position: relative;
        border-top: 1px solid #c3c3c3;
    }
    .common_tip{
        color: #929191;
        margin-right: 10rpx;
    }

    .self-view_common_bottom{
        margin-top: 220rpx;
        width: 100%;
    }

    
</style>