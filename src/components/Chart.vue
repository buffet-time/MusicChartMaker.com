<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import { watchDebounced } from '@vueuse/core'

import { GlobalChartState } from '#utils/globals'
import { setStoredChart } from '#utils/storage'

import ChartTitles from './ChartComponents/ChartTitles.vue'
// biome-ignore lint/style/useImportType: component import
import ChartImages from './ChartComponents/ChartImages.vue'
import Search from './SidebarComponents/Search.vue'

const chartImagesRef =
	useTemplateRef<InstanceType<typeof ChartImages>>('chartImagesRef')
const heightOfChartImages = ref<number>()

function updateHeightOfChartImages() {
	heightOfChartImages.value = chartImagesRef.value?.$el.clientHeight
}

onMounted(() => {
	const resizeOberserver = new ResizeObserver(() => updateHeightOfChartImages())

	resizeOberserver.observe(chartImagesRef.value?.$el)

	updateHeightOfChartImages()
})

watchDebounced(
	GlobalChartState,
	() => {
		if (!GlobalChartState) {
			return console.error(
				'Error getting GlobalChartState in watch(GlobalChartState)',
				GlobalChartState,
			)
		}

		setStoredChart(
			GlobalChartState.value.options.chartTitle,
			GlobalChartState.value,
		)
	},
	{
		deep: true,
		debounce: 500,
		maxWait: 1000,
	},
)
</script>

<template>
	<!-- height value is hacky but works... -->
	<div class="w-full uno-flex-center md:hidden h-[208px]">
		<Search />
	</div>
	<div
		id="Chart"
		:style="{
			backgroundColor: GlobalChartState?.options.background,
			backgroundImage: GlobalChartState?.options.backgroundImage
				? `url(${GlobalChartState?.options.backgroundImage})`
				: 'unset'
		}"
		class="uno-flex-center flex-col gap-1 md:ml-[231px] md:flex-row md:items-start md:justify-start"
	>
		<ChartImages ref="chartImagesRef" />
		<ChartTitles
			v-if="GlobalChartState?.options.displayTitles"
			:height-of-chart-images="heightOfChartImages"
		/>
	</div>
</template>
