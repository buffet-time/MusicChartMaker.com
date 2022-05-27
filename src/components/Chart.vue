<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { watch } from 'vue'
import { DragSetData, GlobalChartState, RearrangeChart } from '../shared'
import { setStoredChart } from '../storage'
import { type DragDataTransfer, type IndicesObject } from '../types'

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
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	dragEvent.dataTransfer!.dropEffect = 'move'
}

function onDrop(dragEvent: DragEvent, { index1, index2 }: IndicesObject) {
	const data = dragEvent.dataTransfer?.getData('text/plain')!
	const albumDraggedIn = JSON.parse(data) as DragDataTransfer
	dragEvent.preventDefault()

	if (albumDraggedIn.dragSource === 'Chart') {
		// If in chart move the dragged element to the position you drop and push everything else back one
		RearrangeChart({ index1, index2 }, albumDraggedIn.originatingIndices)
		// const tile = GlobalChartState.value.chartTiles.splice(index1, 1)[0]
		// GlobalChartState.value.chartTiles.splice(index1, 0, tile)
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
</script>

<!-- :class="`grid-cols-${GlobalChartState.options.chartSize.length}`" -->

<template>
	<div class="flex h-full mr-2">
		<div
			class="grid mt-4 mb-4 gap-1 auto-rows-min"
			:style="{
				gridTemplateColumns: `repeat(${GlobalChartState.options.chartSize.numberOfRows}, minmax(100px, 200px))`
			}"
		>
			<template
				v-for="(albumArray, index1) in GlobalChartState.chartTiles"
				:key="`img-${index1}`"
			>
				<img
					v-for="(album, index2) in albumArray"
					:key="`img-${index1}-${index2}`"
					:src="`${album.image}`"
					:alt="`${album.artist} - ${album.name}`"
					class="cursor-pointer select-none"
					draggable="true"
					@dragstart="
						(dragEvent) =>
							onDragStart(dragEvent, { index1: index1, index2: index2 })
					"
					@dragover="onDragOver"
					@drop="
						(dragEvent) => onDrop(dragEvent, { index1: index1, index2: index2 })
					"
				/>
			</template>
		</div>

		<div
			v-if="GlobalChartState.options.displayTitles"
			class="pl-4 pt-4 text-left"
		>
			<template
				v-for="(albumRow, index) in GlobalChartState.chartTiles"
				:key="index"
			>
				<p
					v-for="(album, index2) in albumRow"
					:key="`${index}-${index2}`"
					:class="{
						'pt-3':
							index !== 0 &&
							GlobalChartState.options.chartSize.numberOfRows &&
							index % GlobalChartState.options.chartSize.numberOfRows === 0
					}"
					class="pointer-events-none"
				>
					<template v-if="GlobalChartState.options.displayNumberRank">
						{{ index + 1 }})
					</template>

					<span
						role="textbox"
						contenteditable
						class="pointer-events-auto"
						@input="(event) => albumArtistEdited(event, index)"
						>{{ album.artist }}
					</span>
					-
					<span
						role="textbox"
						contenteditable
						class="pointer-events-auto"
						@input="(event) => albumNameEdited(event, index)"
						>{{ album.name }}
					</span>
				</p>
			</template>
		</div>
	</div>
</template>
