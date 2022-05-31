import { GenerateDefaultSiteOptions, GlobalSiteOptions } from './shared'
import { type SiteOptions, type ChartState } from './types'

// // // //
// Other
// // // //
export function getAllSavedKeys(): string[] {
	// Needs to be more strictly filtered. Maybe some kind of key for the App submitted entries.
	return Object.keys(localStorage).filter(
		(current) => current !== 'GlobalSiteOptions'
	)
}

// used to get the first available chart to be the new used chart when deleting a previous chart
export function getFirstChart(): ChartState | undefined {
	const localStorageKeys = Object.keys(localStorage)

	if (localStorageKeys.length >= 2) {
		return getStoredChart(
			localStorageKeys.filter((key) => key !== 'GlobalSiteOptions')[0]
		)
	}

	return undefined
}

// // // // // // // // // //
// Handling Current Chart
// // // // // // // // // //
export function getCurrentChart(): string | null {
	const item = localStorage.getItem('GlobalSiteOptions')
	return item ? (JSON.parse(item) as SiteOptions).currentChart : null
}

export function setCurrentChart(chartTitle: string): void {
	// TODO: handle errors
	localStorage.setItem(
		'GlobalSiteOptions',
		JSON.stringify({
			...GlobalSiteOptions.value,
			currentChart: chartTitle
		} as SiteOptions)
	)
}

// // // // // // // // //
// Handling ChartStates
// // // // // // // // //
export function getStoredChart(key: string): ChartState | undefined {
	const item = localStorage.getItem(key)
	// console.log(`getStoredChart => retrieved ${item} from storage`)
	return item ? (JSON.parse(item) as ChartState) : undefined
}

// TODO: disallow setting chart names to CurrentChart and GlobalSiteOptions
export function setStoredChart(input: string, value: ChartState): void {
	// TODO - Need more Error handling
	if (!value || value.chartTiles == null) {
		console.error(
			'Error: attempted to store a chart of undefined or null value'
		)
	} else {
		localStorage.setItem(input, JSON.stringify(value))
		// console.log(
		// 	`setStoredChart => Under name ${input}, stored chart state ${value}`
		// )
	}
}

export function deleteStoredChart(key: string): void {
	localStorage.removeItem(key)
	// console.log(`removed chart labeled ${input}`)
}

// // // // // // // // //
// Site Options storage
// // // // // // // // //
const SiteOptionsKey = 'GlobalSiteOptions'

export function SaveSiteOptions() {
	localStorage.setItem(SiteOptionsKey, JSON.stringify(GlobalSiteOptions.value))
}

export function GetSiteOptions() {
	const item = localStorage.getItem(SiteOptionsKey)
	if (item) {
		return JSON.parse(item) as SiteOptions
	} else {
		GlobalSiteOptions.value = GenerateDefaultSiteOptions()
		SaveSiteOptions()
		return GlobalSiteOptions.value
	}
}
