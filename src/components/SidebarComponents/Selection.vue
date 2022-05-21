<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted } from 'vue'
import { GenerateDefaultChart, GlobalChartState } from '../../shared'
import {
	setStoredChart,
	getStoredChart,
	deleteStoredChart
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

function storeChartNameList() {
	if (storedChartNames.value.length > 0) {
		localStorage.setItem(
			'storedChartNames',
			JSON.stringify(storedChartNames.value)
		)
	}
}

function onSelect() {
	const loadedChart = getStoredChart(selected.value) as ChartState
	if (!loadedChart) {
		console.error(`Failed to load Selected Chart ${selected.value}.`)
		console.log(
			`Chart returned from using ${selected.value} key is ${loadedChart}`
		)
		return
	}
	// First, store current chart. Avoiding save current chart because selected should have changed at this point
	setStoredChart(selectedChart.value.options.chartTitle, selectedChart.value)
	// Now, update current chart, and update latest chart to current.
	selectedChart.value = loadedChart
	loadedChart.options.chartTitle = selected.value
	console.log(1)
	setStoredChart('storedLastChart', loadedChart)
	GlobalChartState.value = loadedChart
	console.log(2, loadedChart)
	emit('canRenderChart')
}

function addChart() {
	// add a visible text or alert error to specify a name must be present in the text field
	console.log(chartNameInput.value)
	saveCurrentChart()
	storedChartNames.value.unshift(chartNameInput.value)
	selected.value = chartNameInput.value
	selectedChart.value = GenerateDefaultChart()
	selectedChart.value.options.chartTitle = chartNameInput.value
	emit('canRenderChart')
	storeChartNameList()
	setStoredChart('storedLastChart', selectedChart.value)
}

function renameChart() {
	console.log('rename chart', chartNameInput.value)
	const index = storedChartNames.value.findIndex(
		(n) => n.toLocaleLowerCase() === selected.value.toLocaleLowerCase()
	)
	deleteStoredChart(selected.value)
	storedChartNames.value[index] = chartNameInput.value
	selected.value = chartNameInput.value
	selectedChart.value.options.chartTitle = chartNameInput.value
	storeChartNameList()
	setStoredChart('storedLastChart', selectedChart.value)
}

onMounted(() => {
	// Should find a way to make this local storage item not be something the user could input on accident or on purpose.
	// Should consider any frequently used names for local storage be on a seperate, server side file or function.
	const storedVal = localStorage.getItem('storedChartNames')
	const storedLastChart = getStoredChart('storedLastChart')

	// Use these for when this component is complete
	selectedChart.value = storedLastChart
		? storedLastChart
		: (GlobalChartState.value = GenerateDefaultChart())
	GlobalChartState.value = selectedChart.value
	selected.value = selectedChart.value.options.chartTitle
	storedChartNames.value = [selected.value]
	storedChartNames.value = storedVal ? JSON.parse(storedVal) : [selected.value]
	console.log('Logging stored chart names values:', storedChartNames.value)
	console.log(
		'Selection Successfully Mounted, current chart state:',
		selectedChart.value
	)
	emit('canRenderChart')
})
</script>

<template>
	<!-- a section for for selecting your chart, creating new, renaming, and deleting
	https://i.gyazo.com/b0bbce58dbc30fa673ed26d14e93b7ef.png -->
	<select v-model="selected" class="text-black" @change="onSelect">
		<option v-for="(name, index) in storedChartNames" :key="index">
			{{ name }}
		</option>
	</select>
	<div class="flex-col gap-4 mt-8 mb-8">
		<input v-model="chartNameInput" type="text" class="p-2 text-black mr-2" />
		<!--Lmao garbo formatting here but will fix later. Please fix this later me, I beg of thee-->
		<a class="underline mr-1" href="#" @click="addChart">Add Chart</a>
		<a class="underline mr-1" href="#" @click="renameChart">Rename Chart</a>
	</div>
</template>
