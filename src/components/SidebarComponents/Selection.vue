<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ref, type Ref, onMounted } from 'vue'
import {
	GenerateDefaultChart,
	GeneratePresetChart,
	GlobalChartState,
	GlobalSiteOptions,
	PreventNameCollision,
	StoredChartNames
} from '#src/shared'
import {
	setStoredChart,
	getStoredChart,
	deleteStoredChart,
	setCurrentChart,
	getCurrentChart,
	getAllSavedKeys,
	getFirstChart,
	SiteOptionsKey
} from '#src/storage'
import { Preset, type ChartState } from '#types/types'
import {
	ClickOutsideDialog,
	DynamicImportDialogPolyfill
} from '#root/src/wrappers'

const emit = defineEmits<{
	(event: 'canRenderChart'): void
}>()

const chartNameInput = ref('')
const selectedChart = ref() as Ref<ChartState>
const selected = ref('')
const initializing = ref(true)
const presetAdd = ref(false)
const tempRename = ref('')

// Reference to HTML elements
const chartInput = ref() as Ref<HTMLInputElement>
const newModal = ref() as Ref<HTMLDialogElement>
const deleteModal = ref() as Ref<HTMLDialogElement>
const renameModal = ref() as Ref<HTMLDialogElement>

function saveCurrentChart() {
	if (selected.value && selectedChart.value) {
		return setStoredChart(selected.value, selectedChart.value)
	}
	throw new Error('Error: Cannot save current Chart!')
}

// this is a bit janky :/
function onSelect() {
	const loadedChart = getStoredChart(String(selected.value)) as ChartState
	if (!loadedChart) {
		console.error(`Failed to load Selected Chart ${selected.value}.`)
		return
	}
	// First, store current chart
	setCurrentChart(selected.value)
	// Now, update current chart, and update latest chart to current.
	GlobalChartState.value = loadedChart
	GlobalSiteOptions.value.currentChart = selected.value
	selectedChart.value = loadedChart
	chartNameInput.value = loadedChart.options.chartTitle
}

function onNewChart() {
	tempRename.value = PreventNameCollision(chartNameInput.value)
	newModal.value.showModal()
}

function newChart(type: 'Custom' | 'Preset', preset?: Preset) {
	StoredChartNames.value.unshift(tempRename.value)
	if (type === 'Custom') {
		selectedChart.value = GenerateDefaultChart(tempRename.value)
	} else if (type === 'Preset' && preset) {
		presetAdd.value = false
		selectedChart.value = GeneratePresetChart(tempRename.value, preset)
	} else {
		return console.error('Incorrect addChart() invocation: ', type, preset)
	}
	selected.value = chartNameInput.value = tempRename.value
	setCurrentChart(tempRename.value)
	saveCurrentChart()
	GlobalChartState.value = selectedChart.value

	newModal.value.close()
}

function onRenameChart() {
	tempRename.value = PreventNameCollision(chartNameInput.value)
	renameModal.value.showModal()
}

function renameChart() {
	selectedChart.value.options.chartTitle = chartNameInput.value =
		tempRename.value
	setStoredChart(tempRename.value, selectedChart.value)
	deleteStoredChart(selected.value)
	setCurrentChart(tempRename.value)

	StoredChartNames.value[
		StoredChartNames.value.findIndex((name) => name === selected.value)
	] = tempRename.value
	selected.value = tempRename.value
	renameModal.value.close()
}

function deleteChart() {
	deleteStoredChart(selected.value)
	StoredChartNames.value.splice(
		StoredChartNames.value.findIndex((chart) => chart === selected.value),
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

	selected.value = chartToSet.options.chartTitle
	selectedChart.value = chartToSet
	GlobalChartState.value = chartToSet
	GlobalSiteOptions.value.currentChart = chartToSet.options.chartTitle
	setCurrentChart(selected.value)
	chartNameInput.value = chartToSet.options.chartTitle

	deleteModal.value.close()
}

onMounted(() => {
	DynamicImportDialogPolyfill([
		newModal.value,
		renameModal.value,
		deleteModal.value
	])

	ClickOutsideDialog(newModal.value)
	ClickOutsideDialog(renameModal.value)
	ClickOutsideDialog(deleteModal.value)

	const storedLastChart = getCurrentChart()

	if (storedLastChart) {
		selectedChart.value = getStoredChart(storedLastChart)!
	}
	if (!storedLastChart || !selectedChart.value) {
		const newDefaultChart = GenerateDefaultChart()
		setStoredChart(newDefaultChart.options.chartTitle, newDefaultChart)
		selectedChart.value = newDefaultChart
	}

	setCurrentChart(selectedChart.value.options.chartTitle)
	GlobalChartState.value = selectedChart.value
	StoredChartNames.value = getAllSavedKeys()
	selected.value = selectedChart.value.options.chartTitle

	chartNameInput.value = selected.value

	emit('canRenderChart')
	initializing.value = false
})
</script>

<template>
	<!-- a section for for selecting your chart, creating new, renaming, and deleting
	https://i.gyazo.com/b0bbce58dbc30fa673ed26d14e93b7ef.png -->

	<div class="flex flex-col items-center justify-center mt-1">
		<label>Select Chart: </label>
		<select v-model="selected" class="tw-input" @change="onSelect">
			<option v-for="(name, index) in StoredChartNames" :key="index">
				{{ name }}
			</option>
		</select>
	</div>
	<div class="flex-col gap-4 mt-2">
		<div class="flex flex-col justify-center items-center">
			<label>Chart Name: </label>
			<input
				ref="chartInput"
				v-model="chartNameInput"
				placeholder="Name of chart"
				type="text"
				class="p-2 tw-input mr-1 invalid:text-red-500"
				title="Any name but can't just be a number."
				pattern="(?!GlobalSiteOptions$).*"
			/>
			<p
				v-if="chartNameInput === '' || !chartInput.validity.valid"
				class="pt-1"
			>
				The name must not be empty or {{ SiteOptionsKey }}
			</p>
		</div>
		<div v-if="!initializing" class="mt-2 mb-2">
			<button
				v-show="chartNameInput !== '' && chartInput.validity.valid"
				type="button"
				class="tw-button ml-1"
				@click="onNewChart"
			>
				New
			</button>
			<button
				v-show="chartNameInput !== '' && chartInput.validity.valid"
				type="button"
				class="tw-button ml-1 mb-1"
				@click="onRenameChart"
			>
				Rename
			</button>
			<button
				v-show="chartNameInput !== '' && chartInput.validity.valid"
				type="button"
				class="tw-button ml-1 mb-1"
				@click="deleteModal.showModal()"
			>
				Delete
			</button>
		</div>
	</div>

	<dialog
		ref="newModal"
		class="bg-transparent"
		@keypress.esc="newModal.close()"
	>
		<div
			class="bg-neutral-700 p-5 flex flex-col gap-2 justify-center items-center text-neutral-200"
		>
			<p>
				New chart named: "<label class="text-green-300">{{ tempRename }}</label
				>"
			</p>
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

			<button class="tw-button mt-1 py-1 px-3" @click="newModal.close()">
				Cancel
			</button>
		</div>
	</dialog>

	<dialog
		ref="renameModal"
		class="bg-transparent"
		@keypress.esc="renameModal.close()"
	>
		<div
			class="bg-neutral-700 p-5 flex flex-col gap-2 justify-center items-center"
		>
			<p class="text-neutral-200">
				Rename current chart to "<label class="text-green-300">
					{{ tempRename }} </label
				>"?
			</p>

			<div class="flex gap-2">
				<button class="tw-button" @click="renameChart">Yes</button>
				<button class="tw-button" @click="renameModal.close()">No</button>
			</div>
		</div>
	</dialog>

	<dialog
		ref="deleteModal"
		class="bg-transparent"
		@keypress.esc="deleteModal.close()"
	>
		<div
			class="bg-neutral-700 p-5 flex flex-col gap-2 justify-center items-center"
		>
			<p class="text-neutral-200">Delete current chart permanently?</p>

			<div class="flex gap-2">
				<button class="tw-button" @click="deleteChart">Yes</button>
				<button class="tw-button" @click="deleteModal.close()">No</button>
			</div>
		</div>
	</dialog>
</template>
