<template>
    <view>
        <button @click="login">登陆</button>
    </view>
</template>

<script>
import dayjs from 'dayjs';
export default {
    data() {
        return {
        }
    },
    methods:{
        login(){

            // 先请求后端获取access_token并缓存到本地
            this.__proto__.__proto__.commonApi.cus_getAccessToken({url:'weLink/getAccessToken'},()=>{
                HWH5.getStorage({ 
                    key: 'access_token', 
                    isolation: 0 
                }).then(data => {
                    var access_token = this.__proto__.__proto__.commonApi.commonData.access_token
                    if(data['access_token']!=null){
                        // 保存token,代码此时是老用户，直接更新信息
                        HWH5.setStorage({
                            key: 'access_token',
                            data: {access_token:access_token},
                            isolation: 0 
                        }).catch(error => {
                            console.log('设置缓存异常', error);
                        });
                        // 请求数据
                        HWH5.getAuthCode().then(data => {
                            console.log('用户免登返回结果',data); 
                            console.log(access_token,data.code);
                            this.__proto__.__proto__.commonApi.cus_request({url:'user/login',
                                                                            data:{
                                                                                access_token:access_token,
                                                                                code:data.code
                                                                            }}).then(user=>{
                                                                                console.log(user);
                                                                            }).catch(err=>{
                                                                                console.log('请求用户信息错误',err);
                                                                        })

                        }).catch((error) => {
                            console.log(error);
                        });
                    }else{
                        HWH5.setStorage({
                          key: 'access_token',
                          data: {access_token:access_token},
                          isolation: 0 
                        }).catch((error) => {
                          console.log('设置缓存异常', error);
                        });
                    }
                }).catch((error) => {
                    console.log('获取缓存异常', error);
                });
            });
            
        }
    }
}
</script>