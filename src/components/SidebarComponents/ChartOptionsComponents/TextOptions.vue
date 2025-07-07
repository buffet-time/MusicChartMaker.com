<script setup lang="ts">
import { GlobalChartState } from '#utils/globals'
</script>

<template>
	<div class="uno-options-div">
		<label for="displayTitles">Show Album Titles</label>
		<input
			id="displayTitles"
			v-model="GlobalChartState!.options.displayTitles"
			type="checkbox"
			class="uno-checkbox cursor-pointer"
		/>
	</div>

	<div class="uno-options-div">
		<label for="displayNumberRank">Show Numbers</label>
		<input
			id="displayNumberRank"
			v-model="GlobalChartState!.options.displayNumberRank"
			type="checkbox"
			class="uno-checkbox cursor-pointer border-none"
			:disabled="!GlobalChartState?.options.displayTitles"
		/>
	</div>

	<div class="uno-options-div">
		<label for="textColor">Text Color</label>
		<input
			id="textColor"
			v-model="GlobalChartState!.options.textColor"
			type="color"
			class="cursor-pointer bg-transparent border-none"
		/>
	</div>
</template>
