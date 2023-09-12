<template>
	<view class="content" @click="close">
		<view class="paypal_box">
			<view class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>提货方式</span>
					</view>
					<view class="right"></view>
				</view>
				<view class="delivery_box">
					<u-radio-group v-model="deliveryType" placement="row">
						<u-radio v-for="(item, index) in delivery" :key="index" activeColor="#F54319" :name="item.id"
							:label="item.name" shape="square"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="menu_box box_shadow" v-if="logisticsType==2">
				<view class="head">
					<view class="left">
						<span>收货地址</span>
					</view>
					<view class="right">
						<span v-if="addressData"
							@click="getPathTap('/pages/user/addressEdit?id='+addressData.id)">编辑地址</span>
						<span v-else @click="getPathTap('/pages/user/addressList?type=select')">请选择收货地址</span>
					</view>
				</view>
				<view class="address_box" @click="getPathTap('/pages/user/addressList?type=select')">
					<view v-if="addressData" class="address">
						<view class="left">
							<view class="tit">{{addressData.name}}<span>{{addressData.mobile}}</span>
							</view>
							<view class="txt">
								{{addressData.province}}{{addressData.city}}{{addressData.district}}{{addressData.address}}
							</view>
						</view>
						<view class="right">
							<aicon type="arrow-right-s-line" size="25" color="#999"></aicon>
						</view>
					</view>
					<view v-else class="none_address">
						<aicon type="location" size="25"></aicon>
						<span>选择地址</span>
					</view>
				</view>
			</view>
			<!-- *************自提信息***************** -->
			<view class="Selfpickup" style="width: 100%; background-color: #fff;padding: 0 5%;box-sizing: border-box;">
				<view class="uni-form-item uni-column"
					style="display: flex;justify-content: space-between;height: 90rpx;align-items: center;font-size: 28rpx;">
					<view class="title">自提联系人</view>
					<input style="flex: 1;text-align: right;" class="uni-input" v-model="selfaddress.name"
						placeholder="请输入联系人" />
				</view>
				<view class="uni-form-item uni-column"
					style="display: flex;justify-content: space-between;height: 90rpx;align-items: center;font-size: 28rpx;">
					<view class="title">预留电话</view>
					<input style="flex: 1;text-align: right;" class="uni-input" v-model="selfaddress.mobile"
						placeholder="请输入联系人电话" />
				</view>
				<view class="uni-form-item uni-column"
					style="display: flex;justify-content: space-between;height: 90rpx;font-size: 28rpx;">
					<view class="title">自提点</view>
					<view class="">
						<view style="font-weight: bold; text-align: right;">{{addressInfo.businessName}}</view>
						<view style="font-size: 24rpx; color:#aeb0b5;">
							{{addressInfo.businessAddress.province}}{{addressInfo.businessAddress.city}}{{addressInfo.businessAddress.district}}{{addressInfo.businessAddress.address}}
						</view>
					</view>
					<!-- <input style="flex: 1;text-align: right;" class="uni-input" focus placeholder="请输入联系人电话" /> -->
				</view>
				<view class="uni-form-item uni-column"
					style="display: flex;justify-content: space-between;height: 90rpx;align-items: center;font-size: 28rpx;">
					<view class="title">自提时间</view>

					<!-- <input @click="show=true" disabled v-model="pickupTime"  style="flex: 1;text-align: right;" class="uni-input"
						placeholder="请选择自提时间" /> -->
					<view class="" style="z-index: 999;" >
						<uni-datetime-picker :clear-icon="false" type="datetime" placeholder="请选择自提时间"  @change="changeLog" />
					</view>
				</view>
				<view class="uni-form-item uni-column"
					style="display: flex;justify-content: space-between;height: 90rpx;align-items: center;font-size: 28rpx;">
					<view class="title">优惠券</view>
					<view class="" v-if="useCouponId" @click="show2=true" style="color: #e74032;font-size: 24rpx;font-weight: bold;" >
						<view v-if="selectCoupon.couponType!==2">
							已享满{{selectCoupon.plugsCoupons.howMuchFullMoney}}减{{selectCoupon.plugsCoupons.couponDenomination}}
						</view>
						<view v-if="selectCoupon.couponType==2">
							已享减{{selectCoupon.plugsCoupons.couponDenomination}}积分
						</view>
					</view>
					<view class="" v-else >
						<view class="" style="flex:1;text-align:right;" v-if="couponList.length==0" >
							暂无优惠券
						</view>
						<view class="" @click="show2=true" style="flex:1;text-align:right;color: #e74032;font-size: 24rpx;font-weight: bold;" v-if="couponList.length>0" >
							请选择优惠券
						</view>
					</view>
				</view>
			</view>
			<view class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>商品信息</span>
					</view>
					<view class="right">
						<!-- 共{{cardNumTotal}}件商品 -->
					</view>
				</view>
				<view class="goods_box">
					<view class="goods" v-for="(item, index) in shopCartList" :key="index">
						<view class="left">
							<image v-if="item.goodsSpecification.length>0" :src="item.goodsSpecification[0].specificationImages" lazy-load="true"
								mode="aspectFill"></image>
							<image v-else-if="item.previewUrl" :src="item.previewUrl" lazy-load="true"
								mode="aspectFill"></image>
							<image v-else-if="item.plugsGoods" :src="item.plugsGoods.previewUrl" lazy-load="true"
								mode="aspectFill"></image>
						</view>
						<view class="right">
							<view v-if="item.goodsName" class="title">{{item.goodsName}}</view>
							<view v-else class="title">{{item.plugsGoods.goodsName}}</view>
							<view class="goodsSpec" v-if="item.goodsSpecification.length>0" >
								<view v-for="(value,key) in JSON.parse(item.goodsSpecification[0].specificationName)"
									:key="key">
									{{key+':'+value}}
								</view>
							</view>
							<view class="price">
								<view class="">
									<view class="num" v-if="scoreType==1" >{{item.goodsSpecification[0].dealPrice}}<span>积分</span></view>
									<view class="num" v-else >￥{{item.goodsSpecification[0].dealPrice}}<span>元</span></view>
								</view>
								<view class="buy">x{{item.goodsNum}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="menu_box box_shadow">
				<view class="head">
					<view class="left">
						<span>支付信息</span>
					</view>
					<view class="right"></view>
				</view>
				<view class="order_info_box">
					<view class="order_head">
						<view class="label">
							<view class="tit">商品合计</view>
							<view class="">
								<view class="txt" v-if="scoreType==0" >¥{{goodsTotal}}</view>
								<view class="txt" v-else-if="scoreType==1" >{{goodsTotal}}积分</view>
							</view>
							
						</view>
					</view>
					<view class="order_foot">
						<view class="label">
							<view class="tit">实际应付</view>
							<view class="">
								<view class="txt" v-if="scoreType==0" >¥{{goodsTotal}}</view>
								<view class="txt" v-else-if="scoreType==1" >{{goodsTotal}}积分</view>
							</view>
						</view>
					</view>
					<view class="order_foot" v-if="useCouponId" >
						<view class="label">
							<view class="tit">优惠金额</view>
							<view class="txt">¥{{selectCoupon.plugsCoupons.couponDenomination}}</view>
						</view>
					</view>
					<view class="order_foot">
						<view class="label">
							<view class="tit">订单备注</view>
							<input type="text" v-model="ordermark" style="width: 76%;text-align: right;font-weight: 400;" placeholder="订单备注" >
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <paypalType :paypalShow="paypalShow" :money="userData.moneys" :countDownTime="orderData.count_down_time" @close="paypalShow=false" @paypal="getPaypalOrder"></paypalType> -->
		<u-popup :show="paypalShow" mode="bottom" :round="10" @close="close()">
			<view class="showBox">
				<view class="pheader">请选择支付方式</view>
				<view class="paypalList">
					<!-- 微信支付 -->
					<view class="paypal" v-if="scoreType==''" @click="getPaypalOrder()">
						<view class="paypal-left">
							<view class="left">
								<aicon type="weixin1" size="30" color="#00c250"></aicon>
							</view>
							<view class="right">
								<view class="title">微信支付</view>
								<view class="info">简单快捷，推荐使用</view>
							</view>
						</view>
						<view class="icon">
							<aicon type="unfold-copy" size="18" color="#e2e2e2"></aicon>
						</view>
					</view>
					<!-- 余额支付-->
					<view style="margin: 20rpx auto;" class="paypal" v-if="scoreType==''" @click.stop="balancePay()">
						<view class="paypal-left">
							<view class="left">
								<aicon type="moneybagfill" size="30" color="#ff2a36"></aicon>
							</view>
							<view class="right">
								<view class="title">余额支付</view>
								<view class="">
									<view  class="info" >可用余额：¥{{balanceMoney}}</view>
									<!-- <view  class="info" v-else >可用余额：¥0</view> -->
								</view>
								
							</view>
						</view>
						<view class="icon">
							<aicon type="unfold-copy" size="18" color="#e2e2e2"></aicon>
						</view>
					</view>
					<!-- 积分支付 -->
					<view class="paypal" v-if="scoreType==1" @click="scorePay()">
						<view class="paypal-left">
							<view class="left">
								<u-icon name="photo" color="#2979ff" size="28"></u-icon>
							</view>
							<view class="right">
								<view class="title">积分支付</view>
								<view  class="info">可用积分：{{integral}}</view>
							</view>
						</view>
						<view class="icon">
							<aicon type="unfold-copy" size="18" color="#e2e2e2"></aicon>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		<view class="seat_box">
			<view class="seat"></view>
		</view>
		<view class="footer box_shadow">
			<view class="label">
				<view class="button" @click="paypalOrderTap('form')" style="backgroundColor: #F54319;">
					<span>确认下单并支付</span>
				</view>
				<!-- 	<button>确认下单并支付</button> -->
			</view>
		</view>
		<u-datetime-picker @close="show=false" @confirm="datetime()" @cancel="show=false" :show="show" mode="datetime">
		</u-datetime-picker>
		
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
								<view style="width: 100%;" v-if="item.plugsCoupons.couponType!==2" >
									<view class="limituse" v-if="item.plugsCoupons.goodsType==1" >全部商品可用</view>
									<view class="limituse" v-if="item.plugsCoupons.goodsType==2" >指定商品可用</view>
								</view>
								<view style="width: 100%;" v-if="item.plugsCoupons.couponType==2" >
									<view class="limituse" >积分商品可用</view>
									
								</view>
								<view>
									<view class="couponMoney" v-if="item.couponType==0" > <text style="font-size: 28rpx;">￥</text> {{item.plugsCoupons.couponDenomination}} </view>
									<view class="couponMoney" v-else-if="item.couponType==2" >  {{item.plugsCoupons.couponDenomination}}<text style="font-size: 28rpx;">积分</text></view>
									<view class="couponMoney" v-else-if="item.couponType==3" >  {{item.plugsCoupons.couponDenomination*10}} <text style="font-size: 28rpx;">折</text></view>
								</view>
								<view>
									<view class="couponType" v-if="item.plugsCoupons.couponType==0" >满减券</view>
									<view class="couponType" v-else-if="item.plugsCoupons.couponType==2" >积分券</view>
									<view class="couponType" v-else-if="item.plugsCoupons.couponType==3" >折扣券</view>
								</view>
							</view>
							<view class="couponBox-right">
								<view class="couponName">
									<view class="couponName-left">【{{item.couponName}}】</view>
									<view>
										<view class="couponName-right" v-if="item.couponType==0" >满{{item.plugsCoupons.howMuchFullMoney}}减{{item.plugsCoupons.couponDenomination}}</view>
										<view class="couponName-right" v-if="item.couponType==2" >{{item.plugsCoupons.couponDenomination}}积分</view>
										<view class="couponName-right" v-if="item.couponType==3" >{{item.plugsCoupons.couponDenomination*10}}折</view>
									</view>
								</view>
								<view class="">
									<view class="limitTime" v-if="item.plugsCoupons.timeType==1" >{{item.plugsCoupons.startTime}}~{{item.plugsCoupons.endTime}}</view>
									<view class="limitTime" v-else-if="item.plugsCoupons.timeType==2">领取后{{item.plugsCoupons.timeDay}}天内有效</view>
								</view>
								<view class="couponExplain">
									<view class="couponExplain-left">有效期内使用</view>
									<view v-if="item.couponType!==2" >
										<view class="couponExplain-right" v-if="goodsTotal>=item.plugsCoupons.howMuchFullMoney" @click="useCoupon(item.couponId)">使用</view>
										<view class="couponExplain-right" style="background-color: #e9ebec;color: #696a6c;" v-if="goodsTotal<item.plugsCoupons.howMuchFullMoney" @click="">使用</view>
										
										<!-- <view class="couponExplain-right"  v-if="item.couponType=3" @click="">使用</view> -->
									</view>
									<view v-if="item.couponType==2" >
										<view class="couponExplain-right" v-if="goodsTotal>=item.plugsCoupons.howMuchFullMoney & scoreType==1" @click="useCoupon(item.couponId)">使用</view>
										<view class="couponExplain-right" style="background-color: #e9ebec;color: #696a6c;" v-if="goodsTotal<item.plugsCoupons.howMuchFullMoney" @click="">使用</view>
										
										<!-- <view class="couponExplain-right"  v-if="item.couponType=3" @click="">使用</view> -->
									</view>
									<view v-if="item.couponType== !2 && item.item.plugsCoupons.goodsType==2">
										<view class="couponExplain-right" v-if="appointMoney>=item.plugsCoupons.howMuchFullMoney" @click="useCoupon(item.couponId)">使用</view>
										<view class="couponExplain-right" style="background-color: #e9ebec;color: #696a6c;" v-if="appointMoney<item.plugsCoupons.howMuchFullMoney" @click="">使用</view>
										
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
	import md5 from "../../static/utils/md5.js"
	import JSONBig from 'json-bigint'
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				shopInfoData: uni.getStorageSync('__ddminiShopInfo'),
				shopCartList: uni.getStorageSync('__ddminiShopCart'),
				openId: uni.getStorageSync('__ddminiUserOpenid'),
				businessId: uni.getStorageSync('__ddminiStoreInfo').businessId,
				UserInfo:uni.getStorageSync('__ddminiUserInfo'),
				goodsTotal: -1,
				cardNumTotal: 0,
				couponsIndex: -1,
				couponsList: [],
				addressData: '',
				addressIndex: '', // 地址下标
				orderInfo: '',
				goodsOrderList: [],
				deliveryType: 2,
				userPhoneNumber: '',
				orderType: '',
				pintuanId: '',
				addCartInfo: [],
				list: [],
				payList:{},
				goodsScoreStatus: false,
				paypalShow: false,
				time: '',
				userData: '',
				addressList: [],
				// businessId:'',
				cartListId: [], // 购物车ID列表
				delivery: [{
					"name": '自提',
					"id": 2
				}],
				logisticsType: 3,
				addressInfo: {}, // 店铺地址
				selfaddress: {
					"default": true,
					"address": "",
					"province": "",
					"city": "",
					"district": "",
					"latitude": 0,
					"name": "",
					"mobile": "",
					"longitude": 0,
					"order": 0,
				},
				show: false, // 控制时间弹框
				value1: Number(new Date()),
				pickupTime: '',
				show2:false,
				couponList:[],
				useCouponId:'', // 使用优惠券ID
				selectCoupon:{}, // 选择优惠券的信息
				balanceMoney:0,// 余额
				scoreType:0,
				integral:0,
				appointMoney:0,
				ordermark:''
				
			}
		},
		onShow() {
			let self = this;
			this.openId = uni.getStorageSync('__ddminiUserOpenid');
			let address=uni.getStorageSync('__zitiaddress');
			if(address!=null){
				self.selfaddress.name=address.name;
				self.selfaddress.mobile=address.mobile;
			}
			self.getbussinessId();
			// console.log(self.shopCartList,'88888888888列表7777')
		},
		onLoad(e) {
			let self = this;
			let cart = self.shopCartList;
			console.log(e,'888888888888888888')
			let nums = 0;
			let mony = 0;
			let goods = [];
			self.scoreType=e.score;
			let goods3 = []
			cart.forEach(itm => {
				nums += itm.goodsNum;
				mony += itm.goodsSpecification[0].dealPrice * itm.goodsNum;
				let goods2 = []
				let goods4 = []
				if (itm.id != null) {
					goods3.push(itm.id)
				}
				itm.goodsSpecification.forEach(itm2 => {
					goods2.push(itm2.id);
					goods4.push(itm2.specificationName)
					if (itm.ctype === 'score') {
						self.goodsScoreStatus = true;
					}
				})
				goods.push({
					goodsId: itm.goodsId,
					goodsNum: itm.goodsNum,
					goodsName: !itm.plugsGoods ? itm.goodsName : itm.plugsGoods.goodsName,
					goodsSpecificationIds: goods2.toString(),
					goodsSpecificationNames: goods4.toString()
				});
			})
			self.cardNumTotal = nums;
			self.goodsTotal = mony.toFixed(2);
			self.goodsOrderList = goods;
			self.cartListId = goods3;
			self.getcouponList();
			self.getInfo();
		},
		methods: {
			changeLog(e){
				this.pickupTime=e;
			},
			getInfo() {
				let self = this;
				let id = self.UserInfo.id
				self.Get('/api/user/searchUserInfoById', {
					userId: id
				}).then(res => {
					if (res.code == 200) {
						self.userInfo = res.body;
						self.balanceMoney=res.body.balance;
						self.integral=res.body.integral;
					}
				})
			},
			useCoupon(id){
				let self=this;
				let ids=id;
				let list=self.couponList;
				self.show2=false;
				self.useCouponId=id;
				let selCoupon=list.filter(item=>item.couponId==ids);
				self.selectCoupon=selCoupon[0];
				let goodstype=self.selectCoupon.plugsCoupons.goodsType
				if(goodstype==1){
					if(selCoupon[0].couponType==0 || selCoupon[0].couponType==2){
						let num=self.goodsTotal-selCoupon[0].plugsCoupons.couponDenomination;
						self.goodsTotal=num.toFixed(2);
					}else if(selCoupon[0].couponType==3){
						let num2=self.goodsTotal*selCoupon[0].plugsCoupons.couponDenomination;
						self.goodsTotal=num2.toFixed(2);
					}
				}else{
					if(selCoupon[0].couponType==0){
						let money1=self.goodsTotal-self.appointMoney;
						let money2=self.appointMoney-selCoupon[0].plugsCoupons.couponDenomination;
						self.goodsTotal= money1+money2
					}else if(selCoupon[0].couponType==3){
						let money1=self.goodsTotal-self.appointMoney;
						let money2=self.appointMoney*selCoupon[0].plugsCoupons.couponDenomination;
						self.goodsTotal= money1+money2
						self.goodsTotal=self.goodsTotal.toFixed(2);
					}
				}
			},
			getcouponList() {
				let self = this;
				let postdata = {
					businessId: self.businessId,
					status: 0
				}
				self.Get('/api/plugs/searchPlugsCouponsByUserId', postdata).then(res => {
					if (res.code == 200) {
						let data = res.body.list;
						if(self.scoreType==0){
							self.couponList=data;
						}else{
							self.couponList=data.filter(item=>item.couponType==2);
						}
						let list=res.body.list;
						let list2=list.filter(item=>item.plugsCoupons.goodsType==2);
						let str=''
						if(list2.length==1){
							 str=list2[0].plugsCoupons.goodsIds;
						}else if(list2.length>1){
							list2.forEach(item=>{
								str=item.join(',')
							})
						}
						let str2=JSON.stringify(str)
						let list3=self.shopCartList.filter(item=>str2.includes(item.goodsId))
						let mony=0
						list3.forEach(itm => {
							mony += itm.goodsSpecification[0].dealPrice * itm.goodsNum;
							})
						self.appointMoney=mony;
					}
				})
			},
			getbussinessId() {
				let self = this;
				
				self.Get2('/api/plugs/getBusinessInfo').then(res => {
					if (res.code == 200) {
						let list = res.body;
						let listArr = [];
						list.forEach((item) => {
							listArr.push(JSONBig.parse(item.jsonData));
						})
						let bussinessId = uni.getStorageSync('__ddminiStoreInfo').businessId
						self.BusinessList = listArr;
						let Info = listArr.filter(item => item.businessId == bussinessId);
						self.addressInfo = Info[0];
						let obj = Info[0].businessAddress;
						self.selfaddress.address = obj.address;
						self.selfaddress.city = obj.city;
						self.selfaddress.district = obj.district;
						self.selfaddress.latitude = obj.latitude;
						self.selfaddress.longitude = obj.longitude;
						self.selfaddress.province = obj.province;
					}
				})
			},
			close() {
				this.paypalShow = false;
			},
			getAddressList() {
				let self = this;
				let id = uni.getStorageSync('__ddminiUserInfo').id;
				self.Get('/api/user/searchUserInfoById', {
					"userId": id
				}).then(res => {
					if (res.code == 200) {
						let list = res.body.receiveAddressJson;
						if (list != '' || list != null) {
							self.addressList = JSON.parse(list);
							let i = self.addressIndex;
							if (self.addressList.length > 0) {
								self.addressData = self.addressList[i]
							}
						}
					}
				})
			},
			selectCouponsTap(index) {
				let self = this;
				if (index === self.couponsIndex) {
					self.couponsIndex = -1;
				} else {
					self.couponsIndex = index;
				}
				self.paypalOrderTap();
			},
			paypalOrderTap(e) {
				let self = this;
				let data=self.selfaddress;
				uni.setStorage({
					key: '__zitiaddress',
					data:data
				});
				uni.showLoading({
					title: '订单准备中',
					mask: true
				});
				if (!data.name) {
					uni.showModal({
						title: '订单提示',
						content: '请输入姓名！',
						showCancel: false
					})
					uni.hideLoading();
					return
				}else if (!(/^1[3456789]\d{9}$/.test(data.mobile))) {
					uni.showModal({
						title: '订单提示',
						content: '请输入联系人电话!',
						showCancel: false
					})
					uni.hideLoading();
					return
				}else if (!self.pickupTime) {
					uni.showModal({
						title: '订单提示',
						content: '请输入自提时间!',
						showCancel: false
					})
					uni.hideLoading();
					return
				}
				let postData = {
					"latitude": 0,
					"logisticsType": self.logisticsType,
					"longitude": 0,
					"payMoney": self.goodsTotal,
					"bussinessId": self.businessId,
					"orderGoodsDTOS": self.goodsOrderList,
					"receiverAddress": JSON.stringify(self.selfaddress),
					"shopCartIds": self.cartListId,
					"userCouponId":self.selectCoupon.id,
					"expectPickTime":self.pickupTime,
					"orderRemark": self.ordermark,
					
				}
				// console.log(postData,'创建订单参数')
				self.Post2('/api/order/createOrder', postData).then(res => {
					uni.hideLoading();
					if (res.code === 200) {
						self.orderInfo = res.body;
						let id = JSONBig.stringify(self.orderInfo.id)
						if (!self.goodsScoreStatus) {
							self.paypalShow = true;
						}
					} else {
						uni.showModal({
							title: '订单提示',
							content: res.msg,
							showCancel: false
						});
						return
					}
				});
			},
			getPaypalOrder() {
				let self = this;
				let postData = {
					"client": "小程序",
					"openId": self.openId,
					"orderId": self.orderInfo.id,
					"orderNo": self.orderInfo.orderNo,
					"payMoney": self.orderInfo.payMoney,
					"payWay": 1
				}
				// console.log(postData,'微信支付')
				uni.showLoading({
					title: '支付准备中',
					mask: true
				});
				self.Post2('/api/pay/appletsWechatOrderPay', postData).then(res => {
					if (res.code === 200) {
						self.payList = res.body;
						console.log(self.payList,'支付7777777777');
						uni.hideLoading();
						self.time = Date.now();
						wx.requestPayment({
							'appId': self.payList.appid,
							'nonceStr': self.payList.noncestr,
							'package': self.payList.package,
							'signType': 'MD5',
							'timeStamp': self.payList.timestamp,
							'paySign': self.payList.sign,
							success: function(res) {
								uni.showToast({
									title: '微信支付成功'
								});
								setTimeout(function() {
									let id = JSON.parse(JSON.stringify(self.orderInfo.id));
									uni.navigateTo({
										url: `/pages/order/paysuccess?id=${id}&&money=${self.orderInfo.payMoney}`
									});
								}, 600);
							},
							fail: function(err) {
								console.log(err,'错误信息7777777777')
								uni.showModal({
									title: '支付失败',
									content: '订单支付失败，请重新进行支付。如对订单金额有疑问请联系客服人员',
									showCancel: false
								})
								return
							}
						});
					} else {
						uni.hideLoading();
						uni.showModal({
							title: '支付失败',
							content: res.msg,
							showCancel: false
						})
					}
				})
			},
			// 余额支付
			balancePay(){
				let self=this;
				// if(self.balanceMoney<self.orderInfo.payMoney){
				// 	uni.showModal({
				// 		title: '提示',
				// 		content: '余额不足,请充值',
				// 		success: function (res) {
				// 			if (res.confirm) {
				// 				uni.navigateTo({
				// 					url:'/pages/index//membercz'
				// 				})
				// 			} else if (res.cancel) {
				// 			}
				// 		}
				// 	});
				// }
				let postdata={
					"client": "小程序",
					"extParm": "",
					"openId": self.openId,
					"orderId": self.orderInfo.id,
					"orderNo": self.orderInfo.orderNo,
					"payMoney": self.orderInfo.payMoney,
					"payType": 0,
					"payWay": 4
				}
				uni.showLoading({
					title: '支付准备中',
					mask: true
				});
				self.Post2('/api/pay/balanceOrderPay',postdata).then(res=>{
					if(res.code==200){
						uni.hideLoading();
						uni.showToast({
							title: '微信支付成功'
						});
						setTimeout(function() {
							let id = JSON.parse(JSON.stringify(self.orderInfo.id));
							uni.navigateTo({
								url: `/pages/order/paysuccess?id=${id}&&money=${self.orderInfo.payMoney}`
							});
						}, 600);
					}else{
						uni.hideLoading();
						uni.showToast({
							title: res.msg
						});
					}
				})
			},
			// 积分支付
			scorePay(){
				let self=this;
				if(self.integral<self.orderInfo.payMoney){
					uni.showModal({
						title: '提示',
						content: '积分不足',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									url:'/pages/index/pointsmall'
								})
							} else if (res.cancel) {
							}
						}
					});
				}
				
				let postdata={
					"client": "小程序",
					"extParm": "",
					"openId": self.openId,
					"orderId": self.orderInfo.id,
					"orderNo": self.orderInfo.orderNo,
					"payMoney": self.orderInfo.payMoney,
					"payType": 0,
					"payWay":3
				}
				uni.showLoading({
					title: '支付准备中',
					mask: true
				});
				self.Post2('/api/pay/integralOrderPay',postdata).then(res=>{
					if(res.code==200){
						uni.hideLoading();
						uni.showToast({
							title: '微信支付成功'
						});
						setTimeout(function() {
							let id = JSON.parse(JSON.stringify(self.orderInfo.id));
							uni.navigateTo({
								url: `/pages/order/paysuccess?id=${id}&&money=${self.orderInfo.payMoney}&&score=1`
							});
						}, 600);
					}else{
						uni.hideLoading();
						uni.showToast({
							title: res.msg
						});
					}
				})
			},
			getBindWechatPhoneTap(e) {
				let self = this;
				uni.login({
					provider: "weixin",
					success(les) {
						let postData = {
							iv: e.detail.iv,
							code: les.code,
							encryptedData: e.detail.encryptedData,
						}
						self.Post(self.Url.userBindWechat, postData).then(res => {
							if (res.code === 0) {
								self.getUserInfo();
							} else {
								uni.showModal({
									title: '绑定失败',
									content: res.msg,
									showCancel: false
								})
							}
						})
					}
				})
			},
			getPathTap(path) {
				uni.navigateTo({
					url: path
				});
			}
		}
	}
</script>

<style lang="less">
	.uni-date-x--border{
		border: none !important;
	}
	.content{
		padding-bottom: 100rpx;
	}
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
	
	.showBox {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 40rpx;

		.pheader {}

		.paypalList {
			width: 94%;

			margin: 30rpx 0 260rpx 0;

			.paypal {
				width: 80%;
				margin: auto;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.paypal-left {
					display: flex;
					align-items: center;

					.right {
						margin-left: 26rpx;
					}
				}
			}
		}
	}

	.menu_box {
		width: 100%;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 20rpx;
		// margin-bottom: 30rpx;

		.head {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 100rpx;
			width: 90%;
			margin: 0 auto;

			.left {
				color: #1c1c1c;
				font-size: 30rpx;
				font-weight: bold;
				line-height: 30rpx;
				display: flex;
				align-items: center;
			}

			.right {
				color: #999;
				display: flex;
				align-items: center;
				font-size: 26rpx;
				line-height: 26rpx;
			}
		}

		.delivery_box {
			width: 90%;
			margin: 0 auto;
			padding: 10rpx 0 50rpx;

			/deep/.u-radio {
				flex: 1;
			}
		}

		.phone_box {
			width: 90%;
			margin: 0 auto;
			padding: 10rpx 0 50rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;

			.input {
				flex: 1;
				height: 70rpx;
				border: 1px solid #eee;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				input {
					width: 92%;
					color: #1c1c1c;
					font-size: 30rpx;
					height: 100%;
				}
			}

			.btn {
				color: #F54319;
				border: 1px solid #F54319;
				height: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 20rpx;
				font-size: 28rpx;
				border-radius: 10rpx;
				margin-left: 20rpx;
				position: relative;

				button {
					position: absolute;
					width: 100%;
					height: 100%;
					top: 0;
					left: 0;
					opacity: 0;
				}
			}
		}

		.address_box {
			width: 90%;
			margin: 0 auto;
			padding-bottom: 30rpx;

			.address {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.left {
					flex: 1;
					min-width: 0;

					.tit {
						color: #1c1c1c;
						font-size: 32rpx;

						span {
							color: #666;
							padding-left: 20rpx;
							font-size: 28rpx;
						}
					}

					.txt {
						font-size: 28rpx;
						color: #666;
						padding-top: 10rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.right {
					width: 80rpx;
					display: flex;
					align-items: center;
					justify-content: flex-end;
				}
			}

			.none_address {
				width: 100%;
				height: 150rpx;
				border: 1px dashed #e5e5e5;
				border-radius: 10rpx;
				color: #bbb;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				span {
					font-size: 26rpx;
				}
			}
		}

		.goods_box {
			padding-bottom: 2rpx;

			.goods {
				width: 90%;
				margin: 0 auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 40rpx;

				.left {
					width: 200rpx;

					image {
						width: 180rpx;
						height: 180rpx;
						border-radius: 20rpx;
					}
				}

				.right {
					flex: 1;
					min-width: 0;
					height: 170rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.goodsSpec {
						font-size: 24rpx;
						color: #999;
						display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
						-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
						-webkit-line-clamp: 3; //一个块元素显示的文本的行数
						overflow: hidden; //溢出隐藏
					}

					.title {
						color: #1c1c1c;
						font-size: 30rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.text {
						color: #999;
						font-size: 28rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.price {
						display: flex;
						align-items: center;
						justify-content: space-between;

						.num {
							color: #f14b5b;
							font-size: 32rpx;
							font-weight: bold;
							display: flex;
							align-items: center;

							span {
								font-size: 28rpx;
								padding-left: 2rpx;
							}
						}

						.buy {
							color: #F54319;
							// padding: 0 10rpx;
							border-radius: 10rpx;
							font-size: 28rpx;
							font-weight: bold;
						}
					}
				}
			}
		}

		.coupons_box {
			padding: 0 0 20rpx;

			.label {
				width: 90%;
				height: 120rpx;
				margin: 0 auto;
				border: 1px solid #f5f5f5;
				border-radius: 20rpx;
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;

				.price {
					width: 150rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #f14b5b;
					font-size: 38rpx;
					font-weight: bold;
					line-height: 38rpx;

					span {
						font-size: 24rpx;
						padding-left: 2rpx;
						margin-bottom: -4rpx;
					}
				}

				.info {
					flex: 1;
					min-width: 0;
					display: flex;
					flex-direction: column;
					justify-content: center;

					.title {
						color: #1c1c1c;
						font-size: 30rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.text {
						font-size: 26rpx;
						color: #999;
						padding-top: 4rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.button {
					width: 110rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}

		.order_info_box {
			.order_head {
				width: 90%;
				margin: 0 auto;

				.label {
					display: flex;
					align-items: center;
					padding-bottom: 30rpx;
					justify-content: space-between;
					font-size: 28rpx;
					color: #999;
				}
			}

			.order_foot {
				border-top: 1px solid #f5f5f5;

				.label {
					display: flex;
					align-items: center;
					width: 90%;
					margin: 0 auto;
					justify-content: space-between;
					height: 100rpx;
					font-weight: bold;
					font-size: 30rpx;
				}
			}
		}
	}

	.pay_type_box {
		width: 92%;
		margin: 0 auto;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 20rpx;
		height: 100rpx;

		.icons {
			width: 100rpx;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.title {
			flex: 1;
			color: #1c1c1c;
			font-size: 28rpx;
		}

		.right {
			width: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 100;
		background-color: #fff;
		padding-bottom: env(safe-area-inset-bottom);
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;

		.label {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 120rpx;
			width: 100%;

			.button {
				width: 92%;
				margin: 0 auto;
				height: 80rpx;
				border-radius: 100rpx;
				color: #fff;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #F54319;

				/deep/.u-count-down__text {
					color: #fff;
					line-height: 30rpx;
					padding: 0 4rpx;
				}
			}
		}
	}
</style>
