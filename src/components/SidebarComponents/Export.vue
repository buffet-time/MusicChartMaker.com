<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import {
	ImportChartsAndOptions,
	importFromTopsters2,
	ExportChartsAndOptions,
} from '#utils/importExport'
import BackButton from '#core/BackButton.vue'
import SidebarButton from '#core/SidebarButton.vue'

const filePicker = useTemplateRef<HTMLInputElement>('filePicker')
const showImportExport = ref(false)
const sectionName = 'Import/ Export'

function importMCM() {
	if (!filePicker.value) {
		return console.error('Error! Could not import file.')
	}

	if (filePicker.value.files) {
		ImportChartsAndOptions(filePicker.value.files.item(0))
		filePicker.value.value = ''
	} else {
		console.error(`Error trying to import MusicChartMaker, ${filePicker.value}`)
	}
}
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

			<p class="mt-3 mb-0">Bug fixes and more features to come here soon!</p>

			<section class="flex flex-col gap-2 my-2">
				<h1 class="text-xl m-0">From this site</h1>

				<button
					type="button"
					class="uno-button"
					@click="ExportChartsAndOptions"
				>
					Export all charts & options
				</button>

				<label for="file-picker" class="uno-button block">
					Import all charts & options
					<input
						id="file-picker"
						ref="filePicker"
						type="file"
						accept=".json"
						class="hidden"
						@input="importMCM"
					/>
				</label>

				<p class="m-0">Importing/ Exporting single charts and options soon!</p>
			</section>

			<section class="my-2 flex flex-col gap-2">
				<h1 class="text-xl m-0">From Topsters 2</h1>
				<label for="topsters2-file-picker" class="uno-button block">
					Import a Chart
					<input
						id="topsters2-file-picker"
						ref="topsters2-filePicker"
						type="file"
						accept=".json"
						class="hidden"
						@input="importFromTopsters2"
					/>
				</label>
				<p class="m-0">
					If you encounter an issue please report it on GitHub! (check site
					info)
				</p>
			</section>

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
