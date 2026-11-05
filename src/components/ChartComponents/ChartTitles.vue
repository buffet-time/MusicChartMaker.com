<script setup lang="ts">
import { GlobalChartState } from '#utils/globals'
import { delay, GrayBoxImgForPlaceholderForMusic, isMobile } from '#utils/misc'
import { onMounted, ref, nextTick, watch } from 'vue'
import { getAlbumNumber, GetHeightOfImages } from '#utils/chart'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps<{
	heightOfChartImages: number | undefined
}>()

const chartTitlesRef = ref<HTMLDivElement>()

function mediaFirstTextEdited(event: Event, index: number, index2: number) {
	const tileEdited = GlobalChartState.value.chartTiles[index][index2]

	if ('artist' in tileEdited) {
		tileEdited.artist = (event.target as HTMLSpanElement).innerText
	} else {
		tileEdited.title = (event.target as HTMLSpanElement).innerText
	}
}

function mediaSecondTextEdited(event: Event, index: number, index2: number) {
	const tileEdited = GlobalChartState.value.chartTiles[index][index2]

	if ('artist' in tileEdited) {
		tileEdited.name = (event.target as HTMLSpanElement).innerText
	} else {
		tileEdited.year = (event.target as HTMLSpanElement).innerText
	}
}

const debouncedGetFontSize = useDebounceFn(async () => {
	await getFontSize()
}, 25)

watch(
	() => GlobalChartState.value.options.displayTitles,
	async () => {
		await nextTick()
		getFontSize()
	},
)

watch(
	() => GlobalChartState.value.options.constrainTitles,
	async () => {
		await nextTick()
		getFontSize()
	},
)

onMounted(async () => {
	window.addEventListener('resize', () => debouncedGetFontSize())
	await delay(1)
	await nextTick()
	await getFontSize()
	// TODO:
	// Seriously this shit is so janky, fix it!!!
	await delay(100)
	await nextTick()
	getFontSize()
})

async function getFontSize() {
	if (isOverflowing()) {
		await reduceFontSize()
	} else {
		await increaseFontSize()
	}
}

async function reduceFontSize() {
	if (isOverflowing()) {
		GlobalChartState.value.options.fontSize! -= 1
		await nextTick()
		reduceFontSize()
	} else {
		// once it's no longer overflowing, quickly check to see if we can make it a bit bigger :)
		await increaseFontSize()
	}
}

async function increaseFontSize() {
	if (!isOverflowing() && GlobalChartState.value.options.fontSize! < 18) {
		GlobalChartState.value.options.fontSize! += 0.05
		await nextTick()
		increaseFontSize()
	}
}

function isOverflowing() {
	if (GlobalChartState.value.options.constrainTitles) {
		const chartTitlesRow = document.getElementById('chartTitlesRow')
		if (chartTitlesRow) {
			return chartTitlesRow.scrollHeight > chartTitlesRow.clientHeight
		}

		return false
	}

	if (document.body.clientWidth < 768) {
		if (!chartTitlesRef.value) {
			return false
		}
		console.log(
			1,
			chartTitlesRef.value.scrollWidth,
			chartTitlesRef.value.clientWidth,

			chartTitlesRef.value.offsetWidth,
		)

		return chartTitlesRef.value.scrollWidth > chartTitlesRef.value.clientWidth
	} else {
		if (!chartTitlesRef.value) {
			return false
		}

		return chartTitlesRef.value.scrollHeight > chartTitlesRef.value.clientHeight
	}
}
</script>

<template>
	<div
		ref="chartTitlesRef"
		class="min-w-[200px] text-left flex flex-col"
		:style="{
			height: `${props.heightOfChartImages}px`,
			fontSize: GlobalChartState.options.fontSize + 'px',
		}"
		:class="{
			'w-full': isMobile(),
		}"
	>
		<div
			v-for="(mediaRow, index) in GlobalChartState.chartTiles"
			:key="index"
			:id="index === 0 ? 'chartTitlesRow' : undefined"
			class="flex flex-col"
			:class="{
				'justify-center': GlobalChartState.options.constrainTitlesCentered,
			}"
			:style="{
				height:
					GlobalChartState.options.constrainTitles &&
					!GlobalChartState.options.preset
						? `${GetHeightOfImages()}px`
						: undefined,
				marginBottom: GlobalChartState.options.constrainTitles
					? `${GlobalChartState?.options.padding}rem`
					: undefined,
			}"
		>
			<template
				v-for="(mediaTile, index2) in mediaRow"
				:key="`${index}-${index2}`"
			>
				<p
					v-if="mediaTile.image !== GrayBoxImgForPlaceholderForMusic"
					class="overflow-x-clip text-ellipsis pointer-events-none whitespace-nowrap"
					:style="{
						color: GlobalChartState.options.textColor,
						textShadow: GlobalChartState.options.textShadow,
						letterSpacing: `${GlobalChartState.options.textSpacing}px`,
						fontFamily: GlobalChartState.options.font,
					}"
				>
					<template v-if="GlobalChartState.options.displayNumberRank">
						{{ getAlbumNumber(index, index2) }})
					</template>
					<template v-if="'artist' in mediaTile">
						<span
							role="textbox"
							:contenteditable="
								GlobalChartState.options.lockChart ? undefined : true
							"
							class="pointer-events-auto"
							@dragover.prevent="() => false"
							@drop.prevent="() => false"
							@blur="(event) => mediaFirstTextEdited(event, index, index2)"
						>
							{{ mediaTile.artist }}
						</span>
						-
						<span
							role="textbox"
							:contenteditable="
								GlobalChartState.options.lockChart ? undefined : true
							"
							class="pointer-events-auto"
							@dragover.prevent="() => false"
							@drop.prevent="() => false"
							@blur="(event) => mediaSecondTextEdited(event, index, index2)"
						>
							{{ mediaTile.name }}
						</span>
					</template>
					<template v-else>
						<span
							role="textbox"
							:contenteditable="
								GlobalChartState.options.lockChart ? undefined : true
							"
							class="pointer-events-auto"
							@dragover.prevent="() => false"
							@drop.prevent="() => false"
							@blur="(event) => mediaFirstTextEdited(event, index, index2)"
						>
							{{ mediaTile.title }}
						</span>
						<span
							role="textbox"
							:contenteditable="
								GlobalChartState.options.lockChart ? undefined : true
							"
							class="pointer-events-auto"
							@dragover.prevent="() => false"
							@drop.prevent="() => false"
							@blur="(event) => mediaSecondTextEdited(event, index, index2)"
						>
							({{ mediaTile.year }})
						</span>
					</template>
				</p>
				<template
					v-if="
						index === GlobalChartState.chartTiles.length - 1 &&
						index2 === mediaRow.length - 1
					"
				>
					<!-- To prevent erroneous edits to the bottom album/ artist -->
					‎
				</template>
			</template>
		</div>
	</div>
</template>
