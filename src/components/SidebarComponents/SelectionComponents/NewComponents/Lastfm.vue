<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { GlobalSiteOptions } from '#utils/globals'
import type { AlbumTile, ChartPreset, ChartType, LastfmPeriod } from '#types'
import { getTopAlbums } from '#lastfm/main'

interface CreateChartParams {
	type: ChartType
	lastfm: boolean
	preset?: ChartPreset
}

const periodOptions: LastfmPeriod[] = [
	'overall',
	'7day',
	'1month',
	'3month',
	'6month',
	'12month',
]

const emit = defineEmits<{
	updateLastfmAdd: [value: boolean]
	newChart: [
		val: {
			type: ChartType
			lastfm: boolean
			chartValues: AlbumTile[][]
			preset?: ChartPreset
		},
	]
}>()

const selectedPeriod: Ref<LastfmPeriod> = ref('7day')
const username = ref('buffet_time')
const selectedChartType: Ref<ChartType> = ref('Dynamic')
const rows = ref(3)
const columns = ref(3)

async function createChart({ type, lastfm, preset }: CreateChartParams) {
	const response = await getTopAlbums(
		selectedPeriod.value,
		preset
			? preset.rowSizes.reduce((previous, current) => previous + current, 0)
			: rows.value * columns.value,
		username.value,
	)

	if (!response) {
		console.error('Rut ro, error getting top albums :/')
		return
	}

	let returnArray: AlbumTile[][] = []

	if (preset) {
		returnArray = preset.rowSizes.map((rowSize) => response.splice(0, rowSize))
	} else if (rows.value && columns.value) {
		for (let x = 0; x < rows.value; x++) {
			returnArray.push(response.splice(0, columns.value))
		}
	}

	emit('newChart', {
		type: type,
		lastfm: lastfm,
		chartValues: returnArray,
		preset: preset,
	})
}
</script>

<template>
	<label>Last.fm Username</label>
	<input
		v-model="username"
		placeholder="last.fm/user/[THIS PART]"
		class="uno-input"
	/>

	<label>Time Range:</label>
	<select v-model="selectedPeriod" class="uno-input global-select uno-select">
		<option v-for="(value, index) in periodOptions" :key="index">
			{{ value }}
		</option>
	</select>

	<label>Chart type: </label>
	<select
		v-model="selectedChartType"
		class="uno-input global-select uno-select"
	>
		<option>Dynamic</option>
		<option>Preset</option>
	</select>

	<template v-if="selectedChartType === 'Dynamic'">
		<label>Rows: {{ rows }}</label>
		<input v-model="rows" type="range" min="1" max="10" />

		<label>Columns: {{ columns }}</label>
		<input v-model="columns" type="range" min="1" max="10" />

		<button
			class="uno-button"
			@click="
				createChart({
					lastfm: true,
					type: 'Dynamic'
				})
			"
		>
			Create Chart
		</button>
	</template>

	<div v-else class="mt-2 flex justify-center gap-1 max-w-[350px] flex-wrap">
		<button
			v-for="(preset, index) in GlobalSiteOptions.presets"
			:key="`preset-${index}`"
			class="uno-button"
			@click="createChart({ lastfm: true, type: 'Preset', preset })"
		>
			{{ preset.presetName }}
		</button>
	</div>

	<button
		class="uno-button uno-close-button"
		@click="emit('updateLastfmAdd', false)"
	>
		<img src="/back.svg" width="25" height="25" loading="lazy" />
	</button>
</template>
