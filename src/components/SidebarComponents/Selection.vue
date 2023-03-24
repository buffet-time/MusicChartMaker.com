<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ref, onMounted, watch } from 'vue'
import type { ChartState } from '#types'
import { GenerateDefaultChart } from '#shared/chart'
import {
	GlobalChartState,
	GlobalSiteOptions,
	StoredChartNames
} from '#shared/globals'
import {
	setStoredChart,
	getStoredChart,
	setCurrentChart,
	getCurrentChart,
	getAllSavedKeys
} from '#shared/storage'

import Rename from './SelectionComponents/Rename.vue'
import Delete from './SelectionComponents/Delete.vue'
import New from './SelectionComponents/New.vue'

const emit = defineEmits<{
	(event: 'canRenderChart'): void
}>()

const selectedChartTitle = ref('')
const initializing = ref(true)

// While this works, it may be better to just globalize selectedChartTitle performance wise. May be too many cases of feedback looping watches.
watch(
	() => GlobalSiteOptions.value.currentChart,
	async (newTitle: string, oldTitle: string) => {
		if (newTitle === oldTitle) {
			return
		}
		selectedChartTitle.value = newTitle
	}
)

// this is a bit janky :/
function onSelect() {
	if (!GlobalChartState.value || !GlobalSiteOptions.value) {
		return console.error(
			'Error getting either GlobalChartState or Options in onSelect()',
			GlobalChartState.value,
			GlobalSiteOptions.value
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
}

onMounted(() => {
	const storedLastChart = getCurrentChart()

	if (storedLastChart) {
		GlobalChartState.value = getStoredChart(storedLastChart)!
	}
	if (!storedLastChart || !GlobalChartState.value) {
		const newDefaultChart = GenerateDefaultChart()
		setStoredChart(newDefaultChart.options.chartTitle, newDefaultChart)
		GlobalChartState.value = newDefaultChart
	}

	setCurrentChart(GlobalChartState.value.options.chartTitle)
	StoredChartNames.value = getAllSavedKeys()
	selectedChartTitle.value = GlobalChartState.value.options.chartTitle

	emit('canRenderChart')
	initializing.value = false
})
</script>

<template>
	<!-- a section for for selecting your chart, creating new, renaming, and deleting
	https://i.gyazo.com/b0bbce58dbc30fa673ed26d14e93b7ef.png -->

	<div class="tw-flex-center flex-col">
		<label>Select Chart: </label>
		<select
			v-model="selectedChartTitle"
			class="tw-input pr-1 pl-2"
			@change="onSelect"
		>
			<option v-for="(name, index) in StoredChartNames" :key="index">
				{{ name }}
			</option>
		</select>
	</div>
	<div class="mt-2">
		<div v-if="!initializing">
			<!-- make sure new and rename completely properly prevent name collision -->
			<New
				:selected-chart-title="selectedChartTitle"
				:selected-chart="GlobalChartState!"
				@update-selected-chart-title="(value) => (selectedChartTitle = value)"
			/>
			<!-- may need to update selected too? -->

			<Rename
				:selected-chart="GlobalChartState!"
				:selected-chart-title="selectedChartTitle"
				@update-chart-title="
					(value) => { 
						GlobalChartState!.options.chartTitle = value
						selectedChartTitle = value 
					} 
				"
			/>

			<Delete
				:selected-chart-title="selectedChartTitle"
				@delete-chart="
					(value) => {
						selectedChartTitle = value.options.chartTitle
						GlobalChartState = value
					}
				"
			/>
		</div>
	</div>
</template>
