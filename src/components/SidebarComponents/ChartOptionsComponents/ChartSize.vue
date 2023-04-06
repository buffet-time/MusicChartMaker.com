<script setup lang="ts">
import { ref, watch } from 'vue'
import { GlobalChartState, GlobalSiteOptions } from '#shared/globals'
import { FillerAlbum } from '#shared/misc'

const colsNum = ref(GlobalChartState.value.options.chartSize.rowSizes[0])
const rowsNum = ref(GlobalChartState.value.options.chartSize.rowSizes.length)

// used to disable watchers for cols/ rows when changing charts
let updatingRows = false
let updatingCols = false

watch(colsNum, (newColNum, prevColNum) => {
	if (updatingCols || GlobalChartState.value.options.preset) {
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
	if (updatingRows || GlobalChartState.value.options.preset) {
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
	() => GlobalSiteOptions.value.currentChart,
	() => {
		// if its a preset we dont need to touch the column and row nums
		if (GlobalChartState.value.options.preset) {
			return
		}

		updatingCols = true
		colsNum.value = GlobalChartState.value.options.chartSize.rowSizes[0]

		updatingRows = true
		rowsNum.value = GlobalChartState.value.options.chartSize.rowSizes.length
	}
)

function colsChanged(difference: number) {
	if (!GlobalChartState) {
		return console.error('error in colsChanged', GlobalChartState)
	}

	if (difference > 0) {
		// Add a new column
		GlobalChartState.value.chartTiles.forEach((row, index) => {
			for (let x = 0; x < difference; x++) {
				row.push(FillerAlbum)
				GlobalChartState.value.options.chartSize.rowSizes[index]++
			}
		})
		return
	}

	// Remove a column
	GlobalChartState.value.chartTiles.forEach((row, index) => {
		for (let x = 0; x < Math.abs(difference); x++) {
			row.pop()
			GlobalChartState.value.options.chartSize.rowSizes[index]--
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
			const newRow = GlobalChartState.value.chartTiles[
				GlobalChartState.value.chartTiles.length - 1
			].map(() => FillerAlbum)

			GlobalChartState.value.options.chartSize.rowSizes.push(newRow.length)
			GlobalChartState.value.chartTiles.push(newRow)
		}
		return
	}

	// Remove a row
	for (let x = 0; x < Math.abs(difference); x++) {
		GlobalChartState.value.options.chartSize.rowSizes.pop()
		GlobalChartState.value.chartTiles.pop()
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
</template>
