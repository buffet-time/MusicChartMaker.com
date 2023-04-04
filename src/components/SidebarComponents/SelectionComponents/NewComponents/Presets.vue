<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ref } from 'vue'
import { GlobalSiteOptions } from '#shared/globals'
import type { ChartPreset, ChartType } from '#types'

defineProps<{
	createPreset: boolean
	editPresets: boolean
}>()

const emit = defineEmits<{
	(event: 'updateCreatePreset', value: boolean): void
	(event: 'updateEditPresets', value: boolean): void
	(event: 'updatePresetAdd', value: boolean): void
	(event: 'newChart', val: { type: ChartType; preset: ChartPreset }): void
}>()

const newPresetName = ref<string>()
const newPresetList = ref<string>()

function closeCreatePreset() {
	emit('updateCreatePreset', false)
	newPresetName.value = undefined
	newPresetList.value = undefined
}

// Make sure that this is not called unless its a valid number seperated list
function newPreset() {
	const massagedPresetList = newPresetList.value!.split(',').map(Number)

	GlobalSiteOptions.value.presets?.push({
		default: false,
		rowSizes: massagedPresetList,
		presetName: newPresetName.value
	})
	closeCreatePreset()
}

function deletePreset(preset: ChartPreset, index: number) {
	if (window.confirm(`Delete preset "${preset.presetName}"?`)) {
		GlobalSiteOptions.value.presets?.splice(index, 1)
	}
}
</script>

<template>
	<template v-if="!createPreset && !editPresets">
		<div class="tw-flex-center gap-1">
			<button
				v-for="(preset, index) in GlobalSiteOptions.presets"
				:key="`preset-${index}`"
				class="tw-button"
				@click="emit('newChart', { type: 'Preset', preset: preset })"
			>
				{{ preset.presetName }}
			</button>
		</div>

		<div class="mt-2 flex gap-1">
			<button class="tw-button" @click="emit('updateCreatePreset', true)">
				New preset
			</button>
			<button
				v-if="GlobalSiteOptions.presets?.some((preset) => !preset.default)"
				class="tw-button"
				@click="emit('updateEditPresets', true)"
			>
				Edit presets
			</button>
		</div>
		<button
			class="tw-button tw-close-button"
			@click="emit('updatePresetAdd', false)"
		>
			<img src="/back.svg" width="25" height="25" />
		</button>
	</template>

	<template v-if="createPreset">
		<h1 class="text-lg text-green-400">Create a new preset</h1>

		<ol class="mx-4 list-decimal text-left">
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

		<input v-model="newPresetName" class="tw-input" placeholder="Preset Name" />
		<input
			v-model="newPresetList"
			class="tw-input"
			placeholder="New preset input"
		/>

		<div class="flex gap-1">
			<button class="tw-button" @click="newPreset">Create preset</button>
			<button class="tw-button tw-close-button" @click="closeCreatePreset">
				<img src="/back.svg" width="25" height="25" />
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
			@click="emit('updateEditPresets', false)"
		>
			<img src="/back.svg" width="25" height="25" />
		</button>
	</template>
</template>
