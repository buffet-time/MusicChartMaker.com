<script setup lang="ts">
import { GlobalChartState } from '#root/src/shared'
import { onMounted, ref } from 'vue'

const fonts = ref<string[]>()
const fontsLoaded = ref(false)

// prettier-ignore
const fontCheck = [
  // Windows 10
	'Arial', 'Arial Black', 'Bahnschrift', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Georgia', 'HoloLens MDL2 Assets', 'Impact', 'Ink Free', 'Javanese Text', 'Leelawadee UI', 'Lucida Console', 'Lucida Sans Unicode', 'Malgun Gothic', 'Marlett', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU-ExtB', 'Mongolian Baiti', 'MS Gothic', 'MV Boli', 'Myanmar Text', 'Nirmala UI', 'Palatino Linotype', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Historic', 'Segoe UI Emoji', 'Segoe UI Symbol', 'SimSun', 'Sitka', 'Sylfaen', 'Symbol', 'Tahoma', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Yu Gothic',
  // macOS
  'American Typewriter', 'Andale Mono',  'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Baskerville', 'Big Caslon', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bradley Hand', 'Brush Script MT', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charter', 'Cochin',  'Copperplate', 'Courier', 'Didot', 'DIN Alternate', 'DIN Condensed', 'Futura', 'Geneva', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Herculanum', 'Hoefler Text', 'Impact', 'Lucida Grande', 'Luminari', 'Marker Felt', 'Menlo',  'Monaco', 'Noteworthy', 'Optima', 'Palatino', 'Papyrus', 'Phosphate', 'Rockwell', 'Savoye LET', 'SignPainter', 'Skia', 'Snell Roundhand',  'Times', 'Trattatello', 'Zapfino',
].sort()

onMounted(async () => {
	await document.fonts.ready
	fonts.value = getSupportedFonts()
	fontsLoaded.value = true
})

function getSupportedFonts() {
	return fontCheck.filter((font) => document.fonts.check(`12px "${font}"`))
}
</script>

<template>
	<div class="flex flex-col">
		<div class="items-center justify-center">
			<select
				v-if="fontsLoaded"
				v-model="GlobalChartState!.options.font"
				class="tw-input cursor-pointer"
			>
				<option v-for="(name, index) in fonts" :key="index">
					{{ name }}
				</option>
			</select>
		</div>

		<label class="mt-2">
			Font Size: {{ GlobalChartState!.options.fontSize }}
		</label>
		<input
			v-model="GlobalChartState!.options.fontSize"
			class="cursor-pointer"
			type="range"
			min="8"
			max="20"
			step="1"
		/>

		<label class="mt-2">
			Text Spacing: {{ GlobalChartState!.options.textSpacing }}
		</label>
		<input
			v-model="GlobalChartState!.options.textSpacing"
			class="cursor-pointer"
			type="range"
			min="-2"
			max="10"
			step="0.5"
		/>
	</div>
</template>
