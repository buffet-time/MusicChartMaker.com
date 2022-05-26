<script setup lang="ts">
import { ref, watch } from 'vue'
import { FillerAlbum, GlobalChartState } from '../../shared'

const showOptions = ref(true)

watch(
	() => GlobalChartState.value.options.chartSize,
	() => {
		let difference =
			GlobalChartState.value.options.chartSize.columns *
				GlobalChartState.value.options.chartSize.rows -
			GlobalChartState.value.chartTiles.length

		if (difference > 0) {
			while (difference !== 0) {
				GlobalChartState.value.chartTiles.push(FillerAlbum)
				difference--
			}
		} else {
			while (difference !== 0) {
				GlobalChartState.value.chartTiles.pop()
				difference++
			}
		}
	},
	{
		deep: true
	}
)
</script>

<template>
	<div v-if="showOptions" class="flex flex-col mx-4">
		<label> Columns: {{ GlobalChartState.options.chartSize.columns }} </label>
		<input
			v-model="GlobalChartState.options.chartSize.columns"
			type="range"
			min="1"
			max="20"
			step="1"
		/>

		<label class="mt-2">
			Rows: {{ GlobalChartState.options.chartSize.rows }}
		</label>
		<input
			v-model="GlobalChartState.options.chartSize.rows"
			type="range"
			min="1"
			max="20"
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
