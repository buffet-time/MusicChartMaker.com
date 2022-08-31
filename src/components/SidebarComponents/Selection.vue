<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ref, onMounted } from 'vue'
import {
	GenerateDefaultChart,
	GeneratePresetChart,
	GlobalChartState,
	GlobalSiteOptions,
	StoredChartNames
} from '#src/shared'
import {
	setStoredChart,
	getStoredChart,
	setCurrentChart,
	getCurrentChart,
	getAllSavedKeys,
	SiteOptionsKey
} from '#src/storage'
import { type Preset, type ChartState } from '#types/types'
import Rename from './SelectionComponents/Rename.vue'
import Delete from './SelectionComponents/Delete.vue'
import New from './SelectionComponents/New.vue'

const emit = defineEmits<{
	(event: 'canRenderChart'): void
}>()

const chartNameInput = ref('')
const selectedChart = ref<ChartState>()
const selected = ref('')
const initializing = ref(true)
const tempRename = ref('')

// Reference to HTML elements
const chartInput = ref<HTMLInputElement>()

// this is a bit janky :/
function onSelect() {
	if (!GlobalChartState.value || !GlobalSiteOptions.value) {
		return console.error(
			'Error getting either GlobalChartState or Options in onSelect()',
			GlobalChartState,
			GlobalSiteOptions
		)
	}

	const loadedChart = getStoredChart(String(selected.value)) as ChartState
	if (!loadedChart) {
		return console.error(`Failed to load Selected Chart ${selected.value}.`)
	}
	// First, store current chart
	setCurrentChart(selected.value)
	// Now, update current chart, and update latest chart to current.
	GlobalChartState.value = loadedChart
	GlobalSiteOptions.value.currentChart = selected.value
	selectedChart.value = loadedChart
	chartNameInput.value = loadedChart.options.chartTitle
}

function newChart(type: 'Custom' | 'Preset', preset?: Preset) {
	StoredChartNames.value.unshift(tempRename.value)
	if (type === 'Custom') {
		selectedChart.value = GenerateDefaultChart(tempRename.value)
	} else if (type === 'Preset' && preset) {
		selectedChart.value = GeneratePresetChart(tempRename.value, preset)
	} else {
		return console.error('Incorrect addChart() invocation: ', type, preset)
	}
	selected.value = chartNameInput.value = tempRename.value
	setCurrentChart(tempRename.value)
	saveCurrentChart()
	GlobalChartState.value = selectedChart.value
}

function saveCurrentChart() {
	if (selected.value && selectedChart) {
		return setStoredChart(selected.value, selectedChart.value!)
	}
	throw new Error('Error: Cannot save current Chart!')
}

onMounted(() => {
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
				v-if="chartNameInput === '' || !chartInput?.validity.valid"
				class="pt-1"
			>
				The name must not be empty or {{ SiteOptionsKey }}
			</p>
		</div>
		<div v-if="!initializing" class="mt-2 mb-2">
			<New
				:chart-name-input="chartNameInput"
				:temp-rename="tempRename"
				:chart-validity="chartInput?.validity.valid"
				@update-temp-rename="(value) => (tempRename = value)"
				@new-chart="newChart"
			/>

			<Rename
				:chart-name-input="chartNameInput"
				:selected-chart="selectedChart!"
				:selected="selected"
				:temp-rename="tempRename"
				:chart-validity="chartInput?.validity.valid"
				@update-temp-rename="(value) => (tempRename = value)"
				@update-selected="(value) => (selected = value)"
				@update-chart-title="
					(value) => (selectedChart!.options.chartTitle = value)
				"
				@update-chart-name-input="(value) => (chartNameInput = value)"
			/>

			<Delete
				:chart-name-input="chartNameInput"
				:selected-chart="selectedChart!"
				:selected="selected"
				:chart-validity="chartInput?.validity.valid"
				@update-selected="(value) => (selected = value)"
				@update-selected-chart="(value) => (selectedChart = value)"
				@update-chart-name-input="(value) => (chartNameInput = value)"
			/>
		</div>
	</div>
</template>
