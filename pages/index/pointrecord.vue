<template>
	<view class="content">
		<view class="" v-for="item in dataArray" :key="item.id" >
			<view class="chargeBox" style="margin-bottom: 20rpx;">
				<view class="Time" style="margin-bottom: 16rpx;">
					<text>积分使用:</text>
					<text style="color: #aaa;">{{item.showTxt}}</text>
				</view>
				<view class="Time">
					<text>积分消耗:</text>
					<!-- <text style="color: #e74133; font-weight: bold;font-size: 24rpx;">￥</text> -->
					<text v-if="item.adds==0" style="color: #e74133; font-weight: 600;font-size: 30rpx;">+{{item.integral}}</text>
					<text v-if="item.adds==1" style="color: #e74133; font-weight: 600;font-size: 30rpx;">-{{item.integral}}</text>
				</view>
			</view>
		</view>
		<view class="none_list_box" v-if="dataArray.length===0">
			<image src="../../static/images/none_data_icon_01.png" lazy-load="true" mode="widthFix"></image>
			<span>暂无积分记录</span>
		</view>
		<backtop ref="VT" :scrollTop="top"></backtop>
	</view>
</template>

<script>
	const app = getApp();
	export default{
		data(){
			return{
				orderPage: {
					page: 1,
					sizes: 10,
					total: 0
				},
				dataArray:[],
				top:0
			}
		},
		onLoad() {
			
		},
		onShow() {
			let self=this;
			self.orderPage.page = 1;
			self.dataArray=[];
			self.getrecord();
		},
		onPageScroll(e) {
			this.$refs.VT.topData(e.scrollTop)
		},
		onReachBottom() {
			let self = this;
			if(self.orderPage.total>self.orderPage.page){
				self.orderPage.page++;
				self.getrecord();
			}
		},
		methods:{
			getrecord(){
				let self=this;
				let postdata={
					page:1
				}
				self.Get('/api/plugs/getUserIntegralRecordList',postdata).then(res=>{
					if(res.code==200){
						console.log(res,'123125555')
						self.orderPage.total = res.body.pages;
						let data = res.body.list;
						if(self.dataArray.length>0){
							let list = self.dataArray.concat(data);
							self.dataArray = list;
						}else{
							self.dataArray = data;
						}
						console.log(self.dataArray,'11111111')
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page{
		background-color: #fff;
	}
	.content{
		padding-top: 20rpx;
	}
	.chargeBox{
		width: 92%;
		margin: auto;
		border-radius: 16rpx;
		padding: 30rpx;
		box-sizing: border-box;
		box-shadow: 0px 0px 16rpx 0px rgba(207, 207, 207, 0.5);
	}
</style>