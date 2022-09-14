<script setup lang="ts">
import { GlobalChartState, IsImage } from '#root/src/shared'
import { ref, watch } from 'vue'

const bgColor = ref(GlobalChartState.value?.options.background)
const bgImage = ref(
	GlobalChartState.value?.options.backgroundImage
		? GlobalChartState.value.options.backgroundImage
		: ''
)

watch(bgColor, () => {
	if (!bgColor.value || !GlobalChartState.value) {
		return console.error('Error in watch(bgColor)', bgColor, GlobalChartState)
	}
	GlobalChartState.value.options.background = bgColor.value
})

async function onBgImageInput() {
	bgImage.value.trim()
	if (await IsImage(bgImage.value)) {
		if (
			!GlobalChartState.value ||
			!GlobalChartState.value.options.backgroundImage
		) {
			return console.error('ERror in onBgImageInput()', GlobalChartState)
		}

		GlobalChartState.value.options.backgroundImage = bgImage.value
		return
	}

	bgImage.value = 'Not a valid Image URL'
}

function clearBackground() {
	if (
		!GlobalChartState.value ||
		!GlobalChartState.value.options.backgroundImage
	) {
		return console.error('ERror in clearBackground()', GlobalChartState)
	}

	GlobalChartState.value.options.backgroundImage = undefined
	bgImage.value = ''
}
</script>

<template>
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
</template>
