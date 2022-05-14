<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { type Ref, ref } from 'vue'
import { DragSetData } from '../shared'
import { type DragDataTransfer, type AlbumSearchResult } from '../types'

const showText = ref(false)
const chartSize = { length: 3, height: 3 }
const albumArray: Ref<AlbumSearchResult[]> = ref([])

for (let x = 0; x < chartSize.height * chartSize.length; x++) {
	albumArray.value.push({
		artist: 'George Clanton',
		name: 'Slide',
		image: 'https://upload.wikimedia.org/wikipedia/en/4/41/Slide_GC.png'
	})
}

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
		const blah = albumArray.value.splice(albumDraggedIn.originatingIndex!, 1)[0]
		albumArray.value.splice(droppedElementsIndex, 0, blah)
	} else {
		// from search replace current dropped
		albumArray.value.splice(droppedElementsIndex, 1, albumDraggedIn.albumObject)
		currrentElement.src = albumDraggedIn.albumObject.image
		currrentElement.alt = `${albumDraggedIn.albumObject.artist} - ${albumDraggedIn.albumObject.name}`
	}
}

function onDragStart(dragEvent: DragEvent, index: number) {
	DragSetData(dragEvent, {
		albumObject: albumArray.value[index],
		dragSource: 'Chart',
		originatingIndex: index
	})
	dragEvent.dataTransfer!.dropEffect = 'copy'
}
</script>

<template>
	<div class="flex justify-center items-center">
		<div class="flex flex-wrap">
			<img
				v-for="(album, index) in albumArray"
				:key="index"
				width="150"
				height="150"
				:src="`${album.image}`"
				:alt="`${album.artist} - ${album.name}`"
				class="flex-[0_0_33%]"
				draggable="true"
				@dragstart="(dragEvent) => onDragStart(dragEvent, index)"
				@dragover="onDragOver"
				@drop="(dragEvent) => onDrop(dragEvent, index)"
			/>
		</div>

		<div v-if="showText">
			and the album title section would be great to be able to edit the names
			here given how annoying seeing (remaster, explicit, etc can be)
		</div>
	</div>
</template>
