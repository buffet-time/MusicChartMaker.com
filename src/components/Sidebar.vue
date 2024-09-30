<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'

import Search from './SidebarComponents/Search.vue'
import ChartOptions from './SidebarComponents/ChartOptions.vue'
import SiteOptions from './SidebarComponents/SiteOptions.vue'
import Selection from './SidebarComponents/Selection.vue'
import SiteInfo from './SidebarComponents/SiteInfo.vue'
import SaveImage from './SidebarComponents/SaveImage.vue'
import Export from './SidebarComponents/Export.vue'

const emit = defineEmits<{
	canRenderChart: []
}>()

const showOptions = ref(false)
const sidebarMenu = useTemplateRef<HTMLDivElement>('sidebarMenu')
const hamburgerMenu = useTemplateRef<HTMLImageElement>('hamburgerMenu')
const nonSearchSideBarItems = useTemplateRef<HTMLDivElement>(
	'nonSearchSideBarItems',
)
const searchHeight = ref<string | number>()

const resizeObserver = new ResizeObserver(() => getSearchHeight())
resizeObserver.observe(document.body)

function onCanRender() {
	emit('canRenderChart')
	showOptions.value = true
}

function toggleMenu() {
	hamburgerMenu.value?.classList.toggle('hidden')
	sidebarMenu.value?.classList.toggle('hidden')
	sidebarMenu.value?.classList.toggle('flex')
}

function getSearchHeight() {
	searchHeight.value = nonSearchSideBarItems.value
		? // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
			(searchHeight.value = `${document.body.clientHeight - nonSearchSideBarItems.value.clientHeight}px`)
		: 0
}

onMounted(() => {
	// wait for synchronous call stack is empty to ensure we get valid search height
	setTimeout(() => {
		getSearchHeight()
	}, 0)
})
</script>

<template>
	<img
		ref="hamburgerMenu"
		alt="hamburger-menu"
		height="25"
		width="25"
		src="/hamburgerMenu.svg"
		class="md:hidden uno-button fixed ml-2 mt-2 p-1"
		loading="lazy"
		@click="toggleMenu"
	/>

	<div
		ref="sidebarMenu"
		class="fixed flex-col z-10 hidden uno-sidebar-width h-full bg-[#404040] md:flex"
	>
		<img
			src="/blackClose.svg"
			alt="close-button"
			loading="lazy"
			height="25"
			width="25"
			class="uno-button fixed ml-2 p-1 mt-2 md:hidden"
			@click="toggleMenu"
		/>

		<div ref="nonSearchSideBarItems" class="flex-col flex gap-3 pt-2">
			<SiteInfo />

			<div class="mt-[-4px]">
				<Selection @can-render-chart="onCanRender" />
			</div>

			<SaveImage />

			<Export />

			<ChartOptions v-if="showOptions" />

			<SiteOptions v-if="showOptions" />
		</div>

		<div class="hidden md:block" :style="{ 'max-height': searchHeight }">
			<Search />
		</div>
	</div>
</template>
