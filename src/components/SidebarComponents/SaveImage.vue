<script setup lang="ts">
import { GlobalChartState } from '#src/shared'
import { onMounted, ref } from 'vue'
import Dialog from '#core/Dialog.vue'

const saveImageId = 'saveImage'

const emptyCanvas = document.createElement('canvas')
const validFormats = ref<string[]>()
const selectedFormat = ref('png')
const renderImageSelect = ref(false)

function openSaveImage() {
	// prettier-ignore
	(document.getElementById(saveImageId) as HTMLDialogElement).showModal()
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
	validFormats.value = getValidFormats()
	renderImageSelect.value = true
})
</script>

<template>
	<div>
		<button class="tw-button py-1 px-3" @click="openSaveImage()">
			Save Image
		</button>

		<Dialog :dialog-id="saveImageId" :close-button="true">
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
		</Dialog>
	</div>
</template>
