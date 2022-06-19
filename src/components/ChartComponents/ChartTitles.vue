<script setup lang="ts">
import { GlobalChartState, getAlbumNumber } from '#src/shared'

function albumArtistEdited(event: Event, index: number) {
	// @ts-expect-error
	GlobalChartState.value.chartTiles[index].artist = event.target.innerText
}

function albumNameEdited(event: Event, index: number) {
	// @ts-expect-error
	GlobalChartState.value.chartTiles[index].name = event.target.innerText
}
</script>

<template>
	<!-- Album titles -->
	<div
		v-if="GlobalChartState.options.displayTitles"
		class="pl-4 pt-4 text-left min-w-[200px] text-sm"
	>
		<template
			v-for="(albumRow, index) in GlobalChartState.chartTiles"
			:key="index"
		>
			<p
				v-for="(album, index2) in albumRow"
				:key="`${index}-${index2}`"
				class="pointer-events-none"
				:class="{
					'pt-2': index2 === 0 && index !== 0
				}"
				:style="{
					color: GlobalChartState.options.textColor,
					textShadow: `-1px -1px 0 ${GlobalChartState.options.textBorderColor}, 
						1px -1px 0 ${GlobalChartState.options.textBorderColor}, 
						-1px 1px 0 ${GlobalChartState.options.textBorderColor}, 
						1px 1px 0 ${GlobalChartState.options.textBorderColor}`
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
					@input="(event) => albumArtistEdited(event, index)"
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
					@input="(event) => albumNameEdited(event, index)"
				>
					{{ album.name }}
				</span>
			</p>
		</template>
	</div>
</template>
