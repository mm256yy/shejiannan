<template>
	<view class="content">
		<view class="header_box" :style="{height:height+'px', position: position}">
			<view class="header_label" :style="'padding-top:'+statusBarHeight">
				<view class="logo"  >
					<view v-if="back" class="back" @click="getBackTap()">
						<aicon :type="pagesLength>1?'arrow-left-s-line':'home-wifi-fill'" size="22" :color="color"></aicon>
					</view>
					<view v-else class="hover"></view>
					<image style="width: 120rpx;height: 60rpx;margin-right: 16rpx;" :src="store.businessLogo" mode="aspectFill"></image>
					<view v-if="store" class="store" @click="Topath('/pages/subPack/store?id='+store.businessId)">
						<view class="title">{{store.businessName}}</view>
						<image style="width: 30rpx;height: 30rpx;" src="../../static/images/detail.png" mode="aspectFill"></image>
						<!-- <u-icon name="arrow-right" color="#221c00" size="13"></u-icon> -->
					</view>
				</view>
			</view>
		</view>
		<!-- <view v-if="position!='sticky'" :style="{height:height+'px'}"></view> -->
	</view>
</template>

<script>
const app = getApp();
export default {
  props: {
	logo: {
		type: String
	},
	back: {
		type: Boolean,
		default: false
	},
	store: {
		type: Object
	},
	title: {
		type: String
	},
	color: {
		type: String,
		default: '#ffffff'
	},
	position: {
		type: String,
		default: 'relative'
	},
  },
  data() {
    return {
      statusBarHeight: '',
	  pagesLength: getCurrentPages().length
    };
  },
  computed: {
  	height(){
  		const {platform,statusBarHeight,windowHeight} = uni.getSystemInfoSync()
  		let height = statusBarHeight +4 //ios 24px
  		if (platform.toLowerCase() == "android" ){
  			height +=4 //android 28px
  		}
  		this.statusBarHeight = (height-4)+'px';
		let hei = height+ 44;
		this.$emit('height', hei);
  		// 胶囊高度 32px 下边框6px(+6px) height 状态栏高度
  		return hei
  	}
  },
  methods: {
		getBackTap(){
			if (this.pagesLength > 1){
				return uni.navigateBack();
			}else{
				return uni.switchTab({url: '/pages/index/index'});
			}
		},
		Topath(route) {
			uni.navigateTo({
				url: route
			})
		},
	},
};
</script>
<style lang="scss" scoped>
	.content{
		position: relative;
	}
.header_box{
	display: flex;
	flex-direction: column;
	justify-content: center;
	z-index: 100;
	background-color: #fdd000;
	// position: sticky;
	// top: 0;
	// left: 0;
	// width: 100%;
	// z-index: 100;
	// background-color: #fff;
	.header_label{
		display: flex;
		align-items: center;
		height: 60rpx;
		// justify-content: flex-start;
		.logo{
			display: flex ;
			align-items: center;
			width: 100%;
			margin: 0 auto;
			image{
				width: 250rpx;
				height: 60rpx;
			}
			.back{
				width: 100rpx;
				height: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				aicon{
					width: 44rpx;
					height: 44rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			.name{
				color: #1c1c1c;
				font-size: 30rpx;
				font-weight: bold;
			}
			.hover{
				width: 30rpx;
			}
		}
		.store{
			display: flex;
			align-items: center;
			// border: 1px solid #F54319;
			height: 60rpx;
			border-radius: 100rpx;
			overflow: hidden;
			.title{
				height: 100%;
				// background-color: #F54319;
				// color: #fff;
				display: flex;
				align-items: center;
				margin-right: 10rpx;
				// line-height: 60rpx;
				justify-content: center;
				font-size: 26rpx;
				max-width: 200rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				// padding: 0 30rpx;
				font-weight: bold;
			}
			.input{
				width: 150rpx;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				aicon{
					width: 32rpx;
					height: 32rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				span{
					color: #bbb;
					font-size: 26rpx;
					padding-left: 10rpx;
				}
			}
		}
	}
}
</style>
