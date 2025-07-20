<script setup lang="ts">
import { ref } from 'vue'
import BackButton from '#core/BackButton.vue'
import SidebarButton from '#core/SidebarButton.vue'
import MusicChartMaker from './ExportComponents/MusicChartMaker.vue'
import Topsters2 from './ExportComponents/Topsters2.vue'

const showImportExport = ref(false)
const sectionName = 'Import/ Export'
</script>

<template>
	<!-- in the sidebar -->
	<div class="uno-flex-center gap-2">
		<SidebarButton
			:button-icon="'OpenInWindow'"
			:button-text="sectionName"
			@click-handler="showImportExport = true"
		/>
	</div>

	<div
		v-if="showImportExport"
		class="uno-sidebar-width uno-options-overlay-div p-0"
	>
		<div class="px-2 flex flex-col gap-[6px]">
			<div class="flex flex-row mt-2 items-center">
				<BackButton
					:origin="'Overlay'"
					@click-handler="showImportExport = false"
				/>
				<p class="ml-4 text-size-xl">{{ sectionName }}</p>
			</div>

			<MusicChartMaker />

			<Topsters2 />

			<section class="my-2 flex flex-col gap-2">
				<h1 class="text-xl m-0">From Topsters 3</h1>

				<p class="m-0">Will be added in a future release!</p>
				<!-- <label for="topsters2-file-picker" class="uno-button block">
				Import a Chart
				<input
					id="topsters2-file-picker"
					ref="topsters2-filePicker"
					type="file"
					accept=".json"
					class="hidden"
					@input="importFromTopsters2"
				/>
			</label> -->
			</section>

			<section class="my-2 flex flex-col gap-2 m-0">
				<h1 class="text-xl m-0">From Chartr or Topchart</h1>

				<p class="m-0">Will be added in a future release!</p>
				<!-- <label for="topsters2-file-picker" class="uno-button block">
				Import a Chart
				<input
					id="topsters2-file-picker"
					ref="topsters2-filePicker"
					type="file"
					accept=".json"
					class="hidden"
					@input="importFromTopsters2"
				/>
			</label> -->
			</section>
		</div>
	</div>
</template>
