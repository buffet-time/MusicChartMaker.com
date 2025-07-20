<script setup lang="ts">
import { type Ref, onMounted, ref } from 'vue'
import { GlobalChartState } from '#utils/globals'

import Dialog from '#core/Dialog.vue'
import Tooltip from '#core/Tooltip.vue'
import SidebarButton from '#core/SidebarButton.vue'

const saveImageId = 'saveImage'

const emptyCanvas = document.createElement('canvas')
const validFormats = ref<string[]>()
const selectedFormat: Ref<ImageTypes> = ref('png')
const renderImageSelect = ref(false)
const scale = ref(2)
const renderImagePrep = ref(false)
const renderImageSuccess = ref(false)
const renderImageError = ref(false)

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
	renderImagePrep.value = true
	renderImageError.value = false
	renderImageSuccess.value = false

	try {
		const { default: HTML2Canvas } = await import('html2canvas')
		const chartElement = GlobalChartState.value.options.displayTitles
			? document.getElementById('Chart')
			: document.getElementById('chartImages')

		if (!chartElement) {
			return console.error('error in saveImage(): ', chartElement)
		}

		const canvas = await HTML2Canvas(chartElement, {
			// scale 1 = 96 dpi, each increment is a multiplier on that
			scale: scale.value,
			allowTaint: true,
			useCORS: true,
			backgroundColor: GlobalChartState.value.options.background,
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

		renderImagePrep.value = false
		renderImageSuccess.value = true
	} catch (error: any) {
		console.error(`Error in Save Image: ${error}`)

		renderImagePrep.value = false
		renderImageError.value = true
	}
}

onMounted(() => {
	validFormats.value = getValidFormats()
	renderImageSelect.value = true
})
</script>

<template>
	<div class="uno-flex-center gap-2">
		<SidebarButton
			:button-icon="'Download'"
			:button-text="'Save Image'"
			@click-handler="openSaveImage()"
		/>

		<Dialog :dialog-id="saveImageId" :close-button="true">
			<template #content>
				<div class="flex flex-col gap-3 items-center p-4 py-0">
					<h2 class="mt-0 mb-1">Save chart as image</h2>
					<p>Includes Titles, if shown.</p>

					<div class="flex flex-col">
						<Tooltip
							:tooltip-name="'tooltip-render-quality'"
							:offset="[0, 0]"
							:delay="300"
							:placement="'bottom'"
						>
							<template #content>
								<label>Render Quality: {{ scale }}</label>
							</template>
							<template #tooltip>
								Each quality tick is 96dpi, the higher the value the larger the
								image is rendered (better quality)
							</template>
						</Tooltip>

						<input
							v-model="scale"
							class="cursor-pointer mt-1"
							type="range"
							min="1"
							max="5"
							step="1"
						/>
					</div>

					<div>
						<p class="pb-2">Image type</p>
						<select
							v-if="renderImageSelect"
							v-model="selectedFormat"
							class="uno-input global-select uno-select"
						>
							<option v-for="(imageType, index) in validFormats" :key="index">
								{{ imageType }}
							</option>
						</select>
					</div>

					<button class="uno-button mb-1" @click="saveImage">Save Image</button>

					<div v-if="renderImagePrep">
						<p>Image is being prepared to be saved!</p>
					</div>

					<div v-if="renderImageSuccess">
						<p>
							Image successfully generated, download should start automatically.
						</p>
					</div>

					<div v-if="renderImageError">
						<p>Image failed to be generated :(</p>
					</div>
				</div>
			</template>
		</Dialog>
	</div>
</template>
