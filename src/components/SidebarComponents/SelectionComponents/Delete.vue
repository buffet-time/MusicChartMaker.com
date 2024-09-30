<script setup lang="ts">
import type { ChartState } from '#types'
import { GenerateDefaultChart } from '#utils/chart'
import {
	StoredChartNames,
	GlobalChartState,
	GlobalSiteOptions,
} from '#utils/globals'
import {
	deleteStoredChart,
	getFirstChart,
	setCurrentChart,
} from '#utils/storage'

import Dialog from '#core/Dialog.vue'

const { selectedChartTitle } = defineProps<{
	selectedChartTitle: string
}>()

const emit = defineEmits<{
	deleteChart: [value: ChartState]
}>()

const deleteDialogId = 'deleteDialog'

function openDeleteModal() {
	const deleteModal = document.getElementById(
		deleteDialogId,
	) as HTMLDialogElement
	deleteModal.showModal()
}

function closeDeleteModal() {
	const deleteModal = document.getElementById(
		deleteDialogId,
	) as HTMLDialogElement
	deleteModal.close()
}

function deleteChart() {
	deleteStoredChart(selectedChartTitle)
	StoredChartNames.value.splice(
		StoredChartNames.value.findIndex((chart) => chart === selectedChartTitle),
		1,
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
	GlobalSiteOptions.value.currentChart = chartToSet.options.chartTitle
	setCurrentChart(chartToSet.options.chartTitle)

	emit('deleteChart', chartToSet)

	closeDeleteModal()
}
</script>

<template>
	<button type="button" class="uno-button" @click="openDeleteModal">
		Delete
	</button>

	<Dialog :dialog-id="deleteDialogId" :close-button="false">
		<template #content>
			<p class="text-neutral-200">Delete current chart permanently?</p>

			<div class="flex gap-2">
				<button class="uno-button" @click="deleteChart">Yes</button>
				<button class="uno-button" @click="closeDeleteModal">No</button>
			</div>
		</template>
	</Dialog>
</template>
