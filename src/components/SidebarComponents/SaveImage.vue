<script setup lang="ts">
import { type Ref, onMounted, ref } from 'vue'
import { GlobalChartState } from '#shared/globals'

import Dialog from '#core/Dialog.vue'

const saveImageId = 'saveImage'

const emptyCanvas = document.createElement('canvas')
const validFormats = ref<string[]>()
const selectedFormat: Ref<ImageTypes> = ref('png')
const renderImageSelect = ref(false)

type ImageTypes = 'png' | 'jpeg' | 'webp' | 'bmp' | 'ico' | 'gif'

function openSaveImage() {
	const saveimage = document.getElementById(saveImageId) as HTMLDialogElement
	saveimage.showModal()
}

function getValidFormats() {
	const imageTypes: ImageTypes[] = ['png', 'jpeg', 'webp', 'bmp', 'ico', 'gif']
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

		let formatToSaveAs: string = selectedFormat.value
		if (formatToSaveAs === 'jpeg') {
			formatToSaveAs = 'jpg'
		}

		anchor.href = canvas.toDataURL(`image/${formatToSaveAs}`)
		anchor.download = `${GlobalChartState.value.options.chartTitle}.${formatToSaveAs}`
		anchor.click()
		anchor.remove()
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
	<div class="tw-flex-center gap-2">
		<button
			class="tw-button flex w-10/12 items-center gap-2"
			@click="openSaveImage()"
		>
			<img
				title="Download icon"
				alt="Download icon"
				src="/download.svg"
				width="25"
				height="25"
				class="cursor-pointer bg-neutral-500"
				loading="lazy"
			/>
			<label class="cursor-pointer pb-[2px]"> Save Image </label>
		</button>

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
