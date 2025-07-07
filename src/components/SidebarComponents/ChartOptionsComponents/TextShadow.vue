<script setup lang="ts">
import { GlobalChartState } from '#utils/globals'
import { onMounted, ref, watch } from 'vue'

const showTextShadowOptions = ref(false)

const shadowColor = ref('#FFFFFF')
const blurRadius = ref(0)
const offsetX = ref(0)
const offsetY = ref(0)

function textShadowStateToUpdateRefs() {
	const splitTextShadowState = GlobalChartState.value.options.textShadow?.split(
		' ',
	) as [string, string, string, string]

	offsetX.value = Number.parseInt(splitTextShadowState[0], 10)
	offsetY.value = Number.parseInt(splitTextShadowState[1], 10)
	blurRadius.value = Number.parseInt(splitTextShadowState[2], 10)
	shadowColor.value = splitTextShadowState[3]
}

onMounted(() => {
	if (GlobalChartState.value.options.textShadow) {
		textShadowStateToUpdateRefs()
	}
})

watch([shadowColor, blurRadius, offsetX, offsetY], () => {
	GlobalChartState.value.options.textShadow = `${offsetX.value}px ${offsetY.value}px ${blurRadius.value}px ${shadowColor.value}`
})
</script>

<template>
	<div class="pt-2">
		<button
			type="button"
			class="uno-button"
			@click="showTextShadowOptions = !showTextShadowOptions"
		>
			{{
				showTextShadowOptions
					? 'Hide Text Shadow Options'
					: 'Show Text Shadow Options'
			}}
		</button>

		<div v-if="showTextShadowOptions">
			<div class="uno-options-div flex flex-col items-center">
				<label for="shadowColor">Shadow Color: {{ shadowColor }}</label>
				<input
					id="shadowColor"
					v-model="shadowColor"
					type="color"
					class="cursor-pointer bg-transparent border-none items-center justify-center"
				/>
			</div>

			<div class="uno-options-div flex flex-col">
				<label for="blurRadius">Blur Radius: {{ blurRadius }} pixels</label>
				<input
					id="blurRadius"
					v-model="blurRadius"
					type="range"
					min="0"
					max="20"
					step="1"
					class="cursor-pointer"
				/>
			</div>

			<div class="uno-options-div flex flex-col">
				<label for="offsetX">Offset-X: {{ offsetX }} pixels</label>
				<input
					id="offsetX"
					v-model="offsetX"
					type="range"
					min="-20"
					max="20"
					step="1"
					class="cursor-pointer"
				/>
			</div>

			<div class="uno-options-div flex flex-col">
				<label for="offsetY">Offset-Y: {{ offsetY }} pixels</label>
				<input
					id="offsetY"
					v-model="offsetY"
					type="range"
					min="-20"
					max="20"
					step="1"
					class="cursor-pointer"
				/>
			</div>
		</div>
	</div>
</template>
