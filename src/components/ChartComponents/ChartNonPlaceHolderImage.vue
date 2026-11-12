<script setup vapor lang="ts">
import type {
	AlbumSearchResult,
	IndicesObject,
	MovieAndTvSearchResult,
} from '#types'
import { GlobalChartState } from '#utils/globals'
import {
	dragDialogId,
	DragSetData,
	onDragStart,
	onDrop,
	onTouchStart,
} from '#utils/drag'
import {
	GrayBoxImgFromApiForMusic,
	GrayBoxImgFromApiForMedia,
	FillerAlbum,
} from '#utils/misc'
import { getMediaNameWithoutNumber } from '#utils/chart'
import { ref } from 'vue'
import Dialog from '#core/Dialog.vue'

const props = defineProps<{
	index1: number
	index2: number
	mediaTile: AlbumSearchResult | MovieAndTvSearchResult
	selectedAlbumIndices: IndicesObject
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

function openDialog(indices?: IndicesObject) {
	const dialog = document.getElementById(dragDialogId) as HTMLDialogElement
	dialog.showModal()

	if (!indices) {
		return console.error('Error indices not defined in openDialog()')
	}

	emit('updateSelectedAlbumIndices', indices)
}

function closeDialog() {
	const dialog = document.getElementById(dragDialogId) as HTMLDialogElement
	dialog.close()
}

function deleteSelectedAlbum() {
	// @ts-expect-error - this is being defined in sub component
	// oxlint-disable-next-line no-use-before-define
	deleteCurrent(selectedAlbumIndices)
	closeDialog()
}

function deleteCurrent(indices: IndicesObject) {
	GlobalChartState.value.chartTiles[indices.index1].splice(
		indices.index2,
		1,
		FillerAlbum,
	)
}
</script>

<template>
	<div class="uno-album-image-div-wrapper">
		<img
			v-show="mediaTile && !GlobalChartState.options.lockChart"
			src="/blackClose.svg"
			loading="lazy"
			draggable="false"
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
						chartType: GlobalChartState.options.mediaType!,
						dragSource: 'Chart',
						tileObject: GlobalChartState.chartTiles[index1][index2],
						originatingIndices: { index1, index2 },
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
					onDrop({
						dragEvent,
						indices: { index1: index1, index2: index2 },
					})
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

	<Dialog :dialog-id="dragDialogId" :close-button="false">
		<template #content>
			Delete the selected album?
			<div class="flex gap-2">
				<button class="uno-button" @click="deleteSelectedAlbum">Yes</button>
				<button class="uno-button" @click="closeDialog">No</button>
			</div>
		</template>
	</Dialog>
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
