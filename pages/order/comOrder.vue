<template>
	<view class="content">
		<view class="order_list_box">
			<view class="order box_shadow" v-for="(item, index) in orderList" :key="index"
				@click="getDetailsTap(item.id)">
				<view class="goods_left" @click.stop="selectGoodsTap(index)">
					<aicon v-if="item.isChecked" type="roundcheckfill" color="#F54319" size="25"></aicon>
					<aicon v-else type="round" color="#eee" size="25"></aicon>
				</view>

				<view class="goods_box">
					<view class="goods" v-for="item2 in item.orderItemList" :key="item2.id">
						<view class="left">
							<image v-if="item2.goodsSpecification!==null" :src="item2.goodsSpecification.specificationImages" lazy-load="true" mode="aspectFill"></image>
							<image v-else :src="item2.previewUrl" lazy-load="true" mode="aspectFill"></image>
						</view>
						<view class="right">
							<view class="">
								<view class="title">{{item2.goodName}}</view>
								<view class="goodsSpecification" v-if="item2.goodsSpecification!==null" >
									<view class="text"
										v-for="(value,key) in JSON.parse(item2.goodsSpecification.specificationName)"
										:key="key">{{key+':'+value}}</view>
								</view>
							</view>
							<view class="box">
								<view class="">
									<view class="num" v-if="item2.goodsSpecification!==null" >{{item2.goodsSpecification.dealPrice}}<span>元</span></view>
									<view class="num" v-else >{{item2.goodsPrice}}</view>
								</view>
								<!-- <view></view> -->
								<view class="buy">x{{item2.goodsNum}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="none_list_box" v-if="orderList.length===0">
				<image src="../../static/images/none_data_icon_02.png" lazy-load="true" mode="widthFix"></image>
				<span>暂无相关订单</span>
			</view>
		</view>
		<backtop ref="VT" :scrollTop="top"></backtop>
		<view class="applyBtn">
			<view class="subBtn" @click="selectOrder()" >
				确定
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderPage: {
					page: 1,
					sizes: 10,
					total: 0
				},
				orderList: [],
				selOrderArr:[],
				top:0,
				selOrderList:[]
			}
		},
		onLoad() {

		},
		onShow() {
			this.getOrderList()
		},
		onPageScroll(e) {
			this.$refs.VT.topData(e.scrollTop)
		},
		onReachBottom() {
			let self = this;
			if (self.orderPage.total > self.orderPage.page) {
				self.orderPage.page++;
				self.getOrderList();
			}
		},
		methods: {
			getOrderList() {
				let self = this;
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				let postData = {
					startPage: self.orderPage.page,
					orderStatus: -1,
					commentState: -1
				}
				self.Get2('/api/order/searchUserOrderListByStatus', postData).then(res => {
					if (res.code === 200) {
						let datas = res.body;
						uni.hideLoading();
						self.orderPage.total = datas.pages;
						let data = res.body.list;
						data.forEach((value,index)=>{
							value.isChecked=false;
						})
						if (self.orderList.length > 0) {
							let list = self.orderList.concat(data);
							self.orderList = list;
						} else {
							self.orderList = data;
						}
						// console.log(self.orderList , '列表88888888888');
					}
				})
			},
			selectGoodsTap(index) {
				let self = this;
				let selArr = [];
				self.orderList[index].isChecked=!self.orderList[index].isChecked;
				let list2 =self.orderList.filter(item => item.isChecked == true);
				self.selOrderList=list2;
				
			},
			getDetailsTap(id) {
				uni.navigateTo({
					url: `/pages/order/orderDetail?id=${id}`
				})
			},
			selectOrder(){
				let self=this;
				let list=self.selOrderList;
				if(list.length>0){
					uni.$emit('selectOrder', list);
					uni.navigateBack();
				}else{
					uni.showToast({
						title:'您还未选择订单!',
						icon:'none'
					})
				}
				
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #fff;
	}
	.content{
		padding: 20rpx 0 60rpx 0;
		position: relative;
	}
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
	
	.order_list_box {
		width: 100%;
		min-height: 72vh;

		.order {
			width: 96%;
			margin: 0 auto;
			border-radius: 20rpx;
			background-color: #fff;
			margin-bottom: 30rpx;
			border-bottom: 3rpx solid #f5f5f5;
			display: flex;
			justify-content: space-around;
			align-items: center;
			box-sizing: border-box;
			padding-bottom: 25rpx;

			.head {
				display: flex;
				align-items: center;
				width: 92%;
				margin: 0 auto;
				height: 80rpx;
				justify-content: space-between;

				.left {
					color: #999;
					font-size: 28rpx;
					display: flex;
					align-items: center;

					span {
						background-color: #F54319;
						color: #fff;
						font-size: 24rpx;
						width: 36rpx;
						height: 36rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 6rpx;
						margin-left: 20rpx;
						line-height: 36rpx;
					}
				}
			}

			.goods_box {
				width: 92%;
				margin: 0 auto;
				background-color:  #f5f5f5;
				border-radius: 20rpx;
				margin-bottom: 5rpx;

				.goods {
					display: flex;
					align-items: center;
					padding: 20rpx 0;

					.left {
						width: 190rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						image {
							width: 150rpx;
							height: 150rpx;
							box-sizing: border-box;
							border-radius: 20rpx;
							background-color: #fff;
						}
					}

					.right {
						flex: 1;
						min-width: 0;
						height: 150rpx;
						display: flex;
						flex-direction: column;
						box-sizing: border-box;
						justify-content: space-between;
						position: relative;

						.goodsSpecification {
							position: relative;
							color: #666;
							width: 95%;
							font-size: 26rpx;
							display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
							-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
							-webkit-line-clamp: 2; //一个块元素显示的文本的行数
							overflow: hidden; //溢出隐藏
							// .text{

							// }
							.num {
								position: absolute;
								bottom: -70rpx;
								left: 0;
							}
						}

						.title {
							color: #1c1c1c;
							font-size: 28rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							width: 95%;

						}


						.box {
							display: flex;
							align-items: center;
							justify-content: space-between;
							width: 95%;
							padding-bottom: 10rpx;

							.num {
								color: #1c1c1c;
								font-size: 30rpx;
								display: flex;
								align-items: center;

								span {
									font-size: 26rpx;
									padding-left: 2rpx;
								}
							}

							.buy {
								color: #1c1c1c;
								padding: 0 10rpx;
								border-radius: 10rpx;
							}
						}
					}
				}
			}

			.foot {
				width: 92%;
				margin: 0 auto;
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 100rpx;

				.left {
					color: #1c1c1c;
					font-size: 28rpx;

					span {
						font-weight: bold;
						color: #f14b5b;
					}
				}

				.right {
					flex: 1;
					display: flex;
					justify-content: flex-end;

					.button {
						border: 1px solid #e5e5e5;
						color: #666;
						font-size: 28rpx;
						padding: 0 20rpx;
						border-radius: 100rpx;
						line-height: 28rpx;
						display: flex;
						align-items: center;
						height: 50rpx;
						position: relative;

						button {
							position: absolute;
							width: 100%;
							height: 100%;
							top: 0;
							left: 0;
							opacity: 0;
						}

						/deep/.u-count-down__text {
							font-size: 28rpx;
							color: #fff;
							padding-left: 4rpx;
						}
					}
				}
			}
		}
	}
</style>
