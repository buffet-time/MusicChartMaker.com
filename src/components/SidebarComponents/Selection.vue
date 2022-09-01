<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ref, onMounted } from 'vue'
import {
	GenerateDefaultChart,
	GlobalChartState,
	GlobalSiteOptions,
	StoredChartNames
} from '#src/shared'
import {
	setStoredChart,
	getStoredChart,
	setCurrentChart,
	getCurrentChart,
	getAllSavedKeys
} from '#src/storage'
import { type ChartState } from '#types/types'
import Rename from './SelectionComponents/Rename.vue'
import Delete from './SelectionComponents/Delete.vue'
import New from './SelectionComponents/New.vue'

const emit = defineEmits<{
	(event: 'canRenderChart'): void
}>()

const selectedChartTitle = ref('')
const selectedChart = ref<ChartState>()
const initializing = ref(true)

// this is a bit janky :/
function onSelect() {
	if (!GlobalChartState.value || !GlobalSiteOptions.value) {
		return console.error(
			'Error getting either GlobalChartState or Options in onSelect()',
			GlobalChartState,
			GlobalSiteOptions
		)
	}

	const loadedChart = getStoredChart(
		String(selectedChartTitle.value)
	) as ChartState
	if (!loadedChart) {
		return console.error(
			`Failed to load Selected Chart ${selectedChartTitle.value}.`
		)
	}
	// First, store current chart
	setCurrentChart(selectedChartTitle.value)
	// Now, update current chart, and update latest chart to current.
	GlobalChartState.value = loadedChart
	GlobalSiteOptions.value.currentChart = selectedChartTitle.value
	selectedChart.value = loadedChart
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
	selectedChartTitle.value = selectedChart.value.options.chartTitle

	emit('canRenderChart')
	initializing.value = false
})
</script>

<template>
	<!-- a section for for selecting your chart, creating new, renaming, and deleting
	https://i.gyazo.com/b0bbce58dbc30fa673ed26d14e93b7ef.png -->

	<div class="flex flex-col items-center justify-center mt-1">
		<label>Select Chart: </label>
		<select v-model="selectedChartTitle" class="tw-input" @change="onSelect">
			<option v-for="(name, index) in StoredChartNames" :key="index">
				{{ name }}
			</option>
		</select>
	</div>
	<div class="flex-col gap-4 mt-2">
		<div v-if="!initializing" class="mt-2 mb-3">
			<!-- make sure new and rename completely properly prevent name collision -->
			<New
				:selected-chart-title="selectedChartTitle"
				:selected-chart="selectedChart!"
				@update-selected-chart-title="(value) => (selectedChartTitle = value)"
			/>
			<!-- may need to update selected too? -->

			<Rename
				:selected-chart="selectedChart!"
				:selected-chart-title="selectedChartTitle"
				@update-chart-title="
					(value) => { 
						selectedChart!.options.chartTitle = value
						selectedChartTitle = value 
					} 
				"
			/>

			<Delete
				:selected-chart-title="selectedChartTitle"
				@delete-chart="
					(value) => {
						selectedChartTitle = value.options.chartTitle
						selectedChart = value
					}
				"
			/>
		</div>
	</div>
</template>
