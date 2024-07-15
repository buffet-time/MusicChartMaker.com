<script setup lang="ts">
import type { AlbumTile, DragDataTransfer, IndicesObject } from '#types'
import { GlobalChartState } from '#shared/globals'
import { DragSetData, RearrangeChart, onTouchStart } from '#shared/drag'
import {
	FillerAlbum,
	GrayBoxImgForPlaceholder,
	GrayBoxImgFromApi,
	getAlbumNumber
} from '#shared/misc'

import Dialog from '#core/Dialog.vue'
import Tooltip from '#core/Tooltip.vue'

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
			dragEvent
		)
	}

	dragEvent.dataTransfer.dropEffect = 'move'
}

function onDrop(dragEvent: DragEvent, { index1, index2 }: IndicesObject) {
	const data = dragEvent.dataTransfer?.getData('text/plain')

	if (!data) {
		return console.error('onDrop() failed: ', dragEvent, index1, index2, data)
	}

	const albumDraggedIn = JSON.parse(data) as DragDataTransfer

	if (albumDraggedIn.dragSource === 'Chart') {
		// If in chart move the dragged element to the position you drop and push everything else back one
		return RearrangeChart(
			{ index1, index2 },
			albumDraggedIn.originatingIndices,
			GlobalChartState.value.chartTiles[index1][index2].image ===
				GrayBoxImgForPlaceholder
				? true
				: false
		)
	}

	// from search replace current dropped
	const currentElement = dragEvent.currentTarget as HTMLImageElement

	GlobalChartState.value.chartTiles[index1].splice(
		index2,
		1,
		albumDraggedIn.albumObject
	)
	currentElement.src = albumDraggedIn.albumObject.image
	currentElement.alt = `${albumDraggedIn.albumObject.artist} - ${albumDraggedIn.albumObject.name}`
}

function onDragStart(dragEvent: DragEvent, { index1, index2 }: IndicesObject) {
	if (!GlobalChartState) {
		return console.error(
			'Error getting GlobalChartState in onDragStart()',
			GlobalChartState
		)
	}

	DragSetData(dragEvent, {
		albumObject: GlobalChartState.value.chartTiles[index1][index2],
		dragSource: 'Chart',
		originatingIndices: {
			index1: index1,
			index2: index2
		}
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
		FillerAlbum
	)
}

// Returns the title for the given tile, if it's a placeholder it returns undefined
function chartTitle(
	index1: number,
	index2: number,
	album: AlbumTile
): string | undefined {
	return album.artist === 'Artist' && album.name === 'Album'
		? undefined
		: `${getAlbumNumber(index1, index2)}: ${album.artist} - ${album.name}`
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
			gap: `${GlobalChartState?.options.padding}rem`
		}"
	>
		<!-- update the above to adjust to the gap size instead of hardcoded to 0.25rem (4px) -->
		<div
			v-for="(albumArray, index1) in GlobalChartState?.chartTiles"
			:key="`img-${index1}`"
			class="flex flex-row"
			:style="{
				gap: `${GlobalChartState?.options.padding}rem`
			}"
		>
			<div
				v-for="(album, index2) in albumArray"
				:key="`img-${index1}-${index2}`"
				class="group"
			>
				<!-- Genuinely not sure where the extra 4px is coming from for these -->
				<div v-if="album.image === GrayBoxImgForPlaceholder" class="mb-[-4px]">
					<img
						:firstIndex="index1"
						:secondIndex="index2"
						:src="`${album.image}`"
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
								v-show="album && !GlobalChartState.options.lockChart"
								src="/blackClose.svg"
								loading="lazy"
								class="hidden absolute left-0 top-0 m-1 cursor-pointer group-hover:block group-hover:bg-white"
								@click="deleteCurrent({ index1, index2 })"
							/>

							<img
								:firstIndex="index1"
								:secondIndex="index2"
								:src="`${album.image}`"
								:alt="`${album.artist} - ${album.name}`"
								loading="lazy"
								class="uno-chart-image-size select-none"
								:class="{
									'cursor-grab': !GlobalChartState.options.lockChart
								}"
								:draggable="GlobalChartState.options.lockChart ? false : true"
								@dragstart="
									(dragEvent) =>
										onDragStart(dragEvent, { index1: index1, index2: index2 })
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
										onTouchStart(
											touchEvent,
											album,
											'Chart',
											{ index1, index2 },
											openDialog
										)
									}
								"
							/>
							<div
								v-if="album.image === GrayBoxImgFromApi"
								class="uno-flex-center uno-album-image-text-overlay overflow-hidden text-ellipsis chartImages"
							>
								{{ album.artist }} - {{ album.name }}
							</div>
						</div>
					</template>
					<template #tooltip>
						{{ chartTitle(index1, index2, album) }}
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
