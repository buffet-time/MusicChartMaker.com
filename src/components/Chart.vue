<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { watch, ref } from 'vue'
import { DragSetData, GlobalChartState } from '../shared'
import { setStoredChart } from '../storage'
import { type DragDataTransfer } from '../types'

const showText = ref(true)

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

function onDrop(dragEvent: DragEvent, droppedElementsIndex: number) {
	dragEvent.preventDefault()
	const data = dragEvent.dataTransfer?.getData('text/plain')!
	const albumDraggedIn = JSON.parse(data) as DragDataTransfer
	const currrentElement = dragEvent.currentTarget as HTMLImageElement

	if (albumDraggedIn.dragSource === 'Chart') {
		// If in chart move the dragge element to the position you drop and push everything else back one
		const tile = GlobalChartState.value.chartTiles.splice(
			albumDraggedIn.originatingIndex!,
			1
		)[0]
		GlobalChartState.value.chartTiles.splice(droppedElementsIndex, 0, tile)
	} else {
		// from search replace current dropped
		GlobalChartState.value.chartTiles.splice(
			droppedElementsIndex,
			1,
			albumDraggedIn.albumObject
		)
		currrentElement.src = albumDraggedIn.albumObject.image
		currrentElement.alt = `${albumDraggedIn.albumObject.artist} - ${albumDraggedIn.albumObject.name}`
	}
}

function onDragStart(dragEvent: DragEvent, index: number) {
	DragSetData(dragEvent, {
		albumObject: GlobalChartState.value.chartTiles[index],
		dragSource: 'Chart',
		originatingIndex: index
	})
	dragEvent.dataTransfer!.dropEffect = 'copy'
}
</script>

<!-- :class="`grid-cols-${GlobalChartState.options.chartSize.length}`" -->

<template>
	<div class="flex h-full">
		<div
			class="grid mt-4 mb-4 gap-1 auto-rows-min"
			:style="{
				gridTemplateColumns: `repeat(${GlobalChartState.options.chartSize.columns}, minmax(100px, 200px))`
			}"
		>
			<img
				v-for="(album, index) in GlobalChartState.chartTiles"
				:key="index"
				:src="`${album.image}`"
				:alt="`${album.artist} - ${album.name}`"
				class="cursor-pointer"
				draggable="true"
				@dragstart="(dragEvent) => onDragStart(dragEvent, index)"
				@dragover="onDragOver"
				@drop="(dragEvent) => onDrop(dragEvent, index)"
			/>
		</div>

		<div v-if="showText" class="pl-4 text-left">
			<p
				v-for="(album, index) in GlobalChartState.chartTiles"
				:key="index"
				class="pt-4"
			>
				{{ index + 1 }}) {{ album.artist }} - {{ album.name }}
			</p>
		</div>
	</div>
</template>
