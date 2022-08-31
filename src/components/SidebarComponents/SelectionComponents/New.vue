<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ref } from 'vue'
import { PreventNameCollision } from '#src/shared'
import { type Preset } from '#types/types'
import Dialog from '#components/CoreComponents/Dialog.vue'

const props = defineProps<{
	chartNameInput: string
	tempRename: string
	chartValidity: boolean | undefined
}>()

const emit = defineEmits<{
	(event: 'updateTempRename', value: string): void
	(event: 'newChart', type: 'Custom' | 'Preset', preset?: Preset): void
}>()

const newDialogId = 'newDialog'

const presetAdd = ref(false)
const tempRenameLocal = ref(props.chartNameInput)

function onNewChart() {
	emit('updateTempRename', PreventNameCollision(props.chartNameInput))
	const newDialog = document.getElementById(newDialogId) as HTMLDialogElement
	newDialog.showModal()
}

function newChart(type: 'Custom' | 'Preset', preset?: Preset) {
	emit('newChart', type, preset)
	presetAdd.value = false

	const newDialog = document.getElementById(newDialogId) as HTMLDialogElement
	newDialog.close()
}
</script>

<template>
	<button
		v-show="chartNameInput !== '' && props.chartValidity"
		type="button"
		class="tw-button ml-1"
		@click="onNewChart"
	>
		New
	</button>

	<!-- TODO: Move rename functionality to be inside the dialog too. -->
	<Dialog :dialog-id="newDialogId" :close-button="true">
		<p>New chart named:</p>

		<input
			ref="chartInput"
			v-model="tempRenameLocal"
			placeholder="Name of chart"
			type="text"
			class="p-2 tw-input mr-1 invalid:text-red-500"
			title="Any name but can't just be a number."
			pattern="(?!GlobalSiteOptions$).*"
		/>

		<p>Select type of new chart.</p>
		<div v-if="!presetAdd" class="flex gap-1 justify-center items-center">
			<button class="tw-button" @click="newChart('Custom')">Custom</button>

			<button class="tw-button" @click="presetAdd = true">Preset</button>
		</div>

		<div v-else class="flex gap-1 justify-center items-center">
			<button class="tw-button" @click="newChart('Preset', 'Top 42')">
				Top 42
			</button>
			<button class="tw-button" @click="newChart('Preset', 'Top 100')">
				Top 100
			</button>
		</div>
	</Dialog>
</template>
