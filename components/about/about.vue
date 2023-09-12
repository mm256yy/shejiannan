<template>
	<view class="power" @click="">
		<view  class="logo">
			<image :src="brandInfo.activityImgUrl"></image>
			<text>{{brandInfo.title}}</text>
		</view>
		<view class="text">提供技术与平台服务</view>
		<view class="text">v{{version}}</view>
	</view>
</template>

<script>
	export default {
		name: 'about',
		props: {},
		data() {
			return {
				brandInfo: '',
				businessId:uni.getStorageSync('__ddminiStoreInfo').businessId || 0 ,
				version: uni.getAccountInfoSync().miniProgram.version ? uni.getAccountInfoSync().miniProgram.version :
					'1.0.0',
			}
		},
		onReady() {
			let self = this;
			self.Get(
				`/api/plugs/getApplicationPlugsRecommendedList?businessId=${self.businessId}&userServiceToken=NIIWOD4RU1B1KLEBAV9TX`
			).then(res => {
				if (res.code == 200) {
					let list = res.body;
					let data = list.filter(itm => itm.type === 'companyLogo');
					self.brandInfo=data[0]
					console.log(data,'公司数据')
					
				}
			})
		},
		methods: {
			
		}
	}
</script>

<style lang="less">
	.power {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-bottom: 40rpx;

		.logo {
			display: flex;
			align-items: center;
			color: #ccc;

			image {
				width: 36rpx;
				height: 36rpx;
				filter: brightness(80%);
				opacity: .5;
			}

			text {
				padding-left: 6rpx;
			}
		}

		.text {
			color: #ccc;
			font-size: 24rpx;
		}
	}
</style>
