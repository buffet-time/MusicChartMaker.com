<script setup lang="ts">
import {
	FillerAlbum,
	GlobalChartState,
	GlobalSiteOptions
} from '#root/src/shared'
import { SaveSiteOptions } from '#src/storage'
import { ref, watch } from 'vue'

const colsNum = ref(GlobalChartState.value?.options.chartSize.rowSizes[0])
const rowsNum = ref(GlobalChartState.value?.options.chartSize.rowSizes.length)
const isPreset = ref(GlobalChartState.value?.options.preset ? true : false)

// used to disable watchers for cols/ rows when changing charts
let updatingRows = false
let updatingCols = false

watch(
	() => GlobalSiteOptions.value?.numberOfSearchResults,
	() => SaveSiteOptions()
)
watch(
	() => GlobalChartState.value?.options.preset,
	() => {
		isPreset.value = GlobalChartState.value?.options.preset ? true : false
	}
)

watch(colsNum, (newColNum, prevColNum) => {
	if (updatingCols) {
		// if this was triggered by currentChart being changed skip 1 iteration
		updatingCols = false
		return
	}
	if (isPreset.value) return

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
	if (updatingRows) {
		// if this was triggered by currentChart being changed skip 1 iteration
		updatingRows = false
		return
	}

	if (isPreset.value) return

	if (!newRowNum || !prevRowNum) {
		return console.error(
			'newRowNum or prevRowNum in watch(rowsNum doesnt exist)',
			newRowNum,
			prevRowNum
		)
	}

	rowsChanged(newRowNum - prevRowNum)
})

// TODO: conditional watchers (as to not waste cpu)?
watch(
	() => GlobalSiteOptions.value?.currentChart,
	() => {
		// if its a preset we dont need to touch the column and row nums
		if (isPreset.value) return

		updatingCols = true
		colsNum.value = GlobalChartState.value?.options.chartSize.rowSizes[0]

		updatingRows = true
		rowsNum.value = GlobalChartState.value?.options.chartSize.rowSizes.length
	}
)

function colsChanged(difference: number) {
	if (!GlobalChartState.value) {
		return console.error('error in colsChanged', GlobalChartState)
	}

	if (difference > 0) {
		// Add a new column
		GlobalChartState.value.chartTiles.forEach((row, index) => {
			for (let x = 0; x < difference; x++) {
				row.push(FillerAlbum)
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				GlobalChartState.value!.options.chartSize.rowSizes[index]++
			}
		})
	} else {
		// Remove a column
		GlobalChartState.value.chartTiles.forEach((row, index) => {
			for (let x = 0; x < Math.abs(difference); x++) {
				row.pop()
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				GlobalChartState.value!.options.chartSize.rowSizes[index]--
			}
		})
	}
}

function rowsChanged(difference: number) {
	if (!GlobalChartState.value) {
		return console.error('error in rowsChanged', GlobalChartState)
	}

	// add a new row array of the same size as the last one
	if (difference > 0) {
		// Add a row
		for (let x = 0; x < difference; x++) {
			const newRow = GlobalChartState.value.chartTiles[
				GlobalChartState.value.chartTiles.length - 1
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			].map(() => FillerAlbum)

			GlobalChartState.value.options.chartSize.rowSizes.push(newRow.length)
			GlobalChartState.value.chartTiles.push(newRow)
		}
	} else {
		// Remove a row
		for (let x = 0; x < Math.abs(difference); x++) {
			GlobalChartState.value.options.chartSize.rowSizes.pop()
			GlobalChartState.value.chartTiles.pop()
		}
	}
}
</script>

<template>
	<template v-if="!isPreset">
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

	<label class="mt-2" :class="{ 'pt-7': isPreset }">
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
