<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ref, type Ref, onMounted } from 'vue'
import {
	GenerateDefaultChart,
	GlobalChartState,
	GlobalSiteOptions,
	PreventNameCollision
} from '../../shared'
import {
	setStoredChart,
	getStoredChart,
	deleteStoredChart,
	setCurrentChart,
	getCurrentChart,
	getAllSavedKeys,
	getFirstChart,
	SiteOptionsKey
} from '../../storage'
import { type ChartState } from '../../types'

const emit = defineEmits<{
	(event: 'canRenderChart'): void
}>()

const chartNameInput = ref('')
const storedChartNames = ref([''])
const selectedChart = ref() as Ref<ChartState>
const selected = ref('')
const chartInput = ref() as Ref<HTMLInputElement>
const intializing = ref(true)

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
	selectedChart.value = loadedChart
	GlobalChartState.value = loadedChart
	GlobalSiteOptions.value.currentChart = selected.value
	chartNameInput.value = loadedChart.options.chartTitle
}

function addChart() {
	const chartNameToSave = PreventNameCollision(chartNameInput.value)
	storedChartNames.value.unshift(chartNameToSave)
	selectedChart.value = GenerateDefaultChart(chartNameToSave)
	selected.value = chartNameInput.value = chartNameToSave
	setCurrentChart(chartNameToSave)
	saveCurrentChart()
	GlobalChartState.value = selectedChart.value
}

function renameChart() {
	const index = storedChartNames.value.findIndex(
		(name) => name === selected.value
	)
	const chartRename = PreventNameCollision(chartNameInput.value)
	selectedChart.value.options.chartTitle = chartNameInput.value = chartRename
	setStoredChart(chartRename, selectedChart.value)
	deleteStoredChart(selected.value)
	setCurrentChart(chartRename)

	storedChartNames.value[index] = chartRename
	selected.value = chartRename
}

function deleteChart() {
	if (window.confirm('Delete the currently selected chart?')) {
		deleteStoredChart(selected.value)
		storedChartNames.value.splice(
			storedChartNames.value.findIndex((chart) => chart === selected.value),
			1
		)
		const firstChartReturn = getFirstChart()

		let chartToSet: ChartState
		if (firstChartReturn) {
			chartToSet = firstChartReturn
		} else {
			chartToSet = GenerateDefaultChart()
			storedChartNames.value.push(chartToSet.options.chartTitle)
		}

		selected.value = chartToSet.options.chartTitle
		selectedChart.value = chartToSet
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
		const anchor = document.createElement('a')
		anchor.href = canvas.toDataURL('image/png')
		anchor.download = `${GlobalChartState.value.options.chartTitle}.png`
		anchor.click()
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
	intializing.value = false
})
</script>

<template>
	<!-- a section for for selecting your chart, creating new, renaming, and deleting
	https://i.gyazo.com/b0bbce58dbc30fa673ed26d14e93b7ef.png -->

	<button class="mt-1 tw-button py-1 px-3" @click="saveImage">
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
		<div v-if="!intializing" class="mt-2 mb-2">
			<button
				v-show="chartNameInput !== '' && chartInput.validity.valid"
				type="button"
				class="tw-button ml-1"
				@click="addChart"
			>
				Add
			</button>
			<button
				v-show="chartNameInput !== '' && chartInput.validity.valid"
				type="button"
				class="tw-button ml-1 mb-1"
				@click="renameChart"
			>
				Rename
			</button>
			<button
				v-show="chartNameInput !== '' && chartInput.validity.valid"
				type="button"
				class="tw-button ml-1 mb-1"
				@click="deleteChart"
			>
				Delete
			</button>
		</div>
	</div>
</template>
