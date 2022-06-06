<script setup lang="ts">
import Search from './SidebarComponents/Search.vue'
import Selection from './SidebarComponents/Selection.vue'
import Options from './SidebarComponents/Options.vue'
import { ref } from 'vue'
import { version } from '../../package.json'

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
		<!-- This will be removed post beta -->
		<div class="mt-1">Site Beta - {{ version }}</div>

		<div class="flex mt-1 mb-1 gap-1 justify-center">
			<a
				class="tw-button py-1"
				href="https://discord.gg/526et4zxBT"
				target="_blank"
			>
				Discord
			</a>
			<a
				class="tw-button py-1"
				href="https://github.com/buffet-time/MusicChartMaker.com"
				target="_blank"
			>
				GitHub
			</a>
		</div>
		<Selection @can-render-chart="onCanRender" />
		<Options v-if="showOptions" />
		<Search />
	</div>
</template>
