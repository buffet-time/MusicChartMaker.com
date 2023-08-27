<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { GlobalChartState } from '#shared/globals'

import Dialog from '#core/Dialog.vue'

const saveImageId = 'saveImage'

const emptyCanvas = document.createElement('canvas')
const validFormats = ref<string[]>()
const selectedFormat = ref('png')
const renderImageSelect = ref(false)

function openSaveImage() {
	const saveimage = document.getElementById(saveImageId) as HTMLDialogElement
	saveimage.showModal()
}

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
		const chartElement = document.getElementById('Chart')

		if (!chartElement) {
			return console.error('error in saveImage(): ', chartElement)
		}

		const canvas = await HTML2Canvas(chartElement, {
			allowTaint: true,
			useCORS: true,
			backgroundColor: GlobalChartState.value.options.background
		})
		const anchor = document.createElement('a')
		anchor.href = canvas.toDataURL(`image/${selectedFormat.value}`)
		anchor.download = `${GlobalChartState.value.options.chartTitle}.${selectedFormat.value}`
		anchor.click()
	} catch (error: any) {
		console.error(`Error in Save Image: ${error}`)
	}
}

onMounted(() => {
	validFormats.value = getValidFormats()
	renderImageSelect.value = true
})
</script>

<template>
	<div>
		<button class="tw-button" @click="openSaveImage()">Save Image</button>

		<Dialog :dialog-id="saveImageId" :close-button="true">
			<template #content>
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

				<button class="tw-button mb-1 px-3 py-1" @click="saveImage">
					Save Image
				</button>
			</template>
		</Dialog>
	</div>
</template>
