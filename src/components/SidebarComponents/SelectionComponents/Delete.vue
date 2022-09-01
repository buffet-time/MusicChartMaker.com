<script setup lang="ts">
import Dialog from '#components/CoreComponents/Dialog.vue'
import {
	StoredChartNames,
	GenerateDefaultChart,
	GlobalChartState,
	GlobalSiteOptions
} from '#root/src/shared'
import {
	deleteStoredChart,
	getFirstChart,
	setCurrentChart
} from '#root/src/storage'
import { ChartState } from '#root/src/types/types'

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
	GlobalSiteOptions.value!.currentChart = chartToSet.options.chartTitle
	setCurrentChart(chartToSet.options.chartTitle)

	emit('deleteChart', chartToSet)

	closeDeleteModal()
}
</script>

<template>
	<button type="button" class="tw-button ml-1 mb-1" @click="openDeleteModal">
		Delete
	</button>

	<Dialog :dialog-id="deleteDialogId" :close-button="false">
		<p class="text-neutral-200">Delete current chart permanently?</p>

		<div class="flex gap-2">
			<button class="tw-button" @click="deleteChart">Yes</button>
			<button class="tw-button" @click="closeDeleteModal">No</button>
		</div>
	</Dialog>
</template>
