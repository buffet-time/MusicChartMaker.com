<script setup lang="ts">
import {
	GenerateDefaultChart,
	GlobalChartState,
	GlobalSiteOptions,
	StoredChartNames
} from '#src/shared'
import { deleteStoredChart, setCurrentChart, getFirstChart } from '#src/storage'
import { type ChartState } from '#types/types'
import Dialog from '#components/CoreComponents/Dialog.vue'

const props = defineProps<{
	chartNameInput: string
	selectedChart: ChartState
	selected: string
	chartValidity: boolean | undefined
}>()

const emit = defineEmits<{
	(event: 'updateSelected', value: string): void
	(event: 'updateSelectedChart', value: ChartState): void
	(event: 'updateChartNameInput', value: string): void
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
	deleteStoredChart(props.selected)
	StoredChartNames.value.splice(
		StoredChartNames.value.findIndex((chart) => chart === props.selected),
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

	// props.selected = chartToSet.options.chartTitle
	emit('updateSelected', chartToSet.options.chartTitle)

	// props.selectedChart = chartToSet
	emit('updateSelectedChart', chartToSet)

	GlobalChartState.value = chartToSet
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	GlobalSiteOptions.value!.currentChart = chartToSet.options.chartTitle
	setCurrentChart(props.selected)

	// props.chartNameInput = chartToSet.options.chartTitle
	emit('updateChartNameInput', chartToSet.options.chartTitle)

	closeDeleteModal()
}
</script>

<template>
	<button
		v-show="chartNameInput !== '' && props.chartValidity"
		type="button"
		class="tw-button ml-1 mb-1"
		@click="openDeleteModal"
	>
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
