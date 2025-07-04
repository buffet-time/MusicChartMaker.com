<script setup lang="ts">
import { getStoredChart, setCurrentChart } from '#utils/storage'
import {
	GlobalChartState,
	GlobalSiteOptions,
	StoredChartNames,
	selectedChartTitle,
} from '#utils/globals'

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

function getCharactersSortedChartNames() {
	const tempArray = StoredChartNames.value.sort((a, b) => {
		{
			switch (true) {
				case a.length > b.length:
					return 1
				case a.length < b.length:
					return -1
				default:
					return 0
			}
		}
	})

	return GlobalSiteOptions.value.chartTitleSortingMethod === 'Least Characters'
		? tempArray
		: tempArray.reverse()
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
			<template
				v-if="GlobalSiteOptions.chartTitleSortingMethod === 'Ascending'"
			>
				<option v-for="(name, index) in StoredChartNames.sort()" :key="index">
					{{ name }}
				</option>
			</template>

			<template
				v-else-if="GlobalSiteOptions.chartTitleSortingMethod === 'Descending'"
			>
				<option
					v-for="(name, index) in StoredChartNames.sort().reverse()"
					:key="index"
				>
					{{ name }}
				</option>
			</template>

			<template v-else>
				<option
					v-for="(name, index) in getCharactersSortedChartNames()"
					:key="index"
				>
					{{ name }}
				</option>
			</template>
		</select>
	</div>
</template>
