import { GlobalSiteOptions, StoredChartNames } from '#utils/globals'
import type { ChartState, SiteOptions } from '#types'

import { getAllSavedKeys, setStoredChart } from '#utils/storage'
import type { FileStructure, ImportExportTypes } from './types'

export function ImportFile(importFile: File | null) {
	if (!importFile) {
		throw new Error('No File Submitted')
	}

	const reader = new FileReader()

	// oxlint-disable-next-line unicorn/prefer-add-event-listener
	reader.onerror = (errorEvt) => {
		throw errorEvt.target?.error
	}

	// oxlint-disable-next-line unicorn/prefer-add-event-listener
	reader.onload = (fileEvent) => {
		if (importFile.type !== 'application/json') {
			console.error(
				'Failed to import selected file => Error: file is not of type JSON',
			)
			throw new Error()
		}

		const parsed = JSON.parse(String(fileEvent.target?.result)) as FileStructure

		if (parsed) {
			const exportType: ImportExportTypes = parsed.exportType
				? parsed.exportType
				: 'Everything'

			if (exportType === 'Everything' || exportType === 'Site Config') {
				// oxlint-disable-next-line typescript/no-non-null-assertion
				const options: SiteOptions = parsed.siteData!

				GlobalSiteOptions.value = options
			}

			if (exportType !== 'Site Config') {
				// oxlint-disable-next-line typescript/no-non-null-assertion
				const data: ChartState[] = parsed.chartData!
				data.forEach((state) => setStoredChart(state.options.chartTitle, state))

				StoredChartNames.value = getAllSavedKeys()
			}

			return
		}

		throw new Error(
			`Unsupported File/Unexpected Contents, ${importFile} ${fileEvent}`,
		)
	}

	reader.readAsText(importFile, 'UTF-8')
}
