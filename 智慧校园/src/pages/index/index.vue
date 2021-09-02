<template>
	<view class="content">
		<uni-customCard title="温州大学计算机与人工智能学院" date="昨天 14:30" content="" img_url="https://gitee.com/charon-cc/picture/raw/master/res/self_bg_img.png"/>
		<uni-customCard title="温州大学计算机与人工智能学院" date="昨天 14:30" content="" img_url="https://gitee.com/charon-cc/picture/raw/master/res/self_bg_img.png"/>
		<uni-customCard title="温州大学计算机与人工智能学院" date="昨天 14:30" content="" img_url="https://gitee.com/charon-cc/picture/raw/master/res/self_bg_img.png"/>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			//判断是否已经完成登陆
			this.isLogin();
		},
		methods: {
			isLogin(){
				HWH5.getStorage({ 
				 key: 'access_token', 
				}).then((data) => {
					if(!data || !data['access_token']){
						uni.navigateTo({ url: '/pages/login/login' })
					}else{
						if(this.__proto__.__proto__.commonApi.commonData.userInfo['isActivited'])
							return;
						this.__proto__.__proto__.commonApi.userLogin(
							()=>{ HWH5.hideLoading();},
							()=>{ HWH5.hideLoading();uni.navigateTo({ url: '/pages/login/login' })}
						)
					}
				})
			}
		}
	}
</script>

<style>

</style>
