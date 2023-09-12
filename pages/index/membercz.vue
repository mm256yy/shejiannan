<template>
	<view class="content">
		<view class="headerBox" :style="{backgroundImage: 'url('+BgcImg+')', 'background-repeat':'no-repeat', backgroundSize:'100% 100%'}" >
			<view class="title">可用余额</view>
			<view class="money"><text>¥</text>{{ balance}}</view>
			<view class="tips" @click="Topath('/pages/index/rechargerecord')">消费&充值记录</view>
		</view>
		<view class="moneyBox">
			<view class="header">余额充值</view>
			<view v-if="ruleList.length>0" class="radioBox">
				<radio-group class="listBox" @change="radioChange">
					<label class="list" v-for="(item, index) in ruleList" :key="index">
						<view class="title">¥{{item.rechargeMoney}}</view>
						<view class="info"><text>送</text>¥{{item.giveeMoney}}</view>
						<radio :checked="payMoney==item.rechargeMoney?true:false" :value="item.rechargeMoney"
							:color="template.color.temp_color"/>
					</label>
				</radio-group>
			</view>
			<view class="other">
				<view class="title">其它</view>
				<input type="digit" v-model="payMoney" placeholder="请输入充值金额" />
				<view class="info">元</view>
			</view>
			<view class="button" @click="getRechargeOrder()">确认充值</view>
		</view>



	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				openId: uni.getStorageSync('__ddminiUserOpenid'),
				businessId: uni.getStorageSync('__ddminiStoreInfo').businessId,
				UserInfo: uni.getStorageSync('__ddminiUserInfo'),
				userDetails: {
					moneys: 0,
					score: 0
				},
				moneyNumber: '',
				payList: '',
				ruleList: [],
				rechargeOrder: '',
				BgcImg:'',
				integral:0,
				 current: '',
				 payMoney:'',
				 balance:0
			}
		},
		onShow() {
			let self = this;
			self.getInfo()
		},
		onLoad() {
			let self = this;
			self.gethomeInfo();
			// self.getInfo();
			self.getSelectList();
		},
		methods: {
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			radioChange(e){
				this.payMoney=e.detail.value;
				console.log(e,'8988911111111111');
				// this.current=
			},
			getSelectList(){
				let self=this;
				self.Get('/api/plugs/getPlugsConfigInfo',{id:173}).then(res=>{
					if(res.code==200){
						self.ruleList=JSON.parse(res.body.plugsConfigJson);
					}
				})
			},
			gethomeInfo() {
				let self = this
				self.Get(`/api/plugs/getApplicationPlugsRecommendedList?businessId=${self.businessId}&userServiceToken=NIIWOD4RU1B1KLEBAV9TX`).then(res => {
					if (res.code == 200) {
						let data = res.body;
						let list = data.filter(itm => itm.type === 'pointOne');
						self.BgcImg = list[0].activityImgUrl;
					}
				})
			},
			getInfo() {
				let self = this;
				let id = self.UserInfo.id
				self.Get('/api/user/searchUserInfoById', {
					userId: id
				}).then(res => {
					if (res.code == 200) {
						self.userInfo = res.body;
						self.balance=res.body.balance;
						self.integral = res.body.integral;
					}
				})
			},
			getRechargeOrder() {
				let self = this;
				let postData = {
					"client": "小程序",
					"openId": self.openId,
					"payMoney": self.payMoney,
					"payWay": 1,
					"payType":2
				}
				// console.log(postData,'微信支付')
				uni.showLoading({
					title: '支付准备中',
					mask: true
				});
				self.Post2('/api/pay/appletsWechatOrderPay', postData).then(res => {
					if (res.code === 200) {
						// console.log(res,'支付')
						self.payList = res.body;
						console.log(self.payList,'支付')
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
								uni.showToast({
									title: '微信支付成功'
								});
								self.getInfo();
								setTimeout(function() {
								
									uni.navigateTo({
										url: `/pages/order/paysuccess?money=${self.payMoney}`
									});
								}, 600);
							},
							fail: function(err) {
								console.log(err,'pppppppp')
								// uni.showModal({
								// 	title: '支付失败',
								// 	content: '订单支付失败，请重新进行支付。如对订单金额有疑问请联系客服人员',
								// 	showCancel: false
								// })
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
	page {
		background-color: #FFFFFF;
	}

	.headerBox {
		width: 96%;
		height: 300rpx;
		border-radius: 16rpx;
		margin:20rpx auto;
		// background-color: #ffde59;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #fff;
		position: relative;
		justify-content: center;

		.title {
			font-size: 28rpx;
			color: #1f1f1f;
			font-weight: bold;
		}

		.money {
			font-size: 80rpx;
			font-weight: bold;
			display: flex;
			align-items: flex-end;
			padding-bottom: 20rpx;
			color: #e74032;

			text {
				font-size: 40rpx;
				padding-right: 8rpx;
				padding-bottom: 20rpx;
			}
		}

		.tips {
			color: #1f1f1f;
			font-size: 26rpx;
			position: absolute;
			bottom: 30rpx;
			opacity: .6;
		}
	}

	.moneyBox {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		justify-content: center;

		.header {
			color: #1f1f1f;
			width: 100%;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			font-weight: bold;
		}

		.listBox {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			margin: 0 auto;
			width: 85%;
			justify-content: space-between;

			.list {
				width: 280rpx;
				display: flex;
				flex-direction: column;
				border: 2rpx solid #efefef;
				margin-bottom: 30rpx;
				justify-content: center;
				padding-left: 20rpx;
				position: relative;
				padding-top: 20rpx;
				padding-bottom: 20rpx;
				border-radius: 10rpx;

				.title {
					font-size: 36rpx;
					color: #F54319;
					font-weight: bold;
				}

				.info {
					color: #999;
					font-size: 28rpx;
					display: flex;
					align-items: center;

					text {
						font-size: 26rpx;
						padding-right: 4rpx;
					}
				}

				radio {
					position: absolute;
					right: 20rpx;
					zoom: 0.8;
				}
			}
		}

		.other {
			width: 85%;
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
			width: 85%;
			height: 90rpx;
			margin: 0 auto;
			background-color: #fdd000;
			color: #fff;
			margin-top: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			font-weight: bold;
			position: relative;
			border-radius: 10rpx;

			button {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				opacity: 0;
			}
		}
	}
</style>
