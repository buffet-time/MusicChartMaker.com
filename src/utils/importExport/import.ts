import { GlobalSiteOptions, StoredChartNames } from '#utils/globals'
import type { ChartState, SiteOptions } from '#types'

import { getAllSavedKeys, setStoredChart } from '#utils/storage'
import type { FileStructure, ImportExportTypes } from './types'

export function ImportFile(importFile: File | null) {
	try {
		if (!importFile) {
			throw new Error('No File Submitted')
		}

		const reader = new FileReader()

		reader.onerror = (errorEvt) => {
			throw errorEvt.target?.error
		}

		reader.onload = (fileEvent) => {
			if (importFile.type !== 'application/json') {
				console.error(
					'Failed to import selected file => Error: file is not of type JSON',
				)
				return
			}

			try {
				const parsed = JSON.parse(
					String(fileEvent.target?.result),
				) as FileStructure

				if (parsed) {
					const exportType: ImportExportTypes = parsed.exportType
						? parsed.exportType
						: 'Everything'

					if (exportType === 'Everything' || exportType === 'Site Config') {
						const options: SiteOptions = parsed.siteData!

						GlobalSiteOptions.value = options
					}

					if (exportType !== 'Site Config') {
						const data: ChartState[] = parsed.chartData!
						data.forEach((state) => {
							Boolean(state) && setStoredChart(state.options.chartTitle, state)
						})

						StoredChartNames.value = getAllSavedKeys()
					}

					return
				}

				throw new Error('Unsupported File/Unexpected Contents')
			} catch (error) {
				console.error('Failed to import selected file => ', error)
				console.log('Extra info on error: ', importFile, fileEvent)
			}
		}

		reader.readAsText(importFile, 'UTF-8')
	} catch (error) {
		console.error('Failed to import selected file => ', error)
		console.log('Extra info on error: ', importFile)
	}
}
