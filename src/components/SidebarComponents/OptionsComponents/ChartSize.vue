<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { GlobalChartState, GlobalSiteOptions } from '#shared/globals'
import { FillerAlbum } from '#shared/misc'

const colsNum = ref(GlobalChartState.options.chartSize.rowSizes[0])
const rowsNum = ref(GlobalChartState.options.chartSize.rowSizes.length)

// used to disable watchers for cols/ rows when changing charts
let updatingRows = false
let updatingCols = false

watch(colsNum, (newColNum, prevColNum) => {
	if (updatingCols || GlobalChartState.options.preset) {
		// if this was triggered by currentChart being changed skip 1 iteration
		updatingCols = false
		return
	}

	if (!newColNum || !prevColNum) {
		return console.error(
			'NewColNum or PrevColNum in watch(colNum doesnt exist)',
			newColNum,
			prevColNum
		)
	}

	colsChanged(newColNum - prevColNum)
})
watch(rowsNum, (newRowNum, prevRowNum) => {
	if (updatingRows || GlobalChartState.options.preset) {
		// if this was triggered by currentChart being changed skip 1 iteration
		updatingRows = false
		return
	}

	if (!newRowNum || !prevRowNum) {
		return console.error(
			'newRowNum or prevRowNum in watch(rowsNum doesnt exist)',
			newRowNum,
			prevRowNum
		)
	}

	rowsChanged(newRowNum - prevRowNum)
})

watch(
	() => GlobalSiteOptions.currentChart,
	() => {
		// if its a preset we dont need to touch the column and row nums
		if (GlobalChartState.options.preset) {
			return
		}

		updatingCols = true
		colsNum.value = GlobalChartState.options.chartSize.rowSizes[0]

		updatingRows = true
		rowsNum.value = GlobalChartState.options.chartSize.rowSizes.length
	}
)

function colsChanged(difference: number) {
	if (!GlobalChartState) {
		return console.error('error in colsChanged', GlobalChartState)
	}

	if (difference > 0) {
		// Add a new column
		GlobalChartState.chartTiles.forEach((row, index) => {
			for (let x = 0; x < difference; x++) {
				row.push(FillerAlbum)
				GlobalChartState.options.chartSize.rowSizes[index]++
			}
		})
		return
	}

	// Remove a column
	GlobalChartState.chartTiles.forEach((row, index) => {
		for (let x = 0; x < Math.abs(difference); x++) {
			row.pop()
			GlobalChartState.options.chartSize.rowSizes[index]--
		}
	})
}

function rowsChanged(difference: number) {
	if (!GlobalChartState) {
		return console.error('error in rowsChanged', GlobalChartState)
	}

	// add a new row array of the same size as the last one
	if (difference > 0) {
		// Add a row
		for (let x = 0; x < difference; x++) {
			const newRow = GlobalChartState.chartTiles[
				GlobalChartState.chartTiles.length - 1
			].map(() => FillerAlbum)

			GlobalChartState.options.chartSize.rowSizes.push(newRow.length)
			GlobalChartState.chartTiles.push(newRow)
		}
		return
	}

	// Remove a row
	for (let x = 0; x < Math.abs(difference); x++) {
		GlobalChartState.options.chartSize.rowSizes.pop()
		GlobalChartState.chartTiles.pop()
	}
}
</script>

<template>
	<template v-if="!GlobalChartState!.options.preset">
		<label class="pt-4"> Columns: {{ colsNum }} </label>
		<input
			v-model="colsNum"
			class="cursor-pointer"
			type="range"
			min="1"
			max="20"
			step="1"
		/>

		<label class="mt-2"> Rows: {{ rowsNum }} </label>
		<input
			v-model="rowsNum"
			class="cursor-pointer"
			type="range"
			min="1"
			max="20"
			step="1"
		/>
	</template>

	<label class="mt-2" :class="{ 'pt-7': GlobalChartState!.options.preset }">
		Chart Spacing: {{ GlobalChartState!.options.padding }}rem
	</label>
	<input
		v-model="GlobalChartState!.options.padding"
		class="cursor-pointer"
		type="range"
		min="0"
		max="3"
		step="0.1"
	/>
	<label class="mt-2">
		# of Search Results: {{ GlobalSiteOptions?.numberOfSearchResults }}
	</label>
	<input
		v-model="GlobalSiteOptions!.numberOfSearchResults"
		class="cursor-pointer"
		type="range"
		min="10"
		max="50"
		step="1"
	/>
</template>
