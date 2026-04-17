<script setup lang="ts">
import type { DragDataTransfer, IndicesObject } from '#types'
import { GlobalChartState } from '#utils/globals'
import { DragSetData, RearrangeChart, onTouchStart } from '#utils/drag'
import {
	FillerAlbum,
	GrayBoxImgForPlaceholder,
	GrayBoxImgFromApi,
} from '#utils/misc'

import Dialog from '#core/Dialog.vue'
import Tooltip from '#core/Tooltip.vue'
import {
	getMediaNameWithNumber,
	getMediaNameWithoutNumber,
	idForFirstImage,
} from '#utils/chart'

const dialogId = 'DragLongHoldId'
let selectedAlbumIndices: IndicesObject

function openDialog(indices?: IndicesObject) {
	const dialog = document.getElementById(dialogId) as HTMLDialogElement
	dialog.showModal()

	if (!indices) {
		return console.error('Error indices not defined in openDialog()')
	}

	selectedAlbumIndices = indices
}

function closeDialog() {
	const dialog = document.getElementById(dialogId) as HTMLDialogElement
	dialog.close()
}

function deleteSelectedAlbum() {
	deleteCurrent(selectedAlbumIndices)
	closeDialog()
}

function onDragOver(dragEvent: DragEvent) {
	if (!dragEvent.dataTransfer) {
		return console.error(
			'Error dragEvent.dataTransfer not defined in onDragOver',
			dragEvent,
		)
	}

	dragEvent.dataTransfer.dropEffect = 'move'
}

function onDrop(dragEvent: DragEvent, { index1, index2 }: IndicesObject) {
	const data = dragEvent.dataTransfer?.getData('text/plain')

	if (!data) {
		return console.error('onDrop() failed: ', dragEvent, index1, index2, data)
	}

	const mediaDraggedIn = JSON.parse(data) as DragDataTransfer

	if (mediaDraggedIn.dragSource === 'Chart') {
		// If in chart move the dragged element to the position you drop and push everything else back one
		return RearrangeChart(
			{ index1, index2 },
			mediaDraggedIn.originatingIndices,
			GlobalChartState.value.chartTiles[index1][index2].image ===
				GrayBoxImgForPlaceholder,
		)
	}

	// from search replace current dropped
	const currentElement = dragEvent.currentTarget as HTMLImageElement

	const mediaObject = mediaDraggedIn?.albumObject
		? mediaDraggedIn.albumObject
		: mediaDraggedIn.mediaObject!

	GlobalChartState.value.chartTiles[index1].splice(
		index2,
		1,
		// @ts-expect-error - it is only one or the other.
		mediaDraggedIn.albumObject
			? mediaDraggedIn.albumObject
			: mediaDraggedIn.mediaObject,
	)
	currentElement.src = mediaObject.image
	currentElement.alt = getMediaNameWithoutNumber(mediaObject)
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

function deleteCurrent(indices: IndicesObject) {
	GlobalChartState.value.chartTiles[indices.index1].splice(
		indices.index2,
		1,
		FillerAlbum,
	)
}
</script>

<template>
	<div
		id="chartImages"
		class="flex flex-col"
		:style="{
			maxWidth: `${
				GlobalChartState!.options.chartSize.rowSizes[0] * 200 +
				(GlobalChartState!.options.chartSize.rowSizes[0] - 1) * 4
			}px`,
			gap: `${GlobalChartState?.options.padding}rem`,
		}"
	>
		<!-- update the above to adjust to the gap size instead of hardcoded to 0.25rem (4px) -->
		<div
			v-for="(mediaTilesArray, index1) in GlobalChartState?.chartTiles"
			:key="`img-${index1}`"
			class="flex flex-row"
			:style="{
				gap: `${GlobalChartState?.options.padding}rem`,
			}"
		>
			<div
				v-for="(mediaTile, index2) in mediaTilesArray"
				:id="index1 === 0 && index2 === 0 ? idForFirstImage : undefined"
				:key="`img-${index1}-${index2}`"
				class="group"
			>
				<!-- Genuinely not sure where the extra 4px is coming from for these -->
				<div
					v-if="mediaTile.image === GrayBoxImgForPlaceholder"
					class="mb-[-4px]"
				>
					<img
						:firstIndex="index1"
						:secondIndex="index2"
						:src="`${mediaTile.image}`"
						:alt="'placeholder square'"
						loading="lazy"
						draggable="false"
						class="uno-chart-image-size select-none"
						@dragstart="() => undefined"
						@dragover.prevent="() => undefined"
						@drop.prevent="
							(dragEvent) => {
								if (GlobalChartState.options.lockChart) return
								onDrop(dragEvent, { index1: index1, index2: index2 })
							}
						"
					/>
				</div>

				<Tooltip
					v-else
					:tooltip-name="`tooltip-${index1}-${index2}`"
					:offset="[0, 8]"
					:delay="500"
					:placement="'bottom-start'"
				>
					<template #content>
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
								v-if="mediaTile.image === GrayBoxImgFromApi"
								class="uno-flex-center uno-album-image-text-overlay overflow-hidden text-ellipsis chartImages"
							>
								{{ getMediaNameWithoutNumber(mediaTile) }}
							</div>
						</div>
					</template>
					<template #tooltip>
						{{ getMediaNameWithNumber({ index1, index2, media: mediaTile }) }}
					</template>
				</Tooltip>
			</div>
		</div>
		<Dialog :dialog-id="dialogId" :close-button="false">
			<template #content>
				Delete the selected album?
				<div class="flex gap-2">
					<button class="uno-button" @click="deleteSelectedAlbum">Yes</button>
					<button class="uno-button" @click="closeDialog">No</button>
				</div>
			</template>
		</Dialog>
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
