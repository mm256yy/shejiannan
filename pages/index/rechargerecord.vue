<template>
	<view class="content">
		<view class="head_box box_shadow">
			<view class="label" :class="{alabel: orderActive===item.id}" v-for="(item, index) in list1" :key="index"
				@click="selectMenuTap(item.id)">
				<view class="tit" :style="{borderColor: orderActive===item.id?'#fdd000':'#fff'}">{{item.name}}</view>
			</view>
		</view>
		<view class="" v-if="orderActive==1">
			<view class="" v-for="item in dataArray" :key="item.id">
				<view class="chargeBox chargeBox2" style="margin-bottom: 20rpx;">
					<view class="chargeBox-left">
						<view class="Time">
							<text>消费时间:</text>
							<text style="color: #aaa;">{{item.payTime}}</text>
						</view>
						<view class="Time" style="margin: 18rpx 0;" >
							<text>消费金额:</text>
							<view class="">
								<text style="color: #e74133; font-weight: bold;font-size: 24rpx;">￥</text>
								<text
									style="color: #e74133; font-weight: 600;font-size: 30rpx;">{{item.consumptionMoney}}</text>
							</view>
						</view>
						<view class="Time">
							<text>支付方式:</text>
							<view class="">
								<text v-if="item.payWay==0" style="color: #aaa;">支付宝</text>
								<text v-else-if="item.payWay==1" style="color: #aaa;">微信</text>
								<text v-else-if="item.payWay==2" style="color: #aaa;">余额支付</text>
								<text v-else-if="item.payWay==5" style="color: #aaa;">优惠买单</text>
							</view>
						</view>
					</view>
					<view class="chargeBox-left">
						<text v-if="item.payRecordStatus==0" style="color: #aaa;">待支付</text>
						<text v-else-if="item.payRecordStatus==1" style="color: #aaa;">支付中</text>
						<text v-else-if="item.payRecordStatus==2" style="color: #aaa;">支付成功</text>
						<text v-else-if="item.payRecordStatus==3" style="color: #aaa;">支付失败</text>
					</view>

				</view>
			</view>
		</view>
		<view class="" v-if="orderActive==2">
			<view class="" v-for="item in dataArray" :key="item.id">
				<view class="chargeBox" style="margin-bottom: 20rpx;">
					<view class="Time" style="margin-bottom: 16rpx;">
						<text>充值时间:</text>
						<text style="color: #aaa;">{{item.payTime}}</text>
					</view>
					<view class="Time">
						<text>充值金额:</text>
						<text style="color: #e74133; font-weight: bold;font-size: 24rpx;">￥</text>
						<text style="color: #e74133; font-weight: 600;font-size: 30rpx;">{{item.payMoney}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="none_list_box" v-if="dataArray.length===0">
			<image src="../../static/images/none_data_icon_01.png" lazy-load="true" mode="widthFix"></image>
			<span>暂无充值&消费记录</span>
		</view>
		<backtop ref="VT" :scrollTop="top"></backtop>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				orderPage: {
					page: 1,
					sizes: 10,
					total: 0
				},
				dataArray: [],
				dataArray2: [],
				top: 0,
				list1: [{
					name: '消费记录',
					id: 1
				}, {
					name: '充值记录',
					id: 2
				}],
				orderActive: 1
			}
		},
		onLoad() {

		},
		onShow() {
			let self = this;
			self.orderPage.page = 1;
			self.dataArray = [],
				// self.dataArray2= [],
				self.selectMenuTap(1);
		},
		onPageScroll(e) {
			this.$refs.VT.topData(e.scrollTop)
		},
		onReachBottom() {
			let self = this;
			if (self.orderPage.total > self.orderPage.page) {
				if (self.orderActive == 1) {
					self.orderPage.page++;
					self.getpayList()

				} else {
					self.orderPage.page++;
					self.getrecord();
				}

			}
		},
		methods: {
			selectMenuTap(id) {
				let self = this;
				self.orderActive = id;
				self.orderPage.page = 1;
				if (self.orderActive == 2) {
					self.dataArray = [];
					self.getrecord();
				} else {
					self.dataArray = [];
					self.getpayList();
				}
			},
			getrecord() {
				let self = this;
				let postdata = {
					page: 1
				}
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				self.Get('/api/pay/getUserPayReacord', postdata).then(res => {
					if (res.code == 200) {
						uni.hideLoading()
						self.orderPage.total = res.body.pages;
						let data = res.body.list;
						if (self.dataArray.length > 0) {
							let list = self.dataArray.concat(data);
							self.dataArray = list;
						} else {
							self.dataArray = data;
						}
					}
				})
			},
			getpayList() {
				let self = this;
				let postData = {
					page: self.orderPage.page,
					userServiceToken: 'NIIWOD4RU1B1KLEBAV9TX'
				}
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				self.Get('/api/user/getUserConsumptionRecordList', postData).then(res => {
					if (res.code == 200) {
						// console.log(res,'消费记录7777777')
						uni.hideLoading()
						self.orderPage.total = res.body.pages;
						let data = res.body.list;
						if (self.dataArray.length > 0) {
							let list = self.dataArray.concat(data);
							self.dataArray = list;
						} else {
							self.dataArray = data;
						}
						console.log(self.dataArray, '消费记录7777777')
					}
				})
			}

		}
	}
</script>

<style lang="less">
	page {
		background-color: #fff;
	}

	.Time {
		display: flex;
		align-items: center;
	}

	.content {
		// padding-top: 20rpx;
		position: relative;
	}

	.chargeBox2 {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.chargeBox {
		width: 92%;
		margin: auto;
		border-radius: 16rpx;
		padding: 30rpx;
		box-sizing: border-box;

		box-shadow: 0px 0px 16rpx 0px rgba(207, 207, 207, 0.5);
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
</style>
