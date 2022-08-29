<script setup lang="ts">
import Search from './SidebarComponents/Search.vue'
import Options from './SidebarComponents/Options.vue'
import Selection from './SidebarComponents/Selection.vue'
import SiteInfo from './SiteInfo.vue'
import SaveImage from './SidebarComponents/SaveImage.vue'
import { ref } from 'vue'
import Export from './SidebarComponents/Export.vue'

const emit = defineEmits<{
	(event: 'canRenderChart'): void
}>()

const showOptions = ref(false)

function onCanRender() {
	emit('canRenderChart')
	showOptions.value = true
}
</script>

<template>
	<div class="flex-col tw-sidebar-width fixed bg-[#303030] h-full">
		<SiteInfo />
		<Selection @can-render-chart="onCanRender" />
		<Export />
		<SaveImage />
		<Options v-if="showOptions" />
		<Search />
	</div>
</template>
