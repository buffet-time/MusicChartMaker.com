<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { type Ref, ref } from 'vue'
import { type AlbumSearchResult } from '../types'
// import { AlbumSearchResult } from '../types'

const showText = ref(false)
const chartSize = { length: 3, height: 3 }
const albumArray: Ref<AlbumSearchResult[]> = ref([])

// const blah = [ ['cock', 'cock2'], ['cock', 'cock2']]

console.log(100, albumArray.value)

for (let x = 0; x < chartSize.height * chartSize.length; x++) {
	albumArray.value.push({
		artist: '',
		name: '',
		image:
			'https://cdn.media.amplience.net/s/hottopic/11750610_hi?$productMainDesktop$'
	})
}

console.log(101, albumArray.value)

// function onMouseUp(event: MouseEvent) {
// 	console.log(event)
// }

function onDragOver(dragEvent: DragEvent) {
	try {
		dragEvent.preventDefault()
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		dragEvent.dataTransfer!.dropEffect = 'copy'
	} catch {
		//
	}
}

function onDrop(dragEvent: DragEvent) {
	try {
		dragEvent.preventDefault()
		const data = dragEvent.dataTransfer?.getData('text/plain')!
		const albumDraggedIn = JSON.parse(data) as AlbumSearchResult
		const currrentElement = dragEvent.currentTarget as HTMLImageElement

		currrentElement.src = albumDraggedIn.image

		// dragEvent.target!.appendChild(document.getElementById(data))

		console.log(currrentElement)
		console.log(albumDraggedIn)
	} catch {
		//
	}
}
</script>

<template>
	<div class="flex justify-center items-center">
		<!-- <div>{{ props.currentDraggedAlbum.artist }}</div> -->

		<!-- the actual chart -->
		<div class="flex flex-wrap">
			<img
				v-for="(album, index) in albumArray"
				:key="index"
				width="150"
				:src="`${album.image}`"
				:alt="`${album.artist} - ${album.name}`"
				class="flex-[0_0_33%]"
				@dragover="onDragOver"
				@drop="onDrop"
			/>
		</div>

		<div v-if="showText">
			and the album title section would be great to be able to edit the names
			here given how annoying seeing (remaster, explicit, etc can be)
		</div>
	</div>
</template>
