<script setup lang="ts">
import { ref } from 'vue'
import { watchDebounced } from '@vueuse/core'

import { GlobalSiteOptions } from '#utils/globals'
import { SaveSiteOptions } from '#utils/storage'

import Chart from '#components/Chart.vue'
import Sidebar from '#components/Sidebar.vue'
import ToastRenderer from '#components/ToastRenderer.vue'

const renderChart = ref(false)

watchDebounced(
	GlobalSiteOptions,
	() => {
		if (!GlobalSiteOptions.value) {
			return console.error(
				'Error getting GlobalChartState in watch(GlobalChartState)',
				GlobalSiteOptions.value,
			)
		}

		SaveSiteOptions()
	},
	{
		deep: true,
		debounce: 500,
		maxWait: 1000,
	},
)
</script>

<template>
	<div class="flex h-screen font-sans text-white antialiased">
		<Sidebar @can-render-chart="renderChart = true" />
		<div class="flex w-full flex-col gap-2">
			<Chart v-if="renderChart" />
		</div>
	</div>
	<ToastRenderer />
</template>

<style>
html {
	scrollbar-width: thin;
	scrollbar-color: gray rgb(80, 80, 80);
}
body {
	margin: 0;
}
</style>
