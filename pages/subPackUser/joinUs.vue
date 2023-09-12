<template>
	<view>
		<image :src="recommendedList[0].activityImgUrl"  mode="widthFix"></image>
	</view>
</template>

<script>
	const app = getApp();

	export default {
		data() {
			return {
				storeInfo: uni.getStorageSync('__ddminiStoreInfo'),
				recommendedList:[]
			}
		},
		onLoad() {
			this.getImg()
		},
		methods: {
			getImg() {
				let self=this;
				let bussinessId = self.storeInfo.businessId;
				self.Get(`/api/plugs/searchPlugsRecommendedList?businessId=${bussinessId}&userServiceToken=NIIWOD4RU1B1KLEBAV9TX`).then(res => {
					if (res.code == 200) {
						let list=res.body.list;
						self.recommendedList = list.filter(itm => itm.type === 'joinUs');
						// console.log(self.recommendedList,'899555555555')
					}
				})
			}
		}
	}
</script>

<style>
	
	
</style>
