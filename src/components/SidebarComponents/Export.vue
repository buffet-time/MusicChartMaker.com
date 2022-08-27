<script setup lang="ts">
import {
	GlobalChartState,
	GlobalSiteOptions,
	StoredChartNames
} from '#root/src/shared'
import {
	getAllSavedKeys,
	getFirstChart,
	GetSiteOptions,
	getStoredChart,
	setCurrentChart,
	setStoredChart
} from '#root/src/storage'
import { type ChartState, type SiteOptions } from '#root/src/types/types'
import { ref } from 'vue'

const filePicker = ref<HTMLInputElement>()

function ExportChartsAndOptions() {
	try {
		// Node does not work here, have to use WebAPI
		const exportdata = {
			chartData: getAllSavedKeys().map((cName) => getStoredChart(cName)),
			siteData: GetSiteOptions()
		}
		const a = document.createElement('a')
		const file = new Blob([JSON.stringify(exportdata)], { type: 'text/plain' })
		a.href = URL.createObjectURL(file)
		a.download = 'exported_charts.json'
		a.click()
	} catch (error) {
		console.error('Error attempting to export chart data!', error)
	}
}

function ImportChartsAndOptions(importFile: File | null) {
	try {
		if (!importFile) {
			throw new Error('No File Submitted')
		}

		const reader = new FileReader()

		reader.onerror = (errorEvt) => {
			throw errorEvt.target?.error
		}

		reader.onload = (fileEvent) => {
			console.log(fileEvent)
			// Add logic here to check filename and see if it is a JSON file.
			try {
				const parsed = JSON.parse(String(fileEvent.target?.result))
				// Add a typecheck here, assert if it has the siteData and chartData properties
				if (parsed) {
					const options: SiteOptions = parsed.siteData
					GlobalSiteOptions.value = options
					setCurrentChart(options.currentChart)
					const data: ChartState[] = parsed.chartData
					data.forEach((state) => {
						// TODO: re read this
						!!state && setStoredChart(state.options.chartTitle, state)
					})
					const chart = getStoredChart(options.currentChart) || getFirstChart()
					if (chart) {
						GlobalChartState.value = chart
					}
					StoredChartNames.value = getAllSavedKeys()
				} else {
					throw new Error('Unsupported File/Unexpected Contents')
				}
			} catch (error) {
				console.error('Failed to import selected file => Error:', error)
			}
		}

		reader.readAsText(importFile, 'UTF-8')
	} catch (error) {
		console.error('Failed to import selected file => Error:', error)
	}
}

function importFromJson() {
	if (!filePicker.value) {
		return console.error('Error! Could not import file.')
	}

	if (filePicker.value.files) {
		ImportChartsAndOptions(filePicker.value.files.item(0))
	}
}
</script>

<template>
	<div class="flex flex-col justify-center items-center px-2">
		<button
			type="button"
			class="mb-3 tw-button py-1 px-3"
			@click="ExportChartsAndOptions()"
		>
			Export Charts
		</button>
		<input
			ref="filePicker"
			type="file"
			accept=".json"
			class="mb-3 tw-button py-1 px-3 tw-sidebar-width"
			@change="importFromJson"
		/>
	</div>
</template>
