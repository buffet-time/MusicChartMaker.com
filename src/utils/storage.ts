import type { SiteOptions, ChartState } from '#types'
import { GlobalSiteOptions } from '#utils/globals'

export const SiteOptionsKey = 'GlobalSiteOptions'

const localStorageIgnore = [
	SiteOptionsKey,
	'__vue-devtools-frame-state__',
	'__vue-devtools-theme__',
	'vueuse-color-scheme',
	'session',
]

function hasLocalStorageIgnore(providedKey: string) {
	return localStorageIgnore.some((currentKey) => providedKey === currentKey)
}

export function getAllSavedKeys(): string[] {
	// Needs to be more strictly filtered. Maybe some kind of key for the App submitted entries.
	return Object.keys(localStorage).filter(
		(currentKey) => !hasLocalStorageIgnore(currentKey),
	)
}

// used to get the first available chart to be the new used chart when deleting a previous chart
export function getFirstChart(): ChartState | undefined {
	const localStorageKeys = Object.keys(localStorage)

	if (localStorageKeys.length >= 2) {
		return getStoredChart(
			localStorageKeys.filter((key) => !hasLocalStorageIgnore(key))[0],
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
			currentChart: chartTitle,
		} as SiteOptions),
	)
}

export function getStoredChart(key: string): ChartState | undefined {
	if (hasLocalStorageIgnore(key)) {
		console.error("Can't get specified chart, it's in the ignore list.")
	}
	const item = localStorage.getItem(key)
	return item ? (JSON.parse(item) as ChartState) : undefined
}

export function setStoredChart(key: string, value: ChartState): void {
	if (value?.chartTiles == null) {
		console.error(
			'Error: attempted to store a chart of undefined or null value',
		)
		return
	}
	if (hasLocalStorageIgnore(key)) {
		console.error("Can't use specified value as the name for your chart.")
		return
	}

	localStorage.setItem(key, JSON.stringify(value))
}

export function deleteStoredChart(key: string): void {
	if (hasLocalStorageIgnore(key)) {
		console.error("Can't delete specified key as it is not a chart.")
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
