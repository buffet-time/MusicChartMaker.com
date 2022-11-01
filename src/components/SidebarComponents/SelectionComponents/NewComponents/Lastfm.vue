<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { GlobalSiteOptions } from '#shared/globals'
// import { ProperFetch } from '#shared/misc'

import Back from '#assets/back.svg'
import type { AlbumTile, ChartPreset, ChartType, LastfmPeriod } from '#types'
import { ProperFetch } from '#shared/misc'

const periodOptions: LastfmPeriod[] = [
	'overall',
	'7day',
	'1month',
	'3month',
	'6month',
	'12month'
]

const emit = defineEmits<{
	(event: 'updateLastfmAdd', value: boolean): void
	(
		event: 'newChart',
		val: {
			type: ChartType
			lastfm: boolean
			chartValues: AlbumTile[][]
			preset?: ChartPreset
		}
	): void
}>()

const selectedPeriod: Ref<LastfmPeriod> = ref('7day')
const username = ref('buffet_time')
const selectedChartType: Ref<ChartType> = ref('Dynamic')
const rows = ref(3)
const columns = ref(3)

async function createChart(val: {
	type: ChartType
	lastfm: boolean
	preset?: ChartPreset
	rows?: number
	columns?: number
}) {
	// `https://api.musicchartmaker.com/TopAlbums?user=buffet_time&period=3month&limit=30`

	const response: AlbumTile[] = await ProperFetch(
		`https://api.musicchartmaker.com/TopAlbums?user=${username.value}&period=${
			selectedPeriod.value
		}&limit=${
			val.preset
				? val.preset.rowSizes.reduce(
						(previous, current) => previous + current,
						0
				  )
				: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				  val.rows! * val.columns!
		}`
	)

	let returnArray: AlbumTile[][] = []

	if (val.preset) {
		returnArray = val.preset.rowSizes.map((rowSize) =>
			response.splice(0, rowSize)
		)
	} else if (rows.value && columns.value) {
		for (let x = 0; x < rows.value; x++) {
			returnArray.push(response.splice(0, columns.value))
		}
	}

	emit('newChart', {
		type: val.type,
		lastfm: val.lastfm,
		chartValues: returnArray,
		preset: val.preset
	})
}
</script>

<template>
	<label>Last.fm Username</label>
	<input
		v-model="username"
		placeholder="last.fm/user/[THIS PART]"
		class="tw-input"
	/>

	<label>Time Range:</label>
	<select v-model="selectedPeriod" class="tw-input">
		<option v-for="(value, index) in periodOptions" :key="index">
			{{ value }}
		</option>
	</select>

	<label>Chart type: </label>
	<select v-model="selectedChartType" class="tw-input">
		<option>Dynamic</option>
		<option>Preset</option>
	</select>

	<template v-if="selectedChartType === 'Dynamic'">
		<label>Rows: {{ rows }}</label>
		<input v-model="rows" type="range" min="1" max="10" />

		<label>Columns: {{ columns }}</label>
		<input v-model="columns" type="range" min="1" max="10" />

		<button
			class="tw-button"
			@click="
				createChart({
					lastfm: true,
					type: 'Dynamic',
					rows: rows,
					columns: columns
				})
			"
		>
			Create Chart
		</button>
	</template>

	<div v-else class="flex gap-1 mt-2 max-w-[350px] flex-wrap justify-center">
		<button
			v-for="(preset, index) in GlobalSiteOptions.presets"
			:key="`preset-${index}`"
			class="tw-button"
			@click="createChart({ lastfm: true, type: 'Preset', preset })"
		>
			{{ preset.presetName }}
		</button>
	</div>

	<button
		class="tw-button tw-close-button"
		@click="emit('updateLastfmAdd', false)"
	>
		<img :src="Back" width="25" height="25" />
	</button>
</template>
