<script setup lang="ts">
import type { ChartState } from '#types'
import { GenerateDefaultChart } from '#shared/chart'
import {
	StoredChartNames,
	GlobalChartState,
	GlobalSiteOptions
} from '#shared/globals'
import {
	deleteStoredChart,
	getFirstChart,
	setCurrentChart
} from '#shared/storage'

import Dialog from '#core/Dialog.vue'

const props = defineProps<{
	selectedChartTitle: string
}>()

const emit = defineEmits<{
	(event: 'deleteChart', value: ChartState): void
}>()

const deleteDialogId = 'deleteDialog'

function openDeleteModal() {
	// prettier-ignore
	(document.getElementById(deleteDialogId) as HTMLDialogElement).showModal()
}

function closeDeleteModal() {
	// prettier-ignore
	(document.getElementById(deleteDialogId) as HTMLDialogElement).close()
}

function deleteChart() {
	deleteStoredChart(props.selectedChartTitle)
	StoredChartNames.value.splice(
		StoredChartNames.value.findIndex(
			(chart) => chart === props.selectedChartTitle
		),
		1
	)
	const firstChartReturn = getFirstChart()

	let chartToSet: ChartState
	if (firstChartReturn) {
		chartToSet = firstChartReturn
	} else {
		chartToSet = GenerateDefaultChart()
		StoredChartNames.value.push(chartToSet.options.chartTitle)
	}

	GlobalChartState.value = chartToSet
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	GlobalSiteOptions.value.currentChart = chartToSet.options.chartTitle
	setCurrentChart(chartToSet.options.chartTitle)

	emit('deleteChart', chartToSet)

	closeDeleteModal()
}
</script>

<template>
	<button type="button" class="tw-button ml-1" @click="openDeleteModal">
		Delete
	</button>

	<Dialog :dialog-id="deleteDialogId" :close-button="false">
		<template #content>
			<p class="text-neutral-200">Delete current chart permanently?</p>

			<div class="flex gap-2">
				<button class="tw-button" @click="deleteChart">Yes</button>
				<button class="tw-button" @click="closeDeleteModal">No</button>
			</div>
		</template>
	</Dialog>
</template>
