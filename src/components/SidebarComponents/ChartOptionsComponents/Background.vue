<script setup lang="ts">
import { ref } from 'vue'
import { GlobalChartState } from '#shared/globals'
import { IsImage } from '#shared/misc'

const bgImage = ref(
	GlobalChartState.value.options.backgroundImage
		? GlobalChartState.value.options.backgroundImage
		: ''
)

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
	<div class="tw-options-div">
		<label>Background Color</label>
		<input
			v-model="GlobalChartState!.options.background"
			type="color"
			class="cursor-pointer bg-transparent"
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
		<div class="mt-1 flex gap-1">
			<button type="button" class="tw-button" @click="onBgImageInput">
				Set BG
			</button>
			<button type="button" class="tw-button" @click="clearBackground">
				Clear BG
			</button>
		</div>
	</div>
</template>
