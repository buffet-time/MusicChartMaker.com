<script setup lang="ts">
import { watch } from 'vue'
import { GlobalChartState } from '#shared/globals'
import { setStoredChart } from '#shared/storage'

import ChartTitles from './ChartComponents/ChartTitles.vue'
import ChartImages from './ChartComponents/ChartImages.vue'

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
	<div
		id="Chart"
		class="flex h-fit p-2 w-fit ml-[230px]"
		:style="{
			backgroundColor: GlobalChartState?.options.background,
			backgroundImage: `url(${GlobalChartState?.options.backgroundImage})`
		}"
	>
		<ChartImages />
		<ChartTitles />
	</div>
</template>
