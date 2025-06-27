<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import type { AlbumTile, ChartPreset, ChartState, ChartType } from '#types'
import {
	GenerateChartWithValues,
	GenerateDefaultChart,
	GeneratePresetChart,
	PreventNameCollision,
	top100,
	top42,
} from '#utils/chart'
import {
	GlobalChartState,
	GlobalSiteOptions,
	StoredChartNames,
} from '#utils/globals'
import { setCurrentChart, setStoredChart, SiteOptionsKey } from '#utils/storage'

import Dialog from '#core/Dialog.vue'
import Presets from './NewComponents/Presets.vue'
import Lastfm from './NewComponents/Lastfm.vue'

interface NewChartParams {
	type: ChartType
	lastfm?: boolean
	chartValues?: AlbumTile[][]
	preset?: ChartPreset
}

const { selectedChartTitle, selectedChart } = defineProps<{
	selectedChartTitle: string
	selectedChart: ChartState
}>()

const emit = defineEmits<{
	updateSelectedChartTitle: [value: string]
}>()

const newDialogId = 'newDialog'

const presetAdd = ref(false)
const chartNameInput = ref(selectedChartTitle)
const chartInput = useTemplateRef<HTMLInputElement>('chartInput')
const createPreset = ref(false)
const editPresets = ref(false)
const lastfmAdd = ref(false)

function onNewChart() {
	presetAdd.value = false
	createPreset.value = false
	lastfmAdd.value = false
	chartNameInput.value = PreventNameCollision(selectedChartTitle)
	const newDialog = document.getElementById(newDialogId) as HTMLDialogElement
	newDialog.showModal()
}

function newChart({ type, lastfm, chartValues, preset }: NewChartParams) {
	const nameToSave = PreventNameCollision(chartNameInput.value)
	StoredChartNames.value.unshift(nameToSave)

	let tempChart: ChartState

	switch (type) {
		case 'Dynamic':
			tempChart = lastfm
				? // biome-ignore lint/style/noNonNullAssertion: <explanation>
					GenerateChartWithValues(nameToSave, chartValues!)
				: GenerateDefaultChart(nameToSave)

			break

		case 'Preset':
			tempChart = lastfm
				? // biome-ignore lint/style/noNonNullAssertion: <explanation>
					GenerateChartWithValues(nameToSave, chartValues!, preset)
				: // biome-ignore lint/style/noNonNullAssertion: <explanation>
					GeneratePresetChart(nameToSave, preset!)
			break

		default:
			return console.error('Incorrect addChart() invocation: ', type, preset)
	}

	emit('updateSelectedChartTitle', nameToSave)
	setCurrentChart(nameToSave)
	saveCurrentChart()
	GlobalChartState.value = tempChart

	const newDialog = document.getElementById(newDialogId) as HTMLDialogElement
	newDialog.close()
}

function saveCurrentChart() {
	if (selectedChartTitle && selectedChart) {
		return setStoredChart(selectedChartTitle, selectedChart)
	}
	throw new Error('Error: Cannot save current Chart!')
}

onMounted(() => {
	if (!GlobalSiteOptions.value.presets) {
		GlobalSiteOptions.value.presets = [top42, top100]
	}
})
</script>

<template>
	<button type="button" class="uno-button" @click="onNewChart">New</button>

	<Dialog :dialog-id="newDialogId" :close-button="true">
		<template #content>
			<p>New chart named:</p>

			<input
				ref="chartInput"
				v-model="chartNameInput"
				placeholder="Name of chart"
				type="text"
				class="uno-input"
				title="Any name but can't just be a number."
				pattern="(?!GlobalSiteOptions$).*"
			/>
			<p
				v-if="chartNameInput === '' || !chartInput?.validity.valid"
				class="pt-1"
			>
				The name must not be empty, session or {{ SiteOptionsKey }}
			</p>

			<template v-else>
				<p v-show="!createPreset && !editPresets && !lastfmAdd">
					Select the preset for the new chart.
				</p>
				<div v-if="!presetAdd && !lastfmAdd" class="uno-flex-center gap-1">
					<button class="uno-button" @click="newChart({ type: 'Dynamic' })">
						Dynamic
					</button>

					<button class="uno-button" @click="presetAdd = true">Preset</button>

					<button class="uno-button" @click="lastfmAdd = true">Last.fm</button>
				</div>

				<template v-if="presetAdd">
					<Presets
						:create-preset="createPreset"
						:edit-presets="editPresets"
						@update-create-preset="(value) => (createPreset = value)"
						@update-edit-presets="(value) => (editPresets = value)"
						@update-preset-add="(value) => (presetAdd = value)"
						@new-chart="newChart"
					/>
				</template>

				<template v-if="lastfmAdd">
					<Lastfm
						@update-lastfm-add="(value) => (lastfmAdd = value)"
						@new-chart="newChart"
					/>
				</template>
			</template>
		</template>
	</Dialog>
</template>
