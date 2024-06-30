<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ref, onMounted, watch } from 'vue'
import { GenerateDefaultChart } from '#shared/chart'
import {
	GlobalChartState,
	GlobalSiteOptions,
	StoredChartNames,
	selectedChartTitle
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
	canRenderChart: []
}>()

const initializing = ref(true)

// While this works, it may be better to just globalize selectedChartTitle performance wise. May be too many cases of feedback looping watches.
watch(
	() => GlobalSiteOptions.value.currentChart,
	(newTitle: string, oldTitle: string) => {
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

	const loadedChart = getStoredChart(String(selectedChartTitle.value))!
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
	<div class="uno-flex-center flex-col">
		<label class="mb-1">Select Chart: </label>
		<select
			v-model="selectedChartTitle"
			class="uno-input global-select uno-select pl-1"
			@change="onSelect"
		>
			<option v-for="(name, index) in StoredChartNames.sort()" :key="index">
				{{ name }}
			</option>
		</select>
	</div>
	<div class="mt-2">
		<div v-if="!initializing" class="uno-flex-center gap-1">
			<!-- TODO: remove emitting to change `selectedChartTitle' -->
			<New
				:selected-chart-title="selectedChartTitle"
				:selected-chart="GlobalChartState!"
				@update-selected-chart-title="(value) => (selectedChartTitle = value)"
			/>

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
