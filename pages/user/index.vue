<template>
	<view class="content">
		<view class="login-top">
			<view class="userInfo">
				<view class="">
					<template v-if="userInfo" >
						<view class="userInfo-left" >
							<image class="userImg"  :src="userInfo.headImg" mode="aspectFill"></image>
							<view class="userName">
								<view style="font-weight: bold;">{{userInfo.userName}}</view>
								<view style="font-size: 26rpx;">
									<text style="font-weight: bold;">ID:</text>
									<text style="color: #868686;font-size: 24rpx;">{{userInfo.id}}</text>
								</view>
							</view>
						</view>
					</template>
					<template v-else >
						<view class="userInfo-left" >
							<image class="userImg" src="../../static/images/avatar.png" mode="aspectFill"></image>
							<view class="userName" @click="Topath('/pages/user/login')">
								点击登录
							</view>
						</view>
					</template>
				</view>
				<view class="userInfo-right" @click.stop="Topath('/pages/subPackUser/edituserInfo')" >
					<u-icon name="edit-pen" color="#868686" size="28"></u-icon>
				</view>
			</view>
			<view class="couponInfo">
				<u-grid :border="false" col="3" @click="">
					<u-grid-item @click="Topath('/pages/subPack/membercz')" >
						<view class="grid-text">余额</view>
						<view class="">
							<text class="grid-text grid-text2" v-if="userInfo.balance" >￥{{userInfo.balance}}</text>
							<text class="grid-text grid-text2" v-else >￥0</text>
						</view>
					</u-grid-item>
					<u-grid-item @click="Topath('/pages/coupon/mycoupon')" >
						<view class="grid-text">优惠券</view>
						<text class="grid-text grid-text2">{{couponNum}}张</text>
					</u-grid-item>
					<u-grid-item @click="Topath('/pages/subPack/pointsmall')" >
						<view class="grid-text"  >积分</view>
						<text class="grid-text grid-text2">{{integral}}</text>
					</u-grid-item>
				</u-grid>
			</view>
		</view>
		<view class="orderStatus common">
			<u-grid :border="false" col="4" >
				<u-grid-item v-for="(item,index) in homeAdList"  :key="item.id" @click="Topath(`/pages/order/order?id=${index}`)">
					<image style="width: 70rpx;height: 70rpx;" :src="item.activityImgUrl"
						mode="aspectFill"></image>
					<text class="grid-text grid-text2">{{item.title}}</text>
				</u-grid-item>
			</u-grid>
		</view>
		<view class="common">
			<view class="address" @click="Topath('/pages/user/discountPay')">
				<view class="myserver">
					<u-icon name="coupon-fill" size="18" color="#000"></u-icon>
					<view class="mytitle">
						优惠买单
					</view>
				</view>
				<u-icon name="arrow-right" size="18" color="#000"></u-icon>
			</view>
			<view class="address" @click="Topath('/pages/subPackUser/Invoicingrecords')">
				<view class="myserver">
					<u-icon name="calendar-fill" size="18" color="#000"></u-icon>
					<view class="mytitle">
						发票管理
					</view>
				</view>
				<u-icon name="arrow-right" size="18" color="#000"></u-icon>
			</view>
			<view class="address" @click="Topath('/pages/subPackUser/collect')">
				<view class="myserver">
					<u-icon name="heart-fill" size="18" color="#000"></u-icon>
					<view class="mytitle">
						我的收藏
					</view>
				</view>
				<u-icon name="arrow-right" size="18" color="#000"></u-icon>
			</view>
			<view class="address">
				<view class="myserver">
					<u-icon name="server-man" size="18" color="#000"></u-icon>
					<button class="contactBtn mytitle" plain="true" open-type="contact">
						联系客服
					</button>
				</view>
				<u-icon name="arrow-right" size="18" color="#000"></u-icon>
			</view>
			<view class="address" @click="Topath('/pages/subPackUser/agreement')">
				<view class="myserver">
					<u-icon name="file-text-fill" size="18" color="#000" ></u-icon>
					<view class="mytitle">
						条款规则
					</view>
				</view>
				<u-icon name="arrow-right" size="18" color="#000" ></u-icon>
			</view>
			<view class="address" @click="Topath('/pages/subPackUser/joinUs') ">
				<view class="myserver">
					<u-icon name="plus-people-fill" size="18" color="#000" ></u-icon>
					<view class="mytitle">
						加入我们
					</view>
				</view>
				<u-icon name="arrow-right" size="18" color="#000" ></u-icon>
			</view>
			 <!-- <view class="address" @click="Topath('/pages/subPackUser/advise')">
				<view class="myserver">
					<u-icon name="chat-fill" size="18"></u-icon>
					<view class="mytitle">
						投诉建议
					</view>
				</view>
				<u-icon name="arrow-right" size="18"></u-icon>
			</view> -->
			
			
		</view>
		
		<!-- <view class="address common" @click="changeLog">
			<view class="myserver">
				<u-icon name="scan" size="18"></u-icon>
				<view class="mytitle">
					扫码取货
				</view>
			</view>
			<u-icon name="arrow-right" size="18"></u-icon>
		</view> -->
		<view class="" style="margin-top: 100rpx;" >
			<about></about>
		</view>
	</view>
</template>
<script>
	const app = getApp();
	import QRCode from 'qrcode'
	export default {
		data() {
			return {
				businessId:uni.getStorageSync('__ddminiStoreInfo').businessId,
				userInfo:'',
				token: '',
				homeAdList:[],
				couponNum:0,
				integral:0,
				adminiUserInfos:'',
			}
		},
		onShow() {
			let self = this;
			self.adminiUserInfos = uni.getStorageSync('__ddminiUserInfo');
			self.token = self.adminiUserInfos .accessToken;
			self.getInfo();
			// console.log(self.token,'8888888888888888');
		},
		onLoad() {
			let self = this;
			// self.adminiUserInfos = uni.getStorageSync('__ddminiUserInfo');
			// self.token = self.adminiUserInfos .accessToken;
			// if (self.token) {
			// 	self.getInfo();
			// }
			// self.getInfo();
			self.gethomeInfo();
			self.getcouponList();
		},
		onShareAppMessage() {
			let shop = uni.getStorageSync('__ddminiShopInfo');
			return {
				title: shop.shop_share_title || shop.shop_name,
				imageUrl: shop.shop_share_pic || shop.shop_logo,
				path: 'pages/index/index'
			}
		},
		methods: {
			ClearStorget() {
				let self = this;
				uni.showModal({
					title: '提示',
					content: '确定要清除缓存吗?',
					success: function(res) {
						if (res.confirm) {
							uni.removeStorage({
								key: '__ddminiUserInfo',
							});
							uni.navigateTo({
								url: '/pages/user/login'
							})
						} else if (res.cancel) {}
					}
				});
			},
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
						console.log(res,'个人信息777777777');
					}else{
						self.userInfo='';
						self.token="";
					}
				})
			},
			gethomeInfo() {
				let self = this
				self.Get(`/api/plugs/getApplicationPlugsRecommendedList?businessId=${self.businessId}&userServiceToken=NIIWOD4RU1B1KLEBAV9TX`).then(res => {
					if (res.code == 200) {
						let list = res.body;
						self.homeAdList = list.filter(itm => itm.type === 'orderStatus');
						self.homeAdList=self.homeAdList.reverse()
					}
				})
			},
			getcouponList(){
				let self=this;
				let postdata={
					businessId:self.businessId,
					status:0
				}
				self.Get('/api/plugs/searchPlugsCouponsByUserId',postdata).then(res=>{
					if(res.code==200){
						self.couponNum=res.body.total;
						self.couponList=res.body.list;
					}
				})
			},
			scanGoods(){
				let self=this;
				uni.scanCode({
					success: function (res) {
						self.Post('/api/order/verificationOrder',{verificationCode:res.result}).then(res=>{
							if(res.code==200){
								uni.showToast({
									title:'取货成功'
								})
							}else{
								uni.showToast({
									title:res.msg
								})
							}
						})
					}
				});
			}
		}
	}
</script>

<style lang="less">
	
	.uni-date__x-input {
		text-align: right;
		padding-right: 12rpx;
	}
	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		padding-bottom: 30rpx;

		.common {
			width: 94%;
			border-radius: 16rpx;
			background-color: #fff;
			// box-shadow: 0px 0px 16rpx 0px rgba(207, 207, 207, 0.5);
		}
		
	}

	.login-top {
		padding: 28rpx 30rpx;
		box-sizing: border-box;
		width: 100%;
		background-color: #fff;
		background-image: linear-gradient(#fdd000, #fec32d, #fbd78f, #f7ebd5);
		padding-bottom: 100rpx;
		.userInfo {
			display: flex;
			justify-content: space-between;
			margin-bottom: 40rpx;

			.userInfo-left {
				display: flex;
				align-items: center;

				.userImg {
					width: 100rpx;
					height: 100rpx;
					border-radius: 100%;
					margin-right: 16rpx;
				}
			}
		}
	}
	.couponInfo {
		.grid-text {
			color: #000;
			font-size: 26rpx;
			font-weight: 600;
		}

		.grid-text2 {
			margin-top: 12rpx;
		}
	}

	.orderStatus {
		margin: 0 auto;
		padding: 28rpx 30rpx;
		margin-top: -50rpx;
		margin-bottom: 20rpx;
		// width: 94%;
		// background-color: #fff;
		box-sizing: border-box;
		.grid-text {
		       padding: 10rpx 0 0rpx 0rpx;
		       /* #ifndef APP-PLUS */
		       box-sizing: border-box;
		       /* #endif */
					color: #1c1c1c;
					font-size: 24rpx;
					font-weight: bold;
		   }
	}

	.address {
		font-size: 30rpx;
		display: flex;
		height: 90rpx;
		// margin-bottom: 18rpx;
		align-items: center;
		font-size: 28rpx;
		padding: 18rpx 24rpx;
		justify-content: space-between;
		box-sizing: border-box;
		// border-bottom: ;

		.myserver {
			display: flex;
			align-items: center;
			width: 96%;

			.mytitle {
				margin-left: 6rpx;
				color: #000;
			}

			.contactBtn {
				width: 96%;
				border: none;
				height: 90rpx;
				line-height: 90rpx;
				text-align: left;
				font-size: 30rpx;
				padding: 0rpx;
			}
		}
	}
</style>
