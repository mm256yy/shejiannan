<template>
	<view class="">
		<view class="content" style="" >
			<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
			<u--form labelPosition="left" :model="info" ref="uForm" labelWidth="120">
				<view style="display: flex;justify-content: space-between;align-items: center;border-bottom: 1rpx solid #d6d7d9;padding-bottom: 20rpx;">
					<view class="">头像</view>
					<view class="" style="display: flex;justify-content: space-between;align-items: center;">
						<image style="width:80rpx;height: 80rpx;border-radius: 40rpx;" :src="info.headImg" mode="" @click="updateHeadimg()"></image>
						<view class="icon">
							<u-icon slot="right" name="arrow-right"></u-icon>
						</view>
					</view>
				</view>
				<u-form-item label="昵称" prop="info.userName"  ref="item1">
					<u--input  v-model="info.userName" border="none" placeholder="请输入" inputAlign="right" ></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
			</u--form>
		</view>
		<view class="" style="width: 100%;margin-top: 70%;">
			<view
				class=""
				style="width: 80%;height: 80rpx;border-radius: 40rpx;background-color: #fdd000;color: #fff;display: flex;align-items: center;justify-content: center;margin:30rpx auto;"
				@click="update"
			>
				保存信息
			</view>
			<view
				class=""
				style="width:  80%;height: 80rpx;border-radius: 40rpx;background-color: #aaa;color: #fff;display: flex;align-items: center;justify-content: center;margin: auto;"
				@click="layout"
			>
				退出登陆
			</view>
		</view>
	</view>
</template>

<script>
// import { searchUserInfoById, updateUserInfo,uploadImages } from '../../../utils/api.js';
const app = getApp();
export default {
	data() {
		return {
			showSex: false,
			// model1: {
			// 	userInfo: {
			// 		name: 'uView UI',
			// 		sex: ''
			// 	}
			// },
			info:{

			},
			actions: [
				{
					name: '男'
				},
				{
					name: '女'
				},
				{
					name: '保密'
				}
			],
			rules: {
				'info': {
					type: 'string',
					required: true,
					message: '请填写姓名',
					trigger: ['blur', 'change']
				},
				'userInfo.sex': {
					type: 'string',
					max: 1,
					required: true,
					message: '请选择男或女',
					trigger: ['blur', 'change']
				}
			},
			radio: '',
			switchVal: false,
			version:'',
			UserInfo:{}
		};
	},
	onShow() {
		this.getuserInfo()
		
		 const miniProgram  = wx.getAccountInfoSync();
		 this.version=miniProgram.miniProgram.version
	},
	methods: {
		sexSelect(e) {
			this.userInfo.gender = e.name;
		},
		getuserInfo() {
			let self = this;
			let data = {
				userId:uni.getStorageSync('__ddminiUserInfo').id
			};
			self.Get('/api/user/searchUserInfoById',data).then(res => {
				if (res.code == 200) {
					console.log(res.body);
					this.info = res.body;
				}
			});
		},
		updateHeadimg(){
			let that=this
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				loop: true,
				success: res => {
					console.log(res);
						let data={
							file:res.tempFilePaths[0], //你要传的临时文件
							type:1
						}
					that.Upload('/api/file/uploadImages',data).then(res=>{
						if(res.code==200){
							
							this.info.headImg=res.body
							console.log(this.info.headImg,'1223333333')
						}
					})

				}
			});
					

		},
		// 修改信息
		update(){
			let self=this;
			self.Post2('/api/user/updateUserInfo',this.info).then(res=>{
				if(res.code==200){
					uni.showToast({
						icon:'none',
						title:'信息保存成功'
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},600)
				}else{
					uni.showToast({
						icon:'none',
						title:res.msg
					})
				}
			})
		},
		// 退出登陆
		layout(){
			let self=this;
			uni.showModal({
				title: '提示',
				content: '确定要退出登陆吗?',
				success: function(res) {
					if (res.confirm) {
						uni.removeStorage({
							key: '__ddminiUserInfo',

						});
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},600)
					}
				}
			});
		}
	},
	// onReady() {
	// 	//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
	// 	this.$refs.uForm.setRules(this.rules);
	// }
};
</script>
<style lang="scss">
page {
	padding: 20rpx;
}

.content {
	background-color: #fff;
	width: 94%;
	margin:20rpx auto;
	box-shadow: 0px 0px 16rpx 0px rgba(207, 207, 207, 0.5);
	padding:20rpx !important;
	border-radius: 20rpx;
	box-sizing: border-box;
}
input {
	text-align: right !important;
	padding-right:20rpx !important;
}
.icon{
	margin-left: 20rpx;
}
// .u-input__content__field-wrapper__field.data-v-fdbb9fe6{
// 	padding-left:20
// }
</style>


