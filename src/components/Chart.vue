<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { watch } from 'vue'
import {
	DragSetData,
	FillerAlbum,
	GlobalChartState,
	RearrangeChart,
	GrayBoxImg
} from '../shared'
import { setStoredChart } from '../storage'
import { type DragDataTransfer, type IndicesObject } from '../types'
import Close from '../assets/close.svg'

watch(
	GlobalChartState,
	() => {
		setStoredChart(
			GlobalChartState.value.options.chartTitle,
			GlobalChartState.value
		)
	},
	{
		deep: true
	}
)

function onDragOver(dragEvent: DragEvent) {
	dragEvent.preventDefault()
	dragEvent.dataTransfer!.dropEffect = 'move'
}

function onDrop(dragEvent: DragEvent, { index1, index2 }: IndicesObject) {
	const data = dragEvent.dataTransfer?.getData('text/plain')!
	const albumDraggedIn = JSON.parse(data) as DragDataTransfer
	dragEvent.preventDefault()

	if (albumDraggedIn.dragSource === 'Chart') {
		// If in chart move the dragged element to the position you drop and push everything else back one
		RearrangeChart({ index1, index2 }, albumDraggedIn.originatingIndices)
	} else {
		// from search replace current dropped
		const currrentElement = dragEvent.currentTarget as HTMLImageElement

		GlobalChartState.value.chartTiles[index1].splice(
			index2,
			1,
			albumDraggedIn.albumObject
		)
		currrentElement.src = albumDraggedIn.albumObject.image
		currrentElement.alt = `${albumDraggedIn.albumObject.artist} - ${albumDraggedIn.albumObject.name}`
	}
}

function onDragStart(dragEvent: DragEvent, { index1, index2 }: IndicesObject) {
	DragSetData(dragEvent, {
		albumObject: GlobalChartState.value.chartTiles[index1][index2],
		dragSource: 'Chart',
		originatingIndices: {
			index1: index1,
			index2: index2
		}
	})
	dragEvent.dataTransfer!.dropEffect = 'copy'
}

function albumArtistEdited(event: Event, index: number) {
	// @ts-expect-error
	GlobalChartState.value.chartTiles[index].artist = event.target.innerText
}

function albumNameEdited(event: Event, index: number) {
	// @ts-expect-error
	GlobalChartState.value.chartTiles[index].name = event.target.innerText
}

function getAlbumNumber(indexOne: number, indexTwo: number): number {
	let returnValue = 0
	for (let x = 0; x < indexOne; x++) {
		returnValue += GlobalChartState.value.options.chartSize.rowSizes[x]
	}

	return returnValue + 1 + indexTwo
}

function deleteCurrent(indexOne: number, indexTwo: number) {
	GlobalChartState.value.chartTiles[indexOne].splice(indexTwo, 1, FillerAlbum)
}
</script>

<template>
	<div
		class="flex h-fit p-2 w-fit"
		:style="{ backgroundColor: GlobalChartState.options.background }"
	>
		<!-- The actual album chart -->
		<div class="flex-col mt-4 mb-4">
			<div
				v-for="(albumArray, index1) in GlobalChartState.chartTiles"
				:key="`img-${index1}`"
				class="flex flex-row gap-1 pb-1"
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
						@click="deleteCurrent(index1, index2)"
					/>
					<img
						:src="`${album.image}`"
						:alt="`${album.artist} - ${album.name}`"
						:title="`${getAlbumNumber(index1, index2)}: ${album.artist} - ${
							album.name
						}`"
						class="cursor-pointer select-none w-full min-w-[50px] min-h-[50px] max-w-[200px] max-h-[200px]"
						draggable="true"
						@dragstart="
							(dragEvent) =>
								onDragStart(dragEvent, { index1: index1, index2: index2 })
						"
						@dragover="onDragOver"
						@drop="
							(dragEvent) =>
								onDrop(dragEvent, { index1: index1, index2: index2 })
						"
					/>
				</div>
			</div>
		</div>

		<!-- Album titles -->
		<div
			v-if="GlobalChartState.options.displayTitles"
			class="pl-4 pt-4 text-left min-w-[200px]"
		>
			<template
				v-for="(albumRow, index) in GlobalChartState.chartTiles"
				:key="index"
			>
				<p
					v-for="(album, index2) in albumRow"
					:key="`${index}-${index2}`"
					:class="{
						'pt-2': index2 === 0 && index !== 0
					}"
					class="pointer-events-none"
					:style="{ color: GlobalChartState.options.textColor }"
				>
					<template v-if="GlobalChartState.options.displayNumberRank">
						{{ getAlbumNumber(index, index2) }})
					</template>

					<span
						role="textbox"
						contenteditable
						class="pointer-events-auto"
						@input="(event) => albumArtistEdited(event, index)"
					>
						{{ album.artist }}
					</span>
					-
					<span
						role="textbox"
						contenteditable
						class="pointer-events-auto"
						@input="(event) => albumNameEdited(event, index)"
					>
						{{ album.name }}
					</span>
				</p>
			</template>
		</div>
	</div>
</template>
