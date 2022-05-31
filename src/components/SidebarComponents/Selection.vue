<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ref, type Ref, onMounted } from 'vue'
import {
	GenerateDefaultChart,
	GlobalChartState,
	GlobalSiteOptions
} from '../../shared'
import {
	setStoredChart,
	getStoredChart,
	deleteStoredChart,
	setCurrentChart,
	getCurrentChart,
	getAllSavedKeys,
	getFirstChart
} from '../../storage'
import { type ChartState } from '../../types'

const emit = defineEmits<{
	(event: 'canRenderChart'): void
}>()

const chartNameInput = ref('')
// Make a text input field, tie it to rename and Add
const storedChartNames = ref([''])
const selectedChart = ref() as Ref<ChartState>
const selected = ref('')

// TODO - Need a Text box, an Input for names, a dropdown
// TODO - Cleanse input text maybe?
function saveCurrentChart() {
	if (selected.value && selectedChart.value) {
		return setStoredChart(selected.value, selectedChart.value)
	}
	throw new Error('Error: Cannot save current Chart!')
}

function onSelect() {
	const loadedChart = getStoredChart(selected.value) as ChartState
	if (!loadedChart) {
		console.error(`Failed to load Selected Chart ${selected.value}.`)
		// console.log(
		// 	`Chart returned from using ${selected.value} key is ${loadedChart}`
		// )
		return
	}
	// First, store current chart
	setCurrentChart(selected.value)
	// Now, update current chart, and update latest chart to current.
	selectedChart.value = loadedChart
	GlobalChartState.value = loadedChart
	GlobalSiteOptions.value.currentChart = selected.value
	chartNameInput.value = loadedChart.options.chartTitle
}

// TODO: gracefully handle name collisions
function addChart() {
	storedChartNames.value.unshift(chartNameInput.value)
	selected.value = chartNameInput.value
	selectedChart.value = GenerateDefaultChart()
	selectedChart.value.options.chartTitle = chartNameInput.value
	setCurrentChart(chartNameInput.value)
	saveCurrentChart()
	GlobalChartState.value = selectedChart.value
}

function renameChart() {
	const index = storedChartNames.value.findIndex(
		(n) => n.toLocaleLowerCase() === selected.value.toLocaleLowerCase()
	)
	selectedChart.value.options.chartTitle = chartNameInput.value
	setStoredChart(chartNameInput.value, selectedChart.value)
	deleteStoredChart(selected.value)
	setCurrentChart(chartNameInput.value)

	storedChartNames.value[index] = chartNameInput.value
	selected.value = chartNameInput.value
}

function deleteChart() {
	if (window.confirm('Delete the currently selected chart?')) {
		deleteStoredChart(selected.value)
		storedChartNames.value.splice(
			storedChartNames.value.findIndex((chart) => chart === selected.value),
			1
		)
		const firstChartReturn = getFirstChart()
		const chartToSet = firstChartReturn
			? firstChartReturn
			: GenerateDefaultChart()
		selectedChart.value = chartToSet
		selected.value = chartToSet.options.chartTitle
		GlobalChartState.value = chartToSet
		GlobalSiteOptions.value.currentChart = chartToSet.options.chartTitle
		setCurrentChart(selected.value)
		chartNameInput.value = chartToSet.options.chartTitle
	}
}

async function saveImage() {
	try {
		const { default: HTML2Canvas } = await import('html2canvas')
		const canvas = await HTML2Canvas(document.getElementById('Chart')!, {
			allowTaint: true,
			useCORS: true,
			backgroundColor: '#303030'
		})
		// canvas.style.paddingLeft = '8px'
		// canvas.style.paddingBottom = '8px'
		const anchor = document.createElement('a')
		anchor.href = canvas.toDataURL('image/png')
		anchor.download = `${GlobalChartState.value.options.chartTitle}.png`
		anchor.click()
		// document.write('<img src="' + img + '"/>')
	} catch (error) {
		console.error(`Error in Save Image: ${Error}`)
	}
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
	storedChartNames.value = getAllSavedKeys()
	selected.value = selectedChart.value.options.chartTitle

	chartNameInput.value = selected.value

	emit('canRenderChart')
})
</script>

<template>
	<!-- a section for for selecting your chart, creating new, renaming, and deleting
	https://i.gyazo.com/b0bbce58dbc30fa673ed26d14e93b7ef.png -->

	<button class="mt-2 tw-button py-1 px-3" @click="saveImage">
		Save Image
	</button>

	<div class="flex flex-col items-center justify-center mt-1">
		<label>Select Chart: </label>
		<select v-model="selected" class="tw-input" @change="onSelect">
			<option v-for="(name, index) in storedChartNames" :key="index">
				{{ name }}
			</option>
		</select>
	</div>
	<div class="flex-col gap-4 mt-2">
		<div class="flex flex-col justify-center items-center">
			<label>Chart Name: </label>
			<input
				v-model="chartNameInput"
				placeholder="Name of chart"
				type="text"
				class="p-2 tw-input mr-1"
			/>
		</div>
		<div class="mt-2 mb-2">
			<button
				type="button"
				class="tw-button ml-1"
				:disabled="chartNameInput === ''"
				@click="addChart"
			>
				Add
			</button>
			<button
				type="button"
				class="tw-button ml-1 mb-1"
				:disabled="chartNameInput === ''"
				@click="renameChart"
			>
				Rename
			</button>
			<button type="button" class="tw-button ml-1 mb-1" @click="deleteChart">
				Delete
			</button>
		</div>
	</div>
</template>
