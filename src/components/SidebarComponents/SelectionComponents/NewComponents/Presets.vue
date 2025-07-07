<script setup lang="ts">
import { ref } from 'vue'
import { GlobalSiteOptions } from '#utils/globals'
import type { ChartPreset, ChartType } from '#types'
import BackButton from '#core/BackButton.vue'

defineProps<{
	createPreset: boolean
	editPresets: boolean
}>()

const emit = defineEmits<{
	updateCreatePreset: [value: boolean]
	updateEditPresets: [value: boolean]
	updatePresetAdd: [value: boolean]
	newChart: [val: { type: ChartType; preset: ChartPreset }]
}>()

const newPresetName = ref('')
const newPresetList = ref('')

const presetRegex = /^[0-9 ]+(,[0-9 ]+)*$/

function closeCreatePreset() {
	emit('updateCreatePreset', false)
	newPresetName.value = ''
	newPresetList.value = ''
}

// Make sure that this is not called unless its a valid number seperated list
function newPreset() {
	const massagedPresetList = newPresetList.value.split(',').map(Number)

	GlobalSiteOptions.value.presets?.push({
		default: false,
		rowSizes: massagedPresetList,
		presetName: newPresetName.value,
	})
	closeCreatePreset()
}

function deletePreset(preset: ChartPreset, index: number) {
	if (window.confirm(`Delete preset "${preset.presetName}"?`)) {
		GlobalSiteOptions.value.presets?.splice(index, 1)
	}
}

function isPresetInputInvalid() {
	return presetRegex.exec(newPresetList.value) === null
}
</script>

<template>
	<template v-if="!createPreset && !editPresets">
		<div class="uno-flex-center gap-1">
			<button
				v-for="(preset, index) in GlobalSiteOptions.presets"
				:key="`preset-${index}`"
				class="uno-button"
				@click="emit('newChart', { type: 'Preset', preset: preset })"
			>
				{{ preset.presetName }}
			</button>
		</div>

		<div class="mt-2 flex gap-1">
			<button class="uno-button" @click="emit('updateCreatePreset', true)">
				New preset
			</button>
			<button
				v-if="GlobalSiteOptions.presets?.some((preset) => !preset.default)"
				class="uno-button"
				@click="emit('updateEditPresets', true)"
			>
				Edit presets
			</button>
		</div>

		<BackButton
			:origin="'Modal'"
			@click-handler="emit('updatePresetAdd', false)"
		/>
	</template>

	<template v-if="createPreset">
		<h1 class="m-0 text-lg text-green-400">Create a new preset</h1>

		<ol class="m-0 text-left list-decimal">
			<li>The input should be a list of numbers</li>
			<li>Seperate numbers by commas</li>
			<li>You can't include a 0 in the list</li>
			<li>These can be really weird, go for it</li>
		</ol>

		<div class="m-0 flex gap-1">
			<p class="text-green-400 m-0">Example 1 -</p>
			5, 5, 6, 6, 10, 10
		</div>
		<div class="m-0 flex gap-1 mb-2">
			<p class="text-green-400 m-0">Example 2 -</p>
			15,3,8,5
		</div>

		<input
			v-model="newPresetName"
			class="uno-input"
			placeholder="Preset Name"
		/>
		<input
			v-model="newPresetList"
			class="uno-input"
			placeholder="New preset input"
		/>

		<div class="flex gap-1">
			<button
				:disabled="
					newPresetName?.length === 0 ||
					newPresetList?.length === 0 ||
					isPresetInputInvalid()
				"
				class="uno-button"
				@click="newPreset"
			>
				Create preset
			</button>

			<BackButton :origin="'Modal'" @click-handler="closeCreatePreset" />
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
					class="uno-input"
				/>
				<button class="uno-button" @click="deletePreset(preset, index)">
					Delete
				</button>
			</div>
		</template>

		<BackButton
			:origin="'Modal'"
			@click-handler="emit('updateEditPresets', false)"
		/>
	</template>
</template>
