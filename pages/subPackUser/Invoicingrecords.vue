<template>
	<view class="content">
		<view class="InvoicingBox" v-for="item in dataArray" :key="item.id" >
			<view class="applyTime">申请时间: <text class="invoiceText">{{item.createTime}}</text></view>
			<view class="applyTime InvoiceType">
				<view class="InvoiceType-left">发票类型: <text class="invoiceText">电子发票</text></view>
				<!-- <view class="InvoiceType-right">开票中</view> -->
			</view>
			<view class="applyTime">发票金额:<text class="invoiceText">￥{{item.jsonData.money}}</text></view>
		</view>
		<backtop ref="VT" :scrollTop="top"></backtop>
		<view class="subBtn" @click="Topath('/pages/subPackUser/supplyInvoice')">申请开发票</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				top: 0,
				orderPage: {
					page: 1,
					sizes: 10,
					total: 0
				},
				dataArray:[]
			}
		},
		onLoad() {

		},
		onShow() {
			let self = this;
			self.orderPage.page = 1;
			self.dataArray = [],
				this.getRecords()
		},
		onReachBottom() {
			let self = this;
			if (self.orderPage.total > self.orderPage.page) {
				self.orderPage.page++;
				self.getRecords()
			}
		},
		onPageScroll(e) {
			this.$refs.VT.topData(e.scrollTop)
		},
		methods: {
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			getRecords() {
				let self = this;
				let postData = {
					page: self.orderPage.page,
					plugsId: 180
				}
				self.Get('/api/plugs/getPlugsDataUserIdList', postData).then(res => {
					if (res.code == 200) {
						self.orderPage.total = res.body.pages;
						let data = res.body.list;
						if (self.dataArray.length > 0) {
							let list = self.dataArray.concat(data);
							self.dataArray = list;
						} else {
							self.dataArray = data;
						}
						self.dataArray.forEach(item=>{
							item.jsonData=JSON.parse(item.jsonData)
						})
						console.log(self.dataArray,'发票记录8888888888888')
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.content {
		padding-top: 20rpx;
		position: relative;
	}

	.InvoicingBox {
		width: 92%;
		padding: 32rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
		margin: 0 auto;
		margin-bottom: 20rpx;
		box-shadow: 0px 0px 16rpx 0px rgba(207, 207, 207, 0.5);

		.InvoiceType {
			display: flex;
			align-items: center;
			margin: 16rpx auto;
			justify-content: space-between;
		}

		.invoiceText {
			font-size: 26rpx;
			margin-left: 8rpx;
		}

		.InvoiceType-right {
			color: #797979;
		}
	}

	.subBtn {
		width: 60%;
		margin: auto;
		background-color: #fdd000;
		border-radius: 40rpx;
		text-align: center;
		color: #fff;
		font-size: 26rpx;
		height: 80rpx;
		line-height: 80rpx;
		position: fixed;
		bottom: 100rpx;
		left: 20%;
	}
</style>
