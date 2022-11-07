<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { onMounted, ref } from 'vue'
import type { AlbumTile, ChartPreset, ChartState, ChartType } from '#types'
import {
	GenerateChartWithValues,
	GenerateDefaultChart,
	GeneratePresetChart,
	PreventNameCollision,
	top100,
	top42
} from '#shared/chart'
import {
	GlobalChartState,
	GlobalSiteOptions,
	StoredChartNames
} from '#shared/globals'
import {
	setCurrentChart,
	setStoredChart,
	SiteOptionsKey
} from '#shared/storage'

import Dialog from '#core/Dialog.vue'
import Presets from './NewComponents/Presets.vue'
import Lastfm from './NewComponents/Lastfm.vue'

interface NewChartParams {
	type: ChartType
	lastfm?: boolean
	chartValues?: AlbumTile[][]
	preset?: ChartPreset
}

const props = defineProps<{
	selectedChartTitle: string
	selectedChart: ChartState
}>()

const emit = defineEmits<{
	(event: 'updateSelectedChartTitle', value: string): void
}>()

const newDialogId = 'newDialog'

const presetAdd = ref(false)
const chartNameInput = ref(props.selectedChartTitle)
const chartInput = ref<HTMLInputElement>()
const createPreset = ref(false)
const editPresets = ref(false)
const lastfmAdd = ref(false)

function onNewChart() {
	presetAdd.value = false
	createPreset.value = false
	lastfmAdd.value = false
	chartNameInput.value = PreventNameCollision(props.selectedChartTitle)
	const newDialog = document.getElementById(newDialogId) as HTMLDialogElement
	newDialog.showModal()
}

function newChart({ type, lastfm, chartValues, preset }: NewChartParams) {
	console.log(1, chartNameInput.value)
	StoredChartNames.value.unshift(chartNameInput.value)

	let tempChart: ChartState

	switch (type) {
		case 'Dynamic':
			tempChart = lastfm
				? GenerateChartWithValues(chartNameInput.value, chartValues!)
				: GenerateDefaultChart(chartNameInput.value)

			break

		case 'Preset':
			tempChart = lastfm
				? GenerateChartWithValues(chartNameInput.value, chartValues!, preset)
				: GeneratePresetChart(chartNameInput.value, preset!)
			break

		default:
			return console.error('Incorrect addChart() invocation: ', type, preset)
	}

	console.log(10, tempChart)

	emit('updateSelectedChartTitle', chartNameInput.value)
	setCurrentChart(chartNameInput.value)
	// update this to be passed values
	saveCurrentChart()
	GlobalChartState.value = tempChart

	const newDialog = document.getElementById(newDialogId) as HTMLDialogElement
	newDialog.close()
}

function saveCurrentChart() {
	if (props.selectedChartTitle && props.selectedChart) {
		return setStoredChart(props.selectedChartTitle, props.selectedChart!)
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
	<button type="button" class="tw-button ml-1" @click="onNewChart">New</button>

	<!-- TODO: Move rename functionality to be inside the dialog too. -->
	<Dialog :dialog-id="newDialogId" :close-button="true">
		<template #content>
			<p>New chart named:</p>

			<input
				ref="chartInput"
				v-model="chartNameInput"
				placeholder="Name of chart"
				type="text"
				class="tw-input"
				title="Any name but can't just be a number."
				pattern="(?!GlobalSiteOptions$).*"
			/>
			<p
				v-if="chartNameInput === '' || !chartInput?.validity.valid"
				class="pt-1"
			>
				The name must not be empty or {{ SiteOptionsKey }}
			</p>

			<template v-else>
				<p v-show="!createPreset && !editPresets && !lastfmAdd">
					Select the preset for the new chart.
				</p>
				<div v-if="!presetAdd && !lastfmAdd" class="tw-flex-center gap-1">
					<button class="tw-button" @click="newChart({ type: 'Dynamic' })">
						Dynamic
					</button>

					<button class="tw-button" @click="presetAdd = true">Preset</button>

					<button class="tw-button" @click="lastfmAdd = true">Last.fm</button>
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
