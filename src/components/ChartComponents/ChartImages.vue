<script setup lang="ts">
import type { IndicesObject } from '#types'
import { GlobalChartState } from '#utils/globals'
import {
	GrayBoxImgForPlaceholderForMusic,
	GrayBoxImgForPlaceholderForMedia,
	LegacyPlaceholder,
} from '#utils/misc'

import Tooltip from '#core/Tooltip.vue'
import { getMediaNameWithNumber, idForFirstImage } from '#utils/chart'
import ChartNonPlaceHolderImage from './ChartNonPlaceHolderImage.vue'
import ChartPlaceholderImages from './ChartPlaceholderImages.vue'

// oxlint-disable-next-line no-unassigned-vars
let selectedAlbumIndices: IndicesObject
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
				<ChartPlaceholderImages
					v-if="
						mediaTile.image?.includes(GrayBoxImgForPlaceholderForMusic) ||
						mediaTile.image?.includes(GrayBoxImgForPlaceholderForMedia) ||
						mediaTile.image?.includes(LegacyPlaceholder)
					"
					:index1="index1"
					:index2="index2"
				/>

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
	</div>
</template>
