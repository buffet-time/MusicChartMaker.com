<script setup lang="ts">
import { GlobalChartState } from '#src/shared'
</script>

<template>
	<div class="tw-options-div">
		<label>Show Album Titles</label>
		<input
			v-model="GlobalChartState!.options.displayTitles"
			type="checkbox"
			class="tw-checkbox cursor-pointer"
		/>
	</div>

	<div class="tw-options-div">
		<label>Show Numbers</label>
		<input
			v-model="GlobalChartState!.options.displayNumberRank"
			type="checkbox"
			class="tw-checkbox cursor-pointer"
			:disabled="!GlobalChartState?.options.displayTitles"
		/>
	</div>

	<div class="tw-options-div">
		<label>Text Color</label>
		<input
			v-model="GlobalChartState!.options.textColor"
			type="color"
			class="bg-transparent cursor-pointer"
		/>
	</div>

	<div class="tw-options-div">
		<label>Text Outline Color</label>
		<input
			v-model="GlobalChartState!.options.textBorderColor"
			type="color"
			class="bg-transparent cursor-pointer"
		/>
	</div>
</template>
