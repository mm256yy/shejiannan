<template>
	<view class="content">
		<view class="head_box box_shadow">
			<view class="label" :class="{alabel: orderActive===item.id}" v-for="(item, index) in list1" :key="index"
				@click="selectMenuTap(item.id)">
				<view class="tit" :style="{borderColor: orderActive===item.id?'#fdd000':'#fff'}">{{item.name}}</view>
			</view>
		</view>
		<view class="couponList" style="margin-top: 20rpx;" >
			<view class="couponBox" v-for="item in couponList" :key="item.id" >
				<view class="couponBox-left">
					<view style="width: 100%;" >
						<view class="limituse" v-if="item.plugsCoupons.goodsType==1" >全部商品可用</view>
						<view class="limituse" v-else-if="item.plugsCoupons.goodsType==2" >指定商品可用</view>
					</view>
					<view>
						<view class="couponMoney" v-if="item.couponType==0" > <text style="font-size: 28rpx;">￥</text> {{item.plugsCoupons.couponDenomination}} </view>
						<view class="couponMoney" v-else-if="item.couponType==2" >  {{item.plugsCoupons.couponDenomination}}<text style="font-size: 28rpx;">积分</text></view>
						<view class="couponMoney" v-else-if="item.couponType==3" >  {{item.plugsCoupons.couponDenomination*10}} <text style="font-size: 28rpx;">折</text></view>
					</view>
					<view>
						<view class="couponType" v-if="item.plugsCoupons.couponType==0" >满减券</view>
						<view class="couponType" v-else-if="item.plugsCoupons.couponType==2" >积分券</view>
						<view class="couponType" v-else-if="item.plugsCoupons.couponType==3" >折扣券</view>
					</view>
				</view>
				<view class="couponBox-right">
					<view class="couponName">
						<view class="couponName-left">【{{item.couponName}}】</view>
						<view>
							<view class="couponName-right" v-if="item.couponType==0" >满{{item.plugsCoupons.howMuchFullMoney}}减{{item.plugsCoupons.couponDenomination}}</view>
							<view class="couponName-right" v-if="item.couponType==2" >{{item.plugsCoupons.couponDenomination}}积分</view>
							<view class="couponName-right" v-if="item.couponType==3" >{{item.plugsCoupons.couponDenomination*10}}折</view>
						</view>
						
					</view>
					<view class="">
						<view class="limitTime" v-if="item.plugsCoupons.timeType==1" >{{item.plugsCoupons.startTime}}~{{item.plugsCoupons.endTime}}</view>
						<view class="limitTime" v-else-if="item.plugsCoupons.timeType==2">领取后{{item.plugsCoupons.timeDay}}天内有效</view>
					</view>
					<view class="couponExplain">
						<view class="couponExplain-left">有效期内使用</view>
						<view>
							<view class="couponExplain-right" v-if="item.status==0 && item.plugsCoupons.goodsType==1" @click="toIndex">去使用</view>
							<view class="couponExplain-right" v-if="item.status==0 && item.plugsCoupons.goodsType==2" @click="Topath(`/pages/coupon/coupondetail?id=${item.couponId}&statue=${item.plugsCoupons.receiveStatus}`)" >去使用</view>
							<view class="couponExplain-right" v-else-if="item.status==2" >已使用</view>
							<view class="couponExplain-right" v-else-if="item.status==3" >已过期</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="none_list_box" v-if="couponList.length===0">
			<image src="../../static/images/none_data_icon_02.png" lazy-load="true" mode="widthFix"></image>
			<span>暂无优惠券</span>
		</view>
		<backtop ref="VT" :scrollTop="top"></backtop>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				businessId:uni.getStorageSync('__ddminiStoreInfo').businessId,
				list1: [{
					name: '未使用',
					id:0
				}, {
					name: '已使用',
					id:1
				}, {
					name: '已过期',
					id:2
				}],
				orderActive: 0,
				couponList:[],
				top:0
			}
		},
		onLoad() {
			let self=this;
			self.getcouponList();
		},
		onShow() {

		},
		onPageScroll(e) {
			this.$refs.VT.topData(e.scrollTop);
		},
		methods: {
			toIndex(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			selectMenuTap(id) {
				let self = this;
				self.orderActive = id;
				self.getcouponList();
			},
			getcouponList(){
				let self=this;
				let curt=self.orderActive;
				let postdata={
					businessId:self.businessId,
					status:0
				}
				if(curt===0){
					postdata.status=0;
				}else if(curt===1){
					postdata.status=1;
				}else if(curt===2){
					postdata.status=2;
				}
				self.Get('/api/plugs/searchPlugsCouponsByUserId',postdata).then(res=>{
					if(res.code==200){
						self.couponList=res.body.list;
						// console.log(self.couponList,'用户优惠券列表')
					}
				})
			},
		}
	}
</script>

<style lang="less">
	.content{
		padding-bottom: 20rpx;
	}
	page{
		background-color: #fff;
	}
	
	.head_box {
		display: flex;
		align-items: center;
		height: 120rpx;
		background-color: #fff;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 100;
		border-bottom: 3rpx solid #f5f5f5;
		.label {
			flex: 1;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
	
			.tit {
				color: #666;
				transition: all 0.2s;
				padding-top: 6rpx;
				border-bottom: 3px solid transparent;
				padding-bottom: 10rpx;
				font-size: 30rpx;
			}
		}
	
		.alabel {
			.tit {
				color: #1c1c1c;
				font-weight: bold;
				border-color: #00d389;
			}
		}
	}
	.couponBox{
		width: 94%;
		height: 180rpx;
		margin: auto;
		margin-bottom: 20rpx;
		// border-radius: 8rpx;
		display: flex;
		border: 3rpx solid #e6b4b6;
		.couponBox-left{
			width: 180rpx;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			padding-bottom: 20rpx;
			border-right: 3rpx solid #f5f5f5;
			.limituse{
				width: 100%;
				text-align: center;
				padding: 6rpx 0;
				font-size: 24rpx;
				background-color: #fad8d8;
				color:#d75057;
			}
			.couponMoney{
				color: #d75057;
				font-weight: 600;
				font-size: 42rpx;
			}
		}
		.couponBox-right{
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-around;
			// align-items: center;
			padding: 16rpx 26rpx;
			box-sizing: border-box;
			.couponName{
				display: flex;
				font-weight: bold;
			}
			.limitTime{
				font-size: 24rpx;
				color: #aaa;
			}
			.couponExplain{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.couponExplain-right{
					width: 160rpx;
					height: 60rpx;
					border-radius: 40rpx;
					text-align: center;
					line-height: 60rpx;
					background-color: #fad8d8;
					color: #d8696f;
				}
			}
		}
	}
</style>
