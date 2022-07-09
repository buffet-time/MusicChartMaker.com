<script setup lang="ts">
import Search from './SidebarComponents/Search.vue'
import Options from './SidebarComponents/Options.vue'
import Selection from './SidebarComponents/Selection.vue'
import SiteInfo from './SiteInfo.vue'
import { ref } from 'vue'
import {
	GlobalChartState,
	ImportChartsAndOptions,
	ExportChartsAndOptions
} from '#src/shared'

const emit = defineEmits<{
	(event: 'canRenderChart'): void
}>()

const showOptions = ref(false)
const filePicker = ref<HTMLInputElement>()

function onCanRender() {
	emit('canRenderChart')
	showOptions.value = true
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
		anchor.href = canvas.toDataURL('image/png')
		anchor.download = `${GlobalChartState.value.options.chartTitle}.png`
		anchor.click()
	} catch (error) {
		console.error(`Error in Save Image: ${Error}`)
	}
}

function importFromJson() {
	if (!filePicker.value) {
		console.error('Error! Could not import file.')
		return
	}
	const input = filePicker.value.files
	if (input) {
		ImportChartsAndOptions(input.item(0))
	}
}
</script>

<template>
	<div class="flex-col tw-sidebar-width fixed bg-[#303030] h-full">
		<SiteInfo />
		<Selection @can-render-chart="onCanRender" />
		<button class="mb-3 tw-button py-1 px-3" @click="saveImage">
			Save Image
		</button>
		<button
			type="button"
			class="mb-3 tw-button py-1 px-3 ml-1"
			@click="ExportChartsAndOptions()"
		>
			Export Charts
		</button>
		<input
			ref="filePicker"
			type="file"
			accept=".json"
			class="mb-3 ml-1 tw-button py-1 px-3 tw-sidebar-width"
			@change="importFromJson"
		/>
		<Options v-if="showOptions" />
		<Search />
	</div>
</template>
