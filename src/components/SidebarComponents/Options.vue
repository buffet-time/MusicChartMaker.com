<script setup lang="ts">
import { ref, watch } from 'vue'
import { FillerAlbum, GlobalChartState, GlobalSiteOptions } from '../../shared'
import { SaveSiteOptions } from '../../storage'

const showOptions = ref(true)

watch(
	() => GlobalSiteOptions.value.numberOfSearchResults,
	() => {
		SaveSiteOptions()
	}
)

function columnsChanged(event: InputEvent) {
	console.log(1, event)
	GlobalChartState.value.chartTiles.forEach((row, index) => {
		row.push(FillerAlbum)
		GlobalChartState.value.options.chartSize.rowSizes[index]++
	})
}

function rowsChanged(event: InputEvent) {
	// add a new row array of the same size as the last one
	console.log(2, event)
	const newRow = GlobalChartState.value.chartTiles[
		GlobalChartState.value.chartTiles.length - 1
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	].map(() => FillerAlbum)

	GlobalChartState.value.options.chartSize.rowSizes.push(newRow.length)
	GlobalChartState.value.chartTiles.push(newRow)
}
</script>

<template>
	<div v-if="showOptions" class="flex flex-col mx-4 mt-3">
		<label>
			Columns: {{ GlobalChartState.options.chartSize.rowSizes.length }}
		</label>
		<input
			v-model="GlobalChartState.options.chartSize.rowSizes.length"
			type="range"
			min="1"
			max="20"
			step="1"
			@change="(event) => columnsChanged(event as any)"
		/>

		<label class="mt-2">
			Rows: {{ GlobalChartState.options.chartSize.numberOfRows }}
		</label>
		<input
			v-model="GlobalChartState.options.chartSize.numberOfRows"
			type="range"
			min="1"
			max="20"
			step="1"
			@change="(event) => rowsChanged(event as any)"
		/>

		<label class="mt-2">
			# of Search Results: {{ GlobalSiteOptions.numberOfSearchResults }}
		</label>
		<input
			v-model="GlobalSiteOptions.numberOfSearchResults"
			type="range"
			min="10"
			max="50"
			step="1"
		/>

		<div class="flex justify-center items-center gap-2 mt-2">
			<label>Show Album Titles</label>
			<input
				v-model="GlobalChartState.options.displayTitles"
				type="checkbox"
				class="tw-checkbox"
			/>
		</div>

		<div class="flex justify-center items-center gap-2 mt-2">
			<label>Show Numbers</label>
			<input
				v-model="GlobalChartState.options.displayNumberRank"
				type="checkbox"
				class="tw-checkbox"
				:disabled="!GlobalChartState.options.displayTitles"
			/>
		</div>
	</div>
</template>
