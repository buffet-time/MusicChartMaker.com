<script setup lang="ts">
import { PreventNameCollision, StoredChartNames } from '#src/shared'
import {
	setStoredChart,
	deleteStoredChart,
	setCurrentChart
} from '#src/storage'
import { type ChartState } from '#types/types'
import Dialog from '#components/CoreComponents/Dialog.vue'
import { ref } from 'vue'

const props = defineProps<{
	chartNameInput: string
	selectedChart: ChartState
	selected: string
	tempRename: string
	chartValidity: boolean | undefined
}>()

const emits = defineEmits<{
	(event: 'updateTempRename', value: string): void
	(event: 'updateSelected', value: string): void
	(event: 'updateChartTitle', value: string): void
	(event: 'updateChartNameInput', value: string): void
}>()

const renameDialogId = 'renameDialog'
const tempRenameLocal = ref(props.chartNameInput)

function onRenameChart() {
	emits('updateTempRename', PreventNameCollision(props.chartNameInput))
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
	if (!props.selectedChart) {
		return console.error('Selected Chart is not defined', props.selectedChart)
	}

	emits('updateChartTitle', tempRenameLocal.value)
	emits('updateChartNameInput', tempRenameLocal.value)

	setStoredChart(tempRenameLocal.value, props.selectedChart)
	deleteStoredChart(props.selected)
	setCurrentChart(tempRenameLocal.value)

	StoredChartNames.value[
		StoredChartNames.value.findIndex((name) => name === props.selected)
	] = tempRenameLocal.value

	emits('updateSelected', tempRenameLocal.value)

	closeRenameModal()
}
</script>

<template>
	<button
		v-show="chartNameInput !== '' && chartValidity"
		type="button"
		class="tw-button ml-1 mb-1"
		@click="onRenameChart"
	>
		Rename
	</button>

	<Dialog :dialog-id="renameDialogId" :close-button="false">
		<p class="text-neutral-200">Rename current chart to:</p>

		<input
			ref="chartInput"
			v-model="tempRenameLocal"
			placeholder="Name of chart"
			type="text"
			class="p-2 tw-input mr-1 invalid:text-red-500"
			title="Any name but can't just be a number."
			pattern="(?!GlobalSiteOptions$).*"
		/>

		<div class="flex gap-2">
			<button class="tw-button" @click="renameChart">Yes</button>
			<button class="tw-button" @click="closeRenameModal">No</button>
		</div>
	</Dialog>
</template>
