<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ref, type Ref, onMounted } from 'vue'
import { GenerateDefaultChart, GlobalChartState } from '../../shared'
import {
	setStoredChart,
	getStoredChart,
	deleteStoredChart,
	setCurrentChart,
	getCurrentChart,
	getAllSavedKeys
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
const showButtons = ref(true)

// TODO - Need a Text box, an Input for names, a dropdown
// TODO - Cleanse input text maybe?

function saveCurrentChart() {
	if (selected.value && selectedChart.value) {
		return setStoredChart(selected.value, selectedChart.value)
	}
	throw new Error('Error: Cannot save current Chart!')
}

// function storeChartNameList() {
// 	if (storedChartNames.value.length > 0) {
// 		localStorage.setItem(
// 			'storedChartNames',
// 			JSON.stringify(storedChartNames.value)
// 		)
// 	}
// }

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
	// setStoredChart(selected.value, selectedChart.value)
	// Now, update current chart, and update latest chart to current.
	selectedChart.value = loadedChart
	GlobalChartState.value = loadedChart
}

// TODO: need to make sure add is working fine
function addChart() {
	saveCurrentChart()
	storedChartNames.value.unshift(chartNameInput.value)
	selected.value = chartNameInput.value
	selectedChart.value = GenerateDefaultChart()
	selectedChart.value.options.chartTitle = chartNameInput.value
	setCurrentChart(chartNameInput.value)
	saveCurrentChart()
}

// TODO: need to make sure rename is working fine
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

onMounted(() => {
	// Should find a way to make this local storage item not be something the user could input on accident or on purpose.
	// Should consider any frequently used names for local storage be on a seperate, server side file or function.
	const storedLastChart = getCurrentChart()
	// Use these for when this component is complete
	// storedChartNames.value = storedVal ? JSON.parse(storedVal) : []

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

	// console.log(
	// 	'Selection Successfully Mounted, current chart state:',
	// 	selectedChart.value.options.chartTitle
	// )

	emit('canRenderChart')
})
</script>

<template>
	<!-- a section for for selecting your chart, creating new, renaming, and deleting
	https://i.gyazo.com/b0bbce58dbc30fa673ed26d14e93b7ef.png -->
	<select v-model="selected" class="tw-input mt-4" @change="onSelect">
		<option v-for="(name, index) in storedChartNames" :key="index">
			{{ name }}
		</option>
	</select>
	<div class="flex-col gap-4 mt-8 mb-8">
		<input v-model="chartNameInput" type="text" class="p-2 tw-input mr-1" />
		<!--Lmao garbo formatting here but will fix later. Please fix this later me, I beg of thee-->
		<template v-if="showButtons">
			<button type="button" class="tw-button ml-1" @click="addChart">
				Add
			</button>
			<button type="button" class="tw-button ml-1" @click="renameChart">
				Rename
			</button>
		</template>
	</div>
</template>
