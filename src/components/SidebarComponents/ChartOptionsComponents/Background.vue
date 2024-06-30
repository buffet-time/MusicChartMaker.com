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
	<div class="uno-options-div uno-flex-center">
		<label>Background Color</label>
		<input
			v-model="GlobalChartState!.options.background"
			type="color"
			class="cursor-pointer bg-transparent border-none"
		/>
	</div>

	<div class="uno-options-div flex flex-col gap-1 px-0">
		<label>Background Image:</label>
		<input
			v-model="bgImage"
			placeholder="BG Image URL"
			type="url"
			class="cursor-pointer uno-input w-auto"
			@keyup.enter="onBgImageInput"
		/>
		<div class="uno-flex-center gap-1 mt-1">
			<button type="button" class="uno-button" @click="onBgImageInput">
				Set BG
			</button>
			<button type="button" class="uno-button" @click="clearBackground">
				Clear BG
			</button>
		</div>
	</div>
</template>
