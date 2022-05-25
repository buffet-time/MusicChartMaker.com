<script setup lang="ts">
import { ref } from 'vue'
import { GlobalChartState } from '../../shared'

const showOptions = ref(true)
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
				class="h-6 w-4"
			/>
		</div>

		<div class="flex justify-center items-center gap-2 mt-2">
			<label>Show Numbers</label>
			<input
				v-model="GlobalChartState.options.displayNumberRank"
				type="checkbox"
				class="h-6 w-4"
			/>
		</div>
	</div>
</template>
