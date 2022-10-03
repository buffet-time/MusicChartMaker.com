<script setup lang="ts">
import { ref } from 'vue'

import Search from './SidebarComponents/Search.vue'
import Options from './SidebarComponents/Options.vue'
import Selection from './SidebarComponents/Selection.vue'
import SiteInfo from './SidebarComponents/SiteInfo.vue'
import SaveImage from './SidebarComponents/SaveImage.vue'
import Export from './SidebarComponents/Export.vue'

import HamburgerMenu from '#assets/hamburgerMenu.svg'
import BlackClose from '#assets/blackClose.svg'

const emit = defineEmits<{
	(event: 'canRenderChart'): void
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
		title="Menu"
		:src="HamburgerMenu"
		class="tw-button fixed h-6 p-1 mt-2 ml-2 md:hidden"
		@click="showMenu()"
	/>

	<div
		ref="sidebarMenu"
		class="flex flex-col gap-3 tw-sidebar-width bg-[#404040] min-w-[230px] h-full hidden fixed pt-2 md:flex"
	>
		<img
			title="Close Menu"
			:src="BlackClose"
			class="tw-button fixed ml-2 h-7 p-0 md:hidden"
			@click="hideMenu()"
		/>

		<SiteInfo />

		<div class="mt-[-4px]">
			<Selection @can-render-chart="onCanRender" />
		</div>

		<Export />

		<SaveImage />

		<Options v-if="showOptions" />

		<div class="hidden md:block">
			<Search />
		</div>
	</div>
</template>
