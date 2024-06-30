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

// eslint-disable-next-line vue/no-dupe-keys
const { selectedChart, selectedChartTitle } = defineProps<{
	selectedChart: ChartState
	selectedChartTitle: string
}>()

const emits = defineEmits<{
	updateChartTitle: [value: string]
}>()

const renameDialogId = 'renameDialog'
const chartInput = ref('')
const renameChartInput = ref<HTMLInputElement>()

function onRenameChart() {
	chartInput.value = selectedChartTitle
	const renameDialog = document.getElementById(
		renameDialogId
	) as HTMLDialogElement
	renameDialog.showModal()
}

function closeRenameModal() {
	const renameModal = document.getElementById(
		renameDialogId
	) as HTMLDialogElement
	renameModal.close()
}

function renameChart() {
	const chartNameToSave = PreventNameCollision(chartInput.value)

	if (!selectedChart) {
		return console.error('Selected Chart is not defined', selectedChart)
	}

	setStoredChart(chartNameToSave, selectedChart)
	deleteStoredChart(selectedChartTitle)
	setCurrentChart(chartNameToSave)

	StoredChartNames.value[
		StoredChartNames.value.findIndex((name) => name === selectedChartTitle)
	] = chartNameToSave

	emits('updateChartTitle', chartNameToSave)

	closeRenameModal()
}
</script>

<template>
	<button type="button" class="uno-button" @click="onRenameChart">
		Rename
	</button>

	<Dialog :dialog-id="renameDialogId" :close-button="false">
		<template #content>
			<p class="text-neutral-200">Rename current chart to:</p>

			<input
				ref="renameChartInput"
				v-model="chartInput"
				placeholder="Name of chart"
				type="text"
				class="uno-input"
				title="Any name but can't just be a number."
				pattern="(?!GlobalSiteOptions$).*"
			/>
			<template v-if="chartInput === '' || !renameChartInput?.validity.valid">
				<p class="pt-1">The name can't be empty</p>
				<p>or {{ SiteOptionsKey }}</p>
				<button class="uno-button" @click="closeRenameModal">Cancel</button>
			</template>

			<div v-else class="flex gap-2">
				<button class="uno-button" @click="renameChart">Yes</button>
				<button class="uno-button" @click="closeRenameModal">No</button>
			</div>
		</template>
	</Dialog>
</template>
