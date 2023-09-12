<template>
	<view class="contentSub">
		<view class="Specification common" @click="shows=true">
			<view class="Specifications-left">
				<view class="select">选择</view>
				<view class="Specifications-text">
					规格:默认
				</view>
			</view>
			<u-icon name="arrow-right" size="14"></u-icon>
		</view>
		<!-- 规格选择弹窗 start -->
		<u-popup :show="shows" mode="bottom" @close="close" @open="open">

			<view class="Specifications">
				<view class="Specifications-mask"></view>
				<view class="Specifications-popup">
					<view class="Specifications-popup-colse cuIcon-roundclose" @click="shows=false">
						<u-icon name="close-circle" size="24"></u-icon>
					</view>
					<view class="Specifications-popup-head">
						<view class="Specifications-popup-head-img">
							<image mode="widthFix" :src="goodsImage"></image>
						</view>
						<view class="Specifications-popup-head-text">
							<!-- <view class="Specifications-popup-head-text-name">羽绒服</view> -->
							<view class="Specifications-popup-head-text-price"><label
									for="">¥</label><text>{{dealPrice}}</text>
							</view>
							<view class="Specifications-popup-head-text-parameter">
								<text>库存:{{stockNum}}</text>
							</view>
						</view>
					</view>
					<scroll-view scroll-y class="Specifications-huadong">
						<view class="Specifications-popup-sele" v-for="(value,key) in specifications" :key="key">
							<view class="Specifications-popup-sele-name">{{key}}</view>
							<view class="Specifications-popup-sele-list">
								<text :class=" value.start == index2 ?'rmoiu':'' " @click="morloe(key,index2)"
									v-for="(item2,index2) in value.children"
									:key="index2">{{item2.specificationName}}</text>
							</view>
						</view>
					</scroll-view>
					<view class="Specifications-popup-munbar">
						<view class="Specifications-popup-munbar-name">购买数量</view>
						<view class="redmunber">
							<wm-numberBox model="2"></wm-numberBox>
							<u-number-box v-model="value">
								<view slot="minus" class="minus">
									<u-icon name="minus-circle" size="20"></u-icon>
								</view>
								<text slot="input" style="width: 50rpx;text-align: center;"
									class="input">{{value}}</text>
								<view slot="plus" class="plus">
									<u-icon name="plus-circle" color="#e31d1a" size="20"></u-icon>
								</view>
							</u-number-box>
						</view>
					</view>
					<view class="Specifications-popup-but">
						<label class="addcart" @click="Jumpgwc">加入购物车</label>
						<label class="buy">立即购买</label>
					</view>
				</view>
			</view>
		</u-popup>
		<!-- 规格选择弹窗 end -->
	</view>

</template>

<script>
	export default {
		name: "specpopup",
		data() {
			return {
				shows: false,
				value: 1,

				goodsImage: "",
				dealPrice: 0,
				stockNum: 0
			}
		},
		props: {
			goodsDict: {},
			specifications: {}
		},
		mounted() {
			let price1 = 0
			let stockNum1 = 0
			let count = 0

			for (let key in this.specifications) {
				let dict = this.specifications[key]['children'][0]

				this.goodsImage = dict.specificationImages

				let dict2 = this.specifications[key]

				let start = dict2.start
				let children = dict2.children

				price1 += children[start].dealPrice
				stockNum1 += children[start].stockNum

				count++
			}

			this.dealPrice = price1
			this.stockNum = Math.ceil(stockNum1 / count)
		},
		methods: {
			morloe(key, index2) {
				let dict = this.specifications[key].children[index2]

				this.specifications[key]['start'] = index2

				this.goodsImage = dict.specificationImages

				let price1 = 0
				let stockNum1 = 0
				let count = 0
				for (let key in this.specifications) {
					// console.log(this.specifications[key])
					let dict2 = this.specifications[key]

					let start = dict2.start
					let children = dict2.children

					price1 += children[start].dealPrice
					stockNum1 += children[start].stockNum

					count++
				}

				this.dealPrice = price1
				this.stockNum = Math.ceil(stockNum1 / count)

				console.log(dict, key, index2)
			},
			open() {},
			close() {
				this.shows = false
			},
			Jumpgwc() {
				this.shows = false

				let goodsSpecificationIds = []
				for (let key in this.specifications) {
					let dict2 = this.specifications[key]

					let start = dict2.start
					let children = dict2.children

					goodsSpecificationIds.push(children[start].id)
				}

				let postData = {
					goodsId: this.goodsDict.id,
					goodsCategoryId: this.goodsDict.categoryId,
					goodsNum: this.value,
					goodsSpecificationIds: goodsSpecificationIds.toString()
				};

				// console.log(postData)

				this.Post2('/api/plugs/insertPlugsShopCart', postData).then(res => {
					// console.log("insertPlugsShopCart", res)
					if (res.code == 200) {
						uni.showToast({
							title: '加入成功',
							duration: 1000,
							icon: 'success'
						})
					} else {
						uni.showToast({
							title: '加入失败',
							duration: 1000,
							icon: 'error'
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.contentSub {
		width: 100%;
	}

	.common {
		width: 96%;
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0px 0px 8px 0px rgba(207, 207, 207, 0.5);
	}


	.Specification {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 18rpx;
		height: 90rpx;

		.Specifications-left {
			display: flex;
			align-items: center;

			.select {
				color: #a3a3a3;
				margin-right: 26rpx;
			}
		}
	}

	/* 规格选择弹窗 start */

	.Specifications {
		width: 100%;
		position: fixed;
		background-color: #fff;
		bottom: 0px;
		left: 0px;
		z-index: 999;
	}

	.Specifications-mask {
		width: 100%;
		height: auto;
		position: fixed;
		top: 0rpx;
		bottom: 0rpx;
		left: 0rpx;
		right: 0rpx;
		margin: 0rpx auto;
		background: rgba(0, 0, 0, 0.4);
		z-index: 1000;
	}

	.Specifications-popup {
		width: 100%;
		height: auto;
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		right: 0rpx;
		z-index: 1001;
		background: #fff;
		border-radius: 10rpx 10rpx 0rpx 0rpx;
	}

	.Specifications-popup-colse {
		position: absolute;
		top: 12rpx;
		right: 14rpx;
		font-size: 30rpx;
		color: #999;
		z-index: 1002;
	}

	.Specifications-popup-head {
		width: 94%;
		height: auto;
		margin: 0rpx auto;
		border-bottom: 3rpx #eee solid;
		display: flex;
		flex-direction: row;
		padding: 20rpx 0rpx;
	}

	.Specifications-popup-head-img {
		width: 25%;
	}

	.Specifications-popup-head-img image {
		width: 100%;
		height: 200rpx;
		border: 3rpx #eee solid;
		display: block;
	}

	.Specifications-popup-head-text {
		width: 75%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding-left: 3%;
		justify-content: space-around;
	}

	.Specifications-popup-head-text-name {
		font-size: 32rpx;
		font-weight: bold;
		width: 90%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #444;
	}

	.Specifications-popup-head-text-price {
		display: flex;
		flex-direction: row;
		color: #e31d1a;
		font-weight: 600;
		display: table-cell;
		vertical-align: bottom;
	}

	.Specifications-popup-head-text-price label {
		font-size: 24rpx;
		font-weight: bold;
		margin-right: 2%;
	}

	.Specifications-popup-head-text-price text {
		font-size: 36rpx;
	}

	.Specifications-popup-head-text-parameter {
		font-size: 26rpx;
		color: #888;
	}

	.Specifications-popup-head-text-parameter text {
		margin-right: 3%;
	}

	.Specifications-huadong {
		width: 100%;
		max-height: 600rpx;
		padding-top: 20rpx;
	}

	.Specifications-popup-sele {
		width: 100%;
		height: auto;
		box-sizing: border-box;
		padding: 0rpx 3%;
	}

	.Specifications-popup-sele-name {
		width: 100%;
		height: auto;
		font-size: 30rpx;
		color: #333;
		margin-bottom: 30rpx;
	}

	.Specifications-popup-sele-list {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.Specifications-popup-sele-list text {
		color: #fe7b2e;
		margin: 0rpx 0%;
		border-radius: 8rpx;
		text-align: center;
		box-sizing: border-box;
		min-width: 30%;
		border: 3rpx #fe7b2e solid;
		margin-bottom: 30rpx;
		font-size: 28rpx;
		line-height: 66rpx;
		padding: 0rpx 2%;
		margin-right: 3%;
	}

	.Specifications-popup-munbar {
		width: 100%;
		height: auto;
		box-sizing: border-box;
		padding: 40rpx 5%;
		display: flex;
		justify-content: space-between;
	}

	.Specifications-popup-but {
		width: 100%;
		height: auto;
		display: flex;
		justify-content: space-between;
		padding: 20rpx 3%;
		box-sizing: border-box;
		border-top: 3rpx #eee solid;

		.addcart {
			background-color: #f49e0e;
		}

		.buy {
			background-color: #ff5251;
		}
	}

	.Specifications-popup-but label {
		text-align: center;
		color: #fff;
		width: 46%;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 80rpx;
	}

	.none {
		bottom: -100%;
	}

	.none .Specifications-popup {
		bottom: -100%;
		transition: all 0.5s;
	}

	.none .Specifications-mask {
		display: none;
		transition: all 0.5s;
	}


	.show {
		bottom: 0px;
	}

	.show .Specifications-popup {
		bottom: 0%;
		transition: all 0.5s;
	}

	.show .Specifications-mask {
		display: block;
		transition: all 0.5s;
	}

	.rmoiu {
		background: #ff8d00;
		color: #fff !important;
	}


	/* 规格选择弹窗 end */
</style>
