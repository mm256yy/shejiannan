<template>
	<view class="content">
		<view class="advise-title" >此诉讼为本小程序自由投诉渠道,非微信官方投诉渠道</view>
		<view class="formItem">
			<view class="formItem-left">反馈主题:</view>
			<input style="padding: 0 12rpx;" class="formInp" type="text">
		</view>
		<view class="formItem">
			<view class="formItem-left">餐厅名称:</view>
			<input style="padding: 0 12rpx;" class="formInp" placeholder="请填写餐厅名称" type="text">
		</view>	
		<view class="formItem">
			<view class="formItem-left">就餐时间:</view>
			<view class="formInp" style="z-index: 999;border: none;" >
				<uni-datetime-picker :clear-icon="true" type="datetime" placeholder="请选择就餐时间"  @change="changeLog" />
			</view>
		</view>	
		<view class="">
			<textarea class="uni_textarea"  placeholder="请简要描述您的问题或建议" ></textarea>
		</view>
		<view class="">
			<button class="subBtn" >提交</button>
		</view>
	</view>
</template>

<script>
	import JSONBig from 'json-bigint'
	const app = getApp();
	export default{
		data(){
			return{
				
			}
		},
		onLoad() {
			
		},
		onShow() {
			
		},
		methods:{
			changeLog(e){
				console.log(e,'就餐时间777777777777')
			}
		}
	} 
</script>

<style lang="less">
	page{
		background-color: #fff;
	}
	.advise-title{
		width: 100%;
		height: 50rpx;
		font-size: 24rpx;
		text-align: center;
		line-height: 50rpx;
		background-color: #eeeeee;
		color:#818181 ;
		margin-bottom: 20rpx;
	}
	.formItem{
		width: 92%;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		.formItem-left{
			margin-right: 18rpx;
			font-size: 30rpx;
		}
		.formInp{
			flex: 1;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 10rpx;
			box-sizing: border-box;
			background-color: #fff;
			border: 3rpx solid #e5e5e5;
		}
	}
	.uni_textarea{
		width: 92%;
		margin: 30rpx auto;
		border-radius: 16rpx;
		background-color: #f9f9f9;
		padding: 30rpx;
		box-sizing: border-box;
	}
	.subBtn{
		width: 92%;
		border-radius: 40rpx;
		margin: 30rpx auto;
		background-color: #eeeeee;
		color: #969696;
		font-weight: bold;
		// border: 3rpx solid #e5e5e5;
	}
	
	button::after{
	  border: none;
	}
</style>