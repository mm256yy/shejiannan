<template>
	<view class="content">
		<view class="common ">
			<view class="invoice" @click="Topath('/pages/subPackUser/comOrder')">
				<view class="invoice-title">选择发票</view>
				<u-icon name="arrow-right" color="#8e8e8e" size="20"></u-icon>
			</view>
			<view class="invoiceMoney">
				<text class="text">发票金额</text>
				<view class="money"> <text>￥</text> {{invoiceMoney}} </view>
			</view>
			
		</view>
		<view class="common invoiceDetail">
			<view class="invoiceDetail-title">
				<u-icon name="red-packet" color="#8e8e8e" size="20"></u-icon>
				<view class="invoice-title" style="margin-left: 16rpx;">选择发票</view>
			</view>
			<view class="invoiceType">
				<view class="invoiceType-left">发票类型</view>
				<view class="invoiceType-right">
					<radio-group @change="radioChange">
						<label class="radio">
							<radio color="#febc10" value="1" checked="true" />
							<text style="margin-right: 16rpx;">企业</text>
						</label>
						<label class="radio">
							<radio color="#febc10" value="2" />
							<text>个人/非企业性单位</text>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="invoiceType">
				<view class="title" style="color:#666666;">发票抬头</view>
				<input
					style="flex: 1;text-align: right;padding-left: 20rpx;box-sizing: border-box;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;"
					class="uni-input" v-model="invoiceInfo.invoiceHeader" placeholder="请输入企业名称关键词搜索(必填)" />
			</view>
			<view class="invoiceType">
				<view class="title" style="color:#666666;">税号</view>
				<input
					style="flex: 1;text-align: right;padding-left: 20rpx;box-sizing: border-box;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;"
					class="uni-input" v-model="invoiceInfo.dutyParagraph" placeholder="请输入企业税号(必填)" />
			</view>
			<view class="invoiceType">
				<view class="title" style="color:#666666;">企业地址</view>
				<input
					style="flex: 1;text-align: right;padding-left: 20rpx;box-sizing: border-box;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;"
					class="uni-input" v-model="invoiceInfo.enterpriseAddress" placeholder="(选填)" />
			</view>
			<view class="invoiceType">
				<view class="title" style="color:#666666;">企业电话</view>
				<input
					style="flex: 1;text-align: right;padding-left: 20rpx;box-sizing: border-box;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;"
					class="uni-input" v-model="invoiceInfo.enterpriseMobile" placeholder="(选填)" />
			</view>
			<view class="invoiceType">
				<view class="title" style="color:#666666;">开户银行</view>
				<input
					style="flex: 1;text-align: right;padding-left: 20rpx;box-sizing: border-box;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;"
					class="uni-input" v-model="invoiceInfo.openBankDeposit" placeholder="(选填)" />
			</view>
			<view class="invoiceType">
				<view class="title" style="color:#666666;">银行账号</view>
				<input
					style="flex: 1;text-align: right;padding-left: 20rpx;box-sizing: border-box;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;"
					class="uni-input" v-model="invoiceInfo.bankAccount" placeholder="(选填)" />
			</view>
		</view>

		<view class="common invoiceDetail">
			<view class="invoiceDetail-title">
				<u-icon name="file-text" color="#8e8e8e" size="20"></u-icon>
				<view class="invoice-title" style="margin-left: 16rpx;">接收方式</view>
			</view>
			<view class="invoiceType">
				<view class="title" style="color:#666666;">电子邮箱</view>
				<input
					style="flex: 1;text-align: right;padding-left: 20rpx;box-sizing: border-box;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;"
					class="uni-input" v-model="invoiceInfo.Email" placeholder="请输入电子邮箱(必填)" />
			</view>
			<view class="invoiceType">
				<view class="title" style="color:#666666;">手机号码</view>
				<input
					style="flex: 1;text-align: right;padding-left: 20rpx;box-sizing: border-box;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;"
					class="uni-input" v-model="invoiceInfo.Mobile" placeholder="(选填)"/>
			</view>
		</view>
		<view class="applyBtn">
			<view class="subBtn" @click="Invoicing" >
				开票
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeInfo:uni.getStorageSync('__ddminiStoreInfo'),
				invoiceInfo: {
					"invoiceHeader": "",
					"dutyParagraph": "",
					"bankAccount": "",
					"enterpriseMobile": "",
					"money": 1000,
					"enterpriseAddress": "",
					"openBankDeposit": "",
					"Email":"",
					"Mobile":"",
					"invoiceType": 1,
					"orderList": []
				},
				invoiceMoney: 0
			}
		},
		onLoad() {
			let self = this;
			uni.$on('selectOrder', function(data) {
				self.orderList = data;
				let list = self.orderList;
				
				let Mony = 0;
				if (list != null) {
					list.forEach(item => {
						Mony += item.payMoney;
					})
				}
				self.invoiceMoney = Mony;
				self.invoiceInfo.orderList=list;
				self.invoiceInfo.money=self.invoiceMoney;
			})

		},
		onShow() {
			
			
		},
		methods: {
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			open() {
				// console.log('open');
			},
			close() {
				this.show = false
			},
			radioChange(e) {
				this.invoiceInfo.invoiceType = e.detail.value
			},
			Invoicing(){
					let self=this;
					let userId= uni.getStorageSync('__ddminiUserInfo').id;
					// console.log(self.invoiceInfo,'userIduserIduserId');
					// return
					
					let data=self.invoiceInfo;
					if (data.orderList.length===0) {
						uni.showModal({
							title: '提示',
							content: '您还未选择订单',
							showCancel: false
						});
						return
					}else if (!data.invoiceHeader) {
						uni.showModal({
							title: '提示',
							content: '请输入发票抬头',
							showCancel: false
						});
						return
					}else if (!data.dutyParagraph) {
						uni.showModal({
							title: '提示',
							content: '请输入纳税编号',
							showCancel: false
						});
						return
					}else if (!data.Email) {
						uni.showModal({
							title: '提示',
							content: '请输入联系邮箱(发送发票)',
							showCancel: false
						});
						return
					}
					let postData={
						 "adminId": 40,
						  "businessId": self.storeInfo.businessId,
						  "distance": 0,
						  "id": 0,
						  "jsonData": JSON.stringify(self.invoiceInfo),
						  "jsonViewData": {},
						  "plugsId": 180,
						  "userId":userId,
						  "userServiceToken": "NIIWOD4RU1B1KLEBAV9TX"
					}
					self.Post2('/api/plugs/insertPlugsData',postData).then(res=>{
						if(res.code==200){
							uni.showToast({
								title:'提交成功',
								icon:'none'
							})
							setTimeout(function() {
								uni.navigateTo({
									url:'/pages/user/Invoicingrecords'
								})
							}, 500)
						}else{
							uni.showToast({
								title:res.msg,
								icon:'none'
							})
						}
					})
					
					
			}
		}
	}
</script>

<style lang="less">
	.applyBtn {
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 99;
		background-color: #fff;

		.subBtn {
			width: 92%;
			height: 70rpx;
			background-color: #fdd000;
			border-radius: 40rpx;
			text-align: center;
			line-height: 70rpx;
			font-weight: bold;
		}

	}

	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		padding-bottom: 140rpx;
	}

	.common {
		width: 92%;
		margin-top: 20rpx;
		border-radius: 16rpx;
		box-shadow: 0px 0px 16rpx 0px rgba(207, 207, 207, 0.5);
		padding: 30rpx;
		box-sizing: border-box;
	}

	.invoice {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.invoice-title {
		font-weight: bold;
		font-size: 30rpx;
	}

	.invoiceMoney {
		display: flex;
		align-items: center;
		margin-top: 20rpx;

		.text {
			font-size: 26rpx;
			color: #797979;
		}

		.money {
			color: #e84033;
			font-size: 30rpx;
			font-weight: bold;
		}
	}

	.invoiceDetail {
		.invoiceDetail-title {
			display: flex;
			align-items: center;
		}

		.invoiceType {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx 0;
			box-sizing: border-box;
			border-bottom: 3rpx solid #f9f9f9;

			.invoiceType-left {
				color: #666666;
			}

			.invoiceType-right {
				display: flex;
				flex: 1;
				justify-content: flex-end;
				align-items: center;
			}
		}
	}
</style>
