/**
    记录具体的某个直播间/会议室的内容，是单个Vue组件
    本页面的难点在于需要时间检测数据库里面的时间，写好倒计时，实时响应（怎么做才能更高效）
 */
<template>
    <view class="work_content-view">
        <view class="work_content-view_top">
            <view class="top_img_box">
                <image :src="roomData.roomType===0?'/static/zb_logo.png':'/static/hy_logo.png'" mode="widthFix"/>
            </view>
            <view class="top_room_id word-overflow">{{roomData.roomId}}</view>
            <view class="top_creator_name word-overflow">{{roomData.creatorName}}</view>
        </view>
        <view class="work_content-view_mid">
            <view class="mid_start_time">{{roomData.startTime}}</view>
            <view class="mid_end_time">{{roomData.endTime}}</view>
            <view class="mid_create_time">{{roomData.createTime}}</view>
        </view>
        <view class="work_content-view_bottom">
            <view class="bottom_statu">活动{{roomData.statu===0?'未开始':roomData.statu===1?'进行中':roomData.statu===2?'已结束':'状态查询中...'}}</view>
            <view v-show="roomData.statu === 0" class="bottom_time_down">
                <uni-countdown
                    :day="sp_day"
                    :hour="sp_hour"
                    :minute="sp_minute"
                    :second="sp_s" 
                    showColon
                    backgroundColor="#1A73E8"
                    color="white"
                    @timeup="sendTip"
                />
            </view>
            <button class="bottom_button default_form_button" @click="joinRoom" >加入房间</button>
        </view>
        <view class="work_content-view_tip">
            <uni-popup
                ref="contentPopup"
                type="message"
            >
                <uni-popup-message
                    type="error"
                    :message="message"
                />
            </uni-popup>
        </view>
    </view>
</template>

<script>
import dayjs, { Dayjs } from 'dayjs';
export default {
    data(){
        return{
            roomId:'',
            sp_day:999,
            sp_hour:23,
            sp_minute:59,
            sp_s:59,
            roomData:{
                roomType:0,
                // -1 代表预处理
                statu:-1
            },
            message:''
        }
    },

    onLoad(options) {
        // 上一个页面携带roomId跳转到该页面
        if(options.roomId){
            this.roomId = options.roomId;  
            this.searchWorkRoom();  
        }
    },

    methods:{

        searchWorkRoom(){
            HWH5.showLoading();
            return new Promise((resolve,reject)=>{
                uni.request({
                    url: 'http://localhost:8081/findWorkById',
                    data: {
                        roomId:this.roomId
                    },
                    header: {
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                    method: 'POST',
                    success: ({ data, statusCode, header }) => {
                        // 进入到了这个页面，说明这个data值是肯定存在的，但是还是可能因为网络问题查询失败
                        // 可能直播间/会议室被删除
                        HWH5.hideLoading();
                        if(data === 'null'){
                            HWH5uni.showModal({
                                title: '温馨提示',
                                content: '该直播间/会议室因某些原因被删除',
                                showCancel: false,
                                success: ({ confirm, cancel }) => {
                                    if(confirm === true)
                                        uni.navigateBack({ delta: 1 })
                                }
                            })
                        }else{
                            this.roomData = JSON.parse(data);
                            this.roomData.startTime = dayjs(this.roomData.startTime).format('YYYY-MM-DD HH:mm:ss');
                            this.roomData.endTime = dayjs(this.roomData.endTime).format('YYYY-MM-DD HH:mm:ss');
                            this.roomData.createTime = dayjs(this.roomData.createTime).format('YYYY-MM-DD HH:mm:ss');
                            // 判断该会议室或者直播室处于什么状态 0：未开始、1：正在进行、2：已经结束
                            if(dayjs(this.roomData.startTime).diff(dayjs(),'minute')>0){
                                //未开始
                                this.roomData.statu = 0;
                                //设置倒计时
                                this.setCutDownTime();
                            }else if(dayjs(this.roomData.endTime).diff(dayjs(),'minute')<0){
                                //已结束
                                this.roomData.statu = 2;
                            }else{
                                //正在进行
                                this.roomData.statu = 1;
                            }
                            resolve(this.roomData);
                        }
                    },
                    fail: (error) => {
                        HWH5.hideLoading();
                        HWH5.showToast({ msg: '网路异常', type: 'w' });
                        reject(error);
                    }   
                })

            }).then(data=>{
                console.log(data);
                // 设置标题 
                HWH5.setNavigationBarTitle({ title: `${data.creatorName}创建的${data.roomType===0?'直播室':'会议室'}` }).catch((error) => {
                    console.log('设置标题异常',error);
                });
            }).catch(err=>{
                console.log(err);
            })
        },

        sendTip(){
            console.log('时间到了');
            //解决组件第一次动态赋值之后失效
            clearInterval(this.timer);
            this.$emit('timeup');
            //刷新当前页面
            location.reload();
        },

        setCutDownTime(){
            //设置倒计时时间
            const mid_date = dayjs(this.roomData.startTime);
            const now_date = dayjs(`${new Date()}`)
            const mid_day = mid_date.diff(now_date,"day");
            const mid_hour = mid_date.diff(now_date,"hour");
            const mid_minute = mid_date.diff(now_date,"minute");
            const mid_second = mid_date.diff(now_date,"second");
            this.sp_day = mid_day;
            this.sp_hour = mid_hour - mid_day * 24;
            this.sp_minute = mid_minute - mid_hour * 60; 
            this.sp_s = mid_second - mid_minute * 60; 
        },

        joinRoom(e){
            if(this.roomData.statu === 1){
                //执行跳转到相关直播/会议页面

                return;
            }
            if(this.roomData.statu === 0){
                this.message = `${this.roomData.roomType===0?'直播':'会议'}未开始`;
            }else if(this.roomData.statu === -1){
                this.message = "相关数据加载中，请稍后";
            }else if(this.roomData.statu === 2){
                this.message = `${this.roomData.roomType===0?'直播':'会议'}已结束`;
            }
            this.$refs.contentPopup.open();
        }
    }
}
</script>

<style>
    .work_content-view{
        width: 100%;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        align-items: center;
    }
    .work_content-view_top, .work_content-view_mid, .work_content-view_bottom{
        width: 95%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 40rpx;
    }
    .top_img_box{
        width: 150rpx;
        height: 150rpx;
        border-radius: 50%;
        box-shadow: 0rpx 0rpx 20rpx rgb(73, 219, 207);
        animation: img_box_shadow 2.5s ease-in-out 0s infinite;
        z-index: 10;
        background-color: #c3c3c3;
        overflow: hidden;
    }
    .top_img_box>image{
        width: 100%;
        z-index: 20;
    }
    .top_creator_name::before,.mid_start_time::before,.mid_end_time::before, .mid_create_time::before,.top_room_id::before{  
        text-align: center;
        font-size: 28rpx;
        color: #000;
        font-weight: lighter;
    }
    .top_creator_name::before { content: '创建者：'; }
    .top_room_id::before { content: '房间ID：'; }
    .top_creator_name,.top_room_id{
        width: 100%;
        text-align: center;

        margin-top: 10rpx;
    }
    .top_room_id{
        margin-top: 35rpx;
    }

    .work_content-view_mid{
        border: 3rpx solid rgba(194, 192, 192, 0.867);
        padding-top: 15rpx;
        border-radius: 25rpx;
    }

    .mid_start_time::before { content: '开始时间：'; }
    .mid_end_time::before { content: '结束时间：'; }
    .mid_create_time::before { content: '创建时间：'; }

    .mid_start_time{
        color: rgb(2, 245, 75);
        margin-bottom: 22rpx;
    }
    .mid_end_time{
        color: rgb(245, 51, 2);
        margin-bottom: 22rpx;
    }
    .mid_create_time{
        color: rgb(2, 79, 245);
        margin-bottom: 22rpx;
    }
    .bottom_statu{
        margin-bottom: 20rpx;
    }
    .bottom_time_down{
        transform: scale(1.2);
        -o-transform: scale(1.2);
        -ms-transform: scale(1.2);
    }
    .bottom_button{
        margin-top: 100rpx;
        width: 100%;
    }

    @keyframes img_box_shadow {
        0%{
            box-shadow: 0rpx 0rpx 10rpx rgb(4, 170, 199);
        }
        25%{
            box-shadow: 0rpx 0rpx 30rpx rgb(4, 111, 199);
        }
        50%{
            box-shadow: 0rpx 0rpx 50rpx rgb(4, 111, 199);
        }
        75%{
            box-shadow: 0rpx 0rpx 30rpx rgb(4, 111, 199);
        }
        100%{
            box-shadow: 0rpx 0rpx 10rpx rgb(4, 170, 199);
        }
    }
    @-webkit-keyframes img_box_shadow{
        0%{
            box-shadow: 0rpx 0rpx 10rpx rgb(4, 170, 199);
        }
        25%{
            box-shadow: 0rpx 0rpx 30rpx rgb(4, 111, 199);
        }
        50%{
            box-shadow: 0rpx 0rpx 50rpx rgb(4, 111, 199);
        }
        75%{
            box-shadow: 0rpx 0rpx 30rpx rgb(4, 111, 199);
        }
        100%{
            box-shadow: 0rpx 0rpx 10rpx rgb(4, 170, 199);
        }
    }
    @-moz-keyframes img_box_shadow{
        0%{
            box-shadow: 0rpx 0rpx 10rpx rgb(4, 170, 199);
        }
        25%{
            box-shadow: 0rpx 0rpx 30rpx rgb(4, 111, 199);
        }
        50%{
            box-shadow: 0rpx 0rpx 50rpx rgb(4, 111, 199);
        }
        75%{
            box-shadow: 0rpx 0rpx 30rpx rgb(4, 111, 199);
        }
        100%{
            box-shadow: 0rpx 0rpx 10rpx rgb(4, 170, 199);
        }
    }
    @-o-keyframes img_box_shadow{
        0%{
            box-shadow: 0rpx 0rpx 10rpx rgb(4, 170, 199);
        }
        25%{
            box-shadow: 0rpx 0rpx 30rpx rgb(4, 111, 199);
        }
        50%{
            box-shadow: 0rpx 0rpx 50rpx rgb(4, 111, 199);
        }
        75%{
            box-shadow: 0rpx 0rpx 30rpx rgb(4, 111, 199);
        }
        100%{
            box-shadow: 0rpx 0rpx 10rpx rgb(4, 170, 199);
        }
    }
</style>