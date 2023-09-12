<template>
	<view class="content">
		<view class="map_box">
			<map :markers="markers" :latitude="latitude" :longitude="longitude"></map>
		</view>
		<view class="store_box">
			<view class="store" v-for="(item, index) in storeList" :key="index" @click="selectStoreTap(index)">
				<view class="left">
					<view class="title">{{item.businessName}}</view>
					<view class="address time">{{item.businessAddress.address}}</view>
					<view class="time">
						营业时间:{{item.businessHours[0].businessStartTime}}~{{item.businessHours[0].businessEndTime}}
					</view>
				</view>
				<view class="right">
					<view class="right-box" style="margin-right: 12rpx;" @click.stop="getPhone(item.businessMobile)">
						<u-icon name="phone-fill" color="#fdd000" size="20"></u-icon>
					</view>
					<view class="right-box" @click.stop="openMap(item.businessAddress.longitude,item.businessAddress.latitude)">
						<u-icon name="map-fill" color="#fdd000" size="20"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	import JSONBig from 'json-bigint'
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				storeList: [],
				storeId: '',
				logo: __wxConfig.accountInfo.icon,
				markers: [],
				latitude: 0,
				longitude: 0,
			}
		},
		onLoad(e) {
			let self = this;
			self.storeId = e.id;
			console.log(e, '店铺ID')
			self.gteStoreList();
		},
		methods: {
			getPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone //仅为示例
				});
			},
			// 打开地图导航
			openMap(lon, lat) {
				uni.getLocation({
					success: res => {
						// res.latitude=lat;
						// res.longitude=lon;
						console.log('location success', parseFloat(lat), parseFloat(lon))
						uni.openLocation({
							latitude: parseFloat(lat),
							longitude: parseFloat(lon),
							scale: 18
						})
					}
				})
			},

			gteStoreList() {
				let self = this;
				self.Get2('/api/plugs/getBusinessInfo').then(res => {
					if (res.code === 200) {
						let list = [];
						let data = res.body;
						let listArr = [];
						data.forEach((item) => {
							listArr.push(JSONBig.parse(item.jsonData))
						})
						self.storeList = listArr;
						listArr.forEach((itm, idx) => {
							list.push({
								id: idx,
								latitude: itm.businessAddress.latitude,
								longitude: itm.businessAddress.longitude,
								// iconPath: itm.businessLogo,
								width: 30,
								height: 30,
								callout: {
									content: itm.businessName,
									color: '#ffffff',
									bgColor: '#F54319',
									padding: 5,
									display: 'ALWAYS',
									borderRadius: 5
								}
							})
						})
						self.markers = list;
						if (self.storeId) {
							let mendian = listArr.find(itm => itm.businessId === self.storeId);
							self.latitude = mendian.businessAddress.latitude;
							self.longitude = mendian.businessAddress.longitude;
						} else {
							self.latitude = list[0].latitude;
							self.longitude = list[0].longitude;
						}
					}
				})
			},
			selectStoreTap(index) {
				let self = this;
				let data = self.storeList[index];
				uni.$emit('store', data);
				setTimeout(function() {
					// uni.navigateBack();
					uni.switchTab({
						url:'/pages/index/index'
					})
				}, 600)
			}
		}
	}
</script>

<style lang="less">
	.map_box {
		width: 100%;
		height: 500rpx;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 1000;

		map {
			width: 100%;
			height: 100%;
		}
	}

	.store_box {
		width: 100%;
		padding-top: 20rpx;

		.store {
			width: 94%;
			margin: 0 auto;
			margin-bottom: 20rpx;
			background-color: #fff;
			// border-bottom: 1px dashed #efefef;
			box-shadow: 0px 0px 16rpx 0px rgba(207, 207, 207, 0.5);
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx;
			box-sizing: border-box;

			.left {
				// width: 130rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.title {
					font-weight: bold;
				}

				.address {
					margin: 6rpx 0;
				}

				.time {
					font-size: 24rpx;
					color: #aaa;
				}

				image {
					width: 100rpx;
					height: 100rpx;
					border: 1px solid #f5f5f5;
					border-radius: 100%;
				}
			}

			.right {
				height: 100%;
				display: flex;
				align-items: center;

				.right-box {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 60rpx;
					height: 60rpx;
					border-radius: 100%;
					background-color: #fff0d4;
				}
			}
		}
	}
</style>
