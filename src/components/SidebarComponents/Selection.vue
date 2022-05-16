<script setup lang="ts">
/* eslint-disable vue/require-v-for-key */
import { ref, type Ref, onMounted } from 'vue'
import { GenerateDefaultChart } from '../../shared'
import { type ChartState } from '../../types'

const chartNameInput = ref('')
const storedChartNames = ref([''])
const selectedChart = ref() as Ref<ChartState>
const selected = ref('')

// TODO - Need a Text box, an Input for names, a dropdown
// TODO - Cleanse input text maybe?
// TODO - Probably best to move all the local storage code and persistence to a seperate file.

function getStoredChart(key: string): ChartState | undefined {
	const item = localStorage.getItem(key)
	console.log(`getStoredChart => retrieved ${item} from storage`)
	return item ? (JSON.parse(item) as ChartState) : undefined
}

function setStoredChart(input: string, value: ChartState): void {
	localStorage.setItem(input, JSON.stringify(value))
	console.log(
		`setStoredChart => Under name ${input}, stored chart state ${value}`
	)
}

function onSelect() {
	const loadedChart = getStoredChart(selected.value) as ChartState
	if (!loadedChart) {
		console.error(`Failed to load Selected Chart ${selected.value}.`)
		return
	}
	// First, store current chart
	setStoredChart(selectedChart.value.options.chartTitle, selectedChart.value)
	// Now, update current chart, and update latest chart to current.
	selectedChart.value = loadedChart
	setStoredChart('storedLastChart', loadedChart)
}

onMounted(() => {
	// Should find a way to make this local storage item not be something the user could input on accident or on purpose.
	// Should consider any frequently used names for local storage be on a seperate, server side file or function.
	const storedVal = localStorage.getItem('storedChartNames')
	const storedLastChart = getStoredChart('storedLastChart')

	// Use these for when this component is complete
	// storedChartNames.value = storedVal ? JSON.parse(storedVal) : []
	selectedChart.value = storedLastChart
		? storedLastChart
		: GenerateDefaultChart()
	storedChartNames.value = [
		'Test Chart',
		'sampleText',
		'This Topster Service brought to you by someone who is not a right wing religious weirdo.'
	]
	console.log(
		'Selection Successfully Mounted, current chart state:',
		selectedChart.value
	)
})
</script>

<template>
	a section for for selecting your chart, creating new, renaming, and deleting
	https://i.gyazo.com/b0bbce58dbc30fa673ed26d14e93b7ef.png
	<select v-model="selected" class="text-black" @onchange.stop="onSelect">
		<option v-for="name in storedChartNames">
			{{ name }}
		</option>
	</select>
</template>
