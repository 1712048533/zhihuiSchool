/**
 * 封装一些比较常用的方法
 */
const BASE_URL = "http://localhost:8081/"

export default{

    commonData:{
        access_token:"",
        // 是否登陆过小程序
        isHaveLoginHistory:false,
        // 存储用户信息
        userInfo:{}
    },

    /**
     * 
     * @param {封装Request函数} options，指定request的后缀URL、请求参数，请求类型(url, daat, method)
     * @returns 
     */
    cus_request(options){
        return new Promise((resolve,reject)=>{
            uni.request({
                url: BASE_URL+options.url,
                data: !options.data?{}:options.data,
                header: {
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                method: "POST",
                success: res => {
                    resolve(res);
                },
                fail: error => {
                    console.log("请求URL = "+BASE_URL+options.url+" 出现了问题");
                    console.log(error);
                    reject(error);
                }
            })
        });
    },

    /**
     * 向后端发起请求获取access_token
     * @param {参数列表对象} options 
     * @param {下一步执行的函数} nextFunction 
     */
    cus_getAccessToken(options,nextFunction){
        this.cus_request(options)
        .then(res=>{
            // 判断获取的是否是正常的token
            console.log("请求"+BASE_URL+options.url+"结果 == ",res);
            if(res.data.data!=''){
                this.commonData.access_token = res.data.data;
            }
            if(nextFunction!=null){
                nextFunction();
            } 
        },err=>{
            console.log("出错了！！",err);
        })
    },

    /**
     * 刷新token
     * @param {下一步执行的函数} nextFunction 
     */
    async cus_flushAccessToken(nextFunction){
        this.commonData.isHaveLoginHistory = true;
        console.log('刷新token成功！！！');
        await this.cus_getAccessToken({url:'weLink/getAccessToken'},()=>{
            HWH5.setStorage({
                key: 'access_token',
                data: {access_token:this.commonData.access_token},
                isolation: 0 
            }).catch((error) => {
                console.log('设置缓存异常', error);
            });
            if(nextFunction!=null) nextFunction();
        });
    },

    /**
     * 用户登陆
     */
    userLogin(successFunction,errorFunction){
        HWH5.showLoading();
        // 先请求后端获取access_token并缓存到本地
        this.cus_flushAccessToken(()=>{
            var access_token = this.commonData.access_token
            // 携带token，直接去请求数据请求数据并将数据保存到vuex里面
            HWH5.getAuthCode().then(data => {
                //设置options数据
                var options = {
                    url:'user/login',
                    data:{
                        access_token:access_token,
                        code:data.code
                    }
                }
                this.cus_request(options)
                    .then(user=>{
                        console.log(JSON.parse(user.data)['data']);
                        // 判断信息是否合法
                        var userInfo = JSON.parse(user.data)['data'];
                        if(userInfo.isActivated == null){
                            HWH5.showToast({ msg: '登陆异常，请检查网络', type: 'w' });
                            if(errorFunction!=null)
                                errorFunction();
                            return;
                        }
                        else if(userInfo.isActivated===0){
                            HWH5.showToast({ msg: '该账号未在WeLink客户端激活', type: 'w' });
                        }
                        //存储用户信息到commonData
                        this.commonData.userInfo = JSON.parse(user.data)['data'];
                        if(successFunction!=null)
                            successFunction();

                    }).catch(err=>{
                        console.log('请求用户信息错误',err);
                    })

            }).catch((error) => {
                console.log(error);
            });
        });
    }

}
