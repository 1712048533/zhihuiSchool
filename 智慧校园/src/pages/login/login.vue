<template>
    <view class="login-view">
        <view class="login-view_title">
            <view class="title">智慧校园</view>
        </view>
        <view class="login-view_form">
            <view class="login-view_form_top">
                <image class="login_img"
                    src="/static/logo.png"
                    mode="widthFix"
                />
                <view class="login_tip">检测到您未登录，只有授权登陆后才可以继续操作</view>
            </view>
            <button class="default_form_button" form-type="submit" @click="login">授权登陆</button>
        </view>
    </view>
</template>


<script>
export default {
    name:"Login",
        /**
         * 初始化数据函数里面先加载缓存，如果缓存里面的access_token存在而且还没有失效，则读取，并且跳出登陆页面。
         */
        onLoad(){
            HWH5.getStorage({ 
                key: 'user_login_data', 
                isolation: 1 
            }).then((data) => {
                console.log('获取缓存成功', data);
            }).catch((error) => {
                console.log('获取缓存异常', error);
            });
        },
        methods:{
            /**
             * 请求登陆函数，
             * author:ysj
             * date: 2021-8-13 17:21:45
             * method：POST
             * data：
             *      code：weLink官方提供的接口，便于用户的免登录验证
             * return data：
             *      用户返回的数据应该包括用户的所有信息、验证code是否正确，验证access_token并返回给前端
             *      后端返回登陆是否成功，加上isLoginOk字段，值为true或者false
             */
            login(){
                HWH5.showLoading();
                HWH5.getAuthCode().then(data => {
                    console.log('用户免登返回结果',data); 
                    if(!(data.code.trim())){
                        HWH5.showToast({ msg: '登陆异常，请重新进入小程序', type: 'w' });
                        HWH5.hideLoading();
                    }else{
                        this.requestData(data.code);
                    }

                }).catch((error) => {
                    console.log(error);
                    HWH5.hideLoading();
                    HWH5.showToast({ msg: '网络连接失败', type: 'w' });
                });
            },

            // 发送第一次请求，目的是拿到access_token缓存到本地


            requestData(code){

                uni.request({
                    url: 'http://localhost:8081/userLogin',
                    data: {
                        code:code
                    },
                    method: 'POST',
                    success: ({ data, statusCode, header }) => {
                        if(statusCode >= 200 && statusCode<300){
                            this.$store.dispatch('getLoginUserInfo',{...data})
                            HWH5.setStorage({
                              key: 'data_userInfo',
                              data: {...data},
                              isolation: 0 
                            }).catch((error) => {
                              console.log('设置缓存异常', error);
                              HWH5.showToast({ msg: '内存空间不足', type: 'w' });
                              return;
                            });
                            HWH5.showToast({ msg: '登陆成功', type: 'n' });
                            uni.switchTab({ url: '/pages/index/index' })
                        }else{
                            HWH5.showToast({ msg: '网络连接失败', type: 'w' });
                        }
                    },
                    fail: (error) => {
                        HWH5.showToast({ msg: '网络连接失败', type: 'w' });
                    },
                    complete:res=>{
                        HWH5.hideLoading();
                    }
                })
            }
        }
}
</script>

<style>
    .login-view{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
    .title{
        font-size: 60rpx;
        font-weight: bold;
    }
    .login-view_form{
        margin-top: 130rpx;
    }

    .login-view_form_top{
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .login_img{
        width: 150rpx;
        border-radius: 50%;
    }
    .login_tip{
        font-size: 28rpx;
        margin:50rpx 0 100rpx 0;
        color: #666666;
    }
</style>