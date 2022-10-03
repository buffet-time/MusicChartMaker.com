<script setup lang="ts">
import { watch } from 'vue'
import { GlobalChartState } from '#shared/globals'
import { setStoredChart } from '#shared/storage'

import ChartTitles from './ChartComponents/ChartTitles.vue'
import ChartImages from './ChartComponents/ChartImages.vue'
import Search from './SidebarComponents/Search.vue'

// TODO: look into feasibility of debouncing this as to reduce ops
watch(
	GlobalChartState,
	() => {
		if (!GlobalChartState) {
			return console.error(
				'Error getting GlobalChartState in watch(GlobalChartState)',
				GlobalChartState
			)
		}

		setStoredChart(GlobalChartState.options.chartTitle, GlobalChartState)
	},
	{
		deep: true
	}
)
</script>

<template>
	<div class="flex justify-center w-full md:hidden">
		<Search />
	</div>
	<div
		id="Chart"
		class="flex flex-col gap-1 h-fit p-2 w-fit mt-7 md:mt-0"
		:style="{
			backgroundColor: GlobalChartState?.options.background,
			backgroundImage: `url(${GlobalChartState?.options.backgroundImage})`
		}"
	>
		<div class="flex">
			<ChartImages />
			<ChartTitles />
		</div>
	</div>
</template>
