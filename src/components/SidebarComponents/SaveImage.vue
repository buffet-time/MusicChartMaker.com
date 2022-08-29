<script setup lang="ts">
import {
	ClickOutsideDialog,
	DynamicImportDialogPolyfill
} from '#root/src/wrappers'
import { GlobalChartState } from '#src/shared'
import { onMounted, ref } from 'vue'

const saveImageModal = ref<HTMLDialogElement>()
const emptyCanvas = document.createElement('canvas')
const validFormats = ref<string[]>()
const selectedFormat = ref('png')
const renderImageSelect = ref(false)

function getValidFormats() {
	const imageTypes = ['png', 'jpeg', 'webp', 'bmp', 'ico', 'gif']
	return imageTypes.filter((imageType, index) => {
		// PNG has to be supported by spec.
		if (index === 0) return true

		const returnedUrl = emptyCanvas.toDataURL(`image/${imageType}`)

		if (returnedUrl.slice(11, 11 + imageType.length) === imageType) {
			return true
		}

		return false
	})
}

async function saveImage() {
	try {
		const { default: HTML2Canvas } = await import('html2canvas')
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const canvas = await HTML2Canvas(document.getElementById('Chart')!, {
			allowTaint: true,
			useCORS: true,
			backgroundColor: '#303030'
		})
		const anchor = document.createElement('a')
		anchor.href = canvas.toDataURL(`image/${selectedFormat.value}`)
		anchor.download = `${GlobalChartState.value?.options.chartTitle}.${selectedFormat.value}`
		anchor.click()
	} catch (error) {
		console.error(`Error in Save Image: ${Error}`)
	}
}

onMounted(() => {
	if (!saveImageModal.value) {
		return console.error('Site info modal doesnt exist', saveImageModal.value)
	}

	validFormats.value = getValidFormats()
	renderImageSelect.value = true
	DynamicImportDialogPolyfill([saveImageModal.value])
	ClickOutsideDialog(saveImageModal.value)
})
</script>

<template>
	<button
		class="mb-3 mt-1 tw-button py-1 px-3"
		@click="saveImageModal?.showModal()"
	>
		Save Image
	</button>

	<dialog
		ref="saveImageModal"
		class="bg-transparent"
		@keypress.esc="saveImageModal?.close()"
	>
		<div
			class="bg-neutral-700 p-5 flex flex-col gap-2 justify-center items-center text-white"
		>
			Save chart as image

			<select
				v-if="renderImageSelect"
				v-model="selectedFormat"
				class="tw-input"
			>
				<option v-for="(imageType, index) in validFormats" :key="index">
					{{ imageType }}
				</option>
			</select>

			<button class="tw-button py-1 px-3 mb-1" @click="saveImage">
				Save Image
			</button>

			<button class="tw-button" @click="saveImageModal?.close()">Close</button>
		</div>
	</dialog>
</template>
