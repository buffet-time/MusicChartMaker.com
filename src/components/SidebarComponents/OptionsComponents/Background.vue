<script setup lang="ts">
import { ref } from 'vue'
import { GlobalChartState } from '#shared/globals'
import { IsImage } from '#shared/misc'

const bgImage = ref(
	GlobalChartState.options.backgroundImage
		? GlobalChartState.options.backgroundImage
		: ''
)

async function onBgImageInput() {
	bgImage.value.trim()
	if (await IsImage(bgImage.value)) {
		if (!GlobalChartState || !GlobalChartState.options.backgroundImage) {
			return console.error('ERror in onBgImageInput()', GlobalChartState)
		}

		GlobalChartState.options.backgroundImage = bgImage.value
		return
	}

	bgImage.value = 'Not a valid Image URL'
}

function clearBackground() {
	if (!GlobalChartState || !GlobalChartState.options.backgroundImage) {
		return console.error('ERror in clearBackground()', GlobalChartState)
	}

	GlobalChartState.options.backgroundImage = undefined
	bgImage.value = ''
}
</script>

<template>
	<div class="tw-options-div">
		<label>Background Color</label>
		<input
			v-model="GlobalChartState!.options.background"
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
			placeholder="BG Image URL"
			type="url"
			class="tw-input cursor-pointer"
			@keyup.enter="onBgImageInput"
		/>
		<div class="flex gap-1 mt-1">
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
</template>
