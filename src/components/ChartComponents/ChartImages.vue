<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script setup lang="ts">
import type { AlbumTile, DragDataTransfer, IndicesObject } from '#types'
import { GlobalChartState } from '#shared/globals'
import { DragSetData, RearrangeChart, onTouchStart } from '#shared/drag'
import { FillerAlbum, GrayBoxImg, getAlbumNumber } from '#shared/misc'

import Close from '#assets/blackClose.svg'
import Dialog from '../CoreComponents/Dialog.vue'

const dialogId = 'DragLongHoldId'
let selectedAlbumIndices: IndicesObject

function openDialog(indices?: IndicesObject) {
	// prettier-ignore
	(document.getElementById(dialogId) as HTMLDialogElement).showModal()

	selectedAlbumIndices = indices!
}

function closeDialog() {
	// prettier-ignore
	(document.getElementById(dialogId) as HTMLDialogElement).close()
}

function deleteSelectedAlbum() {
	deleteCurrent(selectedAlbumIndices)
	closeDialog()
}

function onDragOver(dragEvent: DragEvent) {
	dragEvent.dataTransfer!.dropEffect = 'move'
}

function onDrop(dragEvent: DragEvent, { index1, index2 }: IndicesObject) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	const data = dragEvent.dataTransfer?.getData('text/plain')!
	const albumDraggedIn = JSON.parse(data) as DragDataTransfer

	if (albumDraggedIn.dragSource === 'Chart') {
		// If in chart move the dragged element to the position you drop and push everything else back one
		RearrangeChart(
			{ index1, index2 },
			albumDraggedIn.originatingIndices,
			GlobalChartState.chartTiles[index1][index2].image === GrayBoxImg
				? true
				: false
		)
		return
	}

	// from search replace current dropped
	const currentElement = dragEvent.currentTarget as HTMLImageElement

	GlobalChartState.chartTiles[index1].splice(
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
		albumObject: GlobalChartState.chartTiles[index1][index2],
		dragSource: 'Chart',
		originatingIndices: {
			index1: index1,
			index2: index2
		}
	})
	dragEvent.dataTransfer!.dropEffect = 'copy'
}

function deleteCurrent(indices: IndicesObject) {
	GlobalChartState.chartTiles[indices.index1].splice(
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
					v-if="album.image !== GrayBoxImg"
					v-show="album"
					title="Delete Album"
					:src="Close"
					class="hidden absolute group-hover:bg-white group-hover:block cursor-pointer"
					@click="deleteCurrent({ index1, index2 })"
				/>
				<img
					:firstIndex="index1"
					:secondIndex="index2"
					:src="`${album.image}`"
					:alt="`${album.artist} - ${album.name}`"
					:title="chartTitle(index1, index2, album)"
					class="select-none w-full min-w-[40px] min-h-[40px] max-w-[200px] max-h-[200px]"
					:class="{ 'cursor-pointer': album.image !== GrayBoxImg }"
					:draggable="album.image === GrayBoxImg ? false : true"
					@dragstart="
						(dragEvent) =>
							onDragStart(dragEvent, { index1: index1, index2: index2 })
					"
					@dragover.prevent="onDragOver"
					@drop.prevent="
						(dragEvent) => onDrop(dragEvent, { index1: index1, index2: index2 })
					"
					@touchstart.prevent="
						(touchEvent) => {
							if (album.image === GrayBoxImg) {
								return
							}
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
			</div>
		</div>
		<Dialog :dialog-id="dialogId" :close-button="false">
			Delete the selected album?
			<div class="flex gap-2">
				<button class="tw-button" @click="deleteSelectedAlbum">Yes</button>
				<button class="tw-button" @click="closeDialog">No</button>
			</div>
		</Dialog>
	</div>
</template>
