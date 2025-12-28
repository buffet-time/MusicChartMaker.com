<script setup lang="ts">
import { ref } from 'vue'
import { GlobalChartState } from '#utils/globals'
import { IsImage } from '#utils/misc'
import { ToasterStore } from '#stores/toaster'

const toasterStore = ToasterStore()

const bgImage = ref(
	GlobalChartState.value.options.backgroundImage
		? GlobalChartState.value.options.backgroundImage
		: '',
)

async function onBgImageInput() {
	bgImage.value.trim()
	if (await IsImage(bgImage.value)) {
		GlobalChartState.value.options.backgroundImage = bgImage.value
		return
	}

	toasterStore.newToast({
		text: 'Not a valid Image URL, please try again.',
		status: 'error',
		timeout: 6000,
	})
}

function clearBackground() {
	GlobalChartState.value.options.backgroundImage = undefined
	bgImage.value = ''
}
</script>

<template>
	<div class="uno-options-div uno-flex-center">
		<label for="backgroundColor">Background Color</label>
		<input
			id="backgroundColor"
			v-model="GlobalChartState!.options.background"
			type="color"
			class="cursor-pointer bg-transparent border-none"
		/>
	</div>

	<div class="uno-options-div flex flex-col gap-1 px-0">
		<label for="backgroundImage">Background Image:</label>
		<input
			id="backgroundImage"
			v-model="bgImage"
			placeholder="BG Image URL"
			type="url"
			class="cursor-pointer uno-input w-auto"
			@keyup.enter="onBgImageInput"
		/>
		<div class="uno-flex-center gap-1 mt-1">
			<button
				type="button"
				class="uno-button"
				@click="onBgImageInput"
				:disabled="bgImage === ''"
			>
				Set BG
			</button>
			<button
				type="button"
				class="uno-button"
				@click="clearBackground"
				:disabled="!GlobalChartState.options.backgroundImage"
			>
				Clear BG
			</button>
		</div>
	</div>
</template>
