<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { onMounted, ref } from 'vue'
import type { ChartPreset, ChartState } from '#types'
import {
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

import Back from '#assets/back.svg'
import Dialog from '#core/Dialog.vue'

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
const newPresetName = ref<string>()
const newPresetList = ref<string>()
const editPresets = ref(false)

function onNewChart() {
	presetAdd.value = false
	createPreset.value = false
	chartNameInput.value = PreventNameCollision(props.selectedChartTitle)
	const newDialog = document.getElementById(newDialogId) as HTMLDialogElement
	newDialog.showModal()
}

function newChart(type: 'Dynamic' | 'Preset', preset?: ChartPreset) {
	StoredChartNames.value.unshift(chartNameInput.value)

	let tempChart: ChartState

	switch (type) {
		case 'Dynamic':
			tempChart = GenerateDefaultChart(chartNameInput.value)
			break

		case 'Preset':
			tempChart = GeneratePresetChart(chartNameInput.value, preset!)
			break

		default:
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

function closeCreatePreset() {
	createPreset.value = false
	newPresetName.value = undefined
	newPresetList.value = undefined
}

// Make sure that this is not called unless its a valid number seperated list
function newPreset() {
	const massagedPresetList = newPresetList.value!.split(',').map(Number)

	GlobalSiteOptions.presets?.push({
		default: false,
		rowSizes: massagedPresetList,
		presetName: newPresetName.value
	})
	closeCreatePreset()
}

function deletePreset(preset: ChartPreset, index: number) {
	if (window.confirm(`Delete preset '${preset.presetName}'?'`)) {
		GlobalSiteOptions.presets?.splice(index, 1)
	}
}

onMounted(() => {
	if (!GlobalSiteOptions.presets) {
		GlobalSiteOptions.presets = [top42, top100]
	}
})
</script>

<!-- TODO:  -->
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
				<p v-show="!createPreset && !editPresets">
					Select the preset for the new chart.
				</p>
				<div v-if="!presetAdd" class="tw-flex-center gap-1">
					<button class="tw-button" @click="newChart('Dynamic')">
						Dynamic
					</button>

					<button class="tw-button" @click="presetAdd = true">Preset</button>
				</div>

				<template v-else>
					<template v-if="!createPreset && !editPresets">
						<div class="tw-flex-center gap-1">
							<button
								v-for="(preset, index) in GlobalSiteOptions.presets"
								:key="`preset-${index}`"
								class="tw-button"
								@click="newChart('Preset', preset)"
							>
								{{ preset.presetName }}
							</button>
						</div>

						<div class="flex gap-1 mt-2">
							<button class="tw-button" @click="createPreset = true">
								New preset
							</button>
							<button
								v-if="
									GlobalSiteOptions.presets?.some((preset) => !preset.default)
								"
								class="tw-button"
								@click="editPresets = true"
							>
								Edit presets
							</button>
						</div>
						<button
							class="tw-button tw-close-button"
							@click="presetAdd = false"
						>
							<img :src="Back" width="25" height="25" />
						</button>
					</template>

					<template v-if="createPreset">
						<h1 class="text-lg text-green-400">Create a new preset</h1>

						<ol class="mx-4 text-left list-decimal">
							<li>The input should be a list of numbers</li>
							<li>Seperate numbers by commas</li>
							<li>You can't include a 0 in the list</li>
							<li>These can be really weird, go for it</li>
						</ol>

						<div class="flex gap-1">
							<p class="text-green-400">Example 1 -</p>
							5, 5, 6, 6, 10, 10
						</div>
						<div class="flex gap-1">
							<p class="text-green-400">Example 2 -</p>
							15,3,8,5
						</div>

						<input
							v-model="newPresetName"
							class="tw-input"
							placeholder="Preset Name"
						/>
						<input
							v-model="newPresetList"
							class="tw-input"
							placeholder="New preset input"
						/>

						<div class="flex gap-1">
							<button class="tw-button" @click="newPreset">
								Create preset
							</button>
							<button
								class="tw-button tw-close-button"
								@click="closeCreatePreset"
							>
								<img :src="Back" width="25" height="25" />
							</button>
						</div>
					</template>

					<template v-if="editPresets">
						Edit preset name or delete
						<template
							v-for="(preset, index) in GlobalSiteOptions.presets"
							:key="`edit-preset-${index}`"
						>
							<div v-if="!preset.default" class="flex gap-2">
								<input
									v-model="GlobalSiteOptions.presets![index].presetName"
									class="tw-input"
								/>
								<button class="tw-button" @click="deletePreset(preset, index)">
									Delete
								</button>
							</div>
						</template>

						<button
							class="tw-button tw-close-button"
							@click="editPresets = false"
						>
							<img :src="Back" width="25" height="25" />
						</button>
					</template>
				</template>
			</template>
		</template>
	</Dialog>
</template>
