<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { watch } from 'vue'
import { GlobalChartState } from '#src/shared'
import { setStoredChart } from '#src/storage'
import ChartTitles from './ChartComponents/ChartTitles.vue'
import ChartImages from './ChartComponents/ChartImages.vue'

// TODO: create option to disable auto save and also make it not a watcher...
watch(
	GlobalChartState,
	() => {
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
	<div
		id="Chart"
		class="flex h-fit p-2 w-fit ml-[230px]"
		:style="{
			backgroundColor: GlobalChartState.options.background,
			backgroundImage: `url(${GlobalChartState.options.backgroundImage})`
		}"
	>
		<ChartImages />
		<ChartTitles />
	</div>
</template>
