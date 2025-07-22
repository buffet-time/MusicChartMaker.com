<script setup lang="ts">
import { nextTick, onMounted, ref, useTemplateRef } from 'vue'

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
		? (searchHeight.value = `${document.body.clientHeight - nonSearchSideBarItems.value.clientHeight}px`)
		: 0
}

onMounted(async () => {
	await nextTick()

	getSearchHeight()
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

		<div ref="nonSearchSideBarItems" class="flex-col flex gap-3 pt-1">
			<Selection @can-render-chart="onCanRender" />

			<ChartOptions v-if="showOptions" />

			<SaveImage />

			<Export />

			<SiteOptions v-if="showOptions" />

			<SiteInfo />
		</div>

		<div
			class="hidden md:block md:mt-2"
			:style="{ 'max-height': searchHeight }"
		>
			<Search />
		</div>
	</div>
</template>
