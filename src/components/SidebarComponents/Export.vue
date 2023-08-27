<script setup lang="ts">
import { ref } from 'vue'
import type { ChartState, SiteOptions } from '#types'
import {
	GlobalChartState,
	GlobalSiteOptions,
	StoredChartNames
} from '#shared/globals'
import {
	getAllSavedKeys,
	getFirstChart,
	GetSiteOptions,
	getStoredChart,
	setCurrentChart,
	setStoredChart
} from '#shared/storage'

const filePicker = ref<HTMLInputElement>()

function ExportChartsAndOptions() {
	try {
		// Node does not work here, have to use WebAPI
		const exportdata = {
			chartData: getAllSavedKeys().map((cName) => getStoredChart(cName)),
			siteData: GetSiteOptions()
		}
		const anchor = document.createElement('a')
		const file = new Blob([JSON.stringify(exportdata)], { type: 'text/plain' })
		anchor.href = URL.createObjectURL(file)
		anchor.download = 'exported_charts.json'
		anchor.click()
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
			// console.log(fileEvent)
			// Add logic here to check filename and see if it is a JSON file.
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const parsed = JSON.parse(String(fileEvent.target?.result))
				// Add a typecheck here, assert if it has the siteData and chartData properties
				if (parsed) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
					const options: SiteOptions = parsed.siteData

					GlobalSiteOptions.value = options
					setCurrentChart(options.currentChart)
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
					const data: ChartState[] = parsed.chartData
					data.forEach((state) => {
						!!state && setStoredChart(state.options.chartTitle, state)
					})
					const chart = getStoredChart(options.currentChart) ?? getFirstChart()
					if (chart) {
						GlobalChartState.value = chart
					}
					StoredChartNames.value = getAllSavedKeys()
					return
				}

				throw new Error('Unsupported File/Unexpected Contents')
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
		filePicker.value.value = ''
	}
}
</script>

<template>
	<div class="tw-flex-center flex-col gap-[6px] px-2">
		<button type="button" class="tw-button" @click="ExportChartsAndOptions()">
			Export Charts
		</button>

		<label for="file-picker" class="tw-button">
			Import Charts
			<input
				id="file-picker"
				ref="filePicker"
				type="file"
				accept=".json"
				class="hidden"
				@input="importFromJson"
			/>
		</label>
	</div>
</template>
