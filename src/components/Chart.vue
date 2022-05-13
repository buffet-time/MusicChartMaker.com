<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { ref } from 'vue'
import { AlbumSearchResult } from '../types'
// import { AlbumSearchResult } from '../types'

const showText = ref(true)

// function onMouseUp(event: MouseEvent) {
// 	console.log(event)
// }

function onDragOver(dragEvent: DragEvent) {
	dragEvent.preventDefault()
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	dragEvent.dataTransfer!.dropEffect = 'copy'
}

function onDrop(dragEvent: DragEvent) {
	dragEvent.preventDefault()
	const data = dragEvent.dataTransfer?.getData('text/plain')!
	const albumDraggedIn = JSON.parse(data) as AlbumSearchResult

	dragEvent.target!.appendChild(document.getElementById(data))

	console.log(data, albumDraggedIn)
	console.log('on drop')
}
</script>

<template>
	<div>
		<!-- <div>{{ props.currentDraggedAlbum.artist }}</div> -->

		<!-- the actual chart -->
		<div @dragover="onDragOver" @drop="onDrop">
			<div>drag and drop</div>
			<br />
			<div>baby</div>
		</div>

		<div v-if="showText">
			and the album title section would be great to be able to edit the names
			here given how annoying seeing (remaster, explicit, etc can be)
		</div>
	</div>
</template>
