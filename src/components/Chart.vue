<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { type Ref, ref } from 'vue'
import { type AlbumSearchResult } from '../types'

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
	try {
		dragEvent.preventDefault()
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		dragEvent.dataTransfer!.dropEffect = 'move'
	} catch {
		//
	}
}

function onDrop(dragEvent: DragEvent, index: number) {
	try {
		dragEvent.preventDefault()
		const data = dragEvent.dataTransfer?.getData('text/plain')!
		const albumDraggedIn = JSON.parse(data) as AlbumSearchResult
		const currrentElement = dragEvent.currentTarget as HTMLImageElement

		albumArray.value[index] = albumDraggedIn

		currrentElement.src = albumDraggedIn.image
		currrentElement.alt = `${albumDraggedIn.artist} - ${albumDraggedIn.name}`

		console.log(currrentElement)
		console.log(albumDraggedIn)
	} catch {
		//
	}
}

function onDragStart(dragEvent: DragEvent, index: number) {
	dragEvent.dataTransfer!.setData(
		'text/plain',
		JSON.stringify(albumArray.value[index])
	)
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
