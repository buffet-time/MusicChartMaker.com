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
		RearrangeChart(
			{ index1, index2 },
			albumDraggedIn.originatingIndices,
			GlobalChartState.value.chartTiles[index1][index2].image ===
				GrayBoxImgForPlaceholder
				? true
				: false
		)
		return
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
				<img
					v-if="album.image === GrayBoxImgForPlaceholder"
					:firstIndex="index1"
					:secondIndex="index2"
					:src="`${album.image}`"
					:alt="'placeholder square'"
					draggable="false"
					class="select-none tw-chart-image-size"
					@dragstart="() => undefined"
					@dragover.prevent="() => undefined"
					@drop.prevent="
						(dragEvent) => onDrop(dragEvent, { index1: index1, index2: index2 })
					"
				/>

				<Tooltip
					v-else
					:tooltip-name="`tooltip-${index1}-${index2}`"
					:offset="[0, 8]"
					:delay="500"
					:placement="'bottom-start'"
				>
					<template #content>
						<div class="tw-album-image-div-wrapper">
							<img
								v-show="album"
								src="/blackClose.svg"
								class="hidden absolute m-1 left-0 top-0 group-hover:bg-white group-hover:block cursor-pointer"
								@click="deleteCurrent({ index1, index2 })"
							/>

							<img
								:firstIndex="index1"
								:secondIndex="index2"
								:src="`${album.image}`"
								:alt="`${album.artist} - ${album.name}`"
								class="select-none cursor-grab tw-chart-image-size"
								draggable="true"
								@dragstart="
									(dragEvent) =>
										onDragStart(dragEvent, { index1: index1, index2: index2 })
								"
								@dragover.prevent="onDragOver"
								@drop.prevent="
									(dragEvent) =>
										onDrop(dragEvent, { index1: index1, index2: index2 })
								"
								@touchstart.prevent="
									(touchEvent) =>
										onTouchStart(
											touchEvent,
											album,
											'Chart',
											{ index1, index2 },
											openDialog
										)
								"
							/>
							<div
								v-if="album.image === GrayBoxImgFromApi"
								class="tw-album-image-text-overlay"
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
					<button class="tw-button" @click="deleteSelectedAlbum">Yes</button>
					<button class="tw-button" @click="closeDialog">No</button>
				</div>
			</template>
		</Dialog>
	</div>
</template>
