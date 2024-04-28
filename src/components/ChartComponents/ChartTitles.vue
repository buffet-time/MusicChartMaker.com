<script setup lang="ts">
import { GlobalChartState } from '#shared/globals'
import { getAlbumNumber, GrayBoxImgForPlaceholder } from '#shared/misc'

function albumArtistEdited(event: Event, index: number, index2: number) {
	GlobalChartState.value.chartTiles[index][index2].artist = (
		event.target as HTMLSpanElement
	).innerText
}

function albumNameEdited(event: Event, index: number, index2: number) {
	GlobalChartState.value.chartTiles[index][index2].name = (
		event.target as HTMLSpanElement
	).innerText
}
</script>

<template>
	<div
		v-if="GlobalChartState?.options.displayTitles"
		class="min-w-[200px] text-left text-sm"
	>
		<div
			v-for="(albumRow, index) in GlobalChartState.chartTiles"
			:key="index"
			class="flex flex-col"
			:class="{ 'mb-1': index !== GlobalChartState.chartTiles.length - 1 }"
		>
			<template v-for="(album, index2) in albumRow" :key="`${index}-${index2}`">
				<!-- my-[-2px -->
				<p
					v-if="album.image !== GrayBoxImgForPlaceholder"
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
						:contenteditable="
							GlobalChartState.options.lockChart ? undefined : 'plaintext-only'
						"
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
						:contenteditable="
							GlobalChartState.options.lockChart ? undefined : 'plaintext-only'
						"
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
