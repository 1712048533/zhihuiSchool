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
                // 先请求后端获取access_token并缓存到本地
                this.__proto__.__proto__.commonApi.userLogin(
                    ()=>{ 
                        HWH5.hideLoading(); 
                        // 保存新到全局
                        this.$store.commit('getLoginUserInfo',this.__proto__.__proto__.commonApi.commonData.userInfo);
                        uni.switchTab({ url: '/pages/index/index' })
                    },
                    ()=>{ HWH5.hideLoading(); uni.navigateTo({ url: '/pages/login/login' })}
				)

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