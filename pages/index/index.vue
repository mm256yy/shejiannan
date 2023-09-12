<template>
	<view class="content">
		<view class="fixed_head_box">
			<navBar @height="barHeight=$event" :store="businessInfo"></navBar>
		</view>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item style="width: 100%;height: 400rpx;" v-for="item in homeAdList" :key="item.id" @click="Topath2(item.detailsImgAndPageUrl,item.extJson)" >
				<image :src="item.activityImgUrl" mode="aspectFill" lazy-load :lazy-load-margin="0"></image>
			</swiper-item>
		</swiper>
		<view class="searchInput" @click="Topath('/pages/subPack/search')">
			<u--input shape="circle" placeholder="搜索您想要的商品" prefixIcon="search"
				prefixIconStyle="font-size: 22px;color: #909399;"></u--input>
		</view>
		<view class="hoemCoupon common">
			<image @click="Topath('/pages/coupon/mycoupon')" class="couImg" :src="homeCouList[2].activityImgUrl"
				mode="aspectFill" lazy-load :lazy-load-margin="0"></image>
			<image @click="Topath('/pages/subPack/pointsmall')" class="couImg" :src="homeCouList[1].activityImgUrl"
				mode="aspectFill" lazy-load :lazy-load-margin="0"></image>
			<image @click="Topath('/pages/subPack/membercz')" class="memberImg" :src="homeCouList[0].activityImgUrl"
				mode="aspectFill" lazy-load :lazy-load-margin="0"></image>
		</view>
		<view class="category common">
			<u-grid :border="false" col="5">
				<u-grid-item v-for="item in categoryList2" :key="item.id"
					@click="Topath(`/pages/subPack/category?id=${item.id}&name=${item.categoryName}`)">
					<image style="width: 100rpx;height: 100rpx;" :src="item.icon" mode="aspectFill" lazy-load
						:lazy-load-margin="0"></image>
					<text class="grid-text">{{item.categoryName}}</text>
				</u-grid-item>
			</u-grid>
		</view>
		<view class="couponPay" @click.stop="Topath('/pages/user/discountPay')">
			<view class="">
				<u-icon name="coupon" color="#000" size="28"></u-icon>
				<view>买单</view>
			</view>

		</view>
		<view class="recommend">
			<view class="hot-title">
				<u-icon name="minus" color="#cdcdcd" size="28"></u-icon>
				<view class="hot-text">为您推荐</view>
				<u-icon name="minus" color="#cdcdcd" size="28"></u-icon>
			</view>
			<view class="recommend-box">
				<view class="goods-block" v-for="(item,index) in data2" :key="index"
					@click="Todetail(item.id,item.goods_type)" :data-index="index">
					<view class="goods-box">
						<image class="goods-img" :src="item.preview_url" lazy-load :lazy-load-margin="0"
							mode="aspectFill"></image>
						<view class="goods-name">
							{{item.goods_name}}
						</view>
						<view class="goods-price">
							<view class="price">
								<view class="price-left">
									<text>￥</text>
									<text class="price-text">{{item.goods_price}}</text>
								</view>
								<view class="price-right">
									<text>￥</text>
									<text>{{item.scribe_price}}</text>
								</view>
							</view>
							<!-- 			<u-icon name="shopping-cart" color="#ff4544" size="28"
								@click.native.stop="addToCart(index)">
							</u-icon> -->
						</view>
						<view class="month_sales">
							销量:{{item.total_sales}}
						</view>
					</view>
				</view>
			</view>
		</view>
			<u-popup :show="show" :round="10" mode="center" bgColor="transparent"   @close="close" @open="open">
				<view class="popup" style="width: 500rpx;border-radius: 18rpx;" >
					<image :src="homeAdviseList[0].activityImgUrl" style="border-radius:18rpx;" mode="widthFix"></image>
					<view class="popupitem" style="" @click.stop="advisePath(homeAdviseList[0].detailsImgAndPageUrl)" >立即参与</view>
					<view class="close" @click.stop="show=false" >
						<u-icon name="close" color="#fffffe" size="20"></u-icon>
					</view>
				</view>
				
			</u-popup>
		<!-- <web-view :src="textUrl"></web-view> -->
		<backtop ref="VT" :scrollTop="top"></backtop>
		<!-- <tabbar :current="0"></tabbar> -->
	</view>
</template>
<script>
	const app = getApp();
	import JSONBig from 'json-bigint'
	export default {
		data() {
			return {
				template: '',
				barHeight: 0,
				data1: [], //客服列表
				data2: [], //热销商品
				categoryList: [],
				recommendedList: [],
				businessId: '',
				top: 0,
				homeAdList: [],
				homeCouList: [],
				categoryList: [],
				current: 0,
				businessInfo: {},
				addressInfo: '',
				categoryList2: [],
				homeAdviseList: [],
				show:false,
				textUrl:''
			}
		},
		onShow() {
			let self = this;
			let token = uni.getStorageSync('__ddminiUserInfo').accessToken;

			// if(token==null){
			// 	uni.navigateTo({
			// 		url:'/pages/user/login'
			// 	})
			// }
			// self.getbussinessId()
		},
		onPageScroll(e) {
			this.$refs.VT.topData(e.scrollTop)
		},
		onLoad() {
			let self = this;
			let template = {
				color: {
					temp_color: '#ff4544',
					none_color: '#8A8B9C'
				}
			}
			self.template = template;
			uni.setStorage({
				key: '__ddminiTemplateConfig',
				data: template
			});
			uni.$on('store', function(res) {
				uni.setStorage({
					key: '__ddminiStoreInfo',
					data: res
				});
				self.businessInfo = res;
				self.businessId = res.businessId;
				self.gethomeInfo();
				self.getCategory();
				self.getrecommendGoods();
			})
			// self.getLocation();
			self.getbussinessId();
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
			open() {
				// console.log('open');
			},
			close() {
				this.show = false
				// console.log('close');
			},
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			Topath2(route,extjson) {
				// if(extjson!==''){
				// 	uni.$emit('officialAccount',extjson)
				// }
				uni.setStorage({
					key: '__officialAccount',
					data:extjson
				});
					uni.navigateTo({
						url: route
					})
			},
			advisePath(route){
				uni.navigateTo({
					url: route
				})
				this.show=false;
			},
			getLocation() {
				let self = this
				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						self.addressInfo = res;
						self.getbussinessId();
						uni.setStorage({
							key: 'longitude',
							data: res,
							success: function() {
								console.log('success');
							}
						});
					},
					fail(error) {
						self.getbussinessId();
					}
				});
			},
			Todetail(id, type) {
				if (type == 0) {
					uni.navigateTo({
						url: `/pages/index/detail?id=${id}`
					})
				} else if (type == 1) {
					uni.navigateTo({
						url: `/pages/index/pointdetail?id=${id}`
					})
				}
			},
			change(e) {
				this.current = e.detail.current;
			},
			getbussinessId() {
				let self = this;
				let data = self.addressInfo;
				self.Get2('/api/plugs/getBusinessInfo').then(res => {
					if (res.code == 200) {
						let list = res.body;
						let listArr = [];
						list.forEach((item) => {
							listArr.push(JSONBig.parse(item.jsonData))
						})
						self.BusinessList = listArr;
						if (self.BusinessList.length > 0) {
							self.businessInfo = self.BusinessList[0];
							self.businessId = self.businessInfo.businessId;
							uni.setStorage({
								key: '__ddminiStoreInfo',
								data: self.businessInfo
							});
						}
						self.gethomeInfo();
						self.getCategory();
						self.getrecommendGoods();
					}
				})
			},
			gethomeInfo() {
				let self = this;
				self.Get(
					`/api/plugs/getApplicationPlugsRecommendedList?businessId=${self.businessId}&userServiceToken=NIIWOD4RU1B1KLEBAV9TX`
				).then(res => {
					if (res.code == 200) {
						let list = res.body;
						self.homeAdList = list.filter(itm => itm.type === 'homeOne');
						self.homeCouList = list.filter(itm => itm.type === 'homeCou');
						self.homeAdviseList = list.filter(itm => itm.type === 'homeadvise');
						console.log(self.homeAdList,'广告66666666666')
						if(self.homeAdviseList.length>0){
							this.show=true;
						}
						
					}
				})
			},
			getCategory() {
				let self = this
				self.Get(`/api/plugs/getShopGoodCategoryList?businessId=${self.businessId}`).then(res => {
					if (res.code == 200) {
						self.categoryList = res.body.list;
						let list = []
						if (self.categoryList.length <= 5) {
							list = self.categoryList
						} else {
							list = self.categoryList.slice(0, 5)
						}
						self.categoryList2 = list;
					}
				})
			},
			getrecommendGoods() {
				let self = this;
				self.Get(`/api/plugs/getHomeDataInfo?businessId=${self.businessId}`).then(res => {
					if (res.code == 200) {
						let dict = res.body.jsonViewData;
						self.data2 = dict[0].data;
						// self.data2 = dict[1].data;
					}
				})
			},
		}
	}
</script>

<style lang="less">
	.popup{
		position: relative;
		.popupitem{
			position: absolute;
			right: 150rpx;
			bottom: -90rpx;
			width: 200rpx;
			height: 60rpx;
			background-color: #fdd000;
			border-radius: 40rpx;
			color: #fff;
			margin: 0 auto;
			text-align: center;
			line-height: 60rpx;
			font-weight: bold;
		}
		.close{
			width: 60rpx;
			height: 60rpx;
			margin:0 auto;
			border-radius: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: rgba(207, 207, 207, 0.5);
			position: absolute;
			right:220rpx ;
			bottom: -180rpx;
		}
	}
	.couponPay {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100rpx;
		height: 100rpx;
		border-radius: 100%;
		padding: 8rpx;
		font-size: 26rpx;
		// background-color: #fccb05;
		background-color: rgba(252, 203, 5, 0.7);
		font-weight: bold;
		position: fixed;
		right: 3%;
		top: 56%;
	}

	page {
		background-color: #fff;
	}

	.content {
		position: relative;
	}

	.fixed_head_box {
		position: sticky;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 100;
	}

	.searchInput {
		width: 94%;
		margin: 20rpx auto;
	}

	.common {
		width: 94%;
		// background-color: #fff;
		margin: auto;
	}

	.hoemCoupon {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.couImg {
			width: 180rpx;
			height: 180rpx;
			border: 3rpx solid #ececec;
			// box-shadow: 0px 0px 16rpx 0px rgba(207, 207, 207, 0.5);
			border-radius: 16rpx;
		}

		.memberImg {
			width: 310rpx;
			height: 180rpx;
			border: 3rpx solid #ececec;
			border-radius: 16rpx;
		}
	}

	.category {
		height: 206rpx;
		padding: 20rpx 0;
		margin: 20rpx auto;
		box-sizing: border-box;
		overflow: hidden;

		.grid-text {
			padding: 10rpx 0 20rpx 0rpx;
			/* #ifndef APP-PLUS */
			box-sizing: border-box;
			/* #endif */
			color: #1c1c1c;
			font-size: 24rpx;
			font-weight: bold;
		}
	}

	.recommend {
		width: 94%;
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;

		.hot-title {
			width: 60%;
			// margin: auto;
			display: flex;
			align-items: center;
			justify-content: space-around;
			margin: 30rpx 0rpx;
			box-sizing: border-box;
			padding: 30rpx;
			text-align: center;
			font-size: 36rpx;
			font-weight: 700;

			// color: #ea182c;
			.hot-text {
				// margin: 0rpx 26rpx;
			}
		}

		.recommend-box {
			width: 100%;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.goods-block {
				width: 48%;
			}

			.goods-box {
				width: 100%;
				height: 500rpx;
				border-radius: 16rpx;
				box-sizing: border-box;
				background-color: #fff;
				margin-bottom: 26rpx;
				box-shadow: 0px 0px 8px 0px rgba(207, 207, 207, 0.5);

				.goods-img {
					width: 100%;
					height: 310rpx;
					border-radius: 16rpx 16rpx 0 0;
				}

				.goods-name {
					width: 94%;
					margin: 10rpx auto;
					font-size: 28rpx;
					display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
					-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
					-webkit-line-clamp: 2; //一个块元素显示的文本的行数
					overflow: hidden; //溢出隐藏
				}

				.goods-price {
					width: 94%;
					margin: auto;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.price {
						color: #ff4544;
						display: flex;
						align-items: center;

						.price-text {
							font-size: 34rpx;
							font-weight: 600;
						}

						.price-right {
							margin-left: 12rpx;
							font-size: 26rpx !important;
							font-weight: 400 !important;
							color: #aaa;
							margin-left: 18rpx;
							text-decoration: line-through;
						}
					}
				}

				.month_sales {
					width: 94%;
					margin: auto;
					font-size: 22rpx;
					color: #aaa;
				}
			}
		}
	}
</style>
