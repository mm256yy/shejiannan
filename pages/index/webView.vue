<template>
		<web-view :src="offurl"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				offurl: '',
			}
		},
		onLoad() {

		},
		onShow() {
			this.offurl = uni.getStorageSync('__officialAccount');
		},
		methods: {

		}
	}
</script>
