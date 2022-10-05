<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ref } from 'vue'
import type { ChartState, Preset } from '#types'
import {
	GenerateDefaultChart,
	GeneratePresetChart,
	PreventNameCollision
} from '#shared/chart'
import { GlobalChartState, StoredChartNames } from '#shared/globals'
import {
	setCurrentChart,
	setStoredChart,
	SiteOptionsKey
} from '#shared/storage'

import Dialog from '#core/Dialog.vue'

const props = defineProps<{
	selectedChartTitle: string
	selectedChart: ChartState
}>()

const emit = defineEmits<{
	(event: 'updateSelectedChartTitle', value: string): void
}>()

const newDialogId = 'newDialog'

const presetAdd = ref<boolean>(false)
const chartNameInput = ref(props.selectedChartTitle)
const chartInput = ref<HTMLInputElement>()

function onNewChart() {
	presetAdd.value = false
	chartNameInput.value = PreventNameCollision(props.selectedChartTitle)
	const newDialog = document.getElementById(newDialogId) as HTMLDialogElement
	newDialog.showModal()
}

function newChart(type: 'Custom' | 'Preset', preset?: Preset) {
	StoredChartNames.value.unshift(chartNameInput.value)

	let tempChart: ChartState

	if (type === 'Custom') {
		tempChart = GenerateDefaultChart(chartNameInput.value)
	} else if (type === 'Preset' && preset) {
		tempChart = GeneratePresetChart(chartNameInput.value, preset)
	} else {
		return console.error('Incorrect addChart() invocation: ', type, preset)
	}

	emit('updateSelectedChartTitle', chartNameInput.value)
	setCurrentChart(chartNameInput.value)
	saveCurrentChart()
	Object.assign(GlobalChartState, tempChart)

	const newDialog = document.getElementById(newDialogId) as HTMLDialogElement
	newDialog.close()
}

function saveCurrentChart() {
	if (props.selectedChartTitle && props.selectedChart) {
		return setStoredChart(props.selectedChartTitle, props.selectedChart!)
	}
	throw new Error('Error: Cannot save current Chart!')
}
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
				<p>Select type of new chart.</p>
				<div v-if="!presetAdd" class="tw-flex-center gap-1">
					<button class="tw-button" @click="newChart('Custom')">Custom</button>

					<button class="tw-button" @click="presetAdd = true">Preset</button>
				</div>

				<div v-else class="tw-flex-center gap-1">
					<button class="tw-button" @click="newChart('Preset', 'Top 42')">
						Top 42
					</button>
					<button class="tw-button" @click="newChart('Preset', 'Top 100')">
						Top 100
					</button>
				</div>
			</template>
		</template>
	</Dialog>
</template>
