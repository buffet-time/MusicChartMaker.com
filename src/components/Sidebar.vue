<script setup lang="ts">
import Search from './SidebarComponents/Search.vue'
import Options from './SidebarComponents/Options.vue'
import Selection from './SidebarComponents/Selection.vue'
import SiteInfo from './SidebarComponents/SiteInfo.vue'
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
	<div
		class="flex flex-col gap-3 tw-sidebar-width fixed bg-[#303030] h-full mt-2"
	>
		<SiteInfo />

		<div class="mt-[-4px]">
			<Selection @can-render-chart="onCanRender" />
		</div>

		<Export />

		<SaveImage />

		<Options v-if="showOptions" />

		<Search />
	</div>
</template>
