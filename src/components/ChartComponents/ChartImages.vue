<script setup lang="ts">
import type { DragDataTransfer, IndicesObject } from '#types'
import { GlobalChartState } from '#utils/globals'
import { dragDialogId, RearrangeChart } from '#utils/drag'
import {
	FillerAlbum,
	GrayBoxImgForPlaceholderForMusic,
	GrayBoxImgForPlaceholderForMedia,
} from '#utils/misc'

import Dialog from '#core/Dialog.vue'
import Tooltip from '#core/Tooltip.vue'
import {
	getMediaNameWithNumber,
	getMediaNameWithoutNumber,
	idForFirstImage,
} from '#utils/chart'
import ChartNonPlaceHolderImage from './ChartNonPlaceHolderImage.vue'

// oxlint-disable-next-line no-unassigned-vars
let selectedAlbumIndices: IndicesObject

function closeDialog() {
	const dialog = document.getElementById(dragDialogId) as HTMLDialogElement
	dialog.close()
}

function deleteSelectedAlbum() {
	// @ts-expect-error - this is being defined in sub component
	deleteCurrent(selectedAlbumIndices)
	closeDialog()
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
				GrayBoxImgForPlaceholderForMusic,
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
					v-if="
						mediaTile.image.includes(GrayBoxImgForPlaceholderForMusic) ||
						mediaTile.image.includes(GrayBoxImgForPlaceholderForMedia)
					"
					class="mb-[-4px]"
				>
					<img
						:firstIndex="index1"
						:secondIndex="index2"
						:src="`/placeholders/${GlobalChartState.options.mediaType === 'album' ? GrayBoxImgForPlaceholderForMusic : GrayBoxImgForPlaceholderForMedia}`"
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
						<ChartNonPlaceHolderImage
							:index1="index1"
							:index2="index2"
							:media-tile="mediaTile"
							:selectedAlbumIndices="selectedAlbumIndices"
							:delete-current="deleteCurrent"
							:on-drop="onDrop"
							@updateSelectedAlbumIndices="
								(newVal: IndicesObject) => (selectedAlbumIndices = newVal)
							"
						/>
					</template>
					<template #tooltip>
						{{ getMediaNameWithNumber({ index1, index2, media: mediaTile }) }}
					</template>
				</Tooltip>
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
	</div>
</template>
