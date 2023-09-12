<template>
	<view class="content">
		<image :src="couponDetail.couponIocn" mode="widthFix"></image>
		<view class="coupon"
			:style="{backgroundImage: 'url('+imageURL+')', 'background-repeat':'no-repeat', backgroundSize:'100% 100%'}">
			<view class="coupon-left">
				<view class="price">￥{{couponDetail.couponDenomination}}</view>
				<view class="couponType">
					<view class="couponName">{{couponDetail.couponName}}</view>
					<view class="full-reduction">满{{couponDetail.howMuchFullMoney}}可用</view>
					<view class="instructions">
						<view class="instructions-left" v-if="couponDetail.goodsType==1" >全部商品可用</view>
						<view class="instructions-left" v-else-if="couponDetail.goodsType==2" >指定商品可用</view>
					</view>
				</view>
			</view>
			<view class="coupon-right" >
				<view v-if="statue==='true'"  style="color: #aaaaaa;" >已领取</view>
			 	<view  v-else  @click="getCoupon()" >点击领取</view>
			</view>
		</view>
		<view class="note">
			<view class="note-title">注意事项</view>
			<view class="note-text" >
				<view class="instructions-right" v-if="couponDetail.timeType==2" >1.领取{{couponDetail.timeDay}}天内使用有效；</view>
				<view class="instructions-right" v-else-if="couponDetail.timeType==1" >
				1.{{timestampToTime2(couponDetail.startTime)}}-{{timestampToTime2(couponDetail.endTime)}}使用有效；
				</view>
				<view class="instructions-right">
					2.每人最多领取{{couponDetail.maxNumber}}张。
				</view>
			</view>
		</view>
		<view class="recommend-box" v-if="goodsList.length>0" >
			<view class="goods-block" v-for="(item,index) in goodsList" :key="index" @click="Topath('/pages/index/detail?id='+item.id)">
				<view class="goods-box">
					<image class="goods-img" :src="item.previewUrl" mode="aspectFill"></image>
					<view class="goods-name">
						{{item.goodsName}}
					</view>
					<view class="goods-price">
						<view class="price">
							<view class="price-left">
								<text>￥</text>
								<text class="price-text">{{item.goodsPrice}}</text>
							</view>
							<view class="price-right">
								<text>￥</text>
								<text>{{item.scribePrice}}</text>
							</view>
						</view>
					</view>
					<view class="month_sales">
						销量:{{item.totalSales}}
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
				businessId:uni.getStorageSync('__ddminiStoreInfo'),
				imageURL:'',
				top: 0,
				id:'',
				couponDetail:'',
				goodsList:[],
				statue:false,
				orderPage: {
					page: 1,
					sizes: 10,
					total: 0
				},
			}
		},
		onLoad(e){
			let self=this;
			self.id=e.id;
			self.statue=e.statue;
			self.getcouponDetail();
			self.getcouponGoodsList();
			self.gethomeInfo();
		},
		onShow(){
			
		},
		onPageScroll(e) {
			this.$refs.VT.topData(e.scrollTop);
		},
		methods:{
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			timestampToTime2(timestamp) {
				let self = this;
				let date = new Date(timestamp)
				let Y = date.getFullYear() + '-'
				let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
				let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
				let H = date.getHours() + ':'
				let M2 = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
				let S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
				return Y + M + D + H + M2 
				// self.creatOrderTime=Y + M + D + H + M2 + S
			},
			getcouponDetail(){
				let self=this;
				self.Get('/api/plugs/searchPlugsCouponsById',{id:self.id}).then(res=>{
					if(res.code=200){
						self.couponDetail=res.body;
					}
				})
			},
			getcouponGoodsList(){
				let self=this;
				self.Get('/api/plugs/getCouponsGoodsList',{couponsId:self.id}).then(res=>{
					if(res.code=200){
						self.goodsList=res.body;
					}
				})
			},
			getCoupon(){
				let self=this;
				let token = uni.getStorageSync('__ddminiUserInfo').accessToken;
				if(token){
					self.Post('/api/plugs/receiveCoupons',{couponsId:self.id}).then(res=>{
						if(res.code==200){
							uni.showToast({
								icon:'none',
								title:'领取成功'
							})
							self.getcouponList();
						}else{
							uni.showToast({
								icon:'none',
								title:res.msg
							})
						}
					})
				}else{
					uni.showModal({
						title: '提示',
						content: '您还未登录,登录才能领取哦!',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									url:'/pages/user/login'
								})
							} else if (res.cancel) {
							}
						}
					});
				}
			},
			getcouponList(){
				let self=this;
				let postdata={
					businessId:self.businessId.businessId,
					pageNum:self.orderPage.page,
					pageSize:self.orderPage.sizes
				}
				self.Get('/api/plugs/searchPlugsCouponsByBusinessId',postdata).then(res=>{
					if(res.code==200){
						self.couponList=res.body.list;
						console.log(self.couponList,'88888888877777');
					}
				})
			},
			gethomeInfo() {
				let self = this;
				// console.log(self.businessId,'businessIdbusinessIdbusinessId')
				self.Get(`/api/plugs/getApplicationPlugsRecommendedList?businessId=${self.businessId.businessId}&userServiceToken=NIIWOD4RU1B1KLEBAV9TX`).then(res => {
					if (res.code == 200) {
						let list = res.body;
						self.homeAdList = list.filter(itm => itm.type === 'couBgc');
						self.imageURL=self.homeAdList[0].activityImgUrl;
						console.log(self.imageURL,'99999999999999')
					}
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.coupon{
		margin:20rpx auto;
		width: 94%;
		box-sizing: border-box;
		padding: 0 46rpx 0 50rpx;
		height: 160rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #fff;
		.coupon-left{
			display: flex;
			align-items: center;
			.couponType{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}
			.price{
				font-size: 40rpx;
				font-weight: 600;
				margin-right: 20rpx;
			}
			.couponName{
				font-weight: bold;
			}
			.full-reduction{
				font-size: 26rpx;
				margin: 14rpx 0;
			}
			.instructions{
				display: flex;
				font-size: 20rpx;
				.instructions-left{
					margin-right: 20rpx;
				}
			}
		}
	}
	.note{
		width: 94%;
		margin:30rpx auto;
		color: #acacac;
		.note-title{
			margin-bottom: 20rpx;
		}
		.note-text{
			font-size:24rpx;
		}
	}
	.recommend-box {
		margin-top: 50rpx;
		width: 94%;
		margin: auto;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.goods-block {
			width: 48%;
		}
		
		.goods-box {
			width: 100%;
			height: 500rpx;
			border-radius: 16rpx;
			box-sizing: border-box;
			background-color: #fff;
			margin-bottom: 26rpx;
			box-shadow: 0px 0px 8px 0px rgba(207, 207, 207, 0.5);
		
			.goods-img {
				width: 100%;
				height: 310rpx;
				border-radius: 16rpx 16rpx 0 0;
			}
		
			.goods-name {
				width: 94%;
				margin: 10rpx auto;
				font-size: 28rpx;
				display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
				-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
				-webkit-line-clamp: 2;  //一个块元素显示的文本的行数
				overflow: hidden; //溢出隐藏
			}
		
			.goods-price {
				width: 94%;
				margin: auto;
				display: flex;
				align-items: center;
				justify-content: space-between;
		
				.price {
					color: #ff4544;
					display: flex;
					align-items: center;
					.price-text {
						font-size: 34rpx;
						font-weight: 600;
					}
					.price-right{
						margin-left: 12rpx;
						font-size: 26rpx !important;
						font-weight: 400 !important;
						color: #aaa;
						margin-left: 18rpx;
						text-decoration: line-through;
					}
				}
			}
			.month_sales{
				width: 94%;
				margin: auto;
				font-size: 22rpx;
				color: #aaa;
			}
		}
	}
</style>