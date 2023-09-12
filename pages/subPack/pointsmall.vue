<template>
	<view class="content">
		<view class="point-top" :style="{backgroundImage: 'url('+BgcImg+')', 'background-repeat':'no-repeat', backgroundSize:'100% 100%'}">
			<view class="my-point">
				<text class="point-title">我的积分</text>
				<text class="expiration-date">(有效期:2023年5月15日)</text>
			</view>
			<view class="point">
				{{integral}}
			</view>
			<view class="point-record">
				<view class="point-record-left" style="margin-right: 20rpx;" @click="Topath('/pages/subPack/pointrecord')" >
					<text>积分记录</text>
					<u-icon name="arrow-right" color="#726a51" size="16"></u-icon>
				</view>
				<!-- <view class="point-record-left">
					<text>积分规则</text>
					<u-icon name="arrow-right" color="#726a51" size="16"></u-icon>
				</view> -->
			</view>
		</view>
		<view class="point-block">
			<view class="point-box" v-for="item in pointGoodsList" :key="item.id" @click="Topath('/pages/index/pointdetail?id='+item.id)" >
				<image class="pointImg" lazy-load="true" :src="item.previewUrl" mode="aspectFill"></image>
				<view class="point-box-right">
					<view class="">
						<!-- <view class="pointsName">五月新甜品</view> -->
						<view class="point-explain">{{item.goodsName}}</view>
					</view>
					<view class="point-exchange">
						<view class="point-exchange-left">
							<text class="totalPoint">{{item.goodsPrice}}</text> 
							<text class="exchange-text">积分</text>
						</view>
						<view class="exchangeBtn">
							兑换
						</view>
					</view>
				</view>
			</view>
		</view>
		<backtop ref="VT" :scrollTop="top"></backtop>
	</view>
</template>
<script>
	const app = getApp();
	export default{
		data(){
			return{
				businessId:uni.getStorageSync('__ddminiStoreInfo').businessId,
				BgcImg:'',
				top:0,
				orderPage: {
					page: 1,
					sizes: 10,
					total: 0
				},
				pointGoodsList:[],
				adminiUserInfos:'',
				integral:0
			}
		},
		onLoad() {
			let self=this;
			self.orderPage.page = 1;
			self.pointGoodsList = [];
			self.getgoodsList();
			self.gethomeInfo()
		},
		onShow() {
			let self = this;
			self.adminiUserInfos = uni.getStorageSync('__ddminiUserInfo');
			self.getInfo()
			// self.orderPage.page = 1;
			// self.pointGoodsList = [];
			// self.getgoodsList();
		},
		onReachBottom() {
			let self = this;
			if (self.orderPage.total > self.orderPage.page) {
				self.orderPage.page++;
				self.getgoodsList();
			}
		},
		onPageScroll(e) {
			this.$refs.VT.topData(e.scrollTop)
		},
		methods:{
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			getInfo() {
				let self = this;
				let id = self.adminiUserInfos.id
				self.Get('/api/user/searchUserInfoById', {
					userId: id
				}).then(res => {
					if (res.code == 200) {
						self.userInfo = res.body;
						self.integral=res.body.integral;
						console.log(self.userInfo.integral,'877775555555')
						console.log(self.userInfo,'888888888888');
					}
				})
			},
			gethomeInfo() {
				let self = this
				self.Get(`/api/plugs/getApplicationPlugsRecommendedList?businessId=${self.businessId}&userServiceToken=NIIWOD4RU1B1KLEBAV9TX`).then(res => {
					if (res.code == 200) {
						let data = res.body;
						let list = data.filter(itm => itm.type === 'pointOne');
						self.BgcImg=list[0].activityImgUrl;
					}
				})
			},
			getgoodsList(){
				let self=this;
				let postdata={
					businessId:self.businessId,
					page:self.orderPage.page
				}
				self.Get('/api/plugs/getIntegralGoodsList',postdata).then(res=>{
					if(res.code==200){
						let datas = res.body;
						uni.hideLoading();
						console.log(res,'订单')
						// self.orderList = data.list;
						self.orderPage.total=datas.pages;
						let data=res.body.list;
						if(self.pointGoodsList.length>0){
							let list = self.pointGoodsList.concat(data);
							self.pointGoodsList = list;
						}else{
							self.pointGoodsList = data;
						}
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.point-top{
		width: 94%;
		height: 340rpx;
		margin: 20rpx auto;
		border-radius: 16rpx;
		box-sizing: border-box;
		padding:28rpx 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.my-point{
			display: flex;
			align-items: center;
			.point-title{
				font-size: 30rpx;
				font-weight: bold;
				margin-right: 16rpx;
			}
		}
		.point{
			font-size: 46rpx;
			font-weight: 600;
		}
		.point-record{
			display: flex;
			align-items: center;
			.point-record-left{
				display: flex;
				align-items: center;
				font-size: 26rpx;
			}
		}
	}
	.point-box{
		width: 94%;
		padding: 24rpx;
		box-sizing: border-box;
		margin: auto;
		margin-bottom: 20rpx;
		border-radius: 16rpx;
		background-color: #fff;
		box-shadow: 0px 0px 16rpx 0px rgba(207, 207, 207, 0.5);
		display: flex;
		align-items: center;
		.pointImg{
			width: 240rpx;
			height: 180rpx;
			border-radius: 16rpx;
			margin-right: 20rpx;
		}
		.point-box-right{
			display: flex;
			flex-direction: column;
			height: 180rpx;
			width: 60%;
			justify-content: space-between;
			box-sizing: border-box;
			// flex: 1;
			.pointsName{
				font-weight: bold;
				font-size: 28rpx;
			}
			.point-explain{
				margin-top: 12rpx;
				display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
				-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
				-webkit-line-clamp: 2;  //一个块元素显示的文本的行数
				overflow: hidden; //溢出隐藏
				// white-space: nowrap;
				// overflow: hidden;
				// text-overflow: ellipsis;
				font-size: 28rpx;
				// color:#9d9d9d;
			}
			.point-exchange{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.point-exchange-left{
					.totalPoint{
						font-size: 42rpx;
						font-weight: 600;
						color: #da3137;
					}
					.exchange-text{
						font-size: 26rpx;
						margin-left: 10rpx;
					}
				}
				.exchangeBtn{
					background-color: #df282f;
					color: #fff;
					font-size: 26rpx;
					// text-align: center;
					border-radius: 40rpx;
					padding: 8rpx 48rpx;
				}
			}
		}
	}
</style>