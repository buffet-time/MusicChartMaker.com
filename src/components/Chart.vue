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

		setStoredChart(
			GlobalChartState.value.options.chartTitle,
			GlobalChartState.value
		)
	},
	{
		deep: true
	}
)
</script>

<template>
	<div class="tw-flex-center w-full md:hidden">
		<Search />
	</div>
	<div
		id="Chart"
		:style="{
			backgroundColor: GlobalChartState?.options.background,
			backgroundImage: `url(${GlobalChartState?.options.backgroundImage})`
		}"
		class="tw-flex-center flex-col gap-1 md:ml-[231px] md:flex-row md:items-start md:justify-start"
	>
		<ChartImages />
		<ChartTitles />
	</div>
</template>
