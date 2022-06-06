<script setup lang="ts">
import { ref, watch } from 'vue'
import {
	FillerAlbum,
	GlobalChartState,
	GlobalSiteOptions,
	IsImage
} from '../../shared'
import { SaveSiteOptions } from '../../storage'
import Close from '../../assets/whiteClose.svg'

const colsNum = ref(GlobalChartState.value.options.chartSize.rowSizes[0])
const rowsNum = ref(GlobalChartState.value.options.chartSize.rowSizes.length)
const bgColor = ref(GlobalChartState.value.options.background)
const textColor = ref(GlobalChartState.value.options.textColor)
const bgImage = ref(
	GlobalChartState.value.options.backgroundImage
		? GlobalChartState.value.options.backgroundImage
		: ''
)
const textOutlineColor = ref(
	GlobalChartState.value.options.textBorderColor
		? GlobalChartState.value.options.textBorderColor
		: '#00000'
)
const showOptions = ref(false)

watch(colsNum, (newColNum, prevColNum) => colsChanged(newColNum - prevColNum))
watch(rowsNum, (newRowNum, prevRowNum) => rowsChanged(newRowNum - prevRowNum))

watch(bgColor, () => {
	GlobalChartState.value.options.background = bgColor.value
})

watch(textColor, () => {
	GlobalChartState.value.options.textColor = textColor.value
})

watch(textOutlineColor, () => {
	GlobalChartState.value.options.textBorderColor = textOutlineColor.value
})

watch(
	() => GlobalSiteOptions.value.numberOfSearchResults,
	() => {
		SaveSiteOptions()
	}
)

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

async function onBgImageInput() {
	bgImage.value.trim()
	if (await IsImage(bgImage.value)) {
		GlobalChartState.value.options.backgroundImage = bgImage.value
		return
	}

	bgImage.value = 'Not a valid Image URL'
}

function clearBackground() {
	GlobalChartState.value.options.backgroundImage = undefined
	bgImage.value = ''
}
</script>

<template>
	<div class="flex justify-center items-center gap-2">
		<button
			type="button"
			class="tw-button cursor-pointer"
			@click="showOptions = true"
		>
			Show Options
		</button>
	</div>
	<div
		v-if="showOptions"
		class="flex flex-col tw-sidebar-width h-full z-0 top-0 left-0 fixed bg-[#404040] px-2 pb-2"
	>
		<img
			title="Close Options"
			:src="Close"
			class="cursor-pointer w-7 absolute right-0 mt-1 mr-1 bg-neutral-500 fill-white p-1"
			@click="showOptions = false"
		/>

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

		<div class="tw-options-div">
			<label>Show Album Titles</label>
			<input
				v-model="GlobalChartState.options.displayTitles"
				type="checkbox"
				class="tw-checkbox cursor-pointer"
			/>
		</div>

		<div class="tw-options-div">
			<label>Show Numbers</label>
			<input
				v-model="GlobalChartState.options.displayNumberRank"
				type="checkbox"
				class="tw-checkbox cursor-pointer"
				:disabled="!GlobalChartState.options.displayTitles"
			/>
		</div>

		<div class="tw-options-div">
			<label>Text Color</label>
			<input
				v-model="textColor"
				type="color"
				class="bg-transparent cursor-pointer"
			/>
		</div>

		<div class="tw-options-div">
			<label>Text Outline Color</label>
			<input
				v-model="textOutlineColor"
				type="color"
				class="bg-transparent cursor-pointer"
			/>
		</div>

		<div class="tw-options-div">
			<label>Background Color</label>
			<input
				v-model="bgColor"
				type="color"
				class="bg-transparent cursor-pointer"
			/>
		</div>

		<div class="tw-options-div flex-col gap-1">
			<label>Background Image:</label>
			<!-- 
				TODO: better form validation with regex
				and red border for incorrect input etc
			-->
			<input
				v-model="bgImage"
				placeholder="Background Image URL"
				type="url"
				class="tw-input cursor-pointer"
				@keyup.enter="onBgImageInput"
			/>
			<div class="flex gap-1">
				<button
					type="button"
					class="tw-button cursor-pointer"
					@click="onBgImageInput"
				>
					Set BG
				</button>
				<button
					type="button"
					class="tw-button cursor-pointer"
					@click="clearBackground"
				>
					Clear BG
				</button>
			</div>
		</div>
	</div>
</template>
