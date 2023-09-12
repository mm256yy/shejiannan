<template>
	<view class="content">
		<view class="userInfo">
			<view class="userInfo-left">
				<view class="">
					<image class="userImg" v-if="userInfo==null" src="../../static/images/avatar.png" mode="aspectFill">
					</image>
					<image class="userImg" v-else :src="userInfo.headImg" mode="aspectFill"></image>
				</view>
				<view class="rightBox">
					<view>
						<view class="userName" v-if="userInfo==null">昵称</view>
						<view class="userName" v-else>{{userInfo.userName}}</view>
					</view>
					<view class="userMoney">余额: <text style="margin-left:10rpx;">{{balance}}元</text></view>
				</view>
			</view>
			<view class="userInfo-right" @click="Topath('/pages/subPack/rechargerecord')" >
				消费记录
			</view>
		</view>
		<view class="storeInfo">
			<view class="store">
				<view class="store-left" @click="Topath('/pages/subPack/store?id='+storeInfo.businessId)" >
					<view class="storeName">{{storeMsg.businessName}}</view>
					<view class="storeAddress">{{storeMsg.businessAddress.address}}</view>
				</view>
				<!-- <image class="storeImg" :src="storeMsg.businessLogo" mode="aspectFill"></image> -->
			</view>
			<view class="orderMoney">
				<view class="text">买单金额</view>
				<view class="other">
					<view class="title">￥</view>
					<input type="digit"  v-model="payMoney" placeholder="请询问店员后输入" />
					<view class="info">元</view>
				</view>
				<view class="">
					<view v-if="payMoney" style="background-color: #db4033;" class="button" @click="getPay()"  >确认付款</view>
					<view v-else class="button" @click="getPay()"  >确认付款</view>
				</view>
				
			</view>
		</view>
		<view class="Recharge">
			<text @click="Topath('/pages/subPack/membercz')">充值优惠</text>
		</view>
		<u-popup :show="show" :round="10" mode="center" @close="close" @open="open">
			<view class="popup">
				<text style="font-size: 30rpx;font-weight: bold;margin: 40rpx 0;" >请确认买单金额</text>
				<view class="" style="color: #999;display: flex;flex-direction: column;align-items: center;margin-bottom: 20rpx;font-size: 30rpx;" >
					<view >本次买单{{payMoney}}元</view>
					<view>还需微信支付{{needPay}}元</view>
				</view>
				
				<view class="btn">
					<text class="btn-lf btncommon" @click="show=false" >取消支付</text>
					<text class="btn-rt btncommon" @click="Paymoney()" >确认支付</text>
				</view>
			</view>
		</u-popup>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				adminiUserInfos: uni.getStorageSync('__ddminiUserInfo'),
				storeInfo: uni.getStorageSync('__ddminiStoreInfo'),
				openId: uni.getStorageSync('__ddminiUserOpenid'),
				userInfo: {},
				balance: 0,
				payMoney: '',
				needPay:0,
				storeMsg: {},
				show: false,
				
			}
		},
		onLoad() {

		},
		onShow() {
			this.getInfo();
			this.getStoreInfo();
			console.log(this.openId, '898用户44444444444')
		},
		methods: {
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			open() {
				
			},
			close() {
				this.show = false
			},
			getInfo() {
				let self = this;
				let id = self.adminiUserInfos.id
				self.Get('/api/user/searchUserInfoById', {
					userId: id
				}).then(res => {
					if (res.code == 200) {
						self.userInfo = res.body;
						self.balance = res.body.balance;
					}
				})
			},
			getStoreInfo() {
				this.Get(`/api/plugs/getBusinessInfoById?businessId=${this.storeInfo.businessId}`).then(res => {
					if (res.code == 200) {
						this.storeMsg = JSON.parse(res.body.jsonData);
					}
				})
			},
			getPay() {
				this.show=true;
				let Pay=0
				// JSON.parse(
				if(this.balance> this.payMoney ){
					Pay=0;
				}else{
					Pay=this.payMoney- this.balance;
				}
				this.needPay=Pay;
			},
			Paymoney(){
				if(this.needPay==0){
					this.Payorder()
				}else{
					this.getPaypalOrder()
				}
			},
			Payorder() {
				let self=this;
				let postData = {
					"client": "小程序",
					"openId": this.openId,
					"orderId": 0,
					"orderNo": "",
					"payMoney": this.payMoney,
					"payType": 3,
					"payWay": 5,
					"businessId":this.storeInfo.businessId
				}
				uni.showLoading({
					title: '支付准备中',
					mask: true
				});
				this.Post2('/api/pay/discountPurchaseOrder', postData).then(res => {
					if (res.code == 200) {
						uni.hideLoading();
						this.show=false;
						setTimeout(function() {
							uni.navigateTo({
								url: `/pages/order/paysuccess?money=${self.payMoney}`
							});
						}, 600);
					}else{
						uni.showModal({
							title: '支付失败',
							content: '订单支付失败，请重新进行支付。如对订单金额有疑问请联系客服人员',
							showCancel: false
						})
						return
					}
				})
			},
			getPaypalOrder() {
				let self = this;
				let postData = {
					"client": "小程序",
					"extParm": "",
					"openId": self.openId,
					"orderId": 0,
					"orderNo": 0,
					"payMoney": self.needPay,
					"payWay": 5,
					"payType":3,
					"businessId":this.storeInfo.businessId
				}
				uni.showLoading({
					title: '支付准备中',
					mask: true
				});
				self.Post2('/api/pay/appletsWechatOrderPay', postData).then(res => {
					if (res.code === 200) {
						self.payList = res.body;
						uni.hideLoading();
						self.time = Date.now();
						wx.requestPayment({
							'appId': self.payList.appid,
							'nonceStr': self.payList.noncestr,
							'package': self.payList.package,
							'signType': 'MD5',
							'timeStamp': self.payList.timestamp,
							'paySign': self.payList.sign,
							success: function(res) {
								this.show=false;
								uni.showToast({
									title: '微信支付成功'
								});
								setTimeout(function() {
									// let id = JSON.parse(JSON.stringify(self.orderInfo.id));
									uni.navigateTo({
										url: `/pages/order/paysuccess?money=${self.needPay}`
									});
								}, 600);
							},
							fail: function(err) {
								uni.showModal({
									title: '支付失败',
									content: '订单支付失败，请重新进行支付。如对订单金额有疑问请联系客服人员',
									showCancel: false
								})
								return
							}
						});
					} else {
						uni.hideLoading();
						uni.showModal({
							title: '支付失败',
							content: res.msg,
							showCancel: false
						})
					}
				})
			},

		}

	}
</script>

<style lang="less">
	.popup{
		width: 600rpx;
		border-radius: 16rpx;
		height: 400rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		.btn{
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 90rpx;
			border-top: 3rpx solid #f5f5f5;
			.btncommon{
				width: 50%;
				text-align: center;
				line-height: 87rpx;
				font-size: 30rpx;
				font-weight: bold;
			}
			.btn-lf{
				border-right: 3rpx solid #f5f5f5;
				color: #000;
			}
			.btn-rt{
				color: #e74032;
			}
		}
	}
	page {
		background-color: #e7e7e7;
	}

	.userInfo {
		width: 90%;
		padding: 16rpx;
		margin: 20rpx auto;
		box-sizing: border-box;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.userInfo-left {
			display: flex;
			align-items: center;

			.userName {
				font-size: 26rpx;
				font-weight: bold;
			}

			.userMoney {
				font-size: 22rpx;
				color: #aaa;
			}
		}

		.userImg {
			width: 70rpx;
			height: 70rpx;
			border-radius: 100%;
			margin-right: 16rpx;
		}

		.userInfo-right {
			font-size: 22rpx;
			color: #fdd000;
			text-align: center;
			padding: 8rpx;
			border: 3rpx solid #fdd000;
			border-radius: 40rpx;
		}
	}

	.storeInfo {
		width: 90%;
		margin: auto;
		background-color: #fff;

		.store {
			width: 100%;
			padding: 16rpx;
			box-sizing: border-box;
			background-color: #f5f5f5;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.storeName {
				font-size: 26rpx;
				font-weight: bold;
			}

			.storeAddress {
				font-size: 22rpx;
				color: #aaa;
			}

			.storeImg {
				width: 70rpx;
				height: 70rpx;
				border-radius: 100%;
			}
		}
	}

	.orderMoney {
		width: 100%;
		padding: 16rpx;
		box-sizing: border-box;

		.text {
			font-size: 24rpx;
			color: #aaa;
			margin: 30rpx 0;
		}

		.other {
			width: 96%;
			display: flex;
			border: 2rpx solid #efefef;
			height: 80rpx;
			align-items: center;
			margin: 0 auto;
			border-radius: 10rpx;

			.title {
				width: 120rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #1f1f1f;
				font-weight: bold;
				height: 100%;
				background-color: #efefef;
			}

			input {
				flex: 1;
				height: 100%;
				display: flex;
				padding-left: 20rpx;
				color: #1f1f1f;
			}

			.info {
				width: 100rpx;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #1f1f1f;
				background-color: #efefef;
			}
		}

		.button {
			width: 96%;
			background-color: #c5c9ca;
			color: #fff;
			font-weight: bold;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			margin: 60rpx auto;
		}
	}

	.Recharge {
		width: 90%;
		margin: 40rpx auto;
		text-align: center;
		color: #999999;
		font-size: 24rpx;
	}
</style>
