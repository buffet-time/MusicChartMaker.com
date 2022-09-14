<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script setup lang="ts">
import { GlobalChartState, getAlbumNumber, GrayBoxImg } from '#src/shared'

function albumArtistEdited(event: Event, index: number, index2: number) {
	GlobalChartState.value!.chartTiles[index][index2].artist = (
		event.target as HTMLSpanElement
	).innerText
}

function albumNameEdited(event: Event, index: number, index2: number) {
	GlobalChartState.value!.chartTiles[index][index2].name = (
		event.target as HTMLSpanElement
	).innerText
}
</script>

<template>
	<div
		v-if="GlobalChartState?.options.displayTitles"
		class="pl-3 text-left min-w-[200px] text-sm"
	>
		<div
			v-for="(albumRow, index) in GlobalChartState.chartTiles"
			:key="index"
			class="flex flex-col"
			:class="{ 'mb-1': index !== GlobalChartState.chartTiles.length - 1 }"
		>
			<template v-for="(album, index2) in albumRow" :key="`${index}-${index2}`">
				<p
					v-if="album.image !== GrayBoxImg"
					class="pointer-events-none"
					:style="{
						color: GlobalChartState.options.textColor,
						textShadow: `-1px -1px 0 ${GlobalChartState.options.textBorderColor}, 
						1px -1px 0 ${GlobalChartState.options.textBorderColor}, 
						-1px 1px 0 ${GlobalChartState.options.textBorderColor}, 
						1px 1px 0 ${GlobalChartState.options.textBorderColor}`,
						fontSize: `${GlobalChartState.options.fontSize}px`,
						letterSpacing: `${GlobalChartState.options.textSpacing}px`,
						fontFamily: GlobalChartState.options.font
					}"
				>
					<template v-if="GlobalChartState.options.displayNumberRank">
						{{ getAlbumNumber(index, index2) }})
					</template>
					<span
						role="textbox"
						contenteditable
						class="pointer-events-auto"
						@dragover.prevent="() => false"
						@drop.prevent="() => false"
						@input="(event) => albumArtistEdited(event, index, index2)"
					>
						{{ album.artist }}
					</span>
					-
					<span
						role="textbox"
						contenteditable
						class="pointer-events-auto"
						@dragover.prevent="() => false"
						@drop.prevent="() => false"
						@input="(event) => albumNameEdited(event, index, index2)"
					>
						{{ album.name }}
					</span>
				</p>
			</template>
		</div>

		<!-- To prevent erroneous edits to the bottom album/ artist -->
		‎
	</div>
</template>
