<script setup lang="ts">
import { ref } from 'vue'
import {
	ImportChartsAndOptions,
	importFromTopsters2,
	ExportChartsAndOptions
} from '#shared/importExport'

const filePicker = ref<HTMLInputElement>()
const showImportExport = ref(false)

function importMCM() {
	if (!filePicker.value) {
		// better handler here
		return console.error('Error! Could not import file.')
	}

	if (filePicker.value.files) {
		ImportChartsAndOptions(filePicker.value.files.item(0))
		filePicker.value.value = ''
	} else {
		// handle the error path here!
	}
}
</script>

<template>
	<!-- Put all these into a new section -->

	<!-- in the sidebar -->
	<div class="tw-flex-center gap-2">
		<button
			type="button"
			class="tw-button flex items-center gap-2"
			@click="showImportExport = true"
		>
			<img
				title="Open in window icon"
				alt="open in window icon"
				src="/openInWindow.svg"
				width="25"
				height="25"
				class="cursor-pointer bg-neutral-500"
				loading="lazy"
			/>
			<label class="cursor-pointer pb-[2px]"> Import/ Export </label>
		</button>
	</div>

	<div v-if="showImportExport" class="t tw-options-overlay-div gap-[6px] px-2">
		<img
			title="Close Options"
			alt="close-button"
			src="/back.svg"
			width="25"
			height="25"
			class="absolute left-0 m-[6px] mt-[6px] cursor-pointer bg-neutral-500"
			loading="lazy"
			@click="showImportExport = false"
		/>

		<button
			type="button"
			class="tw-button mt-12"
			@click="ExportChartsAndOptions"
		>
			Export Charts & Options
		</button>

		<label for="file-picker" class="tw-button">
			Import Charts
			<input
				id="file-picker"
				ref="filePicker"
				type="file"
				accept=".json"
				class="hidden"
				@input="importMCM"
			/>
		</label>

		<label for="topsters2-file-picker" class="tw-button">
			Import Topster2 Chart
			<input
				id="topsters2-file-picker"
				ref="topsters2-filePicker"
				type="file"
				accept=".json"
				class="hidden"
				@input="importFromTopsters2"
			/>
		</label>
	</div>
</template>
