<template>
	<view class="content">
		<image class="logo" src="/static/logo.png" />
		<view>
			<div class="title">{{title}}</div>
			<router-link to="/pages/self/self">跳转到列表页</router-link>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: 'Hello',
				butName: '跳转'
			}
		},
		onLoad() {

		},
		methods: {
			getList(e) {
				console.log(e)
				uni.navigateTo({
					url: '/pages/self/self'
				})
			}
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
	}
	.skip {
		margin-top: 20upx;
	}
</style>
