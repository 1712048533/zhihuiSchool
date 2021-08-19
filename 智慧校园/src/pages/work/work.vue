<template>
	<view class="work-view">
		<view v-show="isShowSearchView" class="bg_mask"></view>
		<view class="work-view_tabNav">
			<uni-search-bar
				@input="searchHandler($event,'input')"
				@cancel="searchHandler($event,'cancel')"
				@confirm="searchHandler($event,'confirm')"
				@focus="searchHandler($event,'focus')"
				v-model="searchText"
				:radius="30"
				placeholder="请输入会议ID、直播室ID"
			/>
		</view>
		<view v-show="isShowSearchView" class="history-view">
			<view class="history_top">
				<view class="history_top_tip">历史搜索({{historyArray.length}}条)</view>
				<view class="history_top_image" >
					<uni-icons
						type="trash"
						color="red" 
						@click="clearHistorySearch"
					/>
				</view>
			</view>
			<view class="history_content">
				<view class="history_content_item word-overflow" v-for="(item,index) in historyArray" :key="index">
					{{item}}
				</view>
			</view>
		</view>
		<view v-show="isShowResultView" class="result-view">
			<view class="result-view_tip">
				温馨提示: 搜索列表只展示搜索结果的前20条内容
			</view>
			<view class="result-view_content">
				<view class="result-view_item" v-for="item in resultArray" :key="item.sufflex_url">
					<uni-icons
						type="search"
						color="#72c2f0"
					/>
					<view class="result_text">
						<rich-text :nodes="item.text"></rich-text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShowSearchView:false,
				isShowResultView:false,
				searchText:'',
				resultArray: [{
								text:'奇怪',
								sufflex_url:'11'
							},
							{
								text:'奇',
								sufflex_url:'21'
							},
							{
								text:'乡下奇',
								sufflex_url:'32'
							},
							{
								text:'想笑',
								sufflex_url:'42'
							}
				],
				historyArray:[],
			}
		},
		onLoad() {
			//加载历史数据
			this.loadHistorySearch();
		},

		methods: {
			// 是否进入搜索模式，是就打开搜索页面
			showSearchView(){

			},
			searchHandler(e,type){
				this.searchText.trim();
				switch (type) {
					case 'focus':
						this.isShowResultView = false;
						this.isShowSearchView = true;
						break;
					case 'cancel':
						this.isShowSearchView = false;
						this.isShowResultView = false;
						this.searchText = '';
						break;
					case 'confirm':
						//开始搜索
						this.isShowSearchView = false;
						this.isShowResultView = true;
						if(this.searchText===''){
							uni.showModal({title: '温馨提示',content: '搜索字段不能为空',showCancel: false});return;
						}
						break;
					case 'input':
						//监听输入的信息，开始进行ajax请求,只实现前缀查询
						this.searchByText()
						break;

				}
				
			},

			// 根据搜索回来结果值进行相关逻辑处理,三种状态、输入中、默认搜索、历史搜索
			searchByText(type,data){
				
				switch (type) {
					case 'input':
						var mid_array = this.resultArray;
						mid_array.forEach((item,index)=>{
							if(item.text.includes(this.searchText)){
								item.text = this.join(item.text,this.searchText)
							}
						});
						this.resultArray = mid_array;
						break;
					case 'confirm':
						
						this.saveHistorySearch(this.searchText);
						break;
					case 'history':

						break;
					default: break;
				}
			},

			// 输入内容并按下搜索键的调用方法，包括对历史搜索重点击的回调
			searchByText(text){
				
				this.showSearchView = false;
				this.isShowResultView = true;
				
				//记录历史搜索
				
				//跳转详情页面

			},

			updateResultArray(type,text){
				this.searchText = text?text.trim():this.searchText;
				//更新数组数据
				this.ajaxRequest().then(data=>{
					console.log('搜索成功',data);
					// data数据下发
					this.searchByText(type,data);
				}).catch(err=>{
					HWH5.showToast({ msg: '网络异常', type: 'w' });
				})
			},

			ajaxRequest(){
				return new Promise((resolve,reject)=>{
					HWH5.showLoading();
					uni.request({
						url: 'http://localhost:8080/searchContent',
						data: {
							searchContent:this.searchText,
							start:1,
							pageSize:20
						},
						header: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'X-Requested-With': 'XMLHttpRequest'
						},
						method: 'POST',
						success: ({ data, statusCode, header }) => {
							console.log('搜索结果成功',data);
							resolve(data);
						},
						fail: (error) => {
							reject(error);
						},
						complete:res=>[
							uni,hideLoading()
						]
					})
				})
			},

			join(str,key){
				var reg = new RegExp((`(${key})`), "gm");
				var replace = '<span style="color:red">$1</span>';
				return str.replace(reg, replace);
			},
			//缓存历史搜索
			saveHistorySearch(text){
				// 超出最大存储限制
				if(this.historyArray.length>20){
					this.historyArray.pop();
				}
				//判断是否是已经存在的数据
				let newRes = this.historyArray.findIndex(item => text === item)
				if(newRes!=-1) this.historyArray.splice(newRes,1);
				
				this.historyArray.unshift(text);
				HWH5.setStorage({
				  	key: 'history_search_array',
				  	data: {history_search_array:this.historyArray},
				  	isolation: 0 
				}).catch((error) => {
				  	console.log('设置缓存异常', error);
				});
			},
			//加载历史缓存
			loadHistorySearch(){
				HWH5.getStorage({ 
				 	key: 'history_search_array', 
				 	isolation: 0
				}).then((data) => {
				  	this.historyArray = data.history_search_array?data.history_search_array:this.historyArray;
				}).catch((error) => {
				  	console.log('获取缓存异常', error);
				});
			},
			//清空所有历史记录缓存
			clearHistorySearch(){
				//提示是否清空
				uni.showModal({
					title: '温馨提示',
					content: '是否清空所有历史搜索记录',
					showCancel: true,
					success: ({ confirm, cancel }) => {
						if(confirm){
							this.historyArray = [];
							HWH5.removeStorage({ 
							  	key: 'history_search_array', 
							  	isolation: 0 
							}).then((data) => { 
								uni.showModal({title: '温馨提示',content: '已清空所有历史记录',showCancel: false});
							}).catch((error) => {
							  	console.log('删除缓存失败', error);
							});
						}else if(cancel){

						}
					}
				})
			}
		}
	}
</script>

<style>
	.result-view{
		width: 100%;
		display: -webkit-flex;
		flex-direction: column;
		align-items: center;
	}

	.result-view_tip{
		width: 100%;
		font-size: 28rpx;
		text-align: center;
		padding:  10rpx 0 20rpx 0;
		margin-bottom: 30rpx;
		border-bottom: 1rpx solid rgba(0, 195, 255, 0.473);
	}

	.result-view_content{
		width: 95%;
	}

	.result-view_item{
		width: 100%;
		display: -webkit-flex;
		align-items: center;
		padding: 10rpx 0;
		border-bottom: 1rpx solid #e4e0e0;
		margin-bottom: 20rpx;
	}
	.result-view_item:hover{
		cursor: pointer;
	}
	.result_text{
		margin-left: 20rpx;
		font-size: 30rpx;
		font-weight: lighter;
	}
	.history-view{
		display: -webkit-flex;
		flex-direction: column;
		align-items: center;
	}
	.history_top{
		width: 100%;
		display: -webkit-flex;
		justify-content: space-between;
		align-items: center;
	}
	.history_top_image{
		margin-right: 30rpx;
	}
	.history_top_tip{
		margin-left: 30rpx;
		font-size: 30rpx;
	}
	.history_top_image:hover{
		cursor: pointer;
	}
	.history_content{
		width: 95%;
		display: -webkit-flex;
		-webkit-flex-wrap: wrap;
	}
	/* 超出一行长度追加省略号 */
	.history_content_item{
		margin-top: 20rpx;
		padding: 15rpx;
		background-color: #dfdfdf;
		font-weight: lighter;
		font-size: 28rpx;
		border-radius: 999999px;
		margin-right: 40rpx;
	}
</style>