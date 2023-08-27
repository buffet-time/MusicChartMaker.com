import type { SiteOptions, ChartState } from '#types'
import { GlobalSiteOptions } from '#shared/globals'

export const SiteOptionsKey = 'GlobalSiteOptions'

export function getAllSavedKeys(): string[] {
	// Needs to be more strictly filtered. Maybe some kind of key for the App submitted entries.
	return Object.keys(localStorage).filter(
		(current) => current !== SiteOptionsKey
	)
}

// used to get the first available chart to be the new used chart when deleting a previous chart
export function getFirstChart(): ChartState | undefined {
	const localStorageKeys = Object.keys(localStorage)

	if (localStorageKeys.length >= 2) {
		return getStoredChart(
			localStorageKeys.filter((key) => key !== SiteOptionsKey)[0]
		)
	}

	return undefined
}

export function getCurrentChart(): string | null {
	const item = localStorage.getItem(SiteOptionsKey)
	return item ? (JSON.parse(item) as SiteOptions).currentChart : null
}

export function setCurrentChart(chartTitle: string): void {
	localStorage.setItem(
		SiteOptionsKey,
		JSON.stringify({
			...GlobalSiteOptions.value,
			currentChart: chartTitle
		} as SiteOptions)
	)
}

export function getStoredChart(key: string): ChartState | undefined {
	if (key === SiteOptionsKey) {
		console.error("Can't get GlobalSiteOptions as it is not a chart.")
	}
	const item = localStorage.getItem(key)
	return item ? (JSON.parse(item) as ChartState) : undefined
}

export function setStoredChart(key: string, value: ChartState): void {
	if (value?.chartTiles == null) {
		return console.error(
			'Error: attempted to store a chart of undefined or null value'
		)
	}
	if (key === SiteOptionsKey) {
		return console.error(
			"Can't use GlobalSiteOptions as the name for your chart."
		)
	}

	localStorage.setItem(key, JSON.stringify(value))
}

export function deleteStoredChart(key: string): void {
	if (key === SiteOptionsKey) {
		console.error("Can't delete GlobalSiteOptions as it is not a chart.")
	}
	localStorage.removeItem(key)
}

export function SaveSiteOptions() {
	localStorage.setItem(SiteOptionsKey, JSON.stringify(GlobalSiteOptions.value))
}

export function GetSiteOptions() {
	const item = localStorage.getItem(SiteOptionsKey)
	if (item) {
		return JSON.parse(item) as SiteOptions
	}

	return null
}
