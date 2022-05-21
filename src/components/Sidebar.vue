<script setup lang="ts">
import Search from './SidebarComponents/Search.vue'
import Selection from './SidebarComponents/Selection.vue'
import Options from './SidebarComponents/Options.vue'

const emit = defineEmits<{
	(event: 'canRenderChart'): void
}>()
</script>

<template>
	<div class="flex-col">
		<Selection @can-render-chart="emit('canRenderChart')" />
		<Options />
		<Search />
	</div>
</template>
