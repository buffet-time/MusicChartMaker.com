<script setup lang="ts">
import { getStoredChart, setCurrentChart } from '#utils/storage'
import {
	GlobalChartState,
	GlobalSiteOptions,
	StoredChartNames,
	selectedChartTitle,
} from '#utils/globals'
import { nextTick, onMounted, watch } from 'vue'

onMounted(async () => {
	// ensures the StoredChartNames ref is defined
	await nextTick()
	sortStoredChartNames()
})

watch(
	() => GlobalSiteOptions.value.chartTitleSortingMethod,
	() => sortStoredChartNames(),
)

function sortStoredChartNames() {
	switch (GlobalSiteOptions.value.chartTitleSortingMethod) {
		case 'Ascending':
			StoredChartNames.value.sort()
			break

		case 'Descending':
			StoredChartNames.value.sort().reverse()
			break

		case 'Least Characters':
			sortByCharacterAmount({ reversed: true })
			break

		case 'Most Characters':
			sortByCharacterAmount({ reversed: false })
			break
	}
}

function sortByCharacterAmount({ reversed }: { reversed: boolean }) {
	StoredChartNames.value.sort((a, b) => {
		{
			switch (true) {
				case a.length > b.length:
					return -1
				case a.length < b.length:
					return 1
				default:
					return 0
			}
		}
	})

	if (reversed) {
		StoredChartNames.value.reverse()
	}
}

function onChartSelect() {
	const loadedChart = getStoredChart(String(selectedChartTitle.value))!
	if (!loadedChart) {
		return console.error(
			`Failed to load Selected Chart ${selectedChartTitle.value}.`,
		)
	}
	// First, store current chart
	setCurrentChart(selectedChartTitle.value)
	// Now, update current chart, and update latest chart to current.
	GlobalChartState.value = loadedChart
	GlobalSiteOptions.value.currentChart = selectedChartTitle.value
}
</script>

<template>
	<div class="uno-flex-center flex-col">
		<label class="mb-1">Select Chart: </label>
		<select
			v-model="selectedChartTitle"
			class="uno-input global-select uno-select pl-1"
			@change="onChartSelect"
		>
			<option v-for="(name, index) in StoredChartNames" :key="index">
				{{ name }}
			</option>
		</select>
	</div>
</template>
