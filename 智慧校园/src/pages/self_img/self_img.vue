<template>
    <view class="img-view">
        <view class="atatar_img_box" @click="preViewImg">
            <image
                :src="imgUrl"
                mode="widthFix"
            />
        </view>
        <view class="msg_tip">PS: 你可以点击上方的照片进行预览</view>
        <view class="operation_content">
            <button @click="chooseAvatarImg('local')">方式一：选择本地图片</button>
            <button @click="chooseAvatarImg('camera')">方式二：摄像机拍摄</button>
            <view class="customImg">
                <view class="customImg_tip">方式三：自定义网络图片URL</view>
                <input class="cutomImg_input" type="text" placeholder="如 http://www.xxx.com/x.png" v-model="customImgUrl"/>
            </view>
            <button type="primary" @click="submitFile">提交</button>
        </view>
    </view>
</template>

<script>
    export default {
        onLoad(options) {
            this.imgUrl = options.imgUrl;
        },
        data(){
            return{
                imgUrl:'',
                customImgUrl:''
            }
        },
        methods:{
            /**
             * 预览照片,照片的URL必须是网络路径，不然预览照片会显示错误！！！
             */
            preViewImg(){
                console.log(this.imgUrl);
                HWH5.previewImage({
                    index:'0',
                    imageArray: JSON.stringify(this.imgUrl),
                    watermark: false
                }).catch((error) => {
                    console.log(error)
                    uni.showToast({
                        title: '预览照片失败',
                        icon: 'error',
                        mask: false
                    })
                });
            },
            /**
             * 检查图片是否合法
             */
             // 判断图片是否存在 有效返回true, 无效返回false,采用promise调用是为了后面更好的链式返回数据
            isImgUrlValid(imgPath) {
                return new Promise((resolve, reject) => {
                    const ImgObj = new Image(); 
                    ImgObj.src = imgPath;
                    ImgObj.onload = (res) => {
                        resolve(res);
                    };
                    ImgObj.onerror = (err) => {
                        reject(err);
                    };
                });
            },

            /**
             * 选择照片，有相机、本地图片、填写网络地址 这三种方式
             */
            chooseAvatarImg(type){
                if(type === 'local'){
                    HWH5.chooseImage({
                        flag: 1,
                        imagePickerMode: 'IMAGE',
                        maxSelectedCount: 1,
                        showOrigin: true,
                        btntxtEN: 'Done',
                        btntxtCN: '完成',
                        compress: '1'
                    }).then((data) => {
                        if(data.length!=1) return;
                        this.imgUrl = data[0]
                        //调用上传图片的函数
                    }).catch((error) => {
                        uni.showToast({
                            title: '未知错误',
                            icon: 'error',
                            mask: false
                        })
                    });
                }else if(type === 'camera'){
                    HWH5.chooseImage({
                        flag: 2,
                        showShadow: '0'
                    }).then((data) => {
                        console.log('拍照成功',data);
                        if(data.length!=1) return;
                        this.imgUrl = data[0]
                        console.log(this.imgUrl);
                    }).catch((error) => {
                        console.log('拍照异常', error);
                    });
                }
                
            },

            /**
             * 上传新的头像路径到后端
             */
            uploadImgFile(){
                HWH5.uploadFile({
                    serverUrl: 'http://example.com/uploadFile',
                    filePath: '/downloads/xxxx.asr',
                    name: file,
                    headers: {'X-HIC-info': {'appId':com.xxx.xxx,'appName':xxxxxx,'userId':xxx}},
                    formData: { 'capKey': 'xxxxxx.xxxxxx', 'audioFormat': 'pcm16k16bit' },
                    timeout: 6000
                }).then((data) => {
                    console.log(data);
                }).catch((error) => {
                    console.log('文档上传异常', error);
                });
            },


            /**
             * 提交最终的照片文件信息
             */
            submitFile(){
                if(this.customImgUrl.trim().length>0){
                    this.isImgUrlValid(this.customImgUrl)
                    .then(res=>{
                        //优先上传网络图片
                        this.imgUrl = this.customImgUrl
                    }).catch(err=>{
                        uni.showModal({
                            title: '温馨提示',
                            content: '你选择的方式三所输入的图片网址错误，可能图片已经被删除或者图片网址不正确，请仔细检查',
                            showCancel: false,
                            success: ({ confirm, cancel }) => {}
                        })
                    })
                }else{

                }
            },
        }
    }
</script>

<style>
    .atatar_img_box{
        background-color: #000;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
    }
    .atatar_img_box:hover{
        cursor: pointer;
    }
    .atatar_img_box>image{
        width: 250rpx;
    }
    .msg_tip{
        width: 100%;
        text-align: center;
        border-bottom: 1rpx solid #c3c3c3;
        color: #fd8f00;
        font-size: 28rpx;
        padding: 20rpx 0;
        margin-bottom: 50rpx;
    }
    .operation_content>button{
        margin-top: 40rpx;
    }
    .customImg{
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 50rpx 0;
    }
    .customImg_tip{
        margin-bottom: 20rpx;
    }
    .cutomImg_input{
        width: 95%;
        height: 80rpx;
        font-size: 35rpx;
        border: 1px solid #0265fa;
    }
</style>