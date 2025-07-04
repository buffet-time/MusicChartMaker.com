<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { GenerateDefaultChart } from '#utils/chart'
import {
	GlobalChartState,
	GlobalSiteOptions,
	StoredChartNames,
	selectedChartTitle,
} from '#utils/globals'
import {
	setStoredChart,
	getStoredChart,
	setCurrentChart,
	getCurrentChart,
	getAllSavedKeys,
} from '#utils/storage'

import Rename from './SelectionComponents/Rename.vue'
import Delete from './SelectionComponents/Delete.vue'
import New from './SelectionComponents/New.vue'
import Select from './SelectionComponents/Select.vue'

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
	},
)

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
	<Select />

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
