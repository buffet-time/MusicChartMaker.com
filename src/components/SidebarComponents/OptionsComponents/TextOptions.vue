<script setup lang="ts">
import { GlobalChartState } from '#root/src/shared'
import { ref, watch } from 'vue'

const textColor = ref(GlobalChartState.value?.options.textColor)
const textOutlineColor = ref(
	GlobalChartState.value?.options.textBorderColor
		? GlobalChartState.value.options.textBorderColor
		: '#00000'
)

watch(textColor, () => {
	if (!textColor.value || !GlobalChartState.value) {
		return console.error(
			'Error in watch(textColor)',
			textColor,
			GlobalChartState
		)
	}
	GlobalChartState.value.options.textColor = textColor.value
})

watch(textOutlineColor, () => {
	if (!textOutlineColor.value || !GlobalChartState.value) {
		return console.error(
			'Error in watch(textOutlineColor)',
			textOutlineColor,
			GlobalChartState
		)
	}
	GlobalChartState.value.options.textBorderColor = textOutlineColor.value
})
</script>

<template>
	<div>
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
	</div>
</template>
