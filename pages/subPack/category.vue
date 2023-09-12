<template>
	<view class="content">
		<view class="recommend-box">
			<view class="goods-block" v-for="(item,index) in dataArray" :key="index" @tap="goodsItemClick"
				:data-index="index">
				<view class="goods-box">
					<image class="goods-img" :src="item.previewUrl" mode="aspectFill"></image>
					<view class="goods-name">
						{{item.goodsName}}
					</view>
					<view class="goods-price">
						<view class="price">
							<view class="price-left">
								<text>￥</text>
								<text class="price-text">{{item.goodsPrice}}</text>
							</view>
							<view class="price-right">
								<text>￥</text>
								<text>{{item.scribePrice}}</text>
							</view>
						</view>
					</view>
					<view class="month_sales">
						销量:{{item.totalSales}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				storeInfo:uni.getStorageSync('__ddminiStoreInfo'),
				id: '',
				template: '',
				dataArray: [],
				orderPage: {
					page: 1,
					sizes: 10,
					total: 0
				},
			}
		},
		onLoad(options) {
			let self = this;
			// console.log(self.storeInfo,'店铺信息');
			let name=options.name
			uni.setNavigationBarTitle({
				title:name
			})
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

			if (options.id != null) {
				this.id = options.id
			}
			
		},
		onShow() {
			let self=this;
			self.orderPage.page = 1;
			self.dataArray=[];
			self.initData();
		},
		onShareAppMessage() {
			let shop = uni.getStorageSync('__ddminiShopInfo');
			return {
				title: shop.shop_share_title || shop.shop_name,
				imageUrl: shop.shop_share_pic || shop.shop_logo,
				path: 'pages/index/index'
			}
		},
		onReachBottom() {
			let self = this;
			if(self.orderPage.total>self.orderPage.page){
				self.orderPage.page++;
				self.initData();
			}
		},
		methods: {
			Todetail() {
				uni.navigateTo({
					url: '/pages/index/detail'
				})
			},
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			goodsItemClick(e) {
				let index = e.currentTarget.dataset.index
				let id = this.dataArray[index].id
				uni.navigateTo({
					url: `/pages/index/detail?id=${id}`
				})
			},

			initData() {
				let self = this;
				let postdata={
					page:self.orderPage.page,
					size:10,
					categoryId:self.id
				}
				self.Get('/api/plugs/searchPlugsGoodsByCategoryId',postdata).then(res => {
					if (res.code == 200) {
						// this.dataArray = res.body.list
						self.orderPage.total = res.body.pages;
						let data = res.body.list;
						if(self.dataArray.length>0){
							let list = self.dataArray.concat(data);
							self.dataArray = list;
						}else{
							self.dataArray = data;
						}
						// console.log(this.dataArray)
						console.log(res,'分类数据')
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
	.content {
		width: 100%;
		position: relative;
		padding: 30rpx 0;

		.search {
			width: 94%;
			margin:20rpx auto;
			position: fixed;
			top: 0;
			left: 3%;

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
	.recommend-box {
		width: 94%;
		margin: auto;
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
				-webkit-line-clamp: 2;  //一个块元素显示的文本的行数
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
					.price-right{
						margin-left: 12rpx;
						font-size: 26rpx !important;
						font-weight: 400 !important;
						color: #aaa;
						margin-left: 18rpx;
						text-decoration: line-through;
					}
				}
			}
			.month_sales{
				width: 94%;
				margin: auto;
				font-size: 22rpx;
				color: #aaa;
			}
		}
	}
</style>
