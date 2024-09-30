<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { GlobalChartState, GlobalSiteOptions } from '#utils/globals'
import { PossibleFonts } from '#utils/fonts'

const fonts = ref<string[]>()
const fontsLoaded = ref(false)

onMounted(async () => {
	if (!GlobalSiteOptions.value.fontCache) {
		await document.fonts.ready

		// checks all the fonts above to see if they're supported on the persons given browser
		GlobalSiteOptions.value.fontCache = PossibleFonts.sort().filter((font) =>
			document.fonts.check(`12px "${font}"`),
		)
	}

	fonts.value = GlobalSiteOptions.value.fontCache
	fontsLoaded.value = true
})
</script>

<template>
	<div class="flex flex-col">
		<div class="items-center justify-center">
			<select
				v-if="fontsLoaded"
				v-model="GlobalChartState!.options.font"
				class="uno-input global-select uno-select"
			>
				<option v-for="(name, index) in fonts" :key="index">
					{{ name }}
				</option>
			</select>
		</div>

		<label class="mt-2">
			Text Spacing: {{ GlobalChartState!.options.textSpacing }}px
		</label>
		<input
			v-model="GlobalChartState!.options.textSpacing"
			class="cursor-pointer"
			type="range"
			min="-2"
			max="10"
			step="0.1"
		/>
	</div>
</template>
