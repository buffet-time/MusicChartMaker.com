<script setup lang="ts">
import Search from './SidebarComponents/Search.vue'
import Options from './SidebarComponents/Options.vue'
import Selection from './SidebarComponents/Selection.vue'
import SiteInfo from './SiteInfo.vue'
import { ref } from 'vue'
import { GlobalChartState } from '#src/shared'

const emit = defineEmits<{
	(event: 'canRenderChart'): void
}>()

const showOptions = ref(false)

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
		anchor.download = `${GlobalChartState.value?.options.chartTitle}.png`
		anchor.click()
	} catch (error) {
		console.error(`Error in Save Image: ${Error}`)
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
		<Options v-if="showOptions" />
		<Search />
	</div>
</template>
