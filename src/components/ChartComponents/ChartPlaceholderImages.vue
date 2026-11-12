<script setup vapor lang="ts">
import { onDrop } from '#root/src/utils/drag'
import { GlobalChartState } from '#root/src/utils/globals'
import {
	GrayBoxImgForPlaceholderForMedia,
	GrayBoxImgForPlaceholderForMusic,
} from '#root/src/utils/misc'

const props = defineProps<{
	index1: number
	index2: number
}>()
</script>

<template>
	<!-- Genuinely not sure where the extra 4px is coming from for these -->
	<div class="mb-[-4px]">
		<img
			:firstIndex="index1"
			:secondIndex="index2"
			:src="`/placeholders/${GlobalChartState.options.mediaType === 'Music' ? GrayBoxImgForPlaceholderForMusic : GrayBoxImgForPlaceholderForMedia}`"
			:alt="'placeholder square'"
			loading="lazy"
			draggable="false"
			class="uno-chart-image-size select-none"
			@dragstart="() => undefined"
			@dragover.prevent="() => undefined"
			@drop.prevent="
				(dragEvent) => {
					if (GlobalChartState.options.lockChart) return
					onDrop({
						dragEvent,
						indices: { index1: index1, index2: index2 },
					})
				}
			"
		/>
	</div>
</template>
