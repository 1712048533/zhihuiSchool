<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
/* 所有的全局配置都配置在这里 */
	page{
		/* background-color: rgb(235, 232, 232); */
	}
	*{
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}
	/**字体超出长度省略号 */
	.word-overflow{
        white-space: nowrap;
        overflow: hidden;
        word-break: keep-all;
        text-overflow: ellipsis;
        -webkit-text-overflow: ellipsis;
    }
	/**全屏灰色背景 */
	.mask_bg{
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgb(238, 238, 238);
		width: 100vw;
		height: 100vh;
		z-index: -1;
	}
	/**表单按钮的样式 */
	.default_form_button{
		background-color:rgb(0, 102, 255);
		color: #FFF;
		border-radius: 30rpx;
		margin-top: 40rpx;
	}
	/**弹出层项样式 */
	.popup_item{
        width: 100%;
        text-align: center;
        font-size: 28rpx;
        margin-top: 20rpx;
        padding-bottom: 20rpx;
        border-bottom: 1rpx solid #c3c3c3;
    }
    .popup_item:last-child{
        border: none;
    }
    .popup_item:hover{
        cursor: pointer;
    }
</style>/
