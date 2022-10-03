<script setup lang="ts">
import { ref } from 'vue'
import type { ChartState } from '#types'
import { StoredChartNames } from '#shared/globals'
import {
	setStoredChart,
	deleteStoredChart,
	SiteOptionsKey,
	setCurrentChart
} from '#shared/storage'
import { PreventNameCollision } from '#shared/chart'

import Dialog from '#core/Dialog.vue'

const props = defineProps<{
	selectedChart: ChartState
	selectedChartTitle: string
}>()

const emits = defineEmits<{
	(event: 'updateChartTitle', value: string): void
}>()

const renameDialogId = 'renameDialog'
const chartInput = ref('')
const renameChartInput = ref<HTMLInputElement>()

function onRenameChart() {
	chartInput.value = props.selectedChartTitle
	const renameDialog = document.getElementById(
		renameDialogId
	) as HTMLDialogElement
	renameDialog.showModal()
}

function closeRenameModal() {
	// prettier-ignore
	(document.getElementById(renameDialogId) as HTMLDialogElement).close()
}

function renameChart() {
	const chartNameToSave = PreventNameCollision(chartInput.value)

	if (!props.selectedChart) {
		return console.error('Selected Chart is not defined', props.selectedChart)
	}

	setStoredChart(chartNameToSave, props.selectedChart)
	deleteStoredChart(props.selectedChartTitle)
	setCurrentChart(chartNameToSave)

	StoredChartNames.value[
		StoredChartNames.value.findIndex(
			(name) => name === props.selectedChartTitle
		)
	] = chartNameToSave

	emits('updateChartTitle', chartNameToSave)

	closeRenameModal()
}
</script>

<template>
	<button type="button" class="tw-button ml-1" @click="onRenameChart">
		Rename
	</button>

	<Dialog :dialog-id="renameDialogId" :close-button="false">
		<p class="text-neutral-200">Rename current chart to:</p>

		<input
			ref="renameChartInput"
			v-model="chartInput"
			placeholder="Name of chart"
			type="text"
			class="tw-input"
			title="Any name but can't just be a number."
			pattern="(?!GlobalSiteOptions$).*"
		/>
		<template v-if="chartInput === '' || !renameChartInput?.validity.valid">
			<p class="pt-1">The name can't be empty</p>
			<p>or {{ SiteOptionsKey }}</p>
			<button class="tw-button" @click="closeRenameModal">Cancel</button>
		</template>

		<div v-else class="flex gap-2">
			<button class="tw-button" @click="renameChart">Yes</button>
			<button class="tw-button" @click="closeRenameModal">No</button>
		</div>
	</Dialog>
</template>
