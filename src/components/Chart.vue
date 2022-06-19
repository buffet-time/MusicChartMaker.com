<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { watch } from 'vue'
import {
	DragSetData,
	FillerAlbum,
	GlobalChartState,
	RearrangeChart,
	GrayBoxImg,
	getAlbumNumber
} from '../shared'
import { setStoredChart } from '#src/storage'
import { type DragDataTransfer, type IndicesObject } from '#src/types/types'
import Close from '#assets/blackClose.svg'
import ChartTitles from './ChartComponents/ChartTitles.vue'

// TODO: create option to disable auto save
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

function deleteCurrent(indexOne: number, indexTwo: number) {
	GlobalChartState.value.chartTiles[indexOne].splice(indexTwo, 1, FillerAlbum)
}
</script>

<template>
	<div
		id="Chart"
		class="flex h-fit p-2 w-fit ml-[230px]"
		:style="{
			backgroundColor: GlobalChartState.options.background,
			backgroundImage: `url(${GlobalChartState.options.backgroundImage})`
		}"
	>
		<!-- The actual album chart -->
		<div
			class="flex-col mt-4 mb-4"
			:style="{
				maxWidth: `${
					GlobalChartState.options.chartSize.rowSizes[0] * 200 +
					(GlobalChartState.options.chartSize.rowSizes[0] - 1) * 4
				}px`
			}"
		>
			<!-- update the above to adjust to the gap size instead of hardcoded to 0.25rem (4px) -->
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
						class="cursor-pointer select-none w-full min-w-[40px] min-h-[40px] max-w-[200px] max-h-[200px]"
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
		<ChartTitles />
	</div>
</template>
