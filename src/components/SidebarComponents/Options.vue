<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import {
	FillerAlbum,
	GlobalChartState,
	GlobalSiteOptions,
	ExportChartsAndOptions,
	IsImage,
	ImportChartsAndOptions
} from '#src/shared'
import { SaveSiteOptions } from '#src/storage'
import Close from '#assets/whiteClose.svg'
import DevTools from './DevTools.vue'

const colsNum = ref(GlobalChartState.value.options.chartSize.rowSizes[0])
const rowsNum = ref(GlobalChartState.value.options.chartSize.rowSizes.length)
const bgColor = ref(GlobalChartState.value.options.background)
const filePicker = ref() as Ref<HTMLInputElement>
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
const isPreset = ref(GlobalChartState.value.options.preset ? true : false)

// used to disable watchers for cols/ rows when changing charts
let updatingRows = false
let updatingCols = false

watch(
	() => GlobalChartState.value.options.preset,
	() => {
		isPreset.value = GlobalChartState.value.options.preset ? true : false
	}
)

watch(colsNum, (newColNum, prevColNum) => {
	if (updatingCols) {
		// if this was triggered by currentChart being changed skip 1 iteration
		updatingCols = false
		return
	}
	if (isPreset.value) return

	colsChanged(newColNum - prevColNum)
})
watch(rowsNum, (newRowNum, prevRowNum) => {
	if (updatingRows) {
		// if this was triggered by currentChart being changed skip 1 iteration
		updatingRows = false
		return
	}
	if (isPreset.value) return

	rowsChanged(newRowNum - prevRowNum)
})

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
	() => SaveSiteOptions()
)

// TODO: conditional watchers (as to not waste cpu)?
watch(
	() => GlobalSiteOptions.value.currentChart,
	() => {
		// if its a preset we dont need to touch the column and row nums
		if (isPreset.value) return

		updatingCols = true
		colsNum.value = GlobalChartState.value.options.chartSize.rowSizes[0]

		updatingRows = true
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

function importFromJson() {
	const input = filePicker.value.files
	if (input) {
		ImportChartsAndOptions(input.item(0))
	}
}

function clearBackground() {
	GlobalChartState.value.options.backgroundImage = undefined
	bgImage.value = ''
}
</script>

<template>
	<!-- TODO: Separate chart options and global options into 2 sections -->

	<!-- in the sidebar -->
	<div class="flex justify-center items-center gap-2">
		<button
			type="button"
			class="tw-button cursor-pointer"
			@click="showOptions = true"
		>
			Show Options
		</button>
	</div>

	<!-- The options overlay -->
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
				<button
					type="button"
					class="tw-button cursor-pointer"
					@click="ExportChartsAndOptions()"
				>
					Morbin' time
				</button>
				<input
					ref="filePicker"
					type="file"
					accept=".json"
					class="tw-button cursor-pointer"
					@change="importFromJson"
				/>
				<!-- Need and Input type:file here. Or Close to the original Export as Image and Export as JSON buttons-->
			</div>
		</div>
		<DevTools />
	</div>
</template>
