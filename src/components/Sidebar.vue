<script setup lang="ts">
import { ref } from 'vue'

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
const sidebarMenu = ref<HTMLDivElement>()
const hamburgerMenu = ref<HTMLImageElement>()

function onCanRender() {
	emit('canRenderChart')
	showOptions.value = true
}

function showMenu() {
	hamburgerMenu.value?.classList.toggle('hidden')
	sidebarMenu.value?.classList.toggle('hidden')
}

function hideMenu() {
	hamburgerMenu.value?.classList.toggle('hidden')
	sidebarMenu.value?.classList.toggle('hidden')
}
</script>

<template>
	<img
		ref="hamburgerMenu"
		alt="hamburger-menu"
		height="25"
		width="25"
		src="/hamburgerMenu.svg"
		class="tw-button fixed ml-2 mt-2 p-1 md:hidden"
		loading="lazy"
		@click="showMenu()"
	/>

	<div
		ref="sidebarMenu"
		class="tw-sidebar-width fixed z-10 flex hidden h-full flex-col gap-3 bg-[#404040] pt-2 md:flex"
	>
		<img
			src="/blackClose.svg"
			alt="close-button"
			loading="lazy"
			height="25"
			width="25"
			class="tw-button fixed ml-2 p-0 md:hidden"
			@click="hideMenu()"
		/>

		<SiteInfo />

		<div class="mt-[-4px]">
			<Selection @can-render-chart="onCanRender" />
		</div>

		<Export />

		<SaveImage />

		<ChartOptions v-if="showOptions" />

		<SiteOptions v-if="showOptions" />

		<div class="hidden md:block">
			<Search />
		</div>
	</div>
</template>
