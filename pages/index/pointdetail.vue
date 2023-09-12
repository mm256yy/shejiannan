<template>
	<view class="content">
		<template v-if="goodsDict.id != null">
			<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item,index) in goodsImgArr" :key="index">
					<image :src="item" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<view class="goods-introduce common">
				<view class="goods-price" v-if="goodsDict.goodsType==0" >
					<view class="now-price">
						<text class="price-icon">￥</text>
						{{goodsDict.goodsPrice}}
					</view>
					<view class="old-price">
						￥{{goodsDict.scribePrice}}
					</view>
				</view>
				<view class="goods-price" v-if="goodsDict.goodsType==1" >
					<view class="now-price">
						<!-- <text class="price-icon">￥</text> -->
						{{goodsDict.goodsPrice}} <text style="font-weight: 500; font-size: 24rpx;margin-left: 10rpx;">积分</text> 
					</view>
				</view>
				<view class="goodsName">
					{{goodsDict.goodsName}}
				</view>

				<!-- 			<view class="member">
					<view class="member-left">
						加入会员,享会员价
						<text class="member-price">￥{{goodsDict.memberPrice || 0}}</text>
					</view>
					<view class="member-right">
						了解更多
					</view>
				</view> -->

				<view class="sales">
					销量{{goodsDict.totalSales}}
				</view>
				
				<view class="goodsCoupon" @click="show2=true" >
					<view class="goodsCoupon-left" v-if="couponList.length>0" >
						<view class="" v-if="couponList[0].couponType==0" >
							满{{couponList[0].howMuchFullMoney}}减{{couponList[0].couponDenomination}}
						</view>
						<view class="" v-if="couponList[0].couponType==3" >
							满{{couponList[0].howMuchFullMoney}}打{{couponList[0].couponDenomination}}折
						</view>
						<view class="" v-if="couponList[0].couponType==2" >
							{{couponList[0].couponDenomination}}积分
						</view>
					</view>
					<view class="" v-if="couponList.length==0" >
						<view class="" style="color: #aaa;" >
							暂无优惠券 
						</view>
					</view>
					<view class="goodsCoupon-right">
						<text>优惠券</text>
						<u-icon name="arrow-right" color="" size="14"></u-icon>
					</view>
				</view>
			</view>

			<!-- 		<view class="" style="width: 100%;">
				<specpopup :specifications="specifications1" :goodsDict="goodsDict" @changes="childClick"></specpopup>
			</view> -->

			<view class="Specification common" @click="shows=true">
				<view class="Specifications-left">
					<view class="select">选择</view>
					<view class="Specifications-text">
						请选择规格
					</view>
				</view>
				<u-icon name="arrow-right" size="14"></u-icon>
			</view>

			<!-- *************图文详情************* -->
			<view class="detail-img common">
				<view class="detail-img-text">
					<u-icon name="minus" color="#cecece" size="28"></u-icon>
					<view class="detail-img-title">
						图文详情
					</view>
					<u-icon name="minus" color="#cecece" size="28"></u-icon>
				</view>
				<view class="detail-content">
					<u-parse :content="goodsDict.goodsDetailsJson"></u-parse>
				</view>
			</view>
			<view class="suspension-block">
				<view class="cart" @click="Toswitch('/pages/cart/cart')">
					<u-icon name="shopping-cart" color="#434343" size="28"></u-icon>
				</view>
				<view class="cart">
					<button class="share-btn" open-type="share">
						<u-icon name="share" color="#434343" size="28"></u-icon>
					</button>
				</view>
				<view class="cart" v-if="isShow" @click="Totop()">
					<u-icon name="arrow-upward" color="#434343" size="28"></u-icon>
				</view>
			</view>
		</template>
		<!-- 详情底部 -->
		<!-- <view class="detail-bottom">
			<view class="detail-bottom-left">
				<view class="home" @click="Toswitch('/pages/index/index')">
					<u-icon name="home" color="#a9a9a9" size="18"></u-icon>
					<text>首页</text>
				</view>
				<view class="collect home" @click="addCollect()">
					<u-icon v-if="is_collect" name="star-fill" color="#e63f31" size="18"></u-icon>
					<u-icon v-else name="star" color="#a9a9a9" size="18"></u-icon>	
					<text>收藏</text>
				</view>
			</view>
			<view class="detail-bottom-right">
				<view class="addcart cartHeight" @click="shows=true">
					加入购物车
				</view>
				<view class="buy cartHeight" @click="shows=true">
					立即购买
				</view>
			</view>
		</view> -->
		<view class="content-bottom">
					<image class="logo" src="../../static/images/sjalogo.png" mode="aspectFill"></image>
					<view class="now-exchange" @click="shows=true" >
						立即兑换
					</view>
				</view>

		<!-- 规格选择弹窗 start -->
		<u-popup :show="shows" mode="bottom" @close="close" @open="open" >

			<view class="Specifications">
				<view class="Specifications-mask"></view>
				<view class="Specifications-popup">
					<view class="Specifications-popup-colse cuIcon-roundclose" @click="shows=false">
						<u-icon name="close-circle" size="24"></u-icon>
					</view>
					<view class="Specifications-popup-head">
						<view class="Specifications-popup-head-img">
							<image mode="widthFix" :src="sepcInfo.specificationImages"></image>
						</view>
						<view class="Specifications-popup-head-text">
							<!-- <view class="Specifications-popup-head-text-name">羽绒服</view> -->
							<view class="Specifications-popup-head-text-price"><label
									for=""></label><text>{{sepcInfo.dealPrice}} <text style="font-size: 24rpx;">积分</text> </text>
							</view>
							<view class="Specifications-popup-head-text-parameter">
								<text>库存:{{sepcInfo.stockNum}}</text>
							</view>
						</view>
					</view>
					<scroll-view scroll-y class="Specifications-huadong">
						<view class="Specifications-popup-sele" v-for="(item,index) in specifications" :key="index">
							<view class="Specifications-popup-sele-name">{{item.name}}</view>
							<view class="Specifications-popup-sele-list">
								<text :class=" item.start == index2 ?'rmoiu':'' " @click="morloe(index,index2)"
									v-for="(item2,index2) in item.children"
									:key="index2">{{item2.attributeValue}}</text>
							</view>
						</view>
					</scroll-view>
					<view class="Specifications-popup-munbar">
						<view class="Specifications-popup-munbar-name">购买数量</view>
						<view class="redmunber">
							<wm-numberBox model="2"></wm-numberBox>
							<u-number-box v-model="value" :min="1" :max="goodsDict.limitNum">
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
						<!-- <label class="addcart" @click="Jumpgwc">加入购物车</label> -->
						<label class="buy" @click="lijiGoumai">立即兑换</label>
					</view>
				</view>
			</view>
		</u-popup>
		<!-- 规格选择弹窗 end -->
		<!-- 优惠券弹窗 -->
		<u-popup :show="show2" :round="10" mode="bottom" @close="show2=false" @open="show2=true">
			
				<view style="padding: 20rpx 28rpx;box-sizing: border-box;">
		           <view style="display: flex;align-items: center;justify-content: space-between;width: 96%;margin:20rpx auto;" >
					   <view></view>
					  <text>选择优惠券</text> 
					  <u-icon @click="show2=false" name="close-circle"  size="28"></u-icon>
				   </view>
				   <!-- ************选择优惠券************************** -->
				   <scroll-view style="width: 100%;
		max-height: 600rpx;
		"  scroll-y="true" >
						<view class="couponBox" v-for="item in couponList" :key="item.id" >
							<view class="couponBox-left">
								<view style="width: 100%;" v-if="item.couponType!==2" >
									<view class="limituse" v-if="item.goodsType==1" >全部商品可用</view>
									<view class="limituse" v-if="item.goodsType==2" >指定商品可用</view>
								</view>
								<view style="width: 100%;" v-if="item.couponType==2" >
									<view class="limituse" >积分商品可用</view>
									
								</view>
								<view>
									<view class="couponMoney" v-if="item.couponType==0" > <text style="font-size: 28rpx;">￥</text> {{item.couponDenomination}} </view>
									<view class="couponMoney" v-else-if="item.couponType==2" >  {{item.couponDenomination}}<text style="font-size: 28rpx;">积分</text></view>
									<view class="couponMoney" v-else-if="item.couponType==3" >  {{item.couponDenomination*10}} <text style="font-size: 28rpx;">折</text></view>
								</view>
								<view>
									<view class="couponType" v-if="item.couponType==0" >满减券</view>
									<view class="couponType" v-else-if="item.couponType==2" >积分券</view>
									<view class="couponType" v-else-if="item.couponType==3" >折扣券</view>
								</view>
							</view>
							<view class="couponBox-right">
								<view class="couponName">
									<view class="couponName-left">【{{item.couponName}}】</view>
									<view>
										<view class="couponName-right" v-if="item.couponType==0" >满{{item.howMuchFullMoney}}减{{item.couponDenomination}}</view>
										<view class="couponName-right" v-if="item.couponType==2" >{{item.couponDenomination}}积分</view>
										<view class="couponName-right" v-if="item.couponType==3" >{{item.couponDenomination*10}}折</view>
									</view>
								</view>
								<view class="">
									<view class="limitTime" v-if="item.timeType==1" >{{item.startTime}}~{{item.endTime}}</view>
									<view class="limitTime" v-else-if="item.timeType==2">领取后{{item.timeDay}}天内有效</view>
								</view>
								<view class="couponExplain">
									<view class="couponExplain-left">有效期内使用</view>
									<view v-if="item.couponType!==2" >
										<view class="couponExplain-right" v-if="item.receiveStatus==false" @click="getCoupon(item.id)">领取</view>
										<view class="couponExplain-right" v-if="item.receiveStatus==true" style="background-color: #e9ebec;color: #696a6c;"  @click="">已领取</view>
										
										<!-- <view class="couponExplain-right"  v-if="item.couponType=3" @click="">使用</view> -->
									</view>
								
								</view>
							</view>
						</view>
				   </scroll-view>
				   
				</view>
		</u-popup>
	</view>
</template>

<script>
	import JSONBig from 'json-bigint'
	const app = getApp();
	export default {
		data() {
			return {
				id: '',
				template: '',
				isShow: false,
				goodsDict: {},
				specifications1: {},
				shows: false,
				value: 1,
				goodsImage: "",
				dealPrice: 0,
				stockNum: 0,
				current:0,
				// goodsDict: {},
				specifications: {},
				goodsImgArr: [],
				businessId: '',
				is_collect:false,
				collectList:[],
				sepcInfo:'',
				arr2:[],
				selectSpec:'',
				SpecList:[],
				SpecList2:[],
				couponList:[],
				show2:false
			}
		},
		onLoad(options) {
			let self = this;
			// self.getbussinessId();
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

			uni.setNavigationBarTitle({
				title: self.goodsDict.goodsName
			});
			
		},
		onShow() {
			let self = this;
			self.getbussinessId();
			self.getCouponList();
		},
		onPageScroll(e) {
			if (e.scrollTop > 200) {
				this.isShow = true;
			} else {
				this.isShow = false;
			}
		},
		onShareAppMessage() {
			let path = `/pages/index/detail?id=${self.id}`
			return {
				title: self.goodsDict.goodsName,
				imageUrl: self.goodsDict.previewUrl,
				path: path
			}
		},
		methods: {
			getCoupon(id){
				let self=this;
				let token = uni.getStorageSync('__ddminiUserInfo').accessToken;
				if(token){
					self.Post('/api/plugs/receiveCoupons',{couponsId:id}).then(res=>{
						if(res.code==200){
							uni.showToast({
								icon:'none',
								title:'领取成功'
							})
							self.getCouponList();
							this.show2=false;
						}else{
							uni.showToast({
								icon:'none',
								title:res.msg
							})
						}
					})
				}else{
					uni.showModal({
						title: '提示',
						content: '您还未登录,登录才能领取哦!',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									url:'/pages/user/login'
								})
							} else if (res.cancel) {
							}
						}
					});
				}
			},
			getCouponList(){
				this.Get('/api/plugs/getGoodesCouponsList',{goodsId:this.id}).then(res=>{
					if(res.code==200){
						this.couponList=res.body;
						console.log(res,'商品优惠券列表')
					}
				})
			},
			Topath(route) {
				uni.navigateTo({
					url: route
				})
			},
			Toswitch(route) {
				uni.switchTab({
					url: route
				})
			},
			Totop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			getbussinessId() {
				let self = this;
				self.Get2('/api/plugs/getBusinessInfo').then(res => {
					if (res.code == 200) {
						let list = res.body;
						let listArr = [];
						list.forEach((item) => {
							listArr.push(JSONBig.parse(item.jsonData))
						})
						self.BusinessList = listArr;
						self.businessId = self.BusinessList[0].businessId;
						// console.log(self.businessId,'店铺ID')
						self.initData();
						
					}
				})
			},
			getcollectList(){
				let self=this;
				let postdata={
					businessId:this.businessId.toString(),
					page:1,
					size:50
				}
				self.Get('/api/plugs/searchPlugsCollectByUserId',postdata).then(res=>{
					if(res.code==200){
						let list2=res.body.list;
						self.collectList = list2.filter(itm => itm.dataId === this.goodsDict.id);
						if(self.collectList.length>0){
							self.is_collect=true;
						}
					}
				})
			},
			addCollect() {
				let self = this;
				let data = uni.getStorageSync('__ddminiUserInfo');
				let token = uni.getStorageSync('__ddminiUserInfo').accessToken;
				let postdata = {
					"businessId":this.businessId.toString(),
					"dataId": this.goodsDict.id,
					"types": 0,
				}
				if (token == null) {
					uni.showModal({
						title: '提示',
						content: '登录才能添加宝贝哦~',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/user/login'
								})
							} else if (res.cancel) {
							}
						}
					});
				} else{
					self.Post2('/api/plugs/insertPlugsCollect',postdata).then(res=>{
						if(res.code==200){
							self.is_collect=!self.is_collect;
							if(self.collectList.length==0){
								uni.showToast({
									title: '收藏成功',
									duration: 500
								});
								self.getcollectList()
							}else{
								uni.showToast({
									title: '取消收藏',
									duration: 500
								});
							}
							
						}
					})
				}
			},
			
			initData() {
				let self = this;
				self.Get(`/api/plugs/searchPlugsGoodsById?id=${this.id}`).then(res => {
					if (res.code == 200) {
						let data = res.body
						this.goodsDict = data;
						this.goodsImgArr = JSON.parse(data.rotationImgsJson)
						uni.setNavigationBarTitle({
							title: data.goodsName
						});
						self.getcollectList();
					}
				})
				self.Get('/api/plugs/searchPlugsGoodsSpecificationByGoodsId',{goodsId:this.id}).then(res => {
					if (res.code == 200) {
						let datas=res.body;
						self.SpecList=datas.plugsGoodsSpecificationList;
						let list6=JSON.parse(JSON.stringify(self.SpecList))
						self.SpecList2=list6
						let specifications1 = []
						let tempSpecifications = datas.specificationInfo;
						console.log(datas,'datas')
						for (let item of tempSpecifications) {
							let obj1 = {
								start:0,
								name:Object.keys(item)[0],
								children: Object.values(item)[0]
							}
							specifications1.push(obj1)
						}
						this.specifications = specifications1;
						let arr=[]
						let arr2=[]
						this.specifications.forEach(item=>{
							arr.push(item.name)
							arr2.push(item.children[0].attributeValue)
						})
						let obj6={}
						for (let i=0;i<arr.length;i++){
							obj6[arr[i]]=arr2[i]
						}
						// console.log(obj6,'66666')
						self.selectSpec=obj6;
						// console.log(arr,'777777')
						let j2=JSON.stringify(obj6)
						self.sepcInfo=self.SpecList2.find(item=> item.specificationName===j2+'')
						// self.sepcInfo=self.SpecList2.find(item=>JSON.parse(item.specificationName) ===obj6)
						// console.log(self.sepcInfo,'888888')
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
					}
				})
			},

			childClick(key, index2) {
				this.specifications1[key]['start'] = index2
			},
			morloe(index,index2) {
				let self=this;
				let key=this.specifications[index].name;
				let name=this.specifications[index].children[index2].attributeValue;
				let obj=self.selectSpec;
				obj[key]=name;
				let obj2=JSON.stringify(obj)
				let list=JSON.parse(JSON.stringify(self.SpecList))
				self.sepcInfo=list.find(item=>item.specificationName===obj2+'')
				console.log(self.sepcInfo,'11111')
				this.specifications[index]['start'] = index2
			},
			open() {},
			close() {
				this.shows = false
			},
			Jumpgwc() {
				let token = uni.getStorageSync('__ddminiUserInfo').accessToken;
				if (token == null) {
					uni.showModal({
						title: '提示',
						content: '登录才能添加宝贝哦~',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/user/login'
								})
							} else if (res.cancel) {
								// console.log('用户点击取消');
							}
						}
					});

				} else {
					this.shows = false;
					let self = this;
					let postData = {
						goodsId:this.id,
						goodsCategoryId: this.goodsDict.categoryId,
						goodsNum: this.value,
						goodsSpecificationIds:self.sepcInfo.id,
						businessId: this.businessId.toString(),
					};
					self.Post2('/api/plugs/insertPlugsShopCart', postData).then(res => {
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
			},
			lijiGoumai() {
				let self = this;
				this.shows = false
				let goodsSpecificationIds = []
				let goodsSpecification = []
				if(self.sepcInfo!=null){
					goodsSpecification.push(self.sepcInfo)
				}
				let postData = {
					goodsId: this.goodsDict.id,
					goodsCategoryId: this.goodsDict.categoryId,
					goodsNum: this.value,
					goodsSpecificationIds: self.sepcInfo.id,
					goodsSpecification: goodsSpecification,
					businessId: this.businessId,
					goodsName: this.goodsDict.goodsName,
					userId: uni.getStorageSync('__ddminiUserInfo').id || 0
				};
				// console.log("postData",postData)
				let token = uni.getStorageSync('__ddminiUserInfo').accessToken;
				if (token) {
					uni.setStorage({
						key: '__ddminiShopCart',
						data: [postData]
					});
					uni.navigateTo({
						url: '/pages/order/paypal?score=1'
					});
				} else {
					uni.navigateTo({
						url: '/pages/user/login'
					});
				}
			}
		}
	}
</script>

<style lang="less">
	// 优惠券样式
	.couponBox{
		width: 94%;
		height:180rpx;
		margin: auto;
		margin-bottom: 12rpx;
		// border-radius: 8rpx;
		display: flex;
		border: 3rpx solid #e6b4b6;
		.couponBox-left{
			width: 180rpx;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			padding-bottom: 20rpx;
			border-right: 3rpx solid #f5f5f5;
			.limituse{
				width: 100%;
				text-align: center;
				padding: 6rpx 0;
				font-size: 24rpx;
				background-color: #fad8d8;
				color:#d75057;
			}
			.couponMoney{
				color: #d75057;
				font-weight: 600;
				font-size: 42rpx;
			}
		}
		.couponBox-right{
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-around;
			// align-items: center;
			padding: 16rpx 26rpx;
			box-sizing: border-box;
			.couponName{
				display: flex;
				font-weight: bold;
			}
			.limitTime{
				font-size: 24rpx;
				color: #aaa;
			}
			.couponExplain{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.couponExplain-right{
					width: 160rpx;
					height: 60rpx;
					border-radius: 40rpx;
					text-align: center;
					line-height: 60rpx;
					background-color: #fad8d8;
					color: #d8696f;
				}
			}
		}
	}
	.goodsCoupon{
		display: flex;
		margin-top: 20rpx;
		justify-content: space-between;
		align-items: center;
		.goodsCoupon-right{
			display: flex;
			align-items: center;
		}
		.goodsCoupon-left{
			background-color: #e74032;
			color: #fff;
			text-align: center;
			padding: 6rpx 18rpx;
			border-radius: 40rpx;
			font-size: 26rpx;
		}
	}
	.content-bottom{
			width: 100%;
			box-sizing: border-box;
			padding: 0rpx 28rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #fff;
			height: 130rpx;
			border-top: 3rpx solid #e9e9e9;
			position: fixed;
			bottom: 0;
			left: 0;
			.logo{
				width: 200rpx;
				height: 80rpx;
			}
			.now-exchange{
				width: 220rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
				background-color: #df282f;
				color: #fff;
				border-radius: 40rpx;
			}
		}
		
	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		// padding-bottom: 120rpx;

		.swiper {
			width: 100%;
			height: 500rpx;
		}

		.common {
			width: 96%;
			background-color: #fff;
			border-radius: 16rpx;
			box-shadow: 0px 0px 8px 0px rgba(207, 207, 207, 0.5);
		}

		.goods-introduce {
			padding: 26rpx 18rpx;
			margin: 20rpx auto;
			box-sizing: border-box;

			.goods-price {
				display: flex;
				align-items: center;

				.now-price {
					color: #ff4544;
					font-size: 40rpx;
					font-weight: 600;
					margin-right: 30rpx;

					.price-icon {
						font-weight: 400;
						font-size: 26rpx;
					}
				}

				.old-price {
					color: #999999;
					text-decoration: line-through;
				}
			}

			.goodsName {
				font-size: 30rpx;
				// overflow: hidden;
				// white-space: normal;
				// text-overflow: ellipsis;
				margin: 16rpx 0;
				display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
				-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
				-webkit-line-clamp: 2;  //一个块元素显示的文本的行数
				overflow: hidden; //溢出隐藏
			}

			.member {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 80rpx;
				padding: 0 12rpx;
				box-sizing: border-box;
				border-radius: 16rpx;
				background-color: #faf2d8;

				.member-price {
					color: #ff4544;
					font-weight: 600;
				}
			}

			.sales {
				color: #a3a3a3;
				font-size: 26rpx;
				margin-top: 20rpx;
			}
		}

		.evaluate {
			padding: 18rpx;
			box-sizing: border-box;
			margin: 20rpx auto;
		}

		.detail-img {
			padding-bottom: 120rpx;
			margin: 20rpx auto;

			.detail-img-text {
				height: 100rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				.detail-img-title {
					margin: 0 40rpx;
				}
			}
		}

		.suspension-block {
			width: 100rpx;
			position: fixed;
			bottom: 260rpx;
			right: 30rpx;

			.cart {
				width: 70rpx;
				height: 70rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 100%;
				border: 3rpx solid #d0d0d0;
				margin-bottom: 20rpx;
				background-color: rgba(255, 255, 255, 0.4);

				button::before {
					border: none;
				}

				.share-btn {
					width: 70rpx;
					height: 70rpx;
					border-radius: 100%;
					display: flex;
					justify-content: center;
					margin: 0 !important;
					padding: 0 !important;
					align-items: center;
					background-color: rgba(255, 255, 255, 0.4) !important;
				}
			}
		}

		.detail-bottom {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: fixed;
			bottom: 0;
			left: 0;
			height: 100rpx;
			background-color: #fff;
			box-sizing: border-box;
			padding: 0 20rpx;

			.detail-bottom-left {
				display: flex;

				.home {
					display: flex;
					flex-direction: column;
					align-items: center;
					color: #a3a3a3;
					font-size: 22rpx;
					margin-right: 32rpx;
				}
			}

			.detail-bottom-right {
				display: flex;

				.cartHeight {
					width: 260rpx;
					height: 70rpx;
					text-align: center;
					line-height: 70rpx;
					color: #fff;
				}

				.addcart {
					background-color: #f49b08;
					border-radius: 40rpx 0 0 40rpx;
				}

				.buy {
					background-color: #ff4e4d;
					border-radius: 0 40rpx 40rpx 0;
				}
			}
		}
	}

	.contentSub {
		width: 100%;
	}

	.Specification {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 18rpx;
		height: 120rpx;

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
		justify-content: center;
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
		width: 80%;
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
