<script setup lang="ts">
import { useTemplateRef, ref, computed } from 'vue'
import { singleChartSelectedChartTitle, StoredChartNames } from '#utils/globals'
import SelectChartDropdown from '#core/SelectChartDropdown.vue'
import { ImportFile } from '#utils/importExport/import'
import {
	ExportEverything,
	ExportAllCharts,
	ExportSiteConfig,
	ExportSingleChart,
} from '#utils/importExport/export'
import { ImportExportTypes } from '#utils/importExport/types'

const importExportTypes: ImportExportTypes[] = [
	'Everything',
	'All Charts',
	'Site Config',
	'Single Chart',
]
const exportTypeSelectLabel = 'selectExportType'
const chartSelectLabel = 'singleChartSelect'

const filePicker = useTemplateRef<HTMLInputElement>('filePicker')
const selectedImportExportType = ref<ImportExportTypes>('Everything')

const singleChartSelectArray = computed(() => {
	return StoredChartNames.value.slice()
})

function onExportPressed() {
	switch (selectedImportExportType.value) {
		case 'Everything':
			ExportEverything()
			break
		case 'All Charts':
			ExportAllCharts()
			break
		case 'Site Config':
			ExportSiteConfig()
			break
		case 'Single Chart':
			console.log(singleChartSelectedChartTitle.value)
			ExportSingleChart(singleChartSelectedChartTitle.value)
			break
	}
}

function onImportPressed() {
	if (!filePicker.value) {
		console.error('Error! Could not import file.')
		return
	}

	if (!filePicker.value.files) {
		console.error(`Error trying to import MusicChartMaker, ${filePicker.value}`)
		return
	}

	ImportFile(filePicker.value.files.item(0))
	filePicker.value.value = ''

	//
	// TODO READ THIS
	// DO SOMETHING TO INDICATE SUCCESS!!
}
</script>

<template>
	<section class="flex flex-col gap-2 my-2">
		<h1 class="text-xl m-0">From this site</h1>

		<div>
			<div class="flex flex-row justify-center mb-2 gap-1">
				<label for="file-picker" class="uno-button block mb-[0.5px] w-full">
					Import
					<input
						id="file-picker"
						ref="filePicker"
						type="file"
						accept=".json"
						class="hidden"
						@input="onImportPressed"
					/>
				</label>
			</div>
			<div class="uno-flex-center flex-col">
				<label :for="exportTypeSelectLabel" class="mb-1"
					>Select Export Type:
				</label>
				<select
					v-model="selectedImportExportType"
					class="uno-input global-select uno-select pl-1"
					:name="exportTypeSelectLabel"
					:id="exportTypeSelectLabel"
				>
					<option v-for="(name, index) in importExportTypes" :key="index">
						{{ name }}
					</option>
				</select>

				<div
					class="uno-flex-center flex-col"
					v-if="selectedImportExportType === 'Single Chart'"
				>
					<label :for="chartSelectLabel" class="mt-1 mb-1"
						>Select Chart:
					</label>
					<SelectChartDropdown
						:initiator="'MusicChartMakerExport'"
						:chart-select-label="chartSelectLabel"
						:chart-names-array="singleChartSelectArray"
					/>
				</div>

				<button
					type="button"
					class="uno-button w-full font-size-[14px] mt-2"
					@click="onExportPressed"
				>
					Export
				</button>
			</div>
		</div>
	</section>
</template>
