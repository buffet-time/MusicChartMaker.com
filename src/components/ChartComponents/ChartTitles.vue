<script setup lang="ts">
import { GlobalChartState } from '#utils/globals'
import { getAlbumNumber, GrayBoxImgForPlaceholder } from '#utils/misc'
import { onMounted, ref, nextTick } from 'vue'
import { delay } from '#utils/misc'

const props = defineProps<{
	heightOfChartImages: number | undefined
}>()

const chartTitlesRef = ref<HTMLDivElement>()
function albumArtistEdited(event: Event, index: number, index2: number) {
	GlobalChartState.value.chartTiles[index][index2].artist = (
		event.target as HTMLSpanElement
	).innerText
}

function albumNameEdited(event: Event, index: number, index2: number) {
	GlobalChartState.value.chartTiles[index][index2].name = (
		event.target as HTMLSpanElement
	).innerText
}

onMounted(async () => {
	window.addEventListener('resize', () => void getFontSize())

	// This is hacky, sloppy, maybe i'll fix it eventually???
	// Let the micro task queue empty out
	await delay(1)
	// ensures the ref is defined
	await nextTick()
	await getFontSize()
	await delay(1)
	await nextTick()
	await getFontSize()
})

async function getFontSize() {
	if (isOverflowing()) {
		async function reduceFontSize() {
			if (isOverflowing()) {
				GlobalChartState.value.options.fontSize! -= 0.05
				await nextTick()
				await reduceFontSize()
			}
		}

		await reduceFontSize()
	} else {
		async function increaseFontSize() {
			if (!isOverflowing() && GlobalChartState.value.options.fontSize! < 18) {
				GlobalChartState.value.options.fontSize! += 0.05
				await nextTick()
				await increaseFontSize()
			}
		}

		await increaseFontSize()
	}
}

function isOverflowing() {
	if (chartTitlesRef?.value) {
		return chartTitlesRef.value.scrollHeight > chartTitlesRef.value.clientHeight
	}

	return false
}
</script>

<template>
	<div
		ref="chartTitlesRef"
		class="min-w-[200px] text-left text-sm line-height-tight"
		:style="{
			height: `${props.heightOfChartImages}px`,
			fontSize: GlobalChartState.options.fontSize + 'px',
		}"
	>
		<div
			v-for="(albumRow, index) in GlobalChartState.chartTiles"
			:key="index"
			class="flex flex-col"
			:class="{ 'mb-[2px]': index !== GlobalChartState.chartTiles.length - 1 }"
		>
			<template v-for="(album, index2) in albumRow" :key="`${index}-${index2}`">
				<p
					v-if="album.image !== GrayBoxImgForPlaceholder"
					class="overflow-hidden text-ellipsis pointer-events-none whitespace-nowrap"
					:style="{
						color: GlobalChartState.options.textColor,
						textShadow: GlobalChartState.options.textShadow,
						letterSpacing: `${GlobalChartState.options.textSpacing}px`,
						fontFamily: GlobalChartState.options.font,
					}"
				>
					<template v-if="GlobalChartState.options.displayNumberRank">
						{{ getAlbumNumber(index, index2) }})
					</template>
					<span
						role="textbox"
						:contenteditable="
							GlobalChartState.options.lockChart ? undefined : true
						"
						class="pointer-events-auto"
						@dragover.prevent="() => false"
						@drop.prevent="() => false"
						@input="(event) => albumArtistEdited(event, index, index2)"
					>
						{{ album.artist }}
					</span>
					-
					<span
						role="textbox"
						:contenteditable="
							GlobalChartState.options.lockChart ? undefined : true
						"
						class="pointer-events-auto"
						@dragover.prevent="() => false"
						@drop.prevent="() => false"
						@input="(event) => albumNameEdited(event, index, index2)"
					>
						{{ album.name }}
					</span>
				</p>
			</template>
		</div>

		<!-- To prevent erroneous edits to the bottom album/ artist -->
		‎
	</div>
</template>
