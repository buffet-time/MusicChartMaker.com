<script setup lang="ts">
import type {
	AlbumSearchResult,
	IndicesObject,
	MovieAndTvSearchResult,
} from '#types'
import { GlobalChartState } from '#utils/globals'
import { dragDialogId, DragSetData, onTouchStart } from '#utils/drag'
import {
	GrayBoxImgFromApiForMusic,
	GrayBoxImgFromApiForMedia,
} from '#utils/misc'
import { getMediaNameWithoutNumber } from '#utils/chart'
import { ref } from 'vue'

const props = defineProps<{
	index1: number
	index2: number
	mediaTile: AlbumSearchResult | MovieAndTvSearchResult
	selectedAlbumIndices: IndicesObject
	deleteCurrent: (indices: IndicesObject) => void
	onDrop: (dragEvent: DragEvent, { index1, index2 }: IndicesObject) => void
}>()

const emit = defineEmits<{
	updateSelectedAlbumIndices: [value: IndicesObject]
}>()

const hasError = ref(false)

function onDragOver(dragEvent: DragEvent) {
	if (!dragEvent.dataTransfer) {
		return console.error(
			'Error dragEvent.dataTransfer not defined in onDragOver',
			dragEvent,
		)
	}

	dragEvent.dataTransfer.dropEffect = 'move'
}

function onDragStart({
	dragEvent,
	indexes,
}: {
	dragEvent: DragEvent
	indexes: IndicesObject
}) {
	if (!GlobalChartState) {
		return console.error(
			'Error getting GlobalChartState in onDragStart()',
			GlobalChartState,
		)
	}

	DragSetData(dragEvent, {
		// @ts-expect-error -this is fine.
		albumObject:
			GlobalChartState.value.options.mediaType === 'album'
				? GlobalChartState.value.chartTiles[indexes.index1][indexes.index2]
				: undefined,
		// @ts-expect-error -this is fine.
		mediaObject:
			GlobalChartState.value.options.mediaType === 'media'
				? GlobalChartState.value.chartTiles[indexes.index1][indexes.index2]
				: undefined,
		dragSource: 'Chart',
		originatingIndices: {
			index1: indexes.index1,
			index2: indexes.index2,
		},
	})

	if (!dragEvent.dataTransfer) {
		return console.error('Error dragEvent.dataTransfer not defined in onDrop()')
	}

	dragEvent.dataTransfer.dropEffect = 'copy'
}

function openDialog(indices?: IndicesObject) {
	const dialog = document.getElementById(dragDialogId) as HTMLDialogElement
	dialog.showModal()

	if (!indices) {
		return console.error('Error indices not defined in openDialog()')
	}

	emit('updateSelectedAlbumIndices', indices)
}
</script>

<template>
	<div class="uno-album-image-div-wrapper">
		<img
			v-show="mediaTile && !GlobalChartState.options.lockChart"
			src="/blackClose.svg"
			loading="lazy"
			class="hidden absolute left-0 top-0 m-1 cursor-pointer group-hover:block group-hover:bg-white"
			@click="deleteCurrent({ index1, index2 })"
		/>

		<img
			:firstIndex="index1"
			:secondIndex="index2"
			:src="`${mediaTile.image}`"
			:alt="getMediaNameWithoutNumber(mediaTile)"
			loading="lazy"
			class="uno-chart-image-size select-none"
			:class="{
				'cursor-grab': !GlobalChartState.options.lockChart,
			}"
			:draggable="GlobalChartState.options.lockChart ? false : true"
			@error="
				(event) => {
					const target = event.target as HTMLImageElement
					target.src = `/placeholders/${'artist' in mediaTile ? GrayBoxImgFromApiForMusic : GrayBoxImgFromApiForMedia}`

					hasError = true
				}
			"
			@dragstart="
				(dragEvent) =>
					onDragStart({
						dragEvent,
						indexes: { index1: index1, index2: index2 },
					})
			"
			@dragover.prevent="
				() => {
					if (GlobalChartState.options.lockChart) return
					onDragOver
				}
			"
			@drop.prevent="
				(dragEvent) => {
					if (GlobalChartState.options.lockChart) return
					onDrop(dragEvent, { index1: index1, index2: index2 })
				}
			"
			@touchstart.prevent="
				(touchEvent) => {
					if (GlobalChartState.options.lockChart) return
					// TODO: check here!
					onTouchStart({
						touchEvent,
						album: 'artist' in mediaTile ? mediaTile : undefined,
						media: 'year' in mediaTile ? mediaTile : undefined,
						source: 'Chart',
						originatingIndices: { index1, index2 },
						openDialog,
					})
				}
			"
		/>
		<div
			v-if="hasError"
			class="uno-flex-center uno-album-image-text-overlay overflow-hidden text-ellipsis chartImages"
		>
			{{ getMediaNameWithoutNumber(mediaTile) }}
		</div>
	</div>
</template>

<style scoped>
.chartImages {
	width: 100%;
	width: -moz-available; /* WebKit-based browsers will ignore this. */
	width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */

	height: 100%;
	height: -moz-available; /* WebKit-based browsers will ignore this. */
	height: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
}
</style>
