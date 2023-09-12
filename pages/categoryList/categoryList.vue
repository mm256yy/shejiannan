<template>
	<view class="content">
		<view class="classify">
			<!-- 分类部分 -->
			<view class="cate-left">
				<view :class="['cate-item',activeIndex==index?'active':'']" v-for="(item,index) in categoryList"
					:key="index" @click="changeActive(index)">{{item.categoryName}}</view>
			</view>
			<view class="cate-right">
				<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
					<swiper-item class="swiper-box" v-for="(item,index) in recommendedList" :key="index">
						<image @click="getGoodsArray()" class="swiper-img" :src="item.activityImgUrl" lazy-load="true" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
				<view class="cate-content" v-for="(item,index) in goodsArray" :key="index" @click="Todetail(item.id,item.goodsType)"
					:data-index="index">
					<image class="cateImg" :src="item.previewUrl" mode="aspectFill"></image>
					<view class="conten-right">
						<view class="goodsname">
							<view class="name">{{item.goodsName}}</view>
							<view class="paynum">销量:{{item.totalSales}}</view>
						</view>
						<view class="goodsprice">
							<view class="price">
								<view>
									<text>￥</text>
									<text class="price-text">{{item.goodsPrice}}</text>
								</view>
								<view class="old-price">
									￥{{item.scribePrice}}
								</view>
							</view>
							<!-- <u-icon name="shopping-cart" color="#ff4544" size="28"></u-icon> -->
						</view>
					</view>
				</view>
				<view class="bottom-box"></view>
			</view>
			<!-- <tabbar :current="1"></tabbar> -->
		</view>
	</view>
</template>

<script>
	import JSONBig from 'json-bigint'
	export default {
		data() {
			return {
				storeInfo:uni.getStorageSync('__ddminiStoreInfo'),
				scrollTop: 0,
				// 当前点击项的索引号
				activeIndex: 0,
				categoryList: [],
				goodsArray: [],
				BusinessList:'',
				businessId:'',
				recommendedList:[],
				orderPage: {
					page: 1,
					sizes: 10,
					total: 0
				},
			};
		},
		onShow() {
			let self=this;
			// self.goodsArray=[]
			// self.getGoodsArray();
		},
		onLoad() {
			let self=this;
			self.initData();
			self.goodsArray=[]
			self.getGoodsArray();
		},
		onReachBottom() {
			let self = this;
			if(self.orderPage.total>self.orderPage.page){
				self.orderPage.page++;
				self.getGoodsArray();
			}
		},
		methods: {
			initData() {
				let self=this;
				let bussinessId = self.storeInfo.businessId;
				self.Get(`/api/plugs/getShopGoodCategoryList?businessId=${bussinessId}`).then(res => {
					if (res.code == 200) {
						self.categoryList = res.body.list
						if (self.categoryList.length > 0) {
							// let id = this.categoryList[0].id
							// self.getGoodsArray(id)
							self.changeActive(0)
						}
					} else {
						uni.showToast({
							title: '加载数据失败',
							duration: 1000,
							icon: 'none'
						})
					}
				})
				self.Get(`/api/plugs/searchPlugsRecommendedList?businessId=${bussinessId}&userServiceToken=NIIWOD4RU1B1KLEBAV9TX`).then(res => {
					if (res.code == 200) {
						let list=res.body.list;
						self.recommendedList = list.filter(itm => itm.type === 'cateOne');
					}
				})
			},
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			//更改点击项的索引号
			changeActive(i) {
				let self=this;
				self.activeIndex = i
				self.goodsArray=[]
				self.getGoodsArray()
			},
			getGoodsArray() {
				let self=this;
				let index=self.activeIndex;
				let list=self.categoryList;
				let postdata={
					page:self.orderPage.page,
					size:10,
					categoryId:0
				}
				postdata.categoryId=list[index].id;
				self.Get('/api/plugs/searchPlugsGoodsByCategoryId',postdata).then(res => {
					if (res.code == 200) {
						let data=res.body;
						self.orderPage.total = data.pages;
						let data2 = res.body.list;
						if(self.goodsArray.length>0){
							let list2 = self.goodsArray.concat(data2);
							self.goodsArray = list2;
						}else{
							self.goodsArray = data2;
						}
					}
				})
			},
			// goodsItemClick(e) {
			// 	let index = e.currentTarget.dataset.index;
			// 	let id = this.goodsArray[index].id;
			// 	uni.navigateTo({
			// 		url: `/pages/index/detail?id=${id}`
			// 	})
			// },
			Todetail(id,type){
				if(type==0){
					uni.navigateTo({
						url:`/pages/index/detail?id=${id}`
					})
				}else if(type==1){
					uni.navigateTo({
						url:`/pages/index/pointdetail?id=${id}`
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.swiper {
		margin-top: 10rpx;
		width: 100%;
		height: 200rpx;
		border-radius: 16rpx;
		margin-bottom: 18rpx;
	
		.swiper-box {
			width: 100%;
			height: 200rpx;
		}
	
		.swiper-img {
			border-radius: 16rpx;
			height: 200rpx;
		}
	}
	.content {
		position: relative;

		.search {
			width: 100%;
			height: 90rpx;
			background-color: #ff5d32;
			display: flex;
			align-items: center;
			position: relative;

			.inp {
				width: 96%;
				// position: absolute;
				// left: 58%;
				// top: 40rpx;
				text-align: center;
				height: 60rpx;
				margin: auto;
				border-radius: 30rpx;
				background-color: #FFFFFF;
			}

			.search-icon {
				position: absolute;
				left: 54%;
				top: 30rpx;
			}
		}
	}

	.classify {
		background-color: #fff;
		// margin-top: 80rpx;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: space-between;

		.cate-left {
			width: 200rpx;
			height: 100vh;
			overflow: auto;
			background-color: #F6F6F6;

			.cate-item {
				width: 100%;
				height: 100rpx;
				line-height: 100rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				padding-left: 30rpx;
				box-sizing: border-box;
				// border-bottom: 5rpx solid #fff;
			}

			.active {
				background-color: #FFFFFF;
				position: relative;
				padding-left: 30rpx;
				color: #ff5d32;
				box-sizing: border-box;

				&::before {
					content: '';
					display: block;
					width: 5rpx;
					border-radius: 6rpx;
					height: 50rpx;
					background-color: #ff5d32;
					position: absolute;
					left: 5rpx;
					top: 30rpx;
				}
			}
		}

		.cate-right {
			width: 80%;
			height: 95vh;
			box-sizing: border-box;
			padding: 0rpx 20rpx;
			overflow: auto;

			// display: flex;
			// justify-content: space-between;
			// flex-wrap: wrap;
			.bottom-box {
				width: 100%;
				height: 130rpx;
			}

			.cate-content {
				width: 100%;
				height: 160rpx;
				margin-top: 30rpx;
				// border-radius: 8rpx;
				padding: 16rpx 0;
				display: flex;
				border-bottom: 3rpx solid #e9e9e9;
				// justify-content: space-between;
				.cateImg{
					border-radius: 16rpx;
				}
				// box-shadow:0 0 10rpx rgba(0, 0, 0, 0.2);
				.conten-right {
					width: 60%;
					height: 100%;
					display: flex;
					box-sizing: border-box;
					flex-direction: column;
					justify-content: space-between;
					// padding-bottom: 10rpx;
				}

				.goodsname {
					width: 100%;
					padding: 6rpx 16rpx;

					.name {
						// width: 86%;
						font-size: 28rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						
					}

					.paynum {
						color: #93a1a1;
						font-size: 24rpx;
						margin-top: 20rpx;
						margin-bottom: 0rpx;
					}
				}

				.goodsprice {
					width: 100%;
					box-sizing: border-box;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 6rpx 16rpx;

					.price {
						color: #ff4544;
						display: flex;
						align-items: center;
						.price-text {
							font-size: 34rpx;
							font-weight: 600;
						}

						.old-price {
							color: #93a1a1;
							font-size: 24rpx;
							margin-left: 16rpx;
							text-decoration: line-through;
						}
					}

					image {
						width: 40rpx;
						height: 40rpx;
					}
				}

				image {
					width: 160rpx;
					height: 160rpx;
					box-sizing: border-box;
					// border-radius: 8rpx 8rpx 0 0;
				}
			}
		}
	}
</style>
