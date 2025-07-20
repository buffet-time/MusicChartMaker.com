import { getAllSavedKeys, GetSiteOptions, getStoredChart } from '#utils/storage'
import type { FileStructure } from './types'

function exportDataToFile({
	exportName,
	exportData,
}: {
	exportName: string
	exportData: FileStructure
}) {
	try {
		const anchor = document.createElement('a')
		const file = new Blob([JSON.stringify(exportData)], {
			type: 'text/plain',
		})
		anchor.href = URL.createObjectURL(file)
		anchor.download = `${exportName}.json`
		anchor.click()
		anchor.remove()
	} catch (error) {
		console.error('Error attempting to export chart data!', error)
	}
}

export function ExportEverything() {
	exportDataToFile({
		exportName: 'Everything',
		exportData: {
			exportType: 'Everything',
			chartData: getAllSavedKeys()
				.map((cName) => getStoredChart(cName))
				.filter((item) => item !== undefined),
			siteData: GetSiteOptions(),
		},
	})
}

export function ExportAllCharts() {
	exportDataToFile({
		exportName: 'All Charts',
		exportData: {
			exportType: 'All Charts',
			chartData: getAllSavedKeys()
				.map((cName) => getStoredChart(cName))
				.filter((item) => item !== undefined),
		},
	})
}

export function ExportSiteConfig() {
	exportDataToFile({
		exportName: 'Site Config',
		exportData: {
			exportType: 'Site Config',
			siteData: GetSiteOptions(),
		},
	})
}

export function ExportSingleChart(chartName: string) {
	exportDataToFile({
		exportName: chartName,
		exportData: {
			exportType: 'Single Chart',
			chartData: [getStoredChart(chartName)!],
		},
	})
}
