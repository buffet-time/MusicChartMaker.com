<script setup lang="ts">
import { ref, watch } from 'vue'
import { FillerAlbum, GlobalChartState, GlobalSiteOptions } from '../../shared'
import { SaveSiteOptions } from '../../storage'

const colsNum = ref(GlobalChartState.value.options.chartSize.rowSizes[0])
const rowsNum = ref(GlobalChartState.value.options.chartSize.rowSizes.length)
const showOptions = ref(GlobalSiteOptions.value.showOptions)
const bgColor = ref(GlobalChartState.value.options.background)
const textColor = ref(GlobalChartState.value.options.textColor)

watch(colsNum, (newColNum, prevColNum) => colsChanged(newColNum - prevColNum))
watch(rowsNum, (newRowNum, prevRowNum) => rowsChanged(newRowNum - prevRowNum))

watch(bgColor, () => {
	GlobalChartState.value.options.background = bgColor.value
})

watch(textColor, () => {
	GlobalChartState.value.options.textColor = textColor.value
})

watch(
	() => GlobalSiteOptions.value.numberOfSearchResults,
	() => {
		SaveSiteOptions()
	}
)

watch(showOptions, () => {
	GlobalSiteOptions.value.showOptions = showOptions.value
	SaveSiteOptions()
})

watch(
	() => GlobalSiteOptions.value.currentChart,
	() => {
		colsNum.value = GlobalChartState.value.options.chartSize.rowSizes[0]

		rowsNum.value = GlobalChartState.value.options.chartSize.rowSizes.length
	}
)

function colsChanged(difference: number) {
	if (difference > 0) {
		// Add a new column
		GlobalChartState.value.chartTiles.forEach((row, index) => {
			for (let x = 0; x < difference; x++) {
				row.push(FillerAlbum)
				GlobalChartState.value.options.chartSize.rowSizes[index]++
			}
		})
	} else {
		// Remove a column
		GlobalChartState.value.chartTiles.forEach((row, index) => {
			for (let x = 0; x < Math.abs(difference); x++) {
				row.pop()
				GlobalChartState.value.options.chartSize.rowSizes[index]--
			}
		})
	}
}

function rowsChanged(difference: number) {
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
	<div class="flex justify-center items-center gap-2">
		<label>Show Options </label>
		<input
			v-model="showOptions"
			type="checkbox"
			class="tw-checkbox cursor-pointer"
		/>
	</div>
	<div v-if="showOptions" class="flex flex-col mx-4">
		<label> Columns: {{ colsNum }} </label>
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

		<label class="mt-2">
			# of Search Results: {{ GlobalSiteOptions.numberOfSearchResults }}
		</label>
		<input
			v-model="GlobalSiteOptions.numberOfSearchResults"
			class="cursor-pointer"
			type="range"
			min="10"
			max="50"
			step="1"
		/>

		<div class="flex justify-center items-center gap-2 mt-2">
			<label>Background Color</label>
			<input
				v-model="bgColor"
				type="color"
				class="bg-transparent cursor-pointer"
			/>
		</div>

		<div class="flex justify-center items-center gap-2 mt-2">
			<label>Show Album Titles</label>
			<input
				v-model="GlobalChartState.options.displayTitles"
				type="checkbox"
				class="tw-checkbox cursor-pointer"
			/>
		</div>

		<div class="flex justify-center items-center gap-2 mt-2">
			<label>Show Numbers</label>
			<input
				v-model="GlobalChartState.options.displayNumberRank"
				type="checkbox"
				class="tw-checkbox cursor-pointer"
				:disabled="!GlobalChartState.options.displayTitles"
			/>
		</div>

		<div class="flex justify-center items-center gap-2 mt-2">
			<label>Text Color</label>
			<input
				v-model="textColor"
				type="color"
				class="bg-transparent cursor-pointer"
			/>
		</div>
	</div>
</template>
