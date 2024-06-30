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
	<div class="uno-flex-center gap-2">
		<button
			type="button"
			class="uno-button flex w-10/12 items-center gap-2"
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

	<div
		v-if="showImportExport"
		class="uno-options-overlay-div uno-sidebar-width p-0"
	>
		<div class="px-2 flex flex-col gap-[6px]">
			<img
				title="Go back"
				alt="go-back"
				src="/back.svg"
				width="25"
				height="25"
				class="absolute left-0 m-[6px] mt-[6px] cursor-pointer bg-neutral-500"
				loading="lazy"
				@click="showImportExport = false"
			/>

			<p class="mt-12 mb-0">Bug fixes and more features to come here soon!</p>

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
