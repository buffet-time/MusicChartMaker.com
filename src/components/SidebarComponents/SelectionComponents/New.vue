<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ref } from 'vue'
import {
	GenerateDefaultChart,
	GeneratePresetChart,
	GlobalChartState,
	PreventNameCollision,
	StoredChartNames
} from '#src/shared'
import { setCurrentChart, setStoredChart, SiteOptionsKey } from '#src/storage'
import { ChartState, type Preset } from '#types/types'
import Dialog from '#components/CoreComponents/Dialog.vue'

const props = defineProps<{
	selectedChartTitle: string
	selectedChart: ChartState
}>()

const emit = defineEmits<{
	(event: 'updateSelectedChartTitle', value: string): void
}>()

const newDialogId = 'newDialog'

const presetAdd = ref<boolean>(false)
const chartNameInput = ref(props.selectedChartTitle)
const chartInput = ref<HTMLInputElement>()

function onNewChart() {
	presetAdd.value = false
	chartNameInput.value = PreventNameCollision(props.selectedChartTitle)
	const newDialog = document.getElementById(newDialogId) as HTMLDialogElement
	newDialog.showModal()
}

function newChart(type: 'Custom' | 'Preset', preset?: Preset) {
	StoredChartNames.value.unshift(chartNameInput.value)

	let tempChart: ChartState

	if (type === 'Custom') {
		tempChart = GenerateDefaultChart(chartNameInput.value)
	} else if (type === 'Preset' && preset) {
		tempChart = GeneratePresetChart(chartNameInput.value, preset)
	} else {
		return console.error('Incorrect addChart() invocation: ', type, preset)
	}

	emit('updateSelectedChartTitle', chartNameInput.value)
	setCurrentChart(chartNameInput.value)
	saveCurrentChart()
	GlobalChartState.value = tempChart

	const newDialog = document.getElementById(newDialogId) as HTMLDialogElement
	newDialog.close()
}

function saveCurrentChart() {
	if (props.selectedChartTitle && props.selectedChart) {
		return setStoredChart(props.selectedChartTitle, props.selectedChart!)
	}
	throw new Error('Error: Cannot save current Chart!')
}
</script>

<template>
	<button type="button" class="tw-button ml-1" @click="onNewChart">New</button>

	<!-- TODO: Move rename functionality to be inside the dialog too. -->
	<Dialog :dialog-id="newDialogId" :close-button="true">
		<p>New chart named:</p>

		<input
			ref="chartInput"
			v-model="chartNameInput"
			placeholder="Name of chart"
			type="text"
			class="p-2 tw-input mr-1 invalid:text-red-500"
			title="Any name but can't just be a number."
			pattern="(?!GlobalSiteOptions$).*"
		/>
		<p v-if="chartNameInput === '' || !chartInput?.validity.valid" class="pt-1">
			The name must not be empty or {{ SiteOptionsKey }}
		</p>

		<template v-else>
			<p>Select type of new chart.</p>
			<div v-if="!presetAdd" class="flex gap-1 justify-center items-center">
				<button class="tw-button" @click="newChart('Custom')">Custom</button>

				<button class="tw-button" @click="presetAdd = true">Preset</button>
			</div>

			<div v-else class="flex gap-1 justify-center items-center">
				<button class="tw-button" @click="newChart('Preset', 'Top 42')">
					Top 42
				</button>
				<button class="tw-button" @click="newChart('Preset', 'Top 100')">
					Top 100
				</button>
			</div>
		</template>
	</Dialog>
</template>
