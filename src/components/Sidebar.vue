<script setup lang="ts">
import Search from './SidebarComponents/Search.vue'
import Selection from './SidebarComponents/Selection.vue'
import Options from './SidebarComponents/Options.vue'
import { ref } from 'vue'

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
	<div class="flex-col">
		<Selection @can-render-chart="onCanRender" />
		<Options v-if="showOptions" />
		<Search />
	</div>
</template>
