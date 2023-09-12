<template>
	<view class="content">
		<view class="couponActive common">
			<view class="couponActive-left">
				优惠活动
			</view>
			<view class="couponActive-right" @click="Topath('/pages/coupon/mycoupon')" >
				<text class="mycoupon">我的优惠券</text>
				<u-icon name="arrow-right" color="#6d6d6d" size="18"></u-icon>
			</view>
		</view>
		<view class="coupon common">
			<view class="couponBox" v-for="item in couponList" :key="item.id" @click="Topath(`/pages/coupon/coupondetail?id=${item.id}&statue=${item.receiveStatus}`)">
				<view class="coupon-title">{{item.couponName}}</view>
				<image style="border-radius: 16rpx;" :src="item.couponIocn" lazy-load :lazy-load-margin="0" mode="widthFix"></image>
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
				top: 0,
				couponList:[],
				orderPage: {
					page: 1,
					sizes: 10,
					total: 0
				},
			}
		},
		onLoad() {
			
		},
		onShow() {
			let self=this;
			self.getcouponList();
		},
		onPageScroll(e) {
			this.$refs.VT.topData(e.scrollTop)
		},
		onReachBottom() {
			let self = this;
			if (self.orderPage.total > self.orderPage.page) {
				self.orderPage.page++;
				self.getcouponList();
			}
		},
		methods: {
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			getcouponList(){
				let self=this;
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				let postdata={
					businessId:self.businessId,
					pageNum:self.orderPage.page,
					pageSize:self.orderPage.sizes
				}
				self.Get('/api/plugs/searchPlugsCouponsByBusinessId',postdata).then(res=>{
					if(res.code==200){
						uni.hideLoading()
						self.couponList=res.body.list;
						
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
	.common {
		width: 94%;
		margin: auto;
	}
	.couponActive{
		display: flex;
		justify-content: space-between;
		margin: 30rpx auto;
		align-items: center;
		.couponActive-left{
			font-weight: bold;
		}
		.couponActive-right{
			display: flex;
			align-items: center;
			color:#6d6d6d;
		}
	}
	.coupon{
		.couponBox{
			margin-bottom: 40rpx;
			.coupon-title{
				background-color: #e70013;
				font-size: 22rpx;
				width: 20%;
				text-align: center;
				color: #fff;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				padding: 4rpx 16rpx;
				border-radius: 10rpx;
				margin-bottom: 20rpx;
			}
		}
	}
</style>
